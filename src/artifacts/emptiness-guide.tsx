import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;
export const publishDate = "2026-03-16";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const TALKS = [
  {
    id: "opening",
    num: 1,
    title: "Orienting to the Retreat",
    subtitle: "Opening Talk",
    category: "foundation",
    color: "#c9a84c",
    overview: `This retreat represents a rare, intensive 4-week exploration of emptiness (suññatā) for experienced meditators. Rob frames emptiness and dependent origination as two sides of the same coin — the very heart of what the Buddha awakened to. Without the realization of emptiness, there is no nibbāna.\n\nThe retreat will offer an enormous range of approaches. The key instruction: find one, two, or maybe three approaches that work for you individually, then develop those. Not everyone will resonate with every practice. The goal is to acquire a new skill, a new art — something you can feel bringing freedom.`,
    teachings: [
      {
        heading: "Emptiness Permeates All Dharma",
        content: "These teachings are not specialist or elitist — they permeate every teaching the Buddha gave: generosity, ethics, meditation. They are different strands of the same fabric."
      },
      {
        heading: "Emptiness and Love",
        content: "There is an intimate, bidirectional relationship between emptiness and love. Going deeper into emptiness opens love; going deeper into love opens emptiness. If practice isn't moving toward greater love and compassion over time, something has been misunderstood."
      },
      {
        heading: "The Retreat as Container",
        content: "Expect a non-linear journey. The process unfolds like waves, not a straight line. Difficult periods are not regression — they stand out in contrast to the openings. Ambivalence, excitement, and being daunted are all normal."
      }
    ],
    practices: [
      {
        name: "Orienting Reflection",
        instructions: "At the start of each sitting, briefly check: How am I relating to this practice right now? Am I seeing the beauty and nobility in what I'm engaged in? Or has it become a chore, a performance, a self-improvement project? Simply notice the relationship without forcing change."
      }
    ],
    keyTerms: [
      { term: "Suññatā", def: "Emptiness — the absence of inherent, independent existence in all phenomena and persons" },
      { term: "Paṭicca-samuppāda", def: "Dependent origination — things arise in dependence on conditions, not independently" },
      { term: "Nibbāna", def: "Liberation, the cessation of suffering — follows naturally from the realization of emptiness" }
    ]
  },
  {
    id: "intro-emptiness",
    num: 2,
    title: "An Introduction to Emptiness",
    subtitle: "Core Framework",
    category: "theory",
    color: "#7B9EA8",
    overview: `To realize emptiness is something wonderful — it brings wonderment and joy. We ordinarily take for granted that things have their own solidity, their own independent 'that-ness.' Six billion people would agree. But as we go into meditation, we begin to see things are not as they seem.\n\nWe suffer because we assent to the appearance of solidity and independent reality. More than that — we actually make it so. We fabricate the solidity of things without realizing it. To the degree we can realize emptiness, to that degree freedom is available.\n\nRob introduces two pedagogical categories: the emptiness of the personal self, and the emptiness of phenomena (all things). These are not truly separate — it's the same emptiness — but the division helps structure investigation.`,
    teachings: [
      {
        heading: "Two Emptinesses (Pedagogical Division)",
        content: "Emptiness of the personal self (pudgala-śūnyatā): The sense of 'I' lacks inherent, independent existence. Emptiness of phenomena (dharma-śūnyatā): All things — body, clock, world — lack inherent existence. Same emptiness, different entry points."
      },
      {
        heading: "We Fabricate Solidity",
        content: "The key insight: we don't just passively perceive a solid world — we actively construct it. The mind makes things appear solid and real through habitual patterns of clinging, identification, and conceptual overlay. This fabrication process (saṅkhāra) is what meditation exposes."
      },
      {
        heading: "Freedom Scales with Seeing",
        content: "This is not binary. To the degree, to the depth, to the comprehensiveness that we realize the emptiness of things — to that same degree, depth, and comprehensiveness, freedom is available. It's a spectrum, not a switch."
      },
      {
        heading: "Emptiness and Self-View",
        content: "When I trap myself or another in an overly rigid self-concept, that creates suffering. When that fixed view softens — through seeing its constructed nature — love and flexibility naturally emerge."
      }
    ],
    practices: [
      {
        name: "Noticing Fabrication in Daily Life",
        instructions: "Off the cushion: When something appears solid and obviously 'real' — a worry, a person's character, a situation — pause and ask: What am I adding to this? What concepts, memories, and assumptions am I layering onto what's actually present? Notice how the apparent solidity increases with more mental elaboration, and decreases with simple, direct attention."
      },
      {
        name: "The Solidification Question",
        instructions: "In meditation: When a difficult or compelling experience arises, gently inquire: 'Is this as solid as it seems?' Don't force an answer. Simply hold the question lightly and observe what happens to the experience when you do."
      }
    ],
    keyTerms: [
      { term: "Svabhāva", def: "Inherent existence — the (illusory) quality of things seeming to exist independently, from their own side" },
      { term: "Saṅkhāra", def: "Fabrication / construction — the mental processes that build up the appearance of solidity" },
      { term: "Pudgala-śūnyatā", def: "Emptiness of the personal self" },
      { term: "Dharma-śūnyatā", def: "Emptiness of all phenomena" }
    ]
  },
  {
    id: "samadhi",
    num: 3,
    title: "Samādhi and Insight",
    subtitle: "A Few Pointers",
    category: "practice",
    color: "#2D6A4F",
    overview: `Samādhi is not mere 'concentration' in the narrow English sense. It is the mind and body feeling unified, settled, steady, in a state of well-being. Think of it as a sliding scale, not an on/off switch — just like calmness has degrees.\n\nThe critical instruction: maintain two parallel practices throughout. Roughly 50% of sitting time for samādhi (via breath, mettā, or other means), and 50% for emptiness/insight practices. These are deeply complementary — samādhi provides the stability and well-being that makes insight practice possible, while insight opens new dimensions of samādhi.`,
    teachings: [
      {
        heading: "Samādhi as Spectrum",
        content: "Don't set up a rigid duality of 'have it / don't have it.' Simply notice where you are on the spectrum and gently encourage a bit more settling, a bit more unification. The interest is in movement along the scale, not achieving a fixed state."
      },
      {
        heading: "The 50/50 Principle",
        content: "Half your sitting time: dwelling in well-being, gatheredness, settledness. Half: emptiness and insight practices. Both are developed in parallel. Samādhi without insight tends to become a pleasant dead-end. Insight without samādhi tends to be dry, destabilizing, or superficial."
      },
      {
        heading: "Samādhi Supports Insight",
        content: "A well-collected mind sees more subtly. The depth of insight available is directly related to the quality of samādhi supporting it. Additionally, the well-being of samādhi provides an inner resource that makes it safe to look at difficult truths."
      },
      {
        heading: "Why Not Just Insight?",
        content: "Some traditions suggest samādhi is irrelevant — just do insight. Rob's experience is that this doesn't bear out. The exceptions exist, but for most practitioners, the quality and depth of liberating insight depends heavily on the quality of samādhi."
      }
    ],
    practices: [
      {
        name: "Breath-Based Samādhi",
        instructions: "Sit comfortably. Bring attention to the breath at the nostrils, belly, or whole body — wherever feels most natural. The aim is not to control the breath but to rest with it. When the mind wanders, gently return. Over time, allow the sense of body and breath to become unified — the breath 'breathing through' the whole body. Notice whatever degree of pleasantness or ease is present, and gently incline toward it. Let that become the anchor."
      },
      {
        name: "Mettā-Based Samādhi",
        instructions: "Begin with whatever phrases or intentions of goodwill feel genuine. Direct mettā to yourself, then expand. The key: when warmth arises in the body — however faint — turn attention to that feeling. Let the feeling itself become the primary object rather than the words. This bodily warmth can become a powerful basis for unification and well-being."
      }
    ],
    keyTerms: [
      { term: "Samādhi", def: "Unification of mind and body in a state of well-being and steadiness — a spectrum, not a binary" },
      { term: "Samatha", def: "Calm, tranquility practice — the practices that develop samādhi" },
      { term: "Vipassanā", def: "Insight practice — seeing into the nature of experience" },
      { term: "Jhāna", def: "States of deep absorption/samādhi — Rob uses the term sparingly, preferring 'samādhi as open spectrum'" }
    ]
  },
  {
    id: "self",
    num: 4,
    title: "The Experience of Self",
    subtitle: "Personality and Beyond",
    category: "theory",
    color: "#6B4C8A",
    overview: `The project is not to destroy or dissolve the self. It is to understand its emptiness — to see how the self-sense is constructed, dependent, and not the fixed, solid entity it appears to be.\n\nCritically, Rob emphasizes that it is often completely appropriate to think, feel, and act in terms of self: taking responsibility, maintaining relationships, practicing ethics. The question is always: what leads to suffering and what leads to freedom?\n\nThe self-sense operates on a spectrum. At one end: a very contracted, solid, suffering-laden self. At the other: a very quiet, spacious sense that may barely register. We can learn to recognize where we are on this spectrum and see how the self-sense is constructed moment by moment.`,
    teachings: [
      {
        heading: "Self on a Spectrum",
        content: "The sense of self is not fixed — it fluctuates constantly. In moments of deep ease or absorption, it quiets dramatically. In moments of reactivity, it contracts and solidifies. Learning to see these fluctuations is itself a form of insight."
      },
      {
        heading: "Self Is Dependently Arising",
        content: "The self-sense depends on clinging and aversion. When you make something a big deal — either by grasping or pushing away — the self-sense inflates. When clinging relaxes, the self naturally quiets. It isn't independently existing; it is built by mental activity."
      },
      {
        heading: "Appropriate Self-Sense",
        content: "Ethics requires a sense of responsibility — a self taking care. Relationships require acknowledgment of self and other. Not everything needs to be hit with 'it's empty.' The art is knowing when the self-sense is helpful and when it's creating unnecessary suffering."
      },
      {
        heading: "Personality Is Not the Enemy",
        content: "This isn't about becoming a blank. Personality, preferences, character — these can remain and even flourish. What changes is the identification with them as solid, fixed, and essential. They become more like clothes one wears than the core of who one is."
      }
    ],
    practices: [
      {
        name: "Self-Sense Spectrum Awareness",
        instructions: "Throughout the day and in meditation, periodically check: How prominent is the sense of self right now? Very contracted and solid? Relatively quiet? Somewhere in between? Simply notice, without trying to change it. Over time, you begin to see the correlation: more clinging/aversion = more contracted self; less clinging = quieter self."
      },
      {
        name: "Tracking Self-Construction",
        instructions: "In meditation, when a strong emotion or reaction arises, notice what happens to the self-sense. Does it inflate? Contract? Solidify? Trace the building: What thought, judgment, or story is feeding the sense of self right now? Just see the construction happening — you don't need to stop it."
      }
    ],
    keyTerms: [
      { term: "Anattā", def: "Not-self — phenomena (including the self-sense) lack an inherent, fixed essence" },
      { term: "Sakkāya-diṭṭhi", def: "Identity view — the deep-seated belief in a fixed, inherent self" },
      { term: "Upādāna", def: "Clinging — the mental activity that builds and solidifies the self-sense" }
    ]
  },
  {
    id: "guided-3c",
    num: 5,
    title: "Guided Meditation: Three Characteristics",
    subtitle: "Direct Practice",
    category: "guided",
    color: "#E76F51",
    overview: `A three-part guided meditation introducing experiential contact with anicca (impermanence), dukkha (unsatisfactoriness), and anattā (not-self). This is not philosophical contemplation — it is a direct, felt investigation of moment-to-moment experience.\n\nThe meditation moves from focused body sensation to sounds to visual field, training the capacity to see change, unsatisfactoriness, and the absence of a fixed self in all sense doors.`,
    teachings: [
      {
        heading: "Anicca (Impermanence) Practice",
        content: "Begin with hands, then face, then whole body: tune into the fact of constant change. Sensations pulse, throb, flicker. Don't pressure the awareness to see a particular rate of change — just see whatever change presents itself. Then expand to include sounds arising and passing, and visual field changes."
      },
      {
        heading: "Dukkha (Unsatisfactoriness) Practice",
        content: "Bring to mind something you're wanting or looking forward to. Feel the wanting energy. Then see: this wanting, this leaning forward — is there a subtle stress in it? Even pleasant anticipation has a quality of reaching, incompleteness. See the unsatisfactoriness inherent in the wanting itself, not in the object."
      },
      {
        heading: "Anattā (Not-Self) Practice",
        content: "Focus on body sensations. See them as just appearing and disappearing — floating, not belonging to anyone. 'Not me, not mine.' Unhook the habitual identification. They're just happening. Nothing solid that these sensations belong to. Sustain this way of seeing lightly, spaciously."
      }
    ],
    practices: [
      {
        name: "Three Characteristics Meditation (Full)",
        instructions: "Part 1 — Anicca: 15 minutes. Tune into sensations in the hands → face → whole body → sounds → visual field. Focus on change itself — the flickering, pulsing, arising-passing nature of all experience.\n\nPart 2 — Dukkha: 10 minutes. Bring to mind something desired. Feel the wanting energy directly in the body. See the subtle stress, the reaching, the incompleteness inherent in the wanting itself. Then: can everything that arises be met with 'unsatisfactory, unsatisfactory' — not as rejection, but as releasing the grip?\n\nPart 3 — Anattā: 15 minutes. Rest attention on body sensations. See them as 'not me, not mine' — events happening in space with no fixed owner. Expand to sounds, thoughts, all phenomena: just arising, just passing, not belonging to anyone."
      }
    ],
    keyTerms: [
      { term: "Tilakkhaṇa", def: "The three characteristics: anicca, dukkha, anattā — not beliefs but ways of looking that bring freedom" },
      { term: "Anicca", def: "Impermanence — the constant change of all conditioned experience" },
      { term: "Dukkha", def: "Unsatisfactoriness — the inherent inability of any conditioned experience to fully satisfy" },
      { term: "Anattā", def: "Not-self — the absence of a fixed, inherent owner in any experience" }
    ]
  },
  {
    id: "three-characteristics",
    num: 6,
    title: "Three Characteristics",
    subtitle: "Three Avenues to Freedom and Joy",
    category: "theory",
    color: "#457B9D",
    overview: `The Buddha's teaching is concerned with the release of unnecessary suffering. We participate in building suffering through the ways we see and relate to experience. Insight meditation uncovers how the mind does this, and then learns to do it less.\n\nThe three characteristics are not facts to be believed — they are ways of looking, ways of seeing that bring freedom when practiced. They are tools, not doctrines. Each functions as a different 'angle of release' on the same suffering.`,
    teachings: [
      {
        heading: "Ways of Looking, Not Beliefs",
        content: "This is perhaps the most important reframing Rob offers. The three characteristics are not metaphysical claims about reality. They are practices — deliberate modes of attention that, when sustained, reduce suffering and reveal the constructed nature of experience. The test is pragmatic: does this way of looking bring more freedom, more ease, more love?"
      },
      {
        heading: "Four (or Five) Ways of Working",
        content: "Rob actually divides the three into four or five practical approaches: (1) Seeing impermanence directly. (2) Seeing unsatisfactoriness as impermanence — things can't satisfy because they don't last. (3) Letting be / letting go — feeling the push-pull of aversion and grasping, and relaxing it. (4) Feeling the relationship with experience (clinging/aversion) and relaxing that. (5) Anattā — unhooking identification with phenomena."
      },
      {
        heading: "Samādhi in the Insight Practices",
        content: "In samādhi practice, the self gets quiet naturally as the push-pull relaxes. We're not building a sense of self or world. This is itself a significant insight: the self-sense is dependent on activity that can be stilled."
      },
      {
        heading: "Liberating the Moment",
        content: "Each application of these ways of looking liberates the present moment to some degree. And as the understanding deepens through repetition, it moves toward points of more lasting liberation. The moment-by-moment practice and the trajectory toward awakening are not separate."
      }
    ],
    practices: [
      {
        name: "Impermanence Practice (Anicca)",
        instructions: "In any posture, direct attention to whatever is most prominent in experience — sensation, sound, mental event. See the change. Not the 'thing' that changes, but the fact of change itself. Let change be the figure, not the ground. Can you see that nothing in experience holds still even for a moment?"
      },
      {
        name: "Letting Go of Push-Pull",
        instructions: "Notice any moment of aversion (pushing away) or grasping (pulling toward). Feel it in the body — the subtle tension, leaning, bracing. Without needing to understand why, simply relax that tension. Let the body soften around the push or pull. Notice what happens to the experience, and to the sense of self, when the push-pull relaxes even slightly."
      },
      {
        name: "Anattā Practice (Not-Self)",
        instructions: "As phenomena arise — sensations, sounds, thoughts, emotions — practice seeing them as 'not me, not mine.' You can use quiet mental noting if helpful: 'not-self,' 'not me,' 'not mine.' What you're doing is setting up a way of seeing — a deliberate disidentification. Sustain this lightly. Over time, notice: when identification loosens, what happens to the suffering? What happens to the self-sense?"
      }
    ],
    keyTerms: [
      { term: "Ways of looking", def: "Rob's central framework — deliberate modes of attention/perception that bring freedom. The three characteristics are examples." },
      { term: "Taṇhā", def: "Craving / thirst — the push-pull of wanting and not-wanting that fabricates suffering" },
      { term: "Viveka", def: "Seclusion / disengagement — the quality of mind that steps back from habitual entanglement" }
    ]
  },
  {
    id: "wise-relationship",
    num: 7,
    title: "A Wise Relationship to Practice",
    subtitle: "Meta-Practice",
    category: "foundation",
    color: "#c9a84c",
    overview: `Where there is practice, there is always a relationship with practice. This relationship has an enormous, often unrecognized, impact on the practice itself and on one's entire life.\n\nRob asks: How am I relating to this whole endeavour? How do I relate to effort, goals, the notion of a path? How do I relate when I don't understand something? How do I relate to learning new approaches? How do I relate to 'doing' in practice? The general tendencies we find will shape everything.`,
    teachings: [
      {
        heading: "The Relationship Shapes the Practice",
        content: "If the relationship with practice has become one of self-improvement, performance, or achievement — the practice will be subtly distorted. If it's one of beauty, nobility, and genuine curiosity — the practice opens. Seeing the beauty in what you're doing matters enormously."
      },
      {
        heading: "Common Distortions",
        content: "Practice becoming a means of self-measurement or self-criticism. Over-efforting vs. passivity. 'Spiritual ambition' that is really ego dressed in robes. A mechanical, joyless relationship with sitting. Each of these warps the container that practice needs to unfold."
      },
      {
        heading: "Care Without Pressure",
        content: "The ideal: deep care about the practice and its fruits, without the care becoming pressure, demand, or compulsion. Aspiration without desperation. This is itself a practice — noticing when the care tips into pressure and gently softening."
      },
      {
        heading: "Playfulness and Experimentation",
        content: "Rob consistently invites a spirit of experiment. Try things. See what works. If something isn't working, try something else. This isn't casual — it's a sophisticated responsiveness to the actual needs of the practice in this moment."
      }
    ],
    practices: [
      {
        name: "Relationship Check-In",
        instructions: "At the beginning of a sit, or when you notice the practice has gone flat or strained: pause and ask — 'What is my relationship with practice right now?' Am I trying to get somewhere? Am I afraid I'm failing? Am I bored and just going through motions? Am I comparing myself to some standard? Just see it clearly, without judgment. Often, simply seeing the distorted relationship is enough to let it soften."
      }
    ],
    keyTerms: [
      { term: "Sammā-vāyāma", def: "Right effort — effort that is balanced, wise, neither straining nor passive" },
      { term: "Ārambha-dhātu", def: "The element of initiative — the willingness to engage and begin" }
    ]
  },
  {
    id: "sevenfold",
    num: 8,
    title: "The Seven-Fold Reasoning",
    subtitle: "The Self Cannot Be Found Anywhere",
    category: "practice",
    color: "#9B2226",
    overview: `It's easy to say 'the self is an illusion.' The question is how to see this deeply enough that it penetrates the heart and brings transformation. The Seven-Fold Reasoning, elaborated by the 7th-century Indian master Chandrakīrti (with roots in the Pali Canon), is a systematic analytical meditation that searches for the self in every conceivable location — and fails to find it.\n\nThis practice is complementary to the anattā practice. Where anattā practice disidentifies from phenomena in the present moment, the Seven-Fold Reasoning directly searches for the self and demonstrates its unfindability. They reinforce each other.`,
    teachings: [
      {
        heading: "The Seven Examinations",
        content: "Search for the self in relation to the aggregates (body, feelings, perceptions, mental formations, consciousness): (1) Is the self identical to the aggregates? (2) Is the self different from the aggregates? (3) Is the self the container of the aggregates? (4) Is the self contained within the aggregates? (5) Are the aggregates possessed by the self? (6) Is the self the mere shape/form of the aggregates? (7) Is the self the collection of the aggregates?"
      },
      {
        heading: "Not Intellectual — Meditative",
        content: "This reasoning must be taken into meditation and felt directly. When you search for the self in relation to the body and can't find it there — feel that. Feel the absence. Let the not-finding be experiential, not merely logical. The gap between 'understanding this intellectually' and 'seeing it meditatively' is where the real work lies."
      },
      {
        heading: "Building on Anattā Practice",
        content: "If the anattā practice has been giving you some taste of disidentification and space — this reasoning fills out what that means and why it works. Each practice strengthens the other. The seven-fold reasoning provides the intellectual scaffolding; the anattā practice provides the experiential ground."
      }
    ],
    practices: [
      {
        name: "Seven-Fold Reasoning Meditation",
        instructions: "After establishing some samādhi:\n\n1. Bring to mind a strong sense of 'I' — 'I am sitting here, I am meditating.'\n2. Now investigate: Is this 'I' the same as my body? If my body changes, do I change in exactly the same way? Can I find the 'I' in my arm, my leg, my brain?\n3. Is this 'I' something separate from my body and mind? If so, where is it? Can I point to it?\n4. Does the 'I' contain these experiences, like a bowl containing fruit?\n5. Is the 'I' contained within the experiences?\n6. Does the 'I' possess the experiences, like an owner possesses property?\n7. Is the 'I' just the shape or pattern of these experiences? Just the collection?\n\nIn each case, really look. Feel the search. And notice: the self cannot be found. Not anywhere. Let that not-finding land in the body and heart, not just the intellect."
      }
    ],
    keyTerms: [
      { term: "Chandrakīrti", def: "7th-century Indian Buddhist master who elaborated the Seven-Fold Reasoning in the Madhyamakāvatāra" },
      { term: "Khandha / Skandha", def: "The five aggregates: form, feeling, perception, mental formations, consciousness — the components of experience" },
      { term: "Madhyamaka", def: "The 'Middle Way' philosophical school, emphasizing the emptiness of all phenomena — neither eternal existence nor nihilistic non-existence" }
    ]
  },
  {
    id: "concepts",
    num: 9,
    title: "Concepts, Views, Reality",
    subtitle: "The Role of the Thinking Mind",
    category: "theory",
    color: "#3D348B",
    overview: `Attitudes, views, and preconceptions profoundly shape what we experience — on a gross and a very subtle level, often without our awareness. Two concepts dominant in Insight Meditation and Zen traditions receive critical examination: 'bare attention' and the denigration of thought.\n\nBare attention is a real and valuable capacity, foundational for this work. But it is not the whole story. And the dismissal of thinking, concepts, and views can itself become a view that limits practice. Concepts and thinking are tools — to be used wisely, not uniformly suppressed.`,
    teachings: [
      {
        heading: "Bare Attention: Foundation, Not Ceiling",
        content: "The ability to meet experience simply, directly, rawly — this takes years to develop and is genuinely beautiful. It is a foundation for emptiness practice. But mistaking this foundation for the whole building can prevent deeper investigation. Emptiness practice goes beyond bare attention — it involves deliberate ways of looking."
      },
      {
        heading: "The Value of Thought",
        content: "Much of what Rob teaches involves deliberate conceptual engagement — reflections, analyses, questions held in meditation. The anti-thought bias in many meditation cultures can actually be a hindrance. The key distinction: unhelpful rumination vs. wise, directed contemplation in the service of insight."
      },
      {
        heading: "Views Shape Perception",
        content: "This is one of Rob's deepest points: the very perception of reality is dependent on the views, concepts, and frameworks we bring. 'Bare attention' is itself a view that shapes what appears. There is no view-free perception. This insight is itself a dimension of emptiness — even our most 'direct' experience is conditioned."
      },
      {
        heading: "Precision Matters",
        content: "Rob repeatedly emphasizes precision in practice — knowing what you're doing and why. Vague, mushy practice tends to produce vague, mushy results. The conceptual frameworks and practices are offered with real precision, and that precision serves the depth of insight."
      }
    ],
    practices: [
      {
        name: "Noticing Views in Meditation",
        instructions: "During a sit, periodically notice: what view am I holding right now? 'I should be calm.' 'This experience is good/bad.' 'I'm supposed to just be present.' See how these views — even very subtle, pre-verbal ones — shape what you perceive and how you relate to it. You don't need to eliminate the views. Just see them operating."
      }
    ],
    keyTerms: [
      { term: "Diṭṭhi", def: "View — any perspective, explicit or implicit, that shapes how we perceive and relate to experience" },
      { term: "Bare attention", def: "The capacity to meet experience simply and directly — foundational but not the whole path" },
      { term: "Papañca", def: "Conceptual proliferation — the tendency of mind to elaborate endlessly, generating suffering" }
    ]
  },
  {
    id: "guided-vastness",
    num: 10,
    title: "Guided Meditation: Vastness of Awareness",
    subtitle: "Direct Practice",
    category: "guided",
    color: "#E76F51",
    overview: `A guided meditation establishing awareness as vast, open sky — a spacious container for all appearances. This is not a metaphysical claim about awareness being 'real' or 'ultimate.' It is a way of looking that reduces identification, reduces clinging, and opens a profound sense of space and peace.`,
    teachings: [
      {
        heading: "Awareness as Open Sky",
        content: "Imagine awareness like an infinitely vast, clear, bright sky. Appearances — sensations, thoughts, sounds, images — arise and dissolve like clouds drifting through, fireflies flickering, shooting stars. The sky is undisturbed by what appears within it."
      },
      {
        heading: "No Need to Control",
        content: "In that vastness, there is space for everything. No need to push anything away or hold anything. Clinging to nothing, rejecting nothing. The practice is one of receptive openness, not active management."
      },
      {
        heading: "Silence and Stillness",
        content: "Notice the silence between and around sounds. Sounds arise from silence and return to silence. Rest in that ground of silence. This is not enforced silence but the natural spaciousness that is always already present."
      }
    ],
    practices: [
      {
        name: "Vastness of Awareness Meditation",
        instructions: "1. Settle into posture. Calm with breath or mettā for a few minutes.\n2. Feel into the body, the stillness within the body.\n3. Open awareness wide to sounds — near, far, all sounds. Notice arising and passing.\n4. Notice silence between sounds. Rest in that silence.\n5. Imagine the mind as an open, infinite sky. Appearances arise and dissolve — sensations like fireflies, thoughts like clouds, sounds like distant thunder. All arising and fading in that vastness.\n6. Let everything belong to that space. No need to label, control, or interfere. Everything is embraced in the vastness without effort.\n7. Rest here for 20-40 minutes."
      }
    ],
    keyTerms: [
      { term: "Viññāṇa", def: "Consciousness / awareness — here used as an object of meditation, a 'way of looking,' not claimed as ultimately real" },
      { term: "Ākāsa", def: "Space — physical and mental spaciousness" }
    ]
  },
  {
    id: "awareness-emptiness",
    num: 11,
    title: "Emptiness and the Vastness of Awareness",
    subtitle: "Going Deeper",
    category: "theory",
    color: "#7B9EA8",
    overview: `The point of all this is less dukkha. Everything is in service of that. So far, the emphasis has been mostly on the emptiness of the personal self. Now Rob begins expanding into the emptiness of phenomena — and crucially, the emptiness of awareness itself.\n\nA common trap in meditation: taking awareness as 'the one real thing.' Many traditions (and many practitioners' experiences) point toward awareness as the ultimate ground, the container that holds everything. Rob challenges this: awareness itself is also empty, also a dependent arising. This is not obvious — and it matters profoundly.`,
    teachings: [
      {
        heading: "Suffering Needs a Center of Gravity",
        content: "Suffering orbits a sense of self. When the self-sense quiets (through any practice), suffering reduces. When identification is released, suffering drains out of the experience. This is the bedrock insight — and it's what we build on."
      },
      {
        heading: "Hidden Identification with Awareness",
        content: "Even when you've let go of identification with body, thoughts, emotions — there can be a subtle identification with awareness itself, with the 'one who knows.' This is enough to keep suffering in place. The key: can this identification also be seen and released?"
      },
      {
        heading: "Awareness Is Also Empty",
        content: "Whether someone believes 'awareness is the only real thing' as philosophy or as direct intuition — if that belief remains unexamined, the deep suffering structure remains intact. Awareness itself is a dependent arising. Seeing this requires going deeper than most meditation traditions typically go."
      },
      {
        heading: "The Gut Level, Not Philosophy",
        content: "The problem is not philosophical. It's not that we hold the wrong metaphysical view. The deep problem is the innate, intuitive, visceral sense that things have inherent existence. Intellectual correction of this doesn't reach deep enough. We need meditative seeing."
      }
    ],
    practices: [
      {
        name: "Releasing Identification with Awareness",
        instructions: "After establishing the vastness of awareness practice: begin to notice — is there a subtle identification with awareness itself? A sense of 'I am this awareness'? 'This is the real me'? Gently apply the same disidentification: 'Not me, not mine.' Even this awareness is appearing, is conditioned, is a dependent arising. Can you let go of claiming even this? Notice what happens when you do."
      }
    ],
    keyTerms: [
      { term: "Viññāṇa-anattā", def: "The not-self nature of consciousness/awareness — awareness too is empty" },
      { term: "Ālaya", def: "Store-consciousness / ground awareness — sometimes reified as ultimate, here examined as also empty" }
    ]
  },
  {
    id: "nonduality",
    num: 12,
    title: "Non-Duality and the Fading of Perception",
    subtitle: "Advanced Territory",
    category: "theory",
    color: "#1B4965",
    overview: `Things arise in terms of and relative to something else — in opposition, in duality. This is another dimension of dependent arising. The realm of dualities — subject/object, self/other, inner/outer, pleasant/unpleasant — is itself a fabrication that can be seen through.\n\nRob tells a parable from the Pali Canon: The Buddha says that even with strides spanning continents, walking for a hundred aeons, you wouldn't reach the end of the world. But without seeing the end of the world, there is no liberation. The 'end of the world' is the fading and cessation of the perceptual world that we construct.`,
    teachings: [
      {
        heading: "Dualities Are Fabricated",
        content: "Subject and object, pleasant and unpleasant, self and world — these apparent dualities are not given 'from the outside.' They are constructed by the mind's habitual patterning. As practice deepens, the boundaries between these apparent opposites become more fluid, less fixed."
      },
      {
        heading: "The Fading of Perception",
        content: "As the ways of looking are sustained with increasing samādhi, perceptions begin to fade. The apparently solid world of distinct objects and clear boundaries starts to dissolve. This is not pathological — it's the expected result of deeply seeing the constructed nature of perception."
      },
      {
        heading: "Cessation of Perception",
        content: "Taken all the way, sustained disidentification and seeing of emptiness leads to cessation — the temporary cessation of perception. Some modern Dharma circles dismiss this as irrelevant. Rob disagrees: it's a natural and important development on the path."
      },
      {
        heading: "The Bell Curve of Perception",
        content: "There's a characteristic pattern: at first, with increasing mindfulness, experience becomes more vivid — tastes more distinct, sensations clearer. But with even deeper practice (more samādhi, more equanimity, more disidentification), this vividness begins to fade as the fabricating processes that construct it are seen through."
      }
    ],
    practices: [
      {
        name: "Dissolving Subject-Object Boundary",
        instructions: "In meditation, when awareness is settled: notice the apparent boundary between 'the one who knows' and 'that which is known.' Is there really a clear line between awareness and its objects? Or do they arise together, mutually dependent? Play with softening the sense that 'I am here, watching that over there.' Let the distinction become less rigid."
      },
      {
        name: "Watching Perception Fade",
        instructions: "With strong samādhi and equanimity established, sustain any of the emptiness practices — anattā, letting go, seeing impermanence. Simply continue without interruption. Over time, notice if the 'edges' of things begin to soften, if perceptions become less distinct, less solid. Don't force this — just notice if it happens naturally as the seeing deepens."
      }
    ],
    keyTerms: [
      { term: "Advaya", def: "Non-duality — the absence of inherent separation between apparent opposites" },
      { term: "Nirodha", def: "Cessation — the temporary or lasting cessation of suffering and/or perceptual fabrication" },
      { term: "Saññā-vedayita-nirodha", def: "Cessation of perception and feeling — a deep meditative attainment where fabrication temporarily stops" }
    ]
  },
  {
    id: "maps",
    num: 13,
    title: "Maps for the Journey",
    subtitle: "A Brief Overview",
    category: "foundation",
    color: "#c9a84c",
    overview: `A review and integration talk, taking stock of where the retreat has traveled. Rob provides a map — not the only possible map, but a clear one — showing how the practices relate and where they lead.\n\nThe progression: Samādhi → Three Characteristics (ways of looking) → Anattā → Seven-Fold Reasoning → Emptiness of phenomena → Vastness of awareness → Non-duality → Fading of perception → Cessation. With mettā and the relationship to practice as ongoing threads throughout.`,
    teachings: [
      {
        heading: "The Progression (Not Linear)",
        content: "The practices build on each other, but not strictly linearly. The map: (1) Samādhi as foundation and parallel practice. (2) Three characteristics as ways of looking. (3) Self-emptiness through anattā and seven-fold reasoning. (4) Phenomena-emptiness through investigation of awareness, concepts, objects. (5) Non-duality and fading. Each 'level' makes the next accessible."
      },
      {
        heading: "Samādhi Remains Central",
        content: "Even at advanced stages, 50/50 with samādhi remains the instruction. The depth of insight available is always related to the quality of samādhi. Don't abandon it."
      },
      {
        heading: "Skilful Abiding",
        content: "Before anything else, the three characteristics practices offer skilful abiding — ways to suffer less right now, in this moment. This is valuable in itself, independent of any grand trajectory toward awakening."
      },
      {
        heading: "Finding What Works",
        content: "Everyone connects with different practices at different times. The wide offering is intentional — so each person can find their entry point. Don't try to do everything simultaneously."
      }
    ],
    practices: [
      {
        name: "Personal Practice Map",
        instructions: "Take some time to reflect: Of all the practices offered, which 1-3 are actually alive for me? Where do I feel the freedom coming? Be honest — not which ones 'should' work, but which actually bring a felt sense of release, of the suffering reducing, of the self quieting. Those are the ones to develop. The others can be filed for later."
      }
    ],
    keyTerms: [
      { term: "Pariyatti", def: "Study / learning — the conceptual understanding of the teachings" },
      { term: "Paṭipatti", def: "Practice — the actual meditative cultivation" },
      { term: "Paṭivedha", def: "Penetration / realization — the direct, transformative seeing" }
    ]
  },
  {
    id: "no-thing",
    num: 14,
    title: "'To See No-Thing Is to See Excellently'",
    subtitle: "Emptiness of Phenomena",
    category: "theory",
    color: "#264653",
    overview: `Expanding into the emptiness of all phenomena — not just the personal self, but everything. The Mahāyāna historically arose partly to emphasize this: not just personal selflessness, but the emptiness of all dharmas (phenomena).\n\nRob throws out 'seeds' — different angles and approaches for investigating the emptiness of phenomena. Different practitioners will find different seeds grow. The instruction is to not feel overwhelmed but to take what resonates.`,
    teachings: [
      {
        heading: "One Who Does Not See Phenomena Sees Reality",
        content: "A striking statement: when the fabricated perceptual world is seen through — when phenomena are seen as empty — that is seeing reality. Not a nihilistic absence, but a profound recognition that what we normally take as 'the way things are' is a construction."
      },
      {
        heading: "Self-Doubt as Pattern",
        content: "Rob addresses a common retreat pattern: doubting one's capabilities, dismissing what one has seen. Everyone in the room, he insists, is beginning to get some sense of emptiness. If you feel you're outside of that, it's not true. Appreciating one's own practice is foundational for healthy, penetrating investigation."
      },
      {
        heading: "Multiple Entry Points",
        content: "The emptiness of phenomena can be approached through: investigating the constructed nature of any specific object; seeing how perception depends on the mind; noticing how things don't exist in the way they appear; investigating dependent origination at deeper levels."
      }
    ],
    practices: [
      {
        name: "Investigating a Single Object",
        instructions: "Choose any object of attention — a sound, a sensation, the breath. Investigate: Where exactly is this thing? When does it start and stop? Is it one thing or many? Is there a boundary between it and everything else? Can I find any solid, independent core to it? Don't seek an answer — let the investigation itself soften the sense of the object's solidity."
      }
    ],
    keyTerms: [
      { term: "Dharma-nairātmya", def: "The selflessness/emptiness of all phenomena — not just personal selflessness" },
      { term: "Prajñāpāramitā", def: "The Perfection of Wisdom — the Mahāyāna literature that elaborates the emptiness of all dharmas" }
    ]
  },
  {
    id: "love-healing",
    num: 15,
    title: "Love, Healing, and Emptiness",
    subtitle: "The Heart of the Path",
    category: "theory",
    color: "#8B6914",
    overview: `Emptiness practice should lead to deepening love and compassion. If it doesn't — over time — something has been misunderstood. Rob is emphatic: this is one of the most central connections in the entire retreat.\n\nRealization of emptiness opens our capacity to love, purifies our love of projection and neediness, and directly loosens the sense of separation between self and other that makes love feel limited or conditional.`,
    teachings: [
      {
        heading: "Bidirectional Relationship",
        content: "Deeper emptiness opens more love. Deeper love opens more emptiness. They feed each other. If this surprises you or if you suspect they're unrelated — that's worth investigating."
      },
      {
        heading: "How Emptiness Opens Love",
        content: "Less clinging → less self-sense → less sense of separation between self and other → more natural compassion and connection. The barriers to love are largely constructed by the same fabrication processes that construct the solid self."
      },
      {
        heading: "Purification of Love",
        content: "Emptiness purifies love of projection, neediness, self-centredness, self-interest. What remains is a love that is less about 'what I get' and more about simple, available presence and care."
      },
      {
        heading: "Fearlessness and Service",
        content: "The capacity to serve, to give, to be available to others depends on fearlessness. And fearlessness depends on seeing emptiness — because when there is less to protect, less that can be threatened, the willingness to extend toward others naturally increases."
      }
    ],
    practices: [
      {
        name: "Emptiness-Mettā Integration",
        instructions: "After doing some emptiness practice (anattā, letting go, etc.) and feeling the self quiet somewhat: transition into mettā. Notice how the mettā practice feels different when started from a place of lessened self-sense. Is there more spaciousness? More naturalness? Less efforting? Let the emptiness and the love feed each other."
      }
    ],
    keyTerms: [
      { term: "Karuṇā", def: "Compassion — the wish that beings be free from suffering" },
      { term: "Mettā", def: "Loving-kindness — unconditional goodwill toward all beings" },
      { term: "Bodhicitta", def: "The 'awakening mind' — the aspiration to realize emptiness for the benefit of all beings" }
    ]
  },
  {
    id: "no-mind",
    num: 16,
    title: "No Mind",
    subtitle: "Deepening the Map",
    category: "practice",
    color: "#6A040F",
    overview: `Rob begins a set of four talks mapping how practice can deepen into the furthest reaches. The emphasis: this is about development of practice toward direct, freeing seeing of emptiness. Not theory for theory's sake.\n\nThe key teaching: awareness itself — even the vast, open, 'sky-like' awareness that many traditions take as the ultimate — is also empty of inherent existence. It is also a dependent arising. The gut-level sense that things inherently exist is the root of suffering, not the philosophical belief.`,
    teachings: [
      {
        heading: "Care and Aspiration",
        content: "What Rob resonates with: a practitioner who has care, who has aspiration to understand more, be freer. Where one is on the path is completely irrelevant — what matters is the care. He meets practitioners where their care is."
      },
      {
        heading: "The Default View of Inherent Existence",
        content: "Whether someone philosophically believes awareness is real or empty — if the deeper, visceral, intuitive sense of inherent existence hasn't been seen through in meditation, both positions remain caught in the same default view. Intellectual belief alone doesn't cut it."
      },
      {
        heading: "Awareness as Dependent Arising",
        content: "Awareness arises in dependence on conditions — just like everything else. It doesn't exist 'from its own side' as a fixed container. This is radical in the context of many meditation traditions that enshrine awareness as the final ground."
      },
      {
        heading: "Practice as Vast Territory",
        content: "Practice is huge, deep, wide, multifarious. Connection with self, with others, with the earth, with ethics, with art, with service. Emptiness practice is one crucial strand — perhaps the one that goes deepest — but it exists within this wide context."
      }
    ],
    practices: [
      {
        name: "Investigating Awareness",
        instructions: "After establishing the 'vastness of awareness' practice and resting in that spaciousness: begin to turn the investigation on awareness itself. Does it have edges? Does it have a beginning or end? Is it one thing? Can it be located? Does it depend on there being objects to be aware of? What happens to 'awareness' in deep sleep? Can you find it as an independent, self-existing entity? Let the investigation dissolve the subtle reification."
      }
    ],
    keyTerms: [
      { term: "No Mind (Wu Xin)", def: "A Zen/Chan concept pointing to the absence of a fixed, inherent mind — mind as empty" },
      { term: "Reification", def: "The process of treating an abstraction (like 'awareness') as if it were a concrete, independently existing thing" }
    ]
  },
  {
    id: "dependent-origination",
    num: 17,
    title: "The Subtlety of Dependent Origination",
    subtitle: "Time, Awareness, and the Links",
    category: "theory",
    color: "#3D348B",
    overview: `Dependent origination can be investigated at many levels — from everyday psychology to the most subtle structures of perception. Rob takes it deeper: investigating how time, awareness, and the first links of the twelve-fold chain are themselves dependently arising.\n\nA key insight: time itself is not an independent container for events. Time is fabricated — its apparent solidity depends on clinging. When clinging reduces, time becomes less prominent, less substantial, less 'in your face.'`,
    teachings: [
      {
        heading: "Time as Dependent Arising",
        content: "When there's strong clinging — wanting something, dreading something, being bored — time becomes very prominent and heavy. When clinging relaxes (in samādhi, in open awareness, in letting go), time becomes less substantial, less solid. Time's apparent independent existence is itself a fabrication dependent on mental activity."
      },
      {
        heading: "The First Links",
        content: "Ignorance (avijjā) → formations (saṅkhāra) → consciousness (viññāṇa) → name-and-form (nāma-rūpa). These first links of the twelve-fold chain describe how the entire perceptual world is constructed from fundamental misperception (taking things as inherently existing). Each link conditions the next."
      },
      {
        heading: "Levels of Investigation",
        content: "Everyday level: how habitual patterns shape our perception and identity. Deeper: how the push-pull of clinging fabricates time and substantiality. Deepest: how the fundamental assumption of inherent existence constructs the entire field of experience."
      },
      {
        heading: "Fearlessness and Love",
        content: "Our capacity for love depends on fearlessness. Fearlessness depends on seeing emptiness. The deeper the seeing, the less there is to fear, the more we can extend love and service."
      }
    ],
    practices: [
      {
        name: "Investigating Time",
        instructions: "In meditation, when a strong wanting or aversion arises: notice the sense of time. Is time very 'present,' heavy, prominent? Now, apply any of the emptiness practices — letting go, anattā, relaxing push-pull. As the clinging softens: what happens to the sense of time? Does it become less prominent? Less solid? In deep samādhi, is there even a sense of time? Let this be direct investigation, not intellectual analysis."
      }
    ],
    keyTerms: [
      { term: "Avijjā", def: "Ignorance — not just 'not knowing' but the fundamental misperception that things inherently exist" },
      { term: "Nāma-rūpa", def: "Name-and-form — the constructed duality of mental and physical experience" },
      { term: "Kāla", def: "Time — here seen as itself a dependent arising, not an independent container" }
    ]
  },
  {
    id: "cessation",
    num: 18,
    title: "Dependent Cessation and the Unconditioned",
    subtitle: "Where Practice Leads",
    category: "practice",
    color: "#1B4965",
    overview: `Emptiness practices are tools — fundamentally, they are tools in the service of freedom. As the fabrication processes are seen and released, phenomena fade. When fabrication ceases, what remains is the Unconditioned — that which is not fabricated, not constructed, not dependent on conditions.\n\nRob circles back to the deepest importance of relational practice, being with experience, connection with self and others, connection with the earth. Emptiness practice exists within this wider landscape. And the development toward cessation is profoundly non-linear — expect waves.`,
    teachings: [
      {
        heading: "Dependent Cessation",
        content: "The twelve links work in reverse: when ignorance ceases, formations cease; when formations cease, consciousness ceases; and so on. This is dependent cessation — the unwinding of the fabrication chain. It happens in degrees, not all at once."
      },
      {
        heading: "The Unconditioned",
        content: "The Buddha uses many terms for this: the unconditioned, the unborn, the unfabricated, the deathless. It is not a thing, a place, or a state — it's what is left when fabrication stops. It can be 'tasted' in degrees even before full cessation."
      },
      {
        heading: "Being With Experience",
        content: "Rob emphasizes: a huge part of practice is simply learning to be with experience — especially the difficult, the avoided, the hidden parts of ourselves. This intimacy with experience is not separate from emptiness practice; it's foundational to it."
      },
      {
        heading: "Non-Linear Path",
        content: "The deepening process is a sine wave, not a straight line. Openings and troughs alternate. The troughs feel worse in contrast to the openings. This is not going backwards — it's the natural rhythm of deep practice."
      }
    ],
    practices: [
      {
        name: "Dependent Cessation Contemplation",
        instructions: "After sustained emptiness practice, notice what has faded or ceased: Has the sense of self quieted? Has the sense of time softened? Have the hard edges of objects become less defined? Rather than trying to push toward cessation, simply notice what has naturally reduced as the fabrication processes have been seen. Each reduction is a taste of the unconditioned. Rest in whatever degree of stillness and space is present."
      }
    ],
    keyTerms: [
      { term: "Asaṅkhata", def: "The Unconditioned — that which is not fabricated by conditions" },
      { term: "Amata", def: "The Deathless — another term for nibbāna / the Unconditioned" },
      { term: "Nirodha-sacca", def: "The truth of cessation — the third Noble Truth" }
    ]
  },
  {
    id: "union",
    num: 19,
    title: "The Union of Appearance and Emptiness",
    subtitle: "Integration",
    category: "theory",
    color: "#264653",
    overview: `The final talk ties together the threads through a vivid example: Eggs Benedict. The apparently solid, desirable thing is actually constructed through thinking, memory, association, loneliness, deprivation, desire, and visual appearance. Its 'substantiality' is fabricated.\n\nThe bell curve of perception applies: with increasing mindfulness, experience first becomes more vivid and differentiated. With even deeper practice (strong mindfulness + equanimity + disidentification), this vividness begins to fade as the fabrication is seen through.\n\nPost-meditation, the world of appearances returns — but now 'like an illusion.' The practitioner can play with the spectrum: emphasize emptiness and perceptions fade; relax the emphasis and appearances return. This play between appearance and emptiness is the union.`,
    teachings: [
      {
        heading: "How Things Are Built",
        content: "Through thinking, repeated thinking, obsessing, memory, association, loneliness, deprivation, desire, visual appearance — all of these contribute to constructing the substantiality of any object. Seeing this construction process is seeing emptiness."
      },
      {
        heading: "The Bell Curve of Perception",
        content: "Stage 1: Ordinary, somewhat dull perception. Stage 2: With more mindfulness — things become vivid, differentiated, alive. Stage 3: With even deeper practice (mindfulness + equanimity + disidentification) — the heightened vividness begins to fade, dissolve. This is not regression but deepening."
      },
      {
        heading: "Like an Illusion",
        content: "After deep meditation, the world of appearances looks 'like an illusion' — not unreal, but clearly not what it seemed. The solidity is recognized as a construction. Appearances continue but are held more lightly, more playfully."
      },
      {
        heading: "Playing with the Spectrum",
        content: "An advanced capacity: emphasizing emptiness causes perceptions to fade; releasing the emphasis allows appearances to return. The practitioner develops facility with this spectrum — moving between full appearance and deep emptiness, and every point between."
      }
    ],
    practices: [
      {
        name: "Union Practice",
        instructions: "In deep meditation: sustain emptiness practice until perceptions begin to soften or fade. Then, deliberately relax the emptiness emphasis. Let appearances return. Notice: they now have a different quality — lighter, more transparent, 'like an illusion.' Play with this spectrum: more emptiness emphasis → fading; less emphasis → appearances return. Neither the fading nor the appearing is 'more true.' Both are dependent arisings. Rest in the play between them."
      }
    ],
    keyTerms: [
      { term: "Māyā", def: "Illusion — appearances seen as empty, dream-like, not independently real" },
      { term: "Yuganaddha", def: "Union / pairing — the integration of seeming opposites (appearance and emptiness, samādhi and insight)" },
      { term: "Pratītya-samutpāda", def: "Dependent co-arising — the positive statement that things arise in dependence; the flip side of emptiness" }
    ]
  }
];

const CATEGORIES = {
  foundation: { label: "Foundation", color: "#c9a84c" },
  theory: { label: "Teaching", color: "#7B9EA8" },
  practice: { label: "Practice", color: "#2D6A4F" },
  guided: { label: "Guided", color: "#E76F51" },
};

// ─── DIAGRAMS ────────────────────────────────────────────────────────────────

function ProgressionDiagram({ compact }) {
  const stages = [
    { label: "Samādhi", sub: "Foundation", color: "#2D6A4F" },
    { label: "Three Chars.", sub: "Ways of Looking", color: "#457B9D" },
    { label: "Self-Emptiness", sub: "Anattā + 7-Fold", color: "#6B4C8A" },
    { label: "Phenomena", sub: "All Dharmas", color: "#264653" },
    { label: "Non-Duality", sub: "Fading", color: "#1B4965" },
    { label: "Cessation", sub: "Unconditioned", color: "#3D348B" },
  ];

  if (compact) {
    // Vertical layout for mobile
    return (
      <svg viewBox="0 0 300 380" style={{ width: "100%", maxWidth: 300, display: "block", margin: "16px auto" }}>
        <defs>
          <marker id="arrowDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#7a7a85" />
          </marker>
        </defs>
        <text x={150} y={16} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" letterSpacing={1}>PRACTICE PROGRESSION MAP</text>
        {/* Samādhi thread */}
        <line x1={18} y1={32} x2={18} y2={330} stroke="#2D6A4F" strokeWidth={1} strokeDasharray="4 3" />
        <text x={22} y={182} fill="#2D6A4F" fontSize={8} fontFamily="'IBM Plex Mono', monospace" transform="rotate(-90, 22, 182)">Samādhi 50/50</text>
        {stages.map((s, i) => {
          const y = 32 + i * 50;
          return (
            <g key={i}>
              <rect x={46} y={y} width={240} height={38} rx={4} fill={s.color + "30"} stroke={s.color} strokeWidth={1.5} />
              <text x={60} y={y + 16} fill="#e8e6e3" fontSize={12} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{s.label}</text>
              <text x={60} y={y + 30} fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">{s.sub}</text>
              {i < stages.length - 1 && (
                <line x1={166} y1={y + 40} x2={166} y2={y + 48} stroke="#7a7a85" strokeWidth={1} markerEnd="url(#arrowDown)" />
              )}
            </g>
          );
        })}
        {/* Love thread */}
        <line x1={46} y1={342} x2={286} y2={342} stroke="#c9a84c" strokeWidth={1} strokeDasharray="4 3" />
        <text x={166} y={358} textAnchor="middle" fill="#c9a84c" fontSize={9} fontFamily="'IBM Plex Mono', monospace">Mettā / Love — continuous thread</text>
        <text x={166} y={374} textAnchor="middle" fill="#7a7a8566" fontSize={8} fontFamily="'IBM Plex Mono', monospace">(non-linear — expect waves)</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 680 200" style={{ width: "100%", maxWidth: 680, display: "block", margin: "16px auto" }}>
      <defs>
        <marker id="arrowR" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7a7a85" />
        </marker>
      </defs>
      {stages.map((s, i) => {
        const x = 14 + i * 112;
        return (
          <g key={i}>
            <rect x={x} y={40} width={100} height={56} rx={4} fill={s.color + "30"} stroke={s.color} strokeWidth={1.5} />
            <text x={x + 50} y={61} textAnchor="middle" fill="#e8e6e3" fontSize={11} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{s.label}</text>
            <text x={x + 50} y={78} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">{s.sub}</text>
            {i < stages.length - 1 && (
              <line x1={x + 102} y1={68} x2={x + 112} y2={68} stroke="#7a7a85" strokeWidth={1} markerEnd="url(#arrowR)" />
            )}
          </g>
        );
      })}
      <line x1={64} y1={115} x2={616} y2={115} stroke="#c9a84c" strokeWidth={1} strokeDasharray="4 3" />
      <text x={340} y={132} textAnchor="middle" fill="#c9a84c" fontSize={10} fontFamily="'IBM Plex Mono', monospace" fontWeight={400}>Mettā / Love / Wise Relationship — continuous thread</text>
      <line x1={64} y1={28} x2={616} y2={28} stroke="#2D6A4F" strokeWidth={1} strokeDasharray="4 3" />
      <text x={340} y={22} textAnchor="middle" fill="#2D6A4F" fontSize={10} fontFamily="'IBM Plex Mono', monospace" fontWeight={400}>Samādhi 50/50 — maintained throughout</text>
      <text x={340} y={172} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fontWeight={400} letterSpacing={1}>PRACTICE PROGRESSION MAP</text>
      <text x={340} y={188} textAnchor="middle" fill="#7a7a8566" fontSize={8} fontFamily="'IBM Plex Mono', monospace">(non-linear — expect waves, not straight lines)</text>
    </svg>
  );
}

function FabricationDiagram({ compact }) {
  const leftItems = [
    { label: "Avijjā (Ignorance)", sub: "Assuming inherent existence" },
    { label: "Saṅkhāra (Fabrication)", sub: "Clinging, aversion, identification" },
    { label: "Viññāṇa (Consciousness)", sub: "Subject-object duality arises" },
    { label: "Nāma-rūpa (Name & Form)", sub: "Solid world of separate things" },
    { label: "Dukkha (Suffering)", sub: "Locked in apparent solidity" },
  ];
  const rightItems = [
    { label: "Seeing Emptiness", sub: "Investigating inherent existence" },
    { label: "Fabrication Reduces", sub: "Clinging relaxes, self quiets" },
    { label: "Perception Fades", sub: "Edges soften, boundaries dissolve" },
    { label: "World 'Like an Illusion'", sub: "Appearances recognized as empty" },
    { label: "Freedom / Nibbāna", sub: "The Unconditioned" },
  ];

  if (compact) {
    return (
      <svg viewBox="0 0 300 530" style={{ width: "100%", maxWidth: 300, display: "block", margin: "16px auto" }}>
        <defs>
          <marker id="arrowDc" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#7a7a85" />
          </marker>
        </defs>
        <text x={150} y={16} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" letterSpacing={1}>FABRICATION → FREEDOM</text>
        {/* Fabrication side */}
        <text x={14} y={38} fill="#9B2226" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fontWeight={500}>FABRICATION</text>
        {leftItems.map((item, i) => (
          <g key={`l${i}`}>
            <rect x={14} y={46 + i * 44} width={272} height={34} rx={3} fill="#9B222610" stroke="#9B2226" strokeWidth={0.8} />
            <text x={24} y={60 + i * 44} fill="#e8e6e3" fontSize={11} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{item.label}</text>
            <text x={24} y={73 + i * 44} fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">{item.sub}</text>
            {i < 4 && <line x1={150} y1={82 + i * 44} x2={150} y2={88 + i * 44} stroke="#7a7a85" strokeWidth={0.8} markerEnd="url(#arrowDc)" />}
          </g>
        ))}
        {/* Transition arrow */}
        <line x1={150} y1={272} x2={150} y2={290} stroke="#c9a84c" strokeWidth={2} markerEnd="url(#arrowDc)" />
        <text x={168} y={285} fill="#c9a84c" fontSize={9} fontFamily="'IBM Plex Mono', monospace">seeing</text>
        {/* Cessation side */}
        <text x={14} y={308} fill="#2D6A4F" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fontWeight={500}>FREEDOM</text>
        {rightItems.map((item, i) => (
          <g key={`r${i}`}>
            <rect x={14} y={314 + i * 44} width={272} height={34} rx={3} fill="#2D6A4F15" stroke="#2D6A4F" strokeWidth={0.8} />
            <text x={24} y={328 + i * 44} fill="#e8e6e3" fontSize={11} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{item.label}</text>
            <text x={24} y={341 + i * 44} fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">{item.sub}</text>
            {i < 4 && <line x1={150} y1={350 + i * 44} x2={150} y2={356 + i * 44} stroke="#7a7a85" strokeWidth={0.8} markerEnd="url(#arrowDc)" />}
          </g>
        ))}
        <text x={150} y={524} textAnchor="middle" fill="#7a7a8566" fontSize={8} fontFamily="'IBM Plex Mono', monospace">Dependent Origination ↔ Dependent Cessation</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 520, display: "block", margin: "16px auto" }}>
      <defs>
        <marker id="arrowD" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#7a7a85" />
        </marker>
      </defs>
      <text x={260} y={18} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" letterSpacing={1}>FABRICATION → FREEDOM</text>
      {leftItems.map((item, i) => (
        <g key={`l${i}`}>
          <rect x={20} y={40 + i * 40} width={200} height={32} rx={3} fill="#9B222610" stroke="#9B2226" strokeWidth={0.8} />
          <text x={30} y={54 + i * 40} fill="#e8e6e3" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{item.label}</text>
          <text x={30} y={66 + i * 40} fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">{item.sub}</text>
          {i < 4 && <line x1={120} y1={74 + i * 40} x2={120} y2={78 + i * 40} stroke="#7a7a85" strokeWidth={0.8} markerEnd="url(#arrowD)" />}
        </g>
      ))}
      <line x1={240} y1={130} x2={290} y2={130} stroke="#c9a84c" strokeWidth={1.5} markerEnd="url(#arrowD)" />
      <text x={265} y={122} textAnchor="middle" fill="#c9a84c" fontSize={8} fontFamily="'IBM Plex Mono', monospace">seeing</text>
      {rightItems.map((item, i) => (
        <g key={`r${i}`}>
          <rect x={300} y={40 + i * 40} width={200} height={32} rx={3} fill="#2D6A4F15" stroke="#2D6A4F" strokeWidth={0.8} />
          <text x={310} y={54 + i * 40} fill="#e8e6e3" fontSize={10} fontFamily="'IBM Plex Sans', sans-serif" fontWeight={500}>{item.label}</text>
          <text x={310} y={66 + i * 40} fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">{item.sub}</text>
          {i < 4 && <line x1={400} y1={74 + i * 40} x2={400} y2={78 + i * 40} stroke="#7a7a85" strokeWidth={0.8} markerEnd="url(#arrowD)" />}
        </g>
      ))}
      <text x={260} y={260} textAnchor="middle" fill="#7a7a8566" fontSize={8} fontFamily="'IBM Plex Mono', monospace">Dependent Origination ↔ Dependent Cessation</text>
    </svg>
  );
}

function BellCurveDiagram({ compact }) {
  if (compact) {
    return (
      <svg viewBox="0 0 320 180" style={{ width: "100%", maxWidth: 320, display: "block", margin: "16px auto" }}>
        <text x={160} y={14} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" letterSpacing={1}>BELL CURVE OF PERCEPTION</text>
        <line x1={40} y1={140} x2={300} y2={140} stroke="#2a2a33" strokeWidth={1} />
        <line x1={40} y1={26} x2={40} y2={140} stroke="#2a2a33" strokeWidth={1} />
        <path d="M 48,136 Q 85,130 120,88 Q 150,40 170,38 Q 190,40 220,80 Q 265,130 295,136" fill="none" stroke="#7B9EA8" strokeWidth={2} />
        <text x={72} y={158} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">ordinary</text>
        <text x={170} y={158} textAnchor="middle" fill="#c9a84c" fontSize={9} fontFamily="'IBM Plex Mono', monospace">vivid</text>
        <text x={272} y={158} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace">fading</text>
        <text x={106} y={72} fill="#457B9D" fontSize={9} fontFamily="'IBM Plex Mono', monospace">+mindfulness</text>
        <text x={218} y={64} fill="#457B9D" fontSize={9} fontFamily="'IBM Plex Mono', monospace">+equanimity</text>
        <text x={14} y={82} fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace" transform="rotate(-90, 14, 82)">solidity</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 480 200" style={{ width: "100%", maxWidth: 480, display: "block", margin: "16px auto" }}>
      <text x={240} y={16} textAnchor="middle" fill="#7a7a85" fontSize={9} fontFamily="'IBM Plex Mono', monospace" letterSpacing={1}>THE BELL CURVE OF PERCEPTION</text>
      <line x1={60} y1={160} x2={440} y2={160} stroke="#2a2a33" strokeWidth={1} />
      <line x1={60} y1={30} x2={60} y2={160} stroke="#2a2a33" strokeWidth={1} />
      <path d="M 70,155 Q 120,150 170,100 Q 220,45 260,42 Q 300,45 340,90 Q 400,148 430,155" fill="none" stroke="#7B9EA8" strokeWidth={2} />
      <text x={100} y={178} textAnchor="middle" fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">ordinary</text>
      <text x={100} y={188} textAnchor="middle" fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">perception</text>
      <text x={260} y={178} textAnchor="middle" fill="#c9a84c" fontSize={8} fontFamily="'IBM Plex Mono', monospace">heightened</text>
      <text x={260} y={188} textAnchor="middle" fill="#c9a84c" fontSize={8} fontFamily="'IBM Plex Mono', monospace">vividness</text>
      <text x={410} y={178} textAnchor="middle" fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">fading /</text>
      <text x={410} y={188} textAnchor="middle" fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace">cessation</text>
      <text x={18} y={95} textAnchor="middle" fill="#7a7a85" fontSize={8} fontFamily="'IBM Plex Mono', monospace" transform="rotate(-90, 18, 95)">perceived solidity</text>
      <text x={155} y={82} fill="#457B9D" fontSize={8} fontFamily="'IBM Plex Mono', monospace">+ mindfulness</text>
      <text x={340} y={75} fill="#457B9D" fontSize={8} fontFamily="'IBM Plex Mono', monospace">+ equanimity</text>
      <text x={340} y={86} fill="#457B9D" fontSize={8} fontFamily="'IBM Plex Mono', monospace">+ disidentification</text>
    </svg>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const FONT_LINK = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500&display=swap";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function EmptinessGuide() {
  const [activeId, setActiveId] = useState("opening");
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);
  const isNarrow = useMediaQuery("(max-width: 800px)");
  const isLight = useMediaQuery("(prefers-color-scheme: light)");

  const talk = TALKS.find((t) => t.id === activeId);
  const talkIdx = TALKS.findIndex((t) => t.id === activeId);

  const navigate = useCallback((dir) => {
    const next = talkIdx + dir;
    if (next >= 0 && next < TALKS.length) {
      setActiveId(TALKS[next].id);
      setTab("overview");
      if (mainRef.current) mainRef.current.scrollTop = 0;
    }
  }, [talkIdx]);

  // Touch swipe for mobile navigation
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and > 80px
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0 && talkIdx > 0) navigate(-1);
      if (dx < 0 && talkIdx < TALKS.length - 1) navigate(1);
    }
  }, [talkIdx, navigate]);

  useEffect(() => {
    if (isNarrow) setSidebarOpen(false);
  }, [activeId, isNarrow]);

  // Color scheme
  const bg0 = isLight ? "#f5f3ef" : "#0a0a0c";
  const bg1 = isLight ? "#eae7e1" : "#141418";
  const bg2 = isLight ? "#ddd9d1" : "#1c1c22";
  const textPrimary = isLight ? "#1a1a1e" : "#e8e6e3";
  const textMuted = isLight ? "#5a5a64" : "#7a7a85";
  const border = isLight ? "#c8c4bb" : "#2a2a33";
  const accent = talk?.color || "#c9a84c";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "teachings", label: "Teachings" },
    { key: "practice", label: "Practice" },
    { key: "terms", label: "Key Terms" },
  ];

  // Diagram insertion logic
  const showProgression = activeId === "maps" || activeId === "opening";
  const showFabrication = activeId === "intro-emptiness" || activeId === "nonduality" || activeId === "cessation" || activeId === "union";
  const showBellCurve = activeId === "union" || activeId === "nonduality" || activeId === "no-thing";

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
        ::selection { background: ${accent}33; }
        div[style*="overflowX"]::-webkit-scrollbar { display: none; }
        @supports(padding: max(0px)) {
          .safe-bottom { padding-bottom: max(60px, env(safe-area-inset-bottom, 0px)) !important; }
        }
        @media (max-width: 800px) {
          html { -webkit-text-size-adjust: 100%; }
        }
      `}</style>
      <div style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: bg0,
        color: textPrimary,
        fontSize: 14,
        lineHeight: 1.7,
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Mobile overlay */}
        {isNarrow && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "#00000066", zIndex: 90 }}
          />
        )}

        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <aside style={{
          width: isNarrow ? 280 : 264,
          minWidth: isNarrow ? 280 : 264,
          background: bg1,
          borderRight: `1px solid ${border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          ...(isNarrow ? {
            position: "fixed",
            top: 0,
            left: sidebarOpen ? 0 : -290,
            bottom: 0,
            zIndex: 100,
            transition: "left 0.2s ease",
            boxShadow: sidebarOpen ? "4px 0 24px #0004" : "none",
          } : {}),
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: "20px 18px 14px",
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: textMuted,
              marginBottom: 6,
            }}>Rob Burbea — 2010 Retreat</div>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.3,
              color: textPrimary,
            }}>Meditation on Emptiness</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: textMuted,
              marginTop: 4,
            }}>19 talks · 4-week intensive</div>
          </div>
          {/* Sidebar items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {TALKS.map((t) => {
              const isActive = t.id === activeId;
              const cat = CATEGORIES[t.category];
              return (
                <button
                  key={t.id}
                  onClick={() => { setActiveId(t.id); setTab("overview"); }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    width: "100%",
                    padding: isNarrow ? "12px 16px 12px 14px" : "8px 16px 8px 14px",
                    border: "none",
                    background: isActive ? (isLight ? "#ddd9d140" : "#1c1c2240") : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    borderLeft: `3px solid ${isActive ? accent : "transparent"}`,
                    transition: "all 0.15s ease",
                    minHeight: isNarrow ? 52 : "auto",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = isLight ? "#ddd9d120" : "#1c1c2220"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: isActive ? accent : textMuted,
                    minWidth: 18,
                    paddingTop: 2,
                    fontWeight: 500,
                  }}>{String(t.num).padStart(2, "0")}</span>
                  <span>
                    <span style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? textPrimary : (isLight ? "#3a3a3e" : "#b0aeb0"),
                      lineHeight: 1.35,
                    }}>{t.title}</span>
                    <span style={{
                      display: "block",
                      fontSize: 9,
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: textMuted,
                      marginTop: 1,
                    }}>{t.subtitle}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN ───────────────────────────────────────────── */}
        <main
          ref={mainRef}
          onTouchStart={isNarrow ? handleTouchStart : undefined}
          onTouchEnd={isNarrow ? handleTouchEnd : undefined}
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            WebkitOverflowScrolling: "touch",
          }}>
          {/* Sticky header */}
          <header style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: bg0,
            borderBottom: `1px solid ${border}`,
            padding: isNarrow ? "8px 12px" : "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: isNarrow ? 8 : 12,
            flexShrink: 0,
            minHeight: isNarrow ? 48 : "auto",
          }}>
            {isNarrow && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "none",
                  border: `1px solid ${border}`,
                  borderRadius: 4,
                  padding: "6px 10px",
                  cursor: "pointer",
                  color: textMuted,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  minHeight: 36,
                  flexShrink: 0,
                }}
              >{sidebarOpen ? "CLOSE" : "MENU"}</button>
            )}
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: accent,
              fontWeight: 500,
              flexShrink: 0,
            }}>{String(talk.num).padStart(2, "0")}</span>
            <span style={{
              fontSize: isNarrow ? 13 : 15,
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>{talk.title}</span>
            {!isNarrow && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: CATEGORIES[talk.category].color,
                background: CATEGORIES[talk.category].color + "15",
                padding: "3px 8px",
                borderRadius: 3,
                flexShrink: 0,
              }}>{CATEGORIES[talk.category].label}</span>
            )}
          </header>

          {/* Tab bar */}
          <div style={{
            display: "flex",
            gap: 0,
            padding: isNarrow ? "0 12px" : "0 32px",
            borderBottom: `1px solid ${border}`,
            background: bg0,
            flexShrink: 0,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: isNarrow ? "12px 14px" : "10px 16px",
                  border: "none",
                  background: tab === t.key ? accent + "18" : "transparent",
                  color: tab === t.key ? accent : textMuted,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: isNarrow ? 10 : 11,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  cursor: "pointer",
                  borderBottom: tab === t.key ? `2px solid ${accent}` : "2px solid transparent",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  minHeight: 44,
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Content area */}
          <div className="safe-bottom" style={{
            flex: 1,
            padding: isNarrow ? "16px 12px 60px" : "28px 32px 60px",
            maxWidth: 780,
          }}>
            {/* Mobile swipe hint - shown briefly */}
            {isNarrow && talkIdx === 0 && tab === "overview" && (
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                color: textMuted,
                textAlign: "center",
                marginBottom: 12,
                opacity: 0.6,
              }}>swipe left/right to navigate between talks</div>
            )}

            {/* ── OVERVIEW TAB ──────────────────── */}
            {tab === "overview" && (
              <div>
                <h2 style={{ fontSize: isNarrow ? 18 : 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{talk.title}</h2>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: textMuted,
                  marginBottom: 20,
                }}>{talk.subtitle}</div>

                {/* Meta grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isNarrow ? "1fr 1fr" : "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: isNarrow ? 8 : 10,
                  marginBottom: 24,
                }}>
                  <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 4 }}>Talk</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500 }}>{talk.num} of 19</div>
                  </div>
                  <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 4 }}>Category</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: CATEGORIES[talk.category].color }}>{CATEGORIES[talk.category].label}</div>
                  </div>
                  <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 4 }}>Teachings</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500 }}>{talk.teachings.length}</div>
                  </div>
                  <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 4 }}>Practices</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500 }}>{talk.practices.length}</div>
                  </div>
                </div>

                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{talk.overview}</div>

                {/* Contextual diagrams */}
                {showProgression && (
                  <div style={{ marginTop: 28 }}>
                    <ProgressionDiagram compact={isNarrow} />
                  </div>
                )}
                {showFabrication && (
                  <div style={{ marginTop: 28 }}>
                    <FabricationDiagram compact={isNarrow} />
                  </div>
                )}
                {showBellCurve && (
                  <div style={{ marginTop: 28 }}>
                    <BellCurveDiagram compact={isNarrow} />
                  </div>
                )}

                {/* Quick preview of key teachings */}
                <div style={{ marginTop: 28 }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: textMuted,
                    marginBottom: 12,
                  }}>Key Points</div>
                  {talk.teachings.map((t, i) => (
                    <div key={i} style={{
                      padding: "10px 14px",
                      borderLeft: `2px solid ${accent}40`,
                      marginBottom: 8,
                      background: bg1,
                      borderRadius: "0 4px 4px 0",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{t.heading}</div>
                      <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.5 }}>{t.content.slice(0, 120)}...</div>
                    </div>
                  ))}
                  <button
                    onClick={() => setTab("teachings")}
                    style={{
                      marginTop: 8,
                      background: "none",
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      padding: "6px 14px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: accent,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = accent + "12"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                  >Read full teachings →</button>
                </div>
              </div>
            )}

            {/* ── TEACHINGS TAB ──────────────────── */}
            {tab === "teachings" && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Teachings</h2>
                {talk.teachings.map((t, i) => (
                  <div key={i} style={{
                    marginBottom: isNarrow ? 16 : 24,
                    padding: isNarrow ? "14px 12px" : "18px 20px",
                    background: bg1,
                    border: `1px solid ${border}`,
                    borderRadius: 6,
                    borderLeft: `3px solid ${accent}`,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9,
                        color: accent,
                        fontWeight: 500,
                        background: accent + "15",
                        padding: "2px 6px",
                        borderRadius: 3,
                      }}>{String(i + 1).padStart(2, "0")}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{t.heading}</h3>
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.75, fontSize: 14 }}>{t.content}</div>
                  </div>
                ))}

                {/* Diagrams in teachings tab too */}
                {showFabrication && <FabricationDiagram compact={isNarrow} />}
                {showBellCurve && <BellCurveDiagram compact={isNarrow} />}
                {showProgression && <ProgressionDiagram compact={isNarrow} />}
              </div>
            )}

            {/* ── PRACTICE TAB ──────────────────── */}
            {tab === "practice" && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Practice Instructions</h2>
                <div style={{
                  fontSize: 12,
                  color: textMuted,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}>Concrete meditation and off-cushion instructions drawn from this talk. Follow the instructions carefully — precision matters in this practice.</div>
                {talk.practices.map((p, i) => (
                  <div key={i} style={{
                    marginBottom: isNarrow ? 16 : 24,
                    padding: isNarrow ? "14px 12px" : "20px 22px",
                    background: bg1,
                    border: `1px solid ${border}`,
                    borderRadius: 6,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: isNarrow ? 10 : 14,
                    }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9,
                        color: "#2D6A4F",
                        fontWeight: 500,
                        background: "#2D6A4F18",
                        padding: "2px 8px",
                        borderRadius: 3,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}>Practice</span>
                      <h3 style={{ fontSize: isNarrow ? 14 : 15, fontWeight: 600 }}>{p.name}</h3>
                    </div>
                    <div style={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.8,
                      fontSize: isNarrow ? 13 : 14,
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      background: bg2,
                      padding: isNarrow ? "12px" : "16px 18px",
                      borderRadius: 4,
                      border: `1px solid ${border}`,
                    }}>{p.instructions}</div>
                  </div>
                ))}

                {/* Limitation box */}
                <div style={{
                  marginTop: 12,
                  padding: "14px 16px",
                  background: isLight ? "#9B222608" : "#9B222610",
                  border: `1px solid ${isLight ? "#9B222630" : "#9B222640"}`,
                  borderRadius: 4,
                  fontSize: 12,
                  color: textMuted,
                  lineHeight: 1.6,
                }}>
                  <span style={{ fontWeight: 600, color: "#9B2226", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Note</span>
                  <div style={{ marginTop: 6 }}>These practices are drawn from a retreat for experienced meditators. If you're new to meditation, establish a foundation in basic mindfulness and samādhi first. Work with a qualified teacher if possible — these practices can bring up intense material.</div>
                </div>
              </div>
            )}

            {/* ── KEY TERMS TAB ──────────────────── */}
            {tab === "terms" && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Key Terms</h2>
                <div style={{
                  fontSize: 12,
                  color: textMuted,
                  marginBottom: 24,
                }}>Pāli, Sanskrit, and technical terms used in this talk.</div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  {talk.keyTerms.map((t, i) => (
                    <div key={i} style={{
                      display: "flex",
                      flexDirection: isNarrow ? "column" : "row",
                      gap: isNarrow ? 4 : 16,
                      padding: isNarrow ? "10px 12px" : "12px 16px",
                      background: bg1,
                      border: `1px solid ${border}`,
                      borderRadius: 4,
                      alignItems: isNarrow ? "flex-start" : "flex-start",
                    }}>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13,
                        fontWeight: 500,
                        color: accent,
                        minWidth: isNarrow ? "auto" : 160,
                        flexShrink: 0,
                      }}>{t.term}</div>
                      <div style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: textMuted,
                      }}>{t.def}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NAVIGATION ──────────────────────── */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 40,
              paddingTop: 20,
              borderTop: `1px solid ${border}`,
              gap: 12,
            }}>
              <button
                onClick={() => navigate(-1)}
                disabled={talkIdx === 0}
                style={{
                  background: "none",
                  border: `1px solid ${talkIdx === 0 ? border + "40" : border}`,
                  borderRadius: 4,
                  padding: isNarrow ? "10px 14px" : "8px 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: talkIdx === 0 ? textMuted + "40" : textMuted,
                  cursor: talkIdx === 0 ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  minHeight: 44,
                }}
                onMouseEnter={(e) => { if (talkIdx > 0) e.currentTarget.style.borderColor = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = talkIdx === 0 ? border + "40" : border; }}
              >← Prev</button>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: textMuted,
              }}>{talk.num} / {TALKS.length}</span>
              <button
                onClick={() => navigate(1)}
                disabled={talkIdx === TALKS.length - 1}
                style={{
                  background: "none",
                  border: `1px solid ${talkIdx === TALKS.length - 1 ? border + "40" : border}`,
                  borderRadius: 4,
                  padding: isNarrow ? "10px 14px" : "8px 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  color: talkIdx === TALKS.length - 1 ? textMuted + "40" : textMuted,
                  cursor: talkIdx === TALKS.length - 1 ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  minHeight: 44,
                }}
                onMouseEnter={(e) => { if (talkIdx < TALKS.length - 1) e.currentTarget.style.borderColor = accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = talkIdx === TALKS.length - 1 ? border + "40" : border; }}
              >Next →</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
