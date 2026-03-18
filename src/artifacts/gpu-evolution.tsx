import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;
export const publishDate = "2026-03-17";


import { useState, useEffect, useRef, useCallback } from "react";

const CHAPTERS = [
  {
    id: "origins",
    era: "1990s",
    title: "The Graphics Origin",
    subtitle: "Why GPUs exist at all",
    color: "#4ade80",
    content: {
      intro: `Your CPU is a brilliant generalist — it can do anything, but it does things one-at-a-time (or a few at a time with multiple cores). A 1990s screen had 640×480 = 307,200 pixels. Each pixel needs color calculated 60 times per second. That's ~18 million calculations per second — just for flat colors. Add lighting, textures, and depth? You need billions of operations.`,
      key_insight: `The insight was simple: pixel calculations are independent. Pixel (0,0) doesn't need to wait for pixel (100,200). So instead of one fast brain, build thousands of tiny, dumb brains that all work simultaneously.`,
      sections: [
        {
          heading: "The Fixed-Function Pipeline",
          text: `Early GPUs (like the NVIDIA TNT2 or ATI Rage) weren't programmable. They had a hardwired pipeline:

① Vertex Processing — Transform 3D coordinates to 2D screen positions using matrix multiplication. Yes, matrix math has been in GPUs since day one.

② Rasterization — Convert triangles into fragments (candidate pixels). This is embarrassingly parallel — each triangle is independent.

③ Fragment/Pixel Processing — Calculate the final color of each pixel: apply textures, compute lighting. Again, each pixel is independent.

④ Framebuffer Output — Write final pixel colors to video memory (VRAM) for display.

Every stage processes many elements at once. This is the DNA of the GPU: massive data-parallelism.`
        },
        {
          heading: "VRAM: Your First GPU Memory Concept",
          text: `The GPU needs its own memory (VRAM) because the CPU's RAM is too far away — the round-trip over the system bus adds latency. VRAM sits directly on the graphics card, connected to the GPU chip via a wide, fast bus. In the 90s this was SDRAM, later GDDR (Graphics Double Data Rate) — just DDR RAM optimized for high-bandwidth sequential access rather than low-latency random access. This bandwidth-over-latency tradeoff is a theme that defines the entire GPU story.`
        }
      ],
      terms: [
        { term: "SIMD", def: "Single Instruction, Multiple Data — one instruction applied to many data points simultaneously. The fundamental execution model of GPUs." },
        { term: "VRAM", def: "Video RAM — dedicated memory on the GPU card. Fast bandwidth, directly connected to the GPU die." },
        { term: "Framebuffer", def: "The region of VRAM holding the current image being sent to your display." },
        { term: "Rasterization", def: "Converting vector geometry (triangles) into discrete pixels — a massively parallel operation." }
      ]
    }
  },
  {
    id: "shaders",
    era: "2001–2006",
    title: "Programmable Shaders",
    subtitle: "The GPU learns to be flexible",
    color: "#60a5fa",
    content: {
      intro: `Fixed-function pipelines were fast but rigid — you could only create effects the hardware designers anticipated. Game developers wanted custom water reflections, fur rendering, cel-shading. The solution: make parts of the pipeline programmable.`,
      key_insight: `Programmable shaders turned the GPU from a fixed-purpose graphics chip into something closer to a parallel processor. Vertex shaders and pixel shaders were separate at first (different hardware units), but the key evolution was Unified Shader Architecture (2006, GeForce 8800) — all shader cores became identical and interchangeable.`,
      sections: [
        {
          heading: "Shader Cores and Warps",
          text: `A modern GPU has thousands of shader cores (NVIDIA calls them "CUDA cores" starting in 2007). But they don't work independently like CPU cores. They're organized in groups:

• Streaming Multiprocessor (SM) — A cluster of cores that share control logic, cache, and a scheduler. Think of it as a "department" in a factory.

• Warp (NVIDIA) / Wavefront (AMD) — A group of 32 (NVIDIA) or 64 (AMD) threads that execute the SAME instruction at the SAME time on different data. This is SIMT — Single Instruction, Multiple Threads.

If 16 of your 32 threads need to take an "if" branch and the other 16 take "else," the warp must execute BOTH branches, masking out the inactive threads. This is called warp divergence and it's why GPU code hates conditionals.`
        },
        {
          heading: "Thread Hierarchy",
          text: `GPU threads are organized hierarchically:

Thread → the smallest unit, processes one data element
Warp → 32 threads locked in step (SIMT)
Thread Block → a group of warps sharing fast memory (up to 1024 threads)
Grid → all thread blocks for one kernel launch

This hierarchy maps directly to hardware: threads run on cores, warps are scheduled on SMs, thread blocks are assigned to SMs, and the grid spans the whole GPU. Understanding this hierarchy is essential for understanding why certain AI workloads map well (or poorly) to GPUs.`
        }
      ],
      terms: [
        { term: "Shader", def: "A small program that runs on GPU cores. Originally for graphics effects, now the foundation for all GPU compute." },
        { term: "SM (Streaming Multiprocessor)", def: "A cluster of GPU cores that share control logic, registers, and L1 cache. The basic building block of GPU architecture." },
        { term: "Warp", def: "32 threads executing in lockstep — the fundamental scheduling unit on NVIDIA GPUs. AMD's equivalent is a 'wavefront' (64 threads)." },
        { term: "SIMT", def: "Single Instruction, Multiple Threads — NVIDIA's execution model. Like SIMD, but each thread has its own registers and can diverge (at a performance cost)." },
        { term: "Warp Divergence", def: "When threads in a warp take different branches, forcing serial execution of both paths. The #1 performance killer in GPU programming." }
      ]
    }
  },
  {
    id: "gpgpu",
    era: "2007–2012",
    title: "GPGPU & CUDA",
    subtitle: "GPUs break free from graphics",
    color: "#a78bfa",
    content: {
      intro: `Researchers in physics and finance noticed something: if you squint, a physics simulation looks a lot like rendering — you're applying the same formula to millions of independent data points. But programming GPUs meant pretending your data was "texture" and your computation was "shading." It was a horrible hack.`,
      key_insight: `CUDA (2007) was NVIDIA's masterstroke: a C-like programming language that let you write general-purpose code for the GPU without the graphics pretense. You write a "kernel" function, launch it with thousands of threads, and each thread knows its own index. This turned the GPU from a graphics accelerator into a general-purpose parallel processor. This single decision is arguably why NVIDIA dominates AI today.`,
      sections: [
        {
          heading: "The CUDA Programming Model",
          text: `A CUDA kernel is deceptively simple. Here's vector addition:

__global__ void add(float *a, float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];
}

You launch this with, say, 1 million threads. Each thread computes one addition. The GPU schedules all of these across its SMs automatically. The programming model abstracts the hardware — you think in threads, the GPU thinks in warps and SMs.

OpenCL (2009) was the open-standard alternative, but CUDA's ecosystem (libraries like cuBLAS, cuDNN, and later the entire deep learning stack) created an almost unbreakable moat.`
        },
        {
          heading: "Why Matrix Multiply Matters",
          text: `The single most important operation in all of AI is matrix multiplication (matmul). A neural network is, at its core, a sequence of matrix multiplications interleaved with nonlinear activation functions.

Matrix C = A × B where A is (M×K) and B is (K×N) requires M×N×K multiply-accumulate operations. For large matrices, this is perfectly parallel: each element of C is an independent dot product.

GPU libraries like cuBLAS implement matmul using tiled algorithms — they load sub-blocks of A and B into the SM's fast shared memory, compute partial results, and accumulate. This exploits the memory hierarchy to minimize slow global memory accesses. The efficiency of your matmul implementation literally determines your AI training speed.`
        }
      ],
      terms: [
        { term: "CUDA", def: "Compute Unified Device Architecture — NVIDIA's parallel computing platform and API. The lingua franca of GPU programming." },
        { term: "Kernel", def: "A function that runs on the GPU, executed by thousands/millions of threads in parallel. Not to be confused with OS kernels." },
        { term: "cuBLAS", def: "CUDA Basic Linear Algebra Subroutines — NVIDIA's optimized library for matrix operations. The backbone of AI training." },
        { term: "Shared Memory", def: "Fast, programmer-managed memory shared within a thread block (~100KB per SM). 10-50x faster than global VRAM." },
        { term: "Occupancy", def: "The ratio of active warps to maximum warps an SM can handle. Higher occupancy helps hide memory latency." }
      ]
    }
  },
  {
    id: "memory",
    era: "2013–2018",
    title: "The Memory Wall",
    subtitle: "HBM and the bandwidth revolution",
    color: "#f472b6",
    content: {
      intro: `Here's the dirty secret of GPU computing: your thousands of cores are almost always waiting for data. A single NVIDIA A100 can perform 19.5 teraflops of FP32 math, but its memory bandwidth is "only" 2 TB/s. For operations with low arithmetic intensity (bytes loaded vs. FLOPs computed), the cores sit idle. This is the memory wall.`,
      key_insight: `The evolution of GPU memory — from GDDR3 to GDDR5 to GDDR6 to HBM — is not a footnote. It's the central bottleneck of AI computing. Every architectural innovation in AI hardware is, in some way, an attempt to feed data to the cores faster.`,
      sections: [
        {
          heading: "GDDR vs HBM",
          text: `GDDR (Graphics DDR) chips sit next to the GPU on the circuit board, connected by traces on the PCB. You can fit maybe 8-12 chips around the GPU package. Each chip connects via a 32-bit bus. GDDR6 maxes out around 700-900 GB/s.

HBM (High Bandwidth Memory) takes a radically different approach: memory chips are stacked vertically in a 3D tower and placed right next to (or on top of) the GPU die, connected via a silicon interposer — a thin silicon wafer that acts as a high-density wiring layer. Each HBM stack connects via a 1024-bit bus. That's 32x wider than one GDDR chip.

HBM2e: ~2 TB/s bandwidth (A100)
HBM3: ~3.35 TB/s (H100)  
HBM3e: ~4.9 TB/s (B200)

This isn't just "faster RAM." It's a fundamentally different packaging approach that enables AI-scale workloads.`
        },
        {
          heading: "The GPU Memory Hierarchy",
          text: `From fastest to slowest:

Registers — Each thread has private registers. ~0 latency, ~256KB per SM.

Shared Memory / L1 Cache — Shared within a thread block. ~30 cycles latency, ~128-228KB per SM. Programmer-managed (shared memory) or hardware-managed (L1).

L2 Cache — Shared across all SMs. ~200 cycles, 40-60MB on modern GPUs.

HBM (Global Memory) — The main VRAM. ~400-600 cycles, 80-192GB.

System RAM (CPU) — Accessed over PCIe/NVLink. Thousands of cycles, terabytes.

The art of GPU programming is keeping data as high in this hierarchy as possible. "Kernel fusion" — combining multiple operations into one kernel so intermediate results stay in registers/shared memory — is why libraries like FlashAttention are so important for transformers.`
        }
      ],
      terms: [
        { term: "HBM", def: "High Bandwidth Memory — 3D-stacked DRAM connected to the GPU via a silicon interposer. Provides 3-5x the bandwidth of GDDR at lower power." },
        { term: "Silicon Interposer", def: "A thin silicon layer with dense wiring that connects the GPU die to HBM stacks. Manufactured like a chip itself — this is advanced packaging." },
        { term: "Bandwidth", def: "Data transfer rate (GB/s or TB/s). The #1 bottleneck in AI workloads. More bandwidth = more data fed to cores per second." },
        { term: "Arithmetic Intensity", def: "Ratio of FLOPs to bytes loaded from memory. High = compute-bound (good). Low = memory-bound (cores starve)." },
        { term: "Kernel Fusion", def: "Combining multiple GPU operations into one kernel to keep intermediate data in fast on-chip memory. Critical for transformer efficiency." }
      ]
    }
  },
  {
    id: "nn-gpus",
    era: "2012–2015",
    title: "Neural Networks Meet GPUs",
    subtitle: "AlexNet and the deep learning explosion",
    color: "#fbbf24",
    content: {
      intro: `In 2012, Alex Krizhevsky trained a convolutional neural network (AlexNet) on two GTX 580 GPUs and won the ImageNet competition by a landslide. This single result ignited the deep learning revolution. But why do neural networks map so well to GPUs?`,
      key_insight: `A neural network's forward pass is a sequence of matrix multiplications (weights × activations) followed by element-wise nonlinearities (ReLU, sigmoid). Backpropagation is the same thing in reverse — more matrix multiplications to compute gradients. Matrix multiply is embarrassingly parallel. The GPU was born for this.`,
      sections: [
        {
          heading: "Forward Pass as Matmul",
          text: `A dense layer: y = Wx + b where W is (output_dim × input_dim), x is (input_dim × batch_size).

With a batch size of 256 and a 4096→4096 layer, that's a (4096×4096) × (4096×256) matrix multiply — about 8.6 billion multiply-add operations. A modern GPU does this in under a millisecond.

Batch processing is key: instead of feeding one example at a time, you feed a batch. This turns a matrix-vector multiply (low arithmetic intensity, memory-bound) into a matrix-matrix multiply (high arithmetic intensity, compute-bound). Batching is how you actually utilize GPU cores.`
        },
        {
          heading: "Backpropagation on GPUs",
          text: `Training requires computing gradients via backpropagation. For each layer, you compute:

∂L/∂W = ∂L/∂y · xᵀ  (weight gradient — another matmul)
∂L/∂x = Wᵀ · ∂L/∂y  (input gradient for chain rule — another matmul)

So each layer requires ~3 matmuls during training (forward, weight grad, input grad). A 100-layer network means ~300 large matrix multiplications per training step. Multiply by millions of steps and you see why training GPT-4 cost ~$100M in compute.`
        },
        {
          heading: "Convolutions as Matrix Multiply",
          text: `A convolution slides a small filter (say 3×3) across an image. This seems sequential, but there's a trick: im2col. You rearrange the input so that each filter position becomes a column, then the entire convolution becomes one large matrix multiply. The GPU doesn't actually slide anything — it transforms the problem into what it does best.

This im2col + matmul approach was how cuDNN initially implemented convolutions. Later, more memory-efficient algorithms like Winograd and FFT-based convolutions were added, but the principle remains: convert everything to matmul.`
        }
      ],
      terms: [
        { term: "Batch Size", def: "Number of training examples processed simultaneously. Larger batches = better GPU utilization (higher arithmetic intensity) but require more memory." },
        { term: "cuDNN", def: "CUDA Deep Neural Network library — NVIDIA's optimized primitives for convolutions, RNNs, attention, etc. The engine under PyTorch and TensorFlow." },
        { term: "FLOPS", def: "Floating-Point Operations Per Second. The theoretical peak compute rate. Modern AI GPUs: tens to hundreds of teraflops." },
        { term: "Backpropagation", def: "Algorithm for computing gradients by applying the chain rule backwards through the network. Computationally ~2x the forward pass." },
        { term: "im2col", def: "Image-to-column transformation that converts convolution into matrix multiplication. Trades memory for parallelism." }
      ]
    }
  },
  {
    id: "rnns",
    era: "2014–2017",
    title: "RNNs & The Sequential Bottleneck",
    subtitle: "Why recurrence underutilizes GPUs",
    color: "#fb923c",
    content: {
      intro: `Before transformers, sequence modeling (language, speech, time series) was dominated by Recurrent Neural Networks — LSTMs and GRUs. These worked, but they had a fundamental problem that made GPUs unhappy.`,
      key_insight: `An RNN processes tokens sequentially: the hidden state at step t depends on step t-1. You cannot parallelize across the sequence dimension. For a 1000-token sequence, you must do 1000 sequential matmuls. Each individual matmul is parallel, but the sequence of them is serial. This means GPU utilization is low — you're launching many small kernels instead of one large one.`,
      sections: [
        {
          heading: "The RNN Bottleneck",
          text: `For an LSTM processing a sequence of length T:

h_t = LSTM(x_t, h_{t-1})

Step t cannot begin until step t-1 finishes. If each step takes 0.1ms, a 1000-token sequence takes 100ms of serial computation. During each step, you're doing a relatively small matmul (hidden_size × hidden_size), which doesn't fully saturate a modern GPU's thousands of cores.

You can parallelize across the batch dimension — process 64 sequences simultaneously. But the sequential dependency within each sequence remains. This creates a ceiling on GPU utilization.`
        },
        {
          heading: "Attempts to Fix Sequential Bottleneck",
          text: `Researchers tried many approaches: bidirectional RNNs (process forward and backward in parallel — 2x speedup), dilated/strided RNNs, quasi-recurrent networks (QRNN) that used convolutions for part of the computation, and various attention mechanisms bolted onto RNNs.

But the fundamental tension remained: sequential dependencies kill parallelism. This set the stage for the transformer, which eliminated recurrence entirely.`
        }
      ],
      terms: [
        { term: "LSTM", def: "Long Short-Term Memory — an RNN variant with gating mechanisms that can learn long-range dependencies. Dominated NLP from 2014-2017." },
        { term: "Hidden State", def: "The RNN's internal memory vector, passed from one timestep to the next. Creates the sequential dependency." },
        { term: "Sequence Length", def: "Number of tokens/timesteps in the input. Longer sequences = more serial steps for RNNs, but more parallel work for transformers." }
      ]
    }
  },
  {
    id: "transformers",
    era: "2017–Present",
    title: "Transformers & Self-Attention",
    subtitle: "The architecture that unlocked scaling",
    color: "#e879f9",
    content: {
      intro: `"Attention Is All You Need" (Vaswani et al., 2017) introduced the transformer. Its key innovation: replace recurrence with self-attention, which computes relationships between ALL positions in a sequence simultaneously. This is a GPU's dream — one massive parallel operation instead of T sequential ones.`,
      key_insight: `Self-attention converts a sequential problem into a matrix multiplication problem. For a sequence of T tokens, attention computes a T×T matrix of pairwise relationships — entirely in parallel. The cost is O(T²) in compute and memory (which creates its own problems at long contexts), but the parallelism is perfect.`,
      sections: [
        {
          heading: "Attention as Matrix Operations",
          text: `Each token is embedded as a vector. From these, we compute three matrices:

Q (Queries) = X · W_Q    [shape: T × d_k]
K (Keys) = X · W_K       [shape: T × d_k]  
V (Values) = X · W_V     [shape: T × d_v]

Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V

Step by step:
① QKᵀ — a (T×d_k) × (d_k×T) matmul producing a T×T attention matrix. This is where each token "looks at" every other token. Fully parallel.
② Softmax — element-wise along each row. Parallel.
③ Multiply by V — another matmul. Parallel.

Multi-head attention repeats this H times with different W_Q, W_K, W_V projections — H independent matmuls, perfectly parallel.`
        },
        {
          heading: "Tokens and Tokenization",
          text: `LLMs don't operate on characters or words — they use tokens, subword units produced by algorithms like BPE (Byte Pair Encoding). "Understanding" might be one token, while "misunderstanding" might be "mis" + "understand" + "ing" — three tokens.

Each token maps to an integer ID, which indexes into an embedding table to produce a vector (typically 4096-12288 dimensions). This vector is what flows through the transformer layers. When we say a model has a "128K context window," we mean it can attend to 128,000 tokens simultaneously — which means the attention matrix is 128K × 128K = 16 billion entries. This is why long-context models are so memory-hungry.`
        },
        {
          heading: "The KV Cache: Inference vs Training",
          text: `During inference (generating text), the model produces one token at a time. But attention requires the K and V matrices from ALL previous tokens. Rather than recomputing these, we cache them — the KV cache.

For a 70B parameter model with 128K context, the KV cache alone can be 40+ GB. This is often the bottleneck on inference memory — not the model weights themselves. The KV cache is why you hear about "context length" being expensive: it scales linearly with sequence length per layer, and there are dozens of layers.

FlashAttention (Tri Dao, 2022) was a breakthrough: instead of materializing the full T×T attention matrix in HBM, it computes attention in tiles that fit in SRAM (shared memory), fusing the softmax and matmul operations. This reduces HBM reads/writes by 5-20x without changing the math.`
        }
      ],
      terms: [
        { term: "Self-Attention", def: "Mechanism where each token computes a weighted combination of all tokens in the sequence. Replaces recurrence with parallel computation." },
        { term: "Token", def: "Subword unit used by LLMs. Text is split into tokens (typically 3-4 chars each) which are the atomic units of processing." },
        { term: "KV Cache", def: "Cached Key and Value matrices from previous tokens during inference. Avoids recomputation but consumes large amounts of memory." },
        { term: "Context Window", def: "Maximum number of tokens a model can attend to. Larger = more memory (KV cache scales linearly per layer)." },
        { term: "FlashAttention", def: "Algorithm that computes exact attention using tiling and kernel fusion, avoiding materializing the T×T matrix in HBM. 2-4x speedup." },
        { term: "Multi-Head Attention", def: "Running attention H times in parallel with different projections, then concatenating results. Lets the model attend to different relationship types." }
      ]
    }
  },
  {
    id: "tensor-cores",
    era: "2017–Present",
    title: "Tensor Cores & Mixed Precision",
    subtitle: "Specialized silicon for matrix math",
    color: "#34d399",
    content: {
      intro: `Once NVIDIA recognized that AI workloads are >90% matrix multiplication, they did the obvious thing: build hardware units that do nothing but matrix multiply, and do it insanely fast. Enter Tensor Cores (Volta architecture, 2017).`,
      key_insight: `A regular CUDA core does one multiply-add per clock cycle. A Tensor Core performs an entire 4×4 matrix multiply-accumulate per clock cycle — that's 64 multiply-add operations at once. This isn't just faster; it's a fundamentally different compute unit designed specifically for the D = A·B + C operation at the heart of neural networks.`,
      sections: [
        {
          heading: "Precision Formats",
          text: `Full 32-bit floating point (FP32) is overkill for most neural network operations. Lower precision means:
• Smaller numbers = more fit in memory = larger batches
• Simpler circuits = more operations per clock cycle = higher FLOPS
• Less data to move = less bandwidth pressure

The evolution of precision in AI:

FP32 (32 bits) — Full precision. 19.5 TFLOPS on A100.
TF32 (19 bits) — NVIDIA's compromise: FP32 range, reduced mantissa. Transparent to user code.
FP16 (16 bits) — Half precision. 2x memory savings, but limited range.
BF16 (16 bits) — Brain Float: same range as FP32 but less precision. Google invented this for TPUs, now standard everywhere.
FP8 (8 bits) — Hopper/Blackwell generation. ~2x speedup over FP16. Requires careful scaling.
INT8/INT4 — Integer quantization for inference. 4x-8x memory savings. Model quality degrades unless carefully calibrated.

Tensor Core TFLOPS by generation (FP16):
V100 (2017): 125 TFLOPS
A100 (2020): 312 TFLOPS  
H100 (2022): 990 TFLOPS
B200 (2024): 2,250 TFLOPS

Note the scaling: each generation roughly doubles or triples tensor TFLOPS.`
        },
        {
          heading: "Mixed Precision Training",
          text: `You don't pick one precision — you mix them. The standard recipe:

① Store master weights in FP32 (for numerical stability during optimization)
② Compute forward/backward passes in FP16 or BF16 (for speed)
③ Use loss scaling to prevent gradient underflow in FP16
④ Accumulate results in FP32 before updating weights

This gives you nearly 2x speedup with minimal accuracy loss. BF16 has made this even simpler — its larger exponent range means you rarely need loss scaling. This is why BF16 has become the default training precision.`
        }
      ],
      terms: [
        { term: "Tensor Core", def: "Specialized hardware unit that performs matrix multiply-accumulate operations. 16x faster than regular CUDA cores for matrix math." },
        { term: "BF16 (BFloat16)", def: "16-bit format with FP32's exponent range but less mantissa precision. The default training precision for modern LLMs." },
        { term: "Quantization", def: "Reducing precision of model weights (FP16→INT8→INT4) to save memory and increase speed during inference. Some accuracy loss." },
        { term: "TFLOPS", def: "Tera (10¹²) Floating-Point Operations Per Second. The headline performance metric for AI accelerators." },
        { term: "Mixed Precision", def: "Using lower precision for compute but higher precision for accumulation. Best of both worlds: speed + accuracy." }
      ]
    }
  },
  {
    id: "multi-gpu",
    era: "2018–Present",
    title: "Scaling Up: Multi-GPU",
    subtitle: "NVLink, parallelism strategies, and the cluster",
    color: "#38bdf8",
    content: {
      intro: `A single GPU — even the most powerful — cannot train a large language model. GPT-3 has 175B parameters (700 GB in FP32). That doesn't fit in one GPU's 80GB of HBM. Even if it did, training would take decades. You need hundreds or thousands of GPUs working together.`,
      key_insight: `Multi-GPU training is fundamentally a communication problem. The computation is easy to parallelize — the hard part is moving data between GPUs fast enough that they don't sit idle waiting for each other. Every interconnect technology (NVLink, NVSwitch, InfiniBand) exists to solve this.`,
      sections: [
        {
          heading: "Interconnects: PCIe vs NVLink",
          text: `PCIe (Peripheral Component Interconnect Express) — the standard bus connecting GPUs to the CPU. PCIe 5.0: ~64 GB/s bidirectional. This was designed for connecting peripherals, not for GPU-to-GPU communication.

NVLink — NVIDIA's proprietary high-speed GPU-to-GPU interconnect. NVLink 4.0 (Hopper): 900 GB/s bidirectional — 14x faster than PCIe 5.0. NVLink connects GPUs directly, bypassing the CPU entirely.

NVSwitch — A crossbar switch that connects multiple GPUs via NVLink. In the DGX H100 system, NVSwitch connects 8 H100 GPUs so every GPU can communicate with every other at full NVLink bandwidth. It's like a network switch, but for GPUs within a single machine.

For communication between machines, you use InfiniBand (400 Gb/s per port) or RoCE (RDMA over Converged Ethernet). These are datacenter network fabrics — much slower than NVLink, which is why minimizing inter-node communication is critical.`
        },
        {
          heading: "Parallelism Strategies",
          text: `There are three fundamental ways to distribute work across GPUs:

Data Parallelism — Each GPU has a complete copy of the model. Different GPUs process different batches of data. After each step, gradients are averaged across all GPUs (AllReduce). Simple, but requires the model to fit on one GPU.

Model/Tensor Parallelism — Split individual layers across GPUs. A single matrix multiply is divided: GPU 0 computes the left half, GPU 1 the right half. Requires fast interconnect (NVLink) because GPUs must exchange partial results every layer. Used within a machine.

Pipeline Parallelism — Different layers on different GPUs. GPU 0 has layers 1-10, GPU 1 has layers 11-20, etc. Data flows through the pipeline. Problem: GPUs are idle while waiting for data (the "pipeline bubble"). Micro-batching helps fill the bubble.

In practice, you combine all three: tensor parallelism within a node (8 GPUs connected by NVLink), pipeline parallelism across nodes in a rack, and data parallelism across racks. This is called 3D parallelism.`
        },
        {
          heading: "What's a Node, Rack, Pod, and Cluster?",
          text: `Node — One server: typically 8 GPUs + CPUs + RAM + NVLink/NVSwitch. Example: DGX H100 (8× H100 GPUs). This is the fundamental unit.

Rack — A cabinet holding multiple nodes. A standard 42U rack might hold 4-8 DGX nodes (32-64 GPUs) plus networking switches and power distribution.

Pod — A group of racks connected by a high-bandwidth network fabric. An NVIDIA DGX SuperPOD might be 32 DGX nodes (256 GPUs) connected by InfiniBand.

Cluster — The full datacenter deployment. Thousands of GPUs across many pods. Meta's AI cluster for Llama 3: 24,576 H100 GPUs. This is the scale at which frontier models train.

Cooling, power, and physical proximity all matter enormously. Speed-of-light latency over fiber optic is ~5μs per km, which means even short distances add meaningful latency when you're synchronizing thousands of GPUs multiple times per second.`
        }
      ],
      terms: [
        { term: "NVLink", def: "NVIDIA's high-speed GPU-to-GPU interconnect. 900 GB/s (H100). 14x faster than PCIe." },
        { term: "NVSwitch", def: "Crossbar switch connecting 8 GPUs at full NVLink bandwidth within a node. Every GPU talks to every other at full speed." },
        { term: "InfiniBand", def: "High-performance networking fabric for inter-node communication in AI clusters. 400 Gb/s per port." },
        { term: "AllReduce", def: "Collective communication operation that sums gradients across all GPUs. The dominant communication pattern in data-parallel training." },
        { term: "3D Parallelism", def: "Combining data, tensor, and pipeline parallelism. Standard approach for training frontier LLMs." },
        { term: "DGX", def: "NVIDIA's pre-built AI server system. DGX H100: 8× H100 GPUs connected by NVSwitch. ~$300K-$500K per unit." }
      ]
    }
  },
  {
    id: "tpus",
    era: "2016–Present",
    title: "TPUs & Systolic Arrays",
    subtitle: "Google's custom silicon",
    color: "#f97316",
    content: {
      intro: `Google took a different approach: instead of repurposing graphics hardware, build a chip from scratch specifically for matrix multiplication. The result was the Tensor Processing Unit (TPU), first deployed in 2015 for inference, with TPU v2 (2017) supporting training.`,
      key_insight: `The TPU's core innovation is the systolic array — a 2D grid of multiply-accumulate units where data flows through the array like a wave, with each unit passing its result to the next. This eliminates the need to read/write intermediate results to memory, dramatically improving efficiency for matrix multiply.`,
      sections: [
        {
          heading: "Systolic Arrays",
          text: `Imagine a 128×128 grid of simple multiply-accumulate (MAC) units. To multiply matrices A and B:

① Elements of A flow left-to-right across rows
② Elements of B flow top-to-bottom down columns
③ Each MAC unit multiplies its two inputs and adds to a running sum
④ After the data has flowed through, each unit holds one element of the result matrix

The beauty: no intermediate memory accesses. Data flows through the array, gets used, and the result accumulates in place. A 128×128 systolic array performs 16,384 MACs per cycle. The TPU v4 has two such arrays (called MXUs — Matrix Multiply Units).

The tradeoff: systolic arrays are less flexible than CUDA cores. They're optimized for dense matrix multiply. Sparse or irregular computations don't map as cleanly.`
        },
        {
          heading: "TPU Pods and Architecture",
          text: `TPUs are connected in pods using Google's custom high-speed interconnect (ICI — Inter-Chip Interconnect), forming a 3D torus topology. A TPU v4 pod is 4,096 chips.

Key differences from NVIDIA GPUs:
• No CUDA — TPUs use XLA (Accelerated Linear Algebra) compiler via JAX or TensorFlow
• BFloat16 was invented for TPU — wider exponent range than FP16
• HBM is used (32GB per v4 chip), but memory hierarchy differs
• ICI provides all-to-all connectivity within a pod — no separate NVSwitch
• Available only via Google Cloud — you can't buy TPUs

Google trained Gemini, PaLM, and many other models on TPU pods. For pure dense matmul workloads, TPUs are extremely efficient. The limitation is programmability — the CUDA ecosystem is vastly larger.`
        }
      ],
      terms: [
        { term: "TPU", def: "Tensor Processing Unit — Google's custom AI accelerator, built around systolic arrays for matrix multiplication." },
        { term: "Systolic Array", def: "2D grid of MAC units where data flows through in a wave pattern. No intermediate memory access needed — very efficient for matmul." },
        { term: "MXU", def: "Matrix Multiply Unit — the systolic array block in a TPU. 128×128 MAC units." },
        { term: "XLA", def: "Accelerated Linear Algebra — compiler that optimizes and compiles ML computations for TPUs (and GPUs). Used by JAX." },
        { term: "ICI", def: "Inter-Chip Interconnect — Google's proprietary high-speed link between TPU chips within a pod." }
      ]
    }
  },
  {
    id: "cerebras",
    era: "2019–Present",
    title: "Cerebras: Wafer-Scale",
    subtitle: "One chip to rule them all",
    color: "#ef4444",
    content: {
      intro: `Every chip you've seen so far — GPUs, TPUs — is cut from a silicon wafer. A 300mm wafer might yield hundreds of individual chips (called "dies"), each ~800mm². Cerebras asked: what if we DON'T cut the wafer? What if the entire wafer IS the chip?`,
      key_insight: `Cerebras's WSE (Wafer-Scale Engine) is a single 46,225mm² chip — 56x larger than the largest GPU die. The entire wafer is one interconnected processor. This eliminates the off-chip communication bottleneck entirely: cores can talk to neighboring cores at silicon speed, not through external interconnects.`,
      sections: [
        {
          heading: "The WSE Architecture",
          text: `The WSE-3 (2024) contains:
• 900,000 AI-optimized cores
• 44 GB of on-chip SRAM (not HBM — actual on-chip memory)
• 21 petabytes/s of memory bandwidth (yes, petabytes)
• 214 Pb/s of interconnect bandwidth between cores

The key difference from a GPU: there is no off-chip HBM. All 44GB of memory is on-die SRAM, distributed across the cores. SRAM is ~10x faster and ~10x more expensive per bit than HBM — but when your chip IS the wafer, you have room for enormous amounts of it.

This means no memory wall. Every core has its data right next to it. For workloads that fit in 44GB, Cerebras eliminates the single biggest bottleneck in AI computing.`
        },
        {
          heading: "Wafer-Scale Challenges",
          text: `Building a wafer-scale chip is extraordinarily hard:

Yield — On a normal wafer, some dies have defects and are discarded. On a wafer-scale chip, defects are inevitable but you can't discard the whole wafer. Cerebras uses redundant cores and routing to work around defective areas.

Power Delivery — A chip this large draws enormous power. Cerebras designed a custom power delivery system.

Cooling — 20+ kilowatts from a single chip requires specialized cooling (cold plate with water cooling directly on the wafer).

Software — The programming model is different. You map your neural network spatially onto the wafer — layer 1 on these cores, layer 2 on those cores. Data flows across the chip physically. Cerebras provides the CS-3 system and software stack to handle this.

The model must fit in the 44GB of on-chip SRAM. For training frontier LLMs (hundreds of billions of parameters), Cerebras clusters multiple WSE systems using a weight-streaming architecture — weights are streamed from external storage to the WSE as needed.`
        }
      ],
      terms: [
        { term: "WSE", def: "Wafer-Scale Engine — Cerebras's processor where the entire silicon wafer is one chip. 46,225mm², 900K cores." },
        { term: "Die", def: "A single chip cut from a silicon wafer. GPU dies are typically 400-800mm². The wafer itself is 300mm diameter." },
        { term: "SRAM", def: "Static RAM — the fastest type of memory, used for caches. ~10x faster than HBM but much more expensive per bit." },
        { term: "Yield", def: "Percentage of functional chips from a wafer. A wafer-scale chip must tolerate defects via redundancy." },
        { term: "Weight Streaming", def: "Cerebras's approach for large models: stream weights from external memory to the WSE on-demand rather than storing all weights on-chip." }
      ]
    }
  },
  {
    id: "groq",
    era: "2020–Present",
    title: "Groq's LPU",
    subtitle: "Deterministic inference at scale",
    color: "#06b6d4",
    content: {
      intro: `Groq (not to be confused with Grok, xAI's chatbot) was founded by Jonathan Ross, who designed Google's first TPU. Groq's insight: inference workloads are fundamentally different from training, and existing hardware serves them poorly.`,
      key_insight: `During inference, you already know the model — its weights are fixed. The computation graph is static and predictable. So why use hardware designed for flexible, dynamic workloads? Groq's LPU (Language Processing Unit) has no HBM, no caches, no dynamic scheduling. Everything is deterministic and compiler-scheduled. The result: extreme inference speed with predictable latency.`,
      sections: [
        {
          heading: "The TSP Architecture",
          text: `Groq's chip is called the TSP (Tensor Streaming Processor). It has:

• 230 MB of SRAM (no HBM at all)
• A software-scheduled pipeline — the compiler determines exactly when each operation happens and where each byte of data goes. There's no hardware scheduler, no cache hierarchy, no branch prediction.
• ~750 TOPS (INT8) per chip

The philosophy is WYSIWYG computing: the compiler maps the neural network onto the hardware with cycle-exact timing. There's zero variability in execution time — you know exactly how long every inference will take. This is ideal for real-time applications.

The downside: 230MB of SRAM per chip means a large language model requires many chips. Groq racks many TSPs together, distributing the model across them.`
        },
        {
          heading: "Inference vs Training Hardware",
          text: `This distinction is crucial:

Training: Weights change every step. You need flexibility, large memory (for activations, gradients, optimizer states), and high FP16/BF16 throughput. GPUs excel here.

Inference: Weights are fixed. You need fast throughput, low latency, and efficiency. The computation is completely predictable. Specialized hardware like Groq's LPU, AWS Inferentia, or Google's TPU inference serving can outperform GPUs because they're not paying the hardware tax for flexibility they don't need.

For serving language models, the bottleneck is often memory bandwidth (reading weights for each token), not compute. This is why inference accelerators focus obsessively on bandwidth and low latency.`
        }
      ],
      terms: [
        { term: "LPU", def: "Language Processing Unit — Groq's marketing term for their TSP chip, optimized for inference. No HBM, fully compiler-scheduled." },
        { term: "TSP", def: "Tensor Streaming Processor — Groq's actual chip architecture. Software-scheduled, deterministic execution." },
        { term: "Inference", def: "Running a trained model to generate predictions/text. Different compute profile from training: weights are fixed, latency matters." },
        { term: "Tokens/second", def: "Key inference speed metric. Groq demonstrated ~500 tokens/sec for Llama 2 70B — significantly faster than GPU-based serving." }
      ]
    }
  },
  {
    id: "datacenter",
    era: "2022–Present",
    title: "The Datacenter as Computer",
    subtitle: "Racks, optics, and the fabric of AI",
    color: "#818cf8",
    content: {
      intro: `At frontier scale, the "computer" that trains a model isn't a chip, a card, or even a node — it's the entire datacenter. Training Llama 3 405B used 24,576 H100 GPUs running for months. At this scale, every component matters: networking, cooling, power, even the physical layout of racks.`,
      key_insight: `The fundamental insight of modern AI infrastructure is that inter-chip communication bandwidth is the bottleneck, not chip compute. The progression: NVLink within a node, InfiniBand/optical links between nodes, and now NVIDIA's NVLink domain (Grace Blackwell) which extends NVLink-speed connectivity across an entire rack of 72 GPUs.`,
      sections: [
        {
          heading: "The Network Fabric",
          text: `Inside a datacenter, GPUs communicate through multiple network layers:

Intra-node (within a server): NVLink + NVSwitch. 900 GB/s per GPU (H100). Feels like one big GPU.

Inter-node (between servers): InfiniBand or Ethernet with RDMA. 400-800 Gb/s per link. An order of magnitude slower than NVLink. This is why tensor parallelism stays within nodes.

The NVIDIA GB200 NVL72 (Blackwell, 2024) blurs this boundary: 72 GPUs connected by NVLink in a single rack, acting as one giant GPU with 13.5 TB of combined HBM. The rack IS the computer.

Between racks: Spine-leaf network topology using optical fiber. Optical transceivers convert electrical signals to light pulses for longer distances (~100m–2km). Companies like Broadcom and Cisco build the switches; companies like Coherent and II-VI make the optical transceivers.`
        },
        {
          heading: "Optical Interconnects",
          text: `Electrical signaling degrades over distance and consumes more power. Optical interconnects transmit data as light through fiber optic cables:

Advantages:
• Higher bandwidth over longer distances
• Lower power per bit at distance
• No electromagnetic interference
• Potential for wavelength-division multiplexing (multiple signals on one fiber)

The frontier: co-packaged optics (CPO) puts optical transceivers directly onto or next to the chip package, eliminating the electrical path to the edge of the board. NVIDIA, Intel, and startups like Ayar Labs are pursuing this. At the extreme, optical computing companies explore doing computation with light itself — but this is still research-stage.

At datacenter scale, optical networking is already standard for rack-to-rack communication. The trend is pushing optics closer and closer to the chip.`
        },
        {
          heading: "Power and Cooling",
          text: `A single H100 GPU draws ~700W. A DGX H100 node (8 GPUs) draws ~10kW. A pod of 256 GPUs: ~500kW. A frontier training cluster of 25,000 GPUs: ~25-50 MW. That's the power output of a small power plant.

Air cooling reaches its limits around 40kW per rack. Modern AI racks use liquid cooling — water or dielectric fluid circulated through cold plates on the GPUs. Direct-to-chip liquid cooling can handle 100+ kW per rack.

This is why AI companies are now building datacenters next to power plants, investing in nuclear power, and negotiating directly with utilities. The limiting factor for scaling AI is arguably no longer chips — it's power and cooling infrastructure.`
        }
      ],
      terms: [
        { term: "RDMA", def: "Remote Direct Memory Access — lets one machine read/write another machine's memory directly, bypassing the CPU. Essential for fast GPU-to-GPU communication across nodes." },
        { term: "Spine-Leaf", def: "Network topology where every 'leaf' switch connects to every 'spine' switch. Provides consistent latency and high bandwidth between any two nodes." },
        { term: "Optical Transceiver", def: "Converts electrical signals to light (and back) for fiber optic communication. Key component in datacenter networking." },
        { term: "GB200 NVL72", def: "NVIDIA's Blackwell rack-scale system: 72 GPUs connected by NVLink in a single rack. 13.5TB combined HBM, 1.4 exaflops FP4." },
        { term: "Co-Packaged Optics", def: "Placing optical transceivers on or adjacent to the chip package to minimize electrical distance. The next frontier in interconnect technology." }
      ]
    }
  },
  {
    id: "frontier",
    era: "2025+",
    title: "The Frontier",
    subtitle: "Scaling laws, sparsity, and what's next",
    color: "#f43f5e",
    content: {
      intro: `The entire story above — from pixel shaders to datacenter-scale optical fabrics — has been driven by one empirical observation: larger models trained on more data produce better results. The scaling laws (Kaplan et al., 2020; Hoffmann et al., 2022) formalized this into power laws relating compute, parameters, and data to model quality.`,
      key_insight: `We're entering an era where the hardware roadmap is being shaped directly by the needs of foundation models. The next generation of chips isn't just "faster" — it's architected around specific patterns: sparse attention, mixture-of-experts routing, long-context KV caches, and multi-modal (text + image + video + audio) processing.`,
      sections: [
        {
          heading: "The Scaling Compute Landscape",
          text: `NVIDIA's roadmap: annual cadence starting with Blackwell.
• Blackwell B200 (2024): 2,250 TFLOPS FP4, 192GB HBM3e, 8 TB/s bandwidth
• Architecture-level: FP4 tensor cores, second-gen transformer engine, on-chip decompression

Google's TPU roadmap: TPU v5p (2023), Trillium TPU (2024), with increasing pod sizes.

AMD's MI300X: 192GB HBM3, competitive with H100 on many benchmarks, and critically — a credible CUDA alternative via ROCm.

Custom silicon: Amazon Trainium, Microsoft Maia, Meta MTIA. Every hyperscaler is designing chips because buying from NVIDIA at margin is too expensive at their scale.`
        },
        {
          heading: "Mixture of Experts & Sparse Compute",
          text: `Mixture of Experts (MoE) models like Mixtral and (reportedly) GPT-4 activate only a fraction of parameters for each token. A 1.8T parameter MoE might only use 200B parameters per token.

This changes the hardware requirements: you need enough memory for ALL parameters (they must be resident), but compute is proportional to active parameters. This shifts the bottleneck from FLOPS to memory capacity and routing bandwidth.

Future hardware will likely optimize for sparse patterns: skip computation on zero values, route data to active experts efficiently, and provide more memory per FLOP.`
        },
        {
          heading: "Putting It All Together",
          text: `The full stack for training a frontier LLM:

Chip: Thousands of GPU/TPU dies, each containing tensor cores, HBM stacks on a silicon interposer, and high-speed SerDes for NVLink

Node: 8 chips connected by NVSwitch, with CPUs for orchestration and NVMe SSDs for checkpointing

Rack: Multiple nodes with top-of-rack switches, liquid cooling distribution, and power delivery. Possibly NVLink-domain (72 GPUs as one unit)

Pod: Racks connected by InfiniBand/Ethernet via spine-leaf topology with optical links

Cluster: Pods connected by datacenter fabric. Thousands of GPUs. Tens of megawatts of power.

Software: CUDA/ROCm → cuDNN/cuBLAS → PyTorch/JAX → Megatron-LM/DeepSpeed → training framework → your model

Each layer has been co-designed and optimized with the others. This is why the NVIDIA moat is so deep — it's not just CUDA, it's the entire vertical stack from transistors to training frameworks.`
        }
      ],
      terms: [
        { term: "Scaling Laws", def: "Empirical power-law relationships between compute, data, parameters, and model quality. The theoretical basis for why we keep building bigger systems." },
        { term: "MoE", def: "Mixture of Experts — architecture that activates only a subset of parameters per input. More total parameters but similar compute per token." },
        { term: "Megatron-LM", def: "NVIDIA's framework for efficient large-scale model training with 3D parallelism. Standard tool for training LLMs." },
        { term: "ROCm", def: "AMD's open-source GPU compute platform — their CUDA alternative. Gaining traction as an alternative for AI workloads." },
        { term: "Chiplet", def: "Smaller dies connected in one package. Instead of one huge die (low yield), combine smaller chiplets. AMD MI300X uses this approach." }
      ]
    }
  }
];

const DiagramOrigins = () => (
  <svg viewBox="0 0 600 220" style={{width:"100%",maxWidth:600}}>
    <defs>
      <linearGradient id="gO1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4ade80" stopOpacity="0.2"/><stop offset="100%" stopColor="#4ade80" stopOpacity="0.05"/></linearGradient>
    </defs>
    <rect x="10" y="10" width="120" height="50" rx="6" fill="url(#gO1)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="70" y="32" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="700">VERTICES</text>
    <text x="70" y="46" textAnchor="middle" fill="#4ade8088" fontSize="8">3D coordinates</text>
    <line x1="130" y1="35" x2="160" y2="35" stroke="#4ade8066" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
    <defs><marker id="arrowG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#4ade80"/></marker></defs>
    <rect x="160" y="10" width="120" height="50" rx="6" fill="url(#gO1)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="220" y="32" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="700">VERTEX PROC</text>
    <text x="220" y="46" textAnchor="middle" fill="#4ade8088" fontSize="8">Matrix × position</text>
    <line x1="280" y1="35" x2="310" y2="35" stroke="#4ade8066" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
    <rect x="310" y="10" width="120" height="50" rx="6" fill="url(#gO1)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="370" y="32" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="700">RASTERIZE</text>
    <text x="370" y="46" textAnchor="middle" fill="#4ade8088" fontSize="8">Triangles → pixels</text>
    <line x1="430" y1="35" x2="460" y2="35" stroke="#4ade8066" strokeWidth="1.5" markerEnd="url(#arrowG)"/>
    <rect x="460" y="10" width="120" height="50" rx="6" fill="url(#gO1)" stroke="#4ade80" strokeWidth="1.5"/>
    <text x="520" y="32" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="700">PIXEL PROC</text>
    <text x="520" y="46" textAnchor="middle" fill="#4ade8088" fontSize="8">Color, lighting</text>
    <text x="300" y="90" textAnchor="middle" fill="#ffffff55" fontSize="9" fontStyle="italic">Each stage processes many elements in parallel — this is the GPU's DNA</text>
    <g transform="translate(30, 110)">
      {Array.from({length:8}).map((_,r) => Array.from({length:24}).map((_,c) => (
        <rect key={`${r}-${c}`} x={c*22} y={r*12} width="18" height="8" rx="1" fill={`hsl(${140 + Math.sin(r*c*0.3)*20}, 70%, ${40+Math.random()*15}%)`} opacity="0.6"/>
      )))}
      <text x="264" y="50" textAnchor="middle" fill="#ffffff44" fontSize="9">← 192 pixels, each independently colored →</text>
    </g>
  </svg>
);

const DiagramShaders = () => (
  <svg viewBox="0 0 600 200" style={{width:"100%",maxWidth:600}}>
    <text x="300" y="18" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="700">STREAMING MULTIPROCESSOR (SM)</text>
    <rect x="20" y="28" width="560" height="160" rx="8" fill="#60a5fa0a" stroke="#60a5fa33" strokeWidth="1"/>
    {[0,1,2,3].map(w => (
      <g key={w} transform={`translate(${35 + w*138}, 44)`}>
        <text x="55" y="0" textAnchor="middle" fill="#60a5fa99" fontSize="8">WARP {w}</text>
        {Array.from({length:32}).map((_,i) => (
          <rect key={i} x={(i%8)*14} y={6 + Math.floor(i/8)*14} width="11" height="11" rx="2" fill="#60a5fa" opacity={0.3 + Math.random()*0.4}/>
        ))}
        <text x="55" y="72" textAnchor="middle" fill="#60a5fa66" fontSize="7">32 threads in lockstep</text>
      </g>
    ))}
    <rect x="40" y="130" width="200" height="26" rx="4" fill="#fbbf2411" stroke="#fbbf2444" strokeWidth="1"/>
    <text x="140" y="147" textAnchor="middle" fill="#fbbf24" fontSize="9">Shared Memory / L1 (128KB)</text>
    <rect x="260" y="130" width="140" height="26" rx="4" fill="#f472b611" stroke="#f472b644" strokeWidth="1"/>
    <text x="330" y="147" textAnchor="middle" fill="#f472b6" fontSize="9">Register File (256KB)</text>
    <rect x="420" y="130" width="140" height="26" rx="4" fill="#4ade8011" stroke="#4ade8044" strokeWidth="1"/>
    <text x="490" y="147" textAnchor="middle" fill="#4ade80" fontSize="9">Warp Scheduler</text>
    <text x="300" y="178" textAnchor="middle" fill="#ffffff33" fontSize="8">All warps in an SM share memory and scheduling resources</text>
  </svg>
);

const DiagramMemory = () => (
  <svg viewBox="0 0 600 220" style={{width:"100%",maxWidth:600}}>
    <defs>
      <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f472b6" stopOpacity="0.3"/><stop offset="100%" stopColor="#f472b6" stopOpacity="0.05"/></linearGradient>
    </defs>
    {[
      {y:10, w:100, label:"Registers", speed:"~0 cycles", size:"256KB/SM", color:"#f43f5e"},
      {y:50, w:180, label:"Shared Memory / L1", speed:"~30 cycles", size:"128KB/SM", color:"#f97316"},
      {y:90, w:280, label:"L2 Cache", speed:"~200 cycles", size:"50MB", color:"#fbbf24"},
      {y:130, w:420, label:"HBM (Global VRAM)", speed:"~500 cycles", size:"80GB", color:"#a78bfa"},
      {y:170, w:560, label:"System RAM (CPU)", speed:"~1000s cycles", size:"TBs", color:"#60a5fa"},
    ].map(({y,w,label,speed,size,color}) => (
      <g key={label}>
        <rect x={(600-w)/2} y={y} width={w} height="32" rx="4" fill={color+"11"} stroke={color+"66"} strokeWidth="1"/>
        <text x={300} y={y+15} textAnchor="middle" fill={color} fontSize="10" fontWeight="600">{label}</text>
        <text x={300} y={y+27} textAnchor="middle" fill={color+"88"} fontSize="8">{speed} · {size}</text>
      </g>
    ))}
    <text x="580" y="25" textAnchor="end" fill="#ffffff22" fontSize="8">FASTER</text>
    <text x="580" y="195" textAnchor="end" fill="#ffffff22" fontSize="8">BIGGER</text>
    <line x1="585" y1="30" x2="585" y2="188" stroke="#ffffff11" strokeWidth="1" markerEnd="url(#arrowW)"/>
    <defs><marker id="arrowW" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#ffffff22"/></marker></defs>
  </svg>
);

const DiagramTransformer = () => (
  <svg viewBox="0 0 600 280" style={{width:"100%",maxWidth:600}}>
    <text x="300" y="18" textAnchor="middle" fill="#e879f9" fontSize="11" fontWeight="700">SELF-ATTENTION COMPUTATION</text>
    {["Q (Queries)","K (Keys)","V (Values)"].map((label,i) => (
      <g key={i}>
        <rect x={60+i*190} y={35} width="150" height="30" rx="4" fill="#e879f911" stroke="#e879f944" strokeWidth="1"/>
        <text x={135+i*190} y={54} textAnchor="middle" fill="#e879f9" fontSize="10">{label}</text>
        <text x={135+i*190} y={80} textAnchor="middle" fill="#ffffff33" fontSize="8">T × d_k</text>
      </g>
    ))}
    <text x="225" y="110" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">QKᵀ</text>
    <rect x="150" y="118" width="150" height="80" rx="4" fill="#fbbf2408" stroke="#fbbf2433" strokeWidth="1"/>
    {Array.from({length:8}).map((_,r) => Array.from({length:8}).map((_,c) => (
      <rect key={`${r}${c}`} x={156+c*18} y={124+r*9} width="14" height="6" rx="1" fill="#fbbf24" opacity={Math.max(0.05, 0.5-Math.abs(r-c)*0.08)}/>
    )))}
    <text x="225" y="210" textAnchor="middle" fill="#fbbf2488" fontSize="8">T × T attention matrix</text>
    <text x="400" y="150" textAnchor="start" fill="#ffffff44" fontSize="9">← Each cell: how much</text>
    <text x="400" y="163" textAnchor="start" fill="#ffffff44" fontSize="9">   token i attends to j</text>
    <text x="400" y="176" textAnchor="start" fill="#ffffff44" fontSize="9">   (all computed in parallel)</text>
    <line x1="225" y1="220" x2="225" y2="235" stroke="#e879f944" strokeWidth="1.5" markerEnd="url(#arrowP)"/>
    <defs><marker id="arrowP" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto"><path d="M0,0 L6,2.5 L0,5" fill="#e879f9"/></marker></defs>
    <text x="225" y="248" textAnchor="middle" fill="#e879f9" fontSize="9">softmax → × V → output</text>
    <text x="225" y="270" textAnchor="middle" fill="#ffffff33" fontSize="8">128K context → 128K × 128K = 16 billion attention entries</text>
  </svg>
);

const DiagramMultiGPU = () => (
  <svg viewBox="0 0 600 200" style={{width:"100%",maxWidth:600}}>
    <text x="300" y="16" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="700">NODE: 8 GPUs + NVSwitch</text>
    <rect x="20" y="25" width="560" height="80" rx="8" fill="#38bdf80a" stroke="#38bdf833" strokeWidth="1"/>
    {Array.from({length:8}).map((_,i) => (
      <g key={i}>
        <rect x={36+i*66} y={40} width="50" height="50" rx="4" fill="#38bdf822" stroke="#38bdf866" strokeWidth="1"/>
        <text x={61+i*66} y={62} textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="600">GPU {i}</text>
        <text x={61+i*66} y={78} textAnchor="middle" fill="#38bdf866" fontSize="7">80GB</text>
      </g>
    ))}
    <rect x="180" y="95" width="240" height="16" rx="3" fill="#fbbf2411" stroke="#fbbf2444" strokeWidth="1"/>
    <text x="300" y="106" textAnchor="middle" fill="#fbbf24" fontSize="8">NVSwitch — 900 GB/s per GPU</text>
    <text x="300" y="130" textAnchor="middle" fill="#ffffff33" fontSize="8">↕ InfiniBand 400 Gb/s to other nodes</text>
    <g transform="translate(50, 145)">
      {Array.from({length:4}).map((_,i) => (
        <g key={i}>
          <rect x={i*130} y={0} width="110" height="30" rx="4" fill="#818cf811" stroke="#818cf833" strokeWidth="1"/>
          <text x={55+i*130} y={14} textAnchor="middle" fill="#818cf8" fontSize="7" fontWeight="600">NODE {i+1}</text>
          <text x={55+i*130} y={25} textAnchor="middle" fill="#818cf866" fontSize="7">8× GPU</text>
          {i < 3 && <line x1={110+i*130} y1={15} x2={130+i*130} y2={15} stroke="#818cf833" strokeWidth="1" strokeDasharray="3,3"/>}
        </g>
      ))}
      <text x="250" y="48" textAnchor="middle" fill="#ffffff22" fontSize="8">← RACK (32-64 GPUs) →</text>
    </g>
  </svg>
);

const DiagramCerebras = () => (
  <svg viewBox="0 0 600 200" style={{width:"100%",maxWidth:600}}>
    <text x="170" y="18" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">NORMAL GPU DIE</text>
    <text x="440" y="18" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">WAFER-SCALE ENGINE</text>
    <rect x="120" y="30" width="100" height="100" rx="4" fill="#ef444411" stroke="#ef444466" strokeWidth="1.5"/>
    <text x="170" y="75" textAnchor="middle" fill="#ef4444" fontSize="9">~800mm²</text>
    <text x="170" y="90" textAnchor="middle" fill="#ef444488" fontSize="8">1 GPU die</text>
    <circle cx="440" cy="90" r="75" fill="#ef444408" stroke="#ef444466" strokeWidth="1.5"/>
    {Array.from({length:12}).map((_,r) => Array.from({length:12}).map((_,c) => {
      const cx2 = 440 + (c-5.5)*12;
      const cy2 = 90 + (r-5.5)*12;
      const dist = Math.sqrt((cx2-440)**2 + (cy2-90)**2);
      if (dist > 68) return null;
      return <rect key={`${r}${c}`} x={cx2-4} y={cy2-4} width="9" height="9" rx="1" fill="#ef4444" opacity={0.15+Math.random()*0.3}/>;
    }))}
    <text x="440" y="180" textAnchor="middle" fill="#ef4444" fontSize="9">46,225mm² — 56× larger</text>
    <text x="440" y="194" textAnchor="middle" fill="#ef444488" fontSize="8">900,000 cores · 44GB SRAM on-chip</text>
    <text x="300" y="85" textAnchor="middle" fill="#ffffff22" fontSize="20">→</text>
  </svg>
);

const DIAGRAMS = {
  origins: DiagramOrigins,
  shaders: DiagramShaders,
  memory: DiagramMemory,
  transformers: DiagramTransformer,
  "multi-gpu": DiagramMultiGPU,
  cerebras: DiagramCerebras
};

export default function GPUEvolution() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [expandedTerms, setExpandedTerms] = useState({});
  const contentRef = useRef(null);

  const chapter = CHAPTERS[activeChapter];
  const DiagramComponent = DIAGRAMS[chapter.id];

  const toggleTerm = useCallback((term) => {
    setExpandedTerms(prev => ({...prev, [term]: !prev[term]}));
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    setExpandedTerms({});
  }, [activeChapter]);

  return (
    <div style={{
      display:"flex", height:"100vh", fontFamily:"'IBM Plex Sans', 'Helvetica Neue', sans-serif",
      background:"#0a0e17", color:"#e2e8f0", overflow:"hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <nav style={{
        width:280, minWidth:280, borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column",
        background:"#0d1117", overflowY:"auto"
      }}>
        <div style={{padding:"20px 16px 12px", borderBottom:"1px solid #1e293b"}}>
          <h1 style={{fontFamily:"'Instrument Serif', Georgia, serif", fontSize:22, margin:0, color:"#f8fafc", letterSpacing:"-0.02em"}}>
            Silicon Atlas
          </h1>
          <p style={{fontSize:11, color:"#64748b", margin:"4px 0 0", lineHeight:1.4}}>
            The evolution of parallel computing from pixels to frontier AI
          </p>
        </div>
        <div style={{flex:1, padding:"8px 0"}}>
          {CHAPTERS.map((ch, i) => (
            <button key={ch.id} onClick={() => setActiveChapter(i)} style={{
              display:"flex", alignItems:"flex-start", gap:10, width:"100%", padding:"10px 16px",
              background: i === activeChapter ? ch.color + "0d" : "transparent",
              border:"none", borderLeft: i === activeChapter ? `2px solid ${ch.color}` : "2px solid transparent",
              cursor:"pointer", textAlign:"left", transition:"all 0.15s"
            }}>
              <span style={{
                fontSize:9, fontFamily:"'IBM Plex Mono', monospace", color: i === activeChapter ? ch.color : "#475569",
                minWidth:38, paddingTop:2
              }}>{ch.era}</span>
              <div>
                <div style={{fontSize:12, fontWeight:600, color: i === activeChapter ? "#f1f5f9" : "#94a3b8", lineHeight:1.3}}>
                  {ch.title}
                </div>
                <div style={{fontSize:10, color: i === activeChapter ? "#64748b" : "#334155", lineHeight:1.3, marginTop:1}}>
                  {ch.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main ref={contentRef} style={{flex:1, overflowY:"auto", padding:"32px 40px 80px"}}>
        <div style={{maxWidth:720}}>
          {/* Chapter Header */}
          <div style={{marginBottom:28}}>
            <span style={{
              fontFamily:"'IBM Plex Mono', monospace", fontSize:11, color:chapter.color, fontWeight:500,
              background:chapter.color+"15", padding:"3px 10px", borderRadius:20
            }}>
              {chapter.era}
            </span>
            <h2 style={{
              fontFamily:"'Instrument Serif', Georgia, serif", fontSize:36, margin:"12px 0 4px",
              color:"#f8fafc", letterSpacing:"-0.02em", lineHeight:1.1
            }}>
              {chapter.title}
            </h2>
            <p style={{fontSize:15, color:"#64748b", margin:0, fontStyle:"italic"}}>{chapter.subtitle}</p>
          </div>

          {/* Intro */}
          <p style={{fontSize:15, lineHeight:1.75, color:"#cbd5e1", marginBottom:20}}>
            {chapter.content.intro}
          </p>

          {/* Key Insight */}
          <div style={{
            background: chapter.color+"08", borderLeft:`3px solid ${chapter.color}`, padding:"14px 18px",
            borderRadius:"0 6px 6px 0", marginBottom:28
          }}>
            <div style={{fontSize:10, fontWeight:700, color:chapter.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4}}>
              Key Insight
            </div>
            <p style={{fontSize:14, lineHeight:1.7, color:"#e2e8f0", margin:0}}>
              {chapter.content.key_insight}
            </p>
          </div>

          {/* Diagram */}
          {DiagramComponent && (
            <div style={{margin:"24px 0 32px", background:"#0d111766", borderRadius:8, padding:"16px 12px", border:"1px solid #1e293b"}}>
              <DiagramComponent />
            </div>
          )}

          {/* Sections */}
          {chapter.content.sections.map((sec, i) => (
            <div key={i} style={{marginBottom:28}}>
              <h3 style={{fontSize:17, fontWeight:700, color:"#f1f5f9", marginBottom:10, lineHeight:1.3}}>
                {sec.heading}
              </h3>
              <div style={{fontSize:14, lineHeight:1.8, color:"#b0bac9", whiteSpace:"pre-line"}}>
                {sec.text}
              </div>
            </div>
          ))}

          {/* Terms */}
          {chapter.content.terms && (
            <div style={{marginTop:36, borderTop:"1px solid #1e293b", paddingTop:20}}>
              <h3 style={{fontSize:13, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12}}>
                Key Terms
              </h3>
              <div style={{display:"flex", flexDirection:"column", gap:6}}>
                {chapter.content.terms.map(({term, def}) => (
                  <button key={term} onClick={() => toggleTerm(term)} style={{
                    background:"#1e293b22", border:"1px solid #1e293b", borderRadius:6, padding:"10px 14px",
                    cursor:"pointer", textAlign:"left", transition:"all 0.15s"
                  }}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <span style={{fontFamily:"'IBM Plex Mono', monospace", fontSize:13, fontWeight:600, color:chapter.color}}>
                        {term}
                      </span>
                      <span style={{fontSize:11, color:"#475569", transform: expandedTerms[term] ? "rotate(180deg)" : "rotate(0)", transition:"transform 0.15s"}}>
                        ▼
                      </span>
                    </div>
                    {expandedTerms[term] && (
                      <p style={{fontSize:13, lineHeight:1.6, color:"#94a3b8", margin:"8px 0 0"}}>
                        {def}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{display:"flex", justifyContent:"space-between", marginTop:40, paddingTop:20, borderTop:"1px solid #1e293b"}}>
            <button
              onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
              disabled={activeChapter === 0}
              style={{
                background:"none", border:"1px solid #1e293b", borderRadius:6, padding:"8px 18px",
                color: activeChapter === 0 ? "#334155" : "#94a3b8", cursor: activeChapter === 0 ? "default" : "pointer",
                fontSize:13
              }}
            >
              ← Previous
            </button>
            <span style={{fontSize:12, color:"#475569", alignSelf:"center"}}>
              {activeChapter + 1} / {CHAPTERS.length}
            </span>
            <button
              onClick={() => setActiveChapter(Math.min(CHAPTERS.length - 1, activeChapter + 1))}
              disabled={activeChapter === CHAPTERS.length - 1}
              style={{
                background: activeChapter === CHAPTERS.length - 1 ? "none" : chapter.color+"22",
                border:`1px solid ${activeChapter === CHAPTERS.length - 1 ? "#1e293b" : chapter.color+"44"}`,
                borderRadius:6, padding:"8px 18px",
                color: activeChapter === CHAPTERS.length - 1 ? "#334155" : chapter.color,
                cursor: activeChapter === CHAPTERS.length - 1 ? "default" : "pointer", fontSize:13
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
