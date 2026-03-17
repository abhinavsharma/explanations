import { ArtifactStatus } from '@/components/artifact-wrapper';
import { useState, useRef, useEffect } from "react";

export const artifactStatus = ArtifactStatus.PUBLISHED;
export const publishDate = "2026-03-16";

/*
  Each row is a component of the stack.
  Each cell has a "state" for that time period:
    0 = didn't exist yet / not relevant
    1 = stable / unchanged (bedrock)
    2 = minor iteration / refinement
    3 = significant change / new approach
    4 = paradigm shift / revolutionary change
  Plus a short note for the tooltip.
*/

const PERIODS = [
  { id: "late2022", label: "Late 2022", sub: "ChatGPT launch" },
  { id: "h12023", label: "H1 2023", sub: "GPT-4, Claude 1" },
  { id: "h22023", label: "H2 2023", sub: "Mixtral, Llama 2" },
  { id: "h12024", label: "H1 2024", sub: "Claude 3, GPT-4o" },
  { id: "h22024", label: "H2 2024", sub: "o1, Llama 3.1" },
  { id: "h12025", label: "H1 2025", sub: "R1, DeepSeek V3" },
  { id: "h22025", label: "H2 2025", sub: "GPT-5, Claude 4" },
  { id: "early2026", label: "Early 2026", sub: "Opus 4.6 era" },
];

const CATEGORIES = [
  { name: "Architecture", color: "#7B9EA8" },
  { name: "Pre-training", color: "#E76F51" },
  { name: "Post-training", color: "#2D6A4F" },
  { name: "Reasoning", color: "#9B2226" },
  { name: "Multimodal", color: "#6B4C8A" },
  { name: "Serving & Infra", color: "#8B6914" },
];

const ROWS = [
  // Architecture
  {
    category: 0, label: "Core arch (decoder-only transformer)",
    cells: [
      { s: 1, n: "GPT-3.5: standard dense decoder-only. Unchanged since GPT-2 (2019)." },
      { s: 1, n: "GPT-4: still decoder-only. Transformer block structure identical." },
      { s: 1, n: "Llama 2, Mistral: same arch. Minor tweaks (GQA, SwiGLU) but same skeleton." },
      { s: 1, n: "Claude 3, GPT-4o: still decoder-only transformers at the core." },
      { s: 1, n: "Llama 3.1, o1: same arch. Mamba/SSM explored but not adopted by frontier." },
      { s: 1, n: "DeepSeek V3: still transformer. Mamba hybrids tried, pure transformer wins." },
      { s: 1, n: "GPT-5: still transformer-based. Architecture is the most stable part of the stack." },
      { s: 1, n: "3+ years of stability. The decoder-only transformer is the bedrock." },
    ],
  },
  {
    category: 0, label: "MoE vs. Dense",
    cells: [
      { s: 1, n: "GPT-3.5: dense model. All params active for every token." },
      { s: 4, n: "GPT-4: rumored MoE (16×111B). Paradigm shift from dense to sparse." },
      { s: 3, n: "Mixtral 8×7B open-sources MoE. Validates the approach." },
      { s: 2, n: "Both coexist. Claude 3 likely dense; GPT-4o refines MoE." },
      { s: 2, n: "DeepSeek V2 introduces fine-grained MoE (160 experts). Llama 3 stays dense." },
      { s: 3, n: "DeepSeek V3: 256 experts, auxiliary-loss-free routing. MoE matures." },
      { s: 2, n: "GPT-5 likely MoE. Open models split: Qwen3 MoE, others dense." },
      { s: 1, n: "MoE is default for frontier scale. Dense for smaller models. Settled." },
    ],
  },
  {
    category: 0, label: "Attention mechanism",
    cells: [
      { s: 1, n: "MHA (multi-head attention). Standard since 2017." },
      { s: 2, n: "GQA (grouped-query attention) emerging. Fewer KV heads for efficiency." },
      { s: 3, n: "GQA becomes standard in Llama 2, Mistral. MQA in some models." },
      { s: 2, n: "GQA is now default. Ratio varies (8:1, 4:1). Flash Attention v2 standard." },
      { s: 2, n: "Minor iteration. Some explore MLA (multi-latent attention, DeepSeek V2)." },
      { s: 3, n: "MLA validated at scale. Sparse/sliding window attention explored." },
      { s: 2, n: "GQA/MLA settled. Flash Attention v3. Hardware-aware optimization." },
      { s: 1, n: "Mechanism stable. Innovation now in kernels and hardware, not the math." },
    ],
  },
  {
    category: 0, label: "Positional encoding",
    cells: [
      { s: 1, n: "Learned absolute positions. Max ~4K tokens." },
      { s: 2, n: "RoPE adopted by most models. Better relative position encoding." },
      { s: 3, n: "YaRN, NTK-scaling for context extension. ALiBi explored. Active area." },
      { s: 2, n: "RoPE + scaling is standard. Long-context models to 200K." },
      { s: 2, n: "Refinements to RoPE scaling. Longer context windows (128K standard)." },
      { s: 1, n: "RoPE is settled. Scaling methods well-understood." },
      { s: 1, n: "Stable. Incremental improvements only." },
      { s: 1, n: "RoPE + extensions is bedrock. No paradigm change expected." },
    ],
  },
  {
    category: 0, label: "Tokenizer",
    cells: [
      { s: 1, n: "BPE with ~50K vocab (GPT-2 tokenizer). Unchanged." },
      { s: 2, n: "GPT-4: 100K vocab. Llama uses SentencePiece." },
      { s: 2, n: "Larger vocabs (32K–128K). Better multilingual coverage." },
      { s: 2, n: "128K–256K vocab common. Tiktoken, SentencePiece." },
      { s: 1, n: "Stable. Vocab size settled at 128K–256K for most models." },
      { s: 1, n: "Stable. No fundamental changes to BPE approach." },
      { s: 1, n: "Stable. Minor tweaks for multimodal token integration." },
      { s: 1, n: "BPE tokenization is bedrock. Replaced only by new paradigms (byte-level)." },
    ],
  },
  // Pre-training
  {
    category: 1, label: "Pre-training data scale",
    cells: [
      { s: 1, n: "~1-2T tokens (GPT-3.5 era). Web scrape + books + code." },
      { s: 3, n: "GPT-4: ~13T tokens. 6× increase. Chinchilla-optimal thinking." },
      { s: 2, n: "Llama 2: 2T tokens (over-trained). Data quality > quantity emerging." },
      { s: 3, n: "Llama 3: 15T tokens. 7.5× Llama 2. Data mix matters more than raw scale." },
      { s: 2, n: "More data, but focus shifting to curation, dedup, filtering." },
      { s: 2, n: "Approaching data wall for web text. Multi-epoch on best data." },
      { s: 2, n: "15T+ tokens. Synthetic data entering pre-training mix." },
      { s: 2, n: "Incremental. Real innovation in data quality, not quantity." },
    ],
  },
  {
    category: 1, label: "Data curation & quality",
    cells: [
      { s: 1, n: "Basic dedup and filtering. Common Crawl + heuristics." },
      { s: 2, n: "More sophisticated filtering. Domain-weighted mixes." },
      { s: 2, n: "Quality classifiers to score web pages. Upweight 'textbook-like' data (Phi)." },
      { s: 3, n: "Data curation is now critical differentiator. Model-based filtering at scale." },
      { s: 3, n: "Synthetic data in pre-training. Curriculum learning. Domain-specific stages." },
      { s: 3, n: "FineWeb, DCLM datasets. Data quality is the moat, not architecture." },
      { s: 2, n: "Mature curation pipelines. Synthetic+real blends." },
      { s: 2, n: "Continuous refinement. Data is the competitive advantage." },
    ],
  },
  {
    category: 1, label: "Pre-train objective",
    cells: [
      { s: 1, n: "Next-token prediction (autoregressive LM). Since GPT-1." },
      { s: 1, n: "Same. NTP. No change." },
      { s: 1, n: "Same. NTP. Absolutely stable." },
      { s: 1, n: "Same. NTP. Fill-in-middle added as auxiliary objective by some." },
      { s: 1, n: "Same. NTP is the pre-training objective. Period." },
      { s: 1, n: "Same. Despite all other changes, NTP has not budged." },
      { s: 1, n: "Same. The single most stable component of the entire stack." },
      { s: 1, n: "NTP since 2018. Untouched through every revolution. Bedrock." },
    ],
  },
  {
    category: 1, label: "Pre-training compute share",
    cells: [
      { s: 1, n: "~98% of total compute. Post-training is a thin layer." },
      { s: 1, n: "Still ~95%+. RLHF is cheap relative to pre-training." },
      { s: 1, n: "Still ~95%+. Post-training costs growing but still small." },
      { s: 2, n: "~90%. Post-training budgets growing significantly." },
      { s: 3, n: "~80-85%. o1 signals shift: RL compute growing fast." },
      { s: 3, n: "~70%. RLVR runs getting much longer (R1). Compute rebalancing." },
      { s: 3, n: "~50-70%? Post-training may now be 30-50% of total compute." },
      { s: 3, n: "Major shift. Compute split between pre-train and post-train is converging." },
    ],
  },
  // Post-training
  {
    category: 2, label: "SFT (supervised fine-tuning)",
    cells: [
      { s: 3, n: "InstructGPT SFT on human demonstrations. Foundational." },
      { s: 2, n: "Scaling SFT data. More tasks, better coverage." },
      { s: 2, n: "LIMA shows 1000 examples can suffice. Quality > quantity." },
      { s: 2, n: "Synthetic SFT data from stronger models (distillation). Now standard." },
      { s: 2, n: "Synthetic SFT is default. Human demos for hardest tasks only." },
      { s: 1, n: "Mature. SFT is a solved-ish stage. Format teaching, not capability." },
      { s: 1, n: "Stable. SFT teaches format; RL teaches capability." },
      { s: 1, n: "SFT is necessary but not where innovation happens anymore." },
    ],
  },
  {
    category: 2, label: "Preference optimization algorithm",
    cells: [
      { s: 3, n: "RLHF with PPO. InstructGPT recipe. Separate reward model required." },
      { s: 2, n: "PPO still dominant but known to be unstable. Heavy hyperparameter tuning." },
      { s: 4, n: "DPO published (Rafailov 2023). No reward model needed. Paradigm shift." },
      { s: 3, n: "DPO becomes default for most labs. SimPO, KTO variants emerge." },
      { s: 2, n: "Online DPO variants. Some labs return to reward models + PPO for best quality." },
      { s: 2, n: "DPO/SimPO for alignment. PPO/GRPO for reasoning. Modular stack." },
      { s: 2, n: "Mature. Different algorithms for different objectives. No single winner." },
      { s: 1, n: "Preference optimization: DPO-family is standard. Stable." },
    ],
  },
  {
    category: 2, label: "RLVR / reasoning RL",
    cells: [
      { s: 0, n: "Didn't exist. RL was only for preference alignment." },
      { s: 0, n: "Didn't exist. No public reasoning-specific RL." },
      { s: 0, n: "Didn't exist publicly. OpenAI may have been developing o1 internally." },
      { s: 0, n: "Still not public. Rumors of OpenAI's reasoning model approach." },
      { s: 4, n: "o1 launches. RLVR revealed. RL with verifiable rewards for reasoning. Paradigm shift." },
      { s: 4, n: "DeepSeek R1 open-sources RLVR. GRPO algorithm. Entire field pivots." },
      { s: 3, n: "DAPO, RISE, process reward models. RLVR compute scaling rapidly." },
      { s: 3, n: "RLVR is now a major compute consumer. Still evolving rapidly." },
    ],
  },
  {
    category: 2, label: "Post-training iteration depth",
    cells: [
      { s: 1, n: "1 round: SFT → RLHF. Linear pipeline." },
      { s: 2, n: "2-3 rounds. Some iteration on data quality." },
      { s: 2, n: "~5 rounds. More stages, more data." },
      { s: 3, n: "10+ rounds. Iterative self-improvement loops. Data flywheel." },
      { s: 3, n: "20+ rounds. Multi-stage: SFT → DPO → RLVR → repeat. Complex pipelines." },
      { s: 3, n: "Many rounds. Specialized RL for different capabilities." },
      { s: 2, n: "30-50+ rounds. Mature but still growing. Major cost center." },
      { s: 2, n: "Iteration depth is a competitive moat. Stabilizing but deep." },
    ],
  },
  // Reasoning
  {
    category: 3, label: "Chain-of-thought / extended thinking",
    cells: [
      { s: 0, n: "Not present. Models answer directly. No structured reasoning." },
      { s: 2, n: "CoT prompting known (Wei 2022) but not trained into models." },
      { s: 2, n: "Some CoT in SFT data. Not a first-class capability." },
      { s: 2, n: "More CoT training data. Models better at step-by-step when prompted." },
      { s: 4, n: "o1: trained to produce hidden thinking traces. Extended thinking is born." },
      { s: 4, n: "R1, QwQ: open models with extended thinking. Standard for hard tasks." },
      { s: 3, n: "Integrated: models route between fast/deep modes. Claude 'extended thinking'." },
      { s: 2, n: "Extended thinking is standard. Innovation in efficiency and faithfulness." },
    ],
  },
  {
    category: 3, label: "Test-time compute scaling",
    cells: [
      { s: 0, n: "Not a concept. Fixed compute per token." },
      { s: 0, n: "Not a concept. All compute at train time." },
      { s: 0, n: "Academic papers explore the idea. Not deployed." },
      { s: 1, n: "Self-consistency, majority voting explored. Early test-time compute." },
      { s: 4, n: "o1: first production model that trades inference compute for quality." },
      { s: 3, n: "Scaling law for test-time compute established. More thinking = better." },
      { s: 2, n: "Adaptive compute budgets. Model decides how much to think." },
      { s: 2, n: "Test-time compute is a standard lever. Maturing." },
    ],
  },
  // Multimodal
  {
    category: 4, label: "Vision (image understanding)",
    cells: [
      { s: 0, n: "Text-only. No vision capability." },
      { s: 4, n: "GPT-4V: first frontier model with vision. ViT encoder + projection." },
      { s: 2, n: "LLaVA open-sources the recipe. ViT → MLP → LLM." },
      { s: 3, n: "Claude 3, Gemini: high-quality vision. GPT-4o: native multimodal fusion." },
      { s: 2, n: "Vision is standard in frontier models. Resolution, detail improving." },
      { s: 2, n: "Refinements: better spatial reasoning, document understanding." },
      { s: 2, n: "Vision is table stakes. Every frontier model has it." },
      { s: 1, n: "Stable capability. Innovation in efficiency and quality, not architecture." },
    ],
  },
  {
    category: 4, label: "Audio / voice",
    cells: [
      { s: 0, n: "Separate ASR (Whisper) + TTS pipeline. Not native." },
      { s: 0, n: "Same pipeline approach. Audio not in the transformer." },
      { s: 1, n: "Whisper + GPT + TTS. Three separate models chained." },
      { s: 4, n: "GPT-4o: native audio in the transformer. End-to-end voice. Paradigm shift." },
      { s: 2, n: "Advanced Voice Mode ships. Real-time conversation." },
      { s: 2, n: "More models add native audio. Quality improving." },
      { s: 3, n: "GPT-5: unified text/vision/audio. Native multimodal is default." },
      { s: 2, n: "Native audio is standard for frontier. Maturing." },
    ],
  },
  {
    category: 4, label: "Image generation",
    cells: [
      { s: 0, n: "DALL-E 2 separate. Not integrated with LLM." },
      { s: 1, n: "DALL-E 3 via tool use. LLM writes prompt, separate model generates." },
      { s: 1, n: "Same tool-use approach. Two models chained." },
      { s: 2, n: "Gemini explores native image generation. Mostly still separate." },
      { s: 2, n: "Some native generation (Gemini). Others still use tool approach." },
      { s: 3, n: "GPT Image 1 (from 4o architecture). Native generation in LLM." },
      { s: 3, n: "Trend toward unified generation. Autoregressive image tokens." },
      { s: 2, n: "Moving toward native. Still early compared to text capability." },
    ],
  },
  // Serving & Infra
  {
    category: 5, label: "Context window",
    cells: [
      { s: 1, n: "4K tokens (GPT-3.5). Hard limit." },
      { s: 3, n: "8K–32K (GPT-4). Flash Attention enables longer contexts." },
      { s: 3, n: "100K (Claude 2.1). YaRN, NTK-scaling for RoPE extension." },
      { s: 3, n: "128K–200K becoming standard. Long-doc training." },
      { s: 2, n: "128K standard. 1M explored (Gemini). Ring attention for distribution." },
      { s: 1, n: "128K is standard. 1M+ for specialized use." },
      { s: 1, n: "Stable at 128K-200K. Marginal returns beyond this for most tasks." },
      { s: 1, n: "Context window size has largely plateaued. Engineering problem solved." },
    ],
  },
  {
    category: 5, label: "KV-cache & inference efficiency",
    cells: [
      { s: 1, n: "Basic KV-cache. No special optimization." },
      { s: 2, n: "GQA reduces KV-cache size. Important for serving." },
      { s: 2, n: "GQA standard. Quantized KV-cache explored." },
      { s: 3, n: "KV-cache compression, PagedAttention (vLLM). Major serving wins." },
      { s: 2, n: "FP8 KV-cache. Speculative decoding for latency." },
      { s: 3, n: "DeepSeek V3's MLA dramatically compresses KV-cache. Major innovation." },
      { s: 2, n: "Speculative decoding + compressed KV standard. Serving is mature." },
      { s: 2, n: "Active optimization area. Inference cost is the binding constraint." },
    ],
  },
  {
    category: 5, label: "Tool use & function calling",
    cells: [
      { s: 0, n: "ChatGPT plugins announced but not real tool use." },
      { s: 3, n: "GPT-4 function calling. Structured JSON tool calls. Foundational." },
      { s: 2, n: "More models add function calling. Open-source catches up." },
      { s: 3, n: "Multi-tool use, parallel calls. Claude tool use API. Standard feature." },
      { s: 2, n: "Anthropic computer use. Agentic tool chains. MCP protocol." },
      { s: 3, n: "Agentic workflows: multi-step tool use, error recovery. RL for agents." },
      { s: 2, n: "Tool use is standard. Innovation in reliability and planning." },
      { s: 2, n: "Tool use is table stakes. Agentic behavior still maturing." },
    ],
  },
];

const STATE_COLORS = [
  { bg: "transparent", border: "transparent", text: "var(--muted)", label: "Not yet" },
  { bg: "var(--stable-bg)", border: "var(--stable-border)", text: "var(--muted)", label: "Stable" },
  { bg: "var(--iter-bg)", border: "var(--iter-border)", text: "var(--iter-text)", label: "Iterating" },
  { bg: "var(--major-bg)", border: "var(--major-border)", text: "var(--major-text)", label: "Major change" },
  { bg: "var(--shift-bg)", border: "var(--shift-border)", text: "var(--shift-text)", label: "Paradigm shift" },
];

export default function StackEvolution() {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterCat, setFilterCat] = useState(null);
  const tooltipRef = useRef(null);
  const gridRef = useRef(null);

  const filteredRows = filterCat !== null ? ROWS.filter(r => r.category === filterCat) : ROWS;

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'SF Mono', monospace",
      background: "var(--bg)",
      color: "var(--text)",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg: #f4f2ed;
          --bg2: #e8e5de;
          --bg3: #dbd7cf;
          --text: #1a1a1e;
          --muted: #6b6b75;
          --border: #c0bdb5;
          --accent: #2D5F6B;
          /* State colors: stable fades into bg, shifts are bold */
          --stable-bg: transparent;
          --stable-border: transparent;
          --iter-bg: #7B9EA80c;
          --iter-border: #7B9EA825;
          --iter-text: #7B9EA8;
          --major-bg: #D4700030;
          --major-border: #D4700070;
          --major-text: #B85C00;
          --shift-bg: #C0283050;
          --shift-border: #C02830a0;
          --shift-text: #B02020;
        }
        .dark {
          --bg: #08080a;
          --bg2: #111114;
          --bg3: #1a1a1f;
          --text: #e0ddd8;
          --muted: #6b6b78;
          --border: #252530;
          --accent: #7B9EA8;
          --stable-bg: transparent;
          --stable-border: transparent;
          --iter-bg: #7B9EA808;
          --iter-border: #7B9EA820;
          --iter-text: #7B9EA8;
          --major-bg: #E8852030;
          --major-border: #E8852060;
          --major-text: #E89040;
          --shift-bg: #E0404050;
          --shift-border: #E04040a0;
          --shift-text: #FF6B6B;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .cat-pill {
          padding: 4px 10px;
          border-radius: 3px;
          font-size: 10px;
          font-family: 'IBM Plex Mono', monospace;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid var(--border);
          background: var(--bg2);
          color: var(--muted);
          letter-spacing: 0.3px;
        }
        .cat-pill.active {
          border-color: var(--accent);
          color: var(--text);
          background: var(--bg3);
        }
        .cat-pill:hover { border-color: var(--accent); color: var(--text); }

        .row-label {
          font-size: 11px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--muted);
          padding: 6px 12px 6px 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          transition: color 0.1s;
          border-left: 3px solid transparent;
          display: flex;
          align-items: center;
          min-height: 38px;
        }
        .row-label:hover, .row-label.active { color: var(--text); }
        .row-label.active { border-left-color: var(--accent); }

        .cell {
          min-height: 38px;
          border: 1px solid transparent;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.1s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cell:hover {
          transform: scale(1.05);
          z-index: 2;
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
        }

        .tooltip {
          position: fixed;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 10px 14px;
          max-width: 320px;
          font-size: 11px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--text);
          line-height: 1.5;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          display: inline-block;
          vertical-align: middle;
        }

        .detail-panel {
          background: var(--bg2);
          border-top: 1px solid var(--border);
          padding: 16px 24px;
          overflow-y: auto;
          flex-shrink: 0;
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid var(--border)`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, color: "var(--text)" }}>
            AI Stack Evolution 2022–26
          </span>
          <span style={{ fontSize: 10, color: "var(--muted)" }}>
            Late 2022 (ChatGPT) → Early 2026 (Opus 4.6 era)
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <button className={`cat-pill ${filterCat === null ? "active" : ""}`}
            onClick={() => setFilterCat(null)}>All</button>
          {CATEGORIES.map((c, i) => (
            <button key={i} className={`cat-pill ${filterCat === i ? "active" : ""}`}
              onClick={() => setFilterCat(filterCat === i ? null : i)}
              style={filterCat === i ? { borderColor: c.color, color: c.color } : {}}>
              {c.name}
            </button>
          ))}
          <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            {STATE_COLORS.slice(1).map((s, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "var(--muted)" }}>
                <span className="legend-dot" style={{ background: s.bg, border: `1px solid ${s.border}` }}/>
                {s.label}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} style={{ flex: 1, overflow: "auto", padding: "0 0 0 0" }}>
        {/* Period headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px repeat(8, 1fr)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ padding: "8px 12px", fontSize: 9, color: "var(--muted)" }}>COMPONENT</div>
          {PERIODS.map((p, i) => (
            <div key={i} style={{ padding: "6px 4px", textAlign: "center", borderLeft: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, color: "var(--text)", fontWeight: 500 }}>{p.label}</div>
              <div style={{ fontSize: 8, color: "var(--muted)", marginTop: 1 }}>{p.sub}</div>
            </div>
          ))}
        </div>

        {/* Category groups */}
        {(() => {
          let currentCat = -1;
          return filteredRows.map((row, ri) => {
            const showCatHeader = row.category !== currentCat;
            if (showCatHeader) currentCat = row.category;
            const cat = CATEGORIES[row.category];
            return (
              <div key={ri}>
                {showCatHeader && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    borderTop: ri > 0 ? "1px solid var(--border)" : undefined,
                  }}>
                    <div style={{
                      padding: "6px 12px",
                      fontSize: 9,
                      fontWeight: 600,
                      color: cat.color,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      background: `${cat.color}08`,
                    }}>{cat.name}</div>
                    <div style={{ background: `${cat.color}08` }}/>
                  </div>
                )}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "220px repeat(8, 1fr)",
                  borderBottom: "1px solid var(--border)",
                  background: selectedRow === ri ? "var(--bg2)" : undefined,
                }}>
                  <div className={`row-label ${selectedRow === ri ? "active" : ""}`}
                    onClick={() => setSelectedRow(selectedRow === ri ? null : ri)}
                    style={{ borderLeftColor: selectedRow === ri ? cat.color : undefined }}>
                    {row.label}
                  </div>
                  {row.cells.map((cell, ci) => {
                    const sc = STATE_COLORS[cell.s];
                    return (
                      <div key={ci}
                        className="cell"
                        style={{
                          background: sc.bg,
                          borderColor: hoveredCell?.r === ri && hoveredCell?.c === ci ? sc.border : "transparent",
                          borderLeft: "1px solid var(--border)",
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            r: ri, c: ci,
                            x: Math.min(rect.left + rect.width / 2, window.innerWidth - 340),
                            y: rect.bottom + 8,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => setSelectedRow(selectedRow === ri ? null : ri)}>
                        {cell.s === 0 && <span style={{ fontSize: 8, color: "var(--muted)" }}>—</span>}
                        {cell.s === 4 && <span style={{ fontSize: 10 }}>★</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Detail panel */}
      {selectedRow !== null && (
        <div className="detail-panel" style={{ maxHeight: 160 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 12,
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
              color: CATEGORIES[filteredRows[selectedRow].category].color,
            }}>
              {filteredRows[selectedRow].label}
            </span>
            <button onClick={() => setSelectedRow(null)}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 11 }}>✕ close</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
            {filteredRows[selectedRow].cells.map((cell, ci) => (
              <div key={ci} style={{
                padding: "6px 8px",
                background: STATE_COLORS[cell.s].bg,
                border: `1px solid ${STATE_COLORS[cell.s].border}`,
                borderRadius: 4,
                fontSize: 9,
                fontFamily: "'IBM Plex Sans', sans-serif",
                color: "var(--text)",
                lineHeight: 1.4,
              }}>
                <div style={{ fontSize: 8, color: "var(--muted)", marginBottom: 3, fontWeight: 600 }}>{PERIODS[ci].label}</div>
                {cell.n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredCell && (
        <div className="tooltip" ref={tooltipRef} style={{
          left: hoveredCell.x,
          top: Math.min(hoveredCell.y, window.innerHeight - 120),
        }}>
          <div style={{ fontSize: 9, color: "var(--muted)", marginBottom: 3, fontWeight: 600 }}>
            {PERIODS[hoveredCell.c].label} — {filteredRows[hoveredCell.r].label}
          </div>
          <div style={{ color: STATE_COLORS[filteredRows[hoveredCell.r].cells[hoveredCell.c].s].text, fontWeight: 500, fontSize: 10, marginBottom: 4 }}>
            {STATE_COLORS[filteredRows[hoveredCell.r].cells[hoveredCell.c].s].label}
          </div>
          {filteredRows[hoveredCell.r].cells[hoveredCell.c].n}
        </div>
      )}
    </div>
  );
}
