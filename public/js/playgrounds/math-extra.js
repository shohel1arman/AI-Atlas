/* ============================================================
   AI ATLAS — Additional Mathematics playgrounds
   Tensors · matrix operations · PCA · calculus · probability
   · information theory
   ============================================================ */
(function () {
  'use strict';

  const controllers = {};
  const $ = id => document.getElementById(id);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function crisp(canvas) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function wireSegment(id, onChange) {
    const root = $(id);
    root.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item.classList.contains('active'))));
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      root.querySelectorAll('button').forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      onChange(button.dataset.v);
    });
  }

  /* ---------- Tensors ---------- */
  (function tensorLab() {
    const canvas = $('tensor-canvas');
    let rank = 1, size = 3, slice = 1;
    const names = ['scalar', 'vector', 'matrix', 'volume'];

    function cell(ctx, x, y, side, value, active) {
      ctx.fillStyle = active ? 'rgba(52,211,153,.22)' : 'rgba(255,255,255,.055)';
      ctx.strokeStyle = active ? '#34D399' : 'rgba(255,255,255,.17)';
      ctx.lineWidth = active ? 2 : 1;
      ctx.beginPath(); ctx.roundRect(x, y, side, side, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = active ? '#D1FAE5' : '#B9B9CC';
      ctx.font = `${Math.max(10, Math.min(14, side * .28))}px JetBrains Mono`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(value), x + side / 2, y + side / 2);
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit;
      ctx.clearRect(0, 0, W, H);
      const count = Math.pow(size, rank);
      $('tensor-rank-m').textContent = rank;
      $('tensor-shape').textContent = rank ? `[${new Array(rank).fill(size).join(', ')}]` : '[]';
      $('tensor-count').textContent = count.toLocaleString();
      $('tensor-memory').textContent = count * 4 < 1024 ? `${count * 4} B` : `${(count * 4 / 1024).toFixed(1)} KB`;
      $('tensor-pill').textContent = `rank ${rank} · ${names[rank]}`;
      $('tensor-slice-wrap').style.display = rank === 3 ? '' : 'none';

      if (rank === 0) {
        const side = Math.min(120, W * .3); cell(ctx, (W - side) / 2, (H - side) / 2, side, 7, true); return;
      }
      const gap = 8;
      const maxGrid = rank === 1 ? Math.min(W * .8, 420) : Math.min(W * .62, H * .62);
      const side = clamp((maxGrid - gap * (size - 1)) / size, 28, 64);
      if (rank === 1) {
        const total = size * side + (size - 1) * gap, startX = (W - total) / 2;
        for (let col = 0; col < size; col++) cell(ctx, startX + col * (side + gap), (H - side) / 2, side, col + 1, true);
        return;
      }
      const layers = rank === 3 ? size : 1;
      const offset = rank === 3 ? Math.min(18, 55 / size) : 0;
      const gridW = size * side + (size - 1) * gap;
      const originX = (W - gridW - offset * (layers - 1)) / 2;
      const originY = (H - gridW + offset * (layers - 1)) / 2;
      for (let layer = layers - 1; layer >= 0; layer--) {
        const active = rank === 2 || layer === slice;
        for (let row = 0; row < size; row++) for (let col = 0; col < size; col++) {
          const value = layer * size * size + row * size + col + 1;
          cell(ctx, originX + col * (side + gap) + layer * offset, originY + row * (side + gap) - layer * offset, side, value, active);
        }
      }
    }

    wireSegment('tensor-rank', value => { rank = +value; slice = Math.min(slice, size - 1); draw(); });
    $('tensor-size').addEventListener('input', event => { size = +event.target.value; slice = Math.min(slice, size - 1); $('tensor-size-v').textContent = size; $('tensor-slice').max = size - 1; $('tensor-slice').value = slice; $('tensor-slice-v').textContent = slice; draw(); });
    $('tensor-slice').addEventListener('input', event => { slice = +event.target.value; $('tensor-slice-v').textContent = slice; draw(); });
    controllers.tensor = { draw };
  })();

  /* ---------- Matrix operations ---------- */
  (function matrixOperationsLab() {
    const host = $('matops-viz');
    let mode = 'mul';
    let A = [[2, 1], [-1, 3]], B = [[1, 2], [0, -1]];
    let selected = { matrix: 'A', row: 0, col: 0 }, output = { row: 0, col: 0 };

    const add = () => A.map((row, r) => row.map((value, c) => value + B[r][c]));
    const multiply = () => A.map(row => B[0].map((_, c) => row.reduce((sum, value, k) => sum + value * B[k][c], 0)));
    const transpose = () => A[0].map((_, c) => A.map(row => row[c]));
    const result = () => mode === 'add' ? add() : mode === 'transpose' ? transpose() : multiply();

    function matrixHTML(label, values, name, editable) {
      const cells = values.map((row, r) => row.map((value, c) => {
        const isInput = selected.matrix === name && selected.row === r && selected.col === c;
        const isOutput = name === 'R' && output.row === r && output.col === c;
        const explains = mode === 'mul' && ((name === 'A' && r === output.row) || (name === 'B' && c === output.col));
        return `<button type="button" class="matrix-cell${isInput || isOutput ? ' selected' : ''}${explains ? ' explains' : ''}" data-matrix="${name}" data-row="${r}" data-col="${c}" ${editable || name === 'R' ? '' : 'disabled'} aria-label="${label} row ${r + 1}, column ${c + 1}: ${value}">${value}</button>`;
      }).join('')).join('');
      return `<div class="matrix-block"><span class="matrix-label">${label}</span><div class="matrix-grid" style="--cols:${values[0].length}">${cells}</div></div>`;
    }

    function render() {
      const R = result();
      const operator = mode === 'add' ? '+' : mode === 'transpose' ? '→' : '×';
      host.innerHTML = matrixHTML('A', A, 'A', true) + `<span class="matrix-operator">${operator}</span>` + (mode === 'transpose' ? '' : matrixHTML('B', B, 'B', true) + '<span class="matrix-operator">=</span>') + matrixHTML(mode === 'transpose' ? 'Aᵀ' : 'Result', R, 'R', false);
      $('matops-op').textContent = mode === 'add' ? 'A + B' : mode === 'transpose' ? 'Aᵀ' : 'A × B';
      $('matops-shape').textContent = `${R.length} × ${R[0].length}`;
      const source = selected.matrix === 'B' ? B : A;
      $('matops-value').value = source[selected.row][selected.col];
      $('matops-value-v').textContent = source[selected.row][selected.col];
      $('matops-note').textContent = mode === 'mul' ? 'Select a result cell to highlight the row and column used to compute it. Select an input cell to edit its value.' : mode === 'add' ? 'Addition combines matching positions, so A and B must have the same shape.' : 'Transpose swaps rows with columns: output position (i, j) comes from input position (j, i).';
    }

    host.addEventListener('click', event => {
      const button = event.target.closest('.matrix-cell'); if (!button) return;
      const target = { matrix: button.dataset.matrix, row: +button.dataset.row, col: +button.dataset.col };
      if (target.matrix === 'R') output = target;
      else selected = target;
      render();
    });
    wireSegment('matops-mode', value => { mode = value; output = { row: 0, col: 0 }; render(); });
    $('matops-value').addEventListener('input', event => { const source = selected.matrix === 'B' ? B : A; source[selected.row][selected.col] = +event.target.value; $('matops-value-v').textContent = event.target.value; render(); });
    $('matops-random').addEventListener('click', () => { const randomMatrix = () => Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => Math.floor(Math.random() * 7) - 3)); A = randomMatrix(); B = randomMatrix(); render(); });
    controllers.matops = { draw: render };
  })();

  /* ---------- Eigenvalues & PCA ---------- */
  (function pcaLab() {
    const canvas = $('pca-canvas');
    let angle = 25, spread = .30;
    const base = Array.from({ length: 48 }, (_, index) => {
      const t = -1 + 2 * index / 47;
      return { t, noise: Math.sin(index * 5.17) * .72 + Math.cos(index * 2.31) * .28 };
    });

    function points() {
      const dataAngle = 32 * Math.PI / 180, ca = Math.cos(dataAngle), sa = Math.sin(dataAngle);
      return base.map(point => ({ x: point.t * ca - point.noise * spread * sa, y: point.t * sa + point.noise * spread * ca }));
    }

    function pca(values) {
      const mx = values.reduce((s, p) => s + p.x, 0) / values.length, my = values.reduce((s, p) => s + p.y, 0) / values.length;
      let xx = 0, yy = 0, xy = 0;
      values.forEach(point => { const x = point.x - mx, y = point.y - my; xx += x * x; yy += y * y; xy += x * y; });
      xx /= values.length; yy /= values.length; xy /= values.length;
      let best = .5 * Math.atan2(2 * xy, xx - yy) * 180 / Math.PI; if (best < 0) best += 180;
      return { best, total: xx + yy };
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, data = points(), summary = pca(data);
      const scale = Math.min(W, H) * .34, cx = W / 2, cy = H / 2;
      const rad = angle * Math.PI / 180, ux = Math.cos(rad), uy = Math.sin(rad);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(30,27,75,.10)'; ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(0, cy + i * 34); ctx.lineTo(W, cy + i * 34); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + i * 34, 0); ctx.lineTo(cx + i * 34, H); ctx.stroke(); }
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx - ux * scale * 1.35, cy + uy * scale * 1.35); ctx.lineTo(cx + ux * scale * 1.35, cy - uy * scale * 1.35); ctx.stroke();
      let projectedVariance = 0;
      data.forEach(point => {
        const projection = point.x * ux + point.y * uy; projectedVariance += projection * projection;
        const px = cx + point.x * scale, py = cy - point.y * scale;
        const qx = cx + projection * ux * scale, qy = cy - projection * uy * scale;
        ctx.strokeStyle = 'rgba(52,211,153,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
        ctx.fillStyle = '#6366F1'; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#34D399'; ctx.beginPath(); ctx.arc(qx, qy, 2.4, 0, Math.PI * 2); ctx.fill();
      });
      projectedVariance /= data.length;
      $('pca-var').textContent = projectedVariance.toFixed(3);
      $('pca-kept').textContent = `${Math.round(projectedVariance / summary.total * 100)}%`;
      $('pca-best').textContent = `${summary.best.toFixed(0)}°`;
      $('pca-points').textContent = data.length;
    }

    $('pca-angle').addEventListener('input', event => { angle = +event.target.value; $('pca-angle-v').textContent = `${angle}°`; draw(); });
    $('pca-spread').addEventListener('input', event => { spread = +event.target.value; $('pca-spread-v').textContent = spread.toFixed(2); draw(); });
    $('pca-fit').addEventListener('click', () => { angle = Math.round(pca(points()).best); $('pca-angle').value = angle; $('pca-angle-v').textContent = `${angle}°`; draw(); });
    controllers.eigen = { draw };
  })();

  /* ---------- Calculus ---------- */
  (function calculusLab() {
    const canvas = $('calc-canvas');
    let fn = 'quad', x = 1, h = .5;
    const functions = {
      quad: { f: value => value * value, d: value => 2 * value, range: [-1, 9], label: 'f(x) = x²' },
      sin: { f: value => Math.sin(value), d: value => Math.cos(value), range: [-1.5, 1.5], label: 'f(x) = sin(x)' },
      sigmoid: { f: value => 1 / (1 + Math.exp(-value)), d: value => { const y = 1 / (1 + Math.exp(-value)); return y * (1 - y); }, range: [-.15, 1.15], label: 'f(x) = σ(x)' },
    };

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, F = functions[fn], [minY, maxY] = F.range;
      const pad = 42, toX = value => pad + (value + 3) / 6 * (W - pad * 2), toY = value => H - pad - (value - minY) / (maxY - minY) * (H - pad * 2);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(30,27,75,.18)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, toY(0)); ctx.lineTo(W - pad, toY(0)); ctx.moveTo(toX(0), pad); ctx.lineTo(toX(0), H - pad); ctx.stroke();
      ctx.strokeStyle = '#6366F1'; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 240; i++) { const value = -3 + i / 240 * 6, px = toX(value), py = toY(F.f(value)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      const y = F.f(x), y2 = F.f(x + h), derivative = F.d(x), secant = (y2 - y) / h;
      const drawLine = (slope, color, width, span) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); const ax = x - span, bx = x + span; ctx.moveTo(toX(ax), toY(y + slope * (ax - x))); ctx.lineTo(toX(bx), toY(y + slope * (bx - x))); ctx.stroke(); };
      drawLine(derivative, '#34D399', 2.3, 1.25); drawLine(secant, '#F59E0B', 1.6, Math.max(.7, h));
      [[x, y, '#34D399'], [x + h, y2, '#F59E0B']].forEach(([px, py, color]) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(toX(px), toY(py), 6, 0, Math.PI * 2); ctx.fill(); });
      $('calc-pill').textContent = `${F.label} · tangent = local slope`;
      $('calc-y').textContent = y.toFixed(3); $('calc-d').textContent = derivative.toFixed(3); $('calc-sec').textContent = secant.toFixed(3); $('calc-error').textContent = Math.abs(secant - derivative).toFixed(3);
    }

    wireSegment('calc-fn', value => { fn = value; draw(); });
    $('calc-x').addEventListener('input', event => { x = +event.target.value; $('calc-x-v').textContent = x.toFixed(2); draw(); });
    $('calc-h').addEventListener('input', event => { h = +event.target.value; $('calc-h-v').textContent = h.toFixed(2); draw(); });
    controllers.calc = { draw };
  })();

  /* ---------- Probability ---------- */
  (function probabilityLab() {
    const canvas = $('prob-canvas');
    let probability = .5, trials = 50, outcomes = [], timer = 0, running = false;

    function stop() { running = false; if (timer) clearTimeout(timer); timer = 0; $('prob-run').textContent = 'Run simulation'; }
    function metrics() {
      const heads = outcomes.filter(Boolean).length;
      $('prob-heads').textContent = heads; $('prob-done').textContent = outcomes.length;
      $('prob-rate').textContent = outcomes.length ? `${(heads / outcomes.length).toFixed(2)}` : '—';
      $('prob-exp').textContent = (trials * probability).toFixed(1);
    }
    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, cols = 10, rows = Math.ceil(trials / cols), gap = 6;
      const side = Math.min(30, (W - 80 - gap * (cols - 1)) / cols, (H - 110 - gap * Math.max(0, rows - 1)) / Math.max(1, rows));
      const gridW = cols * side + (cols - 1) * gap, startX = (W - gridW) / 2, startY = 62;
      ctx.clearRect(0, 0, W, H); ctx.font = '12px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillStyle = '#6B7280'; ctx.fillText('cyan = heads · indigo = tails', W / 2, 32);
      for (let i = 0; i < trials; i++) { const row = Math.floor(i / cols), col = i % cols, x = startX + col * (side + gap), y = startY + row * (side + gap); ctx.fillStyle = i < outcomes.length ? (outcomes[i] ? '#22D3EE' : '#6366F1') : 'rgba(30,27,75,.08)'; ctx.beginPath(); ctx.roundRect(x, y, side, side, 5); ctx.fill(); }
      metrics();
    }
    function tick() {
      timer = 0; if (!running) return;
      for (let i = 0; i < 4 && outcomes.length < trials; i++) outcomes.push(Math.random() < probability);
      draw();
      if (outcomes.length >= trials) { stop(); return; }
      timer = window.setTimeout(tick, 55);
    }
    $('prob-run').addEventListener('click', () => { if (running) { stop(); return; } outcomes = []; running = true; $('prob-run').textContent = 'Pause simulation'; tick(); });
    $('prob-reset').addEventListener('click', () => { stop(); outcomes = []; draw(); });
    $('prob-p').addEventListener('input', event => { stop(); probability = +event.target.value; outcomes = []; $('prob-p-v').textContent = probability.toFixed(2); draw(); });
    $('prob-n').addEventListener('input', event => { stop(); trials = +event.target.value; outcomes = []; $('prob-n-v').textContent = trials; draw(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    controllers.prob = { draw, stop };
  })();

  /* ---------- Information theory ---------- */
  (function informationLab() {
    const canvas = $('info-canvas');
    let p = .75, q = .55;
    const log2 = value => Math.log(value) / Math.log(2);
    const entropy = value => -value * log2(value) - (1 - value) * log2(1 - value);
    const crossEntropy = (target, prediction) => -target * log2(prediction) - (1 - target) * log2(1 - prediction);

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, values = [p, 1 - p, q, 1 - q], labels = ['P(A)', 'P(B)', 'Q(A)', 'Q(B)'];
      const pad = 54, gap = 22, barW = Math.min(68, (W - pad * 2 - gap * 3) / 4), baseY = H - 70, maxH = H - 140;
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.15)'; ctx.beginPath(); ctx.moveTo(pad - 12, baseY); ctx.lineTo(W - pad + 12, baseY); ctx.stroke();
      values.forEach((value, index) => { const x = pad + index * (barW + gap), height = value * maxH; ctx.fillStyle = index < 2 ? '#34D399' : '#6366F1'; ctx.fillRect(x, baseY - height, barW, height); ctx.fillStyle = '#46437A'; ctx.textAlign = 'center'; ctx.font = '12px JetBrains Mono'; ctx.fillText(value.toFixed(2), x + barW / 2, baseY - height - 10); ctx.fillText(labels[index], x + barW / 2, baseY + 23); });
      const h = entropy(p), ce = crossEntropy(p, q), kl = ce - h;
      $('info-h').textContent = `${h.toFixed(3)} b`; $('info-ce').textContent = `${ce.toFixed(3)} b`; $('info-kl').textContent = `${kl.toFixed(3)} b`; $('info-match').textContent = `${Math.round((1 - Math.abs(p - q)) * 100)}%`;
    }
    $('info-p').addEventListener('input', event => { p = +event.target.value; $('info-p-v').textContent = p.toFixed(2); draw(); });
    $('info-q').addEventListener('input', event => { q = +event.target.value; $('info-q-v').textContent = q.toFixed(2); draw(); });
    controllers.info = { draw };
  })();

  window.MathExtra = {
    redraw(id) {
      if (id !== 'prob') controllers.prob.stop();
      if (controllers[id]) requestAnimationFrame(() => controllers[id].draw());
    },
  };
  window.addEventListener('resize', () => {
    const active = document.querySelector('#tabs .tab.active')?.dataset.tab;
    if (active && controllers[active]) controllers[active].draw();
  });
})();
