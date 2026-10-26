const tracks = {
  foundations: { name: "系统基础", icon: "terminal", color: "#65b8df" },
  compute: { name: "计算与 GPU", icon: "cpu", color: "#ecaa45" },
  training: { name: "训练系统", icon: "git-branch", color: "#d77ad6" },
  serving: { name: "模型推理", icon: "gauge", color: "#63c997" },
  platform: { name: "云原生平台", icon: "boxes", color: "#eb786e" },
  reliability: { name: "性能与稳定性", icon: "activity", color: "#a18be0" },
  application: { name: "AI 应用开发", icon: "sparkles", color: "#f178a5" },
};

// The API enriches this catalogue when Neo4j is available. Keeping a small
// client fallback means the graph remains explorable from a static file too.
const fallbackRoles = [
  { id: "ai-infra", name: "AI Infra 工程师", summary: "把训练、推理和平台基础设施做成可观测、可扩展的生产系统。", color: "#d77ad6", core: true, focusDomains: ["linux", "gpu", "pytorch", "distributed", "platform", "serving", "reliability"], skills: [{ id: "linux", relevance: .86, confidence: .91, evidence: "系统文档、生产运行手册与故障实践" }, { id: "gpu", relevance: .98, confidence: .94, evidence: "CUDA / GPU 文档与性能实验" }, { id: "distributed", relevance: .97, confidence: .93, evidence: "PyTorch Distributed 文档与多机实验" }, { id: "platform", relevance: .94, confidence: .92, evidence: "Kubernetes 官方工作负载与调度模型" }, { id: "serving", relevance: .95, confidence: .86, evidence: "推理服务文档与容量压测，岗位边界仍需持续复核" }, { id: "reliability", relevance: .90, confidence: .88, evidence: "Prometheus / SLO 实践与生产运行手册" }, { id: "network", relevance: .82, confidence: .90, evidence: "RFC、服务发现与集合通信实践" }, { id: "python", relevance: .78, confidence: .89, evidence: "Python 官方文档与基础设施工具实践" }] },
  { id: "ai-app", name: "AI 应用开发", summary: "把模型能力变成可评测、可观测、可交付的产品功能。", color: "#f178a5", core: true, focusDomains: ["application", "llm", "rag", "agents", "evals", "safety", "serving", "reliability"], skills: [{ id: "application", relevance: .98, confidence: .90, evidence: "应用架构、API 与状态管理是交付 AI 功能的共同边界" }, { id: "llm", relevance: .98, confidence: .88, evidence: "模型 API、结构化输出与工具调用官方文档" }, { id: "rag", relevance: .93, confidence: .82, evidence: "检索、引用和数据管线已有成熟实践，具体组合需按场景验证" }, { id: "agents", relevance: .90, confidence: .78, evidence: "工具调用与编排模式仍在快速演进，需以评测结果为准" }, { id: "evals", relevance: .96, confidence: .85, evidence: "离线数据集、回归评测与线上质量闭环" }, { id: "safety", relevance: .94, confidence: .83, evidence: "提示注入、隐私与审计控制需要按产品风险验证" }, { id: "serving", relevance: .82, confidence: .86, evidence: "模型 API、流式输出与容量控制" }, { id: "reliability", relevance: .78, confidence: .84, evidence: "可观测性、SLO 与故障降级" }] },
  { id: "ml-platform", name: "机器学习平台工程师", summary: "连接数据、训练作业、模型制品和平台治理，让研究成果稳定交付。", color: "#63c997", focusDomains: ["python", "pytorch", "distributed", "platform", "serving", "reliability"], skills: [{ id: "python", relevance: .94, confidence: .93, evidence: "平台 SDK、作业编排与开发体验" }, { id: "pytorch", relevance: .92, confidence: .89, evidence: "训练抽象与框架集成" }, { id: "platform", relevance: .98, confidence: .95, evidence: "工作负载、存储与发布的核心职责" }, { id: "distributed", relevance: .88, confidence: .87, evidence: "分布式训练和弹性作业" }, { id: "serving", relevance: .84, confidence: .85, evidence: "模型制品到在线服务的交付链" }, { id: "reliability", relevance: .82, confidence: .86, evidence: "平台 SLO 与任务可恢复性" }, { id: "git", relevance: .80, confidence: .90, evidence: "配置、代码和模型制品的版本治理" }] },
  { id: "backend", name: "后端工程师", summary: "设计可靠的服务、数据访问和流量治理能力，支撑复杂业务系统。", color: "#65b8df", focusDomains: ["python", "network", "git", "serving", "platform", "reliability"], skills: [{ id: "python", relevance: .93, confidence: .94, evidence: "服务开发、测试和异步并发" }, { id: "network", relevance: .96, confidence: .95, evidence: "协议、网关和排障是通用后端基础" }, { id: "serving", relevance: .87, confidence: .86, evidence: "API、流量路由和发布模式可迁移" }, { id: "platform", relevance: .78, confidence: .83, evidence: "容器化部署和服务发现" }, { id: "reliability", relevance: .91, confidence: .92, evidence: "可观测性、SLO 和故障恢复" }, { id: "git", relevance: .89, confidence: .96, evidence: "协作、评审和持续交付" }, { id: "linux", relevance: .75, confidence: .90, evidence: "运行时、进程和资源诊断" }] },
  { id: "sre", name: "SRE / 可靠性工程师", summary: "用系统思维管理服务可靠性、容量、变更风险和恢复速度。", color: "#a18be0", focusDomains: ["linux", "network", "platform", "reliability", "git"], skills: [{ id: "reliability", relevance: 1, confidence: .97, evidence: "SLO、告警、容量和演练是职责核心" }, { id: "linux", relevance: .94, confidence: .95, evidence: "系统诊断与资源隔离" }, { id: "network", relevance: .93, confidence: .94, evidence: "端到端故障定位与流量治理" }, { id: "platform", relevance: .90, confidence: .91, evidence: "工作负载、发布和配额" }, { id: "git", relevance: .83, confidence: .90, evidence: "变更评审、CI 与安全恢复" }, { id: "python", relevance: .70, confidence: .82, evidence: "自动化与诊断工具" }] },
  { id: "data-engineer", name: "数据工程师", summary: "构建可复现、可观测的数据管道和计算平台，保障数据质量与交付。", color: "#ecaa45", focusDomains: ["python", "linux", "network", "platform", "reliability", "git"], skills: [{ id: "python", relevance: .96, confidence: .94, evidence: "数据管道、任务编排与测试" }, { id: "platform", relevance: .91, confidence: .89, evidence: "容器、存储、调度和发布" }, { id: "reliability", relevance: .88, confidence: .88, evidence: "数据新鲜度、任务 SLO 与告警" }, { id: "linux", relevance: .76, confidence: .86, evidence: "批处理环境与资源诊断" }, { id: "network", relevance: .75, confidence: .85, evidence: "数据服务、存储和跨节点通信" }, { id: "git", relevance: .86, confidence: .93, evidence: "管道代码和配置的版本化" }] },
];

const domains = [
  { id: "linux", name: "Linux 系统", track: "foundations", icon: "terminal", x: 48, y: 150, prereqDomains: [], gate: ["linux.processes", "linux.io"], description: "从 Shell、文件系统和进程模型深入到资源隔离与系统性能诊断。", outcome: "能定位系统问题，并理解容器和 GPU 工作负载依赖的操作系统机制。" },
  { id: "python", name: "Python 工程", track: "foundations", icon: "braces", x: 48, y: 280, prereqDomains: [], gate: ["python.testing", "python.asyncio"], description: "将 Python 从脚本语言学成可靠的工程工具，覆盖类型、测试、并发和交付。", outcome: "能开发可维护的基础设施 CLI、异步服务与自动化工具。" },
  { id: "network", name: "计算机网络", track: "foundations", icon: "network", x: 48, y: 410, prereqDomains: [], gate: ["network.http", "network.socket"], description: "从 TCP/IP 到 TLS、代理和负载均衡，建立端到端网络故障分析能力。", outcome: "能解释延迟、连接、解析和服务发现问题。" },
  { id: "git", name: "Git 与协作", track: "foundations", icon: "git-merge", x: 48, y: 540, prereqDomains: [], gate: ["git.review", "git.recovery"], description: "理解 Git 对象模型与协作工作流，让代码、配置和平台变更可追踪。", outcome: "能维护清晰历史并处理复杂分支、冲突与恢复场景。" },
  { id: "gpu", name: "GPU 与 CUDA", track: "compute", icon: "cpu", x: 298, y: 150, prereqDomains: ["linux"], gate: ["gpu.memory", "gpu.profiling"], description: "理解 GPU 架构、显存、Kernel、并发执行以及性能分析方法。", outcome: "能解释 GPU 程序的瓶颈，并为训练和推理优化提供依据。" },
  { id: "platform", name: "容器与 Kubernetes", track: "platform", icon: "boxes", x: 298, y: 500, prereqDomains: ["linux", "network", "git"], gate: ["platform.workload", "platform.service"], description: "从镜像和容器运行时进入 Kubernetes 工作负载、服务和 GPU 调度。", outcome: "能构建可复现、可调度的 AI 工作负载运行环境。" },
  { id: "pytorch", name: "PyTorch 系统", track: "compute", icon: "flame", x: 548, y: 150, prereqDomains: ["python", "gpu"], gate: ["pytorch.training", "pytorch.amp"], description: "超越模型 API，理解 Autograd、数据管线、训练循环和编译执行。", outcome: "能从框架内部行为分析训练性能与数值问题。" },
  { id: "distributed", name: "分布式训练", track: "training", icon: "share-2", x: 798, y: 110, prereqDomains: ["pytorch", "network"], gate: ["distributed.ddp", "distributed.checkpoint"], description: "覆盖集合通信、DDP、分片并行、Checkpoint 与故障恢复。", outcome: "能设计并排查多机多卡训练任务。" },
  { id: "serving", name: "模型服务", track: "serving", icon: "rocket", x: 798, y: 390, prereqDomains: ["pytorch", "network"], gate: ["serving.batching", "serving.vllm"], description: "围绕 API、流式输出、动态批处理、KV Cache 和推理引擎构建服务。", outcome: "能在延迟、吞吐与成本之间设计生产级推理系统。" },
  { id: "reliability", name: "可观测性与可靠性", track: "reliability", icon: "activity", x: 1048, y: 260, prereqDomains: ["linux", "network"], gate: ["reliability.slo", "reliability.alerting"], description: "用指标、日志、追踪和 SLO 管理复杂 AI 系统的生产风险。", outcome: "能建立可解释的告警、容量规划和故障恢复体系。" },
  { id: "application", name: "AI 应用工程", track: "application", icon: "sparkles", x: 48, y: 670, prereqDomains: ["python", "network"], gate: ["application.api", "application.state"], description: "从产品边界、API、状态和权限出发，把模型能力接入真实业务。", outcome: "能交付有边界、有状态、可观测的 AI 产品功能。" },
  { id: "llm", name: "模型与上下文", track: "application", icon: "brain-circuit", x: 298, y: 670, prereqDomains: ["application"], gate: ["llm.structured", "llm.tools"], description: "理解 token、上下文、结构化输出和工具调用这些模型交互的基本机制。", outcome: "能为模型调用设计稳定的输入、输出和工具边界。" },
  { id: "rag", name: "RAG 与知识工程", track: "application", icon: "library-big", x: 548, y: 670, prereqDomains: ["application", "llm"], gate: ["rag.retrieval", "rag.citations"], description: "覆盖数据接入、切分、检索、重排和引用，让回答可以追溯。", outcome: "能构建可更新、可引用、可评测的知识问答链路。" },
  { id: "agents", name: "Agent 系统", track: "application", icon: "orbit", x: 798, y: 670, prereqDomains: ["llm", "application"], gate: ["agents.tools", "agents.guardrails"], description: "围绕循环、工具、记忆和护栏组织可控的多步任务执行。", outcome: "能把 Agent 做成有边界、可回放、可中止的工作流。" },
  { id: "evals", name: "评测与质量", track: "application", icon: "clipboard-check", x: 1048, y: 410, prereqDomains: ["llm", "rag"], gate: ["evals.offline", "evals.regression"], description: "用数据集、离线评测、线上信号和回归门禁管理 AI 质量。", outcome: "能用可复现的指标判断一次改动是否真的变好。" },
  { id: "safety", name: "安全与治理", track: "application", icon: "shield-check", x: 1048, y: 560, prereqDomains: ["application", "llm"], gate: ["safety.injection", "safety.governance"], description: "覆盖提示注入、隐私、权限、审计和人工接管等产品控制面。", outcome: "能为高风险 AI 功能设计可验证的安全边界。" },
];

const rawSkills = {
  linux: [
    ["shell", "Shell 与管道", "COMMAND · PIPE · TEXT", "square-terminal", 0, 0, 3, [], "熟练使用命令、管道、重定向和文本工具完成系统操作。"],
    ["filesystem", "文件系统", "PATH · INODE · MOUNT", "folder-tree", 0, 1, 4, [], "理解目录树、inode、挂载点和常见文件系统语义。"],
    ["permissions", "用户与权限", "UID · MODE · ACL", "key-round", 1, 0, 4, ["shell", "filesystem"], "掌握用户、组、权限位、ACL 与最小权限原则。"],
    ["processes", "进程与信号", "PID · SIGNAL · IPC", "waves", 1, 1, 5, ["shell"], "理解进程生命周期、信号、IPC 和父子进程关系。"],
    ["systemd", "systemd 与日志", "UNIT · JOURNAL", "scroll-text", 2, 0, 4, ["processes"], "管理系统服务，并使用 journal 定位启动和运行问题。"],
    ["io", "存储与 I/O", "BLOCK · CACHE · IOPS", "hard-drive", 2, 1, 6, ["filesystem", "processes"], "理解块设备、页缓存、吞吐、IOPS 和延迟。"],
    ["namespaces", "Namespaces", "PID · NET · MOUNT", "panels-top-left", 3, 0, 5, ["permissions", "processes"], "理解容器如何隔离进程、网络、挂载和用户视图。"],
    ["cgroups", "Cgroups", "CPU · MEMORY · QUOTA", "sliders-horizontal", 3, 1, 5, ["processes", "io"], "理解资源统计、限制和隔离如何作用于进程组。"],
    ["perf", "系统性能诊断", "TOP · PERF · EBPF", "stethoscope", 4, 1, 8, ["systemd", "io"], "从 CPU、内存、I/O 和系统调用角度定位性能瓶颈。"],
  ],
  python: [
    ["language", "语言核心", "OBJECT · ITERATOR", "braces", 0, 0, 4, [], "掌握数据模型、迭代器、生成器和上下文管理器。"],
    ["venv", "环境与依赖", "VENV · LOCK · BUILD", "package", 0, 1, 3, [], "管理虚拟环境、依赖锁定和可复现安装。"],
    ["typing", "类型系统", "TYPE · GENERIC · PROTOCOL", "binary", 1, 0, 4, ["language"], "使用类型标注、泛型和 Protocol 描述可靠接口。"],
    ["logging", "异常与日志", "ERROR · CONTEXT", "file-warning", 1, 1, 3, ["language"], "设计异常边界与结构化日志，保留排障上下文。"],
    ["testing", "自动化测试", "PYTEST · MOCK", "test-tubes", 2, 0, 5, ["typing", "venv"], "编写单元与集成测试，合理使用 fixture 和 mock。"],
    ["concurrency", "线程与进程", "THREAD · PROCESS", "waypoints", 2, 1, 6, ["language"], "理解 GIL、线程池、进程池和任务间通信。"],
    ["packaging", "包与 CLI", "WHEEL · ENTRYPOINT", "package-open", 3, 0, 4, ["venv", "testing"], "构建 Python 包、命令行入口和发布制品。"],
    ["asyncio", "asyncio", "EVENT LOOP · TASK", "timer", 3, 1, 6, ["concurrency", "logging"], "掌握事件循环、协程、取消、超时和背压。"],
    ["profiling", "Python 性能分析", "CPU · MEMORY · TRACE", "scan-line", 4, 1, 5, ["concurrency", "testing"], "使用采样、追踪和内存分析定位程序热点。"],
  ],
  network: [
    ["tcpip", "TCP/IP 模型", "PACKET · CONNECTION", "network", 0, 0, 5, [], "理解分层、封装、TCP 状态机和可靠传输。"],
    ["subnet", "子网与路由", "CIDR · ROUTE · NAT", "route", 0, 1, 5, [], "掌握 CIDR、路由表、网关和 NAT 的工作方式。"],
    ["dns", "DNS", "RECORD · CACHE", "book-open", 1, 0, 4, ["tcpip"], "理解递归解析、记录类型、缓存和常见故障。"],
    ["http", "HTTP 协议", "REQUEST · STREAM", "globe", 1, 1, 5, ["tcpip"], "理解 HTTP 语义、连接复用、流式传输和版本差异。"],
    ["tls", "TLS 与证书", "HANDSHAKE · PKI", "shield-check", 2, 0, 5, ["http", "dns"], "理解握手、证书链、加密套件和证书校验。"],
    ["socket", "Socket 编程", "CLIENT · SERVER", "radio-tower", 2, 1, 6, ["tcpip"], "使用 Socket 理解连接、缓冲区、阻塞与非阻塞 I/O。"],
    ["proxy", "代理与网关", "FORWARD · REVERSE", "shuffle", 3, 0, 5, ["http", "dns"], "理解正向代理、反向代理、网关和连接终止。"],
    ["loadbalancer", "负载均衡", "L4 · L7 · HEALTH", "scale", 3, 1, 6, ["proxy", "socket"], "掌握四层与七层负载均衡、健康检查和路由策略。"],
    ["debug", "网络排障", "SS · CURL · TCPDUMP", "search-code", 4, 1, 7, ["tls", "loadbalancer"], "使用 ss、curl、dig 和抓包工具逐层定位网络问题。"],
  ],
  git: [
    ["model", "Git 对象模型", "BLOB · TREE · COMMIT", "database", 0, 0, 4, [], "理解内容寻址对象、引用和提交图。"],
    ["commits", "暂存区与提交", "INDEX · DIFF", "list-tree", 1, 0, 3, ["model"], "掌握工作区、暂存区、提交和差异比较。"],
    ["branching", "分支与远端", "BRANCH · FETCH", "git-branch", 1, 1, 4, ["commits"], "理解分支指针、远程跟踪和安全同步。"],
    ["rebase", "Rebase 与历史", "REWRITE · SQUASH", "git-commit-horizontal", 2, 0, 4, ["branching"], "整理提交历史并理解历史改写的协作影响。"],
    ["conflicts", "冲突处理", "MERGE · RESOLVE", "git-pull-request", 2, 1, 4, ["branching"], "定位冲突来源并完成可验证的合并。"],
    ["review", "代码评审", "PR · REVIEW · CHECK", "messages-square", 3, 0, 4, ["rebase", "conflicts"], "通过小提交、清晰描述和自动检查提高评审质量。"],
    ["recovery", "历史恢复", "REFLOG · REVERT", "history", 3, 1, 4, ["model", "branching"], "使用 reflog、revert 和 reset 恢复误操作。"],
    ["ci", "CI 工作流", "PIPELINE · ARTIFACT", "workflow", 4, 0, 6, ["review", "recovery"], "将构建、测试和制品发布接入版本控制流程。"],
  ],
  gpu: [
    ["architecture", "GPU 执行架构", "SM · WARP · THREAD", "microchip", 0, 0, 6, ["linux.processes"], "理解 SM、Warp、线程层次和 SIMT 执行。"],
    ["memory", "显存模型", "HBM · CACHE · COALESCING", "memory-stick", 1, 0, 7, ["architecture", "linux.io"], "理解显存层级、访问合并和主机设备传输。"],
    ["cuda", "CUDA 编程模型", "GRID · BLOCK · THREAD", "code-xml", 1, 1, 8, ["architecture", "python.language"], "掌握 Grid、Block、Thread 与基本 CUDA API。"],
    ["kernels", "Kernel 优化", "OCCUPANCY · REGISTER", "blocks", 2, 0, 8, ["cuda", "memory"], "分析占用率、寄存器压力与访存模式。"],
    ["streams", "Stream 与并发", "ASYNC · EVENT", "waves", 2, 1, 6, ["cuda", "memory"], "使用 Stream、Event 与异步传输重叠计算和通信。"],
    ["mixed", "混合精度", "FP16 · BF16 · TF32", "sigma", 3, 0, 6, ["kernels"], "理解低精度格式、数值范围和损失缩放。"],
    ["profiling", "GPU Profiling", "NSYS · NSIGHT", "scan-line", 3, 1, 8, ["kernels", "streams"], "使用时间线和算子指标定位 GPU 瓶颈。"],
    ["optimization", "算子与融合", "FUSION · TRITON", "zap", 4, 1, 10, ["mixed", "profiling"], "理解算子融合、Triton 和端到端优化方法。"],
  ],
  pytorch: [
    ["tensor", "Tensor 与存储", "SHAPE · STRIDE · VIEW", "box", 0, 0, 5, ["python.typing", "gpu.architecture"], "理解 Tensor 的形状、步长、视图和底层存储。"],
    ["autograd", "Autograd", "GRAPH · GRADIENT", "git-fork", 1, 0, 6, ["tensor"], "理解计算图、反向传播、叶子节点和梯度累积。"],
    ["dataset", "数据加载管线", "DATASET · DATALOADER", "database-zap", 1, 1, 6, ["tensor", "python.concurrency"], "设计 Dataset、采样、预取和多进程数据加载。"],
    ["training", "训练循环", "LOSS · OPTIMIZER", "repeat-2", 2, 0, 7, ["autograd", "dataset"], "正确组织前向、反向、优化器与验证循环。"],
    ["amp", "自动混合精度", "AUTOCAST · SCALER", "gauge", 2, 1, 5, ["training", "gpu.mixed"], "使用 autocast 和缩放器平衡速度与数值稳定性。"],
    ["compile", "图编译", "DYNAMO · INDUCTOR", "file-cog", 3, 0, 8, ["training", "gpu.kernels"], "理解图捕获、编译边界和常见 graph break。"],
    ["profiler", "PyTorch Profiler", "OP · TRACE · STACK", "chart-no-axes-combined", 3, 1, 6, ["training", "gpu.profiling"], "关联框架算子、CPU 调度与 GPU 时间线。"],
    ["extension", "自定义算子", "C++ · CUDA · AUTOGRAD", "puzzle", 4, 1, 10, ["compile", "profiler"], "开发并注册 C++/CUDA 自定义算子和梯度。"],
  ],
  platform: [
    ["image", "容器镜像", "LAYER · BUILD · REGISTRY", "package-check", 0, 0, 5, ["linux.filesystem", "git.commits"], "构建小型、可复现且安全的多阶段镜像。"],
    ["runtime", "容器运行时", "OCI · NAMESPACE · CGROUP", "container", 1, 0, 7, ["image", "linux.namespaces", "linux.cgroups"], "理解 OCI、容器生命周期和底层隔离机制。"],
    ["container-network", "容器网络", "VETH · BRIDGE · NAT", "cable", 1, 1, 7, ["runtime", "network.subnet"], "理解 veth、Bridge、NAT 和容器间通信。"],
    ["workload", "K8s 工作负载", "POD · JOB · DEPLOY", "ship-wheel", 2, 0, 8, ["runtime", "git.ci"], "掌握 Pod、Job、Deployment 和声明式控制器。"],
    ["service", "服务发现", "SERVICE · DNS · INGRESS", "waypoints", 2, 1, 7, ["workload", "container-network", "network.dns"], "理解 Service、集群 DNS、Ingress 和流量路径。"],
    ["storage", "K8s 存储", "PV · PVC · CSI", "database", 3, 0, 6, ["workload", "linux.io"], "掌握持久卷、声明和 CSI 存储接口。"],
    ["scheduling", "调度与配额", "REQUEST · LIMIT · TAINT", "calendar-cog", 3, 1, 7, ["workload", "service"], "使用资源请求、亲和性、污点和配额控制调度。"],
    ["gpu-scheduling", "GPU 调度", "DEVICE · TOPOLOGY", "cpu", 4, 0, 8, ["scheduling", "gpu.memory"], "理解设备插件、GPU 拓扑和共享调度方案。"],
    ["helm", "Helm 与发布", "CHART · ROLLOUT", "package-open", 4, 1, 6, ["service", "storage", "git.ci"], "模板化应用配置并管理可回滚发布。"],
  ],
  distributed: [
    ["process-group", "进程组与通信", "RANK · WORLD · RENDEZVOUS", "users", 0, 0, 7, ["pytorch.training", "network.socket"], "理解 Rank、World Size、Rendezvous 和进程拓扑。"],
    ["collective", "集合通信", "ALLREDUCE · ALLGATHER", "combine", 1, 0, 8, ["process-group", "gpu.streams"], "理解常用集合通信的语义、代价与拓扑。"],
    ["pipeline", "分布式数据管线", "SHARD · SAMPLER", "split", 1, 1, 6, ["process-group", "pytorch.dataset"], "正确分片数据并保持采样、随机性与容错一致。"],
    ["ddp", "数据并行 DDP", "BUCKET · HOOK · NCCL", "share-2", 2, 0, 9, ["collective", "pipeline"], "掌握梯度同步、Bucket、通信 Hook 和常见 Hang。"],
    ["checkpoint", "分布式 Checkpoint", "SHARD · RESUME", "save", 2, 1, 8, ["pipeline", "platform.storage"], "设计可扩展的分片保存、加载和断点续训。"],
    ["fsdp", "FSDP / ZeRO", "PARAM · GRAD · OPTIM", "layers-3", 3, 0, 10, ["ddp", "checkpoint"], "理解参数、梯度和优化器状态的分片策略。"],
    ["model-parallel", "张量与流水线并行", "TP · PP · MESH", "git-branch", 3, 1, 12, ["ddp", "gpu.profiling"], "根据模型结构与硬件拓扑组合 TP 和 PP。"],
    ["fault", "弹性与故障恢复", "RESTART · MEMBERSHIP", "shield-check", 4, 1, 8, ["fsdp", "model-parallel", "checkpoint"], "应对节点失败、成员变化和超时，降低重算成本。"],
  ],
  serving: [
    ["api", "异步模型 API", "HTTP · GRPC · ASYNC", "radio-tower", 0, 0, 6, ["python.asyncio", "network.http"], "构建支持超时、取消和并发控制的模型 API。"],
    ["streaming", "流式输出", "SSE · BACKPRESSURE", "radio", 1, 0, 5, ["api", "network.socket"], "实现流式响应、断连处理和背压控制。"],
    ["batching", "动态批处理", "QUEUE · SCHEDULER", "combine", 1, 1, 7, ["api", "pytorch.tensor"], "在延迟预算内合并请求，提高 GPU 利用率。"],
    ["kv-cache", "KV Cache", "MEMORY · PAGING", "memory-stick", 2, 0, 8, ["batching", "gpu.memory"], "理解 KV Cache 的容量、分页和复用策略。"],
    ["routing", "路由与负载均衡", "MODEL · TENANT · HEALTH", "route", 2, 1, 7, ["streaming", "network.loadbalancer"], "按模型、租户、负载和健康状态路由请求。"],
    ["vllm", "vLLM 推理引擎", "PAGED · CONTINUOUS", "rocket", 3, 0, 10, ["kv-cache", "gpu.profiling"], "理解 PagedAttention、持续批处理和 Worker 拓扑。"],
    ["autoscaling", "弹性伸缩", "METRIC · QUEUE · WARMUP", "scaling", 3, 1, 8, ["routing", "platform.workload"], "结合队列、延迟和启动成本设计伸缩策略。"],
    ["rollout", "模型发布", "CANARY · FALLBACK", "git-compare", 4, 1, 7, ["vllm", "autoscaling", "platform.helm"], "实现灰度、回滚、版本路由和模型制品治理。"],
  ],
  reliability: [
    ["metrics", "指标体系", "COUNTER · HISTOGRAM", "chart-no-axes-combined", 0, 0, 5, ["linux.perf", "network.debug"], "设计低基数且能回答问题的系统与业务指标。"],
    ["logs", "结构化日志", "EVENT · CONTEXT · QUERY", "logs", 0, 1, 5, ["linux.systemd", "python.logging"], "建立一致字段、上下文传播和日志检索规范。"],
    ["tracing", "分布式追踪", "SPAN · CONTEXT", "scan-search", 1, 0, 7, ["logs", "network.http"], "理解 Span、上下文传播和采样策略。"],
    ["prometheus", "Prometheus", "SCRAPE · QUERY · RECORD", "database-zap", 1, 1, 7, ["metrics", "platform.service"], "掌握采集、PromQL、Recording Rule 和联邦方案。"],
    ["slo", "SLI 与 SLO", "BUDGET · WINDOW", "target", 2, 0, 7, ["metrics", "tracing"], "用用户可感知的指标定义目标和错误预算。"],
    ["alerting", "告警工程", "RULE · ROUTE · RUNBOOK", "siren", 2, 1, 6, ["prometheus", "slo"], "构建可行动、低噪声且带运行手册的告警。"],
    ["capacity", "容量与成本", "UTILIZATION · FORECAST", "calculator", 3, 0, 8, ["prometheus", "gpu.profiling"], "预测资源需求并度量 GPU 利用率和单位成本。"],
    ["chaos", "故障演练", "INJECT · RECOVER", "shield-alert", 3, 1, 8, ["alerting", "platform.workload"], "通过受控故障验证检测、降级和恢复路径。"],
    ["resilience", "系统韧性", "FAILOVER · DEGRADE", "shield-check", 4, 1, 10, ["capacity", "chaos", "distributed.fault"], "综合冗余、限流、降级和恢复构建生产韧性。"],
  ],
  application: [
    ["architecture", "应用架构", "BOUNDARY · FLOW · CONTRACT", "blocks", 0, 0, 5, ["python.language", "network.http"], "拆分模型调用、业务逻辑、状态和外部系统边界。"],
    ["api", "AI API 设计", "SCHEMA · STREAM · ERROR", "brackets", 1, 0, 6, ["architecture"], "设计有结构化输入输出、超时、重试和错误语义的模型 API。"],
    ["state", "状态与会话", "STATE · CACHE · CHECKPOINT", "database", 1, 1, 6, ["architecture"], "管理会话、缓存、幂等和可恢复状态，避免把上下文写成隐式魔法。"],
    ["auth", "权限与租户", "AUTH · TENANT · POLICY", "key-round", 2, 0, 6, ["api", "state"], "为工具、数据和模型调用建立最小权限与租户隔离。"],
    ["integration", "产品集成", "WEBHOOK · QUEUE · BATCH", "plug-zap", 2, 1, 7, ["api", "state"], "把模型能力接入任务队列、Webhook、文件和业务系统。"],
  ],
  llm: [
    ["fundamentals", "模型交互基础", "TOKEN · CONTEXT · LATENCY", "brain", 0, 0, 5, ["application.architecture"], "理解 token、上下文窗口、采样和延迟对产品行为的影响。"],
    ["prompting", "提示与上下文", "INSTRUCTION · EXAMPLE · CONTEXT", "message-square-text", 1, 0, 5, ["fundamentals"], "把任务、约束、示例和上下文组织成可复现的输入。"],
    ["structured", "结构化输出", "JSON · SCHEMA · VALIDATION", "braces", 1, 1, 5, ["fundamentals"], "让模型输出通过 schema 校验，并对拒答和解析失败做降级。"],
    ["tools", "工具调用", "TOOL · ARGUMENT · RESULT", "wrench", 2, 0, 6, ["structured"], "设计工具契约、参数校验、结果回传和执行权限。"],
    ["multimodal", "多模态交互", "IMAGE · AUDIO · FILE", "scan-face", 2, 1, 7, ["fundamentals"], "处理图片、音频和文件输入，明确格式、成本和失败边界。"],
  ],
  rag: [
    ["data", "知识接入", "SOURCE · PARSE · UPDATE", "database", 0, 0, 6, ["application.api", "llm.fundamentals"], "建立文档、网页和结构化数据的接入与增量更新流程。"],
    ["chunking", "切分与元数据", "CHUNK · METADATA · VERSION", "scissors", 1, 0, 5, ["data"], "按语义、结构和产品过滤条件切分内容并保留来源。"],
    ["retrieval", "检索与重排", "EMBEDDING · SEARCH · RERANK", "search", 1, 1, 8, ["chunking"], "组合关键词、向量、过滤和重排，衡量召回与精度。"],
    ["citations", "引用与回答", "GROUNDING · CITE · ABSTAIN", "quote", 2, 0, 6, ["retrieval", "llm.structured"], "让回答绑定证据，无法支持时明确拒答或请求补充。"],
    ["freshness", "知识新鲜度", "SYNC · TTL · DRIFT", "refresh-cw", 2, 1, 6, ["data", "retrieval"], "检测数据过期、删除传播和索引漂移。"],
  ],
  agents: [
    ["loop", "Agent 循环", "PLAN · ACT · OBSERVE", "repeat", 0, 0, 6, ["llm.tools"], "理解规划、行动、观察和停止条件组成的最小执行循环。"],
    ["tools", "工具编排", "ROUTE · RETRY · TIMEOUT", "workflow", 1, 0, 6, ["loop", "application.auth"], "编排工具、重试、超时和人工接管，限制失控路径。"],
    ["memory", "记忆与状态", "SHORT · LONG · STORE", "brain-circuit", 1, 1, 6, ["loop", "application.state"], "区分短期上下文、长期记忆和可删除的用户状态。"],
    ["guardrails", "护栏与中止", "POLICY · BUDGET · HUMAN", "shield-alert", 2, 0, 6, ["tools", "safety.threat-model"], "为权限、预算、敏感操作和人工复核设置硬边界。"],
    ["replay", "轨迹与回放", "TRACE · REPLAY · DEBUG", "history", 2, 1, 5, ["tools", "evals.dataset"], "记录完整轨迹，让一次失败可以复现、评测和定位。"],
  ],
  evals: [
    ["dataset", "评测数据集", "CASE · LABEL · SPLIT", "table-2", 0, 0, 5, ["llm.fundamentals"], "建立覆盖真实任务、边界输入和失败样本的评测集。"],
    ["offline", "离线评测", "QUALITY · JUDGE · SCORE", "clipboard-check", 1, 0, 6, ["dataset"], "用可解释指标和人工抽检比较提示、模型与检索改动。"],
    ["online", "线上质量", "FEEDBACK · DRIFT · COST", "chart-no-axes-combined", 1, 1, 6, ["offline", "reliability.metrics"], "结合用户反馈、成本、延迟和失败率观察真实质量。"],
    ["regression", "回归门禁", "CI · THRESHOLD · RELEASE", "git-pull-request", 2, 0, 5, ["offline", "online"], "在发布前固定关键样本、阈值和阻断条件。"],
    ["experiment", "实验设计", "CONTROL · VARIANT · CAUSAL", "flask-conical", 2, 1, 6, ["dataset", "offline"], "用对照、分层和版本记录减少主观判断。"],
  ],
  safety: [
    ["threat-model", "AI 威胁建模", "ASSET · ACTOR · BOUNDARY", "shield", 0, 0, 5, ["application.api", "llm.tools"], "识别提示、工具、数据和模型边界上的攻击与误用路径。"],
    ["injection", "提示注入防护", "UNTRUSTED · POLICY · ISOLATE", "shield-alert", 1, 0, 6, ["threat-model"], "把外部内容视为不可信输入，并限制其改变系统指令的能力。"],
    ["privacy", "隐私与数据边界", "PII · RETENTION · REDACT", "eye-off", 1, 1, 6, ["threat-model"], "控制敏感数据进入模型、日志、向量库和评测集的路径。"],
    ["governance", "审计与治理", "AUDIT · POLICY · OWNER", "file-check-2", 2, 0, 6, ["injection", "privacy"], "记录关键决策、策略版本、责任人和人工复核结果。"],
    ["incident", "安全事件响应", "DETECT · CONTAIN · LEARN", "siren", 2, 1, 6, ["governance", "reliability.alerting"], "为越权、数据泄露和模型异常建立发现、隔离和复盘流程。"],
  ],
};

// Evidence describes what is currently supportable, not a promise that every
// role mapping is universally correct. Candidate topics stay out of the main
// graph until they have a source and a reproducible check.
const evidenceCatalog = {
  linux: { status: "verified", label: "有来源", basis: "Linux / POSIX 文档与可复现实验", source: "Linux man-pages", url: "https://man7.org/linux/man-pages/" },
  python: { status: "verified", label: "有来源", basis: "Python 官方文档与可执行测试", source: "Python Docs", url: "https://docs.python.org/3/" },
  network: { status: "verified", label: "有来源", basis: "RFC、协议规范与抓包实验", source: "RFC Editor", url: "https://www.rfc-editor.org/" },
  git: { status: "verified", label: "有来源", basis: "Git 官方文档与版本库实验", source: "Git Documentation", url: "https://git-scm.com/docs" },
  gpu: { status: "verified", label: "有来源", basis: "CUDA 官方文档与性能实验", source: "CUDA Documentation", url: "https://docs.nvidia.com/cuda/" },
  pytorch: { status: "verified", label: "有来源", basis: "PyTorch 官方 API、教程与实验", source: "PyTorch Docs", url: "https://pytorch.org/docs/stable/" },
  platform: { status: "verified", label: "有来源", basis: "Kubernetes 官方概念与任务文档", source: "Kubernetes Docs", url: "https://kubernetes.io/docs/" },
  distributed: { status: "verified", label: "有来源", basis: "PyTorch Distributed 官方文档与多进程实验", source: "PyTorch Distributed", url: "https://pytorch.org/docs/stable/distributed.html" },
  serving: { status: "review", label: "需复核", basis: "推理引擎文档与容量压测；版本和硬件影响较大", source: "vLLM Docs", url: "https://docs.vllm.ai/" },
  reliability: { status: "verified", label: "有来源", basis: "Prometheus、OpenTelemetry 与 SRE 运行实践", source: "Prometheus Docs", url: "https://prometheus.io/docs/" },
  application: { status: "verified", label: "有来源", basis: "Web/API 工程规范与可运行产品样例", source: "OpenAI API Docs", url: "https://platform.openai.com/docs/" },
  llm: { status: "verified", label: "有来源", basis: "模型 API、结构化输出与工具调用官方文档", source: "OpenAI Platform Docs", url: "https://platform.openai.com/docs/guides/function-calling" },
  rag: { status: "review", label: "需复核", basis: "检索质量强依赖数据、领域和评测集，必须用项目数据验证", source: "Retrieval practice", url: "https://platform.openai.com/docs/guides/embeddings" },
  agents: { status: "review", label: "需复核", basis: "工具编排和记忆模式变化快，必须以轨迹评测和人工复核为准", source: "Agents practice", url: "https://platform.openai.com/docs/guides/agents" },
  evals: { status: "verified", label: "有来源", basis: "评测集、回归门禁与线上反馈闭环", source: "OpenAI Evals Docs", url: "https://platform.openai.com/docs/guides/evals" },
  safety: { status: "review", label: "需复核", basis: "风险边界和控制措施必须按产品、数据和法规场景验证", source: "OpenAI Safety Best Practices", url: "https://platform.openai.com/docs/guides/safety-best-practices" },
};

const candidateTopics = [
  { name: "微调与偏好优化", reason: "需要按模型、数据和目标任务建立可复现收益证据" },
  { name: "实时语音与多模态 Agent", reason: "延迟、打断、成本和安全边界仍需独立评测" },
  { name: "模型路由与成本优化", reason: "收益高度依赖流量分布、供应商和服务等级目标" },
  { name: "合规与数据驻留", reason: "必须结合部署地域、行业要求和审计制度验证" },
];

const domainById = Object.fromEntries(domains.map((domain) => [domain.id, domain]));
const skills = Object.entries(rawSkills).flatMap(([domainId, rows]) => rows.map((row) => {
  const [localId, name, subtitle, iconName, tier, rowIndex, hours, rawPrereqs, description] = row;
  return {
    id: `${domainId}.${localId}`,
    localId,
    domainId,
    name,
    subtitle,
    icon: iconName,
    tier,
    row: rowIndex,
    x: 48 + tier * 250,
    y: 150 + rowIndex * 120,
    hours,
    xp: hours * 20,
    prereqs: rawPrereqs.map((id) => id.includes(".") ? id : `${domainId}.${id}`),
    description,
    evidence: evidenceCatalog[domainId] || { status: "candidate", label: "待验证", basis: "尚未形成可审阅来源" },
  };
}));

const skillById = Object.fromEntries(skills.map((skill) => [skill.id, skill]));

const microTopics = {
  "linux.shell": ["命令执行与 PATH", "引用、展开与通配", "重定向与管道", "grep / sed / awk 文本处理"],
  "linux.filesystem": ["路径与目录树", "inode 与硬链接", "挂载与 mount namespace", "du / df 与磁盘排障"],
  "linux.permissions": ["UID、GID 与权限位", "sudo 与最小权限", "ACL 与默认权限", "umask 与权限排障"],
  "linux.processes": ["进程生命周期", "fork / exec 与环境", "信号与优雅退出", "/proc 与进程排障"],
  "linux.systemd": ["Unit 与生命周期", "依赖与启动顺序", "journald 日志查询", "服务隔离与硬化"],
  "linux.io": ["块设备与文件系统", "页缓存与同步", "iostat 与 I/O 延迟", "fio 压测与结果解读"],
  "linux.namespaces": ["PID / Mount 隔离", "Network namespace", "User namespace", "unshare 最小实验"],
  "linux.cgroups": ["层级与进程归属", "CPU quota 与 shares", "Memory limit 与 OOM", "统计、回收与排障"],
  "linux.perf": ["top / vmstat 指标", "strace 系统调用", "perf 采样与火焰图", "eBPF 观测入口"],
  "python.language": ["对象模型与可变性", "迭代器与生成器", "上下文管理器", "装饰器与数据模型"],
  "python.venv": ["venv 与解释器", "依赖解析与锁定", "构建 wheel 制品", "可复现安装"],
  "python.typing": ["类型标注与检查", "泛型与 TypeVar", "Protocol 与结构化类型", "类型驱动接口设计"],
  "python.logging": ["异常边界与链路", "Logger 层级", "结构化字段", "日志中的敏感数据"],
  "python.testing": ["测试夹具与断言", "mock 与依赖替换", "集成测试边界", "覆盖率与回归策略"],
  "python.concurrency": ["线程与 GIL", "进程池与序列化", "队列与共享状态", "并发任务的取消"],
  "python.asyncio": ["事件循环与协程", "Task 与 Future", "取消、超时与重试", "背压与资源上限"],
  "network.tcpip": ["分层与封装", "TCP 状态机", "重传与拥塞", "连接建立与关闭"],
  "network.subnet": ["CIDR 与子网", "路由表与默认路由", "NAT 与端口映射", "路径 MTU 与分片"],
  "network.dns": ["记录类型与 TTL", "递归与权威解析", "缓存与污染", "dig 定位解析故障"],
  "network.http": ["请求方法与状态码", "Header 与缓存", "连接复用与 HTTP/2", "流式传输与超时"],
  "network.tls": ["握手与密钥协商", "证书链与 SAN", "信任库与轮换", "TLS 故障排查"],
  "network.socket": ["阻塞与非阻塞", "缓冲区与半包", "连接池与 Keepalive", "Socket 超时"],
  "network.proxy": ["正向代理", "反向代理", "连接终止与转发", "代理头与真实 IP"],
  "network.loadbalancer": ["L4 与 L7 差异", "健康检查", "会话与一致性", "负载算法与容量"],
  "git.model": ["Blob / Tree / Commit", "引用与 HEAD", "提交图遍历", "对象回收与完整性"],
  "git.commits": ["工作区与暂存区", "diff 与 patch", "原子提交", "提交信息与可追踪性"],
  "git.branching": ["分支指针", "fetch 与远程跟踪", "安全 pull", "分支策略"],
  "git.rebase": ["rebase 执行过程", "交互式整理", "冲突中的历史", "改写风险控制"],
  "git.conflicts": ["冲突标记与三方合并", "手动解决", "rerere", "合并后的验证"],
  "git.review": ["小提交与边界", "PR 描述", "评审清单", "自动检查反馈"],
  "git.recovery": ["reflog 定位", "revert 与 reset", "恢复丢失提交", "灾难前的备份"],
  "git.ci": ["触发器与 Pipeline", "构建缓存", "制品留存", "失败重试与通知"],
};

const microSkills = [];
skills.forEach((module) => {
  const topics = [...(microTopics[module.id] || [
    `${module.name}的核心概念`, `${module.name}的最小实践`, `${module.name}的工具与指标`, `${module.name}的故障排查`,
  ])];
  if (topics.length < 5) topics.push(`${module.name}的验证与出口`);
  module.microTopics = topics;
  module.microIds = topics.map((_, index) => `${module.id}.unit-${index + 1}`);
});
skills.forEach((module) => {
  module.microTopics.forEach((topic, index) => {
    const prereqs = index === 0
      ? module.prereqs.map((id) => skillById[id]?.microIds?.at(-1) || `${id}.unit-5`)
      : index === 1
        ? [module.microIds[0]]
        : index === 2
          ? [module.microIds[0], module.microIds[1]]
          : index === 3
            ? [module.microIds[1], module.microIds[2]]
            : [module.microIds[2], module.microIds[3]];
    microSkills.push({
      id: module.microIds[index],
      moduleId: module.id,
      domainId: module.domainId,
      name: topic,
      subtitle: `${module.name.toUpperCase()} · UNIT ${String(index + 1).padStart(2, "0")}`,
      icon: index === 0 ? "book-open" : index === 1 ? "flask-conical" : index === 2 ? "wrench" : "badge-check",
      x: 48 + index * 250,
      y: [220, 420, 180, 390, 290][index],
      tier: index,
      row: 0,
      hours: Math.max(1, Math.round(module.hours / 4)),
      xp: Math.max(20, Math.round(module.xp / 4)),
      prereqs,
      description: `${topic}是${module.name}中的一个独立学习单元。完成后才能进入下一层操作与排障练习。`,
      evidence: module.evidence,
    });
  });
});
const microById = Object.fromEntries(microSkills.map((unit) => [unit.id, unit]));
const storageKey = "ai-infra-domain-tree-progress-v3";
let completed = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]").filter((id) => microById[id]));
let currentDomain = null;
let currentModule = null;
let selectedId = "linux";
let activeTrack = "all";
let activeFilter = "all";
let activeEvidenceFilter = "all";
let query = "";
let roleProfiles = Object.fromEntries(fallbackRoles.map((role) => [role.id, role]));
let activeRoleId = "ai-infra";
let roleOnly = false;
let graphSource = "catalog";
let zoom = 0.88;
let pan = { x: 10, y: 25 };
let dragStart = null;
let toastTimer;

const els = {
  categoryList: document.querySelector("#categoryList"),
  nodesLayer: document.querySelector("#nodesLayer"),
  connectionLayer: document.querySelector("#connectionLayer"),
  treeCanvas: document.querySelector("#treeCanvas"),
  treeViewport: document.querySelector("#treeViewport"),
  detailPanel: document.querySelector("#detailPanel"),
  detailContent: document.querySelector("#detailContent"),
  headerProgress: document.querySelector("#headerProgress"),
  progressText: document.querySelector("#progressText"),
  rankName: document.querySelector("#rankName"),
  zoomValue: document.querySelector("#zoomValue"),
  searchInput: document.querySelector("#searchInput"),
  toast: document.querySelector("#toast"),
  modalBackdrop: document.querySelector("#modalBackdrop"),
  contextBreadcrumb: document.querySelector("#contextBreadcrumb"),
  contextTitle: document.querySelector("#contextTitle"),
  contextMeta: document.querySelector("#contextMeta"),
  backToDomains: document.querySelector("#backToDomains"),
  roleSelect: document.querySelector("#roleSelect"),
  roleSummary: document.querySelector("#roleSummary"),
  roleFocusOnly: document.querySelector("#roleFocusOnly"),
  graphSourceBadge: document.querySelector("#graphSourceBadge"),
  overviewPercent: document.querySelector("#overviewPercent"),
  overviewMeter: document.querySelector("#overviewMeter"),
  completedCount: document.querySelector("#completedCount"),
  availableCount: document.querySelector("#availableCount"),
  remainingHours: document.querySelector("#remainingHours"),
  continueButton: document.querySelector("#continueButton"),
  clearSearch: document.querySelector("#clearSearch"),
  resultSummary: document.querySelector("#resultSummary"),
  verifiedCount: document.querySelector("#verifiedCount"),
  reviewCount: document.querySelector("#reviewCount"),
  candidateCount: document.querySelector("#candidateCount"),
  candidateList: document.querySelector("#candidateList"),
};

function icon(name) { return fallbackIcon(name); }
function fallbackIcon(name) {
  const paths = {
    "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    circle: '<circle cx="12" cy="12" r="7"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    minus: '<path d="M5 12h14"/>',
    move: '<path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  return `<svg class="fallback-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || '<circle cx="12" cy="12" r="5"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>'}</svg>`;
}
function domainSkills(domainId) { return skills.filter((skill) => skill.domainId === domainId); }
function domainEvidence(domain) { return evidenceCatalog[domain.id] || { status: "candidate", label: "待验证", basis: "尚未形成可审阅来源" }; }
function moduleProgress(module) {
  const done = module.microIds.filter((id) => completed.has(id)).length;
  return { done, total: module.microIds.length, percent: Math.round(done / module.microIds.length * 100) };
}
function moduleComplete(module) { return module.microIds.every((id) => completed.has(id)); }
function moduleAvailable(module) { return !moduleComplete(module) && module.prereqs.every((id) => moduleComplete(skillById[id])); }
function moduleStatus(module) { return moduleComplete(module) ? "completed" : moduleAvailable(module) || moduleProgress(module).done > 0 ? "available" : "locked"; }
function microAvailable(unit) { return !completed.has(unit.id) && unit.prereqs.every((id) => completed.has(id)); }
function microStatus(unit) { return completed.has(unit.id) ? "completed" : microAvailable(unit) ? "available" : "locked"; }
function skillAvailable(skill) { return moduleAvailable(skill); }
function skillStatus(skill) { return moduleStatus(skill); }
function skillDependents(id) { return skills.filter((skill) => skill.prereqs.includes(id)); }
function unitDependents(id) { return microSkills.filter((unit) => unit.prereqs.includes(id)); }
function domainProgress(domainId) {
  const items = domainSkills(domainId);
  const done = items.reduce((sum, module) => sum + moduleProgress(module).done, 0);
  const total = items.reduce((sum, module) => sum + moduleProgress(module).total, 0);
  const modulesDone = items.filter(moduleComplete).length;
  return { done, total, modulesDone, modulesTotal: items.length, percent: Math.round(done / total * 100) };
}
function domainExitReady(domain) { return domain.gate.every((id) => moduleComplete(skillById[id])); }
function domainStatus(domain) {
  const progress = domainProgress(domain.id);
  if (progress.done === progress.total) return "completed";
  return domainSkills(domain.id).some(skillAvailable) || progress.done > 0 ? "available" : "locked";
}
function domainStateLabel(domain) {
  const progress = domainProgress(domain.id);
  if (progress.done === progress.total) return "完全掌握";
  if (domainExitReady(domain)) return "出口已具备";
  if (progress.done > 0) return "进行中";
  if (domainStatus(domain) === "available") return "可进入";
  return "待解锁";
}
function domainDependents(id) { return domains.filter((domain) => domain.prereqDomains.includes(id)); }
function refreshIcons() {
  if (window.lucide) {
    try { window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } }); } catch (error) { /* use the local fallback below */ }
  }
  document.querySelectorAll("i[data-lucide]").forEach((node) => { node.outerHTML = fallbackIcon(node.dataset.lucide); });
}

function activeRole() { return roleProfiles[activeRoleId] || fallbackRoles[0]; }
function roleScores() { return Object.fromEntries((activeRole().skills || []).map((skill) => [skill.id, skill])); }
function roleMatch(id) { return roleScores()[id] || null; }
function roleVisible(id) { return !roleOnly || Boolean(roleMatch(id)); }
function evidenceVisible(item) {
  const evidence = item.domainId ? (item.evidence || evidenceCatalog[item.domainId] || { status: "candidate" }) : domainEvidence(item);
  return activeEvidenceFilter === "all" || evidence.status === activeEvidenceFilter;
}

function roleFitMarkup(id) {
  const match = roleMatch(id);
  if (!match) return `<span class="empty-relation">该职业通常不把此领域作为核心技能组</span>`;
  const relevance = Math.round(match.relevance * 100);
  const confidence = Math.round(match.confidence * 100);
  const evidenceLabel = match.evidenceStatus === "review" ? "技能有来源 · 组合需复核" : "技能有来源";
  return `<div class="role-fit"><div class="role-fit-head"><span>${activeRole().name} 匹配度</span><b>${relevance}%</b></div><div class="role-fit-track"><i style="width:${relevance}%"></i></div><div class="role-fit-meta"><span>映射置信度 ${confidence}%</span><span>${evidenceLabel}</span></div><small class="role-fit-evidence">${match.evidence}</small></div>`;
}

function evidenceMarkup(item) {
  const evidence = item.domainId ? item.evidence : domainEvidence(item);
  const source = evidence.url ? `<a href="${evidence.url}" target="_blank" rel="noreferrer">${evidence.source}</a>` : evidence.source || "暂无来源";
  return `<div class="evidence-note ${evidence.status}"><div><span class="evidence-dot"></span><strong>${evidence.label}</strong><span>${evidence.basis}</span></div><small>依据：${source}</small></div>`;
}

function nextLearningUnit() {
  const pool = (currentModule
    ? microSkills.filter((unit) => unit.moduleId === currentModule)
    : currentDomain
      ? microSkills.filter((unit) => unit.domainId === currentDomain)
      : microSkills)
    .filter(microAvailable);
  return pool.sort((a, b) => {
    const relevanceA = roleMatch(a.domainId)?.relevance || 0;
    const relevanceB = roleMatch(b.domainId)?.relevance || 0;
    return relevanceB - relevanceA || a.tier - b.tier || a.hours - b.hours;
  })[0] || null;
}

function visibleItemCount() {
  if (currentModule) return microSkills.filter((unit) => unit.moduleId === currentModule && skillVisible(unit)).length;
  if (currentDomain) return domainSkills(currentDomain).filter(skillVisible).length;
  return domains.filter(domainVisible).length;
}

function renderQuickStats() {
  const total = microSkills.length;
  const percent = total ? Math.round(completed.size / total * 100) : 0;
  const available = microSkills.filter(microAvailable).length;
  const remainingHours = microSkills.filter((unit) => !completed.has(unit.id)).reduce((sum, unit) => sum + unit.hours, 0);
  els.overviewPercent.textContent = `${percent}%`;
  els.overviewMeter.style.width = `${percent}%`;
  els.completedCount.textContent = completed.size;
  els.availableCount.textContent = available;
  els.remainingHours.textContent = `${remainingHours}h`;
  els.resultSummary.textContent = `${visibleItemCount()} ${currentModule ? "个知识点" : currentDomain ? "个模块" : "个领域"}`;
  els.clearSearch.hidden = !query;
  const domainEvidenceCounts = domains.reduce((counts, domain) => {
    counts[domainEvidence(domain).status] = (counts[domainEvidence(domain).status] || 0) + 1;
    return counts;
  }, {});
  els.verifiedCount.textContent = domainEvidenceCounts.verified || 0;
  els.reviewCount.textContent = domainEvidenceCounts.review || 0;
  els.candidateCount.textContent = candidateTopics.length;
  els.candidateList.innerHTML = candidateTopics.map((topic) => `<div class="candidate-item"><strong>${topic.name}</strong><span>${topic.reason}</span></div>`).join("");
}

function renderRoleLens() {
  const role = activeRole();
  if (!els.roleSelect) return;
  els.roleSelect.innerHTML = Object.values(roleProfiles).map((item) => `<option value="${item.id}" ${item.id === activeRoleId ? "selected" : ""}>${item.name}${item.core ? " · 核心" : ""}</option>`).join("");
  els.roleSummary.textContent = `${role.core ? "核心职业组 · " : ""}${role.summary}`;
  els.roleSummary.style.setProperty("--role-color", role.color);
  els.graphSourceBadge.textContent = graphSource === "neo4j" ? "Neo4j" : "目录回退";
  els.graphSourceBadge.classList.toggle("is-neo4j", graphSource === "neo4j");
  els.roleFocusOnly.checked = roleOnly;
}

function renderCategories() {
  const rows = [
    { id: "all", name: "全部领域", icon: "layout-dashboard", color: "#aebbc3", count: `${completed.size}/${microSkills.length}` },
    ...Object.entries(tracks).map(([id, track]) => {
      const trackSkills = microSkills.filter((unit) => domainById[unit.domainId].track === id);
      return { id, ...track, count: `${trackSkills.filter((unit) => completed.has(unit.id)).length}/${trackSkills.length}` };
    }),
  ];
  els.categoryList.innerHTML = rows.map((row) => `<button class="category-button ${activeTrack === row.id ? "active" : ""}" type="button" data-track="${row.id}" style="--cat-color:${row.color}"><span class="category-icon">${icon(row.icon)}</span><span>${row.name}</span><b>${row.count}</b></button>`).join("");
  els.categoryList.querySelectorAll("[data-track]").forEach((button) => button.addEventListener("click", () => {
    activeTrack = button.dataset.track;
    goOverview(false);
    document.querySelector("#leftPanel").classList.remove("mobile-open");
  }));
}

function domainVisible(domain) {
  const trackMatch = activeTrack === "all" || domain.track === activeTrack;
  const filterMatch = activeFilter === "all" || domainStatus(domain) === activeFilter;
  const roleMatchFilter = roleVisible(domain.id);
  const searchable = `${domain.name} ${domain.description} ${domainSkills(domain.id).map((skill) => skill.name).join(" ")}`.toLowerCase();
  return trackMatch && filterMatch && roleMatchFilter && evidenceVisible(domain) && searchable.includes(query.toLowerCase());
}

function skillVisible(skill) {
  const status = skill.moduleId ? microStatus(skill) : moduleStatus(skill);
  const filterMatch = activeFilter === "all" || status === activeFilter;
  const roleMatchFilter = roleVisible(skill.domainId);
  return filterMatch && roleMatchFilter && evidenceVisible(skill) && `${skill.name} ${skill.subtitle} ${skill.description}`.toLowerCase().includes(query.toLowerCase());
}

function renderNodes() {
  if (!currentDomain) {
    els.nodesLayer.innerHTML = domains.map((domain) => {
      const track = tracks[domain.track];
      const status = domainStatus(domain);
      const progress = domainProgress(domain.id);
      const visible = domainVisible(domain);
      const statusIcon = status === "completed" ? "check" : status === "locked" ? "lock" : "circle-dot";
      const fit = roleMatch(domain.id);
      return `<button class="skill-node domain-node ${status} ${fit ? "role-focus" : "role-muted"} ${selectedId === domain.id ? "selected" : ""} ${visible ? "" : "dimmed"}" type="button" data-domain="${domain.id}" aria-label="${domain.name}，${domainStateLabel(domain)}，完成 ${progress.done}/${progress.total}" style="left:${domain.x}px;top:${domain.y}px;--node-color:${track.color};--node-progress:${progress.percent}%"><span class="domain-state">${fit ? `职业 ${Math.round(fit.relevance * 100)}%` : domainStateLabel(domain)}</span><span class="node-icon">${icon(domain.icon)}<span class="node-status ${status === "locked" ? "lock" : ""}">${icon(statusIcon)}</span></span><span class="node-content"><strong>${domain.name}</strong><small>${progress.modulesTotal} 模块 · ${progress.total} 知识单元</small></span><span class="node-xp">${progress.done} / ${progress.total}</span></button>`;
    }).join("");
    els.nodesLayer.querySelectorAll("[data-domain]").forEach((node) => {
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        openDomain(node.dataset.domain);
      });
    });
    return;
  }

  if (currentModule) {
    const units = microSkills.filter((unit) => unit.moduleId === currentModule);
    els.nodesLayer.innerHTML = units.map((unit) => {
      const track = tracks[domainById[unit.domainId].track];
      const status = microStatus(unit);
      const visible = skillVisible(unit);
      const statusIcon = status === "completed" ? "check" : status === "locked" ? "lock" : "circle-dot";
      return `<button class="skill-node unit-node ${status} ${roleMatch(unit.domainId) ? "role-focus" : "role-muted"} ${selectedId === unit.id ? "selected" : ""} ${visible ? "" : "dimmed"}" type="button" data-unit="${unit.id}" aria-label="${unit.name}，${status === "completed" ? "已掌握" : status === "available" ? "可学习" : "未解锁"}" style="left:${unit.x}px;top:${unit.y}px;--node-color:${track.color}"><span class="domain-state">${status === "completed" ? "已掌握" : status === "available" ? "可学习" : "待解锁"}</span><span class="node-icon">${icon(unit.icon)}<span class="node-status ${status === "locked" ? "lock" : ""}">${icon(statusIcon)}</span></span><span class="node-content"><strong>${unit.name}</strong><small>${unit.subtitle}</small></span><span class="node-xp">${unit.hours} H</span></button>`;
    }).join("");
    els.nodesLayer.querySelectorAll("[data-unit]").forEach((node) => node.addEventListener("click", (event) => {
      event.stopPropagation();
      selectedId = node.dataset.unit;
      renderNodes(); renderConnections(); renderDetail(); updateHash();
      if (window.innerWidth <= 1100) els.detailPanel.classList.add("open");
    }));
    return;
  }

  const items = domainSkills(currentDomain);
  els.nodesLayer.innerHTML = items.map((module) => {
    const track = tracks[domainById[module.domainId].track];
    const status = moduleStatus(module);
    const progress = moduleProgress(module);
    const visible = skillVisible(module);
    const statusIcon = status === "completed" ? "check" : status === "locked" ? "lock" : "circle-dot";
    const fit = roleMatch(module.domainId);
    return `<button class="skill-node module-node ${status} ${fit ? "role-focus" : "role-muted"} ${selectedId === module.id ? "selected" : ""} ${visible ? "" : "dimmed"}" type="button" data-skill="${module.id}" aria-label="${module.name}，${status === "completed" ? "已掌握" : status === "available" ? "可进入" : "未解锁"}，完成 ${progress.done}/${progress.total}" style="left:${module.x}px;top:${module.y}px;--node-color:${track.color};--node-progress:${progress.percent}%"><span class="domain-state">${fit ? `职业 ${Math.round(fit.relevance * 100)}%` : `${progress.done}/${progress.total} UNITS`}</span><span class="node-icon">${icon(module.icon)}<span class="node-status ${status === "locked" ? "lock" : ""}">${icon(statusIcon)}</span></span><span class="node-content"><strong>${module.name}</strong><small>${module.subtitle}</small></span><span class="node-xp">${progress.percent}%</span></button>`;
  }).join("");
  els.nodesLayer.querySelectorAll("[data-skill]").forEach((node) => node.addEventListener("click", (event) => {
    event.stopPropagation();
    openModule(node.dataset.skill);
  }));
}

function connectionPath(source, target, sourceHeight = 78) {
  const x1 = source.x + 168;
  const y1 = source.y + sourceHeight / 2;
  const x2 = target.x;
  const y2 = target.y + (target.height || 78) / 2;
  const mid = x1 + (x2 - x1) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

function renderConnections() {
  const paths = [];
  if (!currentDomain) {
    domains.forEach((domain) => domain.prereqDomains.forEach((sourceId) => {
      const source = domainById[sourceId];
      const touches = selectedId === domain.id || selectedId === source.id;
      const complete = domainExitReady(source);
      const visible = domainVisible(source) && domainVisible(domain);
      paths.push(`<path class="connection ${touches ? "active" : ""} ${complete ? "complete" : ""} ${visible ? "" : "dimmed"}" marker-end="url(#arrowhead)" d="${connectionPath(source, domain, 86)}"/>`);
    }));
  } else if (currentModule) {
    const units = microSkills.filter((unit) => unit.moduleId === currentModule);
    units.forEach((unit) => unit.prereqs.filter((id) => microById[id]?.moduleId === currentModule).forEach((sourceId) => {
      const source = microById[sourceId];
      const touches = selectedId === unit.id || selectedId === source.id;
      const complete = completed.has(source.id) && completed.has(unit.id);
      const visible = skillVisible(source) && skillVisible(unit);
      paths.push(`<path class="connection ${touches ? "active" : ""} ${complete ? "complete" : ""} ${visible ? "" : "dimmed"}" marker-end="url(#arrowhead)" d="${connectionPath(source, unit)}"/>`);
    }));
  } else {
    domainSkills(currentDomain).forEach((skill) => skill.prereqs.filter((id) => skillById[id]?.domainId === currentDomain).forEach((sourceId) => {
      const source = skillById[sourceId];
      const touches = selectedId === skill.id || selectedId === source.id;
      const complete = moduleComplete(source) && moduleComplete(skill);
      const visible = skillVisible(source) && skillVisible(skill);
      paths.push(`<path class="connection ${touches ? "active" : ""} ${complete ? "complete" : ""} ${visible ? "" : "dimmed"}" marker-end="url(#arrowhead)" d="${connectionPath(source, skill)}"/>`);
    }));
  }
  els.connectionLayer.innerHTML = `<defs><marker id="arrowhead" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 z"></path></marker></defs>${paths.join("")}`;
}

function domainRelationMarkup(items, emptyText) {
  if (!items.length) return `<span class="empty-relation">${emptyText}</span>`;
  return `<div class="relation-list">${items.map((domain) => `<button class="relation-button" type="button" data-domain-link="${domain.id}" style="--relation-color:${tracks[domain.track].color}">${icon(domainExitReady(domain) ? "circle-check" : "circle")}${domain.name}</button>`).join("")}</div>`;
}

function skillRelationMarkup(items, emptyText, sourceDomain) {
  if (!items.length) return `<span class="empty-relation">${emptyText}</span>`;
  return `<div class="relation-list">${items.map((unit) => {
    const domain = domainById[unit.domainId];
    const module = skillById[unit.moduleId];
    const label = unit.domainId === sourceDomain ? `${module.name} / ${unit.name}` : `${domain.name} / ${module.name} / ${unit.name}`;
    return `<button class="relation-button" type="button" data-unit-link="${unit.id}" style="--relation-color:${tracks[domain.track].color}">${icon(completed.has(unit.id) ? "circle-check" : "circle")}${label}</button>`;
  }).join("")}</div>`;
}

function moduleRelationMarkup(items, emptyText) {
  if (!items.length) return `<span class="empty-relation">${emptyText}</span>`;
  return `<div class="relation-list">${items.map((module) => {
    const domain = domainById[module.domainId];
    const progress = moduleProgress(module);
    return `<button class="relation-button" type="button" data-module-link="${module.id}" style="--relation-color:${tracks[domain.track].color}">${icon(moduleComplete(module) ? "circle-check" : "circle")}${domain.name} / ${module.name}<small>${progress.done}/${progress.total}</small></button>`;
  }).join("")}</div>`;
}

function bindDetailLinks() {
  document.querySelectorAll("[data-domain-link]").forEach((button) => button.addEventListener("click", () => {
    if (currentDomain) openDomain(button.dataset.domainLink);
    else { selectedId = button.dataset.domainLink; renderAll(false); }
  }));
  document.querySelectorAll("[data-unit-link]").forEach((button) => button.addEventListener("click", () => focusUnit(button.dataset.unitLink)));
  document.querySelectorAll("[data-module-link]").forEach((button) => button.addEventListener("click", () => openModule(button.dataset.moduleLink)));
}

function renderDomainDetail(domain) {
  const track = tracks[domain.track];
  const progress = domainProgress(domain.id);
  const totalHours = domainSkills(domain.id).reduce((sum, skill) => sum + skill.hours, 0);
  els.detailContent.innerHTML = `<div style="--skill-color:${track.color}"><span class="detail-category">${icon(track.icon)} ${track.name.toUpperCase()} / 领域</span><div class="detail-icon">${icon(domain.icon)}</div><h2>${domain.name}</h2><span class="detail-subtitle">${domainStateLabel(domain)} · ${progress.modulesDone}/${progress.modulesTotal} 个模块 · ${progress.done}/${progress.total} 个知识单元</span><p class="detail-description">${domain.description}</p>${evidenceMarkup(domain)}<div class="detail-stats"><div class="detail-stat"><span>知识单元</span><b>${progress.total} UNITS</b></div><div class="detail-stat"><span>预计用时</span><b>${totalHours} H</b></div></div><section class="detail-section"><h3>职业视图 · ${activeRole().name}</h3>${roleFitMarkup(domain.id)}</section><section class="detail-section"><h3>学习成果 · OUTCOME</h3><p class="detail-description">${domain.outcome}</p></section><section class="detail-section"><h3>建议前置领域</h3>${domainRelationMarkup(domain.prereqDomains.map((id) => domainById[id]), "无领域级前置，可以直接进入")}</section><section class="detail-section"><h3>关键出口模块</h3>${moduleRelationMarkup(domain.gate.map((id) => skillById[id]), "无")}</section><section class="detail-section"><h3>可衔接领域</h3>${domainRelationMarkup(domainDependents(domain.id), "当前没有直接衔接领域")}</section><button class="master-button" id="openDomainButton" type="button">进入 ${domain.name} 模块图</button></div>`;
  document.querySelector("#openDomainButton").addEventListener("click", () => openDomain(domain.id));
  bindDetailLinks();
}

function renderModuleDetail(module) {
  const domain = domainById[module.domainId];
  const track = tracks[domain.track];
  const progress = moduleProgress(module);
  const dependents = skillDependents(module.id);
  const units = microSkills.filter((unit) => unit.moduleId === module.id);
  els.detailContent.innerHTML = `<div style="--skill-color:${track.color}"><span class="detail-category">${icon(domain.icon)} ${domain.name.toUpperCase()} / 模块</span><div class="detail-icon">${icon(module.icon)}</div><h2>${module.name}</h2><span class="detail-subtitle">${progress.done}/${progress.total} 个知识单元 · ${moduleStatus(module) === "locked" ? "等待前置模块" : "可进入"}</span><p class="detail-description">${module.description}</p>${evidenceMarkup(module)}<div class="detail-stats"><div class="detail-stat"><span>知识单元</span><b>${progress.total} UNITS</b></div><div class="detail-stat"><span>预计用时</span><b>${module.hours} H</b></div></div><section class="detail-section"><h3>职业视图 · ${activeRole().name}</h3>${roleFitMarkup(module.domainId)}</section><section class="detail-section"><h3>知识点清单 · LEARNING UNITS</h3>${skillRelationMarkup(units, "暂无知识点", module.domainId)}</section><section class="detail-section"><h3>模块前置 · MODULE PREREQUISITES</h3>${moduleRelationMarkup(module.prereqs.map((id) => skillById[id]), "无模块级前置")}</section><section class="detail-section"><h3>后续解锁 · UNLOCKS</h3>${moduleRelationMarkup(dependents, "这是当前模块图的出口")}</section><button class="master-button" id="openModuleButton" type="button">进入 ${module.name} 知识图</button></div>`;
  document.querySelector("#openModuleButton").addEventListener("click", () => openModule(module.id));
  bindDetailLinks();
}

function renderUnitDetail(unit) {
  const module = skillById[unit.moduleId];
  const domain = domainById[unit.domainId];
  const track = tracks[domain.track];
  const status = microStatus(unit);
  const dependents = unitDependents(unit.id);
  const buttonText = status === "locked" ? "完成前置知识后解锁" : status === "completed" ? "已掌握 · 点击撤销" : "标记为已掌握";
  els.detailContent.innerHTML = `<div style="--skill-color:${track.color}"><span class="detail-category">${icon(domain.icon)} ${domain.name.toUpperCase()} / ${module.name}</span><div class="detail-icon">${icon(unit.icon)}</div><h2>${unit.name}</h2><span class="detail-subtitle">知识单元 ${unit.subtitle} · ${unit.hours} 小时</span><p class="detail-description">${unit.description}</p>${evidenceMarkup(module)}<div class="detail-stats"><div class="detail-stat"><span>最小学习单元</span><b>${unit.hours} H</b></div><div class="detail-stat"><span>技能经验</span><b>+${unit.xp} XP</b></div></div><section class="detail-section"><h3>职业视图 · ${activeRole().name}</h3>${roleFitMarkup(unit.domainId)}</section><section class="detail-section"><h3>全部前置 · PREREQUISITES</h3>${skillRelationMarkup(unit.prereqs.map((id) => microById[id]), "无前置要求，可以立即开始", unit.domainId)}</section><section class="detail-section"><h3>后续解锁 · UNLOCKS</h3>${skillRelationMarkup(dependents, "这是当前模块的出口知识点", unit.domainId)}</section><button class="master-button ${status === "completed" ? "completed" : ""}" id="masterButton" type="button" ${status === "locked" ? "disabled" : ""}>${buttonText}</button></div>`;
  document.querySelector("#masterButton").addEventListener("click", toggleCompleted);
  bindDetailLinks();
}

function renderDetail() {
  if (!currentDomain) renderDomainDetail(domainById[selectedId] || domains[0]);
  else if (currentModule) renderUnitDetail(microById[selectedId] || microSkills.find((unit) => unit.moduleId === currentModule));
  else renderModuleDetail(skillById[selectedId] || domainSkills(currentDomain)[0]);
  refreshIcons();
}

function renderContext() {
  if (!currentDomain) {
    els.backToDomains.hidden = true;
    els.contextBreadcrumb.textContent = "SKILL GRAPH / 全局领域图";
    els.contextTitle.textContent = "领域总览";
    els.contextMeta.textContent = `${domains.length} 个领域 · ${microSkills.length} 个知识单元`;
    els.searchInput.placeholder = "搜索领域或技能…";
  } else if (currentModule) {
    const domain = domainById[currentDomain];
    const module = skillById[currentModule];
    const progress = moduleProgress(module);
    els.backToDomains.hidden = false;
    els.backToDomains.innerHTML = `${icon("arrow-left")} 返回模块图`;
    els.contextBreadcrumb.textContent = `SKILL GRAPH / ${domain.name} / ${module.name}`;
    els.contextTitle.textContent = `${module.name}知识图`;
    els.contextMeta.textContent = `${progress.done}/${progress.total} 已掌握 · 箭头表示前置到后置`;
    els.searchInput.placeholder = `搜索${module.name}知识点…`;
  } else {
    const domain = domainById[currentDomain];
    const progress = domainProgress(currentDomain);
    els.backToDomains.hidden = false;
    els.backToDomains.innerHTML = `${icon("arrow-left")} 领域总览`;
    els.contextBreadcrumb.textContent = `SKILL GRAPH / ${tracks[domain.track].name} / ${domain.name}`;
    els.contextTitle.textContent = `${domain.name}技能树`;
    els.contextMeta.textContent = `${progress.modulesDone}/${progress.modulesTotal} 个模块 · ${progress.done}/${progress.total} 个知识单元 · ${progress.percent}%`;
    els.searchInput.placeholder = `搜索${domain.name}技能…`;
  }
}

function renderProgress() {
  const percent = completed.size / microSkills.length * 100;
  els.headerProgress.style.width = `${percent}%`;
  els.progressText.textContent = `${completed.size} / ${microSkills.length}`;
  const rankIndex = Math.min(5, Math.floor(percent / 20));
  els.rankName.textContent = ["见习工程师", "系统探索者", "基础设施工程师", "AI 系统专家", "平台架构师", "Infra 统帅"][rankIndex];

  const nextUnit = nextLearningUnit();
  els.continueButton.disabled = !nextUnit;
  if (nextUnit) {
    const domain = domainById[nextUnit.domainId];
    const module = skillById[nextUnit.moduleId];
    const progress = currentModule ? moduleProgress(module) : domainProgress(domain.id);
    document.querySelector("#missionTitle").textContent = `学习 ${nextUnit.name}`;
    document.querySelector("#missionDescription").textContent = `${domain.name} / ${module.name} · ${nextUnit.hours} 小时`;
    document.querySelector("#missionProgress").style.width = `${progress.percent}%`;
    document.querySelector("#missionMeta").textContent = currentModule ? `${progress.done} / ${progress.total} 个知识单元` : `${progress.done} / ${progress.total} 个领域知识单元`;
    document.querySelector("#continueLabel").textContent = "打开知识点";
  } else {
    document.querySelector("#missionTitle").textContent = "当前路径已完成";
    document.querySelector("#missionDescription").textContent = "返回领域总览，选择下一条学习路径。";
    document.querySelector("#missionProgress").style.width = "100%";
    document.querySelector("#missionMeta").textContent = `${completed.size} / ${microSkills.length} 个知识单元`;
    document.querySelector("#continueLabel").textContent = "路径已完成";
  }
}

function renderAll(shouldFit = false) {
  renderRoleLens(); renderCategories(); renderNodes(); renderConnections(); renderDetail(); renderContext(); renderProgress(); renderQuickStats(); refreshIcons();
  if (shouldFit) requestAnimationFrame(fitCanvas);
}

async function loadRoleCatalog() {
  try {
    const response = await fetch("/api/roles", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("roles endpoint unavailable");
    const payload = await response.json();
    if (Array.isArray(payload.roles) && payload.roles.length) {
      const summaries = Object.fromEntries(payload.roles.map((role) => [role.id, role]));
      roleProfiles = Object.fromEntries(Object.keys(summaries).map((id) => [id, { ...(roleProfiles[id] || {}), ...summaries[id] }]));
      graphSource = payload.source || "catalog";
    }
  } catch (error) {
    graphSource = "catalog";
  }
  await loadRoleProfile(activeRoleId, false);
  renderAll(false);
}

async function loadRoleProfile(roleId, rerender = true) {
  activeRoleId = roleProfiles[roleId] ? roleId : "ai-infra";
  try {
    const response = await fetch(`/api/graph?role=${encodeURIComponent(activeRoleId)}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("graph endpoint unavailable");
    const profile = await response.json();
    roleProfiles[activeRoleId] = { ...roleProfiles[activeRoleId], ...profile };
    graphSource = profile.source || graphSource;
  } catch (error) {
    graphSource = "catalog";
  }
  if (rerender) renderAll(false);
}

function updateHash() {
  const hash = currentModule ? `#module/${currentDomain}/${currentModule}/${selectedId}` : currentDomain ? `#domain/${currentDomain}/${selectedId}` : `#overview/${selectedId}`;
  history.replaceState(null, "", hash);
}

function openDomain(domainId, skillId = null) {
  currentDomain = domainId;
  currentModule = null;
  activeTrack = domainById[domainId].track;
  query = "";
  els.searchInput.value = "";
  const available = domainSkills(domainId).find(skillAvailable);
  selectedId = skillId && skillById[skillId]?.domainId === domainId ? skillId : (available || domainSkills(domainId)[0]).id;
  updateHash(); renderAll(true);
}

function openModule(moduleId, unitId = null) {
  const module = skillById[moduleId];
  if (!module) return;
  currentDomain = module.domainId;
  currentModule = moduleId;
  activeTrack = domainById[module.domainId].track;
  query = "";
  els.searchInput.value = "";
  const available = microSkills.find((unit) => unit.moduleId === moduleId && microAvailable(unit));
  selectedId = unitId && microById[unitId]?.moduleId === moduleId ? unitId : (available || microSkills.find((unit) => unit.moduleId === moduleId)).id;
  updateHash(); renderAll(true);
}

function goOverview(resetTrack = false) {
  const previous = currentDomain ? domainById[currentDomain] : domainById[selectedId];
  currentDomain = null;
  currentModule = null;
  if (resetTrack) activeTrack = "all";
  const firstInTrack = domains.find((domain) => activeTrack === "all" || domain.track === activeTrack);
  selectedId = previous && (activeTrack === "all" || previous.track === activeTrack) ? previous.id : firstInTrack.id;
  query = "";
  els.searchInput.value = "";
  updateHash(); renderAll(true);
}

function focusSkill(skillId) {
  const skill = skillById[skillId];
  if (!skill) return;
  if (currentDomain !== skill.domainId) openDomain(skill.domainId, skill.id);
  else {
    selectedId = skill.id;
    pan = { x: els.treeViewport.clientWidth / 2 - (skill.x + 84) * zoom, y: els.treeViewport.clientHeight / 2 - (skill.y + 39) * zoom };
    applyTransform(); updateHash(); renderNodes(); renderConnections(); renderDetail();
  }
}

function focusUnit(unitId) {
  const unit = microById[unitId];
  if (!unit) return;
  if (currentModule !== unit.moduleId) openModule(unit.moduleId, unit.id);
  else {
    selectedId = unit.id;
    pan = { x: els.treeViewport.clientWidth / 2 - (unit.x + 84) * zoom, y: els.treeViewport.clientHeight / 2 - (unit.y + 43) * zoom };
    applyTransform(); updateHash(); renderNodes(); renderConnections(); renderDetail();
  }
}

function continueLearning() {
  const nextUnit = nextLearningUnit();
  if (!nextUnit) {
    showToast("当前学习路径已经完成");
    return;
  }
  focusUnit(nextUnit.id);
  document.querySelector("#leftPanel").classList.remove("mobile-open");
  if (window.innerWidth <= 1100) els.detailPanel.classList.add("open");
}

function toggleCompleted() {
  const unit = microById[selectedId];
  if (!unit) return;
  if (completed.has(unit.id)) {
    const completedDependents = unitDependents(unit.id).filter((item) => completed.has(item.id));
    if (completedDependents.length) {
      showToast(`请先撤销后续技能：${completedDependents.map((item) => item.name).join("、")}`);
      return;
    }
    completed.delete(unit.id);
    showToast(`已撤销「${unit.name}」`);
  } else if (microAvailable(unit)) {
    completed.add(unit.id);
    showToast(`掌握「${unit.name}」，获得 ${unit.xp} XP`);
  }
  localStorage.setItem(storageKey, JSON.stringify([...completed]));
  renderAll(false);
}

function applyTransform() {
  els.treeCanvas.style.transform = `translate(${pan.x}px,${pan.y}px) scale(${zoom})`;
  els.zoomValue.textContent = `${Math.round(zoom * 100)}%`;
}

function setZoom(next, centerX = els.treeViewport.clientWidth / 2, centerY = els.treeViewport.clientHeight / 2) {
  const clamped = Math.min(1.35, Math.max(0.55, next));
  const worldX = (centerX - pan.x) / zoom;
  const worldY = (centerY - pan.y) / zoom;
  pan.x = centerX - worldX * clamped;
  pan.y = centerY - worldY * clamped;
  zoom = clamped;
  applyTransform();
}

function fitCanvas() {
  const padding = 34;
  zoom = Math.max(0.55, Math.min(1, (els.treeViewport.clientWidth - padding * 2) / 1320, (els.treeViewport.clientHeight - padding * 2) / 820));
  pan = { x: (els.treeViewport.clientWidth - 1320 * zoom) / 2, y: (els.treeViewport.clientHeight - 820 * zoom) / 2 };
  applyTransform();
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function restoreHash() {
  const parts = location.hash.replace(/^#/, "").split("/");
  if (parts[0] === "module" && domainById[parts[1]] && skillById[parts[2]]?.domainId === parts[1]) {
    currentDomain = parts[1];
    currentModule = parts[2];
    activeTrack = domainById[currentDomain].track;
    selectedId = microById[parts[3]]?.moduleId === currentModule ? parts[3] : microSkills.find((unit) => unit.moduleId === currentModule).id;
  } else if (parts[0] === "domain" && domainById[parts[1]]) {
    currentDomain = parts[1];
    activeTrack = domainById[currentDomain].track;
    selectedId = skillById[parts[2]]?.domainId === currentDomain ? parts[2] : domainSkills(currentDomain)[0].id;
  } else if (parts[0] === "overview" && domainById[parts[1]]) selectedId = parts[1];
}

function bindEvents() {
  document.querySelector("#brandHome").addEventListener("click", (event) => { event.preventDefault(); goOverview(true); });
  document.querySelector("#showAllButton").addEventListener("click", () => goOverview(true));
  document.querySelector("#roadmapButton").addEventListener("click", () => { goOverview(true); showToast("已返回 AI Infra 领域总览"); });
  els.backToDomains.addEventListener("click", () => {
    if (currentModule) {
      currentModule = null;
      selectedId = domainSkills(currentDomain)[0].id;
      updateHash(); renderAll(true);
    } else goOverview(true);
  });
  document.querySelector("#zoomIn").addEventListener("click", () => setZoom(zoom + 0.1));
  document.querySelector("#zoomOut").addEventListener("click", () => setZoom(zoom - 0.1));
  document.querySelector("#fitView").addEventListener("click", fitCanvas);
  document.querySelector("#closeDetail").addEventListener("click", () => els.detailPanel.classList.remove("open"));
  document.querySelector("#mobileCategoryButton").addEventListener("click", () => document.querySelector("#leftPanel").classList.toggle("mobile-open"));
  els.continueButton.addEventListener("click", continueLearning);
  els.clearSearch.addEventListener("click", () => {
    query = "";
    els.searchInput.value = "";
    els.searchInput.focus();
    renderNodes(); renderConnections(); renderQuickStats(); refreshIcons();
  });
  els.roleSelect.addEventListener("change", (event) => loadRoleProfile(event.target.value));
  els.roleFocusOnly.addEventListener("change", (event) => { roleOnly = event.target.checked; renderAll(false); });
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderNodes(); renderConnections(); renderQuickStats(); refreshIcons();
  }));
  document.querySelectorAll("[data-evidence]").forEach((button) => button.addEventListener("click", () => {
    activeEvidenceFilter = button.dataset.evidence;
    document.querySelectorAll("[data-evidence]").forEach((item) => item.classList.toggle("active", item === button));
    renderNodes(); renderConnections(); renderQuickStats(); refreshIcons();
  }));
  els.searchInput.addEventListener("input", (event) => {
    query = event.target.value.trim();
    renderNodes(); renderConnections(); renderQuickStats(); refreshIcons();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== els.searchInput) { event.preventDefault(); els.searchInput.focus(); }
    if (event.key.toLowerCase() === "n" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "SELECT") { event.preventDefault(); continueLearning(); }
    if (event.key === "Escape") {
      if (query) { query = ""; els.searchInput.value = ""; renderNodes(); renderConnections(); renderQuickStats(); refreshIcons(); }
      else { els.detailPanel.classList.remove("open"); els.modalBackdrop.hidden = true; }
    }
  });
  els.treeViewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = els.treeViewport.getBoundingClientRect();
    setZoom(zoom + (event.deltaY > 0 ? -0.08 : 0.08), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  els.treeViewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".skill-node") || event.target.closest(".context-back")) return;
    dragStart = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    els.treeViewport.setPointerCapture(event.pointerId);
    els.treeViewport.classList.add("dragging");
  });
  els.treeViewport.addEventListener("pointermove", (event) => {
    if (!dragStart) return;
    pan.x = dragStart.panX + event.clientX - dragStart.x;
    pan.y = dragStart.panY + event.clientY - dragStart.y;
    applyTransform();
  });
  els.treeViewport.addEventListener("pointerup", () => { dragStart = null; els.treeViewport.classList.remove("dragging"); });
  document.querySelector("#resetButton").addEventListener("click", () => { els.modalBackdrop.hidden = false; document.querySelector("#cancelReset").focus(); });
  document.querySelector("#cancelReset").addEventListener("click", () => { els.modalBackdrop.hidden = true; });
  document.querySelector("#confirmReset").addEventListener("click", () => {
    completed.clear(); localStorage.removeItem(storageKey); els.modalBackdrop.hidden = true; renderAll(false); showToast("全部知识单元进度已重置");
  });
  els.modalBackdrop.addEventListener("click", (event) => { if (event.target === els.modalBackdrop) els.modalBackdrop.hidden = true; });
  window.addEventListener("resize", fitCanvas);
}

const invalidPrereqs = skills.flatMap((skill) => skill.prereqs.filter((id) => !skillById[id]).map((id) => `${skill.id} -> ${id}`));
if (invalidPrereqs.length) console.error("Invalid prerequisites", invalidPrereqs);
restoreHash();
bindEvents();
renderAll(true);
loadRoleCatalog();
setTimeout(refreshIcons, 350);
