#!/usr/bin/env bash
set -euo pipefail

# One-command local stack. Prefer a native Compose implementation, then use
# Podman directly (the default runtime in some Linux dev environments).
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"
export NEO4J_PASSWORD="${NEO4J_PASSWORD:-skillgraph-password}"
export NEO4J_IMAGE="${NEO4J_IMAGE:-docker.m.daocloud.io/library/neo4j:5.26-community}"

if docker compose version >/dev/null 2>&1; then
  exec docker compose up -d --build
fi

if command -v podman-compose >/dev/null 2>&1; then
  exec podman-compose up -d --build
fi

if command -v podman >/dev/null 2>&1; then
  NETWORK="skillgraph"
  VOLUME="skillgraph_neo4j_data"
  podman network exists "$NETWORK" || podman network create "$NETWORK" >/dev/null
  podman volume exists "$VOLUME" || podman volume create "$VOLUME" >/dev/null
  podman rm -f skillgraph-app skillgraph-neo4j >/dev/null 2>&1 || true

  podman run -d --name skillgraph-neo4j --network "$NETWORK" \
    -p 7474:7474 -p 7687:7687 \
    -e "NEO4J_AUTH=neo4j/$NEO4J_PASSWORD" \
    -e "NEO4J_PASSWORD=$NEO4J_PASSWORD" \
    -e NEO4J_server_memory_heap_initial__size=256m \
    -e NEO4J_server_memory_heap_max__size=512m \
    -v "$VOLUME:/data" -v "$ROOT_DIR/neo4j:/var/lib/neo4j/import:ro,Z" \
    "$NEO4J_IMAGE" >/dev/null

  echo "Waiting for Neo4j…"
  for attempt in $(seq 1 60); do
    if podman exec skillgraph-neo4j cypher-shell -u neo4j -p "$NEO4J_PASSWORD" 'RETURN 1' >/dev/null 2>&1; then
      break
    fi
    sleep 2
    if [ "$attempt" = 60 ]; then
      echo "Neo4j did not become ready" >&2
      exit 1
    fi
  done
  podman exec skillgraph-neo4j cypher-shell -u neo4j -p "$NEO4J_PASSWORD" -f /var/lib/neo4j/import/schema.cypher >/dev/null
  podman exec skillgraph-neo4j cypher-shell -u neo4j -p "$NEO4J_PASSWORD" -f /var/lib/neo4j/import/seed.cypher >/dev/null
  podman build --build-arg "PYTHON_IMAGE=${PYTHON_IMAGE:-docker.m.daocloud.io/library/python:3.12-slim}" -t skillgraph-app . >/dev/null
  podman run -d --name skillgraph-app --network "$NETWORK" -p 8000:8000 \
    -e NEO4J_URI=neo4j://skillgraph-neo4j:7687 -e NEO4J_USERNAME=neo4j \
    -e "NEO4J_PASSWORD=$NEO4J_PASSWORD" skillgraph-app >/dev/null
  echo "Skill Graph running at http://127.0.0.1:8000 (Neo4j-backed)"
  exit 0
fi

echo "Install Docker Compose or Podman to start the Neo4j-backed stack." >&2
exit 1
