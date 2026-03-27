import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNPUBLISHED;
export const publishDate = "2026-03-27";
export const title = "LLMs Are Analogizers";
export const subtitle = "They accidentally learned to reason. Their real trick is finding the hidden geometry of meaning.";

import { useState, useEffect, useMemo } from "react";

// ─────────────────────────────────────────────────────────
// CONTENT — all prose, data, and sources live here
// ─────────────────────────────────────────────────────────
const CONTENT = {
  title: "LLMs Are Analogizers",
  subtitle: "They accidentally learned to reason. Their real trick is finding the hidden geometry of meaning.",

  sections: {
    opening: {
      epigraph: {
        text: "The eternal mystery of the world is its comprehensibility.",
        attribution: "Albert Einstein, 'Physics and Reality' (1936)",
      },
      paragraphs: [
        "Large language models are not reasoning engines that happen to use language. They are analogizers that accidentally learned to reason. That distinction matters enormously for understanding what they are, what they're good at, and where they will fail.",
        "The dominant frame for LLMs treats reasoning as the headline act — chain-of-thought, tool use, agentic planning. Reasoning is real, but it's a secondary phenomenon. The primary capability, the deep one, is analogy: the ability to recognize that two things share structure even when they share nothing on the surface.",
        "And the seed of this capability was planted long before transformers. It was planted in 2013, in a Google office, when Tomáš Mikolov showed that if you subtract the vector for 'man' from the vector for 'king' and add 'woman', you land near 'queen'.",
      ],
    },

    embeddings: {
      heading: "The Greatest Idea in LLMs Is Still Word Embeddings",
      paragraphs: [
        "Word2Vec wasn't trying to solve analogy problems. It was trying to predict which words appear near other words. But in learning to do that, it discovered something profound: that meaning can be represented as geometry.",
        "Each word becomes a point in a 300-dimensional space. Words used in similar contexts cluster together. But the truly stunning result was that relationships between words become directions in that space. The direction from 'man' to 'woman' is roughly the same as the direction from 'king' to 'queen'. The direction from 'Paris' to 'France' is the same as from 'Berlin' to 'Germany'.",
        "No one told the model about gender. No one labelled the concept of 'capital city'. These structures emerged from nothing but co-occurrence statistics — from the raw patterns of which words appear near which other words in billions of sentences.",
        "This is the deepest insight of the entire LLM paradigm, and it's easily missed because it arrived a decade before ChatGPT: all concepts are approximations, and they are only defined in relationship to other concepts.",
      ],
    },

    saussure: {
      heading: "Meaning Is Relational, Not Referential",
      paragraphs: [
        "Word embeddings didn't just validate a machine learning technique. They vindicated a century-old philosophical position. Ferdinand de Saussure argued in 1916 that signs make sense only within a system of related signs — that meaning is relational, not referential. A word doesn't point at a thing in the world. It occupies a position in a web of contrasts and similarities with other words.",
        "Wittgenstein reached a similar conclusion from a different direction: the meaning of a word is its use in a language game. Concepts don't have fixed essences. They have family resemblances — overlapping similarities with no single defining feature.",
        "Word embeddings are the computational proof of this. No single dimension of a 300-dimensional embedding vector means 'gender' or 'royalty'. Meaning is distributed, relational, approximate. It's constituted by the totality of a word's relationships to every other word. There are no atoms of meaning, only fields of similarity.",
      ],
    },

    masking: {
      heading: "The Second Great Idea: Learning by Filling in Blanks",
      paragraphs: [
        "Word embeddings gave us the geometry of meaning. But a second idea — almost as important — gave us the training signal to learn it at scale: self-supervised learning through masking.",
        "The idea is almost embarrassingly simple. Take a sentence. Hide a word. Ask the model to predict what's missing. 'The cat sat on the ____.' No human labels required. No curated dataset. The text supervises itself. The sheer volume of what a model must learn to predict masked words well — syntax, semantics, facts about the world, reasoning patterns — turns out to be staggering.",
        "Yann LeCun crystallized why this matters with his famous cake analogy at NeurIPS 2016. If intelligence is a cake, self-supervised learning is the bulk of the cake. Supervised learning — humans labelling data — is just the icing. Reinforcement learning is the cherry on top. He later updated 'unsupervised' to 'self-supervised' to emphasize the key insight: the data provides its own supervision.",
        "This is the trick that made modern LLMs possible. GPT learns by predicting the next token. BERT learns by predicting masked tokens. Both are doing the same fundamental thing: using the structure of language itself as an inexhaustible source of training signal. You don't need to pay humans to label anything. You just need text — and the internet has a lot of text.",
        "The combination is what matters. Embeddings provide the representational substrate — the idea that meaning is geometry. Self-supervised masking provides the learning objective — the way to actually discover that geometry from raw data. Together, they are the two load-bearing ideas beneath the entire LLM edifice. Everything else — transformers, RLHF, chain-of-thought, tool use — is built on top of these two foundations.",
      ],
    },

    analogy: {
      heading: "What LLMs Actually Do",
      paragraphs: [
        "Modern LLMs scale this principle from words to everything. A transformer doesn't just embed individual tokens — it builds contextual representations where the meaning of each token depends on every other token in the sequence. It's Saussure's relational semantics running at industrial scale.",
        "When you ask an LLM to write a function that sorts a list, it isn't 'reasoning from first principles'. It's finding the closest analog in the learned geometry of code. When it writes a poem in the style of Emily Dickinson, it's navigating to a region of style-space. When it diagnoses a medical case, it's pattern-matching against the vast web of clinical descriptions it's absorbed.",
        "This is why LLMs are so eerily good at transfer. Analogy is the mechanism of transfer. If you understand that the relationship between voltage and current is structurally similar to the relationship between pressure and flow, you can import knowledge from electrical engineering into fluid dynamics. LLMs do this constantly, across every domain, without being told to.",
      ],
      pullquote: "In coding, they find analogies in the space of pure logic. That's why they're so uncannily good at it — code has the cleanest geometry of any domain.",
    },

    reasoning: {
      heading: "Reasoning Is an Accident (A Spectacular One)",
      paragraphs: [
        "Here's what I think happened: if you learn enough analogies across enough domains, you start to capture the meta-patterns. Logical inference is itself a pattern. Modus ponens, transitivity, proof by contradiction — these are structures that recur across mathematics, law, philosophy, everyday argument. If you've seen enough instances, you learn the shape of the inference itself.",
        "This is why LLM reasoning is simultaneously impressive and brittle. It's impressive because it's real — these models genuinely solve novel problems, not just recite memorized answers. A 2023 study in Nature Human Behaviour found that GPT-3 matched or surpassed humans on zero-shot analogical reasoning tasks including matrix problems based on Raven's Progressive Matrices. A follow-up in PNAS Nexus (2025) showed that LLMs could generalize even to counterfactual task variants, arguing against simple memorization.",
        "But raw analogical reasoning is brittle in a specific way: it has no built-in verification. An LLM alone has a very good sense of what correct reasoning looks like, but no way to check whether its output actually is correct. This is where code changes the picture. When an LLM generates code, the compiler or test suite acts as an external proof checker — the analogy either runs or it doesn't. Systems like Harmonic's Aristotle take this further, generating formal proofs in Lean that are machine-verified down to foundational axioms. Aristotle achieved gold-medal performance on the 2025 IMO with fully verified solutions. The pattern is: analogical reasoning proposes, formal systems dispose. The brittleness isn't a death sentence — it's a design constraint. The most powerful AI systems will be analogizers with external verifiers, not reasoners pretending to be axiom machines.",
      ],
    },

    einstein: {
      heading: "Analogizers All the Way Down",
      paragraphs: [
        "The view from here is simple and strange. LLMs are not proto-AGIs fumbling toward general intelligence. They are the most powerful analogy engines ever built. They compress the structure of human meaning into geometry, then navigate that geometry to find structural parallels across domains.",
        "This reframes everything. 'Hallucination' is not a bug to be patched — it's what happens when an analogy engine finds a plausible-looking region of concept-space that doesn't correspond to anything true. 'Reasoning' is not a separate capability to be unlocked — it's what happens when the space of analogies becomes rich enough to capture meta-patterns like logical inference. 'Understanding' is not something LLMs lack — it's something they have in a genuinely different form than humans: not grounded in embodiment or lived experience, but in the relational structure of all the text they've absorbed.",
        "Einstein marvelled that the universe is comprehensible at all. LLMs reveal a corollary: the universe of human meaning is compressible. It has geometry. Concepts relate to each other in structured, approximately regular ways — and that regularity is what makes these machines work. The deepest question LLMs pose isn't whether they can reason. It's why the space of human thought has a shape that admits analogies in the first place.",
      ],
    },

    implications: {
      heading: "What This Means",
      bullets: [
        {
          label: "For builders",
          text: "Stop evaluating LLMs on whether they can 'reason'. Evaluate them on whether they can find the right analog. The best prompts are the ones that give the model enough context to triangulate the right region of concept-space.",
        },
        {
          label: "For researchers",
          text: "The ceiling on LLM capability may be set by the geometry of the embedding space, not by scale. If some concepts simply don't have clean geometric representations, no amount of training data will fix the problem.",
        },
        {
          label: "For everyone",
          text: "LLMs are a mirror for a deep truth about cognition: understanding is not about storing facts. It's about learning the shape of the space that facts live in.",
        },
      ],
    },
  },

  // Data for interactive embedding explorer
  embeddingExplorer: {
    analogies: [
      { a: "king", b: "man", c: "woman", result: "queen", category: "Gender" },
      { a: "Paris", b: "France", c: "Germany", result: "Berlin", category: "Geography" },
      { a: "walked", b: "walk", c: "swim", result: "swam", category: "Tense" },
      { a: "bigger", b: "big", c: "small", result: "smaller", category: "Degree" },
      { a: "electron", b: "atom", c: "galaxy", result: "star", category: "Scale" },
      { a: "Python", b: "scripting", c: "compiled", result: "C++", category: "Code" },
    ],
  },

  // Data for the reasoning spectrum
  reasoningSpectrum: [
    {
      label: "Pattern retrieval",
      description: "Finding the nearest stored example",
      llmStrength: 0.95,
      example: "'Write a for loop in Python'",
    },
    {
      label: "Analogical transfer",
      description: "Mapping structure across domains",
      llmStrength: 0.85,
      example: "'Explain TCP/IP using postal mail'",
    },
    {
      label: "Compositional reasoning",
      description: "Chaining multiple analogies",
      llmStrength: 0.65,
      example: "'Design a caching system for this API'",
    },
    {
      label: "Novel structural insight",
      description: "Discovering genuinely new patterns",
      llmStrength: 0.25,
      example: "'Prove this unseen theorem'",
    },
  ],

  sources: {
    mikolov2013: {
      label: "Mikolov et al., 2013",
      detail: "Efficient Estimation of Word Representations in Vector Space. arXiv:1301.3781",
    },
    webb2023: {
      label: "Webb, Holyoak & Lu, 2023",
      detail: "Emergent analogical reasoning in large language models. Nature Human Behaviour 7, 1526–1541",
    },
    webb2025: {
      label: "Webb, Holyoak & Lu, 2025",
      detail: "Evidence from counterfactual tasks supports emergent analogical reasoning in LLMs. PNAS Nexus 4(5)",
    },
    saussure1916: {
      label: "Saussure, 1916",
      detail: "Course in General Linguistics. Open Court Publishing.",
    },
    wigner1960: {
      label: "Wigner, 1960",
      detail: "The Unreasonable Effectiveness of Mathematics in the Natural Sciences. Comm. Pure & Applied Math 13(1):1–14",
    },
    einstein1936: {
      label: "Einstein, 1936",
      detail: "Physics and Reality. Franklin Institute Journal, March 1936",
    },
    drozd2016: {
      label: "Drozd, Gladkova & Matsuoka, 2016",
      detail: "Word Embeddings, Analogies, and Machine Learning: Beyond king − man + woman = queen. COLING 2016",
    },
    allen2019: {
      label: "Allen & Hospedales, 2019",
      detail: "Analogies Explained: Towards Understanding Word Embeddings. ICML 2019. arXiv:1901.09813",
    },
    musker2024: {
      label: "Musker et al., 2024",
      detail: "LLMs as Models for Analogical Reasoning. arXiv:2406.13803",
    },
    lecun2016: {
      label: "LeCun, 2016",
      detail: "Cake analogy for intelligence. Keynote at NeurIPS 2016; updated at ISSCC 2019 (self-supervised learning).",
    },
    devlin2018: {
      label: "Devlin et al., 2018",
      detail: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. arXiv:1810.04805",
    },
    harmonic2025: {
      label: "Harmonic, 2025",
      detail: "Aristotle: IMO-level Automated Theorem Proving. arXiv:2510.01346",
    },
  } as Record<string, { label: string; detail: string }>,
};

// ─────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────
const THEMES = {
  light: {
    bg: "#FAFAF7", cardBg: "#fff", text: "#1a1a1a",
    textSecondary: "#555", textTertiary: "#999", textFaint: "#bbb",
    border: "#e5e5e5", borderLight: "#e0e0e0",
    chartBarBg: "#eee", chartText: "#666",
    toggleBg: "#e5e5e5", toggleKnob: "#fff",
    accent: "#9B2335", accentMuted: "#4A7A62",
    accentGold: "#B8860B", accentSlate: "#7A8B99",
    calloutBgSuffix: "06", quadTintSuffix: "08",
  },
  dark: {
    bg: "#141413", cardBg: "#1e1e1c", text: "#e0ddd8",
    textSecondary: "#a8a49e", textTertiary: "#706c66", textFaint: "#504c47",
    border: "#333", borderLight: "#2a2a28",
    chartBarBg: "#2a2a28", chartText: "#888",
    toggleBg: "#333", toggleKnob: "#e0ddd8",
    accent: "#C94460", accentMuted: "#6BA88C",
    accentGold: "#D4A832", accentSlate: "#9BB0BF",
    calloutBgSuffix: "15", quadTintSuffix: "12",
  },
};

// ─────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────

function SourceRef({ id, theme }: { id: string; theme: Record<string, any> }) {
  const [show, setShow] = useState(false);
  const src = CONTENT.sources[id];
  if (!src) return null;
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <sup
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          color: theme.accent, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7em", marginLeft: 1, fontWeight: 600,
        }}
      >
        [{src.label.split(",")[0].split(" ").pop()}{src.label.match(/\d{4}/)?.[0]}]
      </sup>
      {show && (
        <span
          style={{
            position: "absolute", bottom: "120%", left: "50%",
            transform: "translateX(-50%)",
            background: theme.cardBg, border: `1px solid ${theme.border}`,
            padding: "6px 10px", borderRadius: 4, fontSize: "0.75rem",
            color: theme.textSecondary, zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontFamily: "'JetBrains Mono', monospace", maxWidth: 360,
            whiteSpace: "normal" as const, lineHeight: 1.4,
          }}
        >
          {src.detail}
        </span>
      )}
    </span>
  );
}

// ─── INTERACTIVE: Embedding Analogy Explorer ───
function AnalogyExplorer({ theme }: { theme: Record<string, any> }) {
  const [active, setActive] = useState(0);
  const analogies = CONTENT.embeddingExplorer.analogies;
  const a = analogies[active];

  return (
    <div
      style={{
        margin: "40px 0", padding: 28, borderRadius: 6,
        background: theme.cardBg, border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
          textTransform: "uppercase" as const, letterSpacing: "0.08em",
          color: theme.textTertiary, marginBottom: 16,
        }}
      >
        Interactive · Vector Arithmetic
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {analogies.map((an, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: "5px 12px", borderRadius: 3, border: `1px solid ${theme.border}`,
              background: i === active ? theme.accent + theme.calloutBgSuffix : "transparent",
              color: i === active ? theme.accent : theme.textTertiary,
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
              cursor: "pointer", transition: "all 0.2s",
              fontWeight: i === active ? 600 : 400,
            }}
          >
            {an.category}
          </button>
        ))}
      </div>

      {/* The equation */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, flexWrap: "wrap", fontSize: "1.3rem",
          fontFamily: "'Newsreader', Georgia, serif", fontStyle: "italic",
        }}
      >
        <Token text={a.a} theme={theme} color={theme.accent} />
        <Op text="−" theme={theme} />
        <Token text={a.b} theme={theme} color={theme.accentSlate} />
        <Op text="+" theme={theme} />
        <Token text={a.c} theme={theme} color={theme.accentMuted} />
        <Op text="≈" theme={theme} />
        <Token text={a.result} theme={theme} color={theme.accentGold} highlight />
      </div>

      {/* Visual: direction arrows */}
      <svg
        viewBox="0 0 400 80"
        style={{ width: "100%", maxWidth: 400, margin: "24px auto 0", display: "block" }}
      >
        {/* Arrow 1: b → a */}
        <line x1="40" y1="25" x2="160" y2="25" stroke={theme.accentSlate} strokeWidth="2" markerEnd="url(#arrowSlate)" />
        <text x="100" y="18" textAnchor="middle" fill={theme.textTertiary} fontSize="10" fontFamily="'JetBrains Mono', monospace">
          {a.b} → {a.a}
        </text>
        {/* Arrow 2: c → result (same direction) */}
        <line x1="220" y1="25" x2="340" y2="25" stroke={theme.accentMuted} strokeWidth="2" markerEnd="url(#arrowMuted)" />
        <text x="280" y="18" textAnchor="middle" fill={theme.textTertiary} fontSize="10" fontFamily="'JetBrains Mono', monospace">
          {a.c} → {a.result}
        </text>
        {/* Dashed line showing parallel */}
        <line x1="100" y1="40" x2="100" y2="65" stroke={theme.border} strokeWidth="1" strokeDasharray="3,3" />
        <line x1="280" y1="40" x2="280" y2="65" stroke={theme.border} strokeWidth="1" strokeDasharray="3,3" />
        <text x="190" y="62" textAnchor="middle" fill={theme.textTertiary} fontSize="9" fontFamily="'JetBrains Mono', monospace" fontStyle="italic">
          same direction in vector space
        </text>
        <defs>
          <marker id="arrowSlate" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill={theme.accentSlate} />
          </marker>
          <marker id="arrowMuted" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill={theme.accentMuted} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

function Token({ text, theme, color, highlight }: { text: string; theme: Record<string, any>; color: string; highlight?: boolean }) {
  return (
    <span
      style={{
        padding: "4px 14px", borderRadius: 3,
        background: highlight ? color + (theme === THEMES.dark ? "25" : "15") : "transparent",
        border: `1.5px solid ${color}`,
        color: color, fontWeight: 600,
        transition: "all 0.3s",
      }}
    >
      {text}
    </span>
  );
}
function Op({ text, theme }: { text: string; theme: Record<string, any> }) {
  return (
    <span style={{ color: theme.textFaint, fontWeight: 300, fontSize: "1.5rem" }}>
      {text}
    </span>
  );
}

// ─── INTERACTIVE: Reasoning Spectrum ───
function ReasoningSpectrum({ theme }: { theme: Record<string, any> }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = CONTENT.reasoningSpectrum;

  return (
    <div
      style={{
        margin: "40px 0", padding: 28, borderRadius: 6,
        background: theme.cardBg, border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
          textTransform: "uppercase" as const, letterSpacing: "0.08em",
          color: theme.textTertiary, marginBottom: 6,
        }}
      >
        Interactive · The Reasoning Spectrum
      </div>
      <p style={{ color: theme.textSecondary, fontSize: "0.85rem", marginBottom: 20, fontFamily: "'Newsreader', Georgia, serif", fontStyle: "italic" }}>
        What looks like reasoning is often analogy at varying depths. Hover to explore.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const isHovered = hovered === i;
          const barColor = [theme.accentMuted, theme.accentSlate, theme.accentGold, theme.accent][i];
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
                  color: isHovered ? barColor : theme.text, fontWeight: 600,
                  transition: "color 0.2s",
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                  color: theme.textTertiary,
                }}>
                  {Math.round(item.llmStrength * 100)}% LLM strength
                </span>
              </div>
              {/* Bar */}
              <div style={{
                height: 8, borderRadius: 4, background: theme.chartBarBg,
                overflow: "hidden",
              }}>
                <div
                  style={{
                    height: "100%", borderRadius: 4,
                    width: `${item.llmStrength * 100}%`,
                    background: barColor,
                    opacity: isHovered ? 1 : 0.7,
                    transition: "opacity 0.2s, width 0.5s",
                  }}
                />
              </div>
              {/* Detail on hover */}
              <div style={{
                overflow: "hidden",
                maxHeight: isHovered ? 60 : 0,
                opacity: isHovered ? 1 : 0,
                transition: "all 0.3s ease",
              }}>
                <p style={{
                  margin: "6px 0 0", fontSize: "0.8rem", color: theme.textSecondary,
                  fontFamily: "'Newsreader', Georgia, serif",
                }}>
                  {item.description}
                </p>
                <p style={{
                  margin: "2px 0 0", fontSize: "0.75rem", color: theme.textTertiary,
                  fontFamily: "'JetBrains Mono', monospace", fontStyle: "italic",
                }}>
                  e.g. {item.example}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── INTERACTIVE: Relational Meaning Diagram ───
function RelationalDiagram({ theme }: { theme: Record<string, any> }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: "king", x: 200, y: 60, connections: ["queen", "man", "royal", "throne"] },
    { id: "queen", x: 340, y: 60, connections: ["king", "woman", "royal", "throne"] },
    { id: "man", x: 130, y: 150, connections: ["king", "woman", "boy"] },
    { id: "woman", x: 410, y: 150, connections: ["queen", "man", "girl"] },
    { id: "royal", x: 270, y: 150, connections: ["king", "queen", "throne"] },
    { id: "throne", x: 270, y: 230, connections: ["king", "queen", "royal"] },
    { id: "boy", x: 60, y: 230, connections: ["man", "girl"] },
    { id: "girl", x: 480, y: 230, connections: ["woman", "boy"] },
  ];

  const nodeMap: Record<string, typeof nodes[0]> = {};
  nodes.forEach((n) => (nodeMap[n.id] = n));

  const isHighlighted = (id: string) => {
    if (!activeNode) return true;
    if (id === activeNode) return true;
    const node = nodeMap[activeNode];
    return node?.connections.includes(id);
  };

  const edges: { from: string; to: string }[] = [];
  const seen = new Set<string>();
  nodes.forEach((n) => {
    n.connections.forEach((c) => {
      const key = [n.id, c].sort().join("-");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ from: n.id, to: c });
      }
    });
  });

  return (
    <div
      style={{
        margin: "40px 0", padding: 28, borderRadius: 6,
        background: theme.cardBg, border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
          textTransform: "uppercase" as const, letterSpacing: "0.08em",
          color: theme.textTertiary, marginBottom: 6,
        }}
      >
        Interactive · Relational Meaning
      </div>
      <p style={{ color: theme.textSecondary, fontSize: "0.85rem", marginBottom: 16, fontFamily: "'Newsreader', Georgia, serif", fontStyle: "italic" }}>
        No word has meaning in isolation. Hover a word to see its web of relations.
      </p>

      <svg viewBox="0 0 540 280" style={{ width: "100%", maxWidth: 540, margin: "0 auto", display: "block" }}>
        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodeMap[e.from];
          const to = nodeMap[e.to];
          const active = isHighlighted(e.from) && isHighlighted(e.to);
          return (
            <line
              key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={active ? theme.accentSlate : theme.border}
              strokeWidth={active ? 1.5 : 0.5}
              opacity={active ? 0.6 : 0.15}
              style={{ transition: "all 0.3s" }}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => {
          const active = isHighlighted(n.id);
          const isSelf = activeNode === n.id;
          return (
            <g
              key={n.id}
              onMouseEnter={() => setActiveNode(n.id)}
              onMouseLeave={() => setActiveNode(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={n.x} cy={n.y} r={isSelf ? 22 : 18}
                fill={isSelf ? theme.accent + "20" : "transparent"}
                stroke={active ? theme.accent : theme.border}
                strokeWidth={isSelf ? 2 : 1}
                style={{ transition: "all 0.3s" }}
              />
              <text
                x={n.x} y={n.y + 4}
                textAnchor="middle"
                fill={active ? theme.text : theme.textFaint}
                fontSize={isSelf ? 13 : 11}
                fontFamily="'Newsreader', Georgia, serif"
                fontStyle="italic"
                fontWeight={isSelf ? 700 : 400}
                style={{ transition: "all 0.3s" }}
              >
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── INTERACTIVE: LeCun Cake Diagram ───
function LeCunCake({ theme }: { theme: Record<string, any> }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const layers = [
    {
      id: "self-supervised",
      label: "Self-supervised learning",
      sublabel: "The bulk of the cake",
      description: "Predict masked/next tokens from raw text. No human labels. The data supervises itself. This is where the geometry of meaning is learned.",
      height: 55, y: 45, color: theme.accentMuted,
      bits: "~10,000 bits/sample",
    },
    {
      id: "supervised",
      label: "Supervised learning",
      sublabel: "The icing",
      description: "Fine-tuning on human-labelled examples. Instruction-following, classification, specific tasks. Precise but expensive per sample.",
      height: 18, y: 27, color: theme.accentGold,
      bits: "~10–100 bits/sample",
    },
    {
      id: "reinforcement",
      label: "Reinforcement learning",
      sublabel: "The cherry",
      description: "RLHF, reward models, preference tuning. A scalar reward signal — good or bad. Aligns behavior but carries very few bits of information per interaction.",
      height: 10, y: 10, color: theme.accent,
      bits: "~a few bits/sample",
    },
  ];

  const activeLayer = hovered !== null ? layers[hovered] : null;

  return (
    <div
      style={{
        margin: "40px 0", padding: 28, borderRadius: 6,
        background: theme.cardBg, border: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
          textTransform: "uppercase" as const, letterSpacing: "0.08em",
          color: theme.textTertiary, marginBottom: 16,
        }}
      >
        Interactive · LeCun's Cake (2016, revised 2019)
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        {/* Cake SVG */}
        <svg viewBox="0 0 200 120" style={{ width: 180, flexShrink: 0 }}>
          {/* Self-supervised — big base */}
          <rect
            x="30" y="50" width="140" height="55" rx="6"
            fill={hovered === 0 ? theme.accentMuted + "40" : theme.accentMuted + "18"}
            stroke={theme.accentMuted}
            strokeWidth={hovered === 0 ? 2 : 1}
            style={{ cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
          />
          <text x="100" y="82" textAnchor="middle" fill={theme.accentMuted}
            fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            SELF-SUPERVISED
          </text>

          {/* Supervised — icing layer */}
          <rect
            x="35" y="32" width="130" height="18" rx="4"
            fill={hovered === 1 ? theme.accentGold + "40" : theme.accentGold + "18"}
            stroke={theme.accentGold}
            strokeWidth={hovered === 1 ? 2 : 1}
            style={{ cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(null)}
          />
          <text x="100" y="44" textAnchor="middle" fill={theme.accentGold}
            fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            SUPERVISED
          </text>

          {/* RL — cherry */}
          <circle
            cx="100" cy="22" r="10"
            fill={hovered === 2 ? theme.accent + "40" : theme.accent + "18"}
            stroke={theme.accent}
            strokeWidth={hovered === 2 ? 2 : 1}
            style={{ cursor: "pointer", transition: "all 0.3s" }}
            onMouseEnter={() => setHovered(2)}
            onMouseLeave={() => setHovered(null)}
          />
          <text x="100" y="25" textAnchor="middle" fill={theme.accent}
            fontSize="6" fontFamily="'JetBrains Mono', monospace" fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            RL
          </text>
          {/* Cherry stem */}
          <path d="M100,12 Q108,4 112,8" stroke={theme.accentMuted} strokeWidth="1.5" fill="none" />
        </svg>

        {/* Description panel */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {activeLayer ? (
            <>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
                fontWeight: 600, color: activeLayer.color, marginBottom: 4,
              }}>
                {activeLayer.label}
                <span style={{ fontWeight: 400, color: theme.textTertiary, marginLeft: 8 }}>
                  {activeLayer.sublabel}
                </span>
              </div>
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif", fontSize: "0.9rem",
                color: theme.textSecondary, lineHeight: 1.55, marginBottom: 6,
              }}>
                {activeLayer.description}
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                color: theme.textTertiary,
              }}>
                Information density: {activeLayer.bits}
              </div>
            </>
          ) : (
            <p style={{
              fontFamily: "'Newsreader', Georgia, serif", fontSize: "0.9rem",
              color: theme.textTertiary, fontStyle: "italic",
            }}>
              Hover each layer to explore LeCun's hierarchy of learning signals.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


export default function AnalogizersPost() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const theme = dark ? THEMES.dark : THEMES.light;
  const S = CONTENT.sections;

  const proseStyle: React.CSSProperties = {
    fontFamily: "'Newsreader', Georgia, serif",
    fontSize: "1.1rem",
    lineHeight: 1.72,
    color: theme.text,
    maxWidth: 640,
    margin: "0 auto",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Newsreader', Georgia, serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: theme.text,
    marginTop: 56,
    marginBottom: 16,
    lineHeight: 1.3,
  };

  const pStyle: React.CSSProperties = { marginBottom: 18 };

  return (
    <div style={{ transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        ::selection { background: ${theme.accent}30; }
      `}</style>

      <article style={{ ...proseStyle, padding: "40px 24px 120px" }}>
        {/* ─── Title ─── */}
        <header style={{ marginBottom: 56 }}>
          <h1
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700, lineHeight: 1.15,
              color: theme.text, marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            {CONTENT.title}
          </h1>
          <p
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "1.15rem", fontStyle: "italic",
              color: theme.textSecondary, lineHeight: 1.5,
            }}
          >
            {CONTENT.subtitle}
          </p>
        </header>

        {/* ─── Epigraph ─── */}
        <blockquote
          style={{
            borderLeft: `3px solid ${theme.accent}`,
            paddingLeft: 20, margin: "0 0 48px",
            fontStyle: "italic", color: theme.textSecondary,
          }}
        >
          <p style={{ marginBottom: 6, fontSize: "1.05rem" }}>
            "{S.opening.epigraph.text}"
          </p>
          <cite style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem", color: theme.textTertiary, fontStyle: "normal",
          }}>
            — {S.opening.epigraph.attribution}
          </cite>
          <SourceRef id="einstein1936" theme={theme} />
        </blockquote>

        {/* ─── Opening ─── */}
        {S.opening.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>
            {i === 2 ? (
              <>
                {p.split("Tomáš Mikolov")[0]}Tomáš Mikolov
                <SourceRef id="mikolov2013" theme={theme} />
                {p.split("Tomáš Mikolov")[1]}
              </>
            ) : (
              p
            )}
          </p>
        ))}

        {/* ─── Embeddings ─── */}
        <h2 style={headingStyle}>{S.embeddings.heading}</h2>
        {S.embeddings.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>
            {p}
            {i === 0 && <SourceRef id="mikolov2013" theme={theme} />}
            {i === 2 && <SourceRef id="allen2019" theme={theme} />}
          </p>
        ))}

        {/* Analogy Explorer */}
        <AnalogyExplorer theme={theme} />

        {/* ─── Saussure ─── */}
        <h2 style={headingStyle}>{S.saussure.heading}</h2>
        {S.saussure.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>
            {p}
            {i === 0 && <SourceRef id="saussure1916" theme={theme} />}
          </p>
        ))}

        {/* Relational diagram */}
        <RelationalDiagram theme={theme} />

        {/* ─── Self-Supervised Learning ─── */}
        <h2 style={headingStyle}>{S.masking.heading}</h2>
        {S.masking.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>
            {p}
            {i === 2 && <SourceRef id="lecun2016" theme={theme} />}
            {i === 3 && <SourceRef id="devlin2018" theme={theme} />}
          </p>
        ))}

        {/* LeCun Cake */}
        <LeCunCake theme={theme} />

        {/* ─── Analogy ─── */}
        <h2 style={headingStyle}>{S.analogy.heading}</h2>
        {S.analogy.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>{p}</p>
        ))}

        {/* Pullquote */}
        <div
          style={{
            margin: "36px 0", padding: "24px 0",
            borderTop: `1px solid ${theme.border}`,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <p
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: "1.3rem", fontStyle: "italic",
              color: theme.accent, lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            {S.analogy.pullquote}
          </p>
        </div>

        {/* ─── Reasoning ─── */}
        <h2 style={headingStyle}>{S.reasoning.heading}</h2>
        {S.reasoning.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>
            {i === 1 ? (
              <>
                {p.split("Nature Human Behaviour")[0]}
                <em>Nature Human Behaviour</em>
                <SourceRef id="webb2023" theme={theme} />
                {p.split("Nature Human Behaviour")[1].split("PNAS Nexus (2025)")[0]}
                <em>PNAS Nexus</em> (2025)
                <SourceRef id="webb2025" theme={theme} />
                {p.split("PNAS Nexus (2025)")[1]}
              </>
            ) : i === 2 ? (
              <>
                {p.split("Harmonic's Aristotle")[0]}Harmonic's Aristotle
                <SourceRef id="harmonic2025" theme={theme} />
                {p.split("Harmonic's Aristotle")[1]}
              </>
            ) : (
              p
            )}
          </p>
        ))}

        {/* Reasoning Spectrum */}
        <ReasoningSpectrum theme={theme} />

        {/* ─── Closing ─── */}
        <h2 style={headingStyle}>{S.einstein.heading}</h2>
        {S.einstein.paragraphs.map((p, i) => (
          <p key={i} style={pStyle}>{p}</p>
        ))}

        {/* ─── Implications ─── */}
        <h2 style={headingStyle}>{S.implications.heading}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 12 }}>
          {S.implications.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem", fontWeight: 600,
                  color: [theme.accentMuted, theme.accentGold, theme.accent][i],
                  minWidth: 90, paddingTop: 3,
                  textTransform: "uppercase" as const, letterSpacing: "0.05em",
                }}
              >
                {b.label}
              </span>
              <p style={{ flex: 1, color: theme.textSecondary, lineHeight: 1.6 }}>{b.text}</p>
            </div>
          ))}
        </div>

        {/* ─── Sources ─── */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${theme.border}` }}>
          <h3
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
              textTransform: "uppercase" as const, letterSpacing: "0.08em",
              color: theme.textTertiary, marginBottom: 16,
            }}
          >
            Sources
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(CONTENT.sources).map(([key, src]) => (
              <div
                key={key}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem", color: theme.textTertiary, lineHeight: 1.5,
                }}
              >
                <span style={{ color: theme.textSecondary, fontWeight: 600 }}>{src.label}</span>
                {" — "}
                {src.detail}
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
