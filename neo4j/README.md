# Neo4j graph setup

The UI uses `/api/graph?role=<id>`. Without a database it reads the catalogue in
`graph_store.py`; with Neo4j it switches automatically when these environment
variables are present and the Python driver is installed:

```bash
pip install neo4j
export NEO4J_URI=neo4j://localhost:7687
export NEO4J_USERNAME=neo4j
export NEO4J_PASSWORD='your-password'
```

Run `schema.cypher` and `seed.cypher` in Neo4j Browser. Extend the graph with
`(:Domain)-[:CONTAINS]->(:Skill)` and `(:Skill)-[:PREREQUISITE_OF]->(:Skill)`
relationships as the catalogue grows. `relevance` expresses how central a
skill is to a role; `confidence` expresses the strength of the evidence behind
that mapping. Keep them separate so a popular skill does not automatically look
well-supported.

For a local one-command setup, go back to the project root and run
`./start.sh`. It detects Docker Compose or Podman, starts Neo4j, waits for its
health check, applies both Cypher files, and starts the app with the correct
connection variables. The script defaults to
`docker.m.daocloud.io/library/neo4j:5.26-community` because Docker Hub may be
unreachable on some networks; override it with `NEO4J_IMAGE` when needed.
