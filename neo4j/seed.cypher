// Curated role and evidence seed. “verified” means the concept has a primary source
// and a reproducible check; it does not mean every role mapping is universal.
// Candidate topics stay in the UI verification pool until they have evidence.
UNWIND [
  {id:'ai-infra', name:'AI Infra 工程师', summary:'把训练、推理和平台基础设施做成可观测、可扩展的生产系统。', color:'#d77ad6', core:true},
  {id:'ai-app', name:'AI 应用开发', summary:'把模型能力变成可评测、可观测、可交付的产品功能。', color:'#f178a5', core:true},
  {id:'ml-platform', name:'机器学习平台工程师', summary:'连接数据、训练作业、模型制品和平台治理，让研究成果稳定交付。', color:'#63c997', core:false},
  {id:'backend', name:'后端工程师', summary:'设计可靠的服务、数据访问和流量治理能力，支撑复杂业务系统。', color:'#65b8df', core:false},
  {id:'sre', name:'SRE / 可靠性工程师', summary:'用系统思维管理服务可靠性、容量、变更风险和恢复速度。', color:'#a18be0', core:false},
  {id:'data-engineer', name:'数据工程师', summary:'构建可复现、可观测的数据管道和计算平台，保障数据质量与交付。', color:'#ecaa45', core:false}
] AS row
MERGE (r:Role {id:row.id})
SET r.name=row.name, r.summary=row.summary, r.color=row.color, r.core=row.core;

UNWIND [
  ['linux','Linux 系统','verified','Linux / POSIX 文档与可复现实验','https://man7.org/linux/man-pages/'],
  ['python','Python 工程','verified','Python 官方文档与可执行测试','https://docs.python.org/3/'],
  ['network','计算机网络','verified','RFC、协议规范与抓包实验','https://www.rfc-editor.org/'],
  ['git','Git 与协作','verified','Git 官方文档与版本库实验','https://git-scm.com/docs'],
  ['gpu','GPU 与 CUDA','verified','CUDA 官方文档与性能实验','https://docs.nvidia.com/cuda/'],
  ['pytorch','PyTorch 系统','verified','PyTorch 官方 API、教程与实验','https://pytorch.org/docs/stable/'],
  ['platform','容器与 Kubernetes','verified','Kubernetes 官方概念与任务文档','https://kubernetes.io/docs/'],
  ['distributed','分布式训练','verified','PyTorch Distributed 官方文档与多进程实验','https://pytorch.org/docs/stable/distributed.html'],
  ['serving','模型服务','review','推理引擎文档与容量压测；版本和硬件影响较大','https://docs.vllm.ai/'],
  ['reliability','可观测性与可靠性','verified','Prometheus、OpenTelemetry 与 SRE 运行实践','https://prometheus.io/docs/'],
  ['application','AI 应用工程','verified','Web/API 工程规范与可运行产品样例','https://platform.openai.com/docs/'],
  ['llm','模型与上下文','verified','模型 API、结构化输出与工具调用官方文档','https://platform.openai.com/docs/guides/function-calling'],
  ['rag','RAG 与知识工程','review','检索质量强依赖数据、领域和评测集，必须用项目数据验证','https://platform.openai.com/docs/guides/embeddings'],
  ['agents','Agent 系统','review','工具编排和记忆模式变化快，必须以轨迹评测和人工复核为准','https://platform.openai.com/docs/guides/agents'],
  ['evals','评测与质量','verified','评测集、回归门禁与线上反馈闭环','https://platform.openai.com/docs/guides/evals'],
  ['safety','安全与治理','review','风险边界和控制措施必须按产品、数据和法规场景验证','https://platform.openai.com/docs/guides/safety-best-practices']
] AS row
MERGE (s:Skill {id:row[0]})
SET s.name=row[1], s.evidence_status=row[2], s.evidence_basis=row[3], s.source_url=row[4];

UNWIND [
  ['ai-infra','linux',0.86,0.91,'系统文档、生产运行手册与故障实践'],
  ['ai-infra','gpu',0.98,0.94,'CUDA / GPU 文档与性能实验'],
  ['ai-infra','distributed',0.97,0.93,'PyTorch Distributed 文档与多机实验'],
  ['ai-infra','platform',0.94,0.92,'Kubernetes 官方工作负载与调度模型'],
  ['ai-infra','serving',0.95,0.86,'推理服务文档与容量压测，岗位边界仍需持续复核'],
  ['ai-infra','reliability',0.90,0.88,'Prometheus / SLO 实践与生产运行手册'],
  ['ai-infra','network',0.82,0.90,'RFC、服务发现与集合通信实践'],
  ['ai-infra','python',0.78,0.89,'Python 官方文档与基础设施工具实践'],

  ['ai-app','application',0.98,0.90,'应用架构、API 与状态管理是交付 AI 功能的共同边界'],
  ['ai-app','llm',0.98,0.88,'模型 API、结构化输出与工具调用官方文档'],
  ['ai-app','rag',0.93,0.82,'检索、引用和数据管线已有成熟实践，具体组合需按场景验证'],
  ['ai-app','agents',0.90,0.78,'工具调用与编排模式仍在快速演进，需以评测结果为准'],
  ['ai-app','evals',0.96,0.85,'离线数据集、回归评测与线上质量闭环'],
  ['ai-app','safety',0.94,0.83,'提示注入、隐私与审计控制需要按产品风险验证'],
  ['ai-app','serving',0.82,0.86,'模型 API、流式输出与容量控制'],
  ['ai-app','reliability',0.78,0.84,'可观测性、SLO 与故障降级'],

  ['ml-platform','python',0.94,0.93,'平台 SDK、作业编排与开发体验'],
  ['ml-platform','pytorch',0.92,0.89,'训练抽象与框架集成'],
  ['ml-platform','platform',0.98,0.95,'工作负载、存储与发布的核心职责'],
  ['ml-platform','distributed',0.88,0.87,'分布式训练和弹性作业'],
  ['ml-platform','serving',0.84,0.85,'模型制品到在线服务的交付链'],
  ['ml-platform','reliability',0.82,0.86,'平台 SLO 与任务可恢复性'],
  ['ml-platform','git',0.80,0.90,'配置、代码和模型制品的版本治理'],

  ['backend','python',0.93,0.94,'服务开发、测试和异步并发'],
  ['backend','network',0.96,0.95,'协议、网关和排障是通用后端基础'],
  ['backend','serving',0.87,0.86,'API、流量路由和发布模式可迁移'],
  ['backend','reliability',0.91,0.92,'可观测性、SLO 和故障恢复'],
  ['backend','git',0.89,0.96,'协作、评审和持续交付'],

  ['sre','reliability',1.0,0.97,'SLO、告警、容量和演练是职责核心'],
  ['sre','linux',0.94,0.95,'系统诊断与资源隔离'],
  ['sre','network',0.93,0.94,'端到端故障定位与流量治理'],
  ['sre','platform',0.90,0.91,'工作负载、发布和配额'],

  ['data-engineer','python',0.96,0.94,'数据管道、任务编排与测试'],
  ['data-engineer','platform',0.91,0.89,'容器、存储、调度和发布'],
  ['data-engineer','reliability',0.88,0.88,'数据新鲜度、任务 SLO 与告警'],
  ['data-engineer','git',0.86,0.93,'管道代码和配置的版本化']
] AS row
MATCH (r:Role {id:row[0]}), (s:Skill {id:row[1]})
MERGE (r)-[rel:REQUIRES]->(s)
SET rel.relevance=row[2], rel.confidence=row[3], rel.evidence=row[4];
