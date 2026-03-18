import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;
export const publishDate = "2026-03-17";


import { useState } from "react";

const categories = [
  {
    id: "tokens",
    title: "Token Fundamentals",
    icon: "◆",
    color: "#E8C547",
    items: [
      { label: "1 token", value: "≈ ¾ of a word", note: "~4 characters in English" },
      { label: "1 page of text", value: "~500–800 tokens", note: "" },
      { label: "1 book", value: "~80K–120K tokens", note: "Average novel" },
      { label: "All of Wikipedia", value: "~4B tokens", note: "3.5M articles" },
      { label: "All books ever written", value: "~100B tokens", note: "Estimated" },
      { label: "Common Crawl", value: "~100T tokens", note: "Raw web; ~10T high-quality" },
      { label: "Output tokens cost", value: "3–8× input tokens", note: "Median ratio ~4×" },
    ],
  },
  {
    id: "pricing",
    title: "API Pricing (per 1M tokens, Mar 2026)",
    icon: "◈",
    color: "#6BCB77",
    items: [
      { label: "Frontier (Opus 4.6)", value: "$5 in / $25 out", note: "Was $15/$75 on Opus 4.1" },
      { label: "Mid-tier (Sonnet 4.6)", value: "$3 in / $15 out", note: "" },
      { label: "Budget (Haiku 4.5)", value: "$1 in / $5 out", note: "" },
      { label: "GPT-5.2", value: "$1.75 in / $14 out", note: "" },
      { label: "GPT-4o mini / Nano", value: "$0.15 in / $0.60 out", note: "Budget OpenAI" },
      { label: "DeepSeek V3", value: "~$0.55 in / $2.19 out", note: "90% below incumbents" },
      { label: "Open-source hosted (Llama)", value: "As low as $0.06/M", note: "Via Together.ai etc." },
    ],
  },
  {
    id: "deflation",
    title: "Cost Deflation",
    icon: "◇",
    color: "#4D96FF",
    items: [
      { label: "Price drop for equivalent perf", value: "~10× per year", note: "a16z 'LLMflation'" },
      { label: "GPT-3 perf (MMLU 42)", value: "$60 → $0.06/M tokens", note: "2021 → 2026 = 1,000×" },
      { label: "GPT-4 perf (MMLU 83)", value: "$60 → ~$1/M tokens", note: "2023 → 2026 = ~60×" },
      { label: "Frontier ceiling price", value: "Stays ~$60/M output", note: "New best models launch at old prices" },
      { label: "Cache read discount", value: "~90% off input price", note: "Prompt caching, 5-min window" },
      { label: "Batch API discount", value: "50% off", note: "Async, 24-hr turnaround" },
    ],
  },
  {
    id: "latency",
    title: "Latency & Throughput",
    icon: "◎",
    color: "#FF6B6B",
    items: [
      { label: "Time to first token (TTFT)", value: "100–500 ms", note: "Chat target: <250 ms" },
      { label: "Streaming output", value: "50–100 tok/s", note: "Frontier models, typical" },
      { label: "Small model output", value: "150–300 tok/s", note: "Haiku-class" },
      { label: "Local 7B model (M-series Mac)", value: "~30–60 tok/s", note: "Quantized, llama.cpp" },
      { label: "Reasoning model 'thinking'", value: "5–60 sec", note: "Can generate 10K+ internal tokens" },
      { label: "Embedding latency", value: "5–50 ms", note: "Per batch of ~100 chunks" },
      { label: "Vector search (1M vectors)", value: "1–10 ms", note: "HNSW index" },
    ],
  },
  {
    id: "context",
    title: "Context Windows",
    icon: "◉",
    color: "#C77DFF",
    items: [
      { label: "GPT-4 (original, 2023)", value: "8K tokens", note: "~12 pages" },
      { label: "Claude / GPT-5 (current)", value: "200K tokens", note: "~500 pages / a long novel" },
      { label: "Gemini 2.5 Pro", value: "1M tokens", note: "~2,500 pages" },
      { label: "Growth rate", value: "~1,000× since 2019", note: "Called 'new Moore's Law'" },
      { label: "Effective use of long context", value: "Degrades past ~100K", note: "'Needle in haystack' varies" },
      { label: "RAG chunk size (sweet spot)", value: "256–1,024 tokens", note: "With overlap" },
    ],
  },
  {
    id: "training",
    title: "Training Costs",
    icon: "◍",
    color: "#FF922B",
    items: [
      { label: "Original Transformer (2017)", value: "~$900", note: "" },
      { label: "GPT-3 (2020)", value: "$0.5–5M", note: "175B params" },
      { label: "GPT-4 (2023)", value: "$50–200M", note: "Amortized HW + energy + staff" },
      { label: "Current frontier run (2025–26)", value: "$500M–$1B+", note: "Per Anthropic, OpenAI estimates" },
      { label: "Projected 2027 frontier", value: "~$1–10B", note: "Extrapolated at 2.4× / year" },
      { label: "Fine-tune 7B (LoRA)", value: "$500–$5K", note: "1–5% of training from scratch" },
      { label: "Fine-tune 70B (LoRA)", value: "$5K–$50K", note: "On 8–64 GPUs" },
      { label: "Training from scratch, 7B", value: "$50K–$500K", note: "2–4 weeks on 64× A100/H100" },
    ],
  },
  {
    id: "hardware",
    title: "Hardware & Compute",
    icon: "◐",
    color: "#20C997",
    items: [
      { label: "H100 purchase price", value: "~$25–40K", note: "" },
      { label: "H100 cloud (2026)", value: "$1.50–$4.00/hr", note: "Down from $7–8/hr in 2023" },
      { label: "H100 FP16 peak", value: "990 TFLOPS", note: "" },
      { label: "H100 HBM3 memory", value: "80 GB", note: "Memory bandwidth: 3.35 TB/s" },
      { label: "H200 HBM3e memory", value: "141 GB", note: "Single-GPU for 70B models" },
      { label: "H100 TDP", value: "700W", note: "Per GPU" },
      { label: "Blackwell (B200) vs H100", value: "~2–4× inference", note: "30× claimed for some LLM workloads" },
      { label: "Memory bandwidth bottleneck", value: "2 bytes / param / token", note: "The real constraint, not FLOPS" },
    ],
  },
  {
    id: "models",
    title: "Model Scale",
    icon: "◑",
    color: "#F783AC",
    items: [
      { label: "Small / 'Haiku-class'", value: "1–8B params", note: "Runs on a laptop" },
      { label: "Medium / 'Sonnet-class'", value: "30–70B params", note: "1–2 GPUs" },
      { label: "Large / 'Opus-class'", value: "175B–1T+ params", note: "Multi-GPU cluster" },
      { label: "MoE models (e.g. Mixtral)", value: "~8B active of 46B total", note: "Sparse activation ~80% savings" },
      { label: "Embedding model", value: "100M–1B params", note: "768–3,072 dimensions" },
      { label: "Params ≠ quality", value: "13B (2026) > 175B (2020)", note: "Better data + training > scale alone" },
    ],
  },
  {
    id: "human",
    title: "Human Comparisons",
    icon: "◒",
    color: "#66D9E8",
    items: [
      { label: "Human reading speed", value: "~250 words/min", note: "~330 tokens/min" },
      { label: "Human typing speed", value: "~40 words/min", note: "~53 tokens/min" },
      { label: "LLM output speed", value: "~4,500 words/min", note: "At 100 tok/s" },
      { label: "LLM speed vs human writing", value: "~100×", note: "" },
      { label: "Expert hourly rate", value: "$100–$500/hr", note: "Strategy, legal, medical" },
      { label: "LLM cost for same word count", value: "< $0.10", note: "~3K words at frontier pricing" },
      { label: "LLM query energy vs Google search", value: "~10–30×", note: "~10 Wh vs ~0.3 Wh" },
    ],
  },
  {
    id: "scale",
    title: "Industry Scale",
    icon: "◓",
    color: "#A9E34B",
    items: [
      { label: "ChatGPT weekly active users", value: "~400M+", note: "As of late 2025" },
      { label: "OpenAI production cost per word", value: "$0.00012", note: "Estimated marginal" },
      { label: "Anthropic daily infra spend", value: "~$2.7M", note: "Reported" },
      { label: "NVIDIA data center quarterly rev", value: "$35B+", note: "2025, was <$1B/q in 2022" },
      { label: "Global AI investment (2025)", value: "~$200B+", note: "VC + corporate capex" },
      { label: "AI agent market (2025 → 2030)", value: "$7.6B → $47B", note: "~46% CAGR" },
    ],
  },
];

const FONT_STACK = "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', monospace";
const BODY_FONT = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif";

export default function NumbersEveryAIEngineerShouldKnow() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      cat.title.toLowerCase().includes(lower) ||
      cat.items.some(
        (item) =>
          item.label.toLowerCase().includes(lower) ||
          item.value.toLowerCase().includes(lower) ||
          item.note.toLowerCase().includes(lower)
      )
    );
  });

  const displayed = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e0e0e0",
        fontFamily: BODY_FONT,
        padding: "32px 20px 64px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto 40px" }}>
        <div
          style={{
            fontSize: 11,
            fontFamily: FONT_STACK,
            color: "#666",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          The AI-era equivalent of Jeff Dean's latency numbers
        </div>
        <h1
          style={{
            fontFamily: FONT_STACK,
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          Numbers Every AI Engineer
          <br />
          Should Know
        </h1>
        <div
          style={{
            fontSize: 13,
            color: "#555",
            fontFamily: FONT_STACK,
            marginBottom: 28,
          }}
        >
          Updated March 2026 — costs change fast, intuitions shouldn't lag
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "#14141f",
              border: "1px solid #2a2a3a",
              borderRadius: 6,
              color: "#e0e0e0",
              fontFamily: FONT_STACK,
              fontSize: 13,
              padding: "8px 14px",
              width: 220,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.id ? null : cat.id)
                }
                style={{
                  background:
                    activeCategory === cat.id ? cat.color + "22" : "#14141f",
                  border: `1px solid ${
                    activeCategory === cat.id ? cat.color + "66" : "#2a2a3a"
                  }`,
                  borderRadius: 4,
                  color: activeCategory === cat.id ? cat.color : "#666",
                  fontFamily: FONT_STACK,
                  fontSize: 11,
                  padding: "5px 10px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(440, 1fr))",
          gap: 20,
        }}
      >
        {displayed.map((cat) => (
          <div
            key={cat.id}
            style={{
              background: "#111118",
              border: `1px solid ${cat.color}18`,
              borderRadius: 10,
              padding: "20px 22px 18px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = cat.color + "44")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = cat.color + "18")
            }
          >
            {/* Category header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  color: cat.color,
                  lineHeight: 1,
                }}
              >
                {cat.icon}
              </span>
              <span
                style={{
                  fontFamily: FONT_STACK,
                  fontSize: 13,
                  fontWeight: 600,
                  color: cat.color,
                  letterSpacing: "0.02em",
                }}
              >
                {cat.title}
              </span>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cat.items.map((item, i) => {
                const matchesSearch =
                  searchTerm &&
                  (item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.value
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.note.toLowerCase().includes(searchTerm.toLowerCase()));
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "7px 0",
                      borderBottom:
                        i < cat.items.length - 1
                          ? "1px solid #1a1a28"
                          : "none",
                      background: matchesSearch
                        ? cat.color + "08"
                        : "transparent",
                      borderRadius: matchesSearch ? 4 : 0,
                      paddingLeft: matchesSearch ? 8 : 0,
                      paddingRight: matchesSearch ? 8 : 0,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 13,
                          color: "#999",
                          fontWeight: 400,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.note && (
                        <span
                          style={{
                            fontFamily: FONT_STACK,
                            fontSize: 10,
                            color: "#4a4a5a",
                            marginLeft: 8,
                          }}
                        >
                          {item.note}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_STACK,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#e8e8e8",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        marginLeft: 16,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          maxWidth: 960,
          margin: "40px auto 0",
          padding: "20px 0",
          borderTop: "1px solid #1a1a28",
        }}
      >
        <div
          style={{
            fontFamily: FONT_STACK,
            fontSize: 11,
            color: "#3a3a4a",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#555" }}>The one number to remember:</strong>{" "}
          For equivalent performance, LLM inference costs drop ~10× per year.
          <br />
          <strong style={{ color: "#555" }}>The one intuition to build:</strong>{" "}
          The frontier stays expensive (~$60/M output tokens). The floor collapses underneath it.
          <br />
          <strong style={{ color: "#555" }}>The one constraint that matters:</strong>{" "}
          Memory bandwidth, not FLOPS, is the bottleneck for LLM inference.
        </div>
      </div>
    </div>
  );
}
