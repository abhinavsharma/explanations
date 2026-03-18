import { ArtifactStatus } from "@/components/artifact-wrapper";

export const artifactStatus = ArtifactStatus.PUBLISHED;
export const publishDate = "2026-02-14";
export const title = "The Internet Is a Supply Chain";
export const subtitle = "And it's running out of raw material";

import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   CONTENT — all text + data lives here; rendering logic below
   ═══════════════════════════════════════════════════════════════ */

const CONTENT = {
  title: "The Internet Is a Supply Chain",
  subtitle: "And it's running out of raw material",
  intro: `For two decades, the internet ran on a quiet bargain. People wrote thoughtful things about topics they cared about—for free—and shared them openly. Programmers explained obscure bugs on Stack Overflow. Doctors corrected medical myths on personal blogs. Historians contextualized primary sources on Wikipedia. Hobbyists documented niche repair procedures in forum posts nobody asked for.`,
  intro2: `This wasn't charity. It was an ecosystem. You wrote something good, people found it through search, some fraction of them stuck around, and the accumulated attention could be converted into reputation, career opportunities, ad revenue, or just the satisfaction of being useful. The supply chain of human knowledge on the internet was built on this feedback loop.`,
  intro3: `That loop is breaking.`,

  motivations: [
    { motive: "Reputation / career building", era: "Strong in academic & technical circles. A great blog post could land you a job.", erosion: "LLMs synthesize your expertise without attribution. Traffic to the source collapses. The signal-to-credential pipeline weakens.", status: "eroding" },
    { motive: "Ad revenue", era: "Display ads funded millions of niche content creators. CPMs were livable.", erosion: "Top 10 ad companies capture 80% of digital ad spend. Programmatic CPMs down 17–33%. Independent publishers starved.", status: "broken", sources: ["marketingCharts", "adapex"] },
    { motive: "Generosity / public good", era: "Wikipedia, Stack Overflow, personal blogs. People shared because it felt right.", erosion: "Still exists but the hostile social environment + context collapse discourages public sharing. 46% of Americans don't feel free to speak their mind.", status: "eroding" },
    { motive: "Content marketing", era: "Genuine knowledge as a funnel for products/services. Massive volume of useful-if-commercial content.", erosion: "Zero-click answers break the funnel. If nobody visits the page, the upsell never happens. The 'distraction bargain' collapses.", status: "eroding" },
    { motive: "Community & belonging", era: "Forums, subreddits, comment sections fostered real exchange between practitioners.", erosion: "Migrating to Discord, group chats, private Slacks. Still happens—but now invisible to search and to LLM training.", status: "migrating", sources: ["darkForest"] },
    { motive: "SEO / discovery", era: "Writing publicly meant being found. Google was the distribution layer.", erosion: "96.55% of pages get zero Google traffic. AI Overviews cut click-through by 47%. Publisher Google traffic down 33–38% in one year.", status: "broken", sources: ["ahrefs", "pewAIO", "pressGazette"] },
  ],

  spectrum: [
    { label: "Pure knowledge sharing", description: "Intrinsically motivated. Written to help or document. No monetization.", examples: "Stack Overflow answers, Wikipedia edits, personal technical blogs, forum how-tos", color: "bs", threat: "high", threatNote: "Creators get zero return as LLMs absorb and resynthesize. Traffic and reputation signals collapse." },
    { label: "Content marketing", description: "Genuinely useful content that exists to capture attention and funnel toward a product.", examples: "Tutorial-to-bootcamp funnels, 'ultimate guides' for SaaS, recipe blogs with affiliate links", color: "nsh", threat: "high", threatNote: "The distraction bargain breaks when AI provides the answer without the visit. No visit, no upsell." },
    { label: "Ad-supported journalism", description: "Professional reporting funded by display advertising and programmatic ad networks.", examples: "Local news, trade publications, niche reporting, investigative journalism", color: "ns", threat: "critical", threatNote: "3,300+ US newspapers closed since 2005. CPMs cratering. AI Overviews eliminate the click entirely." },
    { label: "FOMO clickbait", description: "Designed to maximize impressions through emotional triggers. Low information density.", examples: "Made-for-advertising sites, listicles, rage-bait, engagement farming", color: "bsh", threat: "low", threatNote: "Good riddance. Never honest knowledge. ~$17.8B/year in ad spend on junk content the market won't miss." },
  ],

  migrationChannels: [
    { label: "Personal blogs & websites", direction: "shrinking", where: "open web", note: "96.55% get zero Google traffic. Discovery broken." },
    { label: "Public forums & Q&A", direction: "collapsing", where: "open web", note: "Stack Overflow questions down 76%. Reddit licensing its own corpus." },
    { label: "Social media (public posts)", direction: "shrinking", where: "open web", note: "Context collapse + cancel culture pushing people off public platforms." },
    { label: "Content marketing", direction: "shrinking", where: "open web", note: "Zero-click answers break the attention-to-conversion funnel." },
    { label: "Wiki / open reference", direction: "stable", where: "open web", note: "Wikipedia pageviews down but contributor base holding. Fragile." },
    { label: "Group chats & DMs", direction: "growing", where: "dark", note: "Invisible to search, LLMs, and the knowledge commons." },
    { label: "Discord / private communities", direction: "growing", where: "dark", note: "200M+ monthly users. Average server is 5–20 people. Digital living rooms." },
    { label: "Paid newsletters (Substack etc.)", direction: "growing", where: "semi-open", note: "50M+ active subscriptions. Paywalled but indexable." },
    { label: "Books & long-form (offline)", direction: "growing", where: "dark", note: "Higher commitment, higher quality, but zero LLM accessibility." },
    { label: "Not written down at all", direction: "growing", where: "lost", note: "Activation energy too high. Knowledge stays in someone's head." },
  ],

  dataQuality: {
    intrinsic: { label: "Knowledge from intrinsic motivation", traits: ["Written by someone who cares about the topic", "Validated by community (upvotes, peer review, reputation)", "Corrected over time through public discourse", "Depth reflects genuine expertise", "Motivated by curiosity, reputation, generosity"] },
    extrinsic: { label: "Knowledge from paid annotation", traits: ["Written by someone paid $1–12/hour", "Validated by inter-rater agreement (gaming incentive)", "Quality degrades under throughput pressure", "Depth reflects minimum threshold to pass QA", "Motivated by hourly wages and task quotas"] },
  },

  knowledgeAxis: [
    { type: "Timeless knowledge", examples: "How TCP/IP works. How to tie a bowline. The proof of Bayes' theorem. What causes soil erosion.", prognosis: "Will remain publicly available. Information wants to be free, and people with deep understanding are intrinsically motivated to share explanations that last. The incentive structure for timeless content is damaged but not destroyed—reputation still accrues, and the content has a long tail.", color: "bs" },
    { type: "Timely knowledge", examples: "What the Fed decided yesterday. Which API endpoint changed in the latest release. Current competitive intelligence. Breaking investigative journalism.", prognosis: "Most at risk. Timely information is high-alpha: it's valuable precisely because it's fresh, and freshness requires ongoing human effort with ongoing costs. This is the content whose economics are most directly broken by zero-click AI answers and whose production most depends on the ad/subscription revenue that's collapsing.", color: "bsh" },
    { type: "Tacit / experiential knowledge", examples: "What it's actually like to manage a team of 50. How a specific production system fails under load. The unwritten rules of a niche industry.", prognosis: "Retreating into private spaces. This was always the hardest to elicit publicly—it requires vulnerability, specificity, and trust. As the internet becomes more hostile, this knowledge migrates to group chats, private Slacks, and 1:1 conversations. It may be the most valuable category and the least recoverable.", color: "nsh" },
  ],

  sources: {
    pressGazette: { label: "Press Gazette", year: 2026, detail: "Global publisher Google traffic dropped by a third in 2025" },
    ppcStackOverflow: { label: "PPC Land", year: 2025, detail: "Stack Overflow traffic collapses as AI tools reshape developer workflows" },
    pewAIO: { label: "Pew Research Center", year: 2025, detail: "AI Overviews click-through study — 68,879 searches, 900 US adults" },
    marketingCharts: { label: "MarketingCharts", year: 2025, detail: "Top 10 digital ad companies capture 79.8% of US ad spend" },
    adapex: { label: "Adapex", year: 2025, detail: "Programmatic CPMs down 17% YoY, display CPMs down 33%" },
    ahrefs: { label: "Ahrefs", year: 2024, detail: "96.55% of web pages receive zero organic Google traffic" },
    searchEngineLand: { label: "Search Engine Land", year: 2025, detail: "Publishers expect 43% search traffic decline over 3 years" },
    wikipedia: { label: "Yahoo / Wikimedia", year: 2025, detail: "Wikipedia human pageviews down ~8% YoY, 23% over 3 years" },
    natureCitations: { label: "Nature Communications", year: 2025, detail: "50–90% of LLM responses not fully supported by cited sources" },
    northwesternNews: { label: "Northwestern / Medill", year: 2024, detail: "3,300+ US newspapers lost since 2005; 55M in news deserts" },
    scaleAI: { label: "Inc / Futurism", year: 2025, detail: "Scale AI Bulba program flooded with spam and fabricated credentials" },
    timeKenya: { label: "TIME", year: 2023, detail: "OpenAI/Sama workers in Kenya paid $1.32–2/hour for data labeling" },
    redditDeals: { label: "CJR / TechCrunch", year: 2024, detail: "Reddit: $60M/yr Google, ~$70M/yr OpenAI; $203M total 2024" },
    similarweb: { label: "SparkToro / Similarweb", year: 2025, detail: "Zero-click searches rose from 56% to 69%, May 2024–2025" },
    darkForest: { label: "Maggie Appleton", year: 2023, detail: "The Dark Forest and Generative AI — cozy web retreat" },
    natureCollapse: { label: "Nature / Shumailov et al.", year: 2024, detail: "AI models collapse when trained on recursively generated data" },
    kevinLu: { label: "Kevin Lu", year: 2025, detail: "'The Only Important Technology Is The Internet' — kevinlu.ai" },
    fortuneAds: { label: "Fortune", year: 2023, detail: "~$17.8B/year flows to made-for-advertising junk sites" },
  },
};

/* ═══════════════════════════════════════════════════════════════ */
const THEME = {
  light: { bg: "#FAFAF7", cardBg: "#fff", text: "#1a1a1a", textSecondary: "#555", textTertiary: "#999", textFaint: "#bbb", border: "#e5e5e5", borderLight: "#e0e0e0", chartBarBg: "#eee", toggleBg: "#e5e5e5", toggleKnob: "#fff" },
  dark: { bg: "#141413", cardBg: "#1e1e1c", text: "#e0ddd8", textSecondary: "#a8a49e", textTertiary: "#706c66", textFaint: "#504c47", border: "#333", borderLight: "#2a2a28", chartBarBg: "#2a2a28", toggleBg: "#333", toggleKnob: "#e0ddd8" },
};
const QUAD = { light: { ns: "#7A8B99", bs: "#4A7A62", nsh: "#B8860B", bsh: "#9B2335" }, dark: { ns: "#9BB0BF", bs: "#6BA88C", nsh: "#D4A832", bsh: "#C94460" } };
const isDk = (t: typeof THEME.light) => t.bg === "#141413";

const ThemeCtx = createContext<any>(null);
const useTheme = () => useContext(ThemeCtx);

/* ═══════════════════════════════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function Cite({ id }: { id: string }) {
  const { t } = useTheme();
  const [show, setShow] = useState(false);
  const src = CONTENT.sources[id as keyof typeof CONTENT.sources]; if (!src) return null;
  return (<span style={{ position: "relative", display: "inline" }}>
    <sup onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)} style={{ color: t.textTertiary, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: "help", borderBottom: `1px dotted ${t.textFaint}`, margin: "0 1px", padding: "0 2px" }}>{src.label}</sup>
    {show && <span style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 4, padding: "6px 10px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: t.textSecondary, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", lineHeight: 1.4, maxWidth: 360, whiteSpace: "normal" }}>{src.detail} ({src.year})</span>}
  </span>);
}

function AnimNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [d, sD] = useState(0); const ref = useRef<HTMLSpanElement>(null); const ran = useRef(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !ran.current) { ran.current = true; const t0 = performance.now(); const tick = (n: number) => { const p = Math.min((n - t0) / 1200, 1); sD(Math.round((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); } }, { threshold: 0.3 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, [value]);
  return <span ref={ref}>{d}{suffix}</span>;
}

function Stat({ value, suffix, label, source, color }: { value: number; suffix: string; label: string; source?: string; color: string }) {
  const { t } = useTheme();
  return (<div style={{ textAlign: "center", flex: "1 1 140px" }}>
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}><AnimNum value={value} suffix={suffix} /></div>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.textTertiary, marginTop: 4, lineHeight: 1.3 }}>{label}</div>
    {source && <Cite id={source} />}
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   DIAGRAMS
   ═══════════════════════════════════════════════════════════════ */

function SupplyChainDiagram() {
  const { t, q } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const nodes = [{ id: "creators", label: "Human creators", x: 80, y: 60 }, { id: "platforms", label: "Open web", x: 280, y: 60 }, { id: "llms", label: "LLMs", x: 480, y: 60 }, { id: "users", label: "Users", x: 680, y: 60 }];
  const links = [
    { from: "creators", to: "platforms", label: "publish", status: "weakening", desc: "Fewer people publishing — motivation collapsing" },
    { from: "platforms", to: "llms", label: "train on", status: "extracting", desc: "Industrial-scale extraction without replenishment" },
    { from: "llms", to: "users", label: "answer", status: "strong", desc: "The only link getting stronger" },
    { from: "users", to: "creators", label: "visit & reward?", status: "broken", curved: true, desc: "Zero-click answers eliminate the return path" },
  ];
  const cF = (s: string) => s === "broken" ? q.bsh : s === "weakening" ? q.nsh : s === "extracting" ? q.ns : q.bs;
  return (<div style={{ overflowX: "auto", margin: "2rem 0" }}>
    <svg viewBox="0 0 780 180" style={{ width: "100%", maxWidth: 780, display: "block", margin: "0 auto" }}>
      {links.map(lk => { const f = nodes.find(n => n.id === lk.from)!, to = nodes.find(n => n.id === lk.to)!, isH = hovered === lk.label, c = cF(lk.status);
        if (lk.curved) { const d = `M ${to.x} ${to.y + 30} C ${to.x} ${to.y + 100}, ${f.x} ${f.y + 100}, ${f.x} ${f.y + 30}`; return (<g key={lk.label} onMouseEnter={() => setHovered(lk.label)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}><path d={d} fill="none" stroke={c} strokeWidth={isH ? 3 : 2} strokeDasharray="6 4" opacity={isH ? 1 : 0.6} /><text x={(f.x + to.x) / 2} y={155} textAnchor="middle" fill={c} fontSize={11} fontFamily="'JetBrains Mono', monospace" fontWeight={isH ? 700 : 400}>{lk.label} ✕</text></g>); }
        return (<g key={lk.label} onMouseEnter={() => setHovered(lk.label)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}><line x1={f.x + 70} y1={f.y} x2={to.x - 70} y2={to.y} stroke={c} strokeWidth={isH ? 3 : 2} opacity={isH ? 1 : 0.6} /><polygon points={`${to.x - 72},${to.y - 5} ${to.x - 62},${to.y} ${to.x - 72},${to.y + 5}`} fill={c} opacity={isH ? 1 : 0.6} /><text x={(f.x + to.x) / 2} y={f.y - 16} textAnchor="middle" fill={c} fontSize={11} fontFamily="'JetBrains Mono', monospace" fontWeight={isH ? 700 : 400}>{lk.label}</text></g>);
      })}
      {nodes.map(n => (<g key={n.id}><rect x={n.x - 60} y={n.y - 22} width={120} height={44} rx={6} fill={t.cardBg} stroke={t.border} strokeWidth={1.5} /><text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill={t.text} fontSize={13} fontFamily="'Newsreader', Georgia, serif" fontWeight={600}>{n.label}</text></g>))}
    </svg>
    <p style={{ textAlign: "center", color: hovered ? t.textSecondary : t.textTertiary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 8, minHeight: 18, transition: "color 0.15s" }}>{hovered ? links.find(l => l.label === hovered)?.desc : "hover each link to see what's happening"}</p>
  </div>);
}

function MotivationTable() {
  const { t, q } = useTheme();
  const [exp, sExp] = useState<number | null>(null); const sc: Record<string, string> = { broken: q.bsh, eroding: q.nsh, migrating: q.ns };
  return (<div style={{ margin: "2rem 0" }}>
    {CONTENT.motivations.map((m, i) => { const isO = exp === i, c = sc[m.status] || q.bs; return (
      <div key={m.motive} onClick={() => sExp(isO ? null : i)} style={{ borderLeft: `3px solid ${c}`, padding: "12px 16px", marginBottom: 8, background: isO ? `${c}${isDk(t) ? "12" : "06"}` : t.cardBg, borderRadius: "0 6px 6px 0", cursor: "pointer", transition: "all 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: t.text, fontFamily: "'Newsreader', Georgia, serif", fontSize: 16, fontWeight: 600 }}>{m.motive}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c, textTransform: "uppercase" as const, letterSpacing: "0.05em", fontWeight: 600 }}>{m.status}</span>
        </div>
        {isO && <div style={{ marginTop: 12 }}>
          <p style={{ color: t.textSecondary, fontSize: 14, margin: "0 0 8px", lineHeight: 1.6 }}><strong style={{ color: t.textTertiary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase" as const }}>Then:</strong> {m.era}</p>
          <p style={{ color: t.textSecondary, fontSize: 14, margin: 0, lineHeight: 1.6 }}><strong style={{ color: c, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: "uppercase" as const }}>Now:</strong> {m.erosion}{"sources" in m && m.sources && (m.sources as string[]).map((s: string) => <Cite key={s} id={s} />)}</p>
        </div>}
      </div>); })}
    <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>tap each motivation to see the before / after</p>
  </div>);
}

function ContentSpectrum() {
  const { t, q } = useTheme();
  const [active, sA] = useState<number | null>(null); const tc: Record<string, string> = { critical: q.bsh, high: q.nsh, low: q.bs };
  return (<div style={{ margin: "2rem 0" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 3, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
      {CONTENT.spectrum.map((s, i) => { const c = q[s.color as keyof typeof q], isA = active === i; return (
        <div key={s.label} onClick={() => sA(isA ? null : i)} style={{ padding: "14px 12px", background: isA ? `${c}30` : `${c}${isDk(t) ? "12" : "08"}`, cursor: "pointer", transition: "all 0.2s ease", borderBottom: `3px solid ${isA ? c : "transparent"}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: c, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" as const, lineHeight: 1.3 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: t.textTertiary, lineHeight: 1.4 }}>{s.description}</div>
        </div>); })}
    </div>
    {active !== null && <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 6, padding: 16 }}>
      <div style={{ fontSize: 12, color: t.textTertiary, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>examples: <span style={{ color: t.textSecondary }}>{CONTENT.spectrum[active].examples}</span></div>
      <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}><span style={{ color: tc[CONTENT.spectrum[active].threat], fontWeight: 700, textTransform: "uppercase" as const }}>threat: {CONTENT.spectrum[active].threat}</span><span style={{ color: t.textSecondary, marginLeft: 8 }}> — {CONTENT.spectrum[active].threatNote}</span></div>
    </div>}
    <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>tap each category — not all content loss is equal</p>
  </div>);
}

function MigrationChannels() {
  const { t, q } = useTheme();
  const dirColors: Record<string, string> = { collapsing: q.bsh, shrinking: q.nsh, stable: t.textTertiary, growing: q.bs };
  const whereLabels: Record<string, string> = { "open web": "OPEN WEB", dark: "PRIVATE / DARK", "semi-open": "SEMI-OPEN", lost: "GONE" };
  const whereColors: Record<string, string> = { "open web": q.ns, dark: q.nsh, "semi-open": q.bs, lost: q.bsh };
  const dirArrows: Record<string, string> = { collapsing: "↓↓", shrinking: "↓", stable: "→", growing: "↑" };
  return (<div style={{ margin: "2rem 0" }}>
    {CONTENT.migrationChannels.map(ch => {
      const dc = dirColors[ch.direction], wc = whereColors[ch.where];
      return (<div key={ch.label} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${t.borderLight}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: dc, width: 28, textAlign: "center", flexShrink: 0, lineHeight: "20px" }}>{dirArrows[ch.direction]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
            <span style={{ color: t.text, fontFamily: "'Newsreader', Georgia, serif", fontSize: 15, fontWeight: 600 }}>{ch.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: wc, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 700, background: `${wc}${isDk(t) ? "18" : "10"}`, padding: "1px 6px", borderRadius: 3 }}>{whereLabels[ch.where]}</span>
          </div>
          <p style={{ color: t.textTertiary, fontSize: 13, margin: 0, lineHeight: 1.4 }}>{ch.note}</p>
        </div>
      </div>);
    })}
    <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>directional trends, not precise percentages — the pattern is clear even without exact numbers</p>
  </div>);
}

function DataQualityComparison() {
  const { t, q } = useTheme();
  return (<div style={{ display: "flex", gap: 16, margin: "2rem 0", flexWrap: "wrap" }}>
    {[CONTENT.dataQuality.intrinsic, CONTENT.dataQuality.extrinsic].map((side, i) => { const c = i === 0 ? q.bs : q.bsh; return (
      <div key={side.label} style={{ flex: "1 1 280px", background: `${c}${isDk(t) ? "12" : "06"}`, border: `1px solid ${c}40`, borderRadius: 8, padding: 20 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: c, fontWeight: 700, marginBottom: 12, textTransform: "uppercase" as const }}>{side.label}</div>
        {side.traits.map((tr, j) => (<div key={j} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}><span style={{ color: c, fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>{i === 0 ? "✓" : "✕"}</span><span style={{ color: t.textSecondary, fontSize: 14, lineHeight: "20px" }}>{tr}</span></div>))}
      </div>); })}
  </div>);
}

function KnowledgeAxis() {
  const { t, q } = useTheme();
  const [active, sA] = useState<number | null>(null);
  return (<div style={{ margin: "2rem 0" }}>
    {CONTENT.knowledgeAxis.map((k, i) => { const c = q[k.color as keyof typeof q], isA = active === i; return (
      <div key={k.type} onClick={() => sA(isA ? null : i)} style={{ borderLeft: `3px solid ${c}`, padding: "14px 18px", marginBottom: 10, background: isA ? `${c}${isDk(t) ? "15" : "08"}` : t.cardBg, borderRadius: "0 6px 6px 0", cursor: "pointer", transition: "all 0.2s ease" }}>
        <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 17, fontWeight: 600, color: t.text }}>{k.type}</div>
        {isA && <div style={{ marginTop: 10 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.textTertiary, margin: "0 0 8px" }}>e.g. {k.examples}</p>
          <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{k.prognosis}</p>
        </div>}
      </div>); })}
    <p style={{ color: t.textTertiary, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>tap each category — the futures diverge sharply</p>
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   MAIN POST
   ═══════════════════════════════════════════════════════════════ */

export default function Post() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const mode = dark ? "dark" : "light";
  const t = THEME[mode];
  const q = QUAD[mode];

  const prose: React.CSSProperties = { fontFamily: "'Newsreader', Georgia, serif", fontSize: 17, lineHeight: 1.72, color: t.text, maxWidth: 640, margin: "0 auto 1rem" };
  const hdg: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: t.textSecondary, margin: "3rem auto 1rem", maxWidth: 640, letterSpacing: "0.06em", textTransform: "uppercase" as const };
  const bq = (color: string): React.CSSProperties => ({ maxWidth: 640, margin: "1.5rem auto", borderLeft: `3px solid ${color}`, padding: "16px 20px", background: `${color}${isDk(t) ? "12" : "06"}`, borderRadius: "0 6px 6px 0" });

  return (
    <ThemeCtx.Provider value={{ t, q, dark }}>
    <div style={{ transition: "background 0.3s ease" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* TITLE */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 44, fontWeight: 700, color: t.text, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 8px" }}>{CONTENT.title}</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: t.textTertiary, margin: "0 0 3rem" }}>{CONTENT.subtitle}</p>
        </div>

        {/* INTRO */}
        <p style={prose}>{CONTENT.intro}</p>
        <p style={prose}>{CONTENT.intro2}</p>
        <p style={{ ...prose, fontWeight: 600, fontSize: 20, color: q.bsh, margin: "1.5rem auto" }}>{CONTENT.intro3}</p>

        {/* KEY STATS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", padding: "24px 0", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, margin: "2rem auto", maxWidth: 640 }}>
          <Stat value={38} suffix="%" label="publisher Google traffic lost in 1 year" source="pressGazette" color={q.bsh} />
          <Stat value={76} suffix="%" label="Stack Overflow question volume decline" source="ppcStackOverflow" color={q.nsh} />
          <Stat value={47} suffix="%" label="fewer clicks when AI answers appear" source="pewAIO" color={q.ns} />
        </div>

        {/* SUPPLY CHAIN */}
        <h2 style={hdg}>The knowledge supply chain</h2>
        <p style={prose}>Think of LLMs not as products but as the end of a supply chain. At the top of that chain are millions of individuals who chose to write things down—who took the time to articulate what they knew, structure it clearly, and publish it where others could find it. In the middle are the platforms and protocols that organized this knowledge: search engines that surfaced it, social networks that distributed it, ad networks that monetized the attention it attracted. At the bottom are the consumers—including, now, the AI systems that digest all of this into compressed, re-synthesized answers.</p>

        <p style={prose}>Kevin Lu, a former OpenAI researcher, made this point precisely <Cite id="kevinLu" />: the internet isn't just a convenient data source for AI—it's the fundamental technology that enabled scaling. The landmark AI papers get the credit, but as Lu argues, all they really did was develop better methods for consuming the internet's data. The internet provided the properties that made the whole thing work: diversity, a natural curriculum of difficulty, decentralization, and the fact that people actually wanted to use it and therefore kept contributing to it.</p>

        <SupplyChainDiagram />

        <p style={prose}>The problem is that this supply chain was never designed to be extracted from at industrial scale without returning value upstream. Every zero-click AI answer that replaces a visit to the source is a broken link in the chain. Every LLM response that synthesizes without citing is value captured without value returned. The chain is being consumed faster than it's being replenished.</p>

        <div style={bq(q.ns)}>
          <p style={{ ...prose, margin: 0, fontStyle: "italic", fontSize: 15 }}>Lu frames the internet as the "primordial soup" that led to AI and argues it is the "dual" of next-token prediction—one implies the other. If you degrade the internet's diversity or eliminate data sources, you remove entire subcultures from their representation in AI. <Cite id="kevinLu" /></p>
        </div>

        {/* MOTIVATIONS */}
        <h2 style={hdg}>Why people used to share</h2>
        <p style={prose}>The motivations for putting knowledge on the internet were always varied and layered. Understanding what's eroding helps predict what disappears first and what might survive.</p>
        <MotivationTable />

        <p style={prose}>Lu's analysis highlights a crucial property that depends on these motivations: the internet forms a natural skill curriculum <Cite id="kevinLu" />. It contains knowledge at every level—from Khan Academy to arXiv—and this smooth gradient is what allows models to learn progressively. But this curriculum wasn't designed. It emerged because people at every level of expertise had reason to share what they knew. Degrade those reasons, and you don't just lose content—you lose the curriculum structure that makes learning from that content possible.</p>

        {/* DISTRACTION */}
        <h2 style={hdg}>The distraction economy's genuine content</h2>
        <p style={prose}>Here's the counter-argument worth taking seriously: a lot of what's disappearing from the open web was never pure knowledge-sharing in the first place. A huge fraction of the web's information supply chain is fundamentally premised on distraction—providing genuine value as a mechanism to capture your attention, then upselling you into something else.</p>
        <p style={prose}>The programming tutorial that's actually a funnel for a $499 bootcamp. The recipe blog with a 2,000-word personal story before the ingredients because longer pages earn more ad impressions. The "ultimate guide" to productivity that exists to sell you a SaaS subscription. This content is often genuinely useful—the tutorial really does teach you React, the recipe really is good—but its existence is contingent on the conversion economics underneath. The knowledge is real. The motivation is commercial. And the structure is designed around capturing and redirecting your attention, not around being maximally useful.</p>
        <ContentSpectrum />
        <p style={prose}>So when AI answers strip away the need to visit the page, they're breaking the economic model that funded this content. Whether that's a loss depends on whether you think the content marketing supply chain was net positive for human knowledge, or a system that produced useful knowledge as a byproduct of attention arbitrage.</p>

        {/* MIGRATION */}
        <h2 style={hdg}>Where writing effort is going</h2>
        <p style={prose}>Human effort in writing things down hasn't disappeared. It's migrating. The open web is losing share to private channels <Cite id="darkForest" />, and the depth and accessibility of what remains is changing. We don't have precise numbers on the shift—the whole point is that the content is moving to unmeasurable places—but the direction of every channel is clear.</p>
        <MigrationChannels />

        <p style={prose}>This is directly relevant to Lu's point about the internet's value as decentralized, diverse data <Cite id="kevinLu" />. The internet was useful for AI training precisely because anyone could contribute knowledge democratically and there was no central source of truth. As thoughtful contributors retreat into private spaces, the open web's remaining content becomes less diverse, less expert, and less representative of the full range of human knowledge. The curriculum flattens. The richness degrades.</p>

        {/* AI SLOP */}
        <h2 style={hdg}>AI slop is not the real problem</h2>
        <p style={prose}>A lot of people are worried about AI-generated content drowning out the signal on the internet. I think this concern, while valid on the surface, distracts from the deeper issue. The labs are getting good at detecting synthetic text—watermarking, statistical detection, provenance tracking are all tractable engineering problems on a clear improvement trajectory. Similarly, the "blurry photocopy" problem <Cite id="natureCollapse" />—models degrading when trained on their own output—is real today but will diminish. Compression is inherently a truth-finding technology: a model that compresses well has found underlying structure, and will increasingly sift signal from noise. The hard constraint is not filtering AI content out. It's that the deeper signal needs to exist somewhere in the training data at all.</p>

        <div style={bq(q.nsh)}>
          <p style={{ ...prose, margin: 0, fontStyle: "italic", fontSize: 16 }}>The problem is not that the internet is filling up with AI-generated noise. The problem is that the humans who generated the signal are losing their reasons to keep generating it.</p>
        </div>

        <p style={prose}>You can filter out slop. You can't conjure up the motivation for a domain expert to spend four hours writing a detailed explanation of something they understand deeply, for an audience that will never visit their site, building a reputation that LLMs will absorb without attribution. The supply-side problem is the hard one.</p>

        {/* DATA QUALITY */}
        <h2 style={hdg}>The replacement is worse</h2>
        <p style={prose}>If the open web's knowledge supply degrades, AI companies face a choice: rely on increasingly stale web data, or pay for private and proprietary sources. The emerging licensing economy—Reddit at $60M/year from Google <Cite id="redditDeals" />, News Corp at $250M over five years from OpenAI—signals which way this is heading.</p>
        <p style={prose}>But there's a deeper problem with the replacement. Having been very high up at a data labeling company, I can tell you: workers paid by the hour will rarely put in their best work. They want to do the minimum possible work to pass inter-rater agreement thresholds <Cite id="scaleAI" />. The incentive is to pattern-match on what other raters are likely to say, not to bring genuine expertise or careful thought. The feedback loop that produced a Stack Overflow answer—where someone with deep knowledge volunteered their time because the question was interesting and the community would validate the quality—is fundamentally different from a $2/hour annotation task <Cite id="timeKenya" /> where the goal is throughput.</p>
        <DataQualityComparison />
        <p style={prose}>This is the supply chain's deepest vulnerability. The knowledge that made LLMs good was produced by intrinsic motivation—curiosity, reputation, generosity. The knowledge being produced to replace it is driven by extrinsic motivation—hourly wages, task quotas, rater agreement metrics. These are not equivalent inputs. Lu describes how the internet acts as both training data and a natural curriculum for models to learn progressively harder skills <Cite id="kevinLu" />. Paid annotation produces flat, uniform-difficulty data. The curriculum disappears.</p>

        {/* CAN YOU PRIVATIZE THE INTERNET? */}
        <h2 style={hdg}>Can the labs just buy their own internet?</h2>
        <p style={prose}>Given the amount of capital that has flowed into foundation model companies—hundreds of billions of dollars at this point—it's natural to ask whether they can simply build private versions of the internet. License exclusive access to semi-private sources. Commission high-quality content directly. Pay domain experts to write for AI training instead of the open web. The Reddit and News Corp deals are early versions of this strategy, and the sums involved are growing rapidly.</p>

        <p style={prose}>In theory, this could work for some categories of knowledge. You could license medical textbooks, pay journalists to write for a walled corpus, hire PhD annotators at $100/hour instead of crowdworkers at $2. But there's a structural limit to this approach, and it has to do with citations.</p>

        <p style={prose}>The more critical the use case for an LLM, the more the end user wants citations—and not just any citations, but citations to sources where a real human felt strongly enough about the claim to put their name on it in the public sphere. A doctor using an AI to inform a treatment decision wants to see a link to a published study. A journalist fact-checking a claim wants to trace it back to a named source. A lawyer wants case law, not a private corpus. The credibility of the knowledge depends on its public provenance—on the fact that someone was willing to stand behind it in the open.</p>

        <div style={bq(q.bs)}>
          <p style={{ ...prose, margin: 0, fontStyle: "italic", fontSize: 15 }}>Private data can train a model, but it can't ground trust. For high-stakes use cases, citations to the open web aren't a nice-to-have—they're the mechanism by which users verify that the knowledge is real. The open web's role as a trust anchor is not easily privatized.</p>
        </div>

        <p style={prose}>This means the foundation model labs have a strong, rational incentive to be benefactors of the open web—or at least of the parts of it that are most valuable to them. They need high-quality, publicly citable content to exist. They need domain experts to keep publishing openly. They need the knowledge commons to be healthy enough to support the citation chains that make their products trustworthy. Even competing labs share this interest: the open web is a commons they all draw from, and its degradation hurts them all. There's a real case for a consortium approach—labs pooling resources to sustain the open knowledge infrastructure they depend on, much as tech companies jointly fund open-source software foundations today.</p>

        {/* FUTURES */}
        <h2 style={hdg}>What actually comes next</h2>
        <p style={prose}>The conventional wisdom—the "dead internet theory"—holds that the open web will be left to AI filler, content marketing, and the residue of what used to be a commons. I don't think that's quite right. People with the clearest understanding of anything have a strong intrinsic motivation to keep publishing to the internet, and information genuinely does want to be free. The exception is high-alpha information—content whose value depends on timeliness. Timely knowledge, which requires ongoing human effort with ongoing costs, is what's most at risk as the economics of ad-supported and subscription-based publishing collapse. Timeless knowledge—the deep explanation, the careful derivation, the well-documented process—tends to keep becoming public for free, because the people who produce it are motivated by something other than revenue.</p>

        <KnowledgeAxis />

        <p style={prose}>Lu points to something important here <Cite id="kevinLu" />: one of the internet's key properties is that people actually want to use it, which means they continually contribute more data. The question is whether the degraded incentive structure erodes that willingness enough to damage the internet's role as what he calls a "primordial soup" for intelligence. I don't know how this resolves. But the picture is more nuanced than the pessimists suggest. The timeless knowledge commons will probably survive. The timely knowledge pipeline is in real trouble. And the tacit, experiential knowledge that was always the hardest to get onto the internet in the first place is retreating into private spaces where neither humans nor AI can easily reach it.</p>

        {/* SOURCES */}
        <div style={{ borderTop: `1px solid ${t.border}`, marginTop: "3rem", paddingTop: "1.5rem", maxWidth: 640, margin: "3rem auto 0" }}>
          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 12 }}>Sources</h3>
          <div style={{ columns: 2, columnGap: 24 }}>
            {Object.entries(CONTENT.sources).map(([k, s]) => (<p key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.textFaint, lineHeight: 1.5, margin: "0 0 6px", breakInside: "avoid" as const }}><span style={{ color: t.textTertiary }}>{s.label}</span> ({s.year}) — {s.detail}</p>))}
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: "2rem auto 0" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.textFaint, lineHeight: 1.6 }}>This post is itself an artifact of the supply chain it describes—published on the open web, where an LLM may summarize it without linking back.</p>
        </div>
      </div>
    </div>
    </ThemeCtx.Provider>
  );
}
