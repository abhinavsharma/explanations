import { ArtifactStatus } from '@/components/artifact-wrapper';
export const artifactStatus = ArtifactStatus.HIDDEN;

/**
 * OG preview card for the mercor-march-26 blog post.
 * Renders a static version of the spend chart in a clean card frame.
 */
export default function OgMercorMarch26() {
  const CATEGORIES = [
    { label: "Software Engineering", hired: 2975, avgPay: 96.28, color: "#B8860B" },
    { label: "Language & Generalist", hired: 1394, avgPay: 47.60, color: "#7A8B99" },
    { label: "Hard Sciences (PhD)", hired: 634, avgPay: 80.12, color: "#4A7A62" },
    { label: "AI Red-Teaming", hired: 473, avgPay: 53.07, color: "#B8860B" },
    { label: "Medical & Clinical", hired: 272, avgPay: 70.85, color: "#9B2335" },
    { label: "Other Domain", hired: 236, avgPay: 42.50, color: "#7A8B99" },
    { label: "Finance", hired: 64, avgPay: 120.00, color: "#9B2335" },
    { label: "Legal", hired: 4, avgPay: 153.33, color: "#9B2335" },
  ];

  const sorted = [...CATEGORIES].sort((a, b) => (b.hired * b.avgPay) - (a.hired * a.avgPay));
  const maxSpend = sorted[0].hired * sorted[0].avgPay;
  const total = CATEGORIES.reduce((s, c) => s + c.hired * c.avgPay, 0);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`}</style>
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
        <div style={{ flex: "0 0 380px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#1a1a1a",
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}>
            Mercor's hiring page is an accidental roadmap for AI
          </h1>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: "#999",
            lineHeight: 1.5,
            margin: 0,
          }}>
            What Mercor's job listings reveal about what models can't do yet
          </p>
        </div>

        {/* Right: spend chart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.06em",
            color: "#999",
            marginBottom: 4,
          }}>
            Implied hourly spend by category
          </div>
          {sorted.map((c, i) => {
            const spend = c.hired * c.avgPay;
            const barPct = (spend / maxSpend) * 100;
            const pct = (spend / total) * 100;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 140,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  textAlign: "right",
                  flexShrink: 0,
                }}>
                  {c.label}
                </div>
                <div style={{ flex: 1, height: 20, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${barPct}%`,
                    height: "100%",
                    background: c.color,
                    borderRadius: 3,
                    opacity: 0.78,
                  }} />
                </div>
                <div style={{
                  width: 50,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#999",
                  textAlign: "right",
                }}>
                  {pct.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
