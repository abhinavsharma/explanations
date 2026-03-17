import { ArtifactStatus } from '@/components/artifact-wrapper';
export const artifactStatus = ArtifactStatus.HIDDEN;

/**
 * OG preview card for the data-flywheel blog post.
 * Renders a static version of the flywheel diagram in a clean card frame.
 * Used as the og:image source (screenshot this page).
 */
export default function OgDataFlywheel() {
  const nodes = [
    { label: "ATTRACT", text: "Expert users" },
    { label: "COLLECT", text: "Diverse questions" },
    { label: "EVALUATE", text: "Expert feedback" },
    { label: "IMPROVE", text: "Better model" },
  ];
  const nodeColors = ["#4A7A62", "#B8860B", "#9B2335", "#7A8B99"];

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
        {/* Left: title + subtitle */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "#999",
            marginBottom: 12,
          }}>Essay</div>
          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1.2,
            color: "#1a1a1a",
            margin: "0 0 16px",
          }}>
            The AI Data Flywheel Is About Users, Not Usage
          </h1>
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 18,
            fontStyle: "italic",
            color: "#555",
            lineHeight: 1.5,
            margin: 0,
          }}>
            The company with the best model won't be the one with the most users.
          </p>
        </div>

        {/* Right: flywheel diagram */}
        <div style={{ width: 380, flexShrink: 0 }}>
          <svg viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", display: "block" }}>
            <path d="M 250 60 Q 410 60, 410 190 Q 410 320, 250 320 Q 90 320, 90 190 Q 90 60, 250 60"
              fill="none" stroke="#e0e0e0" strokeWidth="1.5" strokeDasharray="6,4" />
            <path d="M 315 64 Q 398 85, 408 155" fill="none" stroke="#bbb" strokeWidth="2" />
            <path d="M 408 230 Q 395 310, 315 328" fill="none" stroke="#bbb" strokeWidth="2" />
            <path d="M 185 328 Q 105 310, 92 235" fill="none" stroke="#bbb" strokeWidth="2" />
            <path d="M 92 150 Q 105 75, 185 62" fill="none" stroke="#bbb" strokeWidth="2" />
            {[
              { x: 170, y: 30, cx: 250 },
              { x: 340, y: 162, cx: 420 },
              { x: 170, y: 298, cx: 250 },
              { x: 0, y: 162, cx: 80 },
            ].map((pos, i) => (
              <g key={i}>
                <rect x={pos.x} y={pos.y} width="160" height="56" rx="8"
                  fill="#fff" stroke={nodeColors[i]} strokeWidth="1.5" />
                <text x={pos.cx} y={pos.y + 23} textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#999" letterSpacing="0.05em">
                  {nodes[i].label}
                </text>
                <text x={pos.cx} y={pos.y + 42} textAnchor="middle"
                  fontFamily="'Newsreader', Georgia, serif" fontSize="13" fill="#1a1a1a">
                  {nodes[i].text}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}
