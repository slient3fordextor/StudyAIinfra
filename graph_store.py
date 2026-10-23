"""Role-aware knowledge graph access.

The browser can run without Neo4j, so this module keeps a small, reviewable
fallback catalogue. When NEO4J_URI/NEO4J_USERNAME/NEO4J_PASSWORD are set and
the official driver is installed, the same API is backed by Neo4j instead.
"""

from __future__ import annotations

import os
from typing import Any


ROLE_PROFILES: dict[str, dict[str, Any]] = {
    "ai-infra": {
        "id": "ai-infra",
        "name": "AI Infra 工程师",
        "summary": "把训练、推理和平台基础设施做成可观测、可扩展的生产系统。",
        "color": "#d77ad6",
        "focusDomains": ["linux", "gpu", "pytorch", "distributed", "platform", "serving", "reliability"],
        "skills": [
            {"id": "linux", "relevance": 0.86, "confidence": 0.91, "evidence": "招聘职责与生产故障案例高度重合"},
            {"id": "gpu", "relevance": 0.98, "confidence": 0.94, "evidence": "训练与推理系统的硬件边界"},
            {"id": "distributed", "relevance": 0.97, "confidence": 0.93, "evidence": "多机多卡运行的必需能力"},
            {"id": "platform", "relevance": 0.94, "confidence": 0.92, "evidence": "集群调度、发布和资源治理"},
            {"id": "serving", "relevance": 0.95, "confidence": 0.91, "evidence": "模型 API、批处理与弹性伸缩"},
            {"id": "reliability", "relevance": 0.90, "confidence": 0.88, "evidence": "SLO、容量和故障恢复"},
            {"id": "network", "relevance": 0.82, "confidence": 0.90, "evidence": "服务发现、集合通信与流量路径"},
            {"id": "python", "relevance": 0.78, "confidence": 0.89, "evidence": "自动化、控制面和工具链"},
        ],
    },
    "ml-platform": {
        "id": "ml-platform",
        "name": "机器学习平台工程师",
        "summary": "连接数据、训练作业、模型制品和平台治理，让研究成果稳定交付。",
        "color": "#63c997",
        "focusDomains": ["python", "pytorch", "distributed", "platform", "serving", "reliability"],
        "skills": [
            {"id": "python", "relevance": 0.94, "confidence": 0.93, "evidence": "平台 SDK、作业编排与开发体验"},
            {"id": "pytorch", "relevance": 0.92, "confidence": 0.89, "evidence": "训练抽象与框架集成"},
            {"id": "platform", "relevance": 0.98, "confidence": 0.95, "evidence": "工作负载、存储与发布的核心职责"},
            {"id": "distributed", "relevance": 0.88, "confidence": 0.87, "evidence": "分布式训练和弹性作业"},
            {"id": "serving", "relevance": 0.84, "confidence": 0.85, "evidence": "模型制品到在线服务的交付链"},
            {"id": "reliability", "relevance": 0.82, "confidence": 0.86, "evidence": "平台 SLO 与任务可恢复性"},
            {"id": "git", "relevance": 0.80, "confidence": 0.90, "evidence": "配置、代码和模型制品的版本治理"},
        ],
    },
    "backend": {
        "id": "backend",
        "name": "后端工程师",
        "summary": "设计可靠的服务、数据访问和流量治理能力，支撑复杂业务系统。",
        "color": "#65b8df",
        "focusDomains": ["python", "network", "git", "serving", "platform", "reliability"],
        "skills": [
            {"id": "python", "relevance": 0.93, "confidence": 0.94, "evidence": "服务开发、测试和异步并发"},
            {"id": "network", "relevance": 0.96, "confidence": 0.95, "evidence": "协议、网关和排障是通用后端基础"},
            {"id": "serving", "relevance": 0.87, "confidence": 0.86, "evidence": "API、流量路由和发布模式可迁移"},
            {"id": "platform", "relevance": 0.78, "confidence": 0.83, "evidence": "容器化部署和服务发现"},
            {"id": "reliability", "relevance": 0.91, "confidence": 0.92, "evidence": "可观测性、SLO 和故障恢复"},
            {"id": "git", "relevance": 0.89, "confidence": 0.96, "evidence": "协作、评审和持续交付"},
            {"id": "linux", "relevance": 0.75, "confidence": 0.90, "evidence": "运行时、进程和资源诊断"},
        ],
    },
    "sre": {
        "id": "sre",
        "name": "SRE / 可靠性工程师",
        "summary": "用系统思维管理服务可靠性、容量、变更风险和恢复速度。",
        "color": "#a18be0",
        "focusDomains": ["linux", "network", "platform", "reliability", "git"],
        "skills": [
            {"id": "reliability", "relevance": 1.0, "confidence": 0.97, "evidence": "SLO、告警、容量和演练是职责核心"},
            {"id": "linux", "relevance": 0.94, "confidence": 0.95, "evidence": "系统诊断与资源隔离"},
            {"id": "network", "relevance": 0.93, "confidence": 0.94, "evidence": "端到端故障定位与流量治理"},
            {"id": "platform", "relevance": 0.90, "confidence": 0.91, "evidence": "工作负载、发布和配额"},
            {"id": "git", "relevance": 0.83, "confidence": 0.90, "evidence": "变更评审、CI 与安全恢复"},
            {"id": "python", "relevance": 0.70, "confidence": 0.82, "evidence": "自动化与诊断工具"},
        ],
    },
    "data-engineer": {
        "id": "data-engineer",
        "name": "数据工程师",
        "summary": "构建可复现、可观测的数据管道和计算平台，保障数据质量与交付。",
        "color": "#ecaa45",
        "focusDomains": ["python", "linux", "network", "platform", "reliability", "git"],
        "skills": [
            {"id": "python", "relevance": 0.96, "confidence": 0.94, "evidence": "数据管道、任务编排与测试"},
            {"id": "platform", "relevance": 0.91, "confidence": 0.89, "evidence": "容器、存储、调度和发布"},
            {"id": "reliability", "relevance": 0.88, "confidence": 0.88, "evidence": "数据新鲜度、任务 SLO 与告警"},
            {"id": "linux", "relevance": 0.76, "confidence": 0.86, "evidence": "批处理环境与资源诊断"},
            {"id": "network", "relevance": 0.75, "confidence": 0.85, "evidence": "数据服务、存储和跨节点通信"},
            {"id": "git", "relevance": 0.86, "confidence": 0.93, "evidence": "管道代码和配置的版本化"},
        ],
    },
}


class KnowledgeGraph:
    def __init__(self) -> None:
        self.driver = None
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USERNAME", "neo4j")
        password = os.getenv("NEO4J_PASSWORD")
        if uri and password:
            try:
                from neo4j import GraphDatabase  # type: ignore

                self.driver = GraphDatabase.driver(uri, auth=(user, password))
            except (ImportError, Exception):
                # The app remains useful when the optional driver is absent or
                # a local Neo4j instance is not running.
                self.driver = None

    @property
    def source(self) -> str:
        return "neo4j" if self.driver else "catalog"

    def roles(self) -> list[dict[str, Any]]:
        return [self._role_summary(profile) for profile in ROLE_PROFILES.values()]

    def role(self, role_id: str) -> dict[str, Any] | None:
        fallback = ROLE_PROFILES.get(role_id)
        if not fallback:
            return None
        if not self.driver:
            return {**fallback, "source": "catalog"}
        query = """
        MATCH (r:Role {id: $role_id})
        OPTIONAL MATCH (r)-[rel:REQUIRES]->(s:Skill)
        RETURN r.id AS id, r.name AS name, r.summary AS summary,
               r.color AS color, collect({id:s.id, relevance:rel.relevance,
               confidence:rel.confidence, evidence:rel.evidence}) AS skills
        """
        try:
            with self.driver.session() as session:
                record = session.run(query, role_id=role_id).single()
            if record:
                data = record.data()
                data["focusDomains"] = fallback["focusDomains"]
                data["skills"] = [skill for skill in data.get("skills", []) if skill.get("id")]
                data["source"] = "neo4j"
                return data
        except Exception:
            pass
        return {**fallback, "source": "catalog"}

    @staticmethod
    def _role_summary(profile: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": profile["id"],
            "name": profile["name"],
            "summary": profile["summary"],
            "color": profile["color"],
            "focusDomains": profile["focusDomains"],
            "skillCount": len(profile["skills"]),
        }

    def close(self) -> None:
        if self.driver:
            self.driver.close()
