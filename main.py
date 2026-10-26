import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
from urllib.parse import parse_qs, urlparse

from graph_store import KnowledgeGraph


# Bind all interfaces so the service is reachable through a container port
# publish (local development can still use http://127.0.0.1:8000).
HOST = os.getenv("HOST", "0.0.0.0")
PORT = 8000


class AppHandler(SimpleHTTPRequestHandler):
    """Static file server plus the small role-aware graph API."""

    graph = KnowledgeGraph()

    def do_GET(self):  # noqa: N802 - stdlib handler API
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._json({"ok": True, "graphSource": self.graph.source})
            return
        if parsed.path == "/api/roles":
            self._json({"roles": self.graph.roles(), "source": self.graph.source})
            return
        if parsed.path == "/api/graph":
            role_id = parse_qs(parsed.query).get("role", ["ai-infra"])[0]
            profile = self.graph.role(role_id)
            if profile is None:
                self._json({"error": "unknown role", "roles": self.graph.roles()}, status=404)
            else:
                self._json(profile)
            return
        super().do_GET()

    def _json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(Path(__file__).parent)
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Skill Graph running at http://{HOST}:{PORT} (graph source: {AppHandler.graph.source})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
    finally:
        AppHandler.graph.close()
