import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.PUBLISHED;
export const publishDate = "2026-03-22";
export const title = "Coding Is What Intelligence Does";
export const subtitle = "Both sides of the AI debate are confused about the same thing.";

import { useState, useEffect, useRef } from "react";

// ============================================================
// CONTENT — All editorial copy lives here. Edit freely.
// ============================================================
const CONTENT = {
  title: "Coding Is What Intelligence Does",
  subtitle: "Both sides of the AI debate are confused about the same thing. The critics who say AI is \u2018only good at coding\u2019 and the optimists who promise it will do everything are both wrong \u2014 and wrong in exactly the same way.",

  sections: {
    opening: {
      body: `Two narratives about AI dominate right now, and they are both confused in the same way. The first says all these models are good at is coding. The second says artificial general intelligence is out of reach because AI cannot be creative. Both miss what is actually happening \u2014 because both misunderstand what coding fundamentally is.`,
    },

    dimensionality: {
      heading: "High Dimensional to Low Dimensional",
      intro: `Here is a crisp way to think about it. \u201CHigh-dimensional\u201D means there are many degrees of freedom \u2014 many independent things that can vary. A human intention, a visual scene, a felt emotion are high-dimensional: they have more axes of variation than language can enumerate. \u201CLow-dimensional\u201D means the space is constrained, formal, precise. An equation, a legal statute, a line of code \u2014 these live in low-dimensional space.`,
      body: `Coding is a high-dimensional to low-dimensional activity. It takes something nebulous \u2014 an intention, a desire, a vision of how something should work \u2014 and compresses it into something logical, precise, and executable.`,
      body2: `This is what the transformer architecture was invented to do. The \u201CAttention Is All You Need\u201D paper was built for machine translation: converting meaning from one structured form to another. Every modern AI descends from a translation engine. And there is no doubt to anyone who understands this technology that it will perform any high-to-low-dimensional transformation we do in language better than any human can.`,
      body3: `This is not a metaphor. A 2024 paper at ICLR proved that language modeling is mathematically equivalent to data compression \u2014 and the most striking result: Chinchilla 70B, trained only on text, compressed images to 43.4% of raw size, beating PNG (58.5%), a format designed specifically for images. If comprehension is compression \u2014 and Shannon\u2019s source coding theorem says it is \u2014 then what LLMs do is, in a formal sense, understand.`,
    },

    struggle: {
      heading: "Where It Breaks Down",
      body: `The low-dimensional to high-dimensional conversion is where AI struggles. Ask it to make a movie, and it must fill in a staggering number of decisions that language cannot possibly specify \u2014 which is precisely why filmmaking is such a multi-faceted job.`,
    },

    specGap: {
      prompts: [
        {
          text: "A woman standing in a sunlit forest",
          tokens: 7,
          outputValues: "3,145,728",
          outputLabel: "pixel values for 1024\u00D71024 RGB",
          categories: [
            { name: "The person", details: ["Age, ethnicity, build", "Exact expression \u2014 which muscles contract?", "Posture, weight distribution, hand position", "Clothing: fabric, fit, wrinkles, wear", "Hair: exact strands catching light", "Skin: pores, texture, subsurface scattering"] },
            { name: "The forest", details: ["Species of trees, density, undergrowth", "Season, time of day, weather history", "Exact position of every leaf and branch", "Ground: soil, roots, fallen leaves, moss", "Insects, birds, ambient life"] },
            { name: "The light", details: ["Sun angle, cloud diffusion, color temperature", "Dappled shadows through canopy", "Bounce light off ground, tree trunks", "Volumetric haze, god rays, lens flare", "Color shifts in shadow vs. highlight"] },
            { name: "The camera", details: ["Focal length \u2192 depth of field", "Sensor size \u2192 noise characteristics", "Aperture \u2192 bokeh shape", "Height, angle, distance to subject", "Lens distortion, chromatic aberration"] },
          ],
        },
        {
          text: "An upbeat pop song about summer",
          tokens: 6,
          outputValues: "~7,056,000",
          outputLabel: "samples for 3 min at 44.1kHz stereo",
          categories: [
            { name: "Melody", details: ["Exact pitch sequence, intervals, rhythm", "Phrasing, breath marks, dynamics", "Register, range, melodic contour", "Ornamentation, slides, vibrato"] },
            { name: "Arrangement", details: ["Which instruments? How many layers?", "Voicings, inversions, harmonic rhythm", "Stereo placement of each element", "Build, drops, transitions, silence"] },
            { name: "Performance", details: ["Swing vs. straight feel", "Micro-timing: ahead/behind the beat", "Velocity variation per note", "Imperfections that create feel", "Breath, room tone, string noise"] },
            { name: "Production", details: ["EQ, compression, saturation per track", "Reverb type, pre-delay, decay", "Mix balance: what is loud, what is buried", "Mastering: loudness, stereo width, limiting"] },
          ],
        },
        {
          text: "A 20-second clip of a dog catching a frisbee",
          tokens: 10,
          outputValues: "~3,732,480,000",
          outputLabel: "values for 1080p 30fps 20s video",
          categories: [
            { name: "The dog", details: ["Breed, size, coloring, age", "Exact muscle movements frame by frame", "Fur dynamics in wind and motion", "Eye tracking, ear position, tail", "Saliva, tongue, teeth physics"] },
            { name: "The physics", details: ["Frisbee aerodynamics: spin, wobble, lift", "Gravity, air resistance, trajectory", "Impact forces on catch", "Ground contact, paw compression", "Momentum transfer and deceleration"] },
            { name: "The environment", details: ["Grass blade-level detail across 600 frames", "Cloud movement, shadow progression", "Wind effect on trees, clothing, hair", "Background people, cars, buildings", "Ambient sound: birds, traffic, wind"] },
            { name: "Temporal coherence", details: ["Object permanence across 600 frames", "Consistent lighting as camera moves", "No limb duplication or teleportation", "Smooth motion blur", "Audio-visual synchronization"] },
          ],
        },
      ],
    },

    codeIsWorld: {
      heading: "But Code Can Generate Worlds",
      body: `Here is the move most people miss. The very endeavor of coding is to represent as much of the world as possible. Your computer runs only through code \u2014 and code generates images, text, video, sound, and everything as richly as possible in two and three dimensions. Coding is humanity\u2019s best effort to recreate our worlds while fully understanding them.`,
      body2: `Those words were found on his blackboard at Caltech on the day of his death, February 15, 1988. Feynman did not mean physical creation. He meant: starting from a blank page and knowledge already in his mind, he could re-derive any theoretical result from scratch. The ability to translate from high-level insight to low-level specification was his marker of genuine understanding. Code is comprehension made executable.`,
      body3: `And the range of what code creates \u2014 photorealistic renders, physics simulations, interactive worlds \u2014 already proves that low-dimensional specifications can produce high-dimensional outputs of extraordinary richness. The bottleneck was never code\u2019s expressiveness. It was the number of people who could write it.`,
    },

    jobTransitions: {
      heading: "Codifying Everything",
      body: `The way to think about job transitions is not that AI will do more and more jobs. It is that more and more people will use AI to codify their jobs. What AI really does is open up coding to 10x, maybe 100x or more people than was previously available.`,
      body2: `GitHub Copilot has reached 20 million users and now generates 46% of all code written by its active users. The term \u201Cvibe coding\u201D \u2014 coined by Andrej Karpathy in early 2025 \u2014 describes natural-language-driven development, and 63% of vibe coders are non-developers. Twenty-five percent of Y Combinator Winter 2025 cohort shipped codebases that were mostly AI-generated. The door has been thrown wide open.`,
      body3: `Over time, law will get codified \u2014 and I mean this in a stricter, more literal way than the phrase usually implies. A programming language called Catala, developed at Inria, already translates statutory law into executable specifications, and in doing so uncovered a bug in the French government\u2019s own benefits implementation. Medicine will get codified further, which is what clinical guidelines essentially already are \u2014 medical knowledge rendered as explicit if/then rules, increasingly machine-readable. Every domain that can be formalized will be.`,
    },

    agi: {
      heading: "AGI: Defined by Negation, Approached by Asymptote",
      body: `I will caveat that AGI is fundamentally ill-defined. It is a definition of negation. Ilya Sutskever called this out in his November 2025 interview with Dwarkesh Patel: the term exists not because it captures something essential about intelligence, but because it is a reaction to a different term that existed, and the term is narrow AI. People saw AI that could play chess but not generalize, and defined AGI as the opposite \u2014 which, Sutskever points out, overshot the target since even a human being is not an AGI by the implied standard of omniscience.`,
      body2: `The very nature of \u201Ctasks\u201D tricks us. We get lost in the illusion that all human activity should be goal-directed. It is not. Even granting the obviously agreeable goal-directed activities \u2014 maximizing well-being, exploration, longevity \u2014 and some less agreeable ones like being better than the next guy, goal-directed activity is only a finite subset of what humans do. A countable set. And even the current generation of language-model-based AI can asymptote towards it.`,
    },

    taste: {
      heading: "Form and Emptiness",
      body: `In Buddhist dependent origination, namarupa \u2014 name-and-form \u2014 describes how the mind constitutes its world: raw sensation becomes experience only through compression into named objects. Predictive processing says the same thing: the brain is a compression engine, generating top-down predictions against bottom-up error. Perception is not reception. It is modeling. The mind works through compression and pattern recognition, all the way down.`,
      body2: `Taste and judgment operate in the space between named categories \u2014 what Buddhist philosophy calls sunyata. Not void, but the recognition that our categories are conventional designations. LLMs do something striking here: because they operate in continuous vector space, they can occupy regions with no existing name. A vector embedding can capture a regularity no human has labeled \u2014 and express it the only way language can, through combinations of known words. \u201CThe emotional weight of an unread message from someone you used to love.\u201D That phrase points at something real in vector space that has no single word. This is what poets have always done. LLMs do it by navigating geometry.`,
      body3: `But the finger pointing at the moon is not the moon. Every word, every line of code is a finger. The map is never the territory \u2014 and yet maps are all anyone has ever made. When it comes to anything languageable, there is no reason AI cannot do it. The argument that AGI is impossible because coding is all AI is good at mistakes the destination for a dead end.`,
    },

    closing: {
      heading: "Pure Resonance",
      body: `What remains in the realm of culture \u2014 after every codifiable task has been codified \u2014 is activities of pure resonance. Things we make up as we go, as a reaction to the realization that tasks and goals were always a subset of what we do as a people.`,
      body2: `Music played for the sake of playing. Conversation for its own texture. Art that resists specification not because it is more complex than code, but because its purpose is to exist in the space where specification dissolves.`,
      kicker: `The question was never whether AI would get better at coding. It was always how much of the world turns out to be code.`,
    },
  },

  sources: {
    vaswani: { label: "Vaswani et al.", detail: "Attention Is All You Need, NeurIPS 2017", url: "https://arxiv.org/abs/1706.03762" },
    compression: { label: "Deletang et al.", detail: "Language Modeling Is Compression, ICLR 2024", url: "https://arxiv.org/abs/2309.10668" },
    sutskever: { label: "Sutskever", detail: "Interview w/ Dwarkesh Patel, Nov 2025", url: "https://www.dwarkesh.com/p/ilya-sutskever-2" },
    copilot: { label: "GitHub", detail: "Copilot: 20M users, FY25 Q4 earnings", url: "https://techcrunch.com/2025/07/30/github-copilot-crosses-20-million-users/" },
    vibecoding: { label: "Product Hunt", detail: "State of Vibe Coding 2025 survey", url: "https://www.producthunt.com/p/vibecoding/the-state-of-vibe-coding-2025-key-takeaways" },
    catala: { label: "Merigoux et al.", detail: "Catala: A Programming Language for the Law, ICFP 2021", url: "https://arxiv.org/abs/2103.03198" },
    sora: { label: "OpenAI", detail: "Sora launch, Dec 2024", url: "https://openai.com/index/sora-is-here/" },
    feynman: { label: "Caltech Archives", detail: "Feynman blackboard, Feb 15 1988", url: "https://calisphere.org/item/b3e8d3cb9b8adc01314dba1b1f1fcf84/" },
    barexam: { label: "Katz et al.", detail: "GPT-4 Passes the Bar Exam, 2023", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4389233" },
    martinez: { label: "Martinez", detail: "Re-evaluating GPT-4 bar exam performance, 2024", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4441311" },
    medmcq: { label: "Sallam et al.", detail: "ChatGPT medical licensing exams meta-analysis, PMC 2024", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11310649/" },
    deepmind_imo: { label: "DeepMind", detail: "Olympiad-level math reasoning, Nature 2025", url: "https://www.nature.com/articles/s41586-025-09833-y" },
    meddiag: { label: "Kim et al.", detail: "Generative AI vs physicians diagnostic accuracy, Nature 2025", url: "https://www.nature.com/articles/s41746-025-01543-z" },
  } as Record<string, { label: string; detail: string; url?: string }>,

  evidenceSpectrum: [
    { domain: "Code generation", stat: "46% of code", detail: "Share of code written by Copilot active users", sourceKey: "copilot", tier: "high" },
    { domain: "Math proofs", stat: "5/6 IMO problems", detail: "DeepMind achieved gold-medal standard, verified by formal theorem provers", sourceKey: "deepmind_imo", tier: "high" },
    { domain: "Medical MCQ", stat: "81% accuracy", detail: "GPT-4 meta-analysis across 29 licensing exams worldwide; passes 26", sourceKey: "medmcq", tier: "high" },
    { domain: "Legal MCQ", stat: "75.7% MBE", detail: "GPT-4 on Multistate Bar Exam multiple-choice, above 68% human average", sourceKey: "barexam", tier: "high" },
    { domain: "Medical diagnosis", stat: "52.1% overall", detail: "Generative AI diagnostic accuracy across 83 studies; comparable to non-expert physicians", sourceKey: "meddiag", tier: "medium" },
    { domain: "Legal essays", stat: "~15th pctile", detail: "GPT-4 vs. licensed attorneys on bar exam essays; drops to ~42nd pctile vs. first-time takers", sourceKey: "martinez", tier: "low" },
    { domain: "Video generation", stat: "10-20s max", detail: "Sora: struggles with complex actions over long durations, far from perfect", sourceKey: "sora", tier: "low" },
  ],

  capabilityTree: {
    name: "Goal-directed human capabilities",
    note: "A countable set that AI can asymptote towards",
    children: [
      {
        name: "Formal reasoning",
        children: [
          { name: "Mathematical proof", ai: "gold", note: "IMO gold-medal level", children: [
            { name: "Arithmetic", ai: "gold", note: "Solved: 1950s calculators", era: "classical" },
            { name: "Symbolic integration", ai: "gold", note: "Solved: Mathematica, 1988", era: "classical" },
            { name: "Olympiad geometry", ai: "gold", note: "DeepMind, 2025", era: "llm" },
            { name: "Open conjecture exploration", ai: "silver", note: "Promising but unverified", era: "llm" },
          ]},
          { name: "Logical deduction", ai: "gold", note: "Surpasses most humans", children: [
            { name: "Propositional logic", ai: "gold", note: "Solved: SAT solvers, 1960s", era: "classical" },
            { name: "Constraint satisfaction", ai: "gold", note: "Solved: CSP algorithms, 1970s", era: "classical" },
            { name: "Multi-step reasoning chains", ai: "gold", note: "Chain-of-thought prompting", era: "llm" },
          ]},
          { name: "Code generation", ai: "gold", note: "46% of active users code", children: [
            { name: "Syntax completion", ai: "gold", note: "Solved: IDEs, early 2000s", era: "classical" },
            { name: "Bug detection (pattern)", ai: "gold", note: "Solved: static analysis, 1970s", era: "classical" },
            { name: "Full function generation", ai: "gold", note: "Copilot / Cursor, 2022+", era: "llm" },
            { name: "System architecture design", ai: "silver", note: "Needs human oversight", era: "llm" },
          ]},
        ],
      },
      {
        name: "Game playing",
        note: "Where narrow AI began",
        children: [
          { name: "Perfect-information board games", ai: "gold", note: "Superhuman across the board", children: [
            { name: "Checkers", ai: "gold", note: "Solved: Chinook, 1994", era: "classical" },
            { name: "Chess", ai: "gold", note: "Solved: Deep Blue, 1997", era: "classical" },
            { name: "Go", ai: "gold", note: "AlphaGo, 2016", era: "deep_learning" },
            { name: "Diplomacy (negotiation)", ai: "silver", note: "CICERO, 2022", era: "llm" },
          ]},
          { name: "Video games", ai: "gold", note: "Superhuman in many", children: [
            { name: "Atari games", ai: "gold", note: "DQN, DeepMind 2013", era: "deep_learning" },
            { name: "StarCraft II", ai: "gold", note: "AlphaStar, 2019", era: "deep_learning" },
            { name: "Minecraft (open-ended)", ai: "silver", note: "Voyager, 2023", era: "llm" },
          ]},
        ],
      },
      {
        name: "Knowledge application",
        children: [
          { name: "Medical diagnosis (structured)", ai: "gold", note: "81% on licensing exams", children: [
            { name: "Rule-based symptom matching", ai: "gold", note: "MYCIN, 1976", era: "classical" },
            { name: "Medical image classification", ai: "gold", note: "CNNs, 2017+", era: "deep_learning" },
            { name: "Multi-system differential", ai: "gold", note: "GPT-4: 96% top-1 on vignettes", era: "llm" },
          ]},
          { name: "Legal analysis (structured)", ai: "gold", note: "75.7% MBE score", children: [
            { name: "Document search / e-discovery", ai: "gold", note: "Solved: keyword + ML, 2000s", era: "classical" },
            { name: "Contract clause extraction", ai: "gold", note: "NER models, 2018+", era: "deep_learning" },
            { name: "Case law reasoning", ai: "silver", note: "Harvey AI, strong but needs review", era: "llm" },
          ]},
          { name: "Classification and sorting", ai: "gold", note: "Foundational ML task", children: [
            { name: "Spam filtering", ai: "gold", note: "Solved: Naive Bayes, 1998", era: "classical" },
            { name: "Image recognition", ai: "gold", note: "AlexNet, 2012", era: "deep_learning" },
            { name: "Sentiment analysis", ai: "gold", note: "BERT fine-tuning, 2019", era: "deep_learning" },
            { name: "Fraud detection", ai: "gold", note: "Random forests + neural nets", era: "classical" },
          ]},
        ],
      },
      {
        name: "Language tasks",
        children: [
          { name: "Translation", ai: "gold", note: "What transformers were built for", children: [
            { name: "Phrase-based MT", ai: "gold", note: "Solved: Moses, 2007", era: "classical" },
            { name: "Neural machine translation", ai: "gold", note: "Seq2seq, 2014", era: "deep_learning" },
            { name: "Idiomatic / literary translation", ai: "silver", note: "Good but misses nuance", era: "llm" },
          ]},
          { name: "Summarization", ai: "gold", note: "Core compression task" },
          { name: "Technical writing", ai: "silver", note: "Reliable for documentation" },
          { name: "Persuasive writing", ai: "bronze", note: "Competent but generic" },
          { name: "Speech recognition", ai: "gold", note: "Another high-to-low translation", children: [
            { name: "Isolated word recognition", ai: "gold", note: "HMMs, 1970s", era: "classical" },
            { name: "Continuous speech", ai: "gold", note: "Whisper, 2022", era: "deep_learning" },
          ]},
        ],
      },
      {
        name: "Contextual judgment",
        children: [
          { name: "Medical diagnosis (complex)", ai: "bronze", note: "52.1% overall accuracy" },
          { name: "Legal essay reasoning", ai: "bronze", note: "~15th pctile vs. attorneys" },
          { name: "Negotiation strategy", ai: "bronze", note: "Lacks social context" },
          { name: "Ethical edge cases", ai: "none", note: "No stable value framework" },
        ],
      },
      {
        name: "Sensory-rich creation",
        children: [
          { name: "Image generation", ai: "bronze", note: "~30% recognizable errors", children: [
            { name: "Style transfer", ai: "gold", note: "Neural style transfer, 2015", era: "deep_learning" },
            { name: "Face generation", ai: "gold", note: "GANs / StyleGAN, 2018", era: "deep_learning" },
            { name: "Compositional scene from prompt", ai: "bronze", note: "DALL-E / Midjourney, 2022+", era: "llm" },
          ]},
          { name: "Video generation", ai: "none", note: "10-20s, unreliable physics" },
          { name: "Music composition", ai: "bronze", note: "Passable but flat" },
          { name: "Physical craft", ai: "none", note: "No body, no feedback" },
        ],
      },
    ],
  } as Record<string, any>,
};

// ============================================================
// THEME
// ============================================================
const THEME = {
  light: {
    bg: "#FAFAF7", cardBg: "#fff", text: "#1a1a1a",
    textSecondary: "#555", textTertiary: "#999", textFaint: "#bbb",
    border: "#e5e5e5", borderLight: "#e0e0e0",
    chartBarBg: "#eee", chartText: "#666",
    calloutAlpha: "0a",
  },
  dark: {
    bg: "#141413", cardBg: "#1e1e1c", text: "#e0ddd8",
    textSecondary: "#a8a49e", textTertiary: "#706c66", textFaint: "#504c47",
    border: "#333", borderLight: "#2a2a28",
    chartBarBg: "#2a2a28", chartText: "#888",
    calloutAlpha: "18",
  },
  accents: {
    light: { slate: "#7A8B99", green: "#4A7A62", gold: "#B8860B", crimson: "#9B2335" },
    dark: { slate: "#9BB0BF", green: "#6BA88C", gold: "#D4A832", crimson: "#C94460" },
  },
};

const mono = "'JetBrains Mono', 'SF Mono', monospace";
const serif = "'Newsreader', Georgia, serif";

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const t = dark ? THEME.dark : THEME.light;
  const a = dark ? THEME.accents.dark : THEME.accents.light;
  return { ...t, accents: a, dark };
}

// ============================================================
// SMALL COMPONENTS
// ============================================================
function Cite({ id, theme }: { id: string; theme: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const src = CONTENT.sources[id];
  if (!src) return null;
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline" }}>
      <sup onClick={() => setOpen(!open)} style={{ cursor: "pointer", color: theme.accents.green, fontFamily: mono, fontSize: "0.68em", fontWeight: 600, marginLeft: 1, userSelect: "none" }}>
        [{src.label}]
      </sup>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: theme.cardBg, border: "1px solid " + theme.border, borderRadius: 6,
          padding: "8px 12px", fontSize: "0.76rem", lineHeight: 1.5, color: theme.textSecondary,
          fontFamily: mono, whiteSpace: "nowrap" as const, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          {src.detail}{src.url && <>{" "}<a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.accents.green }}>{"\u2197"}</a></>}
        </span>
      )}
    </span>
  );
}

function P({ children, theme }: { children: React.ReactNode; theme: Record<string, any> }) {
  return <p style={{ fontFamily: serif, fontSize: "1.08rem", lineHeight: 1.72, color: theme.text, marginBottom: 18 }}>{children}</p>;
}

function H2({ children, theme }: { children: React.ReactNode; theme: Record<string, any> }) {
  return <h2 style={{ fontFamily: serif, fontSize: "1.6rem", fontWeight: 600, color: theme.text, marginBottom: 20, lineHeight: 1.25 }}>{children}</h2>;
}

function Pullquote({ children, theme, color }: { children: React.ReactNode; theme: Record<string, any>; color?: string }) {
  const c = color || theme.accents.slate;
  return (
    <blockquote style={{
      margin: "32px 0", padding: "20px 24px", borderLeft: "3px solid " + c,
      background: c + theme.calloutAlpha, borderRadius: "0 8px 8px 0",
      fontFamily: serif, fontSize: "1.12rem", lineHeight: 1.65, color: theme.text, fontStyle: "italic",
    }}>{children}</blockquote>
  );
}

// ============================================================
// DIMENSIONALITY DIAGRAM
// ============================================================
function DimensionalityDiagram({ theme }: { theme: Record<string, any> }) {
  const [side, setSide] = useState("high");
  const isHigh = side === "high";
  const color = isHigh ? theme.accents.green : theme.accents.crimson;

  const highExamples = [
    { from: "Vague product vision", to: "Working software", ratio: "\u221E : 1" },
    { from: "Legal intent", to: "Statutory code", ratio: "\u221E : 1" },
    { from: "Clinical judgment", to: "Decision algorithm", ratio: "\u221E : 1" },
    { from: "Mathematical intuition", to: "Formal proof", ratio: "\u221E : 1" },
  ];
  const lowExamples = [
    { from: "7-word prompt", to: "1024\u00D71024 image", ratio: "1 : 449,390", gap: "3.1M pixel values unspecified" },
    { from: "6-word prompt", to: "3-min pop song", ratio: "1 : 1,176,000", gap: "7M+ audio samples unspecified" },
    { from: "10-word prompt", to: "20s HD video", ratio: "1 : 373,248,000", gap: "3.7B values unspecified" },
  ];
  const data = isHigh ? highExamples : lowExamples;

  return (
    <div style={{ margin: "28px 0 36px", background: theme.cardBg, border: "1px solid " + theme.borderLight, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid " + theme.borderLight }}>
        {[
          { key: "high", label: "High \u2192 Low", sub: "AI excels here" },
          { key: "low", label: "Low \u2192 High", sub: "AI struggles here" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setSide(tab.key)} style={{
            flex: 1, padding: "14px 12px 10px", background: "none", border: "none",
            borderBottom: side === tab.key ? "2px solid " + (tab.key === "high" ? theme.accents.green : theme.accents.crimson) : "2px solid transparent",
            cursor: "pointer", fontFamily: mono, fontSize: "0.8rem",
            color: side === tab.key ? theme.text : theme.textTertiary, fontWeight: side === tab.key ? 600 : 400,
          }}>
            {tab.label}<br /><span style={{ fontSize: "0.68rem", color: side === tab.key ? (tab.key === "high" ? theme.accents.green : theme.accents.crimson) : theme.textFaint }}>{tab.sub}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 16px 12px" }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 6, marginBottom: 6, background: color + "08" }}>
            <span style={{ fontFamily: serif, fontSize: "0.9rem", color: theme.text, flex: 1 }}>{item.from}</span>
            <span style={{ fontFamily: mono, fontSize: "0.72rem", color: color, fontWeight: 600, flexShrink: 0 }}>{"\u2192"}</span>
            <span style={{ fontFamily: serif, fontSize: "0.9rem", color: theme.text, flex: 1, fontWeight: 600 }}>{item.to}</span>
            <span style={{ fontFamily: mono, fontSize: "0.68rem", color: theme.textTertiary, flexShrink: 0, textAlign: "right" as const, minWidth: 80 }}>{item.ratio}</span>
          </div>
        ))}
        {!isHigh && data.map((item, i) => ('gap' in item && (item as any).gap) ? (
          <div key={"g"+i} style={{ marginLeft: 12, fontFamily: mono, fontSize: "0.68rem", color: theme.accents.crimson, marginBottom: 2 }}>{(item as any).gap}</div>
        ) : null)}
        <div style={{ marginTop: 8, fontFamily: mono, fontSize: "0.7rem", color: color, textAlign: "center" as const, lineHeight: 1.5 }}>
          {isHigh ? "Each transformation compresses intent into precise specification \u2014 translation." : "The model must hallucinate everything the prompt leaves unspecified."}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SPECIFICATION GAP
// ============================================================
function SpecificationGap({ theme }: { theme: Record<string, any> }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const prompt = CONTENT.sections.specGap.prompts[promptIdx];
  const toggleCat = (name: string) => setOpenCats((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div style={{ margin: "36px 0 44px" }}>
      <div style={{ fontFamily: mono, fontSize: "0.72rem", color: theme.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>The specification gap</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" as const }}>
        {CONTENT.sections.specGap.prompts.map((p, i) => (
          <button key={i} onClick={() => { setPromptIdx(i); setOpenCats({}); }} style={{
            padding: "6px 12px", borderRadius: 20, border: "1px solid " + (promptIdx === i ? theme.accents.crimson : theme.border),
            background: promptIdx === i ? theme.accents.crimson + "15" : "none", cursor: "pointer",
            fontFamily: mono, fontSize: "0.72rem", color: promptIdx === i ? theme.accents.crimson : theme.textSecondary,
          }}>
            {["\uD83D\uDDBC Image", "\uD83C\uDFB5 Audio", "\uD83C\uDFAC Video"][i]}
          </button>
        ))}
      </div>
      <div style={{ background: theme.cardBg, border: "1px solid " + theme.borderLight, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid " + theme.borderLight, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: "0.65rem", color: theme.textFaint, marginBottom: 4 }}>PROMPT</div>
            <div style={{ fontFamily: serif, fontSize: "1.05rem", color: theme.text, fontStyle: "italic" }}>{"\u201C"}{prompt.text}{"\u201D"}</div>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: mono, fontSize: "0.9rem", color: theme.accents.green, fontWeight: 600 }}>{prompt.tokens} words</div>
            <div style={{ fontFamily: mono, fontSize: "0.65rem", color: theme.textTertiary }}>specified</div>
          </div>
        </div>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid " + theme.borderLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: mono, fontSize: "0.65rem", color: theme.textFaint }}>OUTPUT REQUIRES</div>
          <div style={{ textAlign: "right" as const }}>
            <div style={{ fontFamily: mono, fontSize: "0.9rem", color: theme.accents.crimson, fontWeight: 600 }}>{prompt.outputValues}</div>
            <div style={{ fontFamily: mono, fontSize: "0.65rem", color: theme.textTertiary }}>{prompt.outputLabel}</div>
          </div>
        </div>
        <div style={{ padding: "12px 20px 16px" }}>
          <div style={{ fontFamily: mono, fontSize: "0.68rem", color: theme.textTertiary, marginBottom: 10 }}>WHAT THE PROMPT LEAVES UNSPECIFIED {"\u2014"} click to expand</div>
          {prompt.categories.map((cat) => {
            const isOpen = openCats[cat.name];
            return (
              <div key={cat.name} style={{ marginBottom: 4 }}>
                <button onClick={() => toggleCat(cat.name)} style={{
                  width: "100%", textAlign: "left" as const, padding: "8px 12px", borderRadius: 6,
                  border: "1px solid " + (isOpen ? theme.accents.crimson + "40" : theme.borderLight),
                  background: isOpen ? theme.accents.crimson + "08" : "none",
                  cursor: "pointer", fontFamily: mono, fontSize: "0.78rem",
                  color: isOpen ? theme.accents.crimson : theme.textSecondary, display: "flex", justifyContent: "space-between",
                }}>
                  <span>{cat.name}</span>
                  <span style={{ color: theme.textFaint }}>{isOpen ? "\u2212" : "+" + cat.details.length}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "6px 12px 6px 24px" }}>
                    {cat.details.map((d, j) => (
                      <div key={j} style={{ fontFamily: serif, fontSize: "0.85rem", color: theme.textSecondary, lineHeight: 1.65, padding: "2px 0" }}>
                        <span style={{ color: theme.accents.crimson, marginRight: 6 }}>{"\u00B7"}</span>{d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EVIDENCE SPECTRUM
// ============================================================
function EvidenceSpectrum({ theme }: { theme: Record<string, any> }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const data = CONTENT.evidenceSpectrum;
  const tierColor: Record<string, string> = { high: theme.accents.green, medium: theme.accents.gold, low: theme.accents.crimson };

  return (
    <div style={{ margin: "40px 0" }}>
      <div style={{ fontFamily: mono, fontSize: "0.72rem", color: theme.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 4 }}>AI performance by output structure</div>
      <div style={{ fontFamily: serif, fontSize: "0.88rem", color: theme.textTertiary, fontStyle: "italic", marginBottom: 16 }}>All figures sourced {"\u2014"} hover for detail and citation.</div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 2, background: theme.cardBg, border: "1px solid " + theme.borderLight, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, " + theme.accents.green + ", " + theme.accents.gold + ", " + theme.accents.crimson + ")" }} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px 0", fontFamily: mono, fontSize: "0.62rem", color: theme.textFaint }}>
          <span>MORE STRUCTURED OUTPUT</span><span>LESS STRUCTURED</span>
        </div>
        {data.map((d, i) => {
          const c = tierColor[d.tier];
          const isHov = hovered === i;
          return (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ padding: "10px 16px", cursor: "pointer", background: isHov ? c + "10" : "transparent", transition: "background 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  <span style={{ fontFamily: serif, fontSize: "0.92rem", color: theme.text }}>{d.domain}</span>
                </div>
                <span style={{ fontFamily: mono, fontSize: "0.82rem", color: c, fontWeight: 600 }}>{d.stat}</span>
              </div>
              {isHov && (
                <div style={{ marginLeft: 18, marginTop: 4, fontFamily: serif, fontSize: "0.84rem", color: theme.textSecondary, fontStyle: "italic", lineHeight: 1.55 }}>
                  {d.detail} <Cite id={d.sourceKey} theme={theme} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 14, padding: "12px 16px", background: theme.accents.green + theme.calloutAlpha,
        borderRadius: 8, borderLeft: "3px solid " + theme.accents.green,
        fontFamily: serif, fontSize: "0.88rem", color: theme.textSecondary, lineHeight: 1.6,
      }}>
        The pattern: when the target output is structured, verifiable, and low-dimensional {"\u2014"} when it is, in essence, <em>code</em> {"\u2014"} AI excels. When the output is high-dimensional and unverifiable, it degrades.
      </div>
    </div>
  );
}

// ============================================================
// CAPABILITY TREE
// ============================================================
function CapabilityTree({ theme }: { theme: Record<string, any> }) {
  const [openBranches, setOpenBranches] = useState<Record<string, boolean>>({});
  const [openLeaves, setOpenLeaves] = useState<Record<string, boolean>>({});
  const tree = CONTENT.capabilityTree;
  const aiColors: Record<string, string> = { gold: theme.accents.green, silver: theme.accents.gold, bronze: theme.accents.crimson, none: theme.textFaint };
  const aiLabels: Record<string, string> = { gold: "Strong", silver: "Partial", bronze: "Weak", none: "\u2014" };
  const eraColors: Record<string, string> = { classical: theme.accents.slate, deep_learning: theme.accents.gold, llm: theme.accents.green };
  const eraLabels: Record<string, string> = { classical: "Classical AI/ML", deep_learning: "Deep Learning", llm: "LLM era" };
  const toggleBranch = (name: string) => setOpenBranches((prev) => ({ ...prev, [name]: !prev[name] }));
  const toggleLeaf = (name: string) => setOpenLeaves((prev) => ({ ...prev, [name]: !prev[name] }));
  const allOpen = tree.children.every((c: any) => openBranches[c.name]);
  const toggleAll = () => {
    if (allOpen) { setOpenBranches({}); setOpenLeaves({}); }
    else { const o: Record<string, boolean> = {}; tree.children.forEach((c: any) => { o[c.name] = true; }); setOpenBranches(o); }
  };
  const counts: Record<string, number> = { gold: 0, silver: 0, bronze: 0, none: 0 };
  const countNode = (node: any) => {
    if (node.children) node.children.forEach(countNode);
    else if (node.ai) counts[node.ai]++;
  };
  tree.children.forEach((b: any) => b.children.forEach(countNode));
  const total = counts.gold + counts.silver + counts.bronze + counts.none;

  return (
    <div style={{ margin: "36px 0 44px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: mono, fontSize: "0.72rem", color: theme.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Enumerating the countable set</div>
        <button onClick={toggleAll} style={{ padding: "4px 10px", borderRadius: 12, border: "1px solid " + theme.border, background: "none", cursor: "pointer", fontFamily: mono, fontSize: "0.68rem", color: theme.textTertiary }}>
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
        {(["gold","silver","bronze","none"] as const).map((k) => (
          <div key={k} style={{ width: (total > 0 ? (counts[k] / total) * 100 : 0) + "%", background: aiColors[k] }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 8, fontFamily: mono, fontSize: "0.65rem", color: theme.textTertiary, flexWrap: "wrap" as const }}>
        {Object.entries(aiLabels).map(([key, label]) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: aiColors[key], display: "inline-block" }} />
            {label} ({counts[key]})
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 16, fontFamily: mono, fontSize: "0.6rem", color: theme.textFaint, flexWrap: "wrap" as const }}>
        {Object.entries(eraLabels).map(([key, label]) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 16, height: 3, borderRadius: 1, background: eraColors[key], display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>
      <div style={{ background: theme.cardBg, border: "1px solid " + theme.borderLight, borderRadius: 10, overflow: "hidden" }}>
        {tree.children.map((branch: any, bi: number) => {
          const isOpen = openBranches[branch.name];
          return (
            <div key={bi} style={{ borderBottom: bi < tree.children.length - 1 ? "1px solid " + theme.borderLight : "none" }}>
              <button onClick={() => toggleBranch(branch.name)} style={{
                width: "100%", textAlign: "left" as const, padding: "12px 16px", background: "none", border: "none", cursor: "pointer",
                fontFamily: serif, fontSize: "0.95rem", color: theme.text, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>{branch.name}</span>
                <span style={{ fontFamily: mono, fontSize: "0.72rem", color: theme.textFaint }}>{isOpen ? "\u2212" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 16px 12px" }}>
                  {branch.children.map((leaf: any, li: number) => {
                    const hasChildren = leaf.children && leaf.children.length > 0;
                    const leafOpen = openLeaves[leaf.name];
                    return (
                      <div key={li}>
                        <div
                          onClick={hasChildren ? () => toggleLeaf(leaf.name) : undefined}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "6px 0 6px 12px",
                            borderLeft: "2px solid " + aiColors[leaf.ai] + "30",
                            cursor: hasChildren ? "pointer" : "default",
                          }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: aiColors[leaf.ai], flexShrink: 0 }} />
                          <span style={{ fontFamily: serif, fontSize: "0.88rem", color: theme.text, flex: 1 }}>{leaf.name}</span>
                          {hasChildren && <span style={{ fontFamily: mono, fontSize: "0.62rem", color: theme.textFaint }}>{leafOpen ? "\u2212" : "+" + leaf.children.length}</span>}
                          {!hasChildren && <span style={{ fontFamily: mono, fontSize: "0.68rem", color: theme.textTertiary, textAlign: "right" as const }}>{leaf.note}</span>}
                          {hasChildren && !leafOpen && <span style={{ fontFamily: mono, fontSize: "0.68rem", color: theme.textTertiary, textAlign: "right" as const }}>{leaf.note}</span>}
                        </div>
                        {hasChildren && leafOpen && (
                          <div style={{ padding: "4px 0 8px 32px" }}>
                            {leaf.children.map((sub: any, si: number) => (
                              <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderLeft: "1px dashed " + aiColors[sub.ai] + "30", paddingLeft: 10 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: aiColors[sub.ai], flexShrink: 0, opacity: 0.8 }} />
                                <span style={{ fontFamily: serif, fontSize: "0.82rem", color: theme.textSecondary, flex: 1 }}>{sub.name}</span>
                                {sub.era && (
                                  <span style={{
                                    fontFamily: mono, fontSize: "0.58rem", padding: "1px 6px", borderRadius: 8,
                                    background: eraColors[sub.era] + "18", color: eraColors[sub.era], fontWeight: 500, flexShrink: 0,
                                  }}>
                                    {sub.era === "classical" ? "classical" : sub.era === "deep_learning" ? "deep learning" : "LLM"}
                                  </span>
                                )}
                                <span style={{ fontFamily: mono, fontSize: "0.62rem", color: theme.textFaint, textAlign: "right" as const, flexShrink: 0, maxWidth: 140 }}>{sub.note}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{
        marginTop: 14, padding: "14px 16px", background: theme.accents.slate + theme.calloutAlpha,
        borderRadius: 8, borderLeft: "3px solid " + theme.accents.slate,
        fontFamily: serif, fontSize: "0.88rem", color: theme.textSecondary, lineHeight: 1.6,
      }}>
        Every leaf on this tree is a goal-directed task {"\u2014"} something enumerable, something with a success criterion. Classical AI solved the first ones decades ago. Deep learning solved harder ones. LLMs are eating the rest. The tree is finite. What lies outside it is not a task at all.
      </div>
    </div>
  );
}

// ============================================================
// RESONANCE VISUAL
// ============================================================
function ResonanceVisual({ theme }: { theme: Record<string, any> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 680, h = 340;
    canvas.width = w; canvas.height = h;
    let running = true;

    const colors = [
      theme.accents.green,
      theme.accents.slate,
      theme.accents.gold,
      theme.accents.crimson,
    ];

    // Parse hex to rgb
    const toRGB = (hex: string) => {
      const v = parseInt(hex.slice(1), 16);
      return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
    };
    const rgbColors = colors.map(toRGB);

    const render = () => {
      if (!running) return;
      frameRef.current += 0.008;
      const t = frameRef.current;

      // Clear to background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, w, h);

      const numWaves = 12;
      const centerY = h / 2;

      for (let wi = 0; wi < numWaves; wi++) {
        const progress = wi / numWaves;
        const rgb = rgbColors[wi % rgbColors.length];
        const alpha = 0.08 + 0.06 * Math.sin(t * 0.3 + wi * 0.7);

        // Each wave has unique frequency, amplitude, phase, and drift
        const freq = 0.006 + progress * 0.012 + 0.002 * Math.sin(t * 0.2 + wi);
        const amp = 30 + 60 * Math.sin(t * 0.15 + wi * 1.1) + 20 * progress;
        const phase = t * (0.4 + wi * 0.13) + wi * Math.PI * 0.37;
        const yOffset = (wi - numWaves / 2) * 8 + 15 * Math.sin(t * 0.25 + wi * 0.5);

        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x <= w; x += 2) {
          const y = centerY + yOffset
            + amp * Math.sin(x * freq + phase)
            + (amp * 0.3) * Math.sin(x * freq * 2.3 + phase * 1.7 + t * 0.3)
            + (amp * 0.15) * Math.cos(x * freq * 0.7 - phase * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha + 0.15})`;
        ctx.lineWidth = 1.5 + 0.5 * Math.sin(t * 0.4 + wi);
        ctx.stroke();

        // Draw a softer, wider glow line underneath
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.5})`;
        ctx.lineWidth = 4 + 2 * Math.sin(t * 0.3 + wi * 0.8);
        ctx.stroke();
      }

      requestAnimationFrame(render);
    };
    render();
    return () => { running = false; };
  }, [theme.dark]);
  return (
    <div style={{ margin: "40px 0 20px", position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto", aspectRatio: "680/340", borderRadius: 10, display: "block" }} />
      <div style={{ position: "absolute", bottom: 12, right: 16, fontFamily: mono, fontSize: "0.62rem", color: theme.dark ? "#504c47" : "#bbb", fontStyle: "italic", textShadow: theme.dark ? "0 1px 3px rgba(0,0,0,0.5)" : "0 1px 3px rgba(255,255,255,0.5)" }}>
        This has no purpose. It is not a task.
      </div>
    </div>
  );
}

// ============================================================
// SOURCES
// ============================================================
function SourcesList({ theme }: { theme: Record<string, any> }) {
  return (
    <section style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid " + theme.border }}>
      <h3 style={{ fontFamily: mono, fontSize: "0.78rem", fontWeight: 600, color: theme.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 16 }}>Sources</h3>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        {Object.entries(CONTENT.sources).map(([key, src]) => (
          <div key={key} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontFamily: mono, fontSize: "0.72rem", color: theme.accents.green, fontWeight: 600, flexShrink: 0 }}>[{src.label}]</span>
            <span style={{ fontFamily: serif, fontSize: "0.84rem", color: theme.textSecondary }}>
              {src.detail}{src.url && <>{" "}<a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: theme.accents.green, textDecoration: "none" }}>{"\u2197"}</a></>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Post() {
  const theme = useTheme();
  const S = CONTENT.sections;

  return (
    <>
      <style>{
        "::selection { background: " + theme.accents.green + "33; }"
      }</style>
      <article style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 120px" }}>

        <header style={{ marginBottom: 64 }}>
          <h1 style={{ fontFamily: serif, fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700, color: theme.text, lineHeight: 1.12, marginBottom: 16 }}>{CONTENT.title}</h1>
          <p style={{ fontFamily: serif, fontSize: "1.1rem", color: theme.textSecondary, lineHeight: 1.55 }}>{CONTENT.subtitle}</p>
          <div style={{ marginTop: 24, width: 48, height: 3, background: theme.accents.green, borderRadius: 2 }} />
        </header>

        <section style={{ marginBottom: 56 }}>
          <P theme={theme}>{S.opening.body}</P>
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.dimensionality.heading}</H2>
          <P theme={theme}>{S.dimensionality.intro}</P>
          <DimensionalityDiagram theme={theme} />
          <P theme={theme}>{S.dimensionality.body}</P>
          <P theme={theme}>
            This is what the transformer architecture was invented to do. The {"\u201C"}Attention Is All You Need{"\u201D"} paper<Cite id="vaswani" theme={theme} /> was built for machine translation: converting meaning from one structured form to another. Every modern AI descends from a translation engine. And there is no doubt to anyone who understands this technology that it will perform any high-to-low-dimensional transformation we do in language better than any human can.
          </P>
          <P theme={theme}>
            This is not a metaphor. A 2024 paper at ICLR<Cite id="compression" theme={theme} /> proved that language modeling is mathematically equivalent to data compression {"\u2014"} and the most striking result: Chinchilla 70B, trained only on text, compressed images to 43.4% of raw size, beating PNG (58.5%), a format designed specifically for images. If comprehension is compression {"\u2014"} and Shannon{"\u2019"}s source coding theorem says it is {"\u2014"} then what LLMs do is, in a formal sense, understand.
          </P>
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.struggle.heading}</H2>
          <P theme={theme}>{S.struggle.body}</P>
          <SpecificationGap theme={theme} />
          <P theme={theme}>
            Everyone can see this. AI-generated images look sloppy. Videos, impressive as proofs of concept, are nowhere near what skilled actors and carefully designed sets produce. OpenAI{"\u2019"}s own Sora team<Cite id="sora" theme={theme} /> acknowledges the model {"\u201C"}struggles with complex actions{"\u201D"} and is {"\u201C"}far from perfect.{"\u201D"} The issue is information-theoretic: a prompt is maybe 50{"\u2013"}200 tokens. A single image requires over 3 million pixel values. A 20-second video requires roughly 3.7 billion. The model must hallucinate everything the prompt leaves unspecified.
          </P>
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.codeIsWorld.heading}</H2>
          <P theme={theme}>{S.codeIsWorld.body}</P>
          <Pullquote theme={theme} color={theme.accents.gold}>
            {"\u201C"}What I cannot create, I do not understand.{"\u201D"}<Cite id="feynman" theme={theme} />
            <br /><span style={{ fontSize: "0.85rem", fontStyle: "normal", color: theme.textTertiary }}>{"\u2014"} Found on Richard Feynman{"\u2019"}s blackboard at Caltech, February 15, 1988</span>
          </Pullquote>
          <P theme={theme}>{S.codeIsWorld.body2}</P>
          <P theme={theme}>{S.codeIsWorld.body3}</P>
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.jobTransitions.heading}</H2>
          <P theme={theme}>{S.jobTransitions.body}</P>
          <P theme={theme}>
            GitHub Copilot has reached 20 million users<Cite id="copilot" theme={theme} /> and now generates 46% of all code written by its active users. The term {"\u201C"}vibe coding{"\u201D"} {"\u2014"} coined by Andrej Karpathy in early 2025 {"\u2014"} describes natural-language-driven development, and 63% of vibe coders are non-developers.<Cite id="vibecoding" theme={theme} /> Twenty-five percent of Y Combinator{"\u2019"}s Winter 2025 cohort shipped codebases that were mostly AI-generated. The door has been thrown wide open.
          </P>
          <P theme={theme}>
            Over time, law will get codified {"\u2014"} and I mean this in a stricter, more literal way than the phrase usually implies. A programming language called Catala<Cite id="catala" theme={theme} />, developed at Inria, already translates statutory law into executable specifications, and in doing so uncovered a bug in the French government{"\u2019"}s own benefits implementation. Medicine will get codified further, which is what clinical guidelines essentially already are {"\u2014"} medical knowledge rendered as explicit if/then rules, increasingly machine-readable. Every domain that can be formalized will be.
          </P>
          <EvidenceSpectrum theme={theme} />
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.taste.heading}</H2>
          <P theme={theme}>{S.taste.body}</P>
          <P theme={theme}>{S.taste.body2}</P>
          <P theme={theme}>{S.taste.body3}</P>
        </section>

        <section style={{ marginBottom: 56 }}>
          <H2 theme={theme}>{S.agi.heading}</H2>
          <P theme={theme}>
            I will caveat that AGI is fundamentally ill-defined. It is a definition of negation. Ilya Sutskever<Cite id="sutskever" theme={theme} /> called this out in his November 2025 interview with Dwarkesh Patel: the term exists not because it captures something essential about intelligence, but {"\u201C"}because it is a reaction to a different term that existed, and the term is narrow AI.{"\u201D"} People saw AI that could play chess but not generalize, and defined AGI as the opposite {"\u2014"} which, Sutskever points out, {"\u201C"}overshot the target{"\u201D"} since even a human being is not an AGI by the implied standard of omniscience.
          </P>
          <P theme={theme}>{S.agi.body2}</P>
          <CapabilityTree theme={theme} />
        </section>

        <section style={{ marginBottom: 32 }}>
          <H2 theme={theme}>{S.closing.heading}</H2>
          <P theme={theme}>{S.closing.body}</P>
          <P theme={theme}>{S.closing.body2}</P>
          <ResonanceVisual theme={theme} />
          <Pullquote theme={theme} color={theme.accents.crimson}>{S.closing.kicker}</Pullquote>
        </section>

        <SourcesList theme={theme} />
      </article>
    </>
  );
}
