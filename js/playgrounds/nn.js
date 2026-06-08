/* ============================================================
   AI ATLAS — Neural Network Playground engine (vanilla)
   A real, trainable MLP on 2D datasets — TF-Playground style.
   ============================================================ */
(function () {
  'use strict';

  // ---------- datasets ----------
  function gen(type, n = 220, noise = 0.18) {
    const pts = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < n; i++) {
      let x, y, label;
      if (type === 'circle') {
        const r = i < n / 2 ? rnd(0, 0.45) : rnd(0.62, 1.0);
        const a = rnd(0, 6.283);
        x = r * Math.cos(a); y = r * Math.sin(a);
        label = i < n / 2 ? 1 : -1;
      } else if (type === 'xor') {
        x = rnd(-1, 1); y = rnd(-1, 1);
        label = (x * y > 0) ? 1 : -1;
        x += rnd(-noise, noise) * 0.5; y += rnd(-noise, noise) * 0.5;
      } else if (type === 'spiral') {
        const k = i % 2; const r = (i / n) * 1.0; const t = 1.75 * i / n * 6.283 + k * 3.14159;
        x = r * Math.cos(t); y = r * Math.sin(t);
        label = k === 0 ? 1 : -1;
      } else { // gauss
        const k = i % 2;
        x = rnd(-0.6, 0.6) + (k ? 0.45 : -0.45); y = rnd(-0.6, 0.6) + (k ? 0.45 : -0.45);
        label = k ? 1 : -1;
      }
      x += rnd(-noise, noise); y += rnd(-noise, noise);
      pts.push({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)), label });
    }
    return pts;
  }

  // ---------- tiny MLP ----------
  function makeNet(shape, act) {
    // shape e.g. [2, 4, 3, 1]
    const W = [], B = [];
    for (let l = 1; l < shape.length; l++) {
      const rows = shape[l], cols = shape[l - 1];
      const w = [], b = [];
      const scale = Math.sqrt(2 / cols);
      for (let i = 0; i < rows; i++) {
        const r = [];
        for (let j = 0; j < cols; j++) r.push((Math.random() * 2 - 1) * scale);
        w.push(r); b.push(0);
      }
      W.push(w); B.push(b);
    }
    return { shape, W, B, act };
  }
  const fns = {
    tanh: { f: x => Math.tanh(x), d: y => 1 - y * y },
    relu: { f: x => Math.max(0, x), d: y => y > 0 ? 1 : 0 },
    sigmoid: { f: x => 1 / (1 + Math.exp(-x)), d: y => y * (1 - y) },
  };
  function forward(net, input) {
    const acts = [input.slice()];
    const A = fns[net.act];
    for (let l = 0; l < net.W.length; l++) {
      const prev = acts[l], out = [];
      const isLast = l === net.W.length - 1;
      for (let i = 0; i < net.W[l].length; i++) {
        let s = net.B[l][i];
        for (let j = 0; j < prev.length; j++) s += net.W[l][i][j] * prev[j];
        out.push(isLast ? Math.tanh(s) : A.f(s));
      }
      acts.push(out);
    }
    return acts;
  }
  function trainStep(net, data, lr) {
    const A = fns[net.act];
    let loss = 0;
    // accumulate grads
    const gW = net.W.map(layer => layer.map(row => row.map(() => 0)));
    const gB = net.B.map(layer => layer.map(() => 0));
    for (const p of data) {
      const acts = forward(net, [p.x, p.y]);
      const L = net.W.length;
      const out = acts[L][0];
      const err = out - p.label;
      loss += 0.5 * err * err;
      // deltas
      let delta = [err * (1 - out * out)]; // tanh out deriv
      for (let l = L - 1; l >= 0; l--) {
        const prev = acts[l];
        for (let i = 0; i < net.W[l].length; i++) {
          for (let j = 0; j < prev.length; j++) gW[l][i][j] += delta[i] * prev[j];
          gB[l][i] += delta[i];
        }
        if (l > 0) {
          const newDelta = new Array(prev.length).fill(0);
          for (let j = 0; j < prev.length; j++) {
            let s = 0;
            for (let i = 0; i < net.W[l].length; i++) s += net.W[l][i][j] * delta[i];
            newDelta[j] = s * A.d(prev[j]);
          }
          delta = newDelta;
        }
      }
    }
    const m = data.length;
    for (let l = 0; l < net.W.length; l++)
      for (let i = 0; i < net.W[l].length; i++) {
        for (let j = 0; j < net.W[l][i].length; j++) net.W[l][i][j] -= lr * gW[l][i][j] / m;
        net.B[l][i] -= lr * gB[l][i] / m;
      }
    return loss / m;
  }

  // ---------- Playground controller ----------
  window.NNPlayground = function (opts) {
    const stage = opts.stage;        // canvas for decision boundary
    const netCanvas = opts.netCanvas; // canvas for network diagram
    const onMetrics = opts.onMetrics || (() => {});
    let dctx = stage.getContext('2d');
    let nctx = netCanvas.getContext('2d');

    let state = {
      dataset: 'circle', hidden: [4, 4], act: 'tanh', lr: 0.08, noise: 0.18,
      running: false, epoch: 0, loss: 1, data: [], net: null, lossHist: [],
    };

    function rebuild() {
      state.data = gen(state.dataset, 240, state.noise);
      state.net = makeNet([2, ...state.hidden, 1], state.act);
      state.epoch = 0; state.loss = 1; state.lossHist = [];
      drawAll();
    }

    // crisp canvas sizing
    function fit(canvas, ctx) {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR; canvas.height = r.height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      return r;
    }

    function drawBoundary() {
      const r = fit(stage, dctx);
      const W = r.width, H = r.height;
      const res = 28, cw = W / res, ch = H / res;
      for (let i = 0; i < res; i++) for (let j = 0; j < res; j++) {
        const x = (i / (res - 1)) * 2 - 1, y = (j / (res - 1)) * 2 - 1;
        const o = forward(state.net, [x, y]).slice(-1)[0][0];
        const t = (o + 1) / 2; // 0..1
        // blue (neg) -> indigo bg -> orange (pos)
        const pos = [245, 158, 11], neg = [34, 211, 238];
        const cr = Math.round(neg[0] + (pos[0] - neg[0]) * t);
        const cg = Math.round(neg[1] + (pos[1] - neg[1]) * t);
        const cb = Math.round(neg[2] + (pos[2] - neg[2]) * t);
        const alpha = 0.10 + Math.abs(o) * 0.16;
        dctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        dctx.fillRect(i * cw, (res - 1 - j) * ch, cw + 1, ch + 1);
      }
      // points
      for (const p of state.data) {
        const px = (p.x + 1) / 2 * W, py = (1 - (p.y + 1) / 2) * H;
        dctx.beginPath(); dctx.arc(px, py, 4.2, 0, 6.28);
        dctx.fillStyle = p.label > 0 ? '#F59E0B' : '#22D3EE';
        dctx.fill();
        dctx.lineWidth = 1; dctx.strokeStyle = 'rgba(0,0,0,0.4)'; dctx.stroke();
      }
    }

    function drawNet() {
      const r = fit(netCanvas, nctx);
      const W = r.width, H = r.height;
      nctx.clearRect(0, 0, W, H);
      const layers = state.net.shape;
      const padX = 36, usableW = W - padX * 2;
      const sample = forward(state.net, [0.4, 0.4]); // for activation glow
      const pos = [];
      layers.forEach((count, li) => {
        const x = padX + (usableW * li) / (layers.length - 1);
        const col = [];
        for (let i = 0; i < count; i++) {
          const y = H * 0.5 + (i - (count - 1) / 2) * Math.min(46, (H * 0.78) / count);
          col.push({ x, y });
        }
        pos.push(col);
      });
      // edges
      for (let l = 0; l < state.net.W.length; l++) {
        for (let i = 0; i < state.net.W[l].length; i++) {
          for (let j = 0; j < state.net.W[l][i].length; j++) {
            const w = state.net.W[l][i][j];
            const a = pos[l][j], b = pos[l + 1][i];
            nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(b.x, b.y);
            nctx.strokeStyle = w > 0 ? `rgba(245,158,11,${Math.min(0.6, Math.abs(w) * 0.5)})` : `rgba(34,211,238,${Math.min(0.6, Math.abs(w) * 0.5)})`;
            nctx.lineWidth = Math.min(3, 0.4 + Math.abs(w) * 1.4);
            nctx.stroke();
          }
        }
      }
      // nodes
      pos.forEach((col, li) => {
        col.forEach((nd, i) => {
          const aVal = sample[li] ? Math.abs(sample[li][i] || 0) : 0.5;
          const g = nctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, 16);
          g.addColorStop(0, `rgba(139,140,246,${0.25 + aVal * 0.5})`); g.addColorStop(1, 'transparent');
          nctx.fillStyle = g; nctx.beginPath(); nctx.arc(nd.x, nd.y, 16, 0, 6.28); nctx.fill();
          nctx.beginPath(); nctx.arc(nd.x, nd.y, 7, 0, 6.28);
          nctx.fillStyle = li === 0 ? '#22D3EE' : (li === pos.length - 1 ? '#34D399' : '#8B8CF6');
          nctx.fill();
          nctx.lineWidth = 1.5; nctx.strokeStyle = 'rgba(255,255,255,0.25)'; nctx.stroke();
        });
      });
    }

    function drawAll() { drawBoundary(); drawNet(); }

    let raf;
    function loop() {
      if (!state.running) return;
      for (let k = 0; k < 3; k++) { state.loss = trainStep(state.net, state.data, state.lr); state.epoch++; }
      state.lossHist.push(state.loss); if (state.lossHist.length > 200) state.lossHist.shift();
      drawAll();
      // accuracy
      let correct = 0;
      for (const p of state.data) { const o = forward(state.net, [p.x, p.y]).slice(-1)[0][0]; if ((o > 0 ? 1 : -1) === p.label) correct++; }
      onMetrics({ epoch: state.epoch, loss: state.loss, acc: correct / state.data.length, lossHist: state.lossHist });
      raf = requestAnimationFrame(loop);
    }

    return {
      state,
      set(k, v) { state[k] = v; if (['dataset', 'hidden', 'act', 'noise'].includes(k)) rebuild(); },
      play() { if (!state.running) { state.running = true; loop(); } },
      pause() { state.running = false; cancelAnimationFrame(raf); },
      toggle() { state.running ? this.pause() : this.play(); return state.running; },
      reset() { this.pause(); rebuild(); onMetrics({ epoch: 0, loss: 1, acc: 0, lossHist: [] }); },
      step() { state.loss = trainStep(state.net, state.data, state.lr); state.epoch++; state.lossHist.push(state.loss); drawAll(); let c = 0; for (const p of state.data) { const o = forward(state.net, [p.x, p.y]).slice(-1)[0][0]; if ((o > 0 ? 1 : -1) === p.label) c++; } onMetrics({ epoch: state.epoch, loss: state.loss, acc: c / state.data.length, lossHist: state.lossHist }); },
      redraw: drawAll,
      init() { rebuild(); },
    };
  };
})();
