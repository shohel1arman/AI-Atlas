/* ===========================================================
   AI ATLAS — landing interactions
   neural-net hero canvas · particles · reveals · chatbot
   =========================================================== */
(function () {
  'use strict';

  /* ---------- nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveal (position-based, robust in any iframe) ---------- */
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  function checkReveals() {
    const h = window.innerHeight || document.documentElement.clientHeight;
    for (const el of reveals) {
      if (el.classList.contains('in')) continue;
      const r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) el.classList.add('in');
    }
  }
  window.addEventListener('scroll', checkReveals, { passive: true });
  window.addEventListener('resize', checkReveals);
  requestAnimationFrame(() => { checkReveals(); requestAnimationFrame(checkReveals); });
  // failsafe: force final state on ALL reveals, killing the (throttle-prone) transition
  setTimeout(() => reveals.forEach(el => { el.style.transition = 'none'; el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; }), 1600);

  /* ---------- HERO neural network canvas ---------- */
  const canvas = document.getElementById('net');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, DPR, nodes = [], edges = [], pulses = [], mouse = { x: -999, y: -999 };

    const layers = [4, 7, 7, 5, 3];

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      nodes = []; edges = [];
      const padX = W * 0.10, usableW = W * 0.80;
      layers.forEach((count, li) => {
        const x = padX + (usableW * li) / (layers.length - 1);
        for (let i = 0; i < count; i++) {
          const y = H * 0.5 + (i - (count - 1) / 2) * Math.min(64, (H * 0.7) / count);
          nodes.push({ x, y, li, i, r: 3.4 + Math.random() * 1.6, base: 3.4 + Math.random() * 1.6, ph: Math.random() * 6.28 });
        }
      });
      // edges between consecutive layers
      let offset = 0;
      for (let li = 0; li < layers.length - 1; li++) {
        const a0 = offset, a1 = offset + layers[li], b1 = a1 + layers[li + 1];
        for (let a = a0; a < a1; a++)
          for (let b = a1; b < b1; b++)
            edges.push({ a, b, w: Math.random() });
        offset += layers[li];
      }
    }

    function spawnPulse() {
      const e = edges[(Math.random() * edges.length) | 0];
      pulses.push({ e, t: 0, sp: 0.012 + Math.random() * 0.02, hue: Math.random() < 0.5 ? '#8B8CF6' : '#22D3EE' });
    }

    let last = 0;
    function frame(ts) {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, W, H);

      // edges
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(140,140,200,${0.04 + e.w * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // pulses
      if (ts - last > 130) { spawnPulse(); last = ts; }
      pulses = pulses.filter(p => p.t < 1);
      for (const p of pulses) {
        p.t += p.sp;
        const a = nodes[p.e.a], b = nodes[p.e.b];
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, p.hue); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.28); ctx.fill();
        // light up target
        if (p.t > 0.92) b.flash = 1;
      }

      // nodes
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - d / 130);
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + n.ph);
        const flash = n.flash || 0; n.flash = Math.max(0, flash - 0.04);
        const r = n.base + pulse * 0.8 + near * 3 + flash * 2.5;
        // glow
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4.2);
        const a = 0.12 + near * 0.5 + flash * 0.5;
        g.addColorStop(0, `rgba(139,140,246,${a})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4.2, 0, 6.28); ctx.fill();
        // core
        ctx.fillStyle = flash > 0.1 ? '#cdd0ff' : `rgba(200,202,255,${0.55 + near * 0.4})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.28); ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    canvas.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('pointerleave', () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener('resize', build);
    build();
    requestAnimationFrame(frame);
  }

  /* ---------- floating particles ---------- */
  const pcanvas = document.getElementById('particles');
  if (pcanvas) {
    const ctx = pcanvas.getContext('2d');
    let W, H, DPR, parts = [];
    function setup() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = pcanvas.width = innerWidth * DPR; H = pcanvas.height = innerHeight * DPR;
      pcanvas.style.width = innerWidth + 'px'; pcanvas.style.height = innerHeight + 'px';
      const n = Math.min(70, Math.floor(innerWidth / 22));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12 * DPR, vy: (Math.random() - 0.5) * 0.12 * DPR,
        r: (Math.random() * 1.6 + 0.4) * DPR, a: Math.random() * 0.5 + 0.1
      }));
    }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = `rgba(150,155,230,${p.a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    addEventListener('resize', setup); setup(); loop();
  }

  /* ---------- hero forward-pass mini visual ---------- */
  const mini = document.getElementById('mini-pass');
  if (mini) {
    const bars = mini.querySelectorAll('.mp-bar span');
    setInterval(() => {
      bars.forEach(b => { b.style.height = (12 + Math.random() * 76) + '%'; });
    }, 900);
  }

  /* ---------- spatial attention heat chip ---------- */
  const spHeat = document.getElementById('sp-heat');
  if (spHeat) {
    const cells = [];
    for (let i = 0; i < 25; i++) { const d = document.createElement('i'); spHeat.appendChild(d); cells.push(d); }
    const cols = ['139,140,246', '34,211,238', '168,85,247'];
    const paint = () => cells.forEach(c => { const a = Math.random(); c.style.background = `rgba(${cols[(Math.random()*cols.length)|0]},${(0.12 + a * 0.85).toFixed(2)})`; });
    paint(); setInterval(paint, 1300);
  }

  /* ---------- kinetic title reveal ---------- */
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const words = heroTitle.querySelectorAll('.w');
    words.forEach((w, i) => { w.style.transitionDelay = (i * 0.08 + 0.1) + 's'; });
    requestAnimationFrame(() => heroTitle.classList.add('in'));
    setTimeout(() => heroTitle.classList.add('in'), 400);
    // failsafe: force visible without relying on the (throttle-prone) transition clock
    setTimeout(() => words.forEach(w => { if (getComputedStyle(w).opacity < 0.9) { w.style.transition = 'none'; w.style.opacity = '1'; w.style.transform = 'none'; } }), 1700);
  }

  /* ---------- hero spatial parallax + magnetic cursor ---------- */
  const hero = document.getElementById('hero');
  const cursor = document.getElementById('cursor-glow');
  if (hero && window.matchMedia('(min-width: 981px)').matches) {
    const layers = hero.querySelectorAll('[data-depth]');
    let tx = 0, ty = 0, cxp = 0, cyp = 0, rx = 0, ry = 0;
    let mxRaw = 0, myRaw = 0, cursorX = 0, cursorY = 0;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mxRaw = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
      myRaw = (e.clientY - r.top) / r.height - 0.5;
      cursorX = e.clientX; cursorY = e.clientY;
    });
    hero.addEventListener('pointerleave', () => { mxRaw = 0; myRaw = 0; });
    // magnetic buttons
    hero.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('pointermove', (e) => { const b = btn.getBoundingClientRect(); const dx = (e.clientX - (b.left + b.width / 2)) / b.width; const dy = (e.clientY - (b.top + b.height / 2)) / b.height; btn.style.transform = `translate(${dx * 14}px, ${dy * 14}px)`; if (cursor) cursor.classList.add('hot'); });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; if (cursor) cursor.classList.remove('hot'); });
    });
    function tick() {
      tx += (mxRaw - tx) * 0.08; ty += (myRaw - ty) * 0.08;
      layers.forEach(l => { const d = +l.dataset.depth; l.style.transform = `translate3d(${-tx * d}px, ${-ty * d}px, 0)`; });
      // subtle stage tilt
      const stage = document.getElementById('hero-stage');
      if (stage) stage.style.transform = `rotateY(${tx * 4}deg) rotateX(${-ty * 4}deg)`;
      if (cursor) { cxp += (cursorX - cxp) * 0.18; cyp += (cursorY - cyp) * 0.18; cursor.style.transform = `translate(${cxp}px, ${cyp}px) translate(-50%,-50%)`; }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- count-up stats ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    let started = false;
    const run = () => {
      if (started) return;
      const r = el.getBoundingClientRect();
      if (r.top > (window.innerHeight || 800) * 0.95 || r.bottom < 0) return;
      started = true;
      let v = 0; const step = Math.max(1, target / 48);
      const tick = () => { v += step; if (v >= target) { el.textContent = target + (el.dataset.suffix || ''); } else { el.textContent = Math.floor(v) + (el.dataset.suffix || ''); requestAnimationFrame(tick); } };
      tick();
    };
    window.addEventListener('scroll', run, { passive: true });
    requestAnimationFrame(run);
    setTimeout(run, 600);
    setTimeout(() => { if (!started) { started = true; el.textContent = target + (el.dataset.suffix || ''); } }, 2000);
  });

  /* ===========================================================
     CHATBOT — scripted assistant w/ navigation intents
     =========================================================== */
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const log = document.getElementById('chat-log');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const chips = document.getElementById('chat-chips');

  if (fab) {
    const open = () => { panel.classList.add('open'); fab.classList.add('hidden'); setTimeout(() => input.focus(), 250); };
    const close = () => { panel.classList.remove('open'); fab.classList.remove('hidden'); };
    fab.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    const intents = [
      { k: ['attention', 'transformer', 'self-attention', 'head'], title: 'Self-Attention', href: 'modules/transformers.html',
        say: 'Attention lets every token look at every other token and decide what matters. Each token emits a <b>query</b>, a <b>key</b> and a <b>value</b> — the dot-product of queries and keys becomes the attention weight. Opening the <b>Transformer Playground</b> with the attention heatmap live →' },
      { k: ['neural', 'backprop', 'network', 'perceptron', 'deep'], title: 'Neural Networks', href: 'modules/deep-learning.html',
        say: 'A neural network stacks layers of weighted sums + nonlinearities. Training nudges the weights down the loss gradient via <b>backpropagation</b>. Launching the <b>Deep Learning Lab</b> — drag neurons, watch the forward pass and gradients flow →' },
      { k: ['regression', 'linear', 'fit', 'least squares'], title: 'Linear Regression', href: 'modules/machine-learning.html',
        say: 'Linear regression finds the line minimizing squared error. Drag the data points and watch the loss surface and the fit update in real time → opening the <b>ML Playground</b>.' },
      { k: ['vector', 'matrix', 'eigen', 'gradient', 'math', 'calculus'], title: 'Mathematics', href: 'modules/mathematics.html',
        say: 'The math behind AI is mostly linear algebra + calculus. Drag vectors, multiply matrices, and watch gradient descent roll downhill → opening the <b>Mathematics Playground</b>.' },
      { k: ['diffusion', 'image', 'generate', 'gan', 'generative'], title: 'Generative AI', href: 'modules/generative.html',
        say: 'Diffusion models learn to reverse noise step by step into an image. Scrub the denoising timeline → opening the <b>Generative AI Lab</b>.' },
      { k: ['etl', 'pipeline', 'data engineering', 'airflow', 'dag'], title: 'ETL', href: 'modules/etl.html',
        say: 'ETL = Extract, Transform, Load. Build a DAG, connect nodes, and simulate data flowing through → opening <b>ETL & Data Engineering</b>.' },
      { k: ['agent', 'llm', 'local', 'vram', 'gpu', 'lora', 'rlhf', 'quantize', 'build llm', 'fine-tune', 'fine tune'], title: 'LLM & Agents', href: 'modules/llm-agents.html',
        say: 'Build an LLM from tokenizer to RLHF, size it to your GPU\'s VRAM to run locally, and wire up a tool-using agent loop → opening the <b>LLM & Agents Lab</b>.' },
      { k: ['shap', 'lime', 'explain', 'xai', 'saliency'], title: 'Explainable AI', href: 'modules/xai.html',
        say: 'Explainability asks: <i>why</i> did the model decide that? SHAP attributes each feature\'s push on the prediction → opening the <b>Explainable AI</b> module.' },
      { k: ['mlops', 'deploy', 'drift', 'monitor', 'registry'], title: 'MLOps', href: 'modules/mlops.html',
        say: 'MLOps keeps models healthy in production: deploy, monitor, detect drift, roll back → opening the <b>MLOps Playground</b>.' },
    ];

    function add(role, html) {
      const row = document.createElement('div');
      row.className = 'msg ' + role;
      row.innerHTML = role === 'bot'
        ? `<div class="msg-av">◆</div><div class="msg-bub">${html}</div>`
        : `<div class="msg-bub">${html}</div>`;
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }

    function typing() {
      const row = document.createElement('div');
      row.className = 'msg bot';
      row.innerHTML = `<div class="msg-av">◆</div><div class="msg-bub typing"><i></i><i></i><i></i></div>`;
      log.appendChild(row); log.scrollTop = log.scrollHeight;
      return row;
    }

    function respond(text) {
      const q = text.toLowerCase();
      const hit = intents.find(it => it.k.some(k => q.includes(k)));
      const t = typing();
      setTimeout(() => {
        t.remove();
        if (hit) {
          const row = add('bot', hit.say + `<div class="msg-cta"><a class="btn btn-primary btn-sm" href="${hit.href}">Open ${hit.title} ›</a></div>`);
        } else {
          add('bot', 'I can take you straight to any playground and explain the idea. Try asking about <b>attention</b>, <b>neural networks</b>, <b>linear regression</b>, <b>diffusion</b>, or <b>ETL pipelines</b> — or pick a chip below.');
        }
      }, 750);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim(); if (!v) return;
      add('user', v); input.value = ''; respond(v);
    });
    if (chips) chips.addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      add('user', b.dataset.q); respond(b.dataset.q);
    });
  }
})();
