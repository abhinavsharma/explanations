import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNPUBLISHED;
export const publishDate = "2026-03-27";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Area, ComposedChart,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const PROVIDERS: Record<string, { color: string; costColor: string }> = {
  OpenAI: { color: "#10a37f", costColor: "#10a37f" },
  Anthropic: { color: "#d97706", costColor: "#d97706" },
  Google: { color: "#4285f4", costColor: "#4285f4" },
};

// API prices + estimated provider cost ranges ($/MTok output)
// ci/co = estimated cost input/output (midpoint of analyst range)
// ciLo/coLo, ciHi/coHi = low/high of range
const RAW = [
  // OpenAI — FutureSearch, Epoch AI, Alderson, inferred
  { p:"OpenAI", m:"GPT-4",         d:"2023-03-14", i:30,  o:60,   ci:15,  co:66,  coLo:36, coHi:96, src:"FutureSearch" },
  { p:"OpenAI", m:"GPT-4 Turbo",   d:"2023-11-06", i:10,  o:30,   ci:5,   co:34,  coLo:20, coHi:34, src:"FutureSearch est." },
  { p:"OpenAI", m:"GPT-4o",        d:"2024-05-13", i:5,   o:15,   ci:1.5, co:7,   coLo:5,  coHi:15, src:"FutureSearch" },
  { p:"OpenAI", m:"o1-preview",    d:"2024-09-12", i:15,  o:60,   ci:5,   co:20,  coLo:15, coHi:25, src:"Epoch AI (per visible tok)" },
  { p:"OpenAI", m:"o1",            d:"2024-12-17", i:15,  o:60,   ci:5,   co:20,  coLo:15, coHi:25, src:"Epoch AI" },
  { p:"OpenAI", m:"GPT-4.1",      d:"2025-04-14", i:2,   o:8,    ci:0.6, co:3,   coLo:2,  coHi:4,  src:"Inferred from optimization" },
  { p:"OpenAI", m:"o3",           d:"2025-04-16", i:10,  o:40,   ci:3,   co:12,  coLo:8,  coHi:16, src:"Inferred; ARC data" },
  { p:"OpenAI", m:"GPT-5",        d:"2025-08-07", i:1.25, o:10,  ci:0.5, co:5,   coLo:3,  coHi:7,  src:"Epoch AI bundle analysis" },
  { p:"OpenAI", m:"GPT-5.1",      d:"2025-11-13", i:1.25, o:10,  ci:0.4, co:4.5, coLo:3,  coHi:6,  src:"Inferred" },
  { p:"OpenAI", m:"GPT-5.2",      d:"2025-12-11", i:1.75, o:14,  ci:0.6, co:6,   coLo:4,  coHi:8,  src:"Inferred" },
  { p:"OpenAI", m:"GPT-5.4",      d:"2026-03-05", i:2.5,  o:15,  ci:0.8, co:6,   coLo:4,  coHi:8,  src:"Inferred" },

  // Anthropic — Alderson analysis, LessWrong, The Information
  { p:"Anthropic", m:"Claude 1",        d:"2023-03-14", i:11.02, o:32.68, ci:6,   co:18,  coLo:12, coHi:24, src:"Inferred from GPT-4 era" },
  { p:"Anthropic", m:"Claude 2",        d:"2023-07-11", i:8,     o:24,    ci:4,   co:14,  coLo:10, coHi:18, src:"Inferred" },
  { p:"Anthropic", m:"Claude 2.1",      d:"2023-11-21", i:8,     o:24,    ci:3.5, co:12,  coLo:8,  coHi:16, src:"Inferred" },
  { p:"Anthropic", m:"Claude 3 Opus",   d:"2024-03-04", i:15,    o:75,    ci:1.5, co:5.5, coLo:3,  coHi:8,  src:"Alderson (raw compute)" },
  { p:"Anthropic", m:"Claude 3.5 Son.", d:"2024-06-20", i:3,     o:15,    ci:0.5, co:2,   coLo:1,  coHi:3,  src:"Alderson derivation" },
  { p:"Anthropic", m:"Claude 3.7 Son.", d:"2025-02-24", i:3,     o:15,    ci:0.4, co:1.5, coLo:1,  coHi:2,  src:"Alderson" },
  { p:"Anthropic", m:"Opus 4",          d:"2025-05-22", i:15,    o:75,    ci:1,   co:4,   coLo:2.5,coHi:5.5,src:"Alderson/unexcitedneurons" },
  { p:"Anthropic", m:"Opus 4.1",        d:"2025-08-05", i:15,    o:75,    ci:0.8, co:3.5, coLo:2,  coHi:5,  src:"Inferred (same arch)" },
  { p:"Anthropic", m:"Sonnet 4.5",      d:"2025-09-29", i:3,     o:15,    ci:0.3, co:1.2, coLo:0.8,coHi:1.6,src:"Inferred" },
  { p:"Anthropic", m:"Opus 4.5",        d:"2025-11-24", i:5,     o:25,    ci:0.5, co:3,   coLo:2,  coHi:4,  src:"Alderson" },
  { p:"Anthropic", m:"Opus 4.6",        d:"2026-02-05", i:5,     o:25,    ci:0.5, co:2.5, coLo:1.5,coHi:3.5,src:"Alderson" },

  // Google — TPU cost advantage, Midjourney case study
  { p:"Google", m:"Gemini 1.5 Pro", d:"2024-05-24", i:3.5,  o:10.5, ci:0.5, co:1.5, coLo:0.5, coHi:3,   src:"TPU cost triangulation" },
  { p:"Google", m:"Gemini 2.0 Flash",d:"2025-02-05",i:0.1,  o:0.4,  ci:0.02,co:0.08,coLo:0.03,coHi:0.15,src:"TPU v5e/v6e economics" },
  { p:"Google", m:"Gemini 2.5 Pro", d:"2025-04-09", i:1.25, o:10,   ci:0.2, co:2.5, coLo:1,   coHi:4,   src:"Estimated from TPU costs" },
  { p:"Google", m:"Gemini 3 Pro",   d:"2025-11-18", i:2,    o:12,   ci:0.3, co:3,   coLo:2,   coHi:4,   src:"Estimated; low confidence" },
  { p:"Google", m:"Gemini 3.1 Pro", d:"2026-02-19", i:2,    o:12,   ci:0.3, co:2.5, coLo:1.5, coHi:3.5, src:"Estimated" },
];

const ts = (d: string) => new Date(d).getTime();
const fmtDate = (t: number) => new Date(t).toLocaleDateString("en-US",{month:"short",year:"2-digit"});
const fmtPrice = (v: number | null) => {
  if (v==null) return "";
  if (v<0.1) return `$${v.toFixed(3)}`;
  if (v<1) return `$${v.toFixed(2)}`;
  if (v<10) return `$${v.toFixed(1)}`;
  return `$${Math.round(v)}`;
};

const CustomTooltip = ({active,payload,metric}: Record<string, any>) => {
  if (!active||!payload?.length) return null;
  const items = payload.filter((p: any)=>p.value!=null);
  if (!items.length) return null;
  const d = new Date(items[0].payload.ts);
  const dateStr = d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const model = items[0].payload.model;
  const src = items[0].payload.src;
  const apiVal = items.find((x: any)=>x.dataKey==="api")?.value;
  const costVal = items.find((x: any)=>x.dataKey==="cost")?.value;
  const lo = items[0].payload.costLo;
  const hi = items[0].payload.costHi;
  const margin = apiVal&&costVal ? Math.round((1 - costVal/apiVal)*100) : null;

  return (
    <div style={{
      background:"rgba(10,10,16,0.96)",border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:10,padding:"12px 16px",fontFamily:"'DM Sans',sans-serif",
      backdropFilter:"blur(10px)",minWidth:220,maxWidth:340,
    }}>
      <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,marginBottom:4,letterSpacing:"0.06em",textTransform:"uppercase" as const}}>{dateStr}</div>
      <div style={{color:"#fff",fontSize:14,fontWeight:600,marginBottom:8}}>{model}</div>
      {apiVal!=null && (
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>API Price ({metric})</span>
          <span style={{color:"#fff",fontSize:13,fontWeight:600,fontFamily:"'Space Mono',monospace"}}>{fmtPrice(apiVal)}/MTok</span>
        </div>
      )}
      {costVal!=null && (
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>Est. Provider Cost</span>
          <span style={{color:"#ef4444",fontSize:13,fontWeight:600,fontFamily:"'Space Mono',monospace"}}>{fmtPrice(costVal)}/MTok</span>
        </div>
      )}
      {lo!=null && hi!=null && (
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>Range</span>
          <span style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontFamily:"'Space Mono',monospace"}}>{fmtPrice(lo)} – {fmtPrice(hi)}</span>
        </div>
      )}
      {margin!=null && (
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <span style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>Implied Margin</span>
          <span style={{color:margin>0?"#22c55e":"#ef4444",fontSize:13,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{margin}%</span>
        </div>
      )}
      {src && <div style={{color:"rgba(255,255,255,0.25)",fontSize:9,marginTop:6}}>{src}</div>}
    </div>
  );
};

function ProviderChart({provider,color,data,metric,logScale,hideOutliers}: Record<string, any>) {
  const chartData = useMemo(()=>{
    let d = data.filter((r: any)=>r.p===provider);
    if (hideOutliers) d = d.filter((r: any)=>r.i<=30&&r.o<=80);
    return d.map((r: any)=>({
      ts: ts(r.d),
      api: metric==="input"?r.i:r.o,
      cost: metric==="input"?r.ci:r.co,
      costLo: metric==="input"?(r.ci*0.6):(r.coLo),
      costHi: metric==="input"?(r.ci*1.4):(r.coHi),
      model: r.m,
      src: r.src,
    })).sort((a: any,b: any)=>a.ts-b.ts);
  },[data,provider,metric,hideOutliers]);

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{top:16,right:24,left:16,bottom:24}}>
        <defs>
          <linearGradient id={`costFill-${provider}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2}/>
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02}/>
          </linearGradient>
          <linearGradient id={`apiFill-${provider}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15}/>
            <stop offset="100%" stopColor={color} stopOpacity={0.01}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
        <XAxis
          dataKey="ts" type="number" domain={["dataMin","dataMax"]}
          tickFormatter={fmtDate}
          tick={{fill:"rgba(255,255,255,0.28)",fontSize:10,fontFamily:"'Space Mono',monospace"}}
          stroke="rgba(255,255,255,0.06)" tickLine={false}
        />
        <YAxis
          scale={logScale?"log":"linear"}
          domain={logScale?[0.01,"auto"]:[0,"auto"]}
          tickFormatter={fmtPrice}
          tick={{fill:"rgba(255,255,255,0.28)",fontSize:10,fontFamily:"'Space Mono',monospace"}}
          stroke="rgba(255,255,255,0.06)" tickLine={false}
          allowDataOverflow
        />
        <Tooltip content={<CustomTooltip metric={metric}/>}/>
        <Area type="monotone" dataKey="api" stroke="none" fill={`url(#apiFill-${provider})`} connectNulls={false}/>
        <Area type="monotone" dataKey="cost" stroke="none" fill={`url(#costFill-${provider})`} connectNulls={false}/>
        <Line
          type="monotone" dataKey="api" stroke={color} strokeWidth={2.5} name="API Price"
          dot={{r:4,fill:color,stroke:"rgba(10,10,16,0.9)",strokeWidth:2}}
          activeDot={{r:6,fill:color,stroke:"rgba(10,10,16,0.9)",strokeWidth:2}}
        />
        <Line
          type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" name="Est. Cost"
          dot={{r:3.5,fill:"#ef4444",stroke:"rgba(10,10,16,0.9)",strokeWidth:2}}
          activeDot={{r:5.5,fill:"#ef4444",stroke:"rgba(10,10,16,0.9)",strokeWidth:2}}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default function FrontierPricingCost() {
  const [metric,setMetric] = useState("output");
  const [logScale,setLogScale] = useState(true);
  const [hideOutliers,setHideOutliers] = useState(true);

  const btn = (active: boolean): React.CSSProperties => ({
    padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:12,fontWeight:500,fontFamily:"'DM Sans',sans-serif",
    letterSpacing:"0.02em",transition:"all 0.2s",
    background:active?"rgba(255,255,255,0.12)":"transparent",
    color:active?"#fff":"rgba(255,255,255,0.4)",
  });

  const card = (provider: string, color: string): React.CSSProperties => ({
    background:"rgba(255,255,255,0.02)",borderRadius:14,
    border:"1px solid rgba(255,255,255,0.06)",borderTop:`2px solid ${color}`,
    padding:"0 0 8px",flex:1,minWidth:300,
  });

  return (
    <div style={{
      width:"100%",minHeight:"100vh",
      background:"linear-gradient(170deg,#06060a 0%,#0a0b12 40%,#0e0f18 100%)",
      fontFamily:"'DM Sans',sans-serif",color:"#fff",
      padding:"36px 24px",boxSizing:"border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{maxWidth:1100,margin:"0 auto 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
          <div style={{width:4,height:26,borderRadius:2,background:"linear-gradient(180deg,#10a37f,#d97706,#4285f4)"}}/>
          <h1 style={{
            fontSize:23,fontWeight:700,margin:0,letterSpacing:"-0.03em",
            background:"linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.65) 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          }}>
            API Price vs. Estimated Provider Cost
          </h1>
        </div>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:13,margin:"4px 0 0 14px",lineHeight:1.5}}>
          {metric==="output"?"Output":"Input"} $/MTok &middot; Solid line = API price charged &middot; <span style={{color:"#ef4444"}}>Dashed line = estimated inference cost to provider</span>
        </p>
        <p style={{color:"rgba(255,255,255,0.22)",fontSize:11,margin:"4px 0 0 14px",lineHeight:1.4}}>
          The gap between lines represents implied gross margin. Cost estimates from FutureSearch, Epoch AI, Alderson, TPU cost modeling. Hover for details.
        </p>
      </div>

      {/* Controls */}
      <div style={{maxWidth:1100,margin:"0 auto 18px",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
        <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:8,padding:3,border:"1px solid rgba(255,255,255,0.06)"}}>
          <button onClick={()=>setMetric("output")} style={btn(metric==="output")}>Output Price</button>
          <button onClick={()=>setMetric("input")} style={btn(metric==="input")}>Input Price</button>
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:8,padding:3,border:"1px solid rgba(255,255,255,0.06)"}}>
          <button onClick={()=>setLogScale(true)} style={btn(logScale)}>Log</button>
          <button onClick={()=>setLogScale(false)} style={btn(!logScale)}>Linear</button>
        </div>
        <button onClick={()=>setHideOutliers(!hideOutliers)} style={{
          ...btn(hideOutliers),
          background:hideOutliers?"rgba(217,119,6,0.12)":"rgba(255,255,255,0.04)",
          border:hideOutliers?"1px solid rgba(217,119,6,0.25)":"1px solid rgba(255,255,255,0.06)",
          borderRadius:8,
        }}>
          {hideOutliers?"✕ ":""}Hide Outliers
        </button>
      </div>

      {/* Legend */}
      <div style={{maxWidth:1100,margin:"0 auto 16px",display:"flex",gap:20,alignItems:"center",paddingLeft:14}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <svg width={20} height={3}><line x1={0} y1={1.5} x2={20} y2={1.5} stroke="rgba(255,255,255,0.5)" strokeWidth={2.5}/></svg>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>API Price</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <svg width={20} height={3}><line x1={0} y1={1.5} x2={20} y2={1.5} stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2"/></svg>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Est. Provider Cost</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:14,height:10,borderRadius:2,background:"linear-gradient(180deg,rgba(255,255,255,0.1),transparent)",border:"1px solid rgba(255,255,255,0.08)"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Gap = implied margin</span>
        </div>
      </div>

      {/* Charts */}
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:20}}>
        {Object.entries(PROVIDERS).map(([name,{color}])=>(
          <div key={name} style={card(name,color)}>
            <div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 8px ${color}44`}}/>
              <h2 style={{fontSize:15,fontWeight:600,margin:0,color:"rgba(255,255,255,0.8)"}}>{name}</h2>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"'Space Mono',monospace",marginLeft:"auto"}}>
                {metric==="output"?"Output":"Input"} $/MTok · log={logScale?"on":"off"}
              </span>
            </div>
            <ProviderChart provider={name} color={color} data={RAW} metric={metric} logScale={logScale} hideOutliers={hideOutliers}/>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{maxWidth:1100,margin:"24px auto 0",display:"flex",gap:14,flexWrap:"wrap"}}>
        {[
          {label:"OpenAI GPT-5 bundle",val:"~48%",sub:"Gross margin (Epoch AI, Jan 2026)",c:"#10a37f"},
          {label:"Anthropic overall",val:"~40%",sub:"Gross margin (The Information, 2025)",c:"#d97706"},
          {label:"Google (TPU advantage)",val:"~60–80%",sub:"Est. raw compute margin",c:"#4285f4"},
        ].map((s,i)=>(
          <div key={i} style={{
            flex:1,minWidth:200,background:"rgba(255,255,255,0.02)",borderRadius:12,
            border:"1px solid rgba(255,255,255,0.06)",padding:"14px 18px",
          }}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'Space Mono',monospace"}}>{s.val}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.22)",marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{maxWidth:1100,margin:"16px auto 0",textAlign:"center",color:"rgba(255,255,255,0.15)",fontSize:9,fontFamily:"'Space Mono',monospace",lineHeight:1.6}}>
        Cost estimates from FutureSearch, Epoch AI, Alderson, SemiAnalysis, TPU modeling &middot; Raw compute only — actual gross margins lower due to cloud overhead<br/>
        Anthropic's ~40% gross margin vs. 80–95% raw compute margin gap = AWS/GCP intermediary costs + overprovisioning
      </div>
    </div>
  );
}
