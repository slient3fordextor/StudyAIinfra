# AI Infra 学习路线

这份路线把 [AIInfraGuide](https://caomaolufei.github.io/AIInfraGuide/) 的内容扩展为一条可以练习、验收和持续迭代的学习路径。主线是：

```text
Python / C++ / Linux
        -> 数学 / Transformer / PyTorch
        -> GPU / CUDA / Triton / 性能分析
        -> NCCL / DDP / FSDP / ZeRO / TP / PP
        -> vLLM / KV Cache / 量化 / 推理调度
        -> Docker / Kubernetes / Ray / KServe
        -> 监控 / SLO / 故障排查 / 成本 / 安全
```

按每周约 10 小时计算，完整路线需要 9-12 个月。已有基础时可以压缩到 4-6 个月。

## 阶段总览

| 阶段 | 建议用时 | 主要能力 | 验收项目 |
| --- | --- | --- | --- |
| 0. 工程基础 | 4-6 周 | Python 工程化、C++、Linux、Git、Docker | 用 pybind11 编写并基准测试一个 C++ 扩展 |
| 1. 模型与框架 | 4-6 周 | 数学、Transformer、PyTorch、Autograd、AMP | 从零实现小型 GPT，并加入 KV Cache |
| 2. GPU 与算子 | 8-10 周 | GPU 架构、CUDA、Triton、CUDA Graph、Nsight | 优化 Reduce、GEMM、Softmax、Attention |
| 3. 分布式训练 | 8-10 周 | NCCL、DDP、FSDP、ZeRO、TP、PP、MoE | 对比单卡、DDP、FSDP 的显存和扩展效率 |
| 4. LLM 推理 | 8-10 周 | Prefill/Decode、KV Cache、批处理、量化 | 部署并压测 vLLM，解释 TTFT、TPOT 和 p95 |
| 5. 集群平台 | 6-8 周 | Kubernetes、GPU 调度、Ray、Triton、KServe | 在 Kubernetes 上完成 GPU 模型服务和灰度发布 |
| 6. 生产化 | 持续学习 | 可观测性、SLO、可靠性、安全、成本 | 建立监控面板、故障演练和运行手册 |

## 0. 工程基础

- Python：类型标注、生成器、上下文管理器、`asyncio`、线程、多进程、打包和 CLI。
- 工程化：`pytest`、`ruff`、`mypy`、结构化日志、配置管理、依赖锁定和基准测试。
- C++：指针、引用、RAII、智能指针、STL、模板、CMake、动态库、GDB、ASan。
- 互操作：`pybind11`、Python C API、PyTorch C++ Extension。
- Linux：进程、线程、信号、文件描述符、共享内存、TCP、动态链接、`strace`、`lsof`、`ldd`。
- 容器：Docker 镜像分层、GPU 容器和 NVIDIA Container Toolkit。

验收：实现一个 Python 数据处理库，用 C++ 实现热点算子并通过 `pybind11` 暴露；用基准测试和火焰图说明优化结果。

## 1. 数学、Transformer 与 PyTorch

- 线性代数：矩阵乘法、转置、范数、广播、张量布局。
- 概率与微积分：交叉熵、Softmax、链式法则、反向传播和采样。
- 数值计算：FP32、FP16、BF16、FP8 的范围、舍入和误差。
- Transformer：QKV、MHA、MQA、GQA、RoPE、RMSNorm、FFN、MoE。
- 推理基础：自回归生成、Prefill、Decode、KV Cache。
- PyTorch：Tensor、Autograd、Module、Optimizer、DataLoader、AMP、`torch.compile`、Profiler。

验收：实现小型 GPT，分别测量无 KV Cache 和有 KV Cache 时的生成速度、显存和输出一致性。

## 2. GPU、CUDA 与算子优化

学习顺序：SM/Warp/线程块 -> 显存层级 -> Kernel -> Stream/Event -> CUDA Graph -> 多 GPU。

必须掌握：

- Coalesced Access、Bank Conflict、Occupancy、Warp Divergence。
- Pinned Memory、异步拷贝、同步、原子操作和错误检查。
- `nvcc`、PTX、SASS、编译架构和运行时兼容性。
- Triton 的 block-level 编程模型。
- Nsight Systems、Nsight Compute 和 PyTorch Profiler。

练习顺序：Vector Add -> Reduce -> Tiled GEMM -> Softmax -> LayerNorm -> FlashAttention 简化版 -> Fused MLP/RoPE。

每个算子都记录正确性、延迟、吞吐、显存带宽、计算利用率和不同 batch/sequence length 下的结果。

## 3. 分布式训练

学习顺序：`torchrun` 和 rank -> 单机 DDP -> 多机 DDP -> FSDP/ZeRO -> TP -> PP -> CP -> MoE -> 混合并行。

- 理解 AllReduce、AllGather、ReduceScatter、All-to-All 的语义和通信量。
- 能手算参数、梯度、优化器状态、激活和通信的显存账本。
- 掌握混合精度、梯度累积、Activation Checkpointing、分片 Checkpoint。
- 理解 GPU 拓扑、PCIe、NVLink、InfiniBand、RDMA 对通信的影响。
- 能排查 NCCL hang、rank 配置错误、数据重复、Checkpoint 恢复失败。

验收：对同一个模型完成单卡、DDP、FSDP 三种训练，对比最大 batch size、显存、step time、吞吐和扩展效率。

## 4. LLM 推理系统

- Prefill/Decode 的性能差异。
- KV Cache 的容量、分页、复用和淘汰。
- PagedAttention、Continuous Batching、Prefix Cache、Chunked Prefill。
- Tensor Parallel、Pipeline Parallel、Data Parallel 和多 LoRA 服务。
- INT4、W8A8、FP8、KV Cache Quantization。
- Speculative Decoding 和 Prefill/Decode 解耦。

核心指标：

```text
TTFT：首 token 延迟
TPOT：每个输出 token 的平均时间
ITL：token 间延迟
请求吞吐和 token 吞吐
GPU 利用率、KV Cache 使用率
p50/p95/p99 延迟和单位 token 成本
```

验收：用 vLLM 部署模型，再实现或修改一个简化版 scheduler、KV Cache Manager 或 continuous batching 模块。

## 5. 集群与平台

- Docker、镜像仓库、镜像扫描和多阶段构建。
- Kubernetes：Pod、Job、Deployment、Service、Ingress、探针、亲和性、污点和配额。
- GPU Device Plugin、GPU Operator、MIG 和拓扑调度。
- Helm、滚动发布、金丝雀发布和回滚。
- Ray/KubeRay、NVIDIA Triton、KServe。
- 对象存储、模型下载、缓存、Checkpoint 和制品版本管理。

验收：把 vLLM 或 Triton 部署到 Kubernetes，完成 GPU 申请、模型加载、健康检查、压测、自动扩缩容和灰度发布。

## 6. 可观测性、可靠性与成本

- GPU 利用率、显存、功耗、温度和 PCIe/NVLink 流量。
- Prefill/Decode 时间、KV Cache 命中率、队列长度和 batch size 分布。
- Metrics、Logs、Traces、Profiles 的关联分析。
- SLI、SLO、错误预算、容量规划和成本分摊。
- 超时、重试、熔断、限流、降级和故障转移。
- Checkpoint 恢复、节点故障、模型回滚和供应链安全。

验收：用 Prometheus、Grafana 和 OpenTelemetry 建立监控面板，注入一次 GPU 不可用、模型加载失败或推理超时故障，并写出恢复手册。

## 方向分支

| 目标岗位 | 加重学习内容 |
| --- | --- |
| 推理性能工程师 | CUDA、Triton、vLLM、KV Cache、量化、推理调度 |
| 分布式训练工程师 | NCCL、网络、DDP/FSDP/ZeRO、TP/PP/MoE |
| AI 平台工程师 | Docker、Kubernetes、GPU Operator、Ray/KServe、发布治理 |
| AI 编译器/算子工程师 | C++、CUDA、Triton、MLIR/LLVM、TVM/XLA、`torch.compile` |
| MLOps/训练平台工程师 | 数据管道、任务编排、Checkpoint、制品、观测和成本 |
| GPU 集群/SRE | Linux、网络、Kubernetes、GPU 调度、NCCL、故障演练 |

## 推荐实践项目

1. 小型 GPT：数据处理、训练、Checkpoint、评估和 KV Cache。
2. CUDA 算子库：Reduce、GEMM、Softmax、Attention，附 Nsight 分析。
3. 分布式训练对比：单卡、DDP、FSDP，附显存账本和扩展曲线。
4. 简化版 vLLM：KV Cache、调度器或 continuous batching 至少实现一个子系统。
5. 生产级 LLM 服务：vLLM/Triton + Kubernetes + Prometheus/Grafana + 压测 + 灰度发布。

## 参考资料

- [AIInfraGuide](https://caomaolufei.github.io/AIInfraGuide/)
- [CUDA Programming Guide](https://docs.nvidia.com/cuda/cuda-programming-guide/)
- [NCCL Documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html)
- [PyTorch Distributed](https://docs.pytorch.org/docs/stable/distributed.html)
- [vLLM Documentation](https://docs.vllm.ai/en/latest/)
- [Triton Inference Server](https://docs.nvidia.com/deeplearning/triton-inference-server/)
- [Kubernetes GPU Scheduling](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
- [Ray Train](https://docs.ray.io/en/latest/train/train.html)
- [KServe](https://kserve.github.io/website/)
- [OpenTelemetry](https://opentelemetry.io/docs/)

## 学习方法

保持约 30% 阅读、70% 编码。每个主题都记录基线、改动、指标、结论和硬件/软件环境。先跑通一条主技术栈：Python + C++ + Linux + PyTorch + CUDA + NCCL + vLLM + Kubernetes，再补充 DeepSpeed、Megatron-LM、TensorRT-LLM、TVM、MLIR、ROCm 等替代方案。
