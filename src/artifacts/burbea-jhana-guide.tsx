import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;
export const publishDate = "2026-03-16";

import React, { useState, useEffect, useRef } from "react";

const JHANA_DATA = [
  { num: 1, name: "First Jhāna", pali: "paṭhama-jhāna", primary: "Pīti (rapture)", born: "Withdrawal from hindrances", factors: ["Vitakka","Vicāra","Pīti","Sukha","Ekaggatā"], simile: "Bathman kneading soap powder with water — saturated, moisture-laden, permeated within and without", body: "Body dissolves into luminous pīti cloud", color: "#E76F51", refinement: 1, fabrication: 7 },
  { num: 2, name: "Second Jhāna", pali: "dutiya-jhāna", primary: "Sukha (happiness)", born: "Samādhi (composure)", factors: ["Pīti","Sukha","Ekaggatā"], simile: "A lake fed by underground spring — cool water welling up from within, suffusing the whole lake", body: "Body becomes happiness", color: "#c9a84c", refinement: 2, fabrication: 6 },
  { num: 3, name: "Third Jhāna", pali: "tatiya-jhāna", primary: "Sukha without pīti", born: "Fading of pīti", factors: ["Sukha","Ekaggatā"], simile: "Lotuses immersed in water, permeated from root to tip with cool water, flourishing without standing up", body: "Body becomes exquisite peace", color: "#2D6A4F", refinement: 3, fabrication: 5 },
  { num: 4, name: "Fourth Jhāna", pali: "catuttha-jhāna", primary: "Luminous stillness", born: "Abandoning happiness & pain", factors: ["Upekkhā","Ekaggatā"], simile: "A person wrapped from head to foot in white cloth — no part untouched by pure, bright awareness", body: "Pure bright awareness pervades body", color: "#457B9D", refinement: 4, fabrication: 4 },
  { num: 5, name: "Infinite Space", pali: "ākāsānañcāyatana", primary: "Boundless space", born: "Transcending form perceptions", factors: [], simile: "—", body: "No body, no solidity — just space", color: "#6B4C8A", refinement: 5, fabrication: 3 },
  { num: 6, name: "Infinite Consciousness", pali: "viññāṇañcāyatana", primary: "Boundless consciousness", born: "Transcending infinite space", factors: [], simile: "—", body: "Everything is awareness", color: "#3D348B", refinement: 6, fabrication: 2 },
  { num: 7, name: "Nothingness", pali: "ākiñcaññāyatana", primary: "Nothing", born: "Transcending infinite consciousness", factors: [], simile: "—", body: "Nothing, without container", color: "#1B4965", refinement: 7, fabrication: 1 },
  { num: 8, name: "Neither Perception Nor Non-Perception", pali: "nevasaññānāsaññāyatana", primary: "Limit of perception", born: "Transcending nothingness", factors: [], simile: "—", body: "Unspeakably subtle", color: "#264653", refinement: 8, fabrication: 0.3 },
];

const HINDRANCE_DATA = [
  { name: "Sloth & Torpor", icon: "◕", antidotes: ["Long breath (energizes)","Emphasize in-breath","More pegs (counting, repeated phrases)","Bright white light filling body","Expand awareness to room-size","Open eyes, brighten attention"], subtle: "Sinking — just slightly less bright, less sharp" },
  { name: "Restlessness", icon: "↯", antidotes: ["Long, soothing breath","Expand awareness very wide","Allow & welcome restless sensations","Sweeping attention through body","Find a soothing breath-point on body","Insight: see restlessness as not-self"], subtle: "Drifting — slightly more tendency to follow thoughts" },
  { name: "Sensual Desire", icon: "◉", antidotes: ["Focus on the energy, not the image","Open to arousal in energy body space","Ride it — it's close to pīti","Filter out image, keep energy","Transform into pure vitality"], subtle: "Subtle pull toward pleasant sense contacts" },
  { name: "Ill-will / Aversion", icon: "×", antidotes: ["Switch to mettā practice","Notice how aversion feels in YOUR body","Open wider — include sounds, expand","Try directly 'turning down' aversion","Exchanging self and other practice","THE KILLER at subtle levels"], subtle: "Micro-negativity: 'not quite good enough', 'yesterday was better'" },
  { name: "Doubt", icon: "?", antidotes: ["Formulate clear questions","Deal with questions OUTSIDE meditation","Promise the mind: 'I'll address this later'","Ask a teacher","Remember past successes"], subtle: "Semi-conscious uncertainty undermining commitment" },
];

const SASSIE = [
  { letter: "S", word: "Suffusion", type: "finite", desc: "Spread through whole body. Once done — tick off.", color: "#2D6A4F" },
  { letter: "A", word: "Absorption", type: "infinite", desc: "Get more inside it. Direction, not destination.", color: "#457B9D" },
  { letter: "S", word: "Sustain quality", type: "infinite", desc: "Fewer gaps in pīti/sukha. More continuous.", color: "#457B9D" },
  { letter: "S", word: "Sustain attention", type: "infinite", desc: "Mind stays steadier. Less micro-drifting.", color: "#457B9D" },
  { letter: "I", word: "Intensity", type: "irrelevant", desc: "DOESN'T MATTER. Just needs to be pleasant.", color: "#9B2226" },
  { letter: "E", word: "Enjoyment", type: "primary", desc: "THE MOST IMPORTANT. Maximize enjoyment.", color: "#c9a84c" },
];

const NAV = [
  { id: "map", label: "Map", icon: "◈" },
  { id: "foundations", label: "Foundations", icon: "◇" },
  { id: "access", label: "Access", icon: "◆" },
  { id: "jhanas", label: "The Eight Jhānas", icon: "①" },
  { id: "hindrances", label: "Hindrances", icon: "⚡" },
  { id: "sassie", label: "SASSIE & Mastery", icon: "✦" },
  { id: "meditations", label: "Guided Practices", icon: "◎" },
  { id: "insight", label: "Insight & Emptiness", icon: "◌" },
  { id: "games", label: "Practice Games", icon: "▶" },
];

function useTheme() {
  const [dk, setDk] = useState(true);
  useEffect(() => {
    const check = () => setDk(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dk ? { bg:"#0a0a0c",card:"#141418",surface:"#1c1c22",text:"#e8e6e3",muted:"#7a7a85",border:"#2a2a33",accent:"#c9a84c",teal:"#7B9EA8" }
    : { bg:"#f5f3ef",card:"#eae7e1",surface:"#ddd9d1",text:"#1a1a1e",muted:"#6a6a72",border:"#c5c1b8",accent:"#9a7a2c",teal:"#5a7a84" };
}

const M = ({children,style:s}) => <span style={{fontFamily:"'IBM Plex Mono',monospace",...s}}>{children}</span>;

function MetaGrid({items,T}){return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:6,margin:"12px 0"}}>{items.map(([l,v],i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"6px 8px"}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,textTransform:"uppercase",letterSpacing:"0.08em",color:T.muted,marginBottom:2}}>{l}</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:T.text}}>{v}</div></div>)}</div>}
function Quote({children,source,T}){return <blockquote style={{borderLeft:`2px solid ${T.accent}`,paddingLeft:14,margin:"14px 0",fontStyle:"italic",color:T.muted,fontSize:13,lineHeight:1.7}}>{children}{source&&<div style={{marginTop:4,fontStyle:"normal",fontFamily:"'IBM Plex Mono',monospace",fontSize:8,textTransform:"uppercase",letterSpacing:"0.08em"}}>— {source}</div>}</blockquote>}
function Warn({children,T}){return <div style={{background:"rgba(155,34,38,0.06)",border:"1px solid rgba(155,34,38,0.25)",borderRadius:3,padding:"10px 14px",margin:"12px 0",fontSize:13,lineHeight:1.6,color:T.text}}>{children}</div>}
function Code({children,T}){return <pre style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,padding:"10px 12px",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,lineHeight:1.7,color:T.muted,whiteSpace:"pre-wrap",margin:"10px 0",overflowX:"auto"}}>{children}</pre>}
function H3({children,T}){return <h3 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:T.accent,margin:"22px 0 8px"}}>{children}</h3>}
function Table({headers,rows,T}){return <div style={{overflowX:"auto",margin:"8px 0"}}><table style={{width:"100%",minWidth:400,borderCollapse:"collapse",fontSize:12}}><thead><tr>{headers.map(h=><th key={h} style={{textAlign:"left",padding:"5px 7px",borderBottom:`1px solid ${T.border}`,fontFamily:"'IBM Plex Mono',monospace",fontSize:8,textTransform:"uppercase",color:T.muted}}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={{padding:"5px 7px",borderBottom:`1px solid ${T.border}`,color:j===0?T.accent:j===1?T.text:T.muted,fontWeight:j===0?500:400,...(j===0?{fontFamily:"'IBM Plex Mono',monospace",fontSize:11}:{})}}>{c}</td>)}</tr>)}</tbody></table></div>}

// ═══ SVG DIAGRAMS ═══

function SpectrumDiagram({T}){
  return <div style={{margin:"16px 0",overflowX:"auto"}}><svg viewBox="0 0 620 260" style={{width:"100%",maxWidth:620,fontFamily:"'IBM Plex Mono',monospace"}}>
    <text x={310} y={16} textAnchor="middle" fontSize={8} fill={T.muted} letterSpacing="0.1em">THE SPECTRUM OF FABRICATION & REFINEMENT</text>
    <line x1={35} y1={210} x2={600} y2={210} stroke={T.border}/>
    <text x={35} y={228} fontSize={7} fill={T.muted}>MORE FABRICATED</text>
    <text x={600} y={228} fontSize={7} fill={T.muted} textAnchor="end">LESS FABRICATED</text>
    <text x={317} y={248} textAnchor="middle" fontSize={7} fill={T.accent}>← increasing refinement & subtlety →</text>
    {JHANA_DATA.map((j,i)=>{const x=42+i*70;const h=25+(8-i)*18;return <g key={i}>
      <rect x={x} y={210-h} width={56} height={h} rx={2} fill={j.color} opacity={0.55}/>
      <text x={x+28} y={210-h-5} textAnchor="middle" fontSize={9} fill={T.text} fontWeight={600}>{j.num}</text>
      <text x={x+28} y={210-h/2+3} textAnchor="middle" fontSize={6} fill="#fff" opacity={0.9}>{j.primary.split("(")[0].trim().substring(0,10)}</text>
    </g>})}
    <line x1={322} y1={28} x2={322} y2={208} stroke={T.border} strokeDasharray="3,3"/>
    <text x={178} y={38} textAnchor="middle" fontSize={7} fill={T.muted}>FORM JHĀNAS</text>
    <text x={460} y={38} textAnchor="middle" fontSize={7} fill={T.muted}>FORMLESS JHĀNAS</text>
    {["Body=pīti","Body=sukha","Body=peace","Body=stillness","No body","All=awareness","Nothing","Beyond"].map((t,i)=><text key={i} x={70+i*70} y={55+i*6} fontSize={6} fill={T.teal}>{t}</text>)}
  </svg></div>;
}

function FlowDiagram({T}){
  const bx=(x:any,y:any,w:any,h:any,t:any,c?:any,sub?:any)=><g><rect x={x} y={y} width={w} height={h} rx={3} fill={c||T.card} stroke={c?c:T.border} fillOpacity={c?0.15:1}/><text x={x+w/2} y={y+h/2+(sub?-3:4)} textAnchor="middle" fontSize={8} fill={T.text} fontWeight={500}>{t}</text>{sub&&<text x={x+w/2} y={y+h/2+9} textAnchor="middle" fontSize={7} fill={T.muted}>{sub}</text>}</g>;
  const ar=(x1,y1,x2,y2)=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.border} strokeWidth={0.8}/>;
  return <div style={{margin:"16px 0",overflowX:"auto"}}><svg viewBox="0 0 520 330" style={{width:"100%",maxWidth:520,fontFamily:"'IBM Plex Mono',monospace"}}>
    {bx(200,5,120,26,"BEGIN PRACTICE",T.accent)}
    {ar(260,31,260,48)}
    {bx(185,48,150,22,"Choose base practice")}
    {ar(210,70,90,95)}{ar(260,70,260,95)}{ar(310,70,430,95)}
    {bx(40,95,100,30,"Energy Body","#2D6A4F","+ Breath")}{bx(210,95,100,30,"One-Point","#E76F51","Focus")}{bx(380,95,100,30,"Mettā /","#6B4C8A","Insight")}
    {ar(90,125,260,155)}{ar(260,125,260,155)}{ar(430,125,260,155)}
    {bx(190,155,140,26,"Well-being arises",T.accent)}
    {ar(260,181,260,200)}
    <polygon points="235,200 285,200 260,220" fill={T.surface} stroke={T.border}/>
    <text x={260} y={214} textAnchor="middle" fontSize={7} fill={T.text}>Steady? Pleasant?</text>
    {ar(235,210,160,210)}<text x={155} y={207} textAnchor="end" fontSize={7} fill="#9B2226">No → keep going</text>
    {ar(260,220,260,245)}<text x={270} y={237} fontSize={7} fill="#2D6A4F">Yes</text>
    {bx(185,245,150,26,"Pīti = PRIMARY object","#2D6A4F")}
    {ar(260,271,260,290)}
    {bx(195,290,130,24,"SASSIE → Jhāna",T.accent)}
  </svg></div>;
}

function ThirdLevelsDiagram({T}){
  return <div style={{margin:"16px 0",overflowX:"auto"}}><svg viewBox="0 0 460 160" style={{width:"100%",maxWidth:460,fontFamily:"'IBM Plex Mono',monospace"}}>
    {[{y:5,l:"Level 3",d:"Realm of peace — vast, otherworldly space",c:"#2D6A4F",w:420},
      {y:50,l:"Level 2",d:"'My' peacefulness — intimate, warm, tender",c:"#457B9D",w:310},
      {y:95,l:"Level 1",d:"Contentment — satisfaction, thirst slaked",c:"#8B6914",w:200}
    ].map((v,i)=><g key={i}><rect x={15} y={v.y} width={v.w} height={36} rx={3} fill={v.c} opacity={0.12} stroke={v.c}/>
      <text x={25} y={v.y+15} fontSize={8} fill={v.c} fontWeight={600}>{v.l}</text>
      <text x={25} y={v.y+28} fontSize={7} fill={T.muted}>{v.d}</text></g>)}
    <text x={450} y={22} fontSize={6} fill={T.muted} textAnchor="end">Most refined ↑</text>
    <text x={450} y={115} fontSize={6} fill={T.muted} textAnchor="end">Entry point ↓</text>
    <text x={230} y={150} textAnchor="middle" fontSize={7} fill={T.accent}>Order of discovery varies. All three are the territory of third jhāna.</text>
  </svg></div>;
}

function SassieVisual({T}){
  return <div style={{margin:"16px 0",overflowX:"auto"}}><svg viewBox="0 0 590 170" style={{width:"100%",maxWidth:590,fontFamily:"'IBM Plex Mono',monospace"}}>
    {SASSIE.map((s,i)=>{const x=5+i*97;const tag=s.type==="finite"?"DONE ONCE":s.type==="irrelevant"?"IRRELEVANT":s.type==="primary"?"KEY":"INFINITE →";
    return <g key={i}><rect x={x} y={5} width={90} height={120} rx={3} fill={T.card} stroke={s.color} strokeWidth={1.5}/>
      <text x={x+45} y={35} textAnchor="middle" fontSize={26} fill={s.color} fontWeight={600}>{s.letter}</text>
      <text x={x+45} y={50} textAnchor="middle" fontSize={7} fill={T.text} fontWeight={500}>{s.word}</text>
      <rect x={x+10} y={58} width={70} height={12} rx={2} fill={s.color} opacity={0.15}/>
      <text x={x+45} y={67} textAnchor="middle" fontSize={6} fill={s.color} fontWeight={600}>{tag}</text>
      <text x={x+45} y={86} textAnchor="middle" fontSize={6} fill={T.muted}>{s.desc.substring(0,38)}</text>
      <text x={x+45} y={95} textAnchor="middle" fontSize={6} fill={T.muted}>{s.desc.substring(38,76)}</text>
    </g>})}
    <text x={295} y={145} textAnchor="middle" fontSize={8} fill={T.accent} fontWeight={500}>Don't just sit there — do something!</text>
    <text x={295} y={158} textAnchor="middle" fontSize={7} fill={T.muted}>S·A·S·S = the work | I = off the hook | E = the point</text>
  </svg></div>;
}

// ═══ GAMES ═══

function HindranceQuiz({T}){
  const Q=[
    {t:"Nice pīti but you keep thinking 'yesterday was better, it's not quite enough'",a:3,h:"Micro-negativity = subtle aversion"},
    {t:"Mind sharp, pīti building, but pulled into planning a creative project",a:1,h:"Excitement pulling = restlessness family"},
    {t:"Everything grey and flat. Awake but no brightness or sharpness",a:0,h:"Subtle torpor, not sleepy but dim"},
    {t:"Questioning whether this approach works, whether you're doing it right",a:4,h:"The paralyser"},
    {t:"Body prickly and unsettled, can't land anywhere comfortable",a:1,h:"Physical restlessness"},
    {t:"Strong pīti, then an image of someone attractive keeps returning",a:2,h:"The energy is close to pīti itself"},
  ];
  const [idx,setIdx]=useState(0);const [picked,setPicked]=useState(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);
  const pick=(i)=>{setPicked(i);if(i===Q[idx].a)setScore(s=>s+1);setTimeout(()=>{if(idx<Q.length-1){setIdx(idx+1);setPicked(null);}else setDone(true);},1400);};
  if(done)return <div style={{textAlign:"center",padding:16}}><div style={{fontSize:28,fontWeight:300,color:T.accent}}>{score}/{Q.length}</div><div style={{fontSize:12,color:T.muted,marginTop:6}}>Hindrance identification</div><button onClick={()=>{setIdx(0);setPicked(null);setScore(0);setDone(false);}} style={{marginTop:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"5px 14px",color:T.text,cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>Retry</button></div>;
  const q=Q[idx];
  return <div><M style={{fontSize:9,color:T.muted}}>SCENARIO {idx+1}/{Q.length}</M>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"10px 12px",margin:"8px 0",fontSize:13,lineHeight:1.6,color:T.text}}>"{q.t}"</div>
    <div style={{fontSize:11,color:T.muted,marginBottom:8}}>Which hindrance?</div>
    {HINDRANCE_DATA.map((h,i)=>{const ok=picked!==null&&i===q.a;const bad=picked===i&&i!==q.a;
    return <button key={i} onClick={()=>picked===null&&pick(i)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 10px",marginBottom:3,background:ok?"rgba(45,106,79,0.12)":bad?"rgba(155,34,38,0.08)":T.card,border:`1px solid ${ok?"#2D6A4F":bad?"#9B2226":T.border}`,borderRadius:3,cursor:picked===null?"pointer":"default",color:T.text,fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif",textAlign:"left"}}>
      <M style={{fontSize:12,color:T.muted}}>{h.icon}</M>{h.name}
      {ok&&<M style={{marginLeft:"auto",fontSize:8,color:"#2D6A4F"}}>{q.h}</M>}
      {bad&&<M style={{marginLeft:"auto",fontSize:8,color:"#9B2226"}}>✗</M>}
    </button>})}</div>;
}

function MatchGame({T}){
  const pairs=JHANA_DATA.slice(0,6).map(j=>({n:j.num,q:j.primary.split("(")[0].trim(),nm:j.name}));
  const [cards,setCards]=useState([]);const [flip,setFlip]=useState([]);const [matched,setMatched]=useState([]);const [moves,setMoves]=useState(0);
  useEffect(()=>{const c=[];pairs.forEach(p=>{c.push({id:`n${p.n}`,pair:p.n,label:`${p.n}`,sub:p.nm,type:"n"});c.push({id:`q${p.n}`,pair:p.n,label:p.q,sub:"Primary nimitta",type:"q"});});setCards(c.sort(()=>Math.random()-0.5));},[]);
  const tap=(i)=>{if(flip.length>=2||flip.includes(i)||matched.includes(cards[i]?.pair))return;const nf=[...flip,i];setFlip(nf);if(nf.length===2){setMoves(m=>m+1);if(cards[nf[0]].pair===cards[nf[1]].pair&&cards[nf[0]].type!==cards[nf[1]].type){setMatched(m=>[...m,cards[nf[0]].pair]);setTimeout(()=>setFlip([]),300);}else setTimeout(()=>setFlip([]),700);}};
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><M style={{fontSize:9,color:T.muted}}>Match jhāna ↔ primary nimitta</M><M style={{fontSize:9,color:T.accent}}>{matched.length}/{pairs.length} · {moves} moves</M></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>{cards.map((c,i)=>{const show=flip.includes(i)||matched.includes(c.pair);const done=matched.includes(c.pair);
    return <button key={c.id} onClick={()=>tap(i)} style={{height:58,borderRadius:3,border:`1px solid ${done?"#2D6A4F":T.border}`,background:done?"rgba(45,106,79,0.08)":show?T.surface:T.card,cursor:done?"default":"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:3,transition:"all 0.15s"}}>
      {show?<><span style={{fontSize:c.type==="n"?16:9,fontWeight:c.type==="n"?600:500,color:T.text,fontFamily:"'IBM Plex Mono',monospace",textAlign:"center",lineHeight:1.2}}>{c.label}</span><span style={{fontSize:6,color:T.muted,marginTop:1}}>{c.sub}</span></>:<span style={{fontSize:14,color:T.border}}>?</span>}
    </button>})}</div>
    {matched.length===pairs.length&&<div style={{textAlign:"center",marginTop:10,fontSize:12,color:T.accent}}>Done in {moves} moves!</div>}</div>;
}

function EffortLab({T}){
  const [e,setE]=useState(50);
  const s=e<15?{l:"Under-effort",d:"Sinking. Dull. Mind saggy. The ember goes out.",c:"#457B9D"}:e<35?{l:"Slightly under",d:"Comfortable but not alive. Missing subtle openings.",c:"#7B9EA8"}:e<=65?{l:"Sweet spot",d:"Alert, not tight. Sensitive. Responsive. The ember glows.",c:"#2D6A4F"}:e<=80?{l:"Slightly over",d:"Mind stimulated to think. Subtle tension creeps in.",c:"#c9a84c"}:{l:"Over-effort",d:"Headache. Body shaking. Squeezing a banana skin.",c:"#9B2226"};
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><M style={{fontSize:9,color:T.muted}}>EFFORT LEVEL</M><M style={{fontSize:11,color:s.c,fontWeight:600}}>{s.l}</M></div>
    <input type="range" min={0} max={100} value={e} onChange={ev=>setE(+ev.target.value)} style={{width:"100%",accentColor:s.c,cursor:"pointer"}}/>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:7,color:T.muted,fontFamily:"'IBM Plex Mono',monospace",marginTop:1}}><span>Too little</span><span>Just right</span><span>Too much</span></div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"8px 10px",marginTop:8,fontSize:12,color:T.muted,lineHeight:1.6}}>{s.d}</div>
    <div style={{marginTop:8,fontSize:11,color:T.text}}>The sweet spot <em>shifts</em> as samādhi deepens. A tiny bit too much effort has proportionately more impact at deeper levels. This question never goes away.</div></div>;
}

// ═══ SECTIONS ═══

function MapSection({T}){return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>The Jhāna Map</h2>
  <p style={{fontSize:14,lineHeight:1.7,color:T.text,margin:"0 0 10px"}}>Grounded in Rob Burbea's 2019 jhāna retreat at Gaia House. The orientation: jhānas as <em>perception attainments</em> — training malleability of perception, not just concentration.</p>
  <MetaGrid items={[["Source","Gaia House 2019"],["Teacher","Rob Burbea"],["Approach","Perception-based"],["Key","Fabrication"],["Jhānas","All eight"],["Core","Sensitivity + play"]]} T={T}/>
  <SpectrumDiagram T={T}/>
  <Quote T={T} source="The Buddha, SN 12:23">Jhāna depends on happiness.</Quote>
  <H3 T={T}>Five Supports for Base Happiness</H3>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:5}}>{["Appreciation","Gratitude","Beauty","Connection","Openness"].map((s,i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"8px 6px",textAlign:"center",fontSize:11,color:T.text}}>{s}</div>)}</div>
  <Warn T={T}>We do not want brittle jhānas. Openness of heart easily outweighs focus or concentration for jhāna practice.</Warn></>;}

function FoundationsSection({T}){return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Foundations</h2>
  <H3 T={T}>Energy Body — Two Defining Qualities</H3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,margin:"8px 0"}}>{[["INTEGRATION","The space feels like one whole — not separate parts","#2D6A4F"],["HOMOGENEITY","Awareness inhabits the space equally — IS the space","#457B9D"]].map(([t,d,c],i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:10}}><M style={{fontSize:9,color:c}}>{t}</M><div style={{fontSize:12,lineHeight:1.5,color:T.text,marginTop:4}}>{d}</div></div>)}</div>
  <H3 T={T}>Three Aspects of the Whole-Body Breath</H3>
  <Table T={T} headers={["Aspect","Notice","Guidance"]} rows={[["Expansion","Whole space expands/contracts with breath","Not just ribcage — entire energy body"],["Energization","In-breath energizes; out-breath relaxes","Feel throughout the whole space"],["Currents","Streams radiating from points","If you don't notice them, imagine them"]]}/>
  <H3 T={T}>The Master Principles</H3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>{[["Sensitivity","Notice subtle qualities"],["Responsiveness","Adjust to what's needed NOW"],["Willingness","Experiment. Opposite of inertia"]].map(([t,d],i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"8px 6px",textAlign:"center"}}><div style={{fontWeight:500,fontSize:12,color:T.text}}>{t}</div><div style={{fontSize:10,color:T.muted,marginTop:3}}>{d}</div></div>)}</div>
  <Quote T={T} source="Rob Burbea">Like improvising music or making love — sensitive, responsive, willing to try things differently.</Quote></>;}

function AccessSection({T}){return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Accessing Concentration</h2>
  <H3 T={T}>Quality Over Quantity — Three Dimensions</H3>
  <Table T={T} headers={["Dimension","Principle","Analogy"]} rows={[["Subtlety","Object subtle → attention matches down","Tasting exquisite food: delicate poise"],["Directionality","Probing vs. Receiving — constant play","Riding a bicycle: lean left, lean right"],["Intensity","Bright, energized, not squeezing","Listening for faint sound: poise, not squint"]]}/>
  <H3 T={T}>Flowchart: Base Practice → Jhāna</H3>
  <FlowDiagram T={T}/>
  <H3 T={T}>Two Approaches Compared</H3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{[["CONCENTRATION","#E76F51","One point. Steady focus. Energy accumulates. Pīti erupts suddenly like lightning."],["ENERGY BODY","#2D6A4F","Whole space. Find ember. Coax gently. Pīti builds gradually. Infinite possibilities."]].map(([t,c,d],i)=><div key={i} style={{background:T.card,border:`1px solid ${c}`,borderRadius:3,padding:10}}><M style={{fontSize:9,color:c}}>{t}</M><div style={{fontSize:11,lineHeight:1.5,color:T.muted,marginTop:4}}>{d}</div></div>)}</div>
  <p style={{fontSize:11,color:T.muted,marginTop:8,fontStyle:"italic"}}>Not mutually exclusive. Sometimes focus, sometimes surrender. Improvised dance.</p></>;}

function JhanasSection({T}){
  const [sel,setSel]=useState(0);const j=JHANA_DATA[sel];
  return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>The Eight Jhānas</h2>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",margin:"10px 0"}}>{JHANA_DATA.map((jj,i)=><button key={i} onClick={()=>setSel(i)} style={{background:sel===i?jj.color+"22":"transparent",border:`1px solid ${sel===i?jj.color:T.border}`,borderRadius:3,padding:"4px 10px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:sel===i?T.text:T.muted}}>{jj.num}</button>)}</div>
    <MetaGrid items={[["Name",j.name],["Pāli",j.pali],["Primary",j.primary],["Born of",j.born],["Factors",j.factors.length||"—"],["Body",j.body.substring(0,28)]]} T={T}/>
    {j.simile!=="—"&&<Quote T={T} source="The Buddha">{j.simile}</Quote>}
    {sel===0&&<><H3 T={T}>Five Factors</H3><Table T={T} headers={["Factor","Role"]} rows={[["Vitakka-vicāra","Creative investigative thinking. Like a jazz musician."],["Ekaggatā","'One thing prominent' — pīti dominates. NOT one spatial point."],["Pīti","PRIMARY. Pleasant physical sensations, non-sensual source."],["Sukha","Present but secondary. Consciousness captivated by pīti."]]}/><Warn T={T}>Pīti too intense? Open MORE. Surrender. Let it flow up and out. Contraction IS the problem.</Warn></>}
    {sel===1&&<><H3 T={T}>Tricks: First → Second</H3><Code T={T}>{`(1) Drop a question: "What emotion am I feeling?"
(2) Whisper "happiness" into the citta
(3) Imagine pīti fountain — shoots up, falls as sukha
(4) Let saturation ripen the mango naturally

"Don't paint an unripe mango." — Ajaan Geoff`}</Code><p style={{fontSize:13,lineHeight:1.7,color:T.text}}>Most significant aspect: NOT quieting of thought. It's the <strong>happiness</strong>. Bathing in it transforms the being.</p></>}
    {sel===2&&<ThirdLevelsDiagram T={T}/>}
    {sel>=4&&<Warn T={T}>Attachment to view is the deepest danger. "Awareness is ultimate." The jhāna map IS the remedy — going beyond reveals each state as fabricated.</Warn>}
    <H3 T={T}>Quick Reference Table</H3>
    <div style={{overflowX:"auto"}}><table style={{width:"100%",minWidth:480,borderCollapse:"collapse",fontSize:11}}><thead><tr>{["#","Primary Nimitta","Born Of","Body Becomes"].map(h=><th key={h} style={{textAlign:"left",padding:"4px 6px",borderBottom:`1px solid ${T.border}`,fontFamily:"'IBM Plex Mono',monospace",fontSize:7,textTransform:"uppercase",color:T.muted}}>{h}</th>)}</tr></thead><tbody>{JHANA_DATA.map((jj,i)=><tr key={i} onClick={()=>setSel(i)} style={{background:i===sel?T.card:"transparent",cursor:"pointer"}}><td style={{padding:"4px 6px",borderBottom:`1px solid ${T.border}`,color:jj.color,fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>{jj.num}</td><td style={{padding:"4px 6px",borderBottom:`1px solid ${T.border}`,color:T.text}}>{jj.primary}</td><td style={{padding:"4px 6px",borderBottom:`1px solid ${T.border}`,color:T.muted,fontSize:10}}>{jj.born}</td><td style={{padding:"4px 6px",borderBottom:`1px solid ${T.border}`,color:T.muted,fontSize:10}}>{jj.body}</td></tr>)}</tbody></table></div></>;}

function HindrancesSection({T}){
  const [sel,setSel]=useState(null);
  return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Hindrances: The Hidden Treasure</h2>
    <p style={{fontSize:14,lineHeight:1.7,color:T.text,margin:"0 0 10px"}}>The hindrances ARE jhāna practice — the dark, rich underbelly delivering its own gold.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,margin:"10px 0"}}>{[["Don't believe them","Stories fabricated by the poison itself","#9B2226"],["Don't take them personally","Arising means nothing about your capability","#6B4C8A"]].map(([t,d,c],i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:10}}><M style={{fontSize:9,color:c}}>WISDOM #{i+1}</M><div style={{fontSize:13,fontWeight:500,color:T.text,marginTop:3}}>{t}</div><div style={{fontSize:11,color:T.muted,marginTop:3}}>{d}</div></div>)}</div>
    <H3 T={T}>Antidotes Reference</H3>
    {HINDRANCE_DATA.map((h,i)=><div key={i} style={{marginBottom:4}}>
      <button onClick={()=>setSel(sel===i?null:i)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:sel===i?T.surface:T.card,border:`1px solid ${T.border}`,borderRadius:sel===i?"3px 3px 0 0":3,cursor:"pointer",color:T.text,fontSize:13,fontFamily:"'IBM Plex Sans',sans-serif"}}><span><M style={{marginRight:6,fontSize:12,color:T.muted}}>{h.icon}</M>{h.name}</span><M style={{fontSize:10,color:T.muted,transform:sel===i?"rotate(45deg)":"none",transition:"transform 0.15s"}}>+</M></button>
      {sel===i&&<div style={{padding:"8px 10px",background:T.card,borderRadius:"0 0 3px 3px",border:`1px solid ${T.border}`,borderTop:"none"}}>{h.antidotes.map((a,j)=><div key={j} style={{display:"flex",gap:6,marginBottom:3,fontSize:11,color:T.muted}}><M style={{color:T.accent,fontSize:9}}>→</M>{a}</div>)}<div style={{marginTop:6,padding:"5px 8px",background:"rgba(155,34,38,0.05)",borderRadius:3,fontSize:10,color:T.muted}}><strong style={{color:T.text}}>Subtle:</strong> {h.subtle}</div></div>}
    </div>)}
    <Warn T={T}>Aversion is the killer at subtle levels. It colours every perception, every memory. Watch for it like a hawk.</Warn></>;}

function SassieSection({T}){return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>SASSIE & Mastery</h2>
  <p style={{fontSize:14,lineHeight:1.7,color:T.text,margin:"0 0 4px"}}>What to do inside a jhāna — and what not to worry about.</p>
  <SassieVisual T={T}/>
  <H3 T={T}>SASSIE Detail</H3>
  <Table T={T} headers={["","Factor","Nature","Relationship"]} rows={SASSIE.map(s=>[s.letter,s.word,s.type.toUpperCase(),s.desc])}/>
  <H3 T={T}>Mastery Checklist</H3>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{["Access at will by subtle intention","Sustain for extended periods","Access in any posture","Navigate to any known jhāna","Modulate within sub-levels","Walk around in jhānic quality","Begin sittings directly","Leapfrog: skip levels"].map((m,i)=><div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"6px 8px"}}><M style={{fontSize:9,color:T.accent,marginTop:1}}>☐</M><span style={{fontSize:11,color:T.text,lineHeight:1.3}}>{m}</span></div>)}</div>
  <H3 T={T}>Effort Spectrum Lab</H3><EffortLab T={T}/>
  <Quote T={T} source="Rob Burbea">If you come and say "I got to the eighth jhāna in three weeks" — what a shame. There's no way you'd have gotten the mastery.</Quote></>;}

function MeditationsSection({T}){
  const meds=[
    {t:"Counting Within the Breath",d:"20–30m",l:"Foundation",steps:["Posture: poise between alertness and softness","Whole-body awareness — slightly larger than physical body","Longest comfortable breath: slow, smooth, subtle","Count within: in 1→9, turn, out 9→1","Hold 4 objects: breath + body + hearing + optionally seeing numbers","Shorten to 6, then 3. Brighten where attention dims","Return to 6→9. Release count, keep whole-body awareness"],n:"More pegs for attention. Can reach edge of first jhāna."},
    {t:"Energy Body + Breath",d:"30–45m",l:"Foundation",steps:["Settle posture. Feel openness AND uprightness","Re-expand awareness (it shrinks 1000 times)","Longest breath. Notice expansion/contraction of whole space","Energization (in) / relaxation (out) throughout field","Breath at different entry points: solar plexus, heart, crown...","Key: what breath gives the nicest feeling in this space?","Don't default. Experiment endlessly"],n:"Sensitivity + responsiveness + willingness."},
    {t:"Working with Pīti",d:"45–90m",l:"Intermediate",steps:["Base practice until pīti (steady 2-3 min, definitely pleasant)","Spread: expand awareness — pīti fills like gas in balloon","MODE 1 PROBING: Arrow → bull's-eye. Penetrate, nuzzle","MODE 2 SUNBATHING: Open, receive, surrender, soak","Alternate modes — this IS the bathman kneading soap","Too intense? Open MORE. Counterintuitive","Find the pleasure. How much can you ENJOY?"],n:"Don't underestimate how much we prevent ourselves from enjoying."},
    {t:"Mettā for Jhāna",d:"30–45m",l:"Foundation",steps:["Whole-body awareness as background","Easy category. Phrases. Which catches a thermal?","Repeat resonant phrase. Ride the thermal","Adjust volume (loud→whisper) and density","When pīti/sukha arises: let well-being become primary","Mettā flavors it. Pīti becomes mettā. Radiating out"],n:"Mettā for jhāna ≠ mettā for cultivating mettā."},
    {t:"Walking in Jhāna",d:"20–45m",l:"Advanced",steps:["Stand at path end. Summon quality. Stand as long as needed","When stable: walk. What pace sustains the quality?","Focus on jhānic quality — NOT feet","Lost? Stop, stand, re-establish, resume"],n:"Need substantial sitting familiarity first."},
  ];
  const [open,setOpen]=useState(null);
  return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Guided Practices</h2>
    {meds.map((m,i)=><div key={i} style={{marginBottom:5}}>
      <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:open===i?T.surface:T.card,border:`1px solid ${T.border}`,borderRadius:open===i?"3px 3px 0 0":3,cursor:"pointer",color:T.text,fontSize:13,fontFamily:"'IBM Plex Sans',sans-serif",textAlign:"left"}}><div><span style={{fontWeight:500}}>{m.t}</span><M style={{fontSize:8,color:T.muted,marginLeft:8}}>{m.l}·{m.d}</M></div><M style={{fontSize:13,color:T.accent,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.15s"}}>+</M></button>
      {open===i&&<div style={{padding:"10px 12px",background:T.card,borderRadius:"0 0 3px 3px",border:`1px solid ${T.border}`,borderTop:"none"}}>{m.steps.map((s,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:6}}><M style={{fontSize:9,color:T.accent,minWidth:16,textAlign:"right",paddingTop:1}}>{String(j+1).padStart(2,"0")}</M><span style={{fontSize:12,lineHeight:1.5,color:T.text}}>{s}</span></div>)}<div style={{background:T.bg,borderRadius:3,padding:"6px 10px",marginTop:4,fontSize:10,color:T.muted,fontStyle:"italic"}}>{m.n}</div></div>}
    </div>)}</>;}

function InsightSection({T}){return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Insight, Emptiness & the Jhānas</h2>
  <H3 T={T}>The Fabrication Framework</H3>
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:12,margin:"8px 0"}}>
    <div style={{fontSize:13,lineHeight:1.7,color:T.text}}>Jhānas = spectrum of <strong>decreasing fabrication</strong>:</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,margin:"8px 0"}}>{["↓ Fabrication of dukkha","↓ Fabrication of self","↓ Fabrication of body","↓ Fabrication of perception"].map((f,i)=><M key={i} style={{fontSize:10,color:T.accent}}>{f}</M>)}</div>
    <div style={{fontSize:11,color:T.muted}}>Pīti = less fabricated body than normal. Sukha = even less. Space = body fabrication ceases.</div>
  </div>
  <H3 T={T}>Dependent Arising of Perception</H3>
  <p style={{fontSize:13,lineHeight:1.7,color:T.text}}>After leaving a jhāna, the world appears imbued with that quality. The deepest teaching: <strong>the world depends on how we look</strong>.</p>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,margin:"10px 0"}}>{[["Unkindness","Cold, hostile world"],["Kindness","Warm, connected world"],["Playing","Both empty. Freedom."]].map(([a,b],i)=><div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:"7px 8px",textAlign:"center"}}><div style={{fontSize:11,fontWeight:500,color:T.text}}>{a}</div><div style={{fontSize:10,color:T.muted,marginTop:2}}>{b}</div></div>)}</div>
  <Quote T={T} source="The Buddha, MN 66">This is a pleasure I will allow myself. A pleasure that should not be feared. Should be pursued and developed.</Quote>
  <Code T={T}>{`Jhānas develop:              Serving:
  Sensitivity         ←→     Emptiness practices
  Attunement                 Soulmaking
  Refinement                 Emotional healing
  Malleability               Relational skill
  Resources for letting go   Brahmavihāra

Awakening = emptiness = freedom of all ways of looking
Practising malleability IS practising awakening`}</Code>
  <Warn T={T}>Playing with perception — pain as pīti, body as luminous emptiness — is more significant than "did I achieve the third jhāna." The most important thing in the Dharma.</Warn></>;}

function GamesSection({T}){
  const [g,setG]=useState("quiz");
  return <><h2 style={{fontSize:22,fontWeight:300,margin:"0 0 6px"}}>Practice Games</h2>
    <p style={{fontSize:14,lineHeight:1.7,color:T.text,margin:"0 0 10px"}}>Interactive exercises for pattern recognition and deepening understanding.</p>
    <div style={{display:"flex",gap:3,marginBottom:12}}>{[["quiz","Hindrance ID"],["match","Jhāna Match"],["effort","Effort Lab"]].map(([id,l])=><button key={id} onClick={()=>setG(id)} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.06em",padding:"5px 12px",borderRadius:3,cursor:"pointer",background:g===id?T.accent+"22":"transparent",border:`1px solid ${g===id?T.accent:T.border}`,color:g===id?T.text:T.muted}}>{l}</button>)}</div>
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:3,padding:14}}>
      {g==="quiz"&&<HindranceQuiz T={T}/>}{g==="match"&&<MatchGame T={T}/>}{g==="effort"&&<EffortLab T={T}/>}
    </div></>;}

// ═══ MAIN ═══

const SEC={map:MapSection,foundations:FoundationsSection,access:AccessSection,jhanas:JhanasSection,hindrances:HindrancesSection,sassie:SassieSection,meditations:MeditationsSection,insight:InsightSection,games:GamesSection};

export default function App(){
  const T=useTheme();const [nav,setNav]=useState("map");const [side,setSide]=useState(false);const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=0;setSide(false);},[nav]);
  const Page=SEC[nav];const ci=NAV.findIndex(n=>n.id===nav);
  const isMobile=typeof window!=="undefined"&&window.innerWidth<700;
  return <div style={{fontFamily:"'IBM Plex Sans',sans-serif",color:T.text,background:T.bg,height:"100vh",width:"100%",display:"flex",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    {isMobile&&<button onClick={()=>setSide(!side)} style={{position:"fixed",top:7,left:7,zIndex:100,background:T.surface,border:`1px solid ${T.border}`,borderRadius:3,padding:"4px 8px",color:T.text,fontFamily:"'IBM Plex Mono',monospace",fontSize:12,cursor:"pointer"}}>{side?"×":"☰"}</button>}
    <nav style={{width:240,minWidth:240,background:T.card,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",...(isMobile?{position:"fixed",top:0,left:side?0:-260,height:"100vh",zIndex:90,transition:"left 0.15s ease"}:{})}}>
      <div style={{padding:"14px 14px 10px",borderBottom:`1px solid ${T.border}`}}>
        <M style={{fontSize:8,textTransform:"uppercase",letterSpacing:"0.12em",color:T.accent}}>Practice Guide</M>
        <div style={{fontSize:15,fontWeight:300,marginTop:2}}>Practising the Jhānas</div>
        <M style={{fontSize:9,color:T.muted,display:"block",marginTop:2}}>Rob Burbea · Gaia House 2019</M>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>{NAV.map(n=><button key={n.id} onClick={()=>setNav(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:7,padding:"6px 14px",background:"none",border:"none",borderLeft:nav===n.id?`2px solid ${T.accent}`:"2px solid transparent",cursor:"pointer",color:nav===n.id?T.text:T.muted,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,textAlign:"left",transition:"all 0.15s"}}><M style={{fontSize:9,color:nav===n.id?T.accent:T.muted,minWidth:14}}>{n.icon}</M>{n.label}</button>)}</div>
    </nav>
    <main ref={ref} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
      <div style={{position:"sticky",top:0,background:T.bg,borderBottom:`1px solid ${T.border}`,padding:"7px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10,...(isMobile?{paddingLeft:44}:{})}}>
        <M style={{fontSize:8,textTransform:"uppercase",letterSpacing:"0.1em",color:T.muted}}>{NAV[ci]?.icon} {NAV[ci]?.label}</M>
        <M style={{fontSize:8,color:T.muted}}>{ci+1}/{NAV.length}</M>
      </div>
      <div style={{padding:isMobile?"16px 12px 44px":"22px 24px 44px",maxWidth:680,flex:1}}><Page T={T}/></div>
      <div style={{borderTop:`1px solid ${T.border}`,padding:"8px 24px",display:"flex",justifyContent:"space-between"}}>
        {ci>0?<button onClick={()=>setNav(NAV[ci-1].id)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>← {NAV[ci-1].label}</button>:<div/>}
        {ci<NAV.length-1?<button onClick={()=>setNav(NAV[ci+1].id)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{NAV[ci+1].label} →</button>:<div/>}
      </div>
    </main>
  </div>;
}
