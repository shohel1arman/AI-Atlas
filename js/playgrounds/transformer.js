/* ============================================================
   AI ATLAS — Transformer / Self-Attention engine
   Deterministic pseudo-attention from token hashes — responds
   to the actual input text, multi-head, with a heatmap + arcs.
   ============================================================ */
(function () {
  'use strict';

  // simple seeded RNG from string
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return () => { s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }

  const D = 8; // embedding dim
  function embed(token, salt) {
    const r = rng(hash(token.toLowerCase() + '|' + salt));
    const v = []; for (let i = 0; i < D; i++) v.push(r() * 2 - 1);
    return v;
  }
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  function softmax(arr) { const m = Math.max(...arr); const e = arr.map(x => Math.exp((x - m) * 1.4)); const s = e.reduce((a, b) => a + b, 0); return e.map(x => x / s); }

  // build attention matrix for a head
  function attention(tokens, head) {
    const Q = tokens.map(t => embed(t, 'q' + head));
    const K = tokens.map(t => embed(t, 'k' + head));
    const n = tokens.length;
    const M = [];
    for (let i = 0; i < n; i++) {
      const scores = [];
      for (let j = 0; j < n; j++) scores.push(dot(Q[i], K[j]) / Math.sqrt(D));
      M.push(softmax(scores));
    }
    return M;
  }

  function tokenize(text) {
    // word + punctuation tokens, prefixed like a real tokenizer
    const raw = text.trim().split(/\s+/).filter(Boolean);
    return raw.slice(0, 12);
  }

  window.AttentionLab = function (opts) {
    const tokenRow = opts.tokenRow;     // container for token chips (source)
    const heatCanvas = opts.heatCanvas; // heatmap canvas
    const onTokens = opts.onTokens || (() => {});
    const ctx = heatCanvas.getContext('2d');
    let tokens = [], head = 0, M = [], hover = -1;

    function compute(text) {
      tokens = tokenize(text);
      M = attention(tokens, head);
      renderTokens(); drawHeat();
      onTokens(tokens);
    }
    function setHead(h) { head = h; M = attention(tokens, head); drawHeat(); }

    function renderTokens() {
      tokenRow.innerHTML = tokens.map((t, i) =>
        `<span class="tok" data-i="${i}">${t}</span>`).join('');
      tokenRow.querySelectorAll('.tok').forEach(el => {
        el.addEventListener('mouseenter', () => { hover = +el.dataset.i; drawHeat(); highlight(); });
        el.addEventListener('mouseleave', () => { hover = -1; drawHeat(); highlight(); });
      });
    }
    function highlight() {
      tokenRow.querySelectorAll('.tok').forEach((el, j) => {
        if (hover < 0) { el.style.background = ''; el.style.borderColor = ''; el.style.color=''; return; }
        const w = M[hover][j];
        el.style.background = `rgba(168,85,247,${w * 0.9})`;
        el.style.borderColor = `rgba(168,85,247,${0.3 + w})`;
        el.style.color = w > 0.4 ? '#fff' : '';
      });
    }

    function drawHeat() {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = heatCanvas.getBoundingClientRect();
      heatCanvas.width = r.width * DPR; heatCanvas.height = r.height * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      const n = tokens.length; if (!n) return;
      const pad = 78, top = 24;
      const gw = (r.width - pad - 16), gh = (r.height - top - 16);
      const cell = Math.min(gw / n, gh / n);
      const ox = pad, oy = top;
      // cells
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const w = M[i][j];
        const dim = (hover >= 0 && hover !== i) ? 0.18 : 1;
        ctx.fillStyle = `rgba(168,85,247,${(0.06 + w * 0.92) * dim})`;
        ctx.fillRect(ox + j * cell, oy + i * cell, cell - 2, cell - 2);
        if (w > 0.28 && dim > 0.5) { ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, w)})`; ctx.font = `${Math.min(11, cell/3.4)}px JetBrains Mono`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(w.toFixed(2).slice(1), ox+j*cell+cell/2-1, oy+i*cell+cell/2); }
      }
      // row labels (query)
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.font = '11px JetBrains Mono';
      for (let i = 0; i < n; i++) { ctx.fillStyle = (hover === i) ? '#fff' : 'rgba(185,185,204,0.8)'; ctx.fillText(tokens[i].slice(0, 9), ox - 8, oy + i * cell + cell / 2 - 1); }
      // col labels (key)
      ctx.save(); ctx.textAlign = 'left'; ctx.font = '10px JetBrains Mono';
      for (let j = 0; j < n; j++) { ctx.save(); ctx.translate(ox + j * cell + cell / 2, oy - 6); ctx.rotate(-0.9); ctx.fillStyle = 'rgba(124,124,146,0.9)'; ctx.fillText(tokens[j].slice(0, 8), 0, 0); ctx.restore(); }
      ctx.restore();
    }

    window.addEventListener('resize', drawHeat);
    return { compute, setHead, drawHeat };
  };

  // next-token mock: given a prompt, produce plausible candidates
  window.nextTokenDist = function (prompt) {
    const seed = hash(prompt.toLowerCase().trim());
    const r = rng(seed);
    const last = prompt.trim().split(/\s+/).slice(-1)[0].toLowerCase();
    const banks = {
      the: ['model', 'cat', 'system', 'data', 'network', 'result'],
      a: ['neural', 'simple', 'large', 'new', 'small', 'deep'],
      is: ['a', 'the', 'trained', 'learning', 'able', 'very'],
      default: ['the', 'a', 'and', 'to', 'of', 'is', 'model', 'data'],
    };
    const pool = banks[last] || banks.default;
    let weights = pool.map(() => r());
    const s = weights.reduce((a, b) => a + b, 0);
    weights = weights.map(w => w / s).sort((a, b) => b - a);
    return pool.map((t, i) => ({ tok: t, p: weights[i] }));
  };
})();
