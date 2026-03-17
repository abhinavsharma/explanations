import { ArtifactStatus } from '@/components/artifact-wrapper';
export const artifactStatus = ArtifactStatus.HIDDEN;

/**
 * OG preview card for the intelligence-commoditization blog post.
 * Renders a static version of the scatter plot in a clean card frame.
 */
export default function OgIntelligenceCommoditization() {
  const qc = { ns: "#7A8B99", bs: "#4A7A62", nsh: "#B8860B", bsh: "#9B2335" };
  const points = [
    { x: 0.15, y: 0.10, q: "ns" }, { x: 0.22, y: 0.18, q: "ns" },
    { x: 0.28, y: 0.10, q: "ns" }, { x: 0.18, y: 0.15, q: "ns" },
    { x: 0.62, y: 0.15, q: "bs" }, { x: 0.72, y: 0.06, q: "bs" },
    { x: 0.68, y: 0.22, q: "bs" }, { x: 0.55, y: 0.12, q: "bs" },
    { x: 0.20, y: 0.65, q: "nsh" }, { x: 0.30, y: 0.72, q: "nsh" },
    { x: 0.25, y: 0.78, q: "nsh" }, { x: 0.32, y: 0.58, q: "nsh" },
    { x: 0.78, y: 0.85, q: "bsh" }, { x: 0.58, y: 0.75, q: "bsh" },
    { x: 0.82, y: 0.90, q: "bsh" }, { x: 0.75, y: 0.60, q: "bsh" },
    { x: 0.88, y: 0.88, q: "bsh" }, { x: 0.65, y: 0.82, q: "bsh" },
  ];

  const sz = 340, pad = 40;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <div style={{
        width: 1200,
        height: 630,
        background: "#FAFAF7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 64px",
        gap: 48,
        fontFamily: "'Newsreader', Georgia, serif",
      }}>
        {/* Left: title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 34,
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.2,
            color: "#1a1a1a",
            margin: "0 0 16px",
          }}>
            "Intelligence will commoditize" is a useless claim
          </h1>
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 17,
            color: "#555",
            lineHeight: 1.5,
            margin: 0,
          }}>
            It's not wrong. It's just not saying anything.
          </p>
        </div>

        {/* Right: scatter plot */}
        <div style={{ width: 420, flexShrink: 0 }}>
          <svg width={sz + pad} height={sz + pad + 30} viewBox={`0 0 ${sz + pad} ${sz + pad + 30}`} style={{ display: "block" }}>
            <rect x={pad} y={0} width={sz / 2} height={sz / 2} fill={qc.nsh + "08"} />
            <rect x={pad + sz / 2} y={0} width={sz / 2} height={sz / 2} fill={qc.bsh + "08"} />
            <rect x={pad} y={sz / 2} width={sz / 2} height={sz / 2} fill={qc.ns + "08"} />
            <rect x={pad + sz / 2} y={sz / 2} width={sz / 2} height={sz / 2} fill={qc.bs + "08"} />
            <line x1={pad} y1={sz / 2} x2={pad + sz} y2={sz / 2} stroke="#e0e0e0" strokeDasharray="4,4" />
            <line x1={pad + sz / 2} y1={0} x2={pad + sz / 2} y2={sz} stroke="#e0e0e0" strokeDasharray="4,4" />
            <line x1={pad} y1={0} x2={pad} y2={sz} stroke="#ccc" strokeWidth={1.5} />
            <line x1={pad} y1={sz} x2={pad + sz} y2={sz} stroke="#ccc" strokeWidth={1.5} />
            <text x={pad + sz / 2} y={sz + 24} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#aaa" letterSpacing="0.1em">
              COGNITIVE BREADTH: NARROW → BROAD
            </text>
            {points.map((pt, i) => (
              <circle key={i} cx={pad + pt.x * sz} cy={sz - pt.y * sz} r={5} fill={qc[pt.q]} stroke="#fff" strokeWidth={1.5} />
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}
