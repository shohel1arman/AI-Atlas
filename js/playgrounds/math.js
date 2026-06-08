/* ============================================================
   AI ATLAS — Mathematics playgrounds
   VectorLab (draggable vectors) + GradientLab (descent on contours)
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

  /* ---------------- Vector Lab ---------------- */
  window.VectorLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, scale;
    // vectors in math coords
    let u = { x: 2, y: 1 }, v = { x: -1, y: 2 };
    let drag = null;
    let showSum = true;

    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; cx = W / 2; cy = H / 2; scale = Math.min(W, H) / 8; }
    const toPx = p => ({ x: cx + p.x * scale, y: cy - p.y * scale });
    const toMath = (px, py) => ({ x: (px - cx) / scale, y: (cy - py) / scale });

    function arrow(from, to, color, width = 2.5) {
      const a = toPx(from), b = toPx(to);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      const ang = Math.atan2(b.y - a.y, b.x - a.x), s = 11;
      ctx.beginPath(); ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - s * Math.cos(ang - 0.4), b.y - s * Math.sin(ang - 0.4));
      ctx.lineTo(b.x - s * Math.cos(ang + 0.4), b.y - s * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    }
    function handle(p, color) { const a = toPx(p); ctx.beginPath(); ctx.arc(a.x, a.y, 7, 0, 6.28); ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); }

    function draw() {
      layout();
      ctx.clearRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) {
        const px = cx + i * scale, py = cy - i * scale;
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

      if (showSum) {
        const sum = { x: u.x + v.x, y: u.y + v.y };
        // parallelogram
        ctx.setLineDash([5, 4]); ctx.strokeStyle = 'rgba(139,140,246,0.4)';
        arrow(u, sum, 'rgba(139,140,246,0.35)', 1.5);
        arrow(v, sum, 'rgba(34,211,238,0.35)', 1.5);
        ctx.setLineDash([]);
        arrow({ x: 0, y: 0 }, sum, '#A855F7', 3);
      }
      arrow({ x: 0, y: 0 }, u, '#8B8CF6');
      arrow({ x: 0, y: 0 }, v, '#22D3EE');
      handle(u, '#8B8CF6'); handle(v, '#22D3EE');

      // metrics
      const dot = u.x * v.x + u.y * v.y;
      const mu = Math.hypot(u.x, u.y), mv = Math.hypot(v.x, v.y);
      const ang = Math.acos(Math.max(-1, Math.min(1, dot / (mu * mv || 1)))) * 180 / Math.PI;
      onUpdate && onUpdate({ u, v, dot, mu, mv, ang, sum: { x: u.x + v.x, y: u.y + v.y } });
    }

    function hit(px, py) {
      for (const [vec, name] of [[u, 'u'], [v, 'v']]) { const a = toPx(vec); if (Math.hypot(a.x - px, a.y - py) < 16) return name; }
      return null;
    }
    function pos(e) { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    canvas.addEventListener('pointerdown', e => { const p = pos(e); drag = hit(p.x, p.y); if (drag) canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      const p = pos(e);
      canvas.style.cursor = hit(p.x, p.y) ? 'grab' : 'default';
      if (!drag) return;
      const m = toMath(p.x, p.y);
      const snapped = { x: Math.round(m.x * 2) / 2, y: Math.round(m.y * 2) / 2 };
      if (drag === 'u') u = snapped; else v = snapped;
      draw();
    });
    window.addEventListener('pointerup', () => drag = null);
    window.addEventListener('resize', draw);

    return { draw, toggleSum(s) { showSum = s; draw(); }, set(name, x, y) { if (name === 'u') u = { x, y }; else v = { x, y }; draw(); } };
  };

  /* ---------------- Gradient Descent Lab ---------------- */
  window.GradientLab = function (canvas, onUpdate) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let surf = 'bowl';
    let lr = 0.08, momentum = 0.0;
    let ball = { x: -2.2, y: 1.8 }, vel = { x: 0, y: 0 };
    let path = [], running = false, raf, steps = 0;
    let drag = false;

    // surfaces f(x,y) and gradient
    const surfaces = {
      bowl: { f: (x, y) => 0.18 * (x * x + y * y), g: (x, y) => [0.36 * x, 0.36 * y] },
      saddle: { f: (x, y) => 0.12 * (x * x - y * y) + 1.2, g: (x, y) => [0.24 * x, -0.24 * y] },
      ravine: { f: (x, y) => 0.04 * x * x + 0.5 * y * y, g: (x, y) => [0.08 * x, 1.0 * y] },
      bumpy: { f: (x, y) => 0.1 * (x * x + y * y) + Math.sin(x * 1.5) * 0.4 + Math.cos(y * 1.5) * 0.4 + 0.8, g: (x, y) => [0.2 * x + 0.6 * Math.cos(x * 1.5), 0.2 * y - 0.6 * Math.sin(y * 1.5)] },
    };
    const RANGE = 3.2;
    function layout() { const r = crisp(canvas, ctx); W = r.width; H = r.height; }
    const toPx = (x, y) => ({ x: (x / RANGE / 2 + 0.5) * W, y: (0.5 - y / RANGE / 2) * H });
    const toMath = (px, py) => ({ x: (px / W - 0.5) * 2 * RANGE, y: (0.5 - py / H) * 2 * RANGE });

    function draw() {
      layout();
      const f = surfaces[surf].f;
      // contour heatmap
      let min = Infinity, max = -Infinity;
      const res = 60, vals = [];
      for (let i = 0; i < res; i++) { vals[i] = []; for (let j = 0; j < res; j++) { const x = (i / (res - 1) - 0.5) * 2 * RANGE, y = (0.5 - j / (res - 1)) * 2 * RANGE; const v = f(x, y); vals[i][j] = v; if (v < min) min = v; if (v > max) max = v; } }
      const cw = W / res, ch = H / res;
      for (let i = 0; i < res; i++) for (let j = 0; j < res; j++) {
        const t = (vals[i][j] - min) / (max - min || 1);
        const r = Math.round(20 + t * 60), g = Math.round(20 + (1 - t) * 90), b = Math.round(50 + (1 - t) * 160);
        ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fillRect(i * cw, j * ch, cw + 1, ch + 1);
      }
      // contour lines
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
      for (let lv = 0; lv < 8; lv++) { const target = min + (max - min) * lv / 8; ctx.beginPath(); for (let i = 0; i < res; i++) for (let j = 0; j < res; j++) { if (Math.abs(vals[i][j] - target) < (max - min) / 60) ctx.rect(i * cw, j * ch, 1.5, 1.5); } ctx.stroke(); }
      // path
      if (path.length > 1) { ctx.beginPath(); path.forEach((p, i) => { const a = toPx(p.x, p.y); i ? ctx.lineTo(a.x, a.y) : ctx.moveTo(a.x, a.y); }); ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2; ctx.stroke(); for (const p of path) { const a = toPx(p.x, p.y); ctx.beginPath(); ctx.arc(a.x, a.y, 2, 0, 6.28); ctx.fillStyle = 'rgba(52,211,153,0.5)'; ctx.fill(); } }
      // ball
      const b = toPx(ball.x, ball.y);
      const gl = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 16); gl.addColorStop(0, 'rgba(52,211,153,0.7)'); gl.addColorStop(1, 'transparent');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(b.x, b.y, 16, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(b.x, b.y, 7, 0, 6.28); ctx.fillStyle = '#34D399'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      onUpdate && onUpdate({ steps, loss: f(ball.x, ball.y), x: ball.x, y: ball.y });
    }

    function stepOnce() {
      const [gx, gy] = surfaces[surf].g(ball.x, ball.y);
      vel.x = momentum * vel.x - lr * gx; vel.y = momentum * vel.y - lr * gy;
      ball.x += vel.x; ball.y += vel.y;
      ball.x = Math.max(-RANGE, Math.min(RANGE, ball.x)); ball.y = Math.max(-RANGE, Math.min(RANGE, ball.y));
      path.push({ x: ball.x, y: ball.y }); if (path.length > 300) path.shift();
      steps++;
    }
    function loop() { if (!running) return; stepOnce(); draw(); raf = requestAnimationFrame(loop); }

    function pos(e) { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    canvas.addEventListener('pointerdown', e => { const p = pos(e); const b = toPx(ball.x, ball.y); if (Math.hypot(b.x - p.x, b.y - p.y) < 18 || true) { drag = true; const m = toMath(p.x, p.y); ball = m; vel = { x: 0, y: 0 }; path = [{ ...ball }]; steps = 0; draw(); } });
    canvas.addEventListener('pointermove', e => { if (!drag) return; const m = toMath(pos(e).x, pos(e).y); ball = { x: Math.max(-RANGE, Math.min(RANGE, m.x)), y: Math.max(-RANGE, Math.min(RANGE, m.y)) }; path = [{ ...ball }]; draw(); });
    window.addEventListener('pointerup', () => drag = false);
    window.addEventListener('resize', draw);

    return {
      draw,
      play() { if (!running) { running = true; loop(); } },
      pause() { running = false; cancelAnimationFrame(raf); },
      toggle() { running ? this.pause() : this.play(); return running; },
      reset() { this.pause(); ball = { x: -2.2, y: 1.8 }; vel = { x: 0, y: 0 }; path = [{ ...ball }]; steps = 0; draw(); },
      setSurf(s) { surf = s; this.reset(); },
      setLr(v) { lr = v; }, setMom(v) { momentum = v; },
    };
  };
})();
