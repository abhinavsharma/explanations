import { ArtifactStatus } from "@/components/artifact-wrapper";

export const artifactStatus = ArtifactStatus.HIDDEN;
export const publishDate = "2026-03-16";

import { useState, useRef, useEffect, createContext, useContext } from "react";

/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║                                                                        ║
   ║   CONTENT — edit text, data, and copy here                             ║
   ║   Everything below this section is rendering logic — you shouldn't     ║
   ║   need to touch it unless changing layout or interactions.             ║
   ║                                                                        ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

// ── Page header ──
const HEADER = {
  title: `"Intelligence will commoditize" is a useless claim`,
  subtitle: `It's not wrong. It's just not saying anything. The interesting question is which intelligence, under what conditions — and which input costs determine whether you have a moat.`,
};

// ── Section definitions ──
// Each section has a number, title, and prose paragraphs.
// Sections are rendered in order. Diagrams/charts are attached by key in the UI layer.

const SECTIONS = {
  dimensions: {
    num: "01",
    title: "A useful dimensionalization of intelligence",
    paragraphs: [
      `The claim "intelligence is commoditizing" treats AI capability as a single axis running from weak to strong. But .`,
      `Intelligence is infinite dimensional, but for the sake of a much better argument, let's make it 2d. Two properties of any AI use case determine its relationship to commoditization:`,
    ],
  },
  applications: {
    num: "02",
    title: "Example applications",
    paragraphs: [
      `Plot any AI application on these two axes and you get a map of where it sits. The applications span from the simple and solved to the complex and constantly evolving.`,
    ],
  },
  inputs: {
    num: "03",
    title: "The three inputs that matter",
    paragraphs: [
      `The fundamental costs in AI are compute, talent, and data. But these inputs don't commoditize uniformly — each follows its own logic.`,
    ],
  },
  synthesis: {
    num: "04",
    title: "What commoditizes and what doesn't",
    paragraphs: [`Now thread the inputs through the map:`],
    closing: `So when someone tells you "intelligence is commoditizing," ask them where on this map they're pointing. Narrow-and-static? That shipped years ago. Broad-and-shifting? That's a fundamentally different game — one where deploying a solution changes the problem you're solving, where publishing a benchmark would make it obsolete, and where the word "intelligence" is doing far too much work.`,
  },
};

// ── Dimension cards (Section 01) ──
const DIMENSIONS = [
  {
    label: "Cognitive Breadth",
    from: "Narrow",
    to: "Broad",
    desc: "How much of the cognitive landscape does the task touch? OCR is narrow — one function, well-bounded. Warfare strategy is broad — it requires integrating signals across intelligence, logistics, geography, and politics.",
  },
  {
    label: "Rate of Change",
    from: "Static",
    to: "Shifting",
    desc: "How much does the winning approach change over time? Mathematical proof doesn't shift — a theorem proved in 1850 stays proved. Fraud detection shifts constantly — every deployed countermeasure creates selection pressure for new attack patterns.",
  },
];

// ── Scatter plot points (Section 02) ──
// x: 0 = narrow, 1 = broad
// y: 0 = static, 1 = shifting
// q: quadrant key — ns (narrow+static), bs (broad+static), nsh (narrow+shifting), bsh (broad+shifting)
const SCATTER_POINTS = [
  // Narrow + Static
  { id: "ocr", label: "OCR", x: 0.15, y: 0.1, q: "ns" },
  { id: "spam", label: "Spam filtering", x: 0.22, y: 0.18, q: "ns" },
  { id: "sentiment", label: "Sentiment analysis", x: 0.28, y: 0.1, q: "ns" },
  {
    id: "classification",
    label: "Image classification",
    x: 0.18,
    y: 0.15,
    q: "ns",
  },

  // Broad + Static
  { id: "translation", label: "Translation", x: 0.62, y: 0.15, q: "bs" },
  { id: "math", label: "Mathematical reasoning", x: 0.72, y: 0.06, q: "bs" },
  { id: "software", label: "Well-defined software", x: 0.68, y: 0.22, q: "bs" },
  { id: "extraction", label: "Data extraction", x: 0.55, y: 0.12, q: "bs" },

  // Narrow + Shifting
  { id: "fraud", label: "Fraud detection", x: 0.2, y: 0.65, q: "nsh" },
  { id: "drone", label: "Drone flight paths", x: 0.3, y: 0.72, q: "nsh" },
  { id: "cyber", label: "Cybersecurity", x: 0.25, y: 0.78, q: "nsh" },
  { id: "pricing", label: "Dynamic pricing", x: 0.32, y: 0.58, q: "nsh" },
  {
    id: "compliance",
    label: "Regulatory compliance",
    x: 0.35,
    y: 0.48,
    q: "nsh",
  },
  { id: "supply", label: "Supply chain routing", x: 0.28, y: 0.55, q: "nsh" },

  // Broad + Shifting
  { id: "warfare", label: "Warfare strategy", x: 0.78, y: 0.85, q: "bsh" },
  {
    id: "targeting",
    label: "AI target identification",
    x: 0.58,
    y: 0.75,
    q: "bsh",
  },
  { id: "investing", label: "Investing", x: 0.82, y: 0.9, q: "bsh" },
  { id: "drug", label: "Drug discovery", x: 0.75, y: 0.6, q: "bsh" },
  {
    id: "geopolitical",
    label: "Geopolitical strategy",
    x: 0.88,
    y: 0.88,
    q: "bsh",
  },
  {
    id: "disinformation",
    label: "Influence operations",
    x: 0.65,
    y: 0.82,
    q: "bsh",
  },
];

// ── Quadrant summaries (Section 02 cards) ──
const QUADRANT_CARDS = [
  {
    qKey: "ns",
    title: "Narrow + Static",
    text: "OCR, spam filtering, image classification. These shipped as commodity APIs years ago.",
  },
  {
    qKey: "bs",
    title: "Broad + Static",
    text: "Mathematical reasoning, translation, well-defined software. Broad but benchmarkable.",
  },
  {
    qKey: "nsh",
    title: "Narrow + Shifting",
    text: "Fraud detection, drone flight paths, dynamic pricing. Constrained domain, shifting ground.",
  },
  {
    qKey: "bsh",
    title: "Broad + Shifting",
    text: "Warfare strategy, investing, geopolitical analysis. Wide breadth, constantly evolving.",
  },
];

// ── Iran war case study (Section 02 callout) ──
const IRAN_CASE_STUDY = {
  title: "Case study: AI in the Iran war",
  lead: "The current conflict illustrates the full spectrum of this map:",
  bullets: [
    {
      label: "Narrow + Static",
      text: "Face detection on traffic cameras to locate targets — commodity vision models, deployed for years",
    },
    {
      label: "Narrow + Shifting",
      text: "Autonomous drone flight trajectories adapting to new air defense patterns in real time",
    },
    {
      label: "Broad + Shifting",
      text: "AI-driven target identification synthesizing billions of data points from HUMINT, surveillance, and signals intelligence — the problem surface changes with every strike",
    },
    {
      label: "Broad + Shifting (extreme)",
      text: "Warfare strategy itself — adversarial, with every move visible to an opponent who adapts",
    },
  ],
};

// ── Frontier model cost breakdown chart (Section 03, top) ──
// Source: Epoch AI — amortized hardware + energy + staff for GPT-4 class models
const COST_BREAKDOWN = {
  title: "Frontier model development cost breakdown",
  source:
    "Source: Epoch AI (2024) — based on GPT-4 and Gemini Ultra class models",
  sourceUrl:
    "https://epoch.ai/blog/how-much-does-it-cost-to-train-frontier-ai-models",
  summary:
    "Ranges reflect variation across frontier models analyzed (GPT-3, OPT-175B, GPT-4, Gemini Ultra)",
  bars: [
    { label: "Hardware", pctLow: 47, pctHigh: 67, colorKey: "ns" },
    { label: "R&D staff", pctLow: 29, pctHigh: 49, colorKey: "nsh" },
    { label: "Energy", pctLow: 2, pctHigh: 6, colorKey: "bsh" },
  ],
};

// ── Cost factor expanders (Section 03) ──
const COST_FACTORS = [
  {
    name: "Compute",
    tagline: "The obvious commodity",
    colorKey: "ns",
    paragraphs: [
      "Inference costs for LLMs have been halving roughly every two months. GPU performance per dollar improves ~40% annually. AWS cut H100 prices 44% in mid-2025, triggering market-wide resets. The total stock of NVIDIA compute doubles every ten months.",
      "This is the most legible commodity in AI: fungible, measurable, and falling in price faster than almost any input in economic history. The best and worst models remain within a relatively narrow compute band of each other at any given moment — the frontier model of 18 months ago runs on today's consumer hardware.",
    ],
    showFlopChart: true,
  },
  {
    name: "Talent",
    tagline: "Only scarce at the frontier",
    colorKey: "nsh",
    paragraphs: [
      "The rarest AI talent — the researchers who can push the state of the art — gravitates toward the most shifting, general problems. These are the problems where yesterday's solution is already obsolete, where you need people who can continuously re-solve. The talent wars for these few individuals involve compensation packages reaching $100M+ (Meta reportedly offered some candidates this figure) — yet even those figures are negligible compared to the billions spent on compute and data for a single frontier model generation.",
      "For static problems, talent commoditizes naturally. The frontier moves past them. Yesterday's breakthrough becomes today's textbook becomes tomorrow's open-source library. The researchers who solved ImageNet moved on to language models; the ones who solved language modeling are moving on to agentic systems. The problems they leave behind get staffed by increasingly available engineers.",
    ],
  },
  {
    name: "Data",
    tagline: "The trust-entangled input",
    colorKey: "bsh",
    paragraphs: [
      "The data streams powering AI are shifting from the open internet — largely exhausted for training — to proprietary, priced sources. The question becoming central to every AI strategy is: who has unique and defensible access to generating new data?",
    ],
    showDataTaxonomy: true,
    showMercorRates: true,
  },
];

// ── FLOP/s chart data (inside Compute expander) ──
// Normalized: 2008 = 1. Source: Epoch AI.
const FLOP_CHART = {
  title: "ML GPU performance per dollar (GFLOP/s per $, log scale)",
  source: "Source: Epoch AI ML Hardware Dataset",
  sourceUrl: "https://epoch.ai/data/machine-learning-hardware",
  summary: "Actual hardware data points — performance per dollar roughly doubles every ~2 years",
  data: [
    { year: 2010, val: 3.2,  label: "GTX 580" },
    { year: 2014, val: 1.6,  label: "Tesla K80" },
    { year: 2016, val: 14.8, label: "GTX 1080" },
    { year: 2017, val: 10.9, label: "V100" },
    { year: 2020, val: 41.6, label: "A100" },
    { year: 2022, val: 58.9, label: "H100" },
    { year: 2023, val: 174.3,label: "MI300X" },
  ],
};

// ── Data taxonomy (inside Data expander) ──
const DATA_TAXONOMY = {
  title: "Data taxonomy: digital vs. physical-world",
  types: [
    {
      label: "Internet text (crawled)",
      physical: false,
      shifting: false,
      example: "Common Crawl, Wikipedia",
      status: "Largely exhausted",
    },
    {
      label: "Synthetic data (model-generated)",
      physical: false,
      shifting: false,
      example: "LLM self-play, distillation",
      status: "Scaling but diminishing",
    },
    {
      label: "Licensed digital content",
      physical: false,
      shifting: true,
      example: "News, academic papers, code",
      status: "Increasingly priced",
    },
    {
      label: "Expert human feedback (RLHF)",
      physical: true,
      shifting: true,
      example: "Mercor, Scale AI, Surge AI",
      status: "Exploding in cost",
    },
    {
      label: "Domain-specific physical data",
      physical: true,
      shifting: true,
      example: "Clinical trials, sensor data",
      status: "Trust-gated",
    },
    {
      label: "Adversarial real-world data",
      physical: true,
      shifting: true,
      example: "Fraud patterns, combat signals",
      status: "Cannot be stockpiled",
    },
  ],
};

// ── Mercor rate tiers (inside Data expander) ──
const MERCOR_RATES = {
  title: "What human data costs: Mercor rate tiers",
  source: "Source: Mercor job listings, TechCrunch",
  sourceUrl:
    "https://techcrunch.com/2025/10/29/how-ai-labs-use-mercor-to-get-the-data-companies-wont-share/",
  summary:
    "Mercor pays $1.5M+/day to 30,000+ contractors. $500M ARR by Aug 2025 (up from $35M end of 2024). Valued at $10B (Oct 2025).",
  tiers: [
    {
      rate: "$15–40/hr",
      tier: "AI training & annotation",
      note: "Basic annotation, classification, structured tasks",
    },
    {
      rate: "$50–150/hr",
      tier: "Software engineering & data science",
      note: "Technical evaluation, code review",
    },
    {
      rate: "~$95/hr",
      tier: "Platform average",
      note: "Reported average across 30,000+ contractors",
    },
    {
      rate: "up to $200/hr",
      tier: "Domain experts",
      note: "Doctors, lawyers, PhDs — structured reports & evaluation",
    },
  ],
};

// ── Synthesis cards (Section 04) ──
const SYNTHESIS_CARDS = [
  {
    qKey: "ns",
    title: "Narrow + Static",
    verdict: "Fully commodity",
    bullets: [
      "Compute: was always sufficient — these are tiny models",
      "Talent: moved on to harder problems years ago",
      "Data: static and publicly available, no proprietary edge possible",
    ],
  },
  {
    qKey: "bs",
    title: "Broad + Static",
    verdict: "Converging — but trust slows it",
    bullets: [
      "Compute: commoditizes — open models can match proprietary given time",
      "Talent: commoditizes — the frontier has moved past these problems",
      "Data: creates friction — Moderna doesn't want insights leaking to Pfizer. Pushes demand toward open models and self-hosting, not for capability but for control",
    ],
  },
  {
    qKey: "nsh",
    title: "Narrow + Shifting",
    verdict: "Durable edge through feedback loops",
    bullets: [
      "Compute: commoditizes — not the bottleneck",
      "Talent: does not commoditize — you need people who continuously re-solve as the surface shifts",
      "Data: proprietary streams that update in real time. The moat is feedback loop speed: detect shift, retrain, redeploy",
    ],
  },
  {
    qKey: "bsh",
    title: "Broad + Shifting",
    verdict: "Structural moat",
    bullets: [
      "Compute: matters differently — not cheapest inference but continuous retraining capacity",
      "Talent: the frontier. Best researchers are drawn here because these problems are never solved",
      "Data: entangled with trust, access, and physical-world resources that can't be replicated. Who has the relationships to generate data against the real world?",
    ],
  },
];

// ── Quadrant metadata (used by legend + colors) ──
const QUADRANT_META = {
  ns: { label: "Narrow + Static" },
  bs: { label: "Broad + Static" },
  nsh: { label: "Narrow + Shifting" },
  bsh: { label: "Broad + Shifting" },
};

/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║                                                                        ║
   ║   DESIGN TOKENS — colors, fonts, theme                                ║
   ║                                                                        ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const MONO = "'JetBrains Mono','SF Mono','Consolas',monospace";
const SERIF = "'Newsreader','Georgia',serif";

const THEMES = {
  light: {
    bg: "#FAFAF7",
    cardBg: "#fff",
    text: "#1a1a1a",
    textSecondary: "#555",
    textTertiary: "#999",
    textFaint: "#bbb",
    border: "#e5e5e5",
    borderLight: "#e0e0e0",
    gridLine: "#e0e0e0",
    axisLine: "#ccc",
    axisText: "#aaa",
    calloutBg: "06",
    costBg: "#FAFAF7",
    costOpenBg: "#fff",
    costText: "#444",
    quadTint: "08",
    pointStroke: "#fff",
    fadedOpacity: 0.12,
    toggleBg: "#e5e5e5",
    toggleKnob: "#fff",
    chartBarBg: "#eee",
    chartText: "#666",
  },
  dark: {
    bg: "#141413",
    cardBg: "#1e1e1c",
    text: "#e0ddd8",
    textSecondary: "#a8a49e",
    textTertiary: "#706c66",
    textFaint: "#504c47",
    border: "#333",
    borderLight: "#2a2a28",
    gridLine: "#2a2a28",
    axisLine: "#444",
    axisText: "#666",
    calloutBg: "15",
    costBg: "#1a1a18",
    costOpenBg: "#1e1e1c",
    costText: "#b0ada7",
    quadTint: "12",
    pointStroke: "#1e1e1c",
    fadedOpacity: 0.08,
    toggleBg: "#333",
    toggleKnob: "#e0ddd8",
    chartBarBg: "#2a2a28",
    chartText: "#888",
  },
};
const QUADRANT_COLORS = {
  light: { ns: "#7A8B99", bs: "#4A7A62", nsh: "#B8860B", bsh: "#9B2335" },
  dark: { ns: "#9BB0BF", bs: "#6BA88C", nsh: "#D4A832", bsh: "#C94460" },
};

/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║                                                                        ║
   ║   RENDERING — layout, components, interactions                         ║
   ║   You probably don't need to edit below this line.                     ║
   ║                                                                        ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const ThemeCtx = createContext<any>(null);
const useTheme = () => useContext(ThemeCtx);

export default function Post() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [hovered, setHovered] = useState(null);
  const [selectedQ, setSelectedQ] = useState(null);
  const [expandedCost, setExpandedCost] = useState(null);
  const [chartSize, setChartSize] = useState(560);
  const containerRef = useRef(null);
  const t = THEMES[dark ? "dark" : "light"];
  const qc = QUADRANT_COLORS[dark ? "dark" : "light"];

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current)
        setChartSize(
          Math.min(Math.max(containerRef.current.offsetWidth - 60, 300), 600),
        );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pad = 56,
    sz = chartSize;
  const filteredPoints = selectedQ
    ? SCATTER_POINTS.filter((p) => p.q === selectedQ)
    : SCATTER_POINTS;
  const fadedPoints = selectedQ
    ? SCATTER_POINTS.filter((p) => p.q !== selectedQ)
    : [];

  return (
    <ThemeCtx.Provider value={{ t, qc, dark }}>
      <div
        ref={containerRef}
        style={{
          fontFamily: SERIF,
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
          color: t.text,
          lineHeight: 1.7,
          transition: "color 0.3s",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&display=swap');@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}`}</style>

        {/* Header */}
        <header style={{ marginBottom: 64, position: "relative" }}>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 1.2,
              margin: "0 0 20px",
              fontStyle: "italic",
            }}
          >
            {HEADER.title}
          </h1>
          <p
            style={{
              fontSize: 17,
              color: t.textSecondary,
              margin: 0,
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{
              __html: HEADER.subtitle
                .replace(/which/g, "<em>which</em>")
                .replace(/what/g, "<em>what</em>"),
            }}
          />
        </header>

        {/* Section 01: Dimensions */}
        <Sec num={SECTIONS.dimensions.num} title={SECTIONS.dimensions.title}>
          {SECTIONS.dimensions.paragraphs.map((p, i) => (
            <Body key={i}>{p}</Body>
          ))}
          <div
            style={{
              display: "flex",
              gap: 16,
              margin: "28px 0 0",
              flexWrap: "wrap",
            }}
          >
            {DIMENSIONS.map((d, i) => (
              <DimCard key={i} {...d} />
            ))}
          </div>
        </Sec>

        {/* Section 02: Applications */}
        <Sec
          num={SECTIONS.applications.num}
          title={SECTIONS.applications.title}
        >
          {SECTIONS.applications.paragraphs.map((p, i) => (
            <Body key={i}>{p}</Body>
          ))}

          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {Object.entries(QUADRANT_META).map(([key, q]) => (
              <button
                key={key}
                onClick={() => setSelectedQ(selectedQ === key ? null : key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  border: `1.5px solid ${selectedQ === key ? qc[key] : "transparent"}`,
                  borderRadius: 20,
                  padding: "5px 14px 5px 10px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  background:
                    selectedQ === key ? qc[key] + "18" : "transparent",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: qc[key],
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: t.textSecondary,
                  }}
                >
                  {q.label}
                </span>
              </button>
            ))}
          </div>

          {/* Scatter plot */}
          <div
            style={{ position: "relative", margin: "0 auto", width: sz + pad }}
          >
            <div
              style={{
                position: "absolute",
                left: -8,
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontFamily: MONO,
                fontSize: 10,
                color: t.axisText,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Rate of Change: Static → Shifting
            </div>
            <svg
              width={sz + pad}
              height={sz + pad + 40}
              viewBox={`0 0 ${sz + pad} ${sz + pad + 40}`}
              style={{ display: "block" }}
            >
              <rect
                x={pad}
                y={pad}
                width={sz / 2}
                height={sz / 2}
                fill={qc.nsh + t.quadTint}
              />
              <rect
                x={pad + sz / 2}
                y={pad}
                width={sz / 2}
                height={sz / 2}
                fill={qc.bsh + t.quadTint}
              />
              <rect
                x={pad}
                y={pad + sz / 2}
                width={sz / 2}
                height={sz / 2}
                fill={qc.ns + t.quadTint}
              />
              <rect
                x={pad + sz / 2}
                y={pad + sz / 2}
                width={sz / 2}
                height={sz / 2}
                fill={qc.bs + t.quadTint}
              />
              <line
                x1={pad}
                y1={pad + sz / 2}
                x2={pad + sz}
                y2={pad + sz / 2}
                stroke={t.gridLine}
                strokeDasharray="4,4"
              />
              <line
                x1={pad + sz / 2}
                y1={pad}
                x2={pad + sz / 2}
                y2={pad + sz}
                stroke={t.gridLine}
                strokeDasharray="4,4"
              />
              <line
                x1={pad}
                y1={pad}
                x2={pad}
                y2={pad + sz}
                stroke={t.axisLine}
                strokeWidth={1.5}
              />
              <line
                x1={pad}
                y1={pad + sz}
                x2={pad + sz}
                y2={pad + sz}
                stroke={t.axisLine}
                strokeWidth={1.5}
              />
              <text
                x={pad + sz / 2}
                y={pad + sz + 32}
                textAnchor="middle"
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  fill: t.axisText,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Cognitive Breadth: Narrow → Broad
              </text>
              {fadedPoints.map((pt) => (
                <circle
                  key={pt.id}
                  cx={pad + pt.x * sz}
                  cy={pad + sz - pt.y * sz}
                  r={5}
                  fill={qc[pt.q]}
                  opacity={t.fadedOpacity}
                />
              ))}
              {filteredPoints.map((pt) => {
                const cx = pad + pt.x * sz,
                  cy = pad + sz - pt.y * sz,
                  isH = hovered === pt.id,
                  c = qc[pt.q];
                return (
                  <g
                    key={pt.id}
                    onMouseEnter={() => setHovered(pt.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {isH && (
                      <circle cx={cx} cy={cy} r={14} fill={c} opacity={0.15} />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isH ? 7 : 5.5}
                      fill={c}
                      stroke={t.pointStroke}
                      strokeWidth={2}
                    />
                    {isH && (
                      <>
                        <rect
                          x={cx - pt.label.length * 3.5 - 8}
                          y={cy - 28}
                          width={pt.label.length * 7 + 16}
                          height={20}
                          rx={4}
                          fill={c}
                        />
                        <text
                          x={cx}
                          y={cy - 15}
                          textAnchor="middle"
                          style={{
                            fontFamily: MONO,
                            fontSize: 10.5,
                            fill: "#fff",
                            fontWeight: 500,
                          }}
                        >
                          {pt.label}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quadrant cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 28,
            }}
          >
            {QUADRANT_CARDS.map((c, i) => (
              <QuadCard key={i} {...c} />
            ))}
          </div>

          {/* Iran case study */}
          <Callout accentKey="bsh" title={IRAN_CASE_STUDY.title}>
            <span>{IRAN_CASE_STUDY.lead}</span>
            <ul
              style={{
                margin: "10px 0 0",
                paddingLeft: 20,
                fontSize: 15,
                lineHeight: 1.65,
              }}
            >
              {IRAN_CASE_STUDY.bullets.map((b, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <strong>{b.label}:</strong> {b.text}
                </li>
              ))}
            </ul>
          </Callout>
        </Sec>

        {/* Section 03: Inputs */}
        <Sec num={SECTIONS.inputs.num} title={SECTIONS.inputs.title}>
          {SECTIONS.inputs.paragraphs.map((p, i) => (
            <Body key={i}>{p}</Body>
          ))}

          {/* Cost breakdown chart */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 8,
              padding: "20px 22px",
              marginBottom: 24,
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: t.textTertiary,
                marginBottom: 12,
              }}
            >
              {COST_BREAKDOWN.title}
            </div>
            <a
              href={COST_BREAKDOWN.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: t.textFaint,
                marginBottom: 16,
                display: "block",
                textDecoration: "none",
                borderBottom: `1px solid ${t.border}`,
                paddingBottom: 2,
                width: "fit-content",
              }}
            >
              {COST_BREAKDOWN.source}
            </a>
            {COST_BREAKDOWN.bars.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 90,
                    fontFamily: MONO,
                    fontSize: 11,
                    color: t.textSecondary,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 18,
                    background: t.chartBarBg,
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Low end (solid) */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: `${item.pctLow}%`,
                      height: "100%",
                      background: qc[item.colorKey],
                      borderRadius: 3,
                      transition: "width 0.3s",
                    }}
                  />
                  {/* High end (striped/lighter) */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${item.pctLow}%`,
                      width: `${item.pctHigh - item.pctLow}%`,
                      height: "100%",
                      background: qc[item.colorKey] + "55",
                      borderRadius: "0 3px 3px 0",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 70,
                    fontFamily: MONO,
                    fontSize: 11,
                    color: t.chartText,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.pctLow}–{item.pctHigh}%
                </div>
              </div>
            ))}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: t.textFaint,
                marginTop: 10,
                borderTop: `1px solid ${t.border}`,
                paddingTop: 8,
              }}
            >
              {COST_BREAKDOWN.summary}
            </div>
          </div>

          {/* Cost factor expanders */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COST_FACTORS.map((c, i) => {
              const open = expandedCost === i,
                color = qc[c.colorKey];
              return (
                <button
                  key={i}
                  onClick={() => setExpandedCost(open ? null : i)}
                  style={{
                    border: `1px solid ${t.borderLight}`,
                    borderLeft: `4px solid ${color}`,
                    borderRadius: "0 8px 8px 0",
                    padding: "16px 20px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                    width: "100%",
                    background: open ? t.costOpenBg : t.costBg,
                    color: t.text,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        {c.name}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 11,
                          color,
                          fontWeight: 500,
                        }}
                      >
                        {c.tagline}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: 16,
                        color: t.textFaint,
                        transition: "transform 0.2s",
                        transform: open ? "rotate(90deg)" : "none",
                      }}
                    >
                      →
                    </span>
                  </div>
                  {open && (
                    <div style={{ animation: "fadeIn 0.2s ease" }}>
                      {c.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          style={{
                            fontSize: 15,
                            lineHeight: 1.65,
                            color: t.costText,
                            margin: j === 0 ? "14px 0 10px" : "10px 0 0",
                          }}
                        >
                          {p}
                        </p>
                      ))}
                      {c.showFlopChart && <FlopChartWidget />}
                      {c.showDataTaxonomy && <DataTaxonomyWidget />}
                      {c.showMercorRates && <MercorRatesWidget />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Sec>

        {/* Section 04: Synthesis */}
        <Sec num={SECTIONS.synthesis.num} title={SECTIONS.synthesis.title}>
          {SECTIONS.synthesis.paragraphs.map((p, i) => (
            <Body key={i}>{p}</Body>
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {SYNTHESIS_CARDS.map((c, i) => (
              <SynthCard key={i} {...c} />
            ))}
          </div>
          <Body>{SECTIONS.synthesis.closing}</Body>
        </Sec>

        <footer
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: `1px solid ${t.border}`,
          }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: t.textFaint,
              margin: 0,
            }}
          >
            Draft — interactive essay
          </p>
        </footer>
      </div>
    </ThemeCtx.Provider>
  );
}

/* ── Reusable layout components ── */

function Sec({ num, title, children }) {
  const { t } = useTheme();
  return (
    <section style={{ marginBottom: 60 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: t.textFaint,
            fontWeight: 500,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: t.textSecondary,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
function Body({ children }) {
  return (
    <p
      style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 16, marginTop: 0 }}
    >
      {children}
    </p>
  );
}

function DimCard({ label, from, to, desc }) {
  const { t } = useTheme();
  return (
    <div
      style={{
        flex: "1 1 280px",
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 8,
        padding: "20px 22px",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: t.textTertiary,
          marginBottom: 8,
        }}
      >
        Dimension
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 500,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {label}
        <span style={{ fontFamily: MONO, fontSize: 12, color: t.textTertiary }}>
          {from} → {to}
        </span>
      </div>
      <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  );
}

function QuadCard({ qKey, title, text }) {
  const { t, qc } = useTheme();
  const c = qc[qKey];
  return (
    <div
      style={{
        borderLeft: `3px solid ${c}`,
        padding: "12px 16px",
        background: c + t.quadTint,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 600,
          color: c,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.55, color: t.textSecondary }}>
        {text}
      </div>
    </div>
  );
}

function Callout({ accentKey, title, children }) {
  const { t, qc } = useTheme();
  const c = accentKey ? qc[accentKey] : t.textSecondary;
  return (
    <div
      style={{
        borderLeft: `3px solid ${c}`,
        background: c + t.calloutBg,
        padding: "20px 22px",
        margin: "28px 0",
        borderRadius: "0 8px 8px 0",
        transition: "all 0.3s",
      }}
    >
      {title && (
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 600,
            color: c,
            margin: "0 0 8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </p>
      )}
      <div
        style={{ fontSize: 15, margin: 0, color: t.costText, lineHeight: 1.65 }}
      >
        {children}
      </div>
    </div>
  );
}

function SynthCard({ qKey, title, verdict, bullets }) {
  const { t, qc } = useTheme();
  const c = qc[qKey];
  return (
    <div
      style={{
        border: `1px solid ${c}33`,
        borderLeft: `4px solid ${c}`,
        borderRadius: "0 8px 8px 0",
        padding: "20px 20px 16px",
        background: t.cardBg,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: c }}
        >
          {title}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: c + "AA" }}>
          {verdict}
        </span>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 18,
          fontSize: 14,
          lineHeight: 1.6,
          color: t.costText,
        }}
      >
        {bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Data visualization widgets ── */

function FlopChartWidget() {
  const { t, qc } = useTheme();
  const maxVal = Math.max(...FLOP_CHART.data.map((d) => d.val));
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 6,
        padding: "16px 18px",
        marginTop: 16,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: t.textTertiary,
          marginBottom: 4,
        }}
      >
        {FLOP_CHART.title}
      </div>
      <a
        href={FLOP_CHART.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: t.textFaint,
          marginBottom: 14,
          display: "block",
          textDecoration: "none",
          borderBottom: `1px solid ${t.border}`,
          paddingBottom: 2,
          width: "fit-content",
        }}
      >
        {FLOP_CHART.source}
      </a>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}
      >
        {FLOP_CHART.data.map((d, i) => {
          const h = (Math.log10(d.val) / Math.log10(maxVal)) * 100;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span
                style={{ fontFamily: MONO, fontSize: 8, color: t.textTertiary }}
              >
                {d.val}B
              </span>
              <div
                style={{
                  width: "100%",
                  height: h,
                  background: qc.ns,
                  borderRadius: "3px 3px 0 0",
                  minHeight: 4,
                  transition: "background 0.3s",
                }}
              />
              <span
                style={{ fontFamily: MONO, fontSize: 7, color: t.textFaint, textAlign: "center", lineHeight: 1.2 }}
              >
                {d.label}
                <br />
                {`'${d.year.toString().slice(-2)}`}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: t.textFaint,
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {FLOP_CHART.summary}
      </div>
    </div>
  );
}

function DataTaxonomyWidget() {
  const { t, qc } = useTheme();
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 6,
        padding: "16px 18px",
        marginTop: 16,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: t.textTertiary,
          marginBottom: 14,
        }}
      >
        {DATA_TAXONOMY.title}
      </div>
      {DATA_TAXONOMY.types.map((d, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
            padding: "6px 8px",
            borderRadius: 4,
            background: d.physical ? qc.bsh + "0D" : qc.ns + "0D",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              width: 14,
              textAlign: "center",
              color: d.physical ? qc.bsh : qc.ns,
            }}
          >
            {d.physical ? "⬤" : "○"}
          </span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 600,
                color: t.text,
              }}
            >
              {d.label}
            </div>
            <div style={{ fontSize: 12, color: t.textTertiary }}>
              {d.example}
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: d.shifting ? qc.bsh : qc.ns,
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {d.status}
          </div>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
          fontFamily: MONO,
          fontSize: 10,
          color: t.textFaint,
        }}
      >
        <span>○ Digital-only</span>
        <span style={{ color: qc.bsh }}>⬤ Requires physical world</span>
      </div>
    </div>
  );
}

function MercorRatesWidget() {
  const { t, qc } = useTheme();
  return (
    <div
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 6,
        padding: "16px 18px",
        marginTop: 16,
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: t.textTertiary,
          marginBottom: 4,
        }}
      >
        {MERCOR_RATES.title}
      </div>
      <a
        href={MERCOR_RATES.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: t.textFaint,
          marginBottom: 14,
          display: "block",
          textDecoration: "none",
          borderBottom: `1px solid ${t.border}`,
          paddingBottom: 2,
          width: "fit-content",
        }}
      >
        {MERCOR_RATES.source}
      </a>
      {MERCOR_RATES.tiers.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 13,
              fontWeight: 600,
              color: qc.bsh,
              width: 100,
              flexShrink: 0,
            }}
          >
            {r.rate}
          </span>
          <div>
            <span style={{ fontFamily: MONO, fontSize: 12, color: t.text }}>
              {r.tier}
            </span>
            <span
              style={{ fontSize: 12, color: t.textTertiary, marginLeft: 8 }}
            >
              — {r.note}
            </span>
          </div>
        </div>
      ))}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: t.textFaint,
          marginTop: 10,
          borderTop: `1px solid ${t.border}`,
          paddingTop: 8,
        }}
      >
        {MERCOR_RATES.summary}
      </div>
    </div>
  );
}
