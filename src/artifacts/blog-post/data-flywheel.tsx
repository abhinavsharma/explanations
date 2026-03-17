import { ArtifactStatus } from "@/components/artifact-wrapper";

export const artifactStatus = ArtifactStatus.PUBLISHED;
export const publishDate = "2025-08-15";
export const title = "The Data Flywheel Is About Users, Not Usage";
export const subtitle =
  "The AI company with the best model won't be the one with the most users.";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONTENT — edit text here without touching markup below
// ============================================================

const CONTENT = {
  label: "Essay",
  title: "The AI data flywheel is about users, not usage",
  subtitle:
    "The company with the best model won't be the one with the most users. It'll be the one whose users are the most creative, intelligent, and diverse.",

  intro:
    "The conventional wisdom is that AI dominance is a numbers game — most users, most data, best model. This gets the causal chain wrong. The data flywheel that actually improves a model isn't driven by raw volume. It's driven by the creativity, intelligence, and diversity of the people using it — because those people generate the best distribution of prompts and provide \"expert\" feedback on the answers.",

  introAfterFlywheel:
    'The flywheel isn\'t more users → better model. It\'s "expert" users → diverse questions + taste-and-correctness feedback → better model → attracts more "expert" users. The winner in AI won\'t be the company with the most users. It will be the company with the most interesting users. To understand why, we need to look at what a prompt actually is.',

  recomposition: {
    heading: "Questions are compositional",
    intro:
      "A prompt is a question with a best-known answer. But questions aren't atomic — they decompose into smaller sub-questions, and a model that can answer the sub-questions can recombine them to answer novel questions no one has ever explicitly asked:",
    prompt:
      "Sub-questions you've already answered → Novel question becomes obvious",
    atoms: [
      "How does gluten develop in dough?",
      "What makes a sauce emulsify?",
      "How does altitude affect boiling point?",
      "Why does acid change protein texture?",
      "How does fat carry flavor?",
    ],
    novelQuestion:
      '"Why does my pasta sauce break when I cook at high altitude and add lemon juice at the wrong time?"',
    explanation:
      "No one ever asked this exact question — but if you can already answer each sub-question on the left, the answer assembles itself.",
    afterText:
      "This means the information value of a prompt depends entirely on the sub-questions it contains. A complex question from a domain expert decomposes into many novel sub-questions the model hasn't seen. A simple question from a casual user decomposes into sub-questions that are already saturated in the training data.",
  },

  decomposer: {
    intro:
      "Click below to see the difference in practice:",
    prompt: "Click a question to see its sub-questions",
    questions: [
      {
        text: '"How do I make my Rust async runtime play nicely with Python\'s GIL?"',
        atoms: [
          {
            text: "How does Rust's async/await actually schedule work?",
            type: "domain",
          },
          { text: "What does the Python GIL lock, exactly?", type: "domain" },
          {
            text: "How do you call Rust from Python across FFI?",
            type: "reasoning",
          },
          {
            text: "Can two event loops run in the same process?",
            type: "reasoning",
          },
          { text: "When is it safe to release the GIL?", type: "context" },
          {
            text: "Who owns the memory across the boundary?",
            type: "reasoning",
          },
          {
            text: "What happens to Tokio tasks when Python blocks?",
            type: "domain",
          },
        ],
      },
      {
        text: '"What\'s a good recipe for dinner tonight?"',
        atoms: [
          { text: "What do I feel like eating?", type: "context" },
          { text: "What's a popular recipe?", type: "factual" },
          { text: "How much time do I have?", type: "context" },
        ],
      },
    ],
    afterText:
      "The first question breaks into seven distinct sub-questions, each a real thing someone needs to understand independently. The second breaks into three — and they're already saturated in every model's training data. Same interaction, vastly different information value.",
  },

  pillar1: {
    heading: "Two inputs that matter",
    preamble:
      "Answers are cheap. Every large model shares roughly the same world knowledge from pretraining — given a question, any of them can reason through a response. The scarce inputs are elsewhere:",
    callout1:
      "1. A great distribution of questions — broad, diverse, covering the full landscape of what people actually need to know. Not a million copies of the same homework problem, but the long tail of hard, novel, domain-specific queries that map the frontier of human curiosity.",
    callout2:
      '2. "Expert" feedback on answers — and the quotes matter. Some answers are objectively right or wrong — an engineer knows when code doesn\'t compile. But other answers are matters of taste: does this prose resonate? Does this design feel right? Is this the kind of explanation that lands with this audience? The world of "experts" splits into those who judge correctness and those who judge resonance. A foundation model needs both — it needs the vocabulary to be preconditioned toward many different tastes, and those tastes are often easier to express as products and preferences than to describe in words.',
  },

  distribution: {
    heading: "Volume ≠ distribution",
    intro:
      "This is the uncomfortable truth for whoever dominates in raw user count. A hundred million users asking the same kinds of questions is a tall, narrow spike. What you actually want is coverage — a flat, wide distribution across the question space.",
    afterText:
      "ChatGPT dominates consumer adoption. But Claude has captured a disproportionate share of developers and technically sophisticated users — the people who ask hard questions across a wider band of the knowledge space, and who can tell when an answer is wrong. That combination of diverse questions plus expert feedback is precisely the data flywheel that compounds.",
    legend: {
      consumer: "High-volume consumer AI",
      sophisticated: "Sophisticated-user AI",
    },
  },

  flywheel: {
    nodes: [
      { label: "ATTRACT", text: "Expert users" },
      { label: "COLLECT", text: "Diverse questions" },
      { label: "EVALUATE", text: "Expert feedback" },
      { label: "IMPROVE", text: "Better model" },
    ],
  },

  defense: {
    heading: "Defending the flywheel",
    paragraphs: [
      "If the flywheel runs on prompt distribution, then the strategic imperative is clear: you must own the application layer, and you must prevent anyone else from extracting your prompt distribution through the model itself.",
      "This is exactly what we're seeing. Anthropic has been increasingly aggressive against distillation — restricting how Claude's outputs can be used to train competing models, limiting API access patterns that look like systematic extraction, and blocking Chinese AI labs from using Claude to bootstrap their own systems. OpenAI has pursued similar restrictions. These aren't arbitrary policies. They're direct consequences of understanding where the moat actually lives.",
      "The logic extends further: if your prompt distribution is your competitive advantage, you can't afford to let it leak through any channel. This is why the frontier labs are racing to own the application layer — building their own consumer products, IDE integrations, and enterprise platforms rather than being API-only companies. Every interaction that happens on someone else's platform is a prompt you don't collect and feedback you don't receive.",
    ],
  },

  openQuestion: {
    heading: "The open question",
    paragraphs: [
      "But this creates a tension. If the volume of users doesn't matter and the quality and diversity of users matter far more, then the flywheel depends on attracting and retaining exactly the kind of people who are least likely to accept lock-in.",
      "The most creative, technically sophisticated, and intellectually diverse users — the ones whose prompts are worth the most — are precisely the people who value independence, interoperability, and control over their tools. They're the ones who run their own infrastructure, who switch between tools freely, who resist walled gardens on principle. They're the ones who will leave if they feel captured.",
      "So the uncomfortable question for every frontier lab is: can you build a flywheel that depends on the best users without eventually driving them away by locking them in? Or does defending the flywheel inevitably poison it?",
    ],
  },

  footer: "Draft — work in progress",
};

// ============================================================
// STYLES
// ============================================================

const fontLink =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap";

const cssVarsBlock = `
  :root {
    --bg: #FAFAF7; --cardBg: #fff; --text: #1a1a1a; --textSecondary: #555;
    --textTertiary: #999; --textFaint: #bbb; --border: #e5e5e5;
    --borderLight: #e0e0e0; --gridLine: #e0e0e0; --axisLine: #ccc;
    --axisText: #aaa; --chartBarBg: #eee; --chartText: #666;
    --ns: #7A8B99; --bs: #4A7A62; --nsh: #B8860B; --bsh: #9B2335;
    --serif: 'Newsreader', 'Georgia', serif;
    --mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
  }
  .dark {
      --bg: #141413; --cardBg: #1e1e1c; --text: #e0ddd8; --textSecondary: #a8a49e;
      --textTertiary: #706c66; --textFaint: #504c47; --border: #333;
      --borderLight: #2a2a28; --gridLine: #2a2a28; --axisLine: #444;
      --axisText: #666; --chartBarBg: #2a2a28; --chartText: #888;
      --ns: #9BB0BF; --bs: #6BA88C; --nsh: #D4A832; --bsh: #C94460;
  }
`;

const styles: Record<string, any> = {
  article: {
    maxWidth: 680,
    margin: "4rem auto 6rem",
    fontFamily: "var(--serif)",
    lineHeight: 1.7,
    color: "var(--text)",
  },
  label: {
    fontFamily: "var(--mono)",
    fontSize: "0.7rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "var(--textTertiary)",
    marginBottom: "0.5rem",
  },
  h1: {
    fontFamily: "var(--serif)",
    fontWeight: 500,
    fontSize: "2.6rem",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    marginBottom: "0.4rem",
  },
  subtitle: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: "1.15rem",
    color: "var(--textSecondary)",
    marginBottom: "2.5rem",
    lineHeight: 1.5,
  },
  h2: {
    fontFamily: "var(--mono)",
    fontWeight: 600,
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--textSecondary)",
    marginTop: "3rem",
    marginBottom: "1rem",
    lineHeight: 1.3,
  },
  p: { marginBottom: "1.2rem" },
  callout: {
    borderLeft: "3px solid var(--nsh)",
    padding: "1rem 1.2rem",
    margin: "1.8rem 0",
    background: "var(--cardBg)",
    borderRadius: "0 6px 6px 0",
  },
  calloutP: {
    marginBottom: 0,
    color: "var(--textSecondary)",
    fontSize: "0.95rem",
  },
  card: {
    background: "var(--cardBg)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "1.5rem",
    margin: "2rem 0",
  },
  monoLabel: {
    fontFamily: "var(--mono)",
    fontSize: "0.78rem",
    color: "var(--textTertiary)",
    marginBottom: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  questionBox: (active) => ({
    fontFamily: "var(--serif)",
    fontSize: "1.1rem",
    fontStyle: "italic",
    color: "var(--text)",
    padding: "0.8rem 1rem",
    background: "var(--bg)",
    borderRadius: 6,
    border: `1px solid ${active ? "var(--nsh)" : "var(--borderLight)"}`,
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "border-color 0.2s",
    userSelect: "none",
  }),
  atomsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    minHeight: "2rem",
  },
  footer: {
    marginTop: "4rem",
    paddingTop: "2rem",
    borderTop: "1px solid var(--border)",
    fontSize: "0.85rem",
    color: "var(--textTertiary)",
  },
};

const ATOM_COLORS = {
  domain: { bg: "#4A7A6212", border: "var(--bs)", color: "var(--bs)" },
  reasoning: { bg: "#B8860B12", border: "var(--nsh)", color: "var(--nsh)" },
  context: { bg: "#9B233512", border: "var(--bsh)", color: "var(--bsh)" },
  factual: { bg: "#7A8B9912", border: "var(--ns)", color: "var(--ns)" },
};

// ============================================================
// COMPONENTS
// ============================================================

function Atom({ text, type, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const c = ATOM_COLORS[type] || ATOM_COLORS.factual;
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "0.72rem",
        padding: "0.35rem 0.7rem",
        borderRadius: 100,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {text}
    </span>
  );
}

function QuestionDecomposer() {
  const [activeQ, setActiveQ] = useState(-1);
  const { questions, prompt } = CONTENT.decomposer;

  return (
    <div style={styles.card}>
      <p style={styles.monoLabel}>{prompt}</p>
      {questions.map((q, i) => (
        <div
          key={i}
          onClick={() => setActiveQ(i)}
          style={styles.questionBox(activeQ === i)}
        >
          {q.text}
        </div>
      ))}
      <div style={styles.atomsContainer}>
        {activeQ >= 0 &&
          questions[activeQ].atoms.map((a, i) => (
            <Atom
              key={`${activeQ}-${i}`}
              text={a.text}
              type={a.type}
              delay={60 * i}
            />
          ))}
      </div>
    </div>
  );
}

function RecompositionDiagram() {
  const { prompt, atoms, novelQuestion, explanation } = CONTENT.recomposition;
  return (
    <div style={styles.card}>
      <p style={styles.monoLabel}>{prompt}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          {atoms.map((a, i) => (
            <div
              key={i}
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.72rem",
                padding: "0.4rem 0.7rem",
                borderRadius: 6,
                border: "1px solid var(--bs)",
                background: "#4A7A6210",
                color: "var(--bs)",
                textAlign: "center",
              }}
            >
              {a}
            </div>
          ))}
        </div>
        <div style={{ fontSize: "1.4rem", color: "var(--textFaint)" }}>→</div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: "0.95rem",
            color: "var(--text)",
            padding: "0.6rem 0.8rem",
            borderRadius: 6,
            border: "1px solid var(--bs)",
            background: "#4A7A6210",
            lineHeight: 1.4,
          }}
        >
          <em>{novelQuestion}</em>
          <br />
          <br />
          <span style={{ fontSize: "0.85rem", color: "var(--textSecondary)" }}>
            {explanation}
          </span>
        </div>
      </div>
    </div>
  );
}

function DistributionChart() {
  const canvasRef = useRef(null);
  const [view, setView] = useState("volume");
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const frameRef = useRef(null);

  const gaussian = (x, mean, std, amp) =>
    amp * Math.exp(-0.5 * ((x - mean) / std) ** 2);

  const draw = useCallback((progress) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width,
      h = rect.height;

    const cs = getComputedStyle(document.documentElement);
    const colors = {
      ns: cs.getPropertyValue("--ns").trim(),
      bs: cs.getPropertyValue("--bs").trim(),
      gridLine: cs.getPropertyValue("--gridLine").trim(),
    };

    ctx.clearRect(0, 0, w, h);
    const pL = 5,
      pR = 10,
      pT = 10,
      pB = 5;
    const pW = w - pL - pR,
      pH = h - pT - pB;

    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pT + (pH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pL, y);
      ctx.lineTo(pL + pW, y);
      ctx.stroke();
    }

    const drawCurve = (mean, std, amp, color) => {
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const t = i / 200,
          x = pL + t * pW;
        const y = pT + pH - gaussian(t, mean, std, amp) * pH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.lineTo(pL + pW, pT + pH);
      ctx.lineTo(pL, pT + pH);
      ctx.closePath();
      ctx.fillStyle = color + "20";
      ctx.fill();
    };

    const t = progress;
    drawCurve(0.22, 0.1 + t * 0.02, 0.85 * (1 - t * 0.35), colors.ns);
    drawCurve(0.52, 0.2 + t * 0.03, 0.32 + t * 0.28, colors.bs);
  }, []);

  const animate = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const step = () => {
      const diff = targetRef.current - progressRef.current;
      if (Math.abs(diff) < 0.005) {
        progressRef.current = targetRef.current;
        draw(progressRef.current);
        return;
      }
      progressRef.current += diff * 0.08;
      draw(progressRef.current);
      frameRef.current = requestAnimationFrame(step);
    };
    step();
  }, [draw]);

  useEffect(() => {
    draw(0);
    const onResize = () => draw(progressRef.current);
    window.addEventListener("resize", onResize);
    const observer = new MutationObserver(() => draw(progressRef.current));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [draw]);

  const setDistView = (v) => {
    setView(v);
    targetRef.current = v === "volume" ? 0 : 1;
    animate();
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--mono)",
    fontSize: "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    padding: "0.4rem 0.8rem",
    border: "none",
    cursor: "pointer",
    background: active ? "var(--text)" : "var(--bg)",
    color: active ? "var(--bg)" : "var(--textTertiary)",
    transition: "all 0.2s",
  });

  return (
    <div style={{ ...styles.card, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.2rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 500,
            fontSize: "1.05rem",
          }}
        >
          Question distribution
        </span>
        <div
          style={{
            display: "flex",
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          <button
            style={btnStyle(view === "volume")}
            onClick={() => setDistView("volume")}
          >
            Volume
          </button>
          <button
            style={btnStyle(view === "diversity")}
            onClick={() => setDistView("diversity")}
          >
            Diversity
          </button>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: 280 }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: "0.6rem",
          fontFamily: "var(--mono)",
          fontSize: "0.65rem",
          color: "var(--axisText)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.04em",
        }}
      >
        Question sophistication →
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.2rem",
          marginTop: "0.8rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { color: "var(--ns)", label: CONTENT.distribution.legend.consumer },
          {
            color: "var(--bs)",
            label: CONTENT.distribution.legend.sophisticated,
          },
        ].map((l) => (
          <div
            key={l.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontFamily: "var(--mono)",
              fontSize: "0.68rem",
              color: "var(--textSecondary)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: l.color,
              }}
            />
            <span>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlywheelDiagram() {
  const { nodes } = CONTENT.flywheel;
  const nodeColors = ["var(--bs)", "var(--nsh)", "var(--bsh)", "var(--ns)"];

  return (
    <div style={{ ...styles.card, textAlign: "center" }}>
      <svg
        viewBox="0 0 500 380"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: 460, margin: "0 auto", display: "block" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--textTertiary)" />
          </marker>
        </defs>
        <path
          d="M 250 60 Q 410 60, 410 190 Q 410 320, 250 320 Q 90 320, 90 190 Q 90 60, 250 60"
          fill="none"
          stroke="var(--borderLight)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />
        {/* Arrow segments */}
        <path
          d="M 315 64 Q 398 85, 408 155"
          fill="none"
          stroke="var(--textFaint)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 408 230 Q 395 310, 315 328"
          fill="none"
          stroke="var(--textFaint)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 185 328 Q 105 310, 92 235"
          fill="none"
          stroke="var(--textFaint)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 92 150 Q 105 75, 185 62"
          fill="none"
          stroke="var(--textFaint)"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        {/* Nodes */}
        {[
          { x: 170, y: 30, cx: 250 },
          { x: 340, y: 162, cx: 420 },
          { x: 170, y: 298, cx: 250 },
          { x: 0, y: 162, cx: 80 },
        ].map((pos, i) => (
          <g key={i}>
            <rect
              x={pos.x}
              y={pos.y}
              width="160"
              height="56"
              rx="8"
              fill="var(--cardBg)"
              stroke={nodeColors[i]}
              strokeWidth="1.5"
            />
            <text
              x={pos.cx}
              y={pos.y + 23}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="9"
              fill="var(--textTertiary)"
              letterSpacing="0.05em"
            >
              {nodes[i].label}
            </text>
            <text
              x={pos.cx}
              y={pos.y + 42}
              textAnchor="middle"
              fontFamily="var(--serif)"
              fontSize="13"
              fill="var(--text)"
            >
              {nodes[i].text}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============================================================
// MAIN POST
// ============================================================

export default function DataFlywheelPost() {
  return (
    <>
      <link rel="stylesheet" href={fontLink} />
      <style>{cssVarsBlock}</style>
      <div style={{ padding: "0 1.5rem", WebkitFontSmoothing: "antialiased" }}>
        <article style={styles.article}>
          <p style={styles.label}>{CONTENT.label}</p>
          <h1 style={styles.h1}>{CONTENT.title}</h1>
          <p style={styles.subtitle}>{CONTENT.subtitle}</p>

          {/* Intro + flywheel upfront */}
          <p style={styles.p}>
            {CONTENT.intro.split('"expert"').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <strong>"expert"</strong>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>

          <FlywheelDiagram />

          <p style={styles.p}>
            {CONTENT.introAfterFlywheel.split('"expert"').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <strong>"expert"</strong>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>

          {/* Questions are compositional */}
          <h2 style={styles.h2}>{CONTENT.recomposition.heading}</h2>
          <p style={styles.p}>{CONTENT.recomposition.intro}</p>
          <RecompositionDiagram />
          <p style={styles.p}>{CONTENT.recomposition.afterText}</p>

          <p style={styles.p}>{CONTENT.decomposer.intro}</p>
          <QuestionDecomposer />
          <p style={styles.p}>{CONTENT.decomposer.afterText}</p>

          {/* Two inputs that matter */}
          <h2 style={styles.h2}>{CONTENT.pillar1.heading}</h2>
          <p style={styles.p}>{CONTENT.pillar1.preamble}</p>

          <div style={styles.callout}>
            <p style={styles.calloutP}>
              <strong style={{ color: "var(--text)" }}>
                {CONTENT.pillar1.callout1.split(" — ")[0]} —
              </strong>{" "}
              {CONTENT.pillar1.callout1.split(" — ").slice(1).join(" — ")}
            </p>
          </div>

          <div style={{ ...styles.callout, borderLeftColor: "var(--bs)" }}>
            <p style={styles.calloutP}>
              <strong style={{ color: "var(--text)" }}>
                {CONTENT.pillar1.callout2.split(" — ")[0]} —
              </strong>{" "}
              {CONTENT.pillar1.callout2.split(" — ").slice(1).join(" — ")}
            </p>
          </div>

          {/* Volume ≠ distribution */}
          <h2 style={styles.h2}>{CONTENT.distribution.heading}</h2>
          <p style={styles.p}>{CONTENT.distribution.intro}</p>
          <DistributionChart />
          <p style={styles.p}>{CONTENT.distribution.afterText}</p>

          {/* Defending the flywheel */}
          <h2 style={styles.h2}>{CONTENT.defense.heading}</h2>
          {CONTENT.defense.paragraphs.map((p, i) => (
            <p key={i} style={styles.p}>{p}</p>
          ))}

          {/* The open question */}
          <h2 style={styles.h2}>{CONTENT.openQuestion.heading}</h2>
          {CONTENT.openQuestion.paragraphs.map((p, i) => (
            <p key={i} style={styles.p}>{p}</p>
          ))}

          <div style={styles.footer}>
            <p>{CONTENT.footer}</p>
          </div>
        </article>
      </div>
    </>
  );
}
