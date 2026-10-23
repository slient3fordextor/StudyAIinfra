// A small seed for the role lens. Import the rest of the skill catalogue with
// the same shape: (Role)-[:REQUIRES {relevance, confidence, evidence}]->(Skill).
UNWIND [
  {id:'ai-infra', name:'AI Infra 工程师', summary:'把训练、推理和平台基础设施做成可观测、可扩展的生产系统。', color:'#d77ad6'},
  {id:'ml-platform', name:'机器学习平台工程师', summary:'连接数据、训练作业、模型制品和平台治理，让研究成果稳定交付。', color:'#63c997'},
  {id:'backend', name:'后端工程师', summary:'设计可靠的服务、数据访问和流量治理能力，支撑复杂业务系统。', color:'#65b8df'},
  {id:'sre', name:'SRE / 可靠性工程师', summary:'用系统思维管理服务可靠性、容量、变更风险和恢复速度。', color:'#a18be0'},
  {id:'data-engineer', name:'数据工程师', summary:'构建可复现、可观测的数据管道和计算平台，保障数据质量与交付。', color:'#ecaa45'}
] AS row
MERGE (r:Role {id:row.id})
SET r.name=row.name, r.summary=row.summary, r.color=row.color;

UNWIND [
  ['linux','Linux 系统'], ['python','Python 工程'], ['network','计算机网络'],
  ['git','Git 与协作'], ['gpu','GPU 与 CUDA'], ['pytorch','PyTorch 系统'],
  ['distributed','分布式训练'], ['serving','模型服务'], ['platform','容器与 Kubernetes'],
  ['reliability','可观测性与可靠性']
] AS row
MERGE (s:Skill {id:row[0]}) SET s.name=row[1];

UNWIND [
  ['ai-infra','linux',0.86,0.91,'招聘职责与生产故障案例高度重合'],
  ['ai-infra','gpu',0.98,0.94,'训练与推理系统的硬件边界'],
  ['ai-infra','distributed',0.97,0.93,'多机多卡运行的必需能力'],
  ['ai-infra','platform',0.94,0.92,'集群调度、发布和资源治理'],
  ['ai-infra','serving',0.95,0.91,'模型 API、批处理与弹性伸缩'],
  ['ai-infra','reliability',0.90,0.88,'SLO、容量和故障恢复'],
  ['backend','python',0.93,0.94,'服务开发、测试和异步并发'],
  ['backend','network',0.96,0.95,'协议、网关和排障是通用后端基础'],
  ['backend','serving',0.87,0.86,'API、流量路由和发布模式可迁移'],
  ['backend','reliability',0.91,0.92,'可观测性、SLO 和故障恢复'],
  ['sre','reliability',1.0,0.97,'SLO、告警、容量和演练是职责核心'],
  ['sre','linux',0.94,0.95,'系统诊断与资源隔离'],
  ['sre','network',0.93,0.94,'端到端故障定位与流量治理'],
  ['sre','platform',0.90,0.91,'工作负载、发布和配额']
] AS row
MATCH (r:Role {id:row[0]}), (s:Skill {id:row[1]})
MERGE (r)-[rel:REQUIRES]->(s)
SET rel.relevance=row[2], rel.confidence=row[3], rel.evidence=row[4];
