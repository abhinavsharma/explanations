import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;

import { useState, useRef, useEffect } from "react";

const MODELS = [
  {
    id: "gpt1",
    name: "GPT-1: Pre-train + Fine-tune",
    year: "2018",
    who: "Radford et al. (OpenAI)",
    tagline: "Pre-train a transformer on raw text, then fine-tune for tasks. The paradigm shift.",
    stats: { params: "117M", data: "BookCorpus (7k books)", ctx: "512 tokens" },
    color: "#8B6914",
    icon: "🔑",
    intuition: `Before GPT-1, NLP was task-specific: train a model from scratch for sentiment, another for NER, another for translation. GPT-1's insight: train one big language model on lots of text (unsupervised), then fine-tune on each task with a small labeled dataset.\n\nThis worked shockingly well. A 117M parameter transformer pre-trained on BookCorpus could be fine-tuned to beat task-specific architectures that had been engineered for years. The pre-trained representations transferred across tasks — the model "understood" language in some general sense.\n\nThe architecture is a standard decoder-only transformer with causal masking. 12 layers, 768-dim hidden, 12 heads. Nothing exotic — the contribution is the training recipe.`,
    limitation: `Fine-tuning is expensive and requires labeled data for each new task. The model is small and the training data is tiny by modern standards. But the conceptual framework — unsupervised pre-training as a foundation — is the template for everything that follows.`,
    diagram: "gpt1",
    code: `# GPT-1's contribution is the recipe, not the architecture:

# Phase 1: Unsupervised pre-training (language modeling)
for batch in BookCorpus:
    logits = transformer(batch)        # standard causal LM
    loss = cross_entropy(logits, targets)
    loss.backward()

# Phase 2: Supervised fine-tuning per task
# Add a linear classification head on top
class GPT1ForClassification(nn.Module):
    def __init__(self, gpt, n_classes):
        self.gpt = gpt  # pre-trained weights
        self.head = nn.Linear(768, n_classes)
    
    def forward(self, x):
        h = self.gpt(x)[:, -1, :]  # last token repr
        return self.head(h)

# Fine-tune end-to-end on labeled data
# Key insight: pre-trained features transfer across tasks`,
  },
  {
    id: "scaling",
    name: "GPT-2/3: Scaling & In-Context Learning",
    year: "2019–2020",
    who: "Radford et al.; Brown et al. (OpenAI)",
    tagline: "Scale the model 1000×. Discover that big models can learn tasks from examples in the prompt.",
    stats: { params: "1.5B → 175B", data: "WebText → 300B tokens", ctx: "1024 → 2048" },
    color: "#6B4C8A",
    icon: "📈",
    intuition: `GPT-2 (1.5B params) showed that a bigger model generates more coherent text. Interesting but not revolutionary. GPT-3 (175B) was the phase transition.\n\nThe discovery: GPT-3 can perform tasks it was never fine-tuned for by seeing just a few examples in the prompt. "Translate English to French: sea otter → loutre de mer, cheese → " — and it outputs "fromage". This is in-context learning (ICL), and nobody fully understands why it works even now.\n\nThe scaling hypothesis crystallized: performance improves predictably with scale. Kaplan et al. (2020) showed loss follows power laws in parameters, data, and compute. This made billion-dollar training runs economically rational — you could predict the return on investment.\n\nGPT-3 is still a dense decoder-only transformer. Same architecture as GPT-1, just 1500× bigger. The magic is entirely in scale.`,
    limitation: `Three problems: (1) The model will happily generate toxic, false, or harmful content — it's optimized for next-token prediction, not helpfulness. (2) It can't follow instructions reliably. (3) 175B params is expensive to serve. The first two problems demand a new training paradigm beyond pure language modeling.`,
    diagram: "scaling",
    code: `# GPT-3's "few-shot" in-context learning:
prompt = """Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>"""

# No gradient updates! The model "learns" the task
# from the pattern in the prompt alone.
completion = gpt3.generate(prompt)  # => "fromage"

# Scaling laws (Kaplan et al. 2020):
# L(N) ≈ (N_c / N)^α_N  where α_N ≈ 0.076
# L(D) ≈ (D_c / D)^α_D  where α_D ≈ 0.095  
# L(C) ≈ (C_c / C)^α_C  where α_C ≈ 0.050
#
# Loss is a smooth power law in parameters, data, compute
# This makes scaling PREDICTABLE → justifies $100M runs`,
  },
  {
    id: "rlhf",
    name: "RLHF: InstructGPT / ChatGPT",
    year: "2022",
    who: "Ouyang et al. (OpenAI); Bai et al. (Anthropic)",
    tagline: "Align the model to human preferences with reinforcement learning. The birth of 'post-training'.",
    stats: { params: "~175B (base)", data: "+100K human comparisons", ctx: "4096" },
    color: "#2D6A4F",
    icon: "🎯",
    intuition: `Pre-trained models predict text. But users want helpful, harmless, honest assistants. These are different objectives. RLHF bridges the gap in three stages:\n\n1. SFT (Supervised Fine-Tuning): Fine-tune on demonstrations of ideal assistant behavior. Human contractors write ideal responses to prompts. This teaches format and style.\n\n2. Reward Model (RM): Show the model two responses to the same prompt. Humans say which is better. Train a model to predict these preferences. This encodes "what humans want" as a scalar signal.\n\n3. RL (PPO): Optimize the language model to maximize the reward model's score, with a KL penalty to prevent diverging too far from the SFT model. This is the actual alignment step.\n\nThe result (InstructGPT / ChatGPT) was dramatically more useful than raw GPT-3 despite being much smaller (~1.3B in the InstructGPT paper). Post-training matters more than most people realize.\n\nAnthropic's parallel contribution: Constitutional AI (2022) — replace human preferences with AI-generated preferences guided by a written constitution. This scales alignment and makes it more systematic.`,
    limitation: `Reward hacking: the model can learn to produce outputs that score well on the reward model without actually being good. The KL penalty helps but doesn't fully solve it. Also, PPO is notoriously unstable and hyperparameter-sensitive. And human preferences are noisy, inconsistent, and biased.`,
    diagram: "rlhf",
    code: `# Stage 1: SFT
sft_model = finetune(base_model, demonstration_data)

# Stage 2: Reward Model
class RewardModel(nn.Module):
    def __init__(self, base_model):
        self.backbone = base_model
        self.head = nn.Linear(d_model, 1)
    
    def forward(self, prompt, response):
        h = self.backbone(prompt + response)[:, -1]
        return self.head(h)  # scalar reward

# Train on human comparisons: (prompt, chosen, rejected)
loss = -log(sigmoid(RM(prompt, chosen) - RM(prompt, rejected)))

# Stage 3: PPO
for prompt in prompts:
    response = policy.generate(prompt)
    reward = RM(prompt, response)
    kl_penalty = KL(policy || sft_model)
    objective = reward - β * kl_penalty
    ppo_update(policy, objective)

# Constitutional AI (Anthropic): replace human labels
# with AI self-critique guided by a written constitution`,
  },
  {
    id: "moe",
    name: "Mixture of Experts (MoE)",
    year: "2023–2024",
    who: "GPT-4 (rumored), Mixtral (Mistral), DeepSeek-V2/V3",
    tagline: "Activate only a fraction of parameters per token. Scale total params without scaling compute.",
    stats: { params: "1.8T total / 280B active (GPT-4 rumored)", data: "13T+ tokens", ctx: "8K–128K" },
    color: "#9B2226",
    icon: "🧩",
    intuition: `Dense transformers hit a wall: doubling parameters doubles both training and inference cost. MoE breaks this coupling.\n\nReplace each FFN layer with N parallel "expert" FFNs plus a learned router. For each token, the router selects the top-k experts (usually k=1 or 2). Only those experts' parameters are activated. Total params can be 10× active params.\n\nGPT-4 (leaked/rumored via SemiAnalysis, 2023): 16 experts of ~111B each, ~1.8T total params, ~280B active per token. This is how OpenAI scaled 10× beyond GPT-3 without 10× the compute.\n\nMixtral 8×7B (Dec 2023, open source): 8 experts, top-2 routing. 47B total, ~13B active. Matched GPT-3.5-level quality.\n\nDeepSeek-V3 (late 2024): 256 experts with fine-grained routing, auxiliary-loss-free balancing. 671B total, 37B active. Trained for $5.5M. The efficiency frontier.\n\nThe router is a simple linear layer + softmax → top-k selection. Training requires load-balancing losses to prevent expert collapse (all tokens going to one expert).`,
    limitation: `All experts must be in memory even though only a fraction are used — VRAM-hungry. Communication overhead in distributed training (expert parallelism). Load imbalance between experts degrades throughput. And routing decisions are discrete, making training tricky. Token dropping when experts overflow capacity.`,
    diagram: "moe",
    code: `class MoELayer(nn.Module):
    def __init__(self, d_model, d_ff, n_experts, top_k=2):
        super().__init__()
        self.experts = nn.ModuleList([
            FFN(d_model, d_ff) for _ in range(n_experts)
        ])
        self.router = nn.Linear(d_model, n_experts)  # simple!
        self.top_k = top_k
    
    def forward(self, x):  # x: (B, T, d_model)
        # Router: which experts for each token?
        logits = self.router(x)              # (B, T, n_experts)
        weights, indices = logits.topk(self.top_k, dim=-1)
        weights = F.softmax(weights, dim=-1)
        
        # Only run selected experts (sparse!)
        out = torch.zeros_like(x)
        for k in range(self.top_k):
            expert_idx = indices[..., k]
            expert_weight = weights[..., k:k+1]
            for e in range(len(self.experts)):
                mask = (expert_idx == e)
                if mask.any():
                    out[mask] += expert_weight[mask] * \\
                                 self.experts[e](x[mask])
        return out
    
    # Load balancing loss prevents expert collapse:
    # L_balance = α * N * Σᵢ fᵢ * Pᵢ  
    # where fᵢ = fraction of tokens routed to expert i
    # and Pᵢ = average router probability for expert i`,
  },
  {
    id: "context",
    name: "Long Context & Efficient Attention",
    year: "2022–2025",
    who: "Dao (Flash Attention), Su (RoPE/YaRN), Anthropic (100K+)",
    tagline: "Push context from 2K → 200K+ tokens. Efficient kernels, better position encodings, smart infra.",
    stats: { params: "—", data: "+long-doc training", ctx: "2K → 200K+" },
    color: "#E76F51",
    icon: "📏",
    intuition: `Standard attention is O(T²) — 128K tokens means ~16B attention entries per layer per head. Three innovations made this tractable:\n\n**Flash Attention (Dao, 2022):** Exact attention, but tiled to exploit GPU SRAM. Avoids materializing the full T×T attention matrix in HBM. 2–4× faster, O(T) memory instead of O(T²). This isn't an approximation — it's the same math, just IO-aware.\n\n**RoPE + Extensions (Su 2021, YaRN 2023):** Rotary Position Embeddings encode position by rotating Q and K vectors. Elegant: attention between positions i,j depends only on (i-j). But models trained at 4K context degrade at 32K. YaRN/NTK-scaling interpolate the RoPE frequencies to extrapolate to longer contexts. ALiBi (Press et al.) adds a linear decay bias instead.\n\n**Training on Long Documents:** You must actually train on long-range data. A model trained on 4K chunks can't suddenly reason over 100K, even with RoPE scaling. Anthropic's 100K context Claude (2023) was trained with progressively longer documents. Sparse attention patterns in long documents are learned, not engineered.\n\n**Ring Attention (2023):** Distributes sequences across devices along the sequence dimension, overlapping communication with computation. Enables context lengths limited only by total memory, not per-device memory.`,
    limitation: `Even with Flash Attention, compute is still quadratic — it's just hidden behind better memory access patterns. KV-cache for inference grows linearly with context: a 200K context with 128 layers = massive memory. This drives GQA (fewer KV heads) and compression techniques. Models also struggle to actually *use* information in the middle of very long contexts (the "lost in the middle" phenomenon).`,
    diagram: "context",
    code: `# Flash Attention: same math, better memory access
# Standard: O(T²) HBM reads/writes (slow!)
# Flash: O(T² * d / SRAM_size) HBM accesses (fast!)

# The key: tile the computation
for block_q in Q_blocks:       # iterate over query tiles
    for block_k in K_blocks:   # iterate over key tiles
        # Load small tiles into SRAM (fast on-chip memory)
        # Compute local attention scores
        # Update running softmax statistics (online softmax)
        # Accumulate output — never materialize full T×T matrix
        
# RoPE: rotate Q and K by position-dependent angle
def apply_rope(x, freqs):
    # x: (..., d), freqs: (T, d/2)
    x_complex = x.view(..., d//2, 2).as_complex()  # pair dims
    rotated = x_complex * freqs  # complex multiplication = rotation
    return rotated.as_real().flatten(-2)

# YaRN context extension: scale the RoPE frequencies
# to interpolate between trained and extrapolated positions
# ratio = target_ctx / train_ctx
# θ_new = θ_old / ratio  (for low-frequency dimensions)
# This lets a 4K model work at 128K with minimal fine-tuning`,
  },
  {
    id: "multimodal",
    name: "Multimodal: Vision + Audio",
    year: "2023–2025",
    who: "GPT-4V, Claude 3, Gemini, LLaVA",
    tagline: "Feed images and audio into the same transformer. Vision encoder → projection → LLM.",
    stats: { params: "+400M (ViT encoder)", data: "+image-text pairs", ctx: "images = ~576–2048 tokens" },
    color: "#457B9D",
    icon: "👁️",
    intuition: `The dominant approach for adding vision to LLMs is conceptually simple:\n\n1. **Vision Encoder:** Take a pre-trained ViT (e.g., SigLIP, CLIP). It turns an image into a grid of patch embeddings — say 576 vectors for a 384×384 image at 16px patches.\n\n2. **Projection:** A learned MLP (or cross-attention layer) maps vision embeddings into the LLM's embedding space. This is the "adapter" that bridges modalities.\n\n3. **Interleave:** Insert the projected image tokens into the LLM's input sequence alongside text tokens. The self-attention mechanism handles the rest — the model learns to attend to relevant image patches when generating text.\n\nGPT-4V, Claude 3, Gemini all use variants of this. The key architectural decision: early fusion (image tokens in the main transformer from the start) vs. late fusion (process image separately, cross-attend later). Early fusion seems to win for deep understanding.\n\nGPT-4o went further: a single end-to-end model for text, vision, and audio — no separate ASR/TTS pipeline. Audio tokens are treated just like text and image tokens. This dramatically reduces latency for voice interactions.\n\nTraining: pre-train on massive image-text datasets (LAION, internal), then instruction-tune with visual QA.`,
    limitation: `Image tokens are expensive — a single high-res image can cost 2000+ tokens of context. Video is even worse (frames × patches). Current models are still weak on precise spatial reasoning, counting, reading dense diagrams, and understanding temporal sequences in video. And we don't fully understand what the model "sees" vs. what it's pattern-matching from training data.`,
    diagram: "multimodal",
    code: `class MultimodalLLM(nn.Module):
    def __init__(self, llm, vision_encoder, projector):
        super().__init__()
        self.llm = llm                    # decoder-only transformer
        self.vit = vision_encoder         # pre-trained ViT (frozen or fine-tuned)
        self.proj = projector             # MLP: vision_dim → llm_dim
    
    def forward(self, text_tokens, images=None):
        text_emb = self.llm.embed(text_tokens)
        
        if images is not None:
            # Encode image → patch embeddings
            img_features = self.vit(images)      # (B, n_patches, vis_dim)
            img_tokens = self.proj(img_features)  # (B, n_patches, llm_dim)
            
            # Interleave: [img_tokens, text_emb] or at <image> positions
            combined = interleave(text_emb, img_tokens)
        else:
            combined = text_emb
        
        # Standard causal LM forward pass
        # Self-attention naturally handles cross-modal reasoning
        logits = self.llm.decoder(combined)
        return logits

# GPT-4o: text + vision + audio in ONE model
# Audio tokens processed identically to text/image
# Enables real-time voice conversation without ASR/TTS pipeline`,
  },
  {
    id: "cot",
    name: "Chain-of-Thought & Reasoning",
    year: "2022–2024",
    who: "Wei et al. (Google); o1 (OpenAI); DeepSeek-R1",
    tagline: "Let the model 'think step by step'. Then train it to do so with RL.",
    stats: { params: "—", data: "+reasoning traces", ctx: "up to 128K (extended thinking)" },
    color: "#1B4965",
    icon: "💭",
    intuition: `Transformers compute a fixed amount per token — every forward pass through the layers is the same depth of computation. For hard problems, this is a bottleneck: the model must "think" and output simultaneously.\n\nChain-of-thought (CoT) prompting (Wei et al., 2022): just add "Let's think step by step" and the model generates intermediate reasoning. This works because each generated token gets a full forward pass — more tokens = more computation. Generating 100 reasoning tokens before the answer is like giving the model 100× more serial compute.\n\nOpenAI's o1 (2024) formalized this: train a model with RL to produce long internal reasoning chains before answering. The model learns when to break down problems, check its work, try alternative approaches. The thinking tokens are "test-time compute" — you trade inference cost for quality.\n\nDeepSeek-R1 (Jan 2025) showed this can emerge from pure RLVR (RL with Verifiable Rewards) — no human reasoning demonstrations needed. The model discovers chain-of-thought on its own when optimized to produce correct answers on math/code. Emergent self-reflection, backtracking, and strategy switching.\n\nThis is a paradigm shift: model quality is no longer fixed at training time. You can "scale" quality at inference by letting the model think longer.`,
    limitation: `Longer thinking = more tokens = higher cost and latency. The model can also generate plausible-looking but wrong reasoning chains (faithfulness problem). And we don't know if this form of "reasoning" generalizes the way human reasoning does, or if it's sophisticated pattern matching over training distribution.`,
    diagram: "cot",
    code: `# Simple CoT prompting (2022):
prompt = """Q: If a store has 23 apples and sells 
17, then receives a shipment of 31, how many?
A: Let's think step by step.
- Start: 23 apples
- Sold 17: 23 - 17 = 6
- Received 31: 6 + 31 = 37
The answer is 37."""

# o1 / R1 style: trained with RL to reason
# The model generates <thinking>...</thinking> tokens
# that are hidden from the user but guide the answer

# RLVR (Reinforcement Learning with Verifiable Rewards):
for problem in math_problems:
    # Sample K reasoning chains
    chains = [model.generate(problem) for _ in range(K)]
    answers = [extract_answer(c) for c in chains]
    
    # Reward: binary correctness (no human labels!)
    rewards = [float(a == ground_truth) for a in answers]
    
    # GRPO: group-relative advantage
    mean_r = mean(rewards)
    advantages = [(r - mean_r) for r in rewards]
    
    # Update policy to favor correct reasoning chains
    grpo_update(model, chains, advantages)
    
# Key insight: the model discovers CoT reasoning ON ITS OWN
# through RL — no human demonstrations of reasoning needed`,
  },
  {
    id: "post-training",
    name: "Modern Post-Training Stack",
    year: "2024–2026",
    who: "DeepSeek, Anthropic, OpenAI, Meta (Tülu 3)",
    tagline: "SFT → Preference Optimization → RLVR → iterated refinement. Post-training is most of the magic.",
    stats: { params: "—", data: "synthetic + human, multi-round", ctx: "—" },
    color: "#3D348B",
    icon: "🔧",
    intuition: `The 2022 recipe (SFT → RLHF with PPO) has been almost completely replaced. Modern post-training is a multi-stage pipeline, each stage targeting different capabilities:\n\n**Stage 1: SFT** — Teach format and instruction following. Increasingly uses synthetic data generated by stronger models (distillation). The key insight from LIMA (2023): you don't need millions of examples; 1000 high-quality demonstrations may suffice for format. Quality >>> quantity.\n\n**Stage 2: Preference Optimization** — DPO (Rafailov 2023) replaced PPO for preference alignment. It's simpler: directly optimize the policy on preference pairs without a separate reward model. Variants: SimPO, KTO (works with just thumbs-up/down, not pairs), IPO. The key advantage: no RL loop, no reward model instability.\n\n**Stage 3: RLVR/GRPO** — For reasoning capabilities, train with verifiable rewards. GRPO (Group Relative Policy Optimization, DeepSeek 2024) samples multiple responses per prompt, scores them by correctness, and uses the group's mean as baseline. No critic model needed. DAPO (2025) adds techniques for training stability with long CoT.\n\n**Multi-round Iteration:** Frontier models do many rounds of this — generate data, train, generate better data, train again. Self-improvement loops. Leading models involve dozens of post-training rounds with escalating difficulty.\n\nPost-training compute is growing fast: DeepSeek-R1 used ~5% of total compute for post-training. Newer models may be approaching 30-50%.`,
    limitation: `The field is moving so fast that best practices change quarterly. Reward hacking remains a problem — models learn to exploit reward signals in unexpected ways. And there's a fundamental tension: RL pushes the model toward rewarded behaviors, but the reward signal is always an imperfect proxy for what we actually want.`,
    diagram: "post-training",
    code: `# DPO: Direct Preference Optimization (replacing PPO)
# No reward model needed!
def dpo_loss(policy, ref, prompt, chosen, rejected, beta):
    log_ratio_chosen = (
        policy.log_prob(chosen | prompt) - 
        ref.log_prob(chosen | prompt)
    )
    log_ratio_rejected = (
        policy.log_prob(rejected | prompt) - 
        ref.log_prob(rejected | prompt)
    )
    return -log(sigmoid(beta * (log_ratio_chosen - log_ratio_rejected)))

# GRPO: Group Relative Policy Optimization
def grpo_step(model, prompt, n_samples=16):
    responses = [model.generate(prompt) for _ in range(n_samples)]
    rewards = [verifier(prompt, r) for r in responses]  # e.g., unit test
    
    # Advantage: how much better than group average?
    mean_r = mean(rewards)
    std_r = std(rewards)
    advantages = [(r - mean_r) / std_r for r in rewards]
    
    # No critic model! No reward model! Just correctness checks.
    for resp, adv in zip(responses, advantages):
        policy_gradient_update(model, resp, adv)

# Full pipeline (2025-2026):
# 1. SFT on synthetic demonstrations
# 2. DPO/SimPO on preference pairs
# 3. GRPO/DAPO with verifiable rewards (math, code)
# 4. Repeat rounds 1-3 with improved data
# 5. Domain-specific RL (tool use, agentic behavior)`,
  },
  {
    id: "tooluse",
    name: "Tool Use & Agentic Capabilities",
    year: "2023–2026",
    who: "Schick et al. (Toolformer); OpenAI (function calling); Anthropic (computer use)",
    tagline: "The model calls functions, browses the web, writes and executes code. LLM as orchestrator.",
    stats: { params: "—", data: "+tool-use demonstrations", ctx: "multi-turn, tool results injected" },
    color: "#6A040F",
    icon: "🛠️",
    intuition: `LLMs are constrained by what's in their weights and context. Tools break this constraint: the model generates structured function calls, receives results, and incorporates them into its reasoning.\n\nThe mechanism is straightforward: fine-tune the model to emit special tokens (or JSON) that represent function calls. The runtime intercepts these, executes the tool, and injects the result back into the context. The model then continues generating.\n\nCategories of tools:\n- **Retrieval:** Web search, document lookup. Grounds the model in current facts.\n- **Code execution:** The model writes Python, runs it, reads the output. Dramatically improves math/data analysis.\n- **APIs:** Calendar, email, databases. The model becomes an agent that acts in the world.\n- **Computer use:** Screen-level interaction. The model can navigate UIs.\n\nAgentic behavior is the frontier: models that plan multi-step tasks, use tools sequentially, handle errors, and maintain state across long interaction loops. This requires training for tool selection, error recovery, and planning — not just single-call function use.\n\nThe training data increasingly comes from RL in tool-use environments: the model is rewarded for successfully completing tasks that require tool chains.`,
    limitation: `Tool use dramatically expands the attack surface — prompt injection through tool results is a major security concern. Agentic loops can compound errors. The model must learn when NOT to use tools. And latency: each tool call adds round-trip time, making multi-step agents slow.`,
    diagram: "tooluse",
    code: `# Tool use is a fine-tuned generation pattern:
# Model generates structured calls, runtime intercepts them

# 1. Define available tools
tools = [{
    "name": "web_search",
    "description": "Search the web",
    "parameters": {
        "query": {"type": "string"}
    }
}]

# 2. Model generates a tool call (special tokens / JSON)
response = model.generate(
    messages=[{"role": "user", "content": "What's AAPL at?"}],
    tools=tools
)
# response.tool_calls = [{"name": "web_search", 
#                          "args": {"query": "AAPL stock price"}}]

# 3. Runtime executes, injects result
result = execute_tool(response.tool_calls[0])
messages.append({"role": "tool", "content": result})

# 4. Model continues with tool result in context
final = model.generate(messages=messages)

# Agentic loop: plan → act → observe → plan → ...
while not task_complete:
    action = model.plan_next_step(state)
    result = environment.execute(action)
    state.update(result)
    # RL trains the model to plan effective action sequences`,
  },
  {
    id: "frontier",
    name: "The Frontier Model (~Opus 4.6 / GPT-5 class)",
    year: "2025–2026",
    who: "Anthropic, OpenAI, Google DeepMind, DeepSeek",
    tagline: "Everything above, composed. Plus the speculative stuff we don't know for sure.",
    stats: { params: "1T+ (MoE, est. 200B+ active)", data: "15T+ tokens", ctx: "128K–1M+" },
    color: "#264653",
    icon: "🏔️",
    intuition: `A frontier model in 2025-2026 is the composition of every idea above, plus engineering that isn't public. Here's what we can reasonably infer:\n\n**Architecture:** Dense or MoE transformer with GQA/MQA, RoPE or learned positional encoding, SwiGLU FFNs, RMSNorm. Likely MoE for the largest models (cost efficiency). Possibly 100+ layers, 8K–16K hidden dim.\n\n**Pre-training:** 15T+ tokens (Chinchilla-optimal or beyond). Mixture of web, books, code, math, science, multilingual. Careful data curation and deduplication. Likely multi-epoch on highest-quality data. Curriculum learning: easier data first, harder data later.\n\n**Post-training:** Many rounds of SFT + DPO/preference optimization + RLVR for reasoning. Separate RL stages for different capabilities (helpfulness, coding, math, safety, tool use). Constitutional AI / RLAIF for scalable alignment. Possibly 20-50+ rounds of iterative refinement.\n\n**Reasoning:** Integrated chain-of-thought / extended thinking. The model dynamically allocates test-time compute — routing between "fast" (direct answer) and "deep" (extended reasoning) modes. Some models unify this in a single architecture (GPT-5's "reasoning routing").\n\n**Multimodality:** Native vision, likely native audio. Early fusion — all modalities processed in the same transformer from the start, not bolted on.\n\n**Serving:** Speculative decoding, KV-cache compression, quantization (INT8/FP8), expert parallelism for MoE. Flash Attention v3+. Possibly custom silicon (TPU, Trainium, Dojo).`,
    limitation: `We're still doing next-token prediction with transformers. Quadratic attention is managed but not solved. The models are expensive to train ($100M+) and serve. We don't fully understand what they've learned or why they fail. Hallucination is reduced but not eliminated. Safety alignment is getting better but is fundamentally an arms race. And the bitter lesson suggests that whatever clever architecture we design, more compute on simpler methods will eventually beat it.`,
    diagram: "frontier",
    code: `# A speculative but informed picture of the full stack:

class FrontierModel:
    """What a ~2026 frontier model probably looks like"""
    
    # Architecture
    arch = "decoder-only transformer (MoE)"
    layers = "100-128"
    d_model = "8192-16384"
    experts = "64-256 experts, top-2 routing"
    active_params = "200B-400B per token"
    total_params = "1T-2T+"
    attention = "GQA with RoPE, Flash Attention v3"
    ffn = "SwiGLU (inside MoE experts)"
    norm = "RMSNorm (pre-norm)"
    
    # Pre-training  
    data = "15T+ tokens (web, code, books, math, science)"
    curriculum = "progressive difficulty, multi-epoch on best data"
    context = "trained at 8K-32K, extended to 128K-1M+"
    modalities = "text + vision + audio (early fusion)"
    
    # Post-training (the secret sauce)
    stages = [
        "SFT on high-quality demonstrations (synthetic + human)",
        "DPO/preference optimization (multiple rounds)",
        "RLVR/GRPO for reasoning (math, code, logic)",
        "Domain-specific RL (tool use, agentic tasks)",
        "Safety RL (constitutional AI, red-teaming)",
        "Iterate 10-50+ rounds with escalating difficulty",
    ]
    
    # Inference
    thinking = "dynamic: fast path OR extended reasoning"
    tools = "web search, code exec, APIs, computer use"
    serving = "speculative decoding, KV compression, FP8"`,
  },
];

// --- Diagrams ---

const D = ({ children, label }) => (
  <svg viewBox="0 0 520 200" className="diagram-svg">
    {children}
    {label && <text x="260" y="195" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">{label}</text>}
    <defs>
      <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/>
      </marker>
    </defs>
  </svg>
);

const Box = ({ x, y, w, h, text, sub, fill, stroke, textSize }: { x?: any, y?: any, w?: any, h?: any, text?: any, sub?: any, fill?: any, stroke?: any, textSize?: any }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={fill || "var(--clr-bg-2)"} stroke={stroke || "var(--clr-border)"} strokeWidth="1.5"/>
    <text x={x + w/2} y={y + (sub ? h/2 - 4 : h/2 + 4)} textAnchor="middle" fill="var(--clr-text)" fontSize={textSize || 11} fontFamily="var(--mono)">{text}</text>
    {sub && <text x={x + w/2} y={y + h/2 + 10} textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">{sub}</text>}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, dashed }: { x1?: any, y1?: any, x2?: any, y2?: any, dashed?: any }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#a)" strokeDasharray={dashed ? "4,3" : undefined}/>
);

const DiagramGPT1 = () => (
  <D label="Same architecture, different recipe: unsupervised pre-train → supervised fine-tune">
    <Box x={20} y={60} w={120} h={50} text="Raw Text" sub="(BookCorpus)"/>
    <Arrow x1={140} y1={85} x2={175} y2={85}/>
    <Box x={175} y={50} w={130} h={70} text="Transformer LM" sub="12 layers, 768d" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <Arrow x1={305} y1={85} x2={340} y2={60}/>
    <Arrow x1={305} y1={85} x2={340} y2={110}/>
    <Box x={340} y={40} w={150} h={35} text="Fine-tune: NLI" sub="" fill="#2D6A4F22" stroke="#2D6A4F"/>
    <Box x={340} y={90} w={150} h={35} text="Fine-tune: Sentiment" sub="" fill="#9B222622" stroke="#9B2226"/>
    <text x="415" y="150" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">One model → many tasks</text>
  </D>
);

const DiagramScaling = () => (
  <D label="Power law: 10× compute → predictable improvement. In-context learning emerges at scale.">
    {[{x:30,h:25,l:"GPT-1 (117M)"},{x:100,h:45,l:"GPT-2 (1.5B)"},{x:190,h:90,l:"GPT-3 (175B)"},{x:310,h:140,l:"GPT-4? (~1.8T)"}].map((b,i) => (
      <g key={i}>
        <rect x={b.x} y={170 - b.h} width={65} height={b.h} rx={4} fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
        <text x={b.x + 32} y={175 - b.h - 6} textAnchor="middle" fill="var(--clr-text)" fontSize="8" fontFamily="var(--mono)">{b.l}</text>
      </g>
    ))}
    <text x="400" y="60" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">L ∝ N^(-0.076)</text>
    <text x="400" y="75" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">L ∝ D^(-0.095)</text>
    <text x="400" y="90" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">L ∝ C^(-0.050)</text>
    <text x="400" y="115" fill="var(--clr-accent)" fontSize="11" fontFamily="var(--mono)" fontWeight="600">Scaling laws</text>
    <text x="260" y="10" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)" fontWeight="500">Parameter count (log scale, conceptual)</text>
  </D>
);

const DiagramRLHF = () => (
  <svg viewBox="0 0 520 220" className="diagram-svg">
    <Box x={10} y={20} w={110} h={40} text="1. SFT" sub="" fill="#2D6A4F22" stroke="#2D6A4F"/>
    <text x="65" y="80" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">human demos</text>
    <Arrow x1={120} y1={40} x2={155} y2={40}/>
    <Box x={155} y={20} w={130} h={40} text="2. Reward Model" sub="" fill="#E76F5122" stroke="#E76F51"/>
    <text x="220" y="80" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">human preferences</text>
    <Arrow x1={285} y1={40} x2={320} y2={40}/>
    <Box x={320} y={20} w={120} h={40} text="3. PPO / RL" sub="" fill="#9B222622" stroke="#9B2226"/>
    <text x="380" y="80" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">optimize policy</text>
    <Arrow x1={380} y1={60} x2={380} y2={110}/>
    <Box x={300} y={110} w={160} h={40} text="Aligned Model" sub="ChatGPT / Claude" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <text x="260" y="190" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Post-training: turning a text predictor into a helpful assistant</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramMoE = () => (
  <svg viewBox="0 0 520 220" className="diagram-svg">
    <Box x={20} y={90} w={80} h={40} text="Token x" sub=""/>
    <Arrow x1={100} y1={110} x2={140} y2={110}/>
    <Box x={140} y={85} w={90} h={50} text="Router" sub="softmax → top-k" fill="#E76F5122" stroke="#E76F51"/>
    {[0,1,2,3].map(i => (
      <g key={i}>
        <Arrow x1={230} y1={110} x2={280} y2={30 + i*52} dashed={i > 1}/>
        <rect x={280} y={15 + i*52} width={95} height={34} rx={5}
          fill={i < 2 ? "var(--clr-accent-bg)" : "var(--clr-bg-2)"}
          stroke={i < 2 ? "var(--clr-accent)" : "var(--clr-border)"}
          strokeWidth="1.5" opacity={i < 2 ? 1 : 0.35}/>
        <text x={327} y={36 + i*52} textAnchor="middle"
          fill={i < 2 ? "var(--clr-text)" : "var(--clr-muted)"}
          fontSize="10" fontFamily="var(--mono)" opacity={i < 2 ? 1 : 0.35}>
          Expert {i+1} {i < 2 ? "✓" : ""}
        </text>
      </g>
    ))}
    <Arrow x1={375} y1={32} x2={420} y2={90}/>
    <Arrow x1={375} y1={84} x2={420} y2={100}/>
    <Box x={420} y={75} w={80} h={50} text="Σ weighted" sub="outputs" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <text x="260" y="210" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Only top-k experts activated per token (k=2 shown). Rest are idle.</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramContext = () => (
  <svg viewBox="0 0 520 200" className="diagram-svg">
    <text x="260" y="20" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)" fontWeight="500">Flash Attention: Tiled Computation</text>
    <rect x="40" y="40" width="180" height="120" rx="4" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
    <text x="130" y="58" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">Standard: full T×T in HBM</text>
    {Array.from({length:16}).map((_,i) => (
      <rect key={i} x={50 + (i%4)*40} y={65 + Math.floor(i/4)*25} width={35} height={20} rx={2}
        fill="#9B222633" stroke="#9B2226" strokeWidth="0.5"/>
    ))}
    <text x="130" y="175" textAnchor="middle" fill="#9B2226" fontSize="10" fontFamily="var(--mono)" fontWeight="500">O(T²) memory</text>
    
    <rect x="280" y="40" width="200" height="120" rx="4" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
    <text x="380" y="58" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">Flash: tile-by-tile in SRAM</text>
    {[0,1,2,3].map(i => (
      <rect key={i} x={290 + i*45} y={65 + i*25} width={35} height={20} rx={2}
        fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    ))}
    <text x="380" y="175" textAnchor="middle" fill="var(--clr-accent)" fontSize="10" fontFamily="var(--mono)" fontWeight="500">O(T) memory — exact same result</text>
    
    <text x="260" y="195" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">IO-aware tiling: never materialize full attention matrix</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramMultimodal = () => (
  <svg viewBox="0 0 520 220" className="diagram-svg">
    <Box x={20} y={130} w={80} h={40} text="Image" fill="#457B9D22" stroke="#457B9D"/>
    <Arrow x1={100} y1={150} x2={130} y2={150}/>
    <Box x={130} y={125} w={80} h={50} text="ViT" sub="(encoder)" fill="#457B9D22" stroke="#457B9D"/>
    <Arrow x1={210} y1={150} x2={240} y2={150}/>
    <Box x={240} y={130} w={70} h={40} text="Project" sub="" fill="#457B9D22" stroke="#457B9D"/>
    
    <Box x={20} y={50} w={80} h={40} text="Text" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <Arrow x1={100} y1={70} x2={240} y2={70}/>
    <Box x={240} y={50} w={70} h={40} text="Embed" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    
    <Arrow x1={310} y1={70} x2={350} y2={100}/>
    <Arrow x1={310} y1={150} x2={350} y2={120}/>
    <text x="340" y="110" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">⊕</text>
    
    <Arrow x1={355} y1={110} x2={380} y2={110}/>
    <Box x={380} y={80} w={120} h={60} text="Transformer" sub="(same model)" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <text x="260" y="210" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Image patches become tokens. Self-attention handles cross-modal reasoning.</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramCoT = () => (
  <svg viewBox="0 0 520 210" className="diagram-svg">
    <Box x={20} y={20} w={100} h={40} text="Hard Problem"/>
    <Arrow x1={120} y1={40} x2={155} y2={40}/>
    <rect x={155} y={10} width={200} height={100} rx={8} fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="255" y="35" textAnchor="middle" fill="var(--clr-accent)" fontSize="10" fontFamily="var(--mono)" fontWeight="600">⟨thinking⟩</text>
    <text x="255" y="55" textAnchor="middle" fill="var(--clr-text)" fontSize="9" fontFamily="var(--mono)">Step 1: break down...</text>
    <text x="255" y="70" textAnchor="middle" fill="var(--clr-text)" fontSize="9" fontFamily="var(--mono)">Step 2: wait, let me check...</text>
    <text x="255" y="85" textAnchor="middle" fill="var(--clr-text)" fontSize="9" fontFamily="var(--mono)">Step 3: therefore...</text>
    <text x="255" y="100" textAnchor="middle" fill="var(--clr-accent)" fontSize="10" fontFamily="var(--mono)" fontWeight="600">⟨/thinking⟩</text>
    <Arrow x1={355} y1={60} x2={395} y2={60}/>
    <Box x={395} y={35} w={100} h={50} text="Answer" sub="(confident)" fill="#2D6A4F22" stroke="#2D6A4F"/>
    <text x="255" y="140" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">More thinking tokens = more serial compute</text>
    <text x="255" y="160" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">Trained via RLVR: reward correct answers,</text>
    <text x="255" y="175" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">model discovers reasoning strategy on its own</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramPostTraining = () => (
  <svg viewBox="0 0 520 220" className="diagram-svg">
    {[
      { y: 10, text: "Pre-trained Base Model", fill: "var(--clr-bg-2)", stroke: "var(--clr-border)" },
      { y: 50, text: "SFT (format, instruction following)", fill: "#2D6A4F22", stroke: "#2D6A4F" },
      { y: 90, text: "DPO / Preference Optimization", fill: "#E76F5122", stroke: "#E76F51" },
      { y: 130, text: "RLVR / GRPO (reasoning, code, math)", fill: "#9B222622", stroke: "#9B2226" },
      { y: 170, text: "Safety RL + Iterated Refinement", fill: "#3D348B22", stroke: "#3D348B" },
    ].map((s, i) => (
      <g key={i}>
        <rect x={80} y={s.y} width={310} height={32} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth="1.5"/>
        <text x={235} y={s.y + 20} textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">{s.text}</text>
        {i < 4 && <Arrow x1={235} y1={s.y + 32} x2={235} y2={s.y + 40}/>}
      </g>
    ))}
    <path d="M 410 175 Q 460 175 460 95 Q 460 15 410 15" fill="none" stroke="var(--clr-accent)" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#a)"/>
    <text x="480" y="95" textAnchor="middle" fill="var(--clr-accent)" fontSize="9" fontFamily="var(--mono)" fontWeight="500">iterate</text>
    <text x="480" y="108" textAnchor="middle" fill="var(--clr-accent)" fontSize="9" fontFamily="var(--mono)" fontWeight="500">10-50×</text>
    <text x="235" y="215" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Post-training is now the majority of a model's usable capability</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramToolUse = () => (
  <svg viewBox="0 0 520 200" className="diagram-svg">
    <Box x={20} y={70} w={80} h={40} text="User" sub=""/>
    <Arrow x1={100} y1={90} x2={140} y2={90}/>
    <Box x={140} y={55} w={110} h={70} text="LLM" sub="(orchestrator)" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)"/>
    <Arrow x1={250} y1={70} x2={310} y2={25}/>
    <Arrow x1={250} y1={90} x2={310} y2={80}/>
    <Arrow x1={250} y1={110} x2={310} y2={135}/>
    <Box x={310} y={8} w={100} h={34} text="Web Search" fill="#457B9D22" stroke="#457B9D"/>
    <Box x={310} y={63} w={100} h={34} text="Code Exec" fill="#2D6A4F22" stroke="#2D6A4F"/>
    <Box x={310} y={118} w={100} h={34} text="APIs" fill="#9B222622" stroke="#9B2226"/>
    <Arrow x1={410} y1={25} x2={440} y2={70} dashed/>
    <Arrow x1={410} y1={80} x2={440} y2={85} dashed/>
    <Arrow x1={410} y1={135} x2={440} y2={100} dashed/>
    <Box x={440} y={65} w={60} h={40} text="Result" sub="" fill="var(--clr-bg-2)"/>
    <text x="260" y="185" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Generate → call tool → inject result → continue generating</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramFrontier = () => (
  <svg viewBox="0 0 520 240" className="diagram-svg">
    <text x="260" y="18" textAnchor="middle" fill="var(--clr-text)" fontSize="12" fontFamily="var(--mono)" fontWeight="600">The Full Stack (~2026)</text>
    {[
      { y: 195, text: "Data: 15T+ tokens (web, code, math, images, audio)", fill: "var(--clr-bg-2)" },
      { y: 165, text: "Pre-training: MoE Transformer, GQA, RoPE, SwiGLU", fill: "#457B9D22" },
      { y: 135, text: "Long Context: Flash Attn v3, RoPE scaling, 128K+", fill: "#E76F5122" },
      { y: 105, text: "Post-training: SFT → DPO → RLVR → iterate (20+ rounds)", fill: "#2D6A4F22" },
      { y: 75, text: "Reasoning: extended thinking, dynamic compute allocation", fill: "#9B222622" },
      { y: 45, text: "Multimodal: native vision + audio (early fusion)", fill: "#6B4C8A22" },
      { y: 28, text: "Tools & Agency: search, code, APIs, computer use", fill: "#3D348B22" },
    ].map((s, i) => (
      <g key={i}>
        <rect x={30} y={s.y} width={460} height={22} rx={4} fill={s.fill} stroke="var(--clr-border)" strokeWidth="0.5"/>
        <text x={260} y={s.y + 15} textAnchor="middle" fill="var(--clr-text)" fontSize="9" fontFamily="var(--mono)">{s.text}</text>
      </g>
    ))}
    <text x="260" y="235" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Every layer is load-bearing. Remove any one and capability drops sharply.</text>
    <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DIAGRAMS = {
  "gpt1": DiagramGPT1, "scaling": DiagramScaling, "rlhf": DiagramRLHF,
  "moe": DiagramMoE, "context": DiagramContext, "multimodal": DiagramMultimodal,
  "cot": DiagramCoT, "post-training": DiagramPostTraining, "tooluse": DiagramToolUse,
  "frontier": DiagramFrontier,
};

const TAB_LABELS = { intuition: "Intuition", code: "Code", diagram: "Diagram" };

export default function FrontierExplorer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [tab, setTab] = useState("intuition");
  const contentRef = useRef(null);
  const model = MODELS[selectedIdx];
  const DiagramComp = DIAGRAMS[model.diagram];

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedIdx, tab]);

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', monospace",
      background: "var(--clr-bg)",
      color: "var(--clr-text)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        :root {
            --clr-bg: #f5f3ef;
            --clr-bg-2: #eae7e1;
            --clr-bg-3: #ddd9d1;
            --clr-text: #1a1a1e;
            --clr-muted: #6b6b75;
            --clr-border: #c8c4bc;
            --clr-accent: #2D5F6B;
            --clr-accent-bg: #2D5F6B15;
          }
        .dark {
          --clr-bg: #0a0a0c;
          --clr-bg-2: #141418;
          --clr-bg-3: #1c1c22;
          --clr-text: #e8e6e3;
          --clr-muted: #7a7a85;
          --clr-border: #2a2a33;
          --clr-accent: #7B9EA8;
          --clr-accent-bg: #7B9EA815;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        .sidebar-item { padding: 10px 16px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s ease; display: flex; align-items: flex-start; gap: 10px; }
        .sidebar-item:hover { background: var(--clr-bg-2); }
        .sidebar-item.active { background: var(--clr-bg-2); border-left-color: var(--clr-accent); }
        .sidebar-item .step-num { font-size: 10px; color: var(--clr-muted); font-family: 'IBM Plex Mono', monospace; min-width: 20px; padding-top: 2px; }
        .sidebar-item.active .step-num { color: var(--clr-accent); }
        .sidebar-item .step-name { font-size: 13px; font-family: 'IBM Plex Sans', sans-serif; font-weight: 400; color: var(--clr-muted); line-height: 1.3; }
        .sidebar-item.active .step-name { color: var(--clr-text); font-weight: 500; }
        .tab-btn { padding: 6px 16px; background: none; border: 1px solid var(--clr-border); color: var(--clr-muted); font-family: 'IBM Plex Mono', monospace; font-size: 11px; cursor: pointer; transition: all 0.15s ease; letter-spacing: 0.5px; text-transform: uppercase; }
        .tab-btn:first-child { border-radius: 4px 0 0 4px; }
        .tab-btn:last-child { border-radius: 0 4px 4px 0; }
        .tab-btn:not(:first-child) { border-left: none; }
        .tab-btn.active { background: var(--clr-accent); border-color: var(--clr-accent); color: #0a0a0c; font-weight: 500; }
        .tab-btn:hover:not(.active) { background: var(--clr-bg-2); color: var(--clr-text); }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 20px; }
        .meta-cell { padding: 10px 12px; background: var(--clr-bg-2); border-radius: 6px; border: 1px solid var(--clr-border); }
        .meta-cell .label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--clr-muted); margin-bottom: 4px; font-family: 'IBM Plex Mono', monospace; }
        .meta-cell .value { font-size: 13px; color: var(--clr-text); font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
        .content-text { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; line-height: 1.7; color: var(--clr-text); white-space: pre-wrap; }
        .content-text p { margin-bottom: 14px; }
        .code-block { background: var(--clr-bg-2); border: 1px solid var(--clr-border); border-radius: 6px; padding: 16px; overflow-x: auto; font-size: 12px; line-height: 1.6; font-family: 'IBM Plex Mono', monospace; color: var(--clr-text); white-space: pre; tab-size: 4; }
        .diagram-svg { width: 100%; max-width: 520px; margin: 0 auto; display: block; }
        .nav-arrow { background: none; border: 1px solid var(--clr-border); color: var(--clr-muted); padding: 6px 14px; border-radius: 4px; cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-size: 12px; transition: all 0.15s ease; }
        .nav-arrow:hover:not(:disabled) { background: var(--clr-bg-2); color: var(--clr-text); border-color: var(--clr-accent); }
        .nav-arrow:disabled { opacity: 0.3; cursor: default; }
        .limitation-box { background: #9B222610; border: 1px solid #9B222640; border-radius: 6px; padding: 14px 16px; margin-top: 16px; }
        .limitation-box .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #9B2226; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
      `}</style>

      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--clr-border)", display: "flex", alignItems: "baseline", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, color: "var(--clr-text)", letterSpacing: "-0.5px" }}>
          From GPT to the Frontier
        </span>
        <span style={{ fontSize: 11, color: "var(--clr-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
          How we got to Opus 4.6 / GPT-5 class models
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: 270, minWidth: 270, borderRight: "1px solid var(--clr-border)", overflowY: "auto", flexShrink: 0, paddingTop: 8, paddingBottom: 16 }}>
          {MODELS.map((m, i) => (
            <div key={m.id} className={`sidebar-item ${i === selectedIdx ? "active" : ""}`}
              onClick={() => { setSelectedIdx(i); setTab("intuition"); }}>
              <span className="step-num">{String(i).padStart(2, "0")}</span>
              <div>
                <div className="step-name">{m.name}</div>
                <div style={{ fontSize: 10, color: "var(--clr-muted)", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{m.year}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>{model.icon}</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--clr-text)", letterSpacing: "-0.5px" }}>{model.name}</span>
              <span style={{ fontSize: 11, color: model.color, fontFamily: "'IBM Plex Mono', monospace", border: `1px solid ${model.color}40`, padding: "2px 8px", borderRadius: 3 }}>{model.year}</span>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "var(--clr-muted)", marginBottom: 16, fontStyle: "italic" }}>{model.tagline}</div>
            <div style={{ fontSize: 11, color: "var(--clr-muted)", marginBottom: 14 }}>{model.who}</div>

            <div className="meta-grid">
              {Object.entries(model.stats).map(([key, val]) => (
                <div className="meta-cell" key={key}>
                  <div className="label">{key}</div>
                  <div className="value">{val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", marginBottom: 16 }}>
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <button key={key} className={`tab-btn ${tab === key ? "active" : ""}`}
                  onClick={() => setTab(key)}>{label}</button>
              ))}
            </div>
          </div>

          <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 28px 24px" }}>
            {tab === "intuition" && (
              <div>
                <div className="content-text">
                  {model.intuition.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="limitation-box">
                  <div className="lbl">Limitations & open questions →</div>
                  <div className="content-text" style={{ fontSize: 13 }}>
                    {model.limitation.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            )}
            {tab === "code" && <div className="code-block">{model.code}</div>}
            {tab === "diagram" && DiagramComp && <div style={{ padding: "20px 0" }}><DiagramComp /></div>}
          </div>

          <div style={{ padding: "12px 28px", borderTop: "1px solid var(--clr-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <button className="nav-arrow" disabled={selectedIdx === 0}
              onClick={() => { setSelectedIdx(i => i - 1); setTab("intuition"); }}>← prev</button>
            <span style={{ fontSize: 10, color: "var(--clr-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {selectedIdx + 1} / {MODELS.length}
            </span>
            <button className="nav-arrow" disabled={selectedIdx === MODELS.length - 1}
              onClick={() => { setSelectedIdx(i => i + 1); setTab("intuition"); }}>next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
