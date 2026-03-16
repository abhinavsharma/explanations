import { ArtifactStatus } from '@/components/artifact-wrapper';

export const artifactStatus = ArtifactStatus.UNLISTED;
export const publishDate = "2026-03-16";

import { useState, useRef, useEffect } from "react";

const MODELS = [
  {
    id: "bigram",
    name: "Bigram Model",
    year: "~1948",
    who: "Shannon",
    tagline: "What's the next character, given only the current one?",
    params: "~700",
    perplexity: "~11.5",
    contextWindow: "1 token",
    color: "#8B6914",
    icon: "🎲",
    intuition: `The absolute simplest language model. You build a lookup table: for every token (or character), what's the probability distribution over the next token? That's it. No memory, no context, no parameters beyond that table.\n\nShannon literally did this by hand in 1948 — flipping through books and counting letter frequencies. The model is just P(xₜ | xₜ₋₁).\n\nIt's memoryless in the Markov sense: "the" followed by... could be anything, because we forgot what came before "the".`,
    limitation: `The fatal flaw is obvious: language has long-range dependencies. "The cat that I saw yesterday at the park near my house _____" — the bigram model only sees "house" and has no idea a verb is needed. It can't even learn that "not" 20 tokens ago flips the meaning.`,
    diagram: "bigram",
    code: `# The entire model is a lookup table
import torch
import torch.nn as nn

class BigramLM(nn.Module):
    def __init__(self, vocab_size):
        super().__init__()
        # That's it. One embedding table.
        self.token_emb = nn.Embedding(vocab_size, vocab_size)
    
    def forward(self, idx):  # idx: (B, T)
        # Each token looks up its row → logits for next token
        logits = self.token_emb(idx)  # (B, T, vocab_size)
        return logits`,
  },
  {
    id: "ngram",
    name: "N-gram Model",
    year: "~1980s",
    who: "Jelinek, Mercer (IBM)",
    tagline: "Use the last N-1 tokens, not just one.",
    params: "~V^N (explodes)",
    perplexity: "~8.3 (trigram)",
    contextWindow: "N-1 tokens",
    color: "#6B4C8A",
    icon: "📊",
    intuition: `The natural extension: instead of P(xₜ | xₜ₋₁), model P(xₜ | xₜ₋₁, ..., xₜ₋ₙ₊₁). A trigram model conditions on the last 2 tokens. IBM used these extensively for speech recognition in the 80s.\n\nThe key engineering was smoothing — Kneser-Ney, stupid backoff — because most n-grams are never observed in training data. The sparsity curse is brutal: vocabulary V=50k means a 5-gram has 50k⁵ possible contexts.`,
    limitation: `Two killers: (1) The curse of dimensionality — the table size grows as V^N, so you can't go beyond N≈5 in practice. (2) No generalization — "the cat sat" and "the dog sat" are completely unrelated entries. The model can't transfer knowledge between similar contexts. You need neural nets for that.`,
    diagram: "ngram",
    code: `# Conceptually (actual implementation uses tries + smoothing)
# The "model" is just counting:

counts = defaultdict(Counter)
for trigram in get_trigrams(corpus):
    w1, w2, w3 = trigram
    counts[(w1, w2)][w3] += 1

# Prediction:
def predict(context):  # context = (w1, w2)
    dist = counts[context]
    total = sum(dist.values())
    return {w: c/total for w, c in dist.items()}

# Kneser-Ney smoothing is where all the engineering lives
# — redistributing probability mass to unseen n-grams`,
  },
  {
    id: "nnlm",
    name: "Neural N-gram (Bengio's NNLM)",
    year: "2003",
    who: "Bengio, Ducharme, Vincent, Jauvin",
    tagline: "Learn continuous word representations. Generalize across similar contexts.",
    params: "~1M",
    perplexity: "~7.2",
    contextWindow: "~5 tokens (fixed)",
    color: "#2D6A4F",
    icon: "🧠",
    intuition: `This is the crucial insight that makes everything else possible: represent words as dense vectors (embeddings) in a continuous space, then use a neural network to predict the next word from the concatenation of context embeddings.\n\nThe embedding layer learns that "cat" ≈ "dog" and "Monday" ≈ "Tuesday" — so a sentence seen with "cat" automatically generalizes to "dog". This is the curse-of-dimensionality killer.\n\nArchitecture: Lookup embeddings → Concatenate → Hidden layer (tanh) → Softmax over vocab. Fixed context window, like n-grams, but with parameter sharing through the embedding space.`,
    limitation: `Still a fixed context window — typically 5-10 tokens. The concatenation means parameters grow linearly with context length. And the hidden layer is a bottleneck: all context information must be squeezed through a fixed-size representation. No notion of position beyond concatenation order, and no way to attend to specific parts of the context.`,
    diagram: "nnlm",
    code: `class BengioNNLM(nn.Module):
    def __init__(self, vocab_size, emb_dim, hidden_dim, context_len):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb_dim)
        # Concat context embeddings → hidden → output
        self.hidden = nn.Linear(context_len * emb_dim, hidden_dim)
        self.output = nn.Linear(hidden_dim, vocab_size)
    
    def forward(self, x):  # x: (B, context_len)
        e = self.emb(x)          # (B, ctx, emb_dim)
        e = e.view(e.size(0), -1)  # (B, ctx * emb_dim) ← concat
        h = torch.tanh(self.hidden(e))
        logits = self.output(h)
        return logits`,
  },
  {
    id: "rnn",
    name: "RNN / LSTM Language Model",
    year: "2010–2015",
    who: "Mikolov; Zaremba, Sutskever (LSTM-LM)",
    tagline: "Variable-length context via a recurrent hidden state.",
    params: "~20M",
    perplexity: "~5.8",
    contextWindow: "∞ (theoretically)",
    color: "#1B4965",
    icon: "🔄",
    intuition: `The big unlock: process tokens one at a time, maintaining a hidden state hₜ = f(hₜ₋₁, xₜ) that summarizes everything seen so far. In principle, the context window is infinite.\n\nLSTMs (Hochreiter & Schmidhuber, 1997) added gating: forget gate, input gate, output gate. This lets the network learn what to remember and what to discard — solving the vanishing gradient problem that killed vanilla RNNs for sequences longer than ~20 tokens.\n\nThese dominated NLP from 2013–2017. Zaremba et al. showed that properly regularized LSTMs were shockingly good language models.`,
    limitation: `Three problems: (1) Sequential processing — you can't parallelize across time steps, so training is slow on GPUs. (2) The hidden state is a fixed-size bottleneck — all information about a 1000-token context must fit in, say, a 512-dim vector. (3) In practice, information still decays over long distances despite gating. The "infinite context" is a lie — LSTMs effectively see ~200 tokens.`,
    diagram: "rnn",
    code: `class LSTMLM(nn.Module):
    def __init__(self, vocab_size, emb_dim, hidden_dim, n_layers):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb_dim)
        self.lstm = nn.LSTM(emb_dim, hidden_dim, 
                           n_layers, dropout=0.5, batch_first=True)
        self.output = nn.Linear(hidden_dim, vocab_size)
    
    def forward(self, x, hidden=None):
        e = self.emb(x)                    # (B, T, emb)
        # Sequential! Each timestep depends on the last
        out, hidden = self.lstm(e, hidden)  # (B, T, hidden)
        logits = self.output(out)
        return logits, hidden
    
    # Training: must process t=0, then t=1, then t=2...
    # Can't parallelize the T dimension. GPU utilization: sad.`,
  },
  {
    id: "rnn-attn",
    name: "RNN + Attention (Seq2Seq)",
    year: "2014–2015",
    who: "Bahdanau, Cho, Bengio",
    tagline: "Don't compress everything into one vector. Look back at all encoder states.",
    params: "~50M",
    perplexity: "—",
    contextWindow: "full source seq",
    color: "#9B2226",
    icon: "🔍",
    intuition: `The attention mechanism was invented to fix seq2seq translation. The problem: the encoder compresses the entire input sentence into one fixed vector, then the decoder must reconstruct from that. Long sentences degrade catastrophically.\n\nBahdanau's insight: at each decoder step, compute a weighted sum over ALL encoder hidden states. The weights (attention scores) are learned — the model figures out which input words are relevant for generating each output word.\n\nαᵢⱼ = softmax(score(sᵢ, hⱼ)) — a compatibility function between decoder state sᵢ and each encoder state hⱼ. The context vector cᵢ = Σⱼ αᵢⱼ hⱼ is a soft, differentiable lookup.\n\nThis was the conceptual precursor to everything in transformers. Attention IS the mechanism.`,
    limitation: `Still sequential — the encoder is an RNN that processes tokens one by one. Attention helps the decoder, but you still can't parallelize the encoder. Also: the attention is between encoder and decoder (cross-attention). We haven't yet realized we can use attention within a single sequence (self-attention) and throw away the RNN entirely.`,
    diagram: "rnn-attn",
    code: `class BahdanauAttention(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.W_q = nn.Linear(hidden_dim, hidden_dim)
        self.W_k = nn.Linear(hidden_dim, hidden_dim)
        self.v = nn.Linear(hidden_dim, 1)
    
    def forward(self, decoder_state, encoder_outputs):
        # decoder_state: (B, 1, H), encoder_outputs: (B, T, H)
        # Additive attention (Bahdanau style)
        scores = self.v(torch.tanh(
            self.W_q(decoder_state) + self.W_k(encoder_outputs)
        ))  # (B, T, 1)
        weights = F.softmax(scores, dim=1)  # (B, T, 1)
        context = (weights * encoder_outputs).sum(dim=1)
        return context, weights
        
    # Key insight: weights are differentiable → end-to-end training
    # The model LEARNS what to attend to`,
  },
  {
    id: "transformer",
    name: "Self-Attention (The Key Insight)",
    year: "2017",
    who: "Vaswani et al. (Google Brain/Research)",
    tagline: '"Attention Is All You Need" — drop the RNN. Self-attention over the sequence itself.',
    params: "~65M",
    perplexity: "~4.2",
    contextWindow: "512–1024 tokens",
    color: "#E76F51",
    icon: "⚡",
    intuition: `The transformer's core insight is almost embarrassingly simple: apply attention from every token to every other token in the same sequence — "self-attention" — and do it in parallel.\n\nFor each token, compute:\n  Q = xW_Q  (what am I looking for?)\n  K = xW_K  (what do I contain?)\n  V = xW_V  (what do I provide if selected?)\n\nAttention(Q,K,V) = softmax(QKᵀ / √dₖ) V\n\nThe √dₖ scaling prevents dot products from growing too large in high dimensions (which would push softmax into saturation, killing gradients).\n\nThis is O(T²) in sequence length, but every token is processed in parallel — GPUs love matrix multiplies. Training speedup over LSTMs: 10–100x.\n\nMulti-head attention: run H separate attention patterns in parallel (different W_Q, W_K, W_V per head). One head might attend to syntactic structure, another to semantic similarity, another to local context. Concat and project.`,
    limitation: `O(T²) memory and compute — quadratic in sequence length. For T=1024, that's ~1M attention entries per layer per head. This is the fundamental bottleneck that spawned a cottage industry of "efficient attention" papers (Linformer, Performer, Flash Attention, etc.).\n\nAlso: self-attention has no inherent notion of order. "The cat sat on the mat" and "mat the on sat cat the" look identical. We need positional encodings (next step).`,
    diagram: "self-attn",
    code: `class SelfAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
    
    def forward(self, x, mask=None):
        B, T, C = x.shape
        
        # Project and reshape to (B, n_heads, T, d_k)
        q = self.W_q(x).view(B, T, self.n_heads, self.d_k).transpose(1,2)
        k = self.W_k(x).view(B, T, self.n_heads, self.d_k).transpose(1,2)
        v = self.W_v(x).view(B, T, self.n_heads, self.d_k).transpose(1,2)
        
        # Scaled dot-product attention — THE core operation
        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        weights = F.softmax(scores, dim=-1)  # (B, H, T, T)
        
        out = (weights @ v)  # (B, H, T, d_k)
        out = out.transpose(1,2).contiguous().view(B, T, C)
        return self.W_o(out)`,
  },
  {
    id: "pos-enc",
    name: "+ Positional Encoding",
    year: "2017",
    who: "Vaswani et al.",
    tagline: "Inject position information — because attention is permutation-invariant.",
    params: "+0 (sinusoidal) or +Td (learned)",
    perplexity: "~3.9",
    contextWindow: "512–2048",
    color: "#264653",
    icon: "📐",
    intuition: `Self-attention treats its input as a set, not a sequence. "Dog bites man" and "Man bites dog" produce identical attention patterns without positional info.\n\nThe original paper used sinusoidal encodings:\n  PE(pos, 2i) = sin(pos / 10000^(2i/d))\n  PE(pos, 2i+1) = cos(pos / 10000^(2i/d))\n\nWhy sines/cosines? Two elegant properties: (1) Each dimension oscillates at a different frequency, creating a unique "fingerprint" for each position. (2) PE(pos+k) can be expressed as a linear function of PE(pos) — so the model can learn relative offsets.\n\nGPT-2 and most modern models use learned positional embeddings instead — just add a learnable vector for each position. Simpler, works as well for fixed-length contexts.\n\nRoPE (Rotary Position Embeddings, Su et al. 2021) is the modern state of the art — encodes relative position by rotating Q and K vectors. Used in LLaMA, GPT-NeoX, etc. Elegant because attention between positions i and j depends only on (i-j).`,
    limitation: `Sinusoidal and learned embeddings have a fixed maximum length. RoPE generalizes better but still degrades beyond training length. The entire "context extension" literature (ALiBi, YaRN, etc.) exists to push past this. Also, position encoding is still somewhat of a hack — we're injecting a 1D signal into a high-dimensional space and hoping the model figures it out.`,
    diagram: "pos-enc",
    code: `class PositionalEncoding(nn.Module):
    """Sinusoidal PE from the original paper"""
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * 
            -(math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))
    
    def forward(self, x):
        return x + self.pe[:, :x.size(1)]  # Just add!

# Modern alternative: RoPE (used in LLaMA, etc.)
# Rotates Q and K by position-dependent angles
# so dot(q_i, k_j) depends only on (i - j)`,
  },
  {
    id: "ffn-residual",
    name: "+ FFN, Residuals, LayerNorm",
    year: "2017",
    who: "Vaswani et al. (with residuals from He et al. 2015)",
    tagline: "The infrastructure that makes deep stacking work.",
    params: "~65M → 125M",
    perplexity: "~3.5",
    contextWindow: "1024",
    color: "#457B9D",
    icon: "🏗️",
    intuition: `Three critical components that aren't glamorous but are load-bearing:\n\n**Feed-Forward Network (FFN):** After attention mixes information across positions, each token passes through a 2-layer MLP independently: FFN(x) = W₂ · GELU(W₁x + b₁) + b₂. The hidden dim is typically 4× the model dim. This is where the model stores "knowledge" — factual associations, patterns. Attention routes information; FFNs process it. Recent interpretability work (Geva et al.) shows FFN layers act as key-value memories.\n\n**Residual Connections:** x + Sublayer(x) instead of just Sublayer(x). Borrowed from ResNet. Without these, gradients vanish in deep networks and you can't train more than ~5 layers. With them, you can stack 96+ layers. The residual stream is the "highway" — each layer reads from it and writes a small delta back.\n\n**Layer Normalization:** Normalizes activations across the feature dimension (not batch). Stabilizes training by preventing activation magnitudes from exploding or collapsing. Pre-norm (GPT-2 style: LN → Attention → residual → LN → FFN → residual) is now standard over post-norm (original transformer), because gradients flow more cleanly.`,
    limitation: `FFN parameters are 2/3 of total model params but are applied identically to every token — no conditional computation. This motivates Mixture-of-Experts (MoE). Also, LayerNorm placement matters more than you'd think — pre-norm vs post-norm changes training dynamics significantly.`,
    diagram: "ffn-residual",
    code: `class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = SelfAttention(d_model, n_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),     # d_ff = 4 * d_model
            nn.GELU(),                     # smoother than ReLU
            nn.Linear(d_ff, d_model),
        )
    
    def forward(self, x, mask=None):
        # Pre-norm style (GPT-2, LLaMA, modern standard)
        # Residual connections are the secret sauce
        x = x + self.attn(self.ln1(x), mask)  # attend
        x = x + self.ffn(self.ln2(x))          # process
        return x
        
    # The residual stream: think of x as a highway.
    # Each layer reads from it and writes a delta.
    # Information flows freely through the whole stack.`,
  },
  {
    id: "causal",
    name: "+ Causal Masking (GPT-style Decoder)",
    year: "2018",
    who: "Radford et al. (OpenAI, GPT-1)",
    tagline: "Mask future tokens → autoregressive generation. This is the GPT architecture.",
    params: "117M (GPT-1)",
    perplexity: "~3.1",
    contextWindow: "512 (GPT-1) → 1024 (GPT-2)",
    color: "#6A040F",
    icon: "🎭",
    intuition: `For language modeling, you need a crucial constraint: token at position t can only attend to positions ≤ t. Otherwise you're "cheating" — using future tokens to predict the present.\n\nThis is implemented as a triangular attention mask. Before softmax, set all entries where j > i to −∞. The resulting attention matrix is lower-triangular.\n\nGPT-1's insight: take a decoder-only transformer, pre-train on raw text with this causal LM objective, then fine-tune on downstream tasks. This is the birth of "pre-training + fine-tuning" at scale.\n\nGPT-2 (2019) showed that scaling this up (1.5B params) lets you do tasks zero-shot — no fine-tuning needed. "Language models are unsupervised multitask learners."\n\nThe causal mask also enables efficient training: every position in a sequence is simultaneously a training example. A sequence of length T gives you T prediction tasks in one forward pass. This is called "teacher forcing."`,
    limitation: `Each token can only look backward, never forward. For tasks like fill-in-the-middle or understanding bidirectional context, this is suboptimal (see BERT). But for generation, it's exactly right — and generation turned out to be the killer app.\n\nKV-caching during inference: since past tokens' K and V never change (they can't see the future), you cache them and only compute the new token's Q/K/V at each step.`,
    diagram: "causal",
    code: `class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, n_heads, max_seq_len):
        super().__init__()
        # ... same projections as before ...
        
        # Pre-compute the causal mask
        mask = torch.tril(torch.ones(max_seq_len, max_seq_len))
        self.register_buffer("mask", mask)
    
    def forward(self, x):
        B, T, C = x.shape
        q, k, v = ...  # project and reshape
        
        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_k)
        # THE causal mask — upper triangle becomes -inf
        scores = scores.masked_fill(
            self.mask[:T, :T] == 0, float('-inf')
        )
        weights = F.softmax(scores, dim=-1)
        # Now token i literally cannot see token j > i
        
        # KV-cache during inference:
        # Only compute new token's Q; reuse cached K, V
        # This makes generation O(T) not O(T²) per step`,
  },
  {
    id: "scale",
    name: "Scaling + Modern Refinements",
    year: "2020–present",
    who: "Kaplan et al., Hoffmann et al. (Chinchilla), Touvron (LLaMA)",
    tagline: "Scaling laws, better training recipes, and architectural tweaks that compound.",
    params: "7B → 70B → 405B+",
    perplexity: "~2.0–2.8",
    contextWindow: "2048 → 128K+",
    color: "#3D348B",
    icon: "🚀",
    intuition: `The transformer architecture from 2017 is ~95% of what modern LLMs use. The remaining 5% is crucial engineering:\n\n**Scaling Laws (Kaplan 2020):** L ∝ N^(-0.076) — loss decreases as a power law with parameter count. This made scaling predictable and justified billion-dollar training runs.\n\n**Chinchilla (2022):** For a fixed compute budget, you should scale data and parameters equally. Previous models were severely undertrained. A 70B model trained on 1.4T tokens beats a 280B model on 300B tokens.\n\n**RoPE:** Rotary position embeddings that encode relative positions elegantly. Better length generalization than learned embeddings.\n\n**SwiGLU activation:** Gated variant of GELU in the FFN. ~1-2% better than GELU/ReLU. Used in LLaMA, PaLM.\n\n**RMSNorm:** Simplified LayerNorm without the mean-centering. Slightly faster, works as well.\n\n**GQA (Grouped-Query Attention):** Share K/V heads across multiple Q heads. Reduces KV-cache memory by 4-8x during inference, minimal quality loss. Critical for serving.\n\n**Flash Attention (Dao 2022):** Exact attention computed tile-by-tile with IO-awareness. 2-4x faster, enabling longer contexts without approximation.`,
    limitation: `We're still quadratic in sequence length (though Flash Attention hides this well). The fundamental architecture hasn't changed — we've just learned to train it better, scale it up, and serve it efficiently. Open questions: is autoregressive left-to-right generation the right objective? Do we need fundamentally new architectures, or just more scale? The bitter lesson suggests the latter, but we'll see.`,
    diagram: "scale",
    code: `# The modern LLM stack (LLaMA-style):
class ModernTransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, n_kv_heads, d_ff):
        super().__init__()
        self.norm1 = RMSNorm(d_model)     # not LayerNorm
        self.attn = GQAttention(           # not standard MHA
            d_model, n_heads, n_kv_heads   # GQA: fewer KV heads
        )  # + RoPE inside
        self.norm2 = RMSNorm(d_model)
        self.ffn = SwiGLU(d_model, d_ff)   # not GELU MLP
    
    def forward(self, x, freqs_cis):  # freqs_cis = RoPE freqs
        x = x + self.attn(self.norm1(x), freqs_cis)
        x = x + self.ffn(self.norm2(x))
        return x

# LLaMA-3 70B: 80 of these blocks
# d_model=8192, n_heads=64, n_kv_heads=8 (GQA 8:1)
# d_ff=28672, vocab=128k
# Training: 15T tokens, ~30M GPU-hours`,
  },
];

const DiagramBigram = () => (
  <svg viewBox="0 0 500 180" className="diagram-svg">
    <rect x="20" y="60" width="100" height="50" rx="8" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
    <text x="70" y="90" textAnchor="middle" fill="var(--clr-text)" fontSize="13" fontFamily="var(--mono)">xₜ₋₁</text>
    <line x1="120" y1="85" x2="200" y2="85" stroke="var(--clr-accent)" strokeWidth="2" markerEnd="url(#arr)"/>
    <rect x="200" y="50" width="140" height="70" rx="8" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <text x="270" y="82" textAnchor="middle" fill="var(--clr-text)" fontSize="12" fontFamily="var(--mono)">Lookup Table</text>
    <text x="270" y="100" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">P(xₜ | xₜ₋₁)</text>
    <line x1="340" y1="85" x2="420" y2="85" stroke="var(--clr-accent)" strokeWidth="2" markerEnd="url(#arr)"/>
    <rect x="420" y="60" width="60" height="50" rx="8" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
    <text x="450" y="90" textAnchor="middle" fill="var(--clr-text)" fontSize="13" fontFamily="var(--mono)">xₜ</text>
    <text x="250" y="155" textAnchor="middle" fill="var(--clr-muted)" fontSize="11" fontStyle="italic">No memory. No context. Just one lookup.</text>
    <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramNgram = () => (
  <svg viewBox="0 0 500 180" className="diagram-svg">
    {[0,1,2].map((i) => (
      <g key={i}>
        <rect x={20 + i*70} y="60" width="60" height="44" rx="6" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
        <text x={50 + i*70} y="86" textAnchor="middle" fill="var(--clr-text)" fontSize="12" fontFamily="var(--mono)">xₜ₋{3-i}</text>
        <line x1={80 + i*70} y1="82" x2={90 + i*70} y2="82" stroke="var(--clr-muted)" strokeWidth="1" strokeDasharray="3,3"/>
      </g>
    ))}
    <line x1="230" y1="82" x2="280" y2="82" stroke="var(--clr-accent)" strokeWidth="2" markerEnd="url(#arr2)"/>
    <rect x="280" y="45" width="120" height="74" rx="8" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <text x="340" y="75" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">Count Table</text>
    <text x="340" y="95" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">+ Smoothing</text>
    <text x="340" y="110" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">V^N entries</text>
    <line x1="400" y1="82" x2="440" y2="82" stroke="var(--clr-accent)" strokeWidth="2" markerEnd="url(#arr2)"/>
    <rect x="440" y="60" width="50" height="44" rx="6" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
    <text x="465" y="86" textAnchor="middle" fill="var(--clr-text)" fontSize="12" fontFamily="var(--mono)">xₜ</text>
    <text x="250" y="160" textAnchor="middle" fill="var(--clr-muted)" fontSize="11" fontStyle="italic">Fixed window. No generalization between similar contexts.</text>
    <defs><marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramNNLM = () => (
  <svg viewBox="0 0 500 220" className="diagram-svg">
    {[0,1,2,3].map((i) => (
      <g key={i}>
        <rect x={30 + i*65} y="10" width="50" height="36" rx="5" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
        <text x={55 + i*65} y="32" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">xₜ₋{4-i}</text>
        <line x1={55 + i*65} y1="46" x2={55 + i*65} y2="68" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr3)"/>
        <rect x={30 + i*65} y="68" width="50" height="30" rx="5" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
        <text x={55 + i*65} y="87" textAnchor="middle" fill="var(--clr-text)" fontSize="9" fontFamily="var(--mono)">embed</text>
      </g>
    ))}
    <text x="165" y="130" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">concat →</text>
    <rect x="220" y="112" width="120" height="34" rx="6" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <text x="280" y="133" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">Hidden (tanh)</text>
    <line x1="280" y1="146" x2="280" y2="170" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr3)"/>
    <rect x="220" y="170" width="120" height="34" rx="6" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
    <text x="280" y="191" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">Softmax → xₜ</text>
    <text x="420" y="87" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Similar words</text>
    <text x="420" y="100" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">→ similar vectors</text>
    {[0,1,2,3].map((i) => (
      <line key={`l${i}`} x1={55 + i*65} y1="98" x2="220" y2="129" stroke="var(--clr-muted)" strokeWidth="0.7" strokeDasharray="3,3"/>
    ))}
    <defs><marker id="arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramRNN = () => (
  <svg viewBox="0 0 500 200" className="diagram-svg">
    {[0,1,2,3].map((i) => (
      <g key={i}>
        <rect x={30 + i*115} y="130" width="60" height="36" rx="5" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
        <text x={60 + i*115} y="152" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">x{i+1}</text>
        <line x1={60 + i*115} y1="130" x2={60 + i*115} y2="100" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr4)"/>
        <rect x={25 + i*115} y="60" width="70" height="40" rx="8" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
        <text x={60 + i*115} y="84" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">LSTM</text>
        <line x1={60 + i*115} y1="60" x2={60 + i*115} y2="38" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr4)"/>
        <text x={60 + i*115} y="30" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">hₜ</text>
        {i < 3 && <line x1={95 + i*115} y1="80" x2={140 + i*115} y2="80" stroke="var(--clr-accent)" strokeWidth="2" markerEnd="url(#arr4)"/>}
      </g>
    ))}
    <text x="250" y="195" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Sequential: can't parallelize across time → slow training</text>
    <defs><marker id="arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramRNNAttn = () => (
  <svg viewBox="0 0 500 220" className="diagram-svg">
    {[0,1,2].map((i) => (
      <g key={i}>
        <rect x={20 + i*80} y="150" width="55" height="34" rx="5" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
        <text x={47 + i*80} y="171" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">enc_{i+1}</text>
        <rect x={20 + i*80} y="100" width="55" height="34" rx="5" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
        <text x={47 + i*80} y="121" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">h{i+1}</text>
      </g>
    ))}
    <rect x="300" y="40" width="80" height="40" rx="8" fill="#E76F5133" stroke="#E76F51" strokeWidth="1.5"/>
    <text x="340" y="64" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">Attn</text>
    {[0,1,2].map((i) => (
      <line key={`a${i}`} x1={75 + i*80} y1="108" x2="300" y2="55" stroke="#E76F51" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
    ))}
    <rect x="300" y="110" width="80" height="34" rx="6" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
    <text x="340" y="131" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">dec_t</text>
    <line x1="340" y1="80" x2="340" y2="110" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr5)"/>
    <line x1="380" y1="127" x2="430" y2="127" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr5)"/>
    <text x="455" y="131" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">yₜ</text>
    <text x="250" y="210" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Decoder "looks back" at all encoder states via learned weights</text>
    <defs><marker id="arr5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramSelfAttn = () => (
  <svg viewBox="0 0 500 240" className="diagram-svg">
    {["The","cat","sat","on"].map((w,i) => (
      <g key={i}>
        <text x={60 + i*110} y="230" textAnchor="middle" fill="var(--clr-text)" fontSize="12" fontFamily="var(--mono)">{w}</text>
        <rect x={30 + i*110} y="175" width="60" height="30" rx="4" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
        <text x={60 + i*110} y="194" textAnchor="middle" fill="var(--clr-muted)" fontSize="8" fontFamily="var(--mono)">Q K V</text>
      </g>
    ))}
    <rect x="70" y="80" width="320" height="60" rx="8" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <text x="230" y="105" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">softmax(QKᵀ / √dₖ) · V</text>
    <text x="230" y="125" textAnchor="middle" fill="var(--clr-muted)" fontSize="9" fontFamily="var(--mono)">All tokens attend to all tokens — in parallel</text>
    {[0,1,2,3].map((i) => (
      <line key={i} x1={60 + i*110} y1="175" x2={60 + i*110} y2="140" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr6)"/>
    ))}
    {[0,1,2,3].map((i) => (
      <line key={`o${i}`} x1={60 + i*110} y1="80" x2={60 + i*110} y2="50" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr6)"/>
    ))}
    <text x="230" y="30" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)" fontWeight="600">O(T²) but fully parallel</text>
    <defs><marker id="arr6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramPosEnc = () => (
  <svg viewBox="0 0 500 200" className="diagram-svg">
    {[0,1,2,3].map((i) => (
      <g key={i}>
        <rect x={30 + i*115} y="140" width="70" height="32" rx="5" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1"/>
        <text x={65 + i*115} y="160" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">embed_{i}</text>
        <text x={65 + i*115} y="130" textAnchor="middle" fill="var(--clr-accent)" fontSize="14" fontWeight="bold">+</text>
        <rect x={35 + i*115} y="90" width="60" height="28" rx="5" fill="#E76F5122" stroke="#E76F51" strokeWidth="1" strokeDasharray="3,2"/>
        <text x={65 + i*115} y="108" textAnchor="middle" fill="#E76F51" fontSize="9" fontFamily="var(--mono)">PE(pos={i})</text>
        <line x1={65 + i*115} y1="90" x2={65 + i*115} y2="60" stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr7)"/>
        <text x={65 + i*115} y="50" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">→ attn</text>
      </g>
    ))}
    <text x="250" y="195" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">sin/cos at different frequencies → unique position fingerprint</text>
    <defs><marker id="arr7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DiagramFFN = () => (
  <svg viewBox="0 0 500 260" className="diagram-svg">
    <rect x="150" y="215" width="200" height="32" rx="6" fill="var(--clr-bg-2)" stroke="var(--clr-border)" strokeWidth="1.5"/>
    <text x="250" y="235" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)">Input (residual stream)</text>
    
    <line x1="250" y1="215" x2="250" y2="195" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <rect x="170" y="165" width="160" height="30" rx="5" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
    <text x="250" y="184" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">LayerNorm</text>
    
    <line x1="250" y1="165" x2="250" y2="145" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <rect x="165" y="115" width="170" height="30" rx="5" fill="#E76F5133" stroke="#E76F51" strokeWidth="1.5"/>
    <text x="250" y="134" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">Self-Attention</text>
    
    <text x="380" y="150" textAnchor="middle" fill="var(--clr-accent)" fontSize="16" fontWeight="bold">+</text>
    <path d="M 350 230 Q 390 230 390 150 Q 390 135 350 135" fill="none" stroke="var(--clr-accent)" strokeWidth="1.5" strokeDasharray="4,2"/>
    
    <line x1="250" y1="115" x2="250" y2="95" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <rect x="170" y="65" width="160" height="30" rx="5" fill="var(--clr-accent-bg)" stroke="var(--clr-accent)" strokeWidth="1"/>
    <text x="250" y="84" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">LayerNorm</text>
    
    <line x1="250" y1="65" x2="250" y2="45" stroke="var(--clr-accent)" strokeWidth="1.5"/>
    <rect x="165" y="15" width="170" height="30" rx="5" fill="#2D6A4F33" stroke="#2D6A4F" strokeWidth="1.5"/>
    <text x="250" y="34" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">FFN (GELU, 4×)</text>
    
    <text x="380" y="50" textAnchor="middle" fill="var(--clr-accent)" fontSize="16" fontWeight="bold">+</text>
    <path d="M 350 130 Q 400 130 400 50 Q 400 30 350 30" fill="none" stroke="var(--clr-accent)" strokeWidth="1.5" strokeDasharray="4,2"/>
    
    <text x="90" y="225" fill="var(--clr-muted)" fontSize="9" fontStyle="italic">Residual</text>
    <text x="90" y="237" fill="var(--clr-muted)" fontSize="9" fontStyle="italic">connections</text>
  </svg>
);

const DiagramCausal = () => (
  <svg viewBox="0 0 500 220" className="diagram-svg">
    <text x="250" y="20" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)" fontWeight="600">Attention Matrix (after masking)</text>
    {["t1","t2","t3","t4"].map((t,i) => (
      <g key={i}>
        <text x={170 + i*70} y="50" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">{t}</text>
        <text x="130" y={78 + i*38} textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontFamily="var(--mono)">{t}</text>
      </g>
    ))}
    {[0,1,2,3].map((r) =>
      [0,1,2,3].map((c) => {
        const canSee = c <= r;
        return (
          <rect key={`${r}-${c}`} x={142 + c*70} y={60 + r*38} width="56" height="30" rx="4"
            fill={canSee ? "var(--clr-accent-bg)" : "var(--clr-bg-2)"}
            stroke={canSee ? "var(--clr-accent)" : "var(--clr-border)"} strokeWidth="1"
            opacity={canSee ? 1 : 0.3}
          />
        );
      })
    )}
    {[0,1,2,3].map((r) =>
      [0,1,2,3].map((c) => {
        const canSee = c <= r;
        return (
          <text key={`t${r}-${c}`} x={170 + c*70} y={80 + r*38} textAnchor="middle"
            fill={canSee ? "var(--clr-text)" : "var(--clr-muted)"}
            fontSize="10" fontFamily="var(--mono)" opacity={canSee ? 1 : 0.3}>
            {canSee ? "✓" : "−∞"}
          </text>
        );
      })
    )}
    <text x="250" y="215" textAnchor="middle" fill="var(--clr-muted)" fontSize="10" fontStyle="italic">Lower-triangular: token i can only attend to j ≤ i</text>
  </svg>
);

const DiagramScale = () => (
  <svg viewBox="0 0 500 200" className="diagram-svg">
    <text x="250" y="20" textAnchor="middle" fill="var(--clr-text)" fontSize="11" fontFamily="var(--mono)" fontWeight="600">The Modern Stack</text>
    {[
      { y: 160, label: "Token + RoPE", fill: "var(--clr-bg-2)", stroke: "var(--clr-border)" },
      { y: 125, label: "RMSNorm → GQA (self-attn)", fill: "#E76F5122", stroke: "#E76F51" },
      { y: 90, label: "RMSNorm → SwiGLU FFN", fill: "#2D6A4F22", stroke: "#2D6A4F" },
      { y: 55, label: "× N layers (80 for 70B)", fill: "var(--clr-accent-bg)", stroke: "var(--clr-accent)" },
    ].map((b, i) => (
      <g key={i}>
        <rect x="110" y={b.y} width="280" height="30" rx="6" fill={b.fill} stroke={b.stroke} strokeWidth="1.5"/>
        <text x="250" y={b.y + 19} textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">{b.label}</text>
        {i < 3 && <line x1="250" y1={b.y} x2="250" y2={b.y - 5} stroke="var(--clr-accent)" strokeWidth="1.5" markerEnd="url(#arr8)"/>}
      </g>
    ))}
    <text x="250" y="48" textAnchor="middle" fill="var(--clr-text)" fontSize="10" fontFamily="var(--mono)">→ Softmax → logits</text>
    <defs><marker id="arr8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--clr-accent)"/></marker></defs>
  </svg>
);

const DIAGRAMS = {
  "bigram": DiagramBigram,
  "ngram": DiagramNgram,
  "nnlm": DiagramNNLM,
  "rnn": DiagramRNN,
  "rnn-attn": DiagramRNNAttn,
  "self-attn": DiagramSelfAttn,
  "pos-enc": DiagramPosEnc,
  "ffn-residual": DiagramFFN,
  "causal": DiagramCausal,
  "scale": DiagramScale,
};

const TAB_LABELS = { intuition: "Intuition", code: "Code", diagram: "Diagram" };

export default function TransformerExplorer() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [tab, setTab] = useState("intuition");
  const contentRef = useRef(null);
  const model = MODELS[selectedIdx];
  const DiagramComp = DIAGRAMS[model.diagram];

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedIdx, tab]);

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', monospace",
      background: "var(--clr-bg)",
      color: "var(--clr-text)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        :root {
            --clr-bg: #f5f3ef;
            --clr-bg-2: #eae7e1;
            --clr-bg-3: #ddd9d1;
            --clr-text: #1a1a1e;
            --clr-muted: #6b6b75;
            --clr-border: #c8c4bc;
            --clr-accent: #8B6914;
            --clr-accent-bg: #8B691415;
          }
        .dark {
          --clr-bg: #0a0a0c;
          --clr-bg-2: #141418;
          --clr-bg-3: #1c1c22;
          --clr-text: #e8e6e3;
          --clr-muted: #7a7a85;
          --clr-border: #2a2a33;
          --clr-accent: #c9a84c;
          --clr-accent-bg: #c9a84c15;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        
        .sidebar-item {
          padding: 10px 16px;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.15s ease;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .sidebar-item:hover { background: var(--clr-bg-2); }
        .sidebar-item.active {
          background: var(--clr-bg-2);
          border-left-color: var(--clr-accent);
        }
        .sidebar-item .step-num {
          font-size: 10px;
          color: var(--clr-muted);
          font-family: 'IBM Plex Mono', monospace;
          min-width: 20px;
          padding-top: 2px;
        }
        .sidebar-item.active .step-num { color: var(--clr-accent); }
        .sidebar-item .step-name {
          font-size: 13px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 400;
          color: var(--clr-muted);
          line-height: 1.3;
        }
        .sidebar-item.active .step-name {
          color: var(--clr-text);
          font-weight: 500;
        }
        
        .tab-btn {
          padding: 6px 16px;
          background: none;
          border: 1px solid var(--clr-border);
          color: var(--clr-muted);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .tab-btn:first-child { border-radius: 4px 0 0 4px; }
        .tab-btn:last-child { border-radius: 0 4px 4px 0; }
        .tab-btn:not(:first-child) { border-left: none; }
        .tab-btn.active {
          background: var(--clr-accent);
          border-color: var(--clr-accent);
          color: #0a0a0c;
          font-weight: 500;
        }
        .tab-btn:hover:not(.active) { background: var(--clr-bg-2); color: var(--clr-text); }
        
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 20px;
        }
        .meta-cell {
          padding: 10px 12px;
          background: var(--clr-bg-2);
          border-radius: 6px;
          border: 1px solid var(--clr-border);
        }
        .meta-cell .label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--clr-muted);
          margin-bottom: 4px;
          font-family: 'IBM Plex Mono', monospace;
        }
        .meta-cell .value {
          font-size: 13px;
          color: var(--clr-text);
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
        }
        
        .content-text {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: var(--clr-text);
          white-space: pre-wrap;
        }
        .content-text p { margin-bottom: 14px; }
        
        .code-block {
          background: var(--clr-bg-2);
          border: 1px solid var(--clr-border);
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.6;
          font-family: 'IBM Plex Mono', monospace;
          color: var(--clr-text);
          white-space: pre;
          tab-size: 4;
        }
        
        .diagram-svg {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          display: block;
        }
        
        .progress-line {
          position: relative;
          width: 4px;
          margin-left: 26px;
        }
        
        .nav-arrow {
          background: none;
          border: 1px solid var(--clr-border);
          color: var(--clr-muted);
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          transition: all 0.15s ease;
        }
        .nav-arrow:hover:not(:disabled) {
          background: var(--clr-bg-2);
          color: var(--clr-text);
          border-color: var(--clr-accent);
        }
        .nav-arrow:disabled { opacity: 0.3; cursor: default; }
        
        .limitation-box {
          background: #9B222610;
          border: 1px solid #9B222640;
          border-radius: 6px;
          padding: 14px 16px;
          margin-top: 16px;
        }
        .limitation-box .lbl {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9B2226;
          margin-bottom: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--clr-border)",
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 18, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, color: "var(--clr-text)", letterSpacing: "-0.5px" }}>
          From Bigrams to Transformers
        </span>
        <span style={{ fontSize: 11, color: "var(--clr-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
          A progressive construction of the modern LLM
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 260,
          minWidth: 260,
          borderRight: "1px solid var(--clr-border)",
          overflowY: "auto",
          flexShrink: 0,
          paddingTop: 8,
          paddingBottom: 16,
        }}>
          {MODELS.map((m, i) => (
            <div key={m.id}
              className={`sidebar-item ${i === selectedIdx ? "active" : ""}`}
              onClick={() => { setSelectedIdx(i); setTab("intuition"); }}>
              <span className="step-num">{String(i).padStart(2, "0")}</span>
              <div>
                <div className="step-name">{m.name}</div>
                <div style={{ fontSize: 10, color: "var(--clr-muted)", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{m.year}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Model header */}
          <div style={{ padding: "20px 28px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 24 }}>{model.icon}</span>
              <span style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 22,
                fontWeight: 600,
                color: "var(--clr-text)",
                letterSpacing: "-0.5px",
              }}>{model.name}</span>
              <span style={{
                fontSize: 11,
                color: model.color,
                fontFamily: "'IBM Plex Mono', monospace",
                border: `1px solid ${model.color}40`,
                padding: "2px 8px",
                borderRadius: 3,
              }}>{model.year}</span>
            </div>
            <div style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 14,
              color: "var(--clr-muted)",
              marginBottom: 16,
              fontStyle: "italic",
            }}>{model.tagline}</div>
            <div style={{ fontSize: 11, color: "var(--clr-muted)", marginBottom: 14 }}>
              {model.who}
            </div>

            <div className="meta-grid">
              <div className="meta-cell">
                <div className="label">Params</div>
                <div className="value">{model.params}</div>
              </div>
              <div className="meta-cell">
                <div className="label">Perplexity</div>
                <div className="value">{model.perplexity}</div>
              </div>
              <div className="meta-cell">
                <div className="label">Context</div>
                <div className="value">{model.contextWindow}</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", marginBottom: 16 }}>
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <button key={key}
                  className={`tab-btn ${tab === key ? "active" : ""}`}
                  onClick={() => setTab(key)}>{label}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 28px 24px" }}>
            {tab === "intuition" && (
              <div>
                <div className="content-text">
                  {model.intuition.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="limitation-box">
                  <div className="lbl">What it can't do →</div>
                  <div className="content-text" style={{ fontSize: 13 }}>
                    {model.limitation.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            )}
            {tab === "code" && (
              <div className="code-block">{model.code}</div>
            )}
            {tab === "diagram" && DiagramComp && (
              <div style={{ padding: "20px 0" }}>
                <DiagramComp />
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={{
            padding: "12px 28px",
            borderTop: "1px solid var(--clr-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <button className="nav-arrow" disabled={selectedIdx === 0}
              onClick={() => { setSelectedIdx(i => i - 1); setTab("intuition"); }}>
              ← prev
            </button>
            <span style={{ fontSize: 10, color: "var(--clr-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {selectedIdx + 1} / {MODELS.length}
            </span>
            <button className="nav-arrow" disabled={selectedIdx === MODELS.length - 1}
              onClick={() => { setSelectedIdx(i => i + 1); setTab("intuition"); }}>
              next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
