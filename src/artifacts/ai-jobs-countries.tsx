import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Country {
  name: string;
  flag: string;
  region: string;
  workersM: number;
  gdp: number;
  vh: number;  // % very high exposure (8–10)
  h: number;   // % high (6–7)
  m: number;   // % medium (4–5)
  l: number;   // % low (1–3)
  adapt: number;
  vulnerable: string[];
  resilient: string[];
  insight: string;
  risk: string;
  // derived
  score: number;
  atRiskM: number;
  netRisk: number;
  cls: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  country: Country | null;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const RAW_COUNTRIES = [
  {
    name: "United States", flag: "🇺🇸", region: "Americas",
    workersM: 167, gdp: 80000,
    vh: 18, h: 28, m: 29, l: 25, adapt: 9,
    vulnerable: ["Software developers", "Financial analysts", "Office clerks", "Customer service reps"],
    resilient:  ["Healthcare workers", "Construction trades", "Food service", "Emergency services"],
    insight: "The primary AI innovator — high exposure but strongest global adaptation capacity. The key question is whether productivity gains outpace displacement fast enough to avoid significant friction.",
    risk: "Medium",
  },
  {
    name: "United Kingdom", flag: "🇬🇧", region: "Europe",
    workersM: 33, gdp: 46000,
    vh: 22, h: 30, m: 30, l: 18, adapt: 8,
    vulnerable: ["City of London finance", "Legal professionals", "Publishing & media", "Insurance underwriters"],
    resilient:  ["NHS healthcare staff", "Construction trades", "Social care workers", "Skilled engineers"],
    insight: "London's outsized finance and professional services sector creates concentrated high-exposure risk. High-income economy can cushion the blow, but within-country inequality of impact will be stark.",
    risk: "High",
  },
  {
    name: "South Korea", flag: "🇰🇷", region: "Asia",
    workersM: 28, gdp: 33000,
    vh: 20, h: 32, m: 28, l: 20, adapt: 7.5,
    vulnerable: ["Corporate admin (chaebol)", "Software engineers", "Financial services", "Translators & editors"],
    resilient:  ["Semiconductor engineers", "Healthcare", "Manufacturing R&D", "K-content creators"],
    insight: "Large tech conglomerates will both drive and absorb AI change. Rigid corporate hierarchies may slow adaptation. Strong education system helps; low birth rate makes AI-driven productivity gains attractive.",
    risk: "Medium-High",
  },
  {
    name: "Philippines", flag: "🇵🇭", region: "Asia",
    workersM: 47, gdp: 3600,
    vh: 25, h: 20, m: 25, l: 30, adapt: 3.5,
    vulnerable: ["BPO / call center workers", "Transcription & data processing", "Back-office finance", "Content moderation"],
    resilient:  ["Agriculture", "Construction", "Tourism & hospitality", "Overseas workers (OFW)"],
    insight: "IT-BPO employs ~1.7M workers directly (IBPAP 2023) and contributes ~7–9% of GDP. AI voice, chat, and text capabilities pose an existential threat to the country's largest formal-sector employer.",
    risk: "Very High",
  },
  {
    name: "India", flag: "🇮🇳", region: "Asia",
    workersM: 500, gdp: 2500,
    vh: 18, h: 15, m: 22, l: 45, adapt: 4.5,
    vulnerable: ["IT / software services (~5M, NASSCOM)", "Call center & BPO workers", "Data entry & KPO", "Accounting back-office"],
    resilient:  ["Agriculture (~200M workers)", "Construction", "Informal labor", "Healthcare (underserved demand)"],
    insight: "Most workers are in agriculture (shielded near-term), but the large IT and BPO sectors — the engine of India's growth story — are directly in the crosshairs of current AI capabilities.",
    risk: "High",
  },
  {
    name: "China", flag: "🇨🇳", region: "Asia",
    workersM: 780, gdp: 12700,
    vh: 10, h: 20, m: 25, l: 45, adapt: 6,
    vulnerable: ["White-collar admin workers", "Financial services", "Software QA & testing", "Document & data processing"],
    resilient:  ["Manufacturing assembly workers", "Farmers", "Construction workers", "Physical logistics"],
    insight: "Sheer scale dominates: even at 10% very-high-exposure, that's ~78M workers. Strong state direction can both accelerate AI adoption and buffer mass displacement — policy response will be decisive.",
    risk: "Medium",
  },
  {
    name: "Germany", flag: "🇩🇪", region: "Europe",
    workersM: 44, gdp: 51000,
    vh: 16, h: 30, m: 30, l: 24, adapt: 8,
    vulnerable: ["Administrative staff", "Paralegals", "Financial analysts", "Technical documentation writers"],
    resilient:  ["Precision & mechanical engineers", "Healthcare workers", "Skilled apprenticeship trades", "Manufacturing specialists"],
    insight: "Mittelstand engineering culture treats AI as a tool rather than a threat — but underinvestment in digital transition is a real risk. Strong social safety net substantially reduces dislocation severity.",
    risk: "Medium",
  },
  {
    name: "Japan", flag: "🇯🇵", region: "Asia",
    workersM: 67, gdp: 33000,
    vh: 16, h: 30, m: 30, l: 24, adapt: 6.5,
    vulnerable: ["Admin & clerical staff (very large share)", "Financial services", "Insurance processing", "Data entry"],
    resilient:  ["Healthcare (aging population demand)", "Service & hospitality", "Precision manufacturing", "Civil engineering"],
    insight: "Japan's paper-heavy bureaucracy means enormous administrative exposure. Paradoxically, the labor shortage from demographic decline makes AI-driven productivity a national priority, not just a risk.",
    risk: "Medium",
  },
  {
    name: "Brazil", flag: "🇧🇷", region: "Americas",
    workersM: 107, gdp: 8900,
    vh: 12, h: 23, m: 30, l: 35, adapt: 5,
    vulnerable: ["Growing tech sector", "Banking & fintech (Itaú, Nubank)", "Call centers", "Administrative roles"],
    resilient:  ["Agriculture (large export sector)", "Construction", "Informal economy", "Tourism"],
    insight: "Large banks are already aggressively deploying AI. The enormous informal economy partially buffers displacement statistics but also limits the resources available for workforce adaptation.",
    risk: "Medium",
  },
  {
    name: "Mexico", flag: "🇲🇽", region: "Americas",
    workersM: 57, gdp: 10900,
    vh: 11, h: 24, m: 30, l: 35, adapt: 5,
    vulnerable: ["BPO / call center workers", "Financial services", "Administrative staff", "Data entry roles"],
    resilient:  ["Manufacturing (near-shoring boom)", "Agriculture", "Construction", "Physical logistics"],
    insight: "The near-shoring manufacturing boom creates strong demand for physical labor that AI cannot quickly replace. A growing BPO sector mirrors Philippine risk, but at smaller relative scale.",
    risk: "Medium-Low",
  },
  {
    name: "Vietnam", flag: "🇻🇳", region: "Asia",
    workersM: 55, gdp: 4200,
    vh: 10, h: 18, m: 27, l: 45, adapt: 4,
    vulnerable: ["Growing IT outsourcing sector", "Administrative & financial roles", "Tech services"],
    resilient:  ["Manufacturing (garments, electronics)", "Agriculture", "Construction", "Hospitality & tourism"],
    insight: "Manufacturing-dominated export economy is relatively shielded in the near term. But IT outsourcing — a key plank of Vietnam's development strategy — faces the same headwinds as India's.",
    risk: "Medium-Low",
  },
  {
    name: "Nigeria", flag: "🇳🇬", region: "Africa",
    workersM: 65, gdp: 2200,
    vh: 6, h: 14, m: 20, l: 60, adapt: 3,
    vulnerable: ["Lagos tech sector (Yaba Valley)", "Banking & finance", "Telecom", "Media & advertising"],
    resilient:  ["Agriculture (largest employer by far)", "Informal trade", "Construction", "Community services"],
    insight: "Low formal-sector exposure protects most workers near-term. However, very limited adaptation capacity means disruption to the formal banking and tech sectors could be disproportionately severe.",
    risk: "Medium-Low",
  },
];

const COUNTRIES: Country[] = RAW_COUNTRIES.map(c => ({
  ...c,
  score:    +((c.vh * 9 + c.h * 6.5 + c.m * 4.5 + c.l * 2) / 100).toFixed(2),
  atRiskM:  +((c.workersM * c.vh / 100).toFixed(1)),
  netRisk:  +((((c.vh * 9 + c.h * 6.5 + c.m * 4.5 + c.l * 2) / 100) / c.adapt * 5).toFixed(2)),
  cls:      c.risk.toLowerCase().replace(/[\s\-]+/g, ''),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

type SortKey = 'score' | 'vhigh' | 'workers' | 'gdp' | 'netrisk' | 'name' | 'vh' | 'h' | 'm' | 'l' | 'adapt';

function sortedBy(data: Country[], key: SortKey, asc: boolean): Country[] {
  return [...data].sort((a, b) => {
    let av: number | string, bv: number | string;
    if      (key === 'name')    { av = a.name;     bv = b.name;     }
    else if (key === 'workers') { av = a.workersM; bv = b.workersM; }
    else if (key === 'gdp')     { av = a.gdp;      bv = b.gdp;      }
    else if (key === 'score')   { av = a.score;    bv = b.score;    }
    else if (key === 'vhigh' || key === 'vh') { av = a.vh; bv = b.vh; }
    else if (key === 'h')       { av = a.h;        bv = b.h;        }
    else if (key === 'm')       { av = a.m;        bv = b.m;        }
    else if (key === 'l')       { av = a.l;        bv = b.l;        }
    else if (key === 'adapt')   { av = a.adapt;    bv = b.adapt;    }
    else                        { av = a.netRisk;  bv = b.netRisk;  }
    if (typeof av === 'string') return asc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return asc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });
}

const RISK_COLOR: Record<string, string> = {
  "Very High":   "#d9534f",
  "High":        "#e0882a",
  "Medium-High": "#d4a030",
  "Medium":      "#c8b830",
  "Medium-Low":  "#78b850",
  "Low":         "#4db86c",
};

const RISK_BG: Record<string, string> = {
  veryhigh:   "bg-red-950/60 text-red-400",
  high:       "bg-orange-950/60 text-orange-400",
  mediumhigh: "bg-yellow-950/60 text-yellow-500",
  medium:     "bg-yellow-950/40 text-yellow-400",
  mediumlow:  "bg-green-950/40 text-green-400",
  low:        "bg-green-950/60 text-green-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskBadge({ risk, cls }: { risk: string; cls: string }) {
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${RISK_BG[cls] ?? 'bg-gray-800 text-gray-400'}`}>
      {risk}
    </span>
  );
}

function Pill({ type, children }: { type: 'primary' | 'derived' | 'llm'; children: React.ReactNode }) {
  const styles = {
    primary: 'bg-blue-950/80 text-blue-400',
    derived: 'bg-yellow-950/80 text-yellow-500',
    llm:     'bg-purple-950/80 text-purple-400',
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mx-0.5 ${styles[type]}`}>
      {children}
    </span>
  );
}

function Tooltip({ state }: { state: TooltipState }) {
  if (!state.visible || !state.country) return null;
  const c = state.country;
  return (
    <div
      className="fixed z-50 pointer-events-none bg-[#16161e] border border-[#2a2a38] rounded-lg p-3 text-xs shadow-2xl max-w-[280px]"
      style={{ left: state.x, top: state.y }}
    >
      <div className="font-semibold text-sm text-white mb-2">{c.flag} {c.name}</div>
      <div className="space-y-1 text-gray-300">
        <div className="flex justify-between gap-4"><span className="text-gray-500">Weighted Score</span><span className="font-medium text-white">{c.score.toFixed(2)} / 10</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">Workforce</span><span className="font-medium text-white">{c.workersM}M workers</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">GDP / Capita</span><span className="font-medium text-white">${c.gdp.toLocaleString()}</span></div>
        <div className="flex justify-between gap-4"><span style={{ color: '#d9534f' }}>Very High (8–10)</span><span style={{ color: '#d9534f' }} className="font-medium">{c.vh}% · ~{c.atRiskM}M</span></div>
        <div className="flex justify-between gap-4"><span style={{ color: '#e0882a' }}>High (6–7)</span><span style={{ color: '#e0882a' }} className="font-medium">{c.h}%</span></div>
        <div className="flex justify-between gap-4"><span style={{ color: '#c8b830' }}>Medium (4–5)</span><span style={{ color: '#c8b830' }} className="font-medium">{c.m}%</span></div>
        <div className="flex justify-between gap-4"><span style={{ color: '#4db86c' }}>Low (1–3)</span><span style={{ color: '#4db86c' }} className="font-medium">{c.l}%</span></div>
        <div className="flex justify-between gap-4"><span className="text-gray-500">Adaptation</span><span className="font-medium text-white">{c.adapt}/10</span></div>
      </div>
      <div className="mt-2 pt-2 border-t border-[#2a2a38] text-gray-400 italic leading-snug">{c.insight}</div>
    </div>
  );
}

// ─── Scatter canvas ───────────────────────────────────────────────────────────

interface Bubble { x: number; y: number; r: number; c: Country; }

function useScatter(canvasRef: React.RefObject<HTMLCanvasElement | null>, countries: Country[], onHover: (c: Country | null) => void) {
  const bubbles = useRef<Bubble[]>([]);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.offsetWidth;
    const H = cv.offsetHeight;
    if (!W || !H) return;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const P = { t: 36, r: 28, b: 52, l: 70 };
    const pw = W - P.l - P.r;
    const ph = H - P.t - P.b;

    const xMin = Math.log(1800), xMax = Math.log(90000);
    const toX = (gdp: number) => P.l + (Math.log(gdp) - xMin) / (xMax - xMin) * pw;
    const toY = (s: number)   => P.t + (1 - (s - 2.5) / (7 - 2.5)) * ph;
    const toR = (wM: number)  => Math.sqrt(wM) * 1.8;

    ctx.fillStyle = '#12121a';
    ctx.fillRect(0, 0, W, H);

    // Quadrant tints
    const qx = toX(15000), qy = toY(4.8);
    ctx.fillStyle = 'rgba(77,184,108,0.04)';
    ctx.fillRect(qx, qy, P.l + pw - qx, P.t + ph - qy);
    ctx.fillStyle = 'rgba(217,83,79,0.04)';
    ctx.fillRect(P.l, P.t, qx - P.l, qy - P.t);

    // Grid
    ctx.strokeStyle = '#1c1c26';
    ctx.lineWidth = 1;
    [2000, 5000, 10000, 20000, 50000, 80000].forEach(gdp => {
      const x = toX(gdp);
      ctx.beginPath(); ctx.moveTo(x, P.t); ctx.lineTo(x, P.t + ph); ctx.stroke();
      ctx.fillStyle = '#3a3a4a';
      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$' + (gdp >= 1000 ? (gdp / 1000).toFixed(0) + 'k' : gdp), x, P.t + ph + 18);
    });
    [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5].forEach(s => {
      const y = toY(s);
      ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(P.l + pw, y); ctx.stroke();
      ctx.fillStyle = '#3a3a4a';
      ctx.font = '11px IBM Plex Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(s.toFixed(1), P.l - 6, y + 4);
    });

    // Axis labels
    ctx.fillStyle = '#55556a';
    ctx.font = '12px IBM Plex Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GDP per Capita (log scale, USD)', P.l + pw / 2, H - 6);
    ctx.save();
    ctx.translate(13, P.t + ph / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Weighted AI Exposure Score', 0, 0);
    ctx.restore();

    // Quadrant labels
    ctx.font = '11px IBM Plex Mono, monospace';
    ctx.fillStyle = '#3a1515';
    ctx.textAlign = 'left';
    ctx.fillText('↑ High exposure + low income = most vulnerable', P.l + 4, P.t + 13);
    ctx.fillStyle = '#153a1a';
    ctx.textAlign = 'right';
    ctx.fillText('Low exposure + high income = most adaptable ↓', P.l + pw - 4, P.t + ph - 5);

    // Bubbles (fill pass)
    bubbles.current = [];
    countries.forEach(c => {
      const x = toX(c.gdp), y = toY(c.score), r = toR(c.workersM);
      const col = RISK_COLOR[c.risk] ?? '#888';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = col + '28';
      ctx.fill();
      ctx.strokeStyle = col + 'bb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      bubbles.current.push({ x, y, r, c });
    });

    // Labels pass
    countries.forEach(c => {
      const x = toX(c.gdp), y = toY(c.score), r = toR(c.workersM);
      ctx.font = (r > 22 ? '12' : '10') + 'px IBM Plex Mono, monospace';
      ctx.fillStyle = '#c0c0cc';
      ctx.textAlign = 'center';
      const shortName = c.name.split(' ')[0];
      ctx.fillText(c.flag + ' ' + shortName, x, Math.max(y - r - 4, P.t + 11));
    });
  }, [canvasRef, countries]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (cv.offsetWidth / rect.width);
    const my = (e.clientY - rect.top)  * (cv.offsetHeight / rect.height);
    let hit: Country | null = null;
    for (const b of bubbles.current) {
      const dx = mx - b.x, dy = my - b.y;
      if (dx * dx + dy * dy < (b.r + 5) * (b.r + 5)) { hit = b.c; break; }
    }
    onHover(hit);
  }, [canvasRef, onHover]);

  useEffect(() => {
    draw();
    const observer = new ResizeObserver(draw);
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [draw, canvasRef]);

  return { handleMouseMove };
}

// ─── Main component ───────────────────────────────────────────────────────────

const AIJobsCountries = () => {
  const [barSort, setBarSort] = useState<SortKey>('netrisk');
  const [barAsc,  setBarAsc]  = useState(false);
  const [tSort,   setTSort]   = useState<{ col: SortKey; asc: boolean }>({ col: 'netrisk', asc: false });
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, country: null });
  const scatterRef = useRef<HTMLCanvasElement>(null);

  const showTip  = useCallback((e: React.MouseEvent, c: Country) => {
    const tw = 280, th = 320;
    let x = e.clientX + 14, y = e.clientY - 10;
    if (x + tw > window.innerWidth  - 8) x = e.clientX - tw - 14;
    if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
    setTooltip({ visible: true, x, y, country: c });
  }, []);
  const moveTip  = useCallback((e: React.MouseEvent) => {
    setTooltip(prev => {
      if (!prev.visible) return prev;
      const tw = 280, th = 320;
      let x = e.clientX + 14, y = e.clientY - 10;
      if (x + tw > window.innerWidth  - 8) x = e.clientX - tw - 14;
      if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
      return { ...prev, x, y };
    });
  }, []);
  const hideTip  = useCallback(() => setTooltip(prev => ({ ...prev, visible: false })), []);

  const onScatterHover = useCallback((c: Country | null) => {
    setTooltip(prev => ({ ...prev, visible: !!c, country: c ?? prev.country }));
  }, []);

  const { handleMouseMove: scatterMouseMove } = useScatter(scatterRef, COUNTRIES, onScatterHover);

  const sortedBars   = sortedBy(COUNTRIES, barSort, barAsc);
  const sortedTable  = sortedBy(COUNTRIES, tSort.col, tSort.asc);
  const sortedCards  = sortedBy(COUNTRIES, 'netrisk', false);

  const handleBarSort = (key: SortKey) => {
    setBarAsc(barSort === key ? !barAsc : false);
    setBarSort(key);
  };
  const handleTableSort = (col: SortKey) => {
    setTSort(prev => ({ col, asc: prev.col === col ? !prev.asc : false }));
  };

  const sortBtns: { key: SortKey; label: string }[] = [
    { key: 'netrisk', label: 'Net Risk'      },
    { key: 'score',   label: 'Wtd. Score'    },
    { key: 'vhigh',   label: '% Very High'   },
    { key: 'workers', label: 'Workforce Size' },
    { key: 'gdp',     label: 'GDP / Capita'  },
  ];

  const tableCols: { key: SortKey; label: string; pill?: 'primary' | 'derived' | 'llm' }[] = [
    { key: 'name',    label: 'Country'       },
    { key: 'workers', label: 'Workforce',    pill: 'primary'  },
    { key: 'gdp',     label: 'GDP / Capita', pill: 'primary'  },
    { key: 'score',   label: 'Score',        pill: 'derived'  },
    { key: 'vh',      label: 'Very High %',  pill: 'llm'      },
    { key: 'h',       label: 'High %',       pill: 'llm'      },
    { key: 'm',       label: 'Medium %',     pill: 'llm'      },
    { key: 'l',       label: 'Low %',        pill: 'llm'      },
    { key: 'adapt',   label: 'Adaptation',   pill: 'llm'      },
    { key: 'netrisk', label: 'Net Risk',     pill: 'derived'  },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] text-[#e0e0e8] font-sans">
      <Tooltip state={tooltip} />

      <div className="max-w-6xl mx-auto px-6 pb-20">

        {/* Header */}
        <div className="py-6 border-b border-[#1e1e2a] mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">AI Impact on Jobs — Global View</h1>
          <p className="text-sm text-[#888894] max-w-2xl leading-relaxed">
            How AI-driven automation is likely to affect labor markets across the world.
            Exposure scores use the same 0–10 scale as the{' '}
            <a href="https://karpathy.ai/jobs/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              US BLS occupations analysis
            </a>
            , extrapolated to national workforce compositions using ILO sector data and general knowledge.
          </p>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#1e1e2a] border border-[#1e1e2a] rounded-lg overflow-hidden mb-10">
          {[
            { num: '~350M',       sub: 'workers in very-high-exposure jobs across these 12 countries' },
            { num: '12',          sub: 'countries · ~2.5B total workers' },
            { num: '4.8',         sub: 'avg. weighted AI exposure score (out of 10)' },
            { num: 'Philippines', sub: 'highest near-term vulnerability (BPO concentration)', color: '#e87070' },
            { num: 'India',       sub: 'most workers at very high risk in absolute terms (~90M)',    color: '#c8b830' },
          ].map(({ num, sub, color }) => (
            <div key={num} className="bg-[#12121a] px-4 py-4">
              <div className="text-xl font-bold leading-tight" style={color ? { color } : {}}>{num}</div>
              <div className="text-[11px] text-[#4a4a56] uppercase tracking-wide mt-1 leading-snug">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Bar chart ── */}
        <div className="mb-12">
          <h2 className="text-base font-semibold mb-1">Workforce AI Exposure Distribution</h2>
          <p className="text-sm text-[#888894] mb-3">
            Share of each country's workforce in very-high (8–10), high (6–7), medium (4–5), and low (1–3) AI exposure jobs.
            Tier percentages are <Pill type="llm">LLM estimates</Pill> derived from ILO sector data — see Methodology below.
            Weighted score &amp; GDP are from <Pill type="primary">primary sources</Pill>.
          </p>

          {/* Legend */}
          <div className="flex gap-4 flex-wrap mb-3 text-xs text-[#888894]">
            {[
              { color: '#d9534f', label: 'Very High (8–10)' },
              { color: '#e0882a', label: 'High (6–7)'       },
              { color: '#c8b830', label: 'Medium (4–5)'     },
              { color: '#4db86c', label: 'Low (1–3)'        },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>

          {/* Sort controls */}
          <div className="flex gap-1.5 flex-wrap mb-3 items-center text-xs text-[#4a4a56]">
            <span>Sort:</span>
            {sortBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleBarSort(key)}
                className={`px-2.5 py-1 rounded border text-xs transition-colors ${
                  barSort === key
                    ? 'border-blue-500 text-blue-400 bg-[#1c1c26]'
                    : 'border-[#1e1e2a] text-[#888894] bg-[#12121a] hover:border-blue-500/50 hover:text-[#e0e0e8]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bars */}
          <div className="space-y-1.5">
            {sortedBars.map(c => (
              <div
                key={c.name}
                className="flex items-center gap-3 px-1.5 py-0.5 rounded-md hover:bg-[#12121a] transition-colors cursor-default"
                onMouseEnter={e => showTip(e, c)}
                onMouseMove={moveTip}
                onMouseLeave={hideTip}
              >
                <div className="w-36 flex-shrink-0 text-sm text-[#888894] text-right flex items-center justify-end gap-1.5">
                  <span className="text-base">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </div>
                <div className="flex-1 h-6 flex rounded overflow-hidden min-w-0">
                  {[
                    { pct: c.vh, color: '#d9534f' },
                    { pct: c.h,  color: '#e0882a' },
                    { pct: c.m,  color: '#c8b830' },
                    { pct: c.l,  color: '#4db86c' },
                  ].map(({ pct, color }) => (
                    <div key={color} style={{ width: `${pct}%`, background: color }} />
                  ))}
                </div>
                <div className="w-44 flex-shrink-0 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-[#888894] w-7 text-right">{c.score.toFixed(1)}</span>
                  <RiskBadge risk={c.risk} cls={c.cls} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scatter ── */}
        <div className="mb-12">
          <h2 className="text-base font-semibold mb-1">Economic Capacity vs. AI Exposure</h2>
          <p className="text-sm text-[#888894] mb-3">
            Higher GDP per capita generally means more capacity to absorb disruption.
            Bubble size = workforce. Hover for details.
          </p>
          <canvas
            ref={scatterRef}
            className="w-full rounded-md border border-[#1e1e2a]"
            style={{ height: 420 }}
            onMouseMove={e => { scatterMouseMove(e); moveTip(e); }}
            onMouseLeave={hideTip}
          />
        </div>

        {/* ── Table ── */}
        <div className="mb-12">
          <h2 className="text-base font-semibold mb-1">Country Detail Table</h2>
          <p className="text-sm text-[#888894] mb-3">
            Click any column to sort.&nbsp;
            <Pill type="primary">ILO / WB</Pill> = primary source &nbsp;
            <Pill type="derived">calc</Pill> = calculated &nbsp;
            <Pill type="llm">LLM</Pill> = model estimate
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {tableCols.map(({ key, label, pill }) => (
                    <th
                      key={key}
                      onClick={() => handleTableSort(key)}
                      className={`text-left px-2.5 py-2 border-b border-[#1e1e2a] font-medium cursor-pointer select-none whitespace-nowrap hover:text-white transition-colors ${
                        tSort.col === key ? 'text-blue-400' : 'text-[#888894]'
                      }`}
                    >
                      {label}
                      {pill && <Pill type={pill}>{pill === 'primary' ? 'src' : pill}</Pill>}
                      {tSort.col === key && (tSort.asc ? ' ▲' : ' ▼')}
                    </th>
                  ))}
                  <th className="text-left px-2.5 py-2 border-b border-[#1e1e2a] font-medium text-[#888894]">Vulnerable</th>
                  <th className="text-left px-2.5 py-2 border-b border-[#1e1e2a] font-medium text-[#888894]">Resilient</th>
                </tr>
              </thead>
              <tbody>
                {sortedTable.map(c => (
                  <tr key={c.name} className="border-b border-[#1e1e2a] hover:bg-[#12121a] transition-colors">
                    <td className="px-2.5 py-2 font-medium whitespace-nowrap">{c.flag} {c.name}</td>
                    <td className="px-2.5 py-2 text-[#888894]">{c.workersM}M</td>
                    <td className="px-2.5 py-2 text-[#888894]">${c.gdp.toLocaleString()}</td>
                    <td className="px-2.5 py-2 font-semibold">{c.score.toFixed(2)}</td>
                    <td className="px-2.5 py-2 font-medium" style={{ color: '#d9534f' }}>{c.vh}%</td>
                    <td className="px-2.5 py-2 font-medium" style={{ color: '#e0882a' }}>{c.h}%</td>
                    <td className="px-2.5 py-2 font-medium" style={{ color: '#c8b830' }}>{c.m}%</td>
                    <td className="px-2.5 py-2 font-medium" style={{ color: '#4db86c' }}>{c.l}%</td>
                    <td className="px-2.5 py-2 text-[#888894]">{c.adapt}/10</td>
                    <td className="px-2.5 py-2"><RiskBadge risk={c.risk} cls={c.cls} /></td>
                    <td className="px-2.5 py-2 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {c.vulnerable.map(v => (
                          <span key={v} className="px-1.5 py-0.5 rounded text-[10px] bg-red-950/40 text-red-400">{v}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2.5 py-2 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {c.resilient.map(v => (
                          <span key={v} className="px-1.5 py-0.5 rounded text-[10px] bg-green-950/40 text-green-400">{v}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Country cards ── */}
        <div className="mb-12">
          <h2 className="text-base font-semibold mb-1">Country Insights</h2>
          <p className="text-sm text-[#888894] mb-4">Sorted by net risk — highest first.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedCards.map(c => (
              <div key={c.name} className="bg-[#12121a] border border-[#1e1e2a] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span className="text-base">{c.flag}</span> {c.name}
                  </div>
                  <RiskBadge risk={c.risk} cls={c.cls} />
                </div>
                <p className="text-xs text-[#888894] leading-relaxed mb-3">{c.insight}</p>
                <div className="flex gap-3 text-[11px] text-[#4a4a56] border-t border-[#1e1e2a] pt-2.5 flex-wrap">
                  <span>Score: <strong className="text-[#888894]">{c.score.toFixed(1)}</strong></span>
                  <span>Very High: <strong style={{ color: '#d9534f' }}>{c.vh}%</strong></span>
                  <span>~{c.atRiskM}M at high risk</span>
                  <span>Adapt: <strong className="text-[#888894]">{c.adapt}/10</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Methodology ── */}
        <div className="bg-[#12121a] border border-[#1e1e2a] rounded-lg p-5 text-sm text-[#888894] leading-relaxed space-y-4">
          <h2 className="text-base font-semibold text-white">Methodology &amp; Sources</h2>

          <p>
            Each field on this page has a different provenance. The legend:&nbsp;
            <Pill type="primary">primary</Pill> sourced from a named statistical body,&nbsp;
            <Pill type="derived">derived</Pill> calculated from primary data,&nbsp;
            <Pill type="llm">LLM</Pill> generated by a large language model using general knowledge — not from a primary dataset.
          </p>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              AI Exposure Scores (0–10) <Pill type="primary">primary</Pill>
            </h3>
            <p>
              Scores come from the <a href="https://karpathy.ai/jobs/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">US occupations analysis</a> on which this page is based.
              342 US occupations from the <strong className="text-white">Bureau of Labor Statistics Occupational Outlook Handbook</strong>{' '}
              (<a href="https://www.bls.gov/ooh/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">bls.gov/ooh</a>) were each scored by{' '}
              <strong className="text-white">Google Gemini Flash</strong> via OpenRouter on a 0–10 scale (10 = routine digital work, 1 = unpredictable physical work).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Workforce Exposure Tier Percentages <Pill type="llm">LLM estimate</Pill>
            </h3>
            <p>
              <strong className="text-white">This is the most important caveat.</strong>{' '}
              The % of each country's workforce in each exposure tier is <em>not</em> from a primary dataset.
              It was estimated by mapping each country's sectoral employment distribution (from ILO data) to US BLS occupational
              categories, then applying the category-level average AI exposure scores. The result is an informed generalisation —
              it captures broad structural differences (e.g. Philippines vs. Nigeria) but should not be treated as precise measurement.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              GDP per Capita <Pill type="primary">primary</Pill>
            </h3>
            <p>
              World Bank, <em>GDP per capita (current US$)</em>, 2023.{' '}
              <a href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                data.worldbank.org
              </a>. Values rounded to nearest $100.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Workforce Size <Pill type="primary">primary</Pill>
            </h3>
            <p>
              ILO, <em>Employment by sex and age — ILO modelled estimates</em>, 2023.{' '}
              <a href="https://ilostat.ilo.org/data/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                ilostat.ilo.org
              </a>. Rounded to nearest million. Nigeria figure covers formal + informal combined.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Sector-specific claims</h3>
            <table className="w-full text-xs border-collapse mt-1">
              <thead>
                <tr className="border-b border-[#1e1e2a]">
                  <th className="text-left py-1.5 pr-4 text-[#4a4a56] font-medium">Claim</th>
                  <th className="text-left py-1.5 text-[#4a4a56] font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2a]">
                <tr>
                  <td className="py-2 pr-4 text-white">Philippines ~1.7M BPO/IT-BPO direct employees</td>
                  <td className="py-2">IT &amp; Business Process Association of the Philippines (IBPAP), 2023 Roadmap. <a href="https://ibpap.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ibpap.org</a></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Philippines BPO ~7–9% of GDP directly</td>
                  <td className="py-2">IBPAP / Bangko Sentral ng Pilipinas. Note: "13%" figures sometimes cited include multiplier effects.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">India ~5M workers in IT/software services</td>
                  <td className="py-2">NASSCOM, <em>India IT Industry Report 2023</em>. <a href="https://nasscom.in" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">nasscom.in</a></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">India ~200M agricultural workers</td>
                  <td className="py-2">ILO / India Ministry of Statistics (MOSPI), Periodic Labour Force Survey 2022–23.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Japan paper-heavy administrative culture</td>
                  <td className="py-2">OECD, <em>Going Digital in Japan</em>, 2020. <a href="https://www.oecd.org/japan" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">oecd.org/japan</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Adaptation Capacity Score (1–10) <Pill type="llm">LLM estimate</Pill>
            </h3>
            <p>
              A composite reflecting how well a country can absorb and redirect displaced workers.
              Informed by World Bank GDP per capita, UNESCO adult educational attainment,
              ITU ICT Development Index, and general knowledge of tech ecosystem breadth and social safety nets.
              Not a published index — treat as directional only.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              Net Risk Score <Pill type="derived">derived</Pill>
            </h3>
            <p>
              Net Risk = (weighted exposure score ÷ adaptation capacity) × 5.
              Higher = more exposed <em>and</em> less able to adapt.
              Qualitative labels are author judgements combining net risk with structural context.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Key Limitations</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">AI progress is uncertain.</strong> Scores reflect current capabilities; rapid advances shift all scores up.</li>
              <li><strong className="text-white">Within-country variation is large.</strong> Regional, educational, and firm-size differences are not captured.</li>
              <li><strong className="text-white">Informal economies are hard to categorise.</strong> Nigeria, India, and Brazil have large informal workforces.</li>
              <li><strong className="text-white">Policy responses are not modelled.</strong> Industrial strategy and retraining programs can change outcomes substantially.</li>
              <li><strong className="text-white">Exposure ≠ displacement.</strong> High exposure means a job <em>can</em> be reshaped by AI; whether and how fast that happens depends on many additional factors.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIJobsCountries;
