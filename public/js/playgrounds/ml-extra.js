/* ============================================================
   AI ATLAS — Additional Machine Learning playgrounds
   Evaluation · regularization · feature engineering · anomalies
   ============================================================ */
(function () {
  'use strict';

  const controllers = {};
  const $ = id => document.getElementById(id);

  function crisp(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = canvas.getContext('2d');
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function wireSegment(id, onChange) {
    const root = $(id);
    root.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    root.addEventListener('click', event => {
      const button = event.target.closest('button'); if (!button) return;
      root.querySelectorAll('button').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
      onChange(button.dataset.v);
    });
  }

  /* ---------- Model evaluation ---------- */
  (function evaluationLab() {
    const canvas = $('eval-canvas');
    let complexity = 4, folds = 5, sample = 0;
    const trainScore = value => Math.min(.985, .74 + value * .025);
    const validationScore = value => Math.max(.48, .69 + value * .061 - value * value * .0068 + Math.sin(value * 2.1 + sample) * .007 / Math.sqrt(folds));

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, pad = 52, minScore = .45, maxScore = 1;
      const X = value => pad + (value - 1) / 9 * (W - pad * 2), Y = value => H - pad - (value - minScore) / (maxScore - minScore) * (H - pad * 2);
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.13)';
      for (let i = 0; i <= 5; i++) { const y = pad + i * (H - pad * 2) / 5; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
      function curve(fn, color) { ctx.beginPath(); for (let value = 1; value <= 10; value++) value === 1 ? ctx.moveTo(X(value), Y(fn(value))) : ctx.lineTo(X(value), Y(fn(value))); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke(); }
      curve(trainScore, '#6366F1'); curve(validationScore, '#22D3EE');
      const train = trainScore(complexity), valid = validationScore(complexity), x = X(complexity);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(30,27,75,.35)'; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke(); ctx.setLineDash([]);
      [['train', train, '#6366F1'], ['validation', valid, '#22D3EE']].forEach(([label, value, color]) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, Y(value), 5, 0, Math.PI * 2); ctx.fill(); ctx.font = '11px JetBrains Mono'; ctx.textAlign = 'left'; ctx.fillText(label, x + 9, Y(value) + 4); });
      ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText('low complexity', pad + 35, H - 20); ctx.fillText('high complexity', W - pad - 42, H - 20);
      const gap = train - valid, state = complexity <= 2 ? 'underfit' : complexity >= 7 ? 'overfit' : 'balanced';
      $('eval-train').textContent = train.toFixed(3); $('eval-valid').textContent = valid.toFixed(3); $('eval-gap').textContent = gap.toFixed(3); $('eval-state').textContent = state;
    }

    $('eval-complexity').addEventListener('input', event => { complexity = +event.target.value; $('eval-complexity-v').textContent = complexity; draw(); });
    $('eval-folds').addEventListener('input', event => { folds = +event.target.value; $('eval-folds-v').textContent = folds; draw(); });
    $('eval-resample').addEventListener('click', () => { sample++; draw(); });
    controllers.eval = { draw };
  })();

  /* ---------- Regularization ---------- */
  (function regularizationLab() {
    const canvas = $('regz-canvas');
    const base = [2.6, -2.1, 1.45, .82, -.46, .22];
    let mode = 'l2', lambda = .5;
    function weights() { return mode === 'l2' ? base.map(value => value / (1 + lambda * .55)) : base.map(value => Math.sign(value) * Math.max(0, Math.abs(value) - lambda * .62)); }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, values = weights(), center = H / 2, pad = 44, gap = (W - pad * 2) / values.length, barW = gap * .56, scale = (H * .34) / 2.8;
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.2)'; ctx.beginPath(); ctx.moveTo(pad, center); ctx.lineTo(W - pad, center); ctx.stroke();
      values.forEach((value, index) => { const x = pad + index * gap + (gap - barW) / 2, height = Math.abs(value) * scale, y = value >= 0 ? center - height : center; ctx.fillStyle = Math.abs(value) < .001 ? 'rgba(30,27,75,.1)' : value > 0 ? '#22D3EE' : '#FB7185'; ctx.beginPath(); ctx.roundRect(x, y, barW, Math.max(2, height), 5); ctx.fill(); ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText(`w${index + 1}`, x + barW / 2, H - 28); ctx.fillText(value.toFixed(2), x + barW / 2, value >= 0 ? y - 9 : y + height + 15); });
      const norm = mode === 'l2' ? Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) : values.reduce((sum, value) => sum + Math.abs(value), 0);
      const shrink = base.reduce((sum, value, index) => sum + (value - values[index]) ** 2, 0);
      $('regz-active').textContent = values.filter(value => Math.abs(value) > .001).length; $('regz-norm').textContent = norm.toFixed(2); $('regz-loss').textContent = (.18 + shrink * .035).toFixed(3); $('regz-penalty').textContent = (lambda * norm).toFixed(3);
    }

    wireSegment('regz-mode', value => { mode = value; draw(); });
    $('regz-lambda').addEventListener('input', event => { lambda = +event.target.value; $('regz-lambda-v').textContent = lambda.toFixed(2); draw(); });
    controllers.regz = { draw };
  })();

  /* ---------- Feature engineering ---------- */
  (function featureLab() {
    const canvas = $('feat-canvas');
    const ages = [22, 28, 34, 39, 45, 51, 58, 64], baseIncome = [34, 48, 57, 62, 74, 81, 96, 112];
    let mode = 'raw', outlier = 1;
    function transform(values) {
      if (mode === 'raw') return [...values];
      const min = Math.min(...values), max = Math.max(...values);
      if (mode === 'minmax') return values.map(value => (value - min) / (max - min || 1));
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length, sd = Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length) || 1;
      return values.map(value => (value - mean) / sd);
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, income = [...baseIncome]; income[income.length - 1] *= outlier;
      const ageValues = transform(ages), incomeValues = transform(income), all = [...ageValues, ...incomeValues];
      const absMax = Math.max(...all.map(Math.abs), 1), center = W / 2, padY = 50, rowGap = (H - padY * 2) / ages.length, scale = (W * .38) / absMax;
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.18)'; ctx.beginPath(); ctx.moveTo(center, padY - 20); ctx.lineTo(center, H - padY + 20); ctx.stroke();
      for (let index = 0; index < ages.length; index++) {
        const y = padY + index * rowGap, a = ageValues[index] * scale, b = incomeValues[index] * scale;
        ctx.fillStyle = '#6366F1'; ctx.fillRect(center + Math.min(0, a), y - 8, Math.abs(a), 6);
        ctx.fillStyle = '#22D3EE'; ctx.fillRect(center + Math.min(0, b), y + 3, Math.abs(b), 6);
        ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right'; ctx.fillText(`#${index + 1}`, center - W * .41, y + 5);
      }
      const ageRange = Math.max(...ageValues) - Math.min(...ageValues), incomeRange = Math.max(...incomeValues) - Math.min(...incomeValues), share = incomeRange ** 2 / (incomeRange ** 2 + ageRange ** 2 || 1);
      const format = value => mode === 'raw' ? value.toFixed(0) : value.toFixed(2);
      $('feat-age').textContent = format(ageRange); $('feat-income').textContent = format(incomeRange); $('feat-share').textContent = `${Math.round(share * 100)}% income`; $('feat-method').textContent = mode === 'standard' ? 'z-score' : mode;
    }

    wireSegment('feat-mode', value => { mode = value; draw(); });
    $('feat-outlier').addEventListener('input', event => { outlier = +event.target.value; $('feat-outlier-v').textContent = `${outlier.toFixed(2).replace(/\.00$/, '.0')}×`; draw(); });
    controllers.feat = { draw };
  })();

  /* ---------- Anomaly detection ---------- */
  (function anomalyLab() {
    const canvas = $('anom-canvas');
    let mode = 'distance', sensitivity = .7, seed = 1, points = [];
    function random(index, salt) { const value = Math.sin(index * 91.17 + seed * 13.1 + salt) * 43758.5453; return value - Math.floor(value); }
    function generate() {
      points = Array.from({ length: 50 }, (_, index) => {
        const angle = random(index, 2) * Math.PI * 2, radius = Math.sqrt(random(index, 7)) * .25;
        return { x: .5 + Math.cos(angle) * radius, y: .5 + Math.sin(angle) * radius, truth: false };
      });
      [[.08,.12],[.91,.18],[.14,.9],[.9,.86]].forEach(([x,y]) => points.push({ x, y, truth: true }));
    }
    function scores() {
      if (mode === 'distance') return points.map(point => Math.hypot(point.x - .5, point.y - .5));
      return points.map((point, index) => points.map((other, otherIndex) => otherIndex === index ? Infinity : Math.hypot(point.x - other.x, point.y - other.y)).sort((a, b) => a - b).slice(0, 5).reduce((sum, value) => sum + value, 0) / 5);
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, values = scores(), sorted = [...values].sort((a, b) => a - b), cutoffIndex = Math.max(0, Math.floor(sorted.length * (1 - sensitivity * .22))), cutoff = sorted[cutoffIndex];
      const flagged = values.map(value => value >= cutoff), pad = 42, X = x => pad + x * (W - pad * 2), Y = y => H - pad - y * (H - pad * 2);
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.13)';
      for (let i = 0; i <= 4; i++) { const x = pad + i * (W - pad * 2) / 4, y = pad + i * (H - pad * 2) / 4; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
      points.forEach((point, index) => { ctx.fillStyle = flagged[index] ? '#FB7185' : '#6366F1'; ctx.beginPath(); ctx.arc(X(point.x), Y(point.y), flagged[index] ? 6 : 4, 0, Math.PI * 2); ctx.fill(); if (flagged[index]) { ctx.strokeStyle = '#FB7185'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(point.x), Y(point.y), 9, 0, Math.PI * 2); ctx.stroke(); } });
      const flaggedCount = flagged.filter(Boolean).length, tp = points.filter((point, index) => point.truth && flagged[index]).length;
      $('anom-flagged').textContent = flaggedCount; $('anom-precision').textContent = flaggedCount ? (tp / flaggedCount).toFixed(2) : '—'; $('anom-recall').textContent = (tp / 4).toFixed(2);
    }

    wireSegment('anom-mode', value => { mode = value; draw(); });
    $('anom-threshold').addEventListener('input', event => { sensitivity = +event.target.value; $('anom-threshold-v').textContent = sensitivity.toFixed(2); draw(); });
    $('anom-new').addEventListener('click', () => { seed++; generate(); draw(); });
    generate();
    controllers.anom = { draw };
  })();

  window.MLExtra = { redraw(id) { if (controllers[id]) requestAnimationFrame(() => controllers[id].draw()); } };
  window.addEventListener('resize', () => { const active = document.querySelector('#tabs [role=tab][aria-selected=true]')?.dataset.tab; if (active && controllers[active]) controllers[active].draw(); });
})();
