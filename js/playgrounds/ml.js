/* ============================================================
   AI ATLAS — Machine Learning playgrounds
   RegressionLab (drag points, live fit) + KMeansLab (animated)
   ============================================================ */
(function () {
  'use strict';
  function crisp(canvas, ctx) {
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * DPR; canvas.height = r.height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return r;
  }

  /* ---------------- Regression Lab ---------------- */
  window.RegressionLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H, pad = 44;
    let degree = 1;
    let pts = [];
    let drag = null;
    const PAD = 0.06;

    function seed() {
      pts = [];
      for (let i = 0; i < 9; i++) { const x = i / 8; const y = 0.2 + x * 0.55 + (Math.random() - 0.5) * 0.18; pts.push({ x, y: Math.max(0.05, Math.min(0.95, y)) }); }
    }
    seed();

    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; }
    const toPx = p => ({ x: pad + p.x * (W - pad * 1.5), y: H - pad - p.y * (H - pad * 1.5) });
    const toData = (px, py) => ({ x: (px - pad) / (W - pad * 1.5), y: (H - pad - py) / (H - pad * 1.5) });

    // polynomial fit via normal equations (least squares)
    function fit() {
      const n = degree + 1;
      // build X^T X and X^T y
      const XtX = Array.from({ length: n }, () => new Array(n).fill(0));
      const Xty = new Array(n).fill(0);
      for (const p of pts) {
        const row = []; for (let d = 0; d < n; d++) row.push(Math.pow(p.x, d));
        for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) XtX[i][j] += row[i] * row[j]; Xty[i] += row[i] * p.y; }
      }
      // solve via Gaussian elimination
      for (let i = 0; i < n; i++) XtX[i].push(Xty[i]);
      for (let i = 0; i < n; i++) {
        let piv = i; for (let k = i + 1; k < n; k++) if (Math.abs(XtX[k][i]) > Math.abs(XtX[piv][i])) piv = k;
        [XtX[i], XtX[piv]] = [XtX[piv], XtX[i]];
        const d = XtX[i][i] || 1e-9;
        for (let j = i; j <= n; j++) XtX[i][j] /= d;
        for (let k = 0; k < n; k++) if (k !== i) { const f = XtX[k][i]; for (let j = i; j <= n; j++) XtX[k][j] -= f * XtX[i][j]; }
      }
      return XtX.map(r => r[n]);
    }
    const evalPoly = (c, x) => c.reduce((s, ci, d) => s + ci * Math.pow(x, d), 0);

    function draw() {
      layout(); ctx.clearRect(0, 0, W, H);
      // axes
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad * 0.5, H - pad); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(pad, pad * 0.5); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      for (let i = 1; i <= 4; i++) { const gx = pad + i / 4 * (W - pad * 1.5); ctx.beginPath(); ctx.moveTo(gx, H - pad); ctx.lineTo(gx, pad * 0.5); ctx.stroke(); const gy = H - pad - i / 4 * (H - pad * 1.5); ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad * 0.5, gy); ctx.stroke(); }

      const coef = fit();
      // residuals
      ctx.strokeStyle = 'rgba(251,113,133,0.5)'; ctx.lineWidth = 1.5;
      let mse = 0;
      for (const p of pts) { const yhat = evalPoly(coef, p.x); mse += (p.y - yhat) ** 2; const a = toPx(p), b = toPx({ x: p.x, y: yhat }); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      mse /= pts.length;
      // fit curve
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) { const x = i / 100; const y = evalPoly(coef, x); const a = toPx({ x, y }); i ? ctx.lineTo(a.x, a.y) : ctx.moveTo(a.x, a.y); }
      ctx.strokeStyle = '#8B8CF6'; ctx.lineWidth = 3; ctx.stroke();
      // points
      for (const p of pts) { const a = toPx(p); ctx.beginPath(); ctx.arc(a.x, a.y, 6, 0, 6.28); ctx.fillStyle = '#22D3EE'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#0a0a13'; ctx.stroke(); }
      onUpdate && onUpdate({ coef, mse, r2: 1 - mse / variance() });
    }
    function variance() { const m = pts.reduce((s, p) => s + p.y, 0) / pts.length; return pts.reduce((s, p) => s + (p.y - m) ** 2, 0) / pts.length || 1e-9; }

    function pos(e) { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    canvas.addEventListener('pointerdown', e => { const p = pos(e); for (let i = 0; i < pts.length; i++) { const a = toPx(pts[i]); if (Math.hypot(a.x - p.x, a.y - p.y) < 14) { drag = i; canvas.setPointerCapture(e.pointerId); return; } } const d = toData(p.x, p.y); pts.push({ x: Math.max(0, Math.min(1, d.x)), y: Math.max(0, Math.min(1, d.y)) }); draw(); });
    canvas.addEventListener('pointermove', e => { const p = pos(e); canvas.style.cursor = 'crosshair'; if (drag === null) return; const d = toData(p.x, p.y); pts[drag] = { x: Math.max(0, Math.min(1, d.x)), y: Math.max(0, Math.min(1, d.y)) }; draw(); });
    window.addEventListener('pointerup', () => drag = null);
    window.addEventListener('resize', draw);

    return { draw, setDegree(d) { degree = d; draw(); }, reset() { seed(); draw(); } };
  };

  /* ---------------- KMeans Lab ---------------- */
  window.KMeansLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H, k = 3, pts = [], cents = [], running = false, raf, iter = 0;
    const COLORS = ['#8B8CF6', '#22D3EE', '#34D399', '#F59E0B', '#FB7185', '#A855F7'];

    function genData(clusters = 3) {
      pts = [];
      for (let c = 0; c < clusters; c++) { const cx = 0.2 + Math.random() * 0.6, cy = 0.2 + Math.random() * 0.6; for (let i = 0; i < 50; i++) pts.push({ x: cx + (Math.random() - 0.5) * 0.28, y: cy + (Math.random() - 0.5) * 0.28, c: -1 }); }
      pts = pts.map(p => ({ ...p, x: Math.max(0.03, Math.min(0.97, p.x)), y: Math.max(0.03, Math.min(0.97, p.y)) }));
    }
    function initCents() { cents = []; for (let i = 0; i < k; i++) { const p = pts[(Math.random() * pts.length) | 0]; cents.push({ x: p.x, y: p.y }); } iter = 0; }

    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; }
    const toPx = p => ({ x: 30 + p.x * (W - 60), y: 30 + p.y * (H - 60) });

    function assign() { for (const p of pts) { let best = 0, bd = Infinity; for (let i = 0; i < cents.length; i++) { const d = (p.x - cents[i].x) ** 2 + (p.y - cents[i].y) ** 2; if (d < bd) { bd = d; best = i; } } p.c = best; } }
    function update() { let moved = 0; for (let i = 0; i < cents.length; i++) { const mem = pts.filter(p => p.c === i); if (!mem.length) continue; const nx = mem.reduce((s, p) => s + p.x, 0) / mem.length, ny = mem.reduce((s, p) => s + p.y, 0) / mem.length; moved += Math.hypot(nx - cents[i].x, ny - cents[i].y); cents[i] = { x: nx, y: ny }; } return moved; }

    function draw() {
      layout(); ctx.clearRect(0, 0, W, H);
      for (const p of pts) { const a = toPx(p); ctx.beginPath(); ctx.arc(a.x, a.y, 4, 0, 6.28); ctx.fillStyle = p.c >= 0 ? COLORS[p.c] : '#555'; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; }
      cents.forEach((c, i) => { const a = toPx(c); const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 20); g.addColorStop(0, COLORS[i] + 'cc'); g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(a.x, a.y, 20, 0, 6.28); ctx.fill(); ctx.beginPath(); ctx.moveTo(a.x - 7, a.y); ctx.lineTo(a.x + 7, a.y); ctx.moveTo(a.x, a.y - 7); ctx.lineTo(a.x, a.y + 7); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.beginPath(); ctx.arc(a.x, a.y, 9, 0, 6.28); ctx.strokeStyle = COLORS[i]; ctx.lineWidth = 2.5; ctx.stroke(); });
      onUpdate && onUpdate({ iter, k });
    }
    let acc = 0;
    function loop(ts) { if (!running) return; if (!loop.last) loop.last = ts; if (ts - loop.last > 550) { assign(); const moved = update(); iter++; draw(); loop.last = ts; if (moved < 0.001 && iter > 2) { running = false; return; } } raf = requestAnimationFrame(loop); }

    window.addEventListener('resize', draw);
    return {
      draw, init() { genData(3); initCents(); assign(); draw(); },
      play() { if (!running) { running = true; loop.last = 0; requestAnimationFrame(loop); } },
      pause() { running = false; },
      toggle() { running ? this.pause() : this.play(); return running; },
      newData() { running = false; genData(2 + (Math.random() * 3 | 0)); initCents(); assign(); draw(); },
      setK(v) { k = v; running = false; initCents(); assign(); draw(); },
      step() { running = false; assign(); update(); iter++; draw(); },
    };
  };

  /* ---------------- Classifier Lab (logistic regression / KNN) ---------------- */
  window.ClassifierLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], model = 'logistic', knnK = 5, active = 0;
    const CLS = ['#22D3EE', '#FB7185']; // class A (cyan), class B (rose)
    let wgt = { a: 0, b: 0, c: 0 };

    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; }
    const toPx = p => ({ x: 30 + p.x * (W - 60), y: 30 + p.y * (H - 60) });
    const toData = (px, py) => ({ x: (px - 30) / (W - 60), y: (py - 30) / (H - 60) });

    function clamp() { pts = pts.map(p => ({ ...p, x: Math.max(0.02, Math.min(0.98, p.x)), y: Math.max(0.02, Math.min(0.98, p.y)) })); }
    function seed() {
      pts = [];
      for (let i = 0; i < 22; i++) pts.push({ x: 0.3 + (Math.random() - 0.5) * 0.3, y: 0.32 + (Math.random() - 0.5) * 0.3, label: 0 });
      for (let i = 0; i < 22; i++) pts.push({ x: 0.7 + (Math.random() - 0.5) * 0.3, y: 0.68 + (Math.random() - 0.5) * 0.3, label: 1 });
      clamp();
    }

    const sig = z => 1 / (1 + Math.exp(-z));
    function trainLogistic() {
      wgt = { a: 0, b: 0, c: 0 };
      const n = pts.length; if (!n) return;
      for (let it = 0; it < 600; it++) {
        let ga = 0, gb = 0, gc = 0;
        for (const p of pts) { const e = sig(wgt.a * p.x + wgt.b * p.y + wgt.c) - p.label; ga += e * p.x; gb += e * p.y; gc += e; }
        wgt.a -= 1.0 * ga / n; wgt.b -= 1.0 * gb / n; wgt.c -= 1.0 * gc / n;
      }
    }
    function prob(x, y) {
      if (model === 'logistic') return sig(wgt.a * x + wgt.b * y + wgt.c);
      if (!pts.length) return 0.5;
      const sorted = pts.map(p => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, l: p.label })).sort((m, n) => m.d - n.d);
      const kk = Math.min(knnK, sorted.length); let s = 0; for (let i = 0; i < kk; i++) s += sorted[i].l; return s / kk;
    }

    function draw() {
      layout(); ctx.clearRect(0, 0, W, H);
      const N = 46, cw = (W - 60) / N, ch = (H - 60) / N;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const d = toData(30 + i * cw + cw / 2, 30 + j * ch + ch / 2);
        const p = prob(d.x, d.y);
        ctx.fillStyle = p > 0.5 ? `rgba(251,113,133,${0.10 + (p - 0.5) * 0.5})` : `rgba(34,211,238,${0.10 + (0.5 - p) * 0.5})`;
        ctx.fillRect(30 + i * cw, 30 + j * ch, cw + 1, ch + 1);
      }
      for (const p of pts) { const a = toPx(p); ctx.beginPath(); ctx.arc(a.x, a.y, 5, 0, 6.28); ctx.fillStyle = CLS[p.label]; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#0b0b14'; ctx.stroke(); }
      let tp = 0, fn = 0, fp = 0, tn = 0;
      for (const p of pts) { const pred = prob(p.x, p.y) > 0.5 ? 1 : 0; if (p.label === 1 && pred === 1) tp++; else if (p.label === 1) fn++; else if (pred === 1) fp++; else tn++; }
      const acc = pts.length ? (tp + tn) / pts.length : 0;
      onUpdate && onUpdate({ tp, fn, fp, tn, acc, prec: tp / (tp + fp), rec: tp / (tp + fn) });
    }
    function update() { if (model === 'logistic') trainLogistic(); draw(); }

    function pos(e) { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    canvas.addEventListener('pointerdown', e => {
      const pp = pos(e);
      for (let i = 0; i < pts.length; i++) { const a = toPx(pts[i]); if (Math.hypot(a.x - pp.x, a.y - pp.y) < 11) { pts.splice(i, 1); update(); return; } }
      const d = toData(pp.x, pp.y); if (d.x < 0 || d.x > 1 || d.y < 0 || d.y > 1) return;
      pts.push({ x: d.x, y: d.y, label: active }); update();
    });
    window.addEventListener('resize', draw);

    return {
      draw, update,
      setModel(m) { model = m; update(); },
      setK(v) { knnK = v; if (model === 'knn') draw(); },
      setActive(c) { active = c; },
      clear() { pts = []; wgt = { a: 0, b: 0, c: 0 }; draw(); },
      seed2() { seed(); update(); },
    };
  };

  /* ---------------- Ensemble Lab (decision tree / random forest) ---------------- */
  window.EnsembleLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], mode = 'tree', depth = 4, nTrees = 25, active = 0, modelCache = null;
    const CLS = ['#22D3EE', '#FB7185'];

    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; }
    const toPx = p => ({ x: 30 + p.x * (W - 60), y: 30 + p.y * (H - 60) });
    const toData = (px, py) => ({ x: (px - 30) / (W - 60), y: (py - 30) / (H - 60) });

    function seed() {
      pts = [];
      // circular pattern: trees approximate it with a staircase, forests smooth it out
      for (let i = 0; i < 90; i++) {
        const x = Math.random(), y = Math.random();
        const inside = (x - 0.5) ** 2 + (y - 0.5) ** 2 < 0.085;
        const label = (Math.random() < 0.92 ? inside : !inside) ? 1 : 0;
        pts.push({ x, y, label });
      }
    }

    function gini(d) { const n = d.length; if (!n) return 0; const p = d.reduce((s, q) => s + q.label, 0) / n; return 1 - p * p - (1 - p) * (1 - p); }
    function buildTree(data, dep) {
      const n = data.length, p1 = n ? data.reduce((s, q) => s + q.label, 0) / n : 0.5;
      if (dep <= 0 || n < 4 || p1 === 0 || p1 === 1) return { leaf: true, prob: p1 };
      let best = null;
      for (const feat of ['x', 'y']) {
        const vals = [...new Set(data.map(q => q[feat]))].sort((a, b) => a - b);
        for (let i = 0; i < vals.length - 1; i++) {
          const thr = (vals[i] + vals[i + 1]) / 2;
          const L = data.filter(q => q[feat] <= thr), R = data.filter(q => q[feat] > thr);
          if (!L.length || !R.length) continue;
          const g = (L.length * gini(L) + R.length * gini(R)) / n;
          if (!best || g < best.g) best = { g, feat, thr, L, R };
        }
      }
      if (!best) return { leaf: true, prob: p1 };
      return { leaf: false, feat: best.feat, thr: best.thr, left: buildTree(best.L, dep - 1), right: buildTree(best.R, dep - 1) };
    }
    function predictTree(t, x, y) { while (!t.leaf) { t = ((t.feat === 'x' ? x : y) <= t.thr) ? t.left : t.right; } return t.prob; }
    function buildForest(data, n, dep) { const ts = []; for (let t = 0; t < n; t++) { const s = []; for (let i = 0; i < data.length; i++) s.push(data[(Math.random() * data.length) | 0]); ts.push(buildTree(s, dep)); } return ts; }

    function rebuild() { modelCache = (mode === 'tree') ? buildTree(pts, depth) : buildForest(pts, nTrees, 6); }
    function prob(x, y) {
      if (!modelCache) return 0.5;
      if (mode === 'tree') return predictTree(modelCache, x, y);
      let s = 0; for (const t of modelCache) s += predictTree(t, x, y); return s / modelCache.length;
    }

    function draw() {
      layout(); ctx.clearRect(0, 0, W, H);
      const N = 44, cw = (W - 60) / N, ch = (H - 60) / N;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const d = toData(30 + i * cw + cw / 2, 30 + j * ch + ch / 2);
        const p = prob(d.x, d.y);
        ctx.fillStyle = p > 0.5 ? `rgba(251,113,133,${0.10 + (p - 0.5) * 0.5})` : `rgba(34,211,238,${0.10 + (0.5 - p) * 0.5})`;
        ctx.fillRect(30 + i * cw, 30 + j * ch, cw + 1, ch + 1);
      }
      for (const p of pts) { const a = toPx(p); ctx.beginPath(); ctx.arc(a.x, a.y, 4.5, 0, 6.28); ctx.fillStyle = CLS[p.label]; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = '#0b0b14'; ctx.stroke(); }
      let correct = 0; for (const p of pts) if ((prob(p.x, p.y) > 0.5 ? 1 : 0) === p.label) correct++;
      onUpdate && onUpdate({ acc: pts.length ? correct / pts.length : 0, mode, depth, nTrees });
    }
    function update() { rebuild(); draw(); }

    function pos(e) { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    canvas.addEventListener('pointerdown', e => {
      const pp = pos(e);
      for (let i = 0; i < pts.length; i++) { const a = toPx(pts[i]); if (Math.hypot(a.x - pp.x, a.y - pp.y) < 10) { pts.splice(i, 1); update(); return; } }
      const d = toData(pp.x, pp.y); if (d.x < 0 || d.x > 1 || d.y < 0 || d.y > 1) return;
      pts.push({ x: d.x, y: d.y, label: active }); update();
    });
    window.addEventListener('resize', draw);

    return {
      draw, update,
      setMode(m) { mode = m; update(); },
      setDepth(v) { depth = v; if (mode === 'tree') update(); },
      setTrees(v) { nTrees = v; if (mode === 'forest') update(); },
      setActive(c) { active = c; },
      clear() { pts = []; modelCache = null; draw(); },
      seed2() { seed(); update(); },
    };
  };
})();
