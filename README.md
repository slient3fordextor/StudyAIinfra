# Skill Graph · 职业技能图谱

一个面向 AI Infra 和 AI 应用开发的交互式技能知识图谱。它把技能组织为“领域 → 模块 → 知识单元”，支持按职业查看重点能力、前置关系、证据状态和学习进度。

AI Infra 的完整学习路线见 [`docs/AI-INFRA-ROADMAP.md`](docs/AI-INFRA-ROADMAP.md)。路线覆盖 Python/C++/Linux、Transformer/PyTorch、CUDA/Triton、分布式训练、LLM 推理、Kubernetes、可观测性和生产可靠性。

## 功能

- 技能树和前置关系可视化。
- AI Infra、AI 应用开发两种核心职业视图，以及机器学习平台、后端、SRE、数据工程等辅助视图。
- 技能搜索、状态筛选、进度保存和任务提示。
- 有来源 / 需复核筛选，以及独立的待验证技能池。
- 无需 Neo4j 也能运行；配置 Neo4j 后可使用图数据库作为数据源。

## 开源协议

本项目使用 [MIT License](LICENSE)。欢迎提交 Issue、补充技能节点或改进路线内容。

这是一个技能书风格的交互式知识图谱。原有的三层学习路径仍然保留：

`领域 → 模块 → 知识单元`

新增的职业视图会把同一套计算机技能按职业重新组织。当前内置 AI Infra、AI 应用开发两种核心视图，以及机器学习平台、后端、SRE 和数据工程辅助视图。每个职业关系都保存两项分数：

- `relevance`：技能对该职业的匹配度。
- `confidence`：这条映射的证据可靠性。

这样可以表达“后端工程师也需要网络，但 GPU 只是 AI Infra 的核心能力”，也能避免把推荐热度直接当成事实依据。
技能领域还会保存 `evidence_status`、`evidence_basis` 和 `source_url`。`verified` 表示有一手资料和可复现实验，`review` 表示有资料但组合或版本影响较大；候选方向只进入待验证池，不直接进入主学习路径。职业映射分数仍是可审阅的初始假设，接入真实招聘文本、内部岗位能力模型或学习结果后，可以在 Neo4j 中按证据来源、时间和样本量重新计算 `confidence`。

## 运行

```bash
python main.py
```

浏览器打开 <http://127.0.0.1:8000>。即使没有 Neo4j，页面也会使用 `graph_store.py` 中的可审阅目录运行。

如果本机有 Docker Compose 或 Podman，直接运行下面这一条命令即可自动启动 Neo4j、初始化图谱并启动应用：

```bash
./start.sh
```

默认本地密码是 `skillgraph-password`。需要修改时运行
`NEO4J_PASSWORD='你的密码' ./start.sh`。

脚本默认使用当前网络可访问的 DaoCloud 镜像代理。如果你有公司镜像仓库，可以覆盖镜像：

```bash
NEO4J_IMAGE='registry.example.com/neo4j:5.26-community' \
PYTHON_IMAGE='registry.example.com/python:3.12-slim' ./start.sh
```

## 接入 Neo4j

详见 [`neo4j/README.md`](neo4j/README.md)。设置 `NEO4J_URI`、`NEO4J_USERNAME`、`NEO4J_PASSWORD` 并安装官方 Python 驱动后，接口会自动查询 Neo4j；连接不可用时仍会回退到目录。

接口：

- `GET /api/roles`：职业列表。
- `GET /api/graph?role=sre`：职业技能组、匹配度、可靠性和证据。
- `GET /api/health`：查看当前图谱来源是 `neo4j` 还是 `catalog`。
