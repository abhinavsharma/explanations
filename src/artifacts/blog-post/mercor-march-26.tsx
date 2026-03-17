import { ArtifactStatus } from "@/components/artifact-wrapper";

export const artifactStatus = ArtifactStatus.PUBLISHED;
export const publishDate = "2026-03-16";
export const title = "Mercor's Hiring Page Is an Accidental Roadmap for AI";
export const subtitle =
  "What Mercor's job listings reveal about what models can't do yet";

import { useState, useEffect } from "react";

// ─── CONTENT (edit here) ────────────────────────────────────────────────────

const CONTENT = {
  title: "Mercor's Hiring Page Is an Accidental Roadmap for AI",
  subtitle: "What Mercor's job listings reveal about what models can't do yet",
  lede: `Mercor, a leading data-labeling platform for frontier AI, publishes what every type of expertise is worth—hourly, in the open. 75 active listings. 6,052 hires in the last 30 days. It's the most legible window we have into what AI cannot yet do that the model builders are eager to incorporate.`,

  sectionSWE: {
    heading: "Half of everything is code",
    body: `Software engineering is 49% of all hires—nearly 3,000 people in one month at ~$96/hr average. Aggregate hourly spend on SWE is 5× the next category.`,
    body2: `Coding models take high-level system descriptions and convert them into code. The system description—understanding users' problems, product judgment, the "what to build and why"—still comes from humans. That work has historically been split between PMs and engineers, but the split was always somewhat artificial. These numbers show AI absorbing the implementation half first, and at scale.`,
  },

  sectionPayVolume: {
    heading: "What pays most ≠ what hires most",
    body: `High volume is software engineers and multilingual generalists. High pay is niche expertise: cardiologists at $175/hr, litigation associates at $175/hr, equity research at $120/hr. The quadrant that's nearly empty—high pay and high volume—is where AI is most stuck.`,
    body2: `The high-pay roles share a trait: errors are catastrophic. A hallucinating cardiology model kills patients. A hallucinating legal model loses cases. The premium isn't just for knowledge—it's for the ability to verify the model got it right.`,
  },

  sectionTimeliness: {
    heading: "The half-life of useful knowledge",
    body: `Some knowledge is permanent—thermodynamics, the structure of a proof. Other knowledge is rotting as you read this: today's cybersecurity vulnerabilities, this quarter's regulatory landscape, current JavaScript frameworks.`,
    body2: `Volume doesn't track neatly with perishability, though. SWE dominates not because code expires fastest—marketing and fashion are more volatile—but because code is AI's primary output medium. Models write code, so they need code trainers. The deeper insight: perishability creates recurring demand. Static knowledge gets banked into weights once. A regulatory attorney tracking evolving compliance, a marketing consultant reading this month's algorithmic shifts—these roles can't be replaced by a single training run.`,
    callout: `Static knowledge gets absorbed into model weights. Perishable knowledge creates a subscription to human expertise.`,
  },

  sectionJobs: {
    heading: "Where humans stay valuable",
    body: `This data doesn't show AI replacing humans uniformly. It shows a market where your value depends on three axes:`,
    axes: [
      {
        label: "Scarcity",
        desc: "PhD physicists get a flat $73.29/hr regardless of subfield—commoditized. Cardiologists get $175/hr because there aren't enough of them.",
      },
      {
        label: "Perishability",
        desc: "Not which field changes fastest—marketing and fashion shift quicker than code. It's whether AI needs a one-time snapshot or an ongoing feed of current judgment.",
      },
      {
        label: "Error cost",
        desc: "Legal and medical expertise commands premiums because the cost of hallucination isn't embarrassment—it's liability.",
      },
    ],
    closing: `Where all three are high—scarce, perishable, high-stakes—humans remain most valuable. Where all three are low, roles are already being absorbed. Everyone else is on the gradient, and the gradient is moving.`,
  },

  methodNote: `Data: Mercor public job listings, March 2026. 75 listings, 6,052 hires in trailing month. Pay = hourly USD. Categories editorially assigned. "Implied spend" = hires × midpoint rate.`,
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "swe",
    label: "Software Engineering",
    hired: 2975,
    avgPay: 96.28,
    listings: 12,
  },
  {
    id: "lang",
    label: "Language & Generalist",
    hired: 1394,
    avgPay: 47.6,
    listings: 23,
  },
  {
    id: "science",
    label: "Hard Sciences (PhD)",
    hired: 634,
    avgPay: 80.12,
    listings: 12,
  },
  {
    id: "redteam",
    label: "AI Red-Teaming",
    hired: 473,
    avgPay: 53.07,
    listings: 10,
  },
  {
    id: "medical",
    label: "Medical & Clinical",
    hired: 272,
    avgPay: 70.85,
    listings: 3,
  },
  {
    id: "other",
    label: "Other Domain",
    hired: 236,
    avgPay: 42.5,
    listings: 11,
  },
  { id: "finance", label: "Finance", hired: 64, avgPay: 120.0, listings: 1 },
  { id: "legal", label: "Legal", hired: 4, avgPay: 153.33, listings: 3 },
];

const TOP_ROLES = [
  {
    title: "Software Engineering Expert",
    payMid: 100,
    hired: 1489,
    cat: "swe",
  },
  { title: "Software Expert (OS)", payMid: 100, hired: 408, cat: "swe" },
  {
    title: "Clinical Research (Chem & Bio)",
    payMid: 80,
    hired: 297,
    cat: "science",
  },
  {
    title: "Software Expert (Scientific)",
    payMid: 100,
    hired: 267,
    cat: "swe",
  },
  {
    title: "Generalist — English & Japanese",
    payMid: 36,
    hired: 260,
    cat: "lang",
  },
  {
    title: "Generalist — English & Italian",
    payMid: 36,
    hired: 252,
    cat: "lang",
  },
  {
    title: "Software Expert (Dev & Programming)",
    payMid: 65,
    hired: 226,
    cat: "swe",
  },
  { title: "Software Expert (CAD & Eng)", payMid: 100, hired: 222, cat: "swe" },
  { title: "Medical Admin Survey", payMid: 42, hired: 213, cat: "medical" },
  {
    title: "Generalist — English & Mandarin",
    payMid: 36,
    hired: 207,
    cat: "lang",
  },
  {
    title: "Generalist — English & Korean",
    payMid: 36,
    hired: 193,
    cat: "lang",
  },
  {
    title: "Generalist — English & Hindi",
    payMid: 12,
    hired: 187,
    cat: "lang",
  },
  { title: "Cardiologist", payMid: 175, hired: 59, cat: "medical" },
  { title: "Equity Research Expert", payMid: 120, hired: 64, cat: "finance" },
  { title: "Litigation Associate", payMid: 175, hired: 2, cat: "legal" },
  {
    title: "Transactional / Regulatory Associate",
    payMid: 175,
    hired: 2,
    cat: "legal",
  },
];

// halfLife in approximate months
const HALFLIFE_DATA = [
  { label: "Cybersecurity", hired: 96, pay: 65, halfLife: 1, cat: "swe" },
  {
    label: "Equity Research",
    hired: 64,
    pay: 120,
    halfLife: 1,
    cat: "finance",
  },
  { label: "AI Red-Teaming", hired: 473, pay: 53, halfLife: 3, cat: "redteam" },
  { label: "SWE (general)", hired: 1489, pay: 100, halfLife: 6, cat: "swe" },
  { label: "SWE (Dev Tools)", hired: 226, pay: 65, halfLife: 6, cat: "swe" },
  { label: "SWE (OS)", hired: 408, pay: 100, halfLife: 12, cat: "swe" },
  { label: "SWE (Scientific)", hired: 267, pay: 100, halfLife: 12, cat: "swe" },
  { label: "SWE (CAD/Eng)", hired: 222, pay: 100, halfLife: 12, cat: "swe" },
  { label: "Image RL", hired: 103, pay: 52, halfLife: 6, cat: "other" },
  { label: "Bioinformatics", hired: 54, pay: 72, halfLife: 18, cat: "science" },
  {
    label: "Clinical Research",
    hired: 297,
    pay: 80,
    halfLife: 24,
    cat: "science",
  },
  { label: "Cardiology", hired: 59, pay: 175, halfLife: 36, cat: "medical" },
  { label: "Litigation", hired: 2, pay: 175, halfLife: 12, cat: "legal" },
  {
    label: "Environmental Sci",
    hired: 47,
    pay: 50,
    halfLife: 36,
    cat: "other",
  },
  { label: "Biology (PhD)", hired: 46, pay: 73, halfLife: 60, cat: "science" },
  {
    label: "Chemistry (PhD)",
    hired: 19,
    pay: 73,
    halfLife: 60,
    cat: "science",
  },
  {
    label: "Physics (all)",
    hired: 155,
    pay: 77,
    halfLife: 120,
    cat: "science",
  },
  { label: "Math (PhD)", hired: 30, pay: 73, halfLife: 240, cat: "science" },
];

// ─── THEME ──────────────────────────────────────────────────────────────────

const THEME = {
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
    quadTint: "08",
    pointStroke: "#fff",
    fadedOpacity: 0.12,
    toggleBg: "#e5e5e5",
    toggleKnob: "#fff",
    chartBarBg: "#eee",
    chartText: "#666",
    ns: "#7A8B99",
    bs: "#4A7A62",
    nsh: "#B8860B",
    bsh: "#9B2335",
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
    quadTint: "12",
    pointStroke: "#1e1e1c",
    fadedOpacity: 0.08,
    toggleBg: "#333",
    toggleKnob: "#e0ddd8",
    chartBarBg: "#2a2a28",
    chartText: "#888",
    ns: "#9BB0BF",
    bs: "#6BA88C",
    nsh: "#D4A832",
    bsh: "#C94460",
  },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function useTheme() {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return [THEME[mode], mode] as const;
}

const CAT_COLORS = {
  swe: "nsh",
  lang: "ns",
  science: "bs",
  redteam: "nsh",
  medical: "bsh",
  other: "ns",
  finance: "bsh",
  legal: "bsh",
};
function catColor(catId, t) {
  return t[CAT_COLORS[catId] || "ns"];
}
function fmt(n) {
  return n >= 1000
    ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : String(n);
}

// ─── VERTICAL SPEND CHART ───────────────────────────────────────────────────

function SpendChart({ t }) {
  const total = CATEGORIES.reduce((s, c) => s + c.hired * c.avgPay, 0);
  const sorted = [...CATEGORIES].sort(
    (a, b) => b.hired * b.avgPay - a.hired * a.avgPay,
  );
  const maxSpend = sorted[0].hired * sorted[0].avgPay;
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {sorted.map((c) => {
        const spend = c.hired * c.avgPay;
        const pct = (spend / total) * 100;
        const barPct = (spend / maxSpend) * 100;
        const col = catColor(c.id, t);
        const isH = hovered === c.id;
        const dimmed = hovered !== null && !isH;

        return (
          <div
            key={c.id}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "170px 1fr 72px",
              alignItems: "center",
              gap: 12,
              padding: "7px 0",
              opacity: dimmed ? 0.3 : 1,
              transition: "opacity 0.15s",
              cursor: "default",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: t.text,
                  lineHeight: 1.3,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  color: t.textTertiary,
                  lineHeight: 1.4,
                }}
              >
                {fmt(c.hired)} hired · ${c.avgPay.toFixed(0)}/hr
              </div>
            </div>

            <div style={{ position: "relative", height: 26 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: t.chartBarBg,
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${barPct}%`,
                  borderRadius: 4,
                  background: col,
                  opacity: isH ? 1 : 0.78,
                  transition: "width 0.3s ease, opacity 0.15s",
                }}
              />
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: isH ? t.text : t.textTertiary,
                fontWeight: isH ? 600 : 400,
                transition: "color 0.15s",
                textAlign: "right",
              }}
            >
              {pct.toFixed(1)}%
            </div>
          </div>
        );
      })}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: t.textFaint,
          textAlign: "right",
          marginTop: 4,
        }}
      >
        share of ${Math.round(total).toLocaleString()}/hr aggregate spend
      </div>
    </div>
  );
}

// ─── PAY VS VOLUME SCATTER ──────────────────────────────────────────────────

function PayVolumeScatter({ t }) {
  const PAD = { top: 20, right: 30, bottom: 44, left: 56 };
  const W = 700,
    H = 400;
  const iW = W - PAD.left - PAD.right,
    iH = H - PAD.top - PAD.bottom;
  const maxHired = 1600,
    maxPay = 200;

  const scaleX = (v) => PAD.left + (Math.min(v, maxHired) / maxHired) * iW;
  const scaleY = (v) => PAD.top + iH - (Math.min(v, maxPay) / maxPay) * iH;
  const radius = (hired) => Math.max(4, Math.min(22, Math.sqrt(hired) * 0.6));

  const [hovered, setHovered] = useState(null);
  const midX = scaleX(200),
    midY = scaleY(90);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {[0, 400, 800, 1200, 1600].map((v) => (
        <line
          key={`gx${v}`}
          x1={scaleX(v)}
          x2={scaleX(v)}
          y1={PAD.top}
          y2={PAD.top + iH}
          stroke={t.gridLine}
          strokeWidth={1}
        />
      ))}
      {[0, 50, 100, 150, 200].map((v) => (
        <line
          key={`gy${v}`}
          x1={PAD.left}
          x2={PAD.left + iW}
          y1={scaleY(v)}
          y2={scaleY(v)}
          stroke={t.gridLine}
          strokeWidth={1}
        />
      ))}
      <rect
        x={midX}
        y={PAD.top}
        width={PAD.left + iW - midX}
        height={midY - PAD.top}
        fill={t.bsh}
        opacity={0.04}
        rx={4}
      />
      <text
        x={midX + 8}
        y={PAD.top + 16}
        fontSize={10}
        fill={t.textTertiary}
        fontFamily="'JetBrains Mono', monospace"
      >
        high pay + high volume = AI most stuck
      </text>
      {[0, 400, 800, 1200, 1600].map((v) => (
        <text
          key={`lx${v}`}
          x={scaleX(v)}
          y={PAD.top + iH + 18}
          textAnchor="middle"
          fontSize={10}
          fill={t.axisText}
          fontFamily="'JetBrains Mono', monospace"
        >
          {v}
        </text>
      ))}
      {[0, 50, 100, 150, 200].map((v) => (
        <text
          key={`ly${v}`}
          x={PAD.left - 8}
          y={scaleY(v) + 4}
          textAnchor="end"
          fontSize={10}
          fill={t.axisText}
          fontFamily="'JetBrains Mono', monospace"
        >
          ${v}
        </text>
      ))}
      <text
        x={W / 2}
        y={H - 2}
        textAnchor="middle"
        fontSize={11}
        fill={t.textTertiary}
        fontFamily="'JetBrains Mono', monospace"
      >
        people hired (last month)
      </text>
      <text
        x={14}
        y={H / 2}
        textAnchor="middle"
        fontSize={11}
        fill={t.textTertiary}
        fontFamily="'JetBrains Mono', monospace"
        transform={`rotate(-90, 14, ${H / 2})`}
      >
        midpoint pay ($/hr)
      </text>

      {TOP_ROLES.map((r, i) => {
        const cx = scaleX(r.hired),
          cy = scaleY(r.payMid),
          rad = radius(r.hired);
        const col = catColor(r.cat, t);
        const isH = hovered === i;
        return (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "default" }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={isH ? rad + 3 : rad}
              fill={col}
              opacity={hovered !== null && !isH ? 0.2 : 0.85}
              stroke={t.pointStroke}
              strokeWidth={1.5}
              style={{ transition: "all 0.15s" }}
            />
            {isH &&
              (() => {
                const labelW = Math.max(r.title.length * 6.5 + 20, 190);
                const goLeft = cx + rad + labelW + 16 > W;
                const goUp = cy - 30 < PAD.top;
                const lx = goLeft ? cx - rad - labelW - 10 : cx + rad + 8;
                const ly = goUp ? cy + rad + 6 : cy - 28;
                return (
                  <g>
                    <rect
                      x={lx}
                      y={ly}
                      width={labelW}
                      height={42}
                      rx={5}
                      fill={t.cardBg}
                      stroke={t.border}
                      strokeWidth={1}
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
                      }}
                    />
                    <text
                      x={lx + 10}
                      y={ly + 16}
                      fontSize={11.5}
                      fill={t.text}
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight={600}
                    >
                      {r.title}
                    </text>
                    <text
                      x={lx + 10}
                      y={ly + 32}
                      fontSize={10.5}
                      fill={t.textSecondary}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      ${r.payMid}/hr · {r.hired.toLocaleString()} hired
                    </text>
                  </g>
                );
              })()}
          </g>
        );
      })}
    </svg>
  );
}

// ─── KNOWLEDGE HALF-LIFE CHART ──────────────────────────────────────────────

function HalfLifeChart({ t }) {
  const PAD = { top: 32, right: 24, bottom: 52, left: 56 };
  const W = 700,
    H = 420;
  const iW = W - PAD.left - PAD.right,
    iH = H - PAD.top - PAD.bottom;

  const logMin = Math.log(0.7),
    logMax = Math.log(320);
  const scaleX = (months) =>
    PAD.left + ((Math.log(months) - logMin) / (logMax - logMin)) * iW;
  const scaleY = (pay) => PAD.top + iH - ((pay - 30) / (190 - 30)) * iH;
  const radius = (hired) => Math.max(5, Math.min(38, Math.sqrt(hired) * 0.55));

  const [hovered, setHovered] = useState(null);

  const timeMarkers = [
    { months: 1, label: "1 mo" },
    { months: 3, label: "3 mo" },
    { months: 6, label: "6 mo" },
    { months: 12, label: "1 yr" },
    { months: 24, label: "2 yr" },
    { months: 60, label: "5 yr" },
    { months: 120, label: "10 yr" },
    { months: 240, label: "20 yr" },
  ];
  const payTicks = [50, 75, 100, 125, 150, 175];

  const zoneX2 = scaleX(12);
  const zoneX3 = scaleX(48);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* Zone shading */}
      <rect
        x={PAD.left}
        y={PAD.top}
        width={zoneX2 - PAD.left}
        height={iH}
        fill={t.bsh}
        opacity={0.04}
        rx={3}
      />
      <rect
        x={zoneX3}
        y={PAD.top}
        width={PAD.left + iW - zoneX3}
        height={iH}
        fill={t.bs}
        opacity={0.04}
        rx={3}
      />
      {/* Zone labels */}
      <text
        x={PAD.left + (zoneX2 - PAD.left) / 2}
        y={PAD.top + 14}
        textAnchor="middle"
        fontSize={9}
        fill={t.bsh}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={600}
        opacity={0.65}
      >
        FAST-EXPIRING
      </text>
      <text
        x={zoneX3 + (PAD.left + iW - zoneX3) / 2}
        y={PAD.top + 14}
        textAnchor="middle"
        fontSize={9}
        fill={t.bs}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={600}
        opacity={0.65}
      >
        DURABLE
      </text>
      {/* Grid */}
      {timeMarkers.map(({ months, label }) => (
        <g key={months}>
          <line
            x1={scaleX(months)}
            x2={scaleX(months)}
            y1={PAD.top}
            y2={PAD.top + iH}
            stroke={t.gridLine}
            strokeWidth={1}
          />
          <text
            x={scaleX(months)}
            y={PAD.top + iH + 18}
            textAnchor="middle"
            fontSize={10}
            fill={t.axisText}
            fontFamily="'JetBrains Mono', monospace"
          >
            {label}
          </text>
        </g>
      ))}
      {payTicks.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={PAD.left + iW}
            y1={scaleY(v)}
            y2={scaleY(v)}
            stroke={t.gridLine}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 8}
            y={scaleY(v) + 4}
            textAnchor="end"
            fontSize={10}
            fill={t.axisText}
            fontFamily="'JetBrains Mono', monospace"
          >
            ${v}
          </text>
        </g>
      ))}
      {/* Axis labels */}
      <text
        x={W / 2}
        y={H - 4}
        textAnchor="middle"
        fontSize={11}
        fill={t.textTertiary}
        fontFamily="'JetBrains Mono', monospace"
      >
        knowledge half-life →
      </text>
      <text
        x={12}
        y={H / 2}
        textAnchor="middle"
        fontSize={11}
        fill={t.textTertiary}
        fontFamily="'JetBrains Mono', monospace"
        transform={`rotate(-90, 12, ${H / 2})`}
      >
        pay ($/hr)
      </text>

      {/* Bubbles */}
      {HALFLIFE_DATA.map((d, i) => {
        const cx = scaleX(d.halfLife);
        const cy = scaleY(d.pay);
        const r = radius(d.hired);
        const col = catColor(d.cat, t);
        const isH = hovered === i;
        const dimmed = hovered !== null && !isH;
        return (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "default" }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={isH ? r + 3 : r}
              fill={col}
              opacity={dimmed ? 0.12 : 0.65}
              stroke={isH ? col : t.pointStroke}
              strokeWidth={isH ? 2 : 1}
              style={{ transition: "all 0.15s" }}
            />
            {/* Inline count on large bubbles */}
            {!dimmed && r > 14 && !isH && (
              <text
                x={cx}
                y={cy + 1}
                textAnchor="middle"
                fontSize={9.5}
                fill={t.pointStroke}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={700}
                style={{ pointerEvents: "none" }}
              >
                {fmt(d.hired)}
              </text>
            )}
            {isH &&
              (() => {
                const hlLabel =
                  d.halfLife >= 12
                    ? `~${Math.round(d.halfLife / 12)} yr`
                    : `~${d.halfLife} mo`;
                const tw = 220;
                const goLeft = cx + r + tw + 14 > W;
                const lx = goLeft ? cx - r - tw - 10 : cx + r + 10;
                const ly = Math.max(
                  PAD.top,
                  Math.min(cy - 28, PAD.top + iH - 54),
                );
                return (
                  <g>
                    <rect
                      x={lx}
                      y={ly}
                      width={tw}
                      height={50}
                      rx={5}
                      fill={t.cardBg}
                      stroke={t.border}
                      strokeWidth={1}
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
                      }}
                    />
                    <text
                      x={lx + 10}
                      y={ly + 19}
                      fontSize={12}
                      fill={t.text}
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight={700}
                    >
                      {d.label}
                    </text>
                    <text
                      x={lx + 10}
                      y={ly + 37}
                      fontSize={10.5}
                      fill={t.textSecondary}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      ${d.pay}/hr · {d.hired.toLocaleString()} hired · {hlLabel}{" "}
                      half-life
                    </text>
                  </g>
                );
              })()}
          </g>
        );
      })}
      {/* Size legend */}
      <g transform={`translate(${W - 110}, ${PAD.top + 30})`}>
        <text
          x={0}
          y={-4}
          fontSize={9}
          fill={t.textFaint}
          fontFamily="'JetBrains Mono', monospace"
        >
          bubble = hires
        </text>
        {[50, 500, 1500].map((v, j) => {
          const r = radius(v);
          const cy = 14 + j * 26;
          return (
            <g key={v}>
              <circle
                cx={14}
                cy={cy}
                r={r}
                fill={t.chartBarBg}
                stroke={t.borderLight}
                strokeWidth={1}
              />
              <text
                x={36}
                y={cy + 4}
                fontSize={9}
                fill={t.textFaint}
                fontFamily="'JetBrains Mono', monospace"
              >
                {fmt(v)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ─── VALUE AXES ─────────────────────────────────────────────────────────────

function ValueAxes({ t }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginTop: 4,
      }}
    >
      {CONTENT.sectionJobs.axes.map((a, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            padding: "16px 20px",
            borderRadius: 6,
            background: t.cardBg,
            borderLeft: `3px solid ${t.border}`,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 13,
              color: t.textSecondary,
              whiteSpace: "nowrap",
              minWidth: 100,
              paddingTop: 1,
            }}
          >
            {a.label}
          </div>
          <div
            style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 15.5,
              lineHeight: 1.55,
              color: t.text,
            }}
          >
            {a.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function PriceOfKnowing() {
  const [t] = useTheme();

  const prose: Record<string, any> = {
    fontFamily: "'Newsreader', serif",
    fontSize: 17,
    lineHeight: 1.72,
    color: t.text,
    maxWidth: 640,
  };
  const h2: Record<string, any> = {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: t.textSecondary,
    marginTop: 56,
    marginBottom: 16,
  };
  const callout = {
    fontFamily: "'Newsreader', serif",
    fontSize: 16,
    lineHeight: 1.6,
    fontStyle: "italic",
    color: t.textSecondary,
    borderLeft: `3px solid ${t.border}`,
    paddingLeft: 20,
    margin: "28px 0",
  };
  const card = {
    background: t.cardBg,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    padding: 24,
    margin: "28px 0",
  };
  const label: Record<string, any> = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: t.textTertiary,
    marginBottom: 12,
  };

  return (
    <div style={{ padding: "48px 24px 80px", transition: "color 0.3s" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: 42,
              lineHeight: 1.15,
              color: t.text,
              marginBottom: 8,
              letterSpacing: "-0.01em",
            }}
          >
            {CONTENT.title}
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: t.textTertiary,
              marginBottom: 32,
            }}
          >
            {CONTENT.subtitle}
          </p>
          <p style={prose}>{CONTENT.lede}</p>
        </header>

        {/* I. SWE dominance */}
        <section>
          <h2 style={h2}>{CONTENT.sectionSWE.heading}</h2>
          <p style={prose}>{CONTENT.sectionSWE.body}</p>
          <div style={card}>
            <div style={label}>
              Implied hourly spend by category (hires × avg rate)
            </div>
            <SpendChart t={t} />
          </div>
          <p style={prose}>{CONTENT.sectionSWE.body2}</p>
        </section>

        {/* II. Pay vs Volume */}
        <section>
          <h2 style={h2}>{CONTENT.sectionPayVolume.heading}</h2>
          <p style={prose}>{CONTENT.sectionPayVolume.body}</p>
          <div style={card}>
            <div style={label}>Pay vs. hiring volume — hover for details</div>
            <PayVolumeScatter t={t} />
          </div>
          <p style={prose}>{CONTENT.sectionPayVolume.body2}</p>
        </section>

        {/* III. Knowledge half-life */}
        <section>
          <h2 style={h2}>{CONTENT.sectionTimeliness.heading}</h2>
          <p style={prose}>{CONTENT.sectionTimeliness.body}</p>
          <div style={card}>
            <div style={label}>
              Knowledge half-life vs. pay — bubble size = hiring volume
            </div>
            <HalfLifeChart t={t} />
          </div>
          <p style={prose}>{CONTENT.sectionTimeliness.body2}</p>
          <blockquote style={{ ...callout, borderColor: t.bs }}>
            {CONTENT.sectionTimeliness.callout}
          </blockquote>
        </section>

        {/* IV. Jobs */}
        <section>
          <h2 style={h2}>{CONTENT.sectionJobs.heading}</h2>
          <p style={prose}>{CONTENT.sectionJobs.body}</p>
          <ValueAxes t={t} />
          <p style={{ ...prose, marginTop: 28 }}>
            {CONTENT.sectionJobs.closing}
          </p>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: `1px solid ${t.border}`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            lineHeight: 1.65,
            color: t.textTertiary,
          }}
        >
          {CONTENT.methodNote}
        </footer>
      </div>
    </div>
  );
}
