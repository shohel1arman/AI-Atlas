/* ============================================================
   AI ATLAS — Additional Data Analysis playgrounds
   Cleaning · EDA · correlation · time series
   ============================================================ */
(function () {
  'use strict';

  const controllers = {};
  const $ = id => document.getElementById(id);

  function crisp(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext('2d');
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function wireSegment(id, onChange) {
    const root = $(id);
    root.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      root.querySelectorAll('button').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      onChange(button.dataset.v);
    });
  }

  function quantile(sorted, position) {
    const index = (sorted.length - 1) * position;
    const lower = Math.floor(index), fraction = index - lower;
    return sorted[lower + 1] === undefined ? sorted[lower] : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
  }

  /* ---------- Data cleaning ---------- */
  (function cleaningLab() {
    const original = [
      { id: 101, age: 28, region: 'North', spend: 420, issue: '' },
      { id: 102, age: null, region: 'East', spend: 310, issue: 'missing age' },
      { id: 103, age: 35, region: '', spend: 515, issue: 'missing region' },
      { id: 104, age: 42, region: 'West', spend: 4900, issue: 'spend outlier' },
      { id: 105, age: 31, region: 'South', spend: 280, issue: '' },
      { id: 105, age: 31, region: 'South', spend: 280, issue: 'duplicate' },
      { id: 106, age: 47, region: 'North', spend: 650, issue: '' },
      { id: 107, age: 26, region: 'East', spend: 190, issue: '' },
    ];
    let rows = original.map(row => ({ ...row }));
    let missing = 'median', outlier = 'cap', cleaned = false;

    function render() {
      $('clean-rows').innerHTML = rows.map(row => {
        const issue = cleaned ? row.action || 'valid' : row.issue || 'valid';
        return `<tr class="${issue === 'valid' ? '' : 'flag'}"><td>${row.id}</td><td class="${row.age == null ? 'bad' : ''}">${row.age == null ? '—' : row.age}</td><td class="${!row.region ? 'bad' : ''}">${row.region || '—'}</td><td>$${row.spend.toLocaleString()}</td><td class="${cleaned ? 'fixed' : issue === 'valid' ? '' : 'bad'}">${issue}</td></tr>`;
      }).join('');
      const issueCount = cleaned ? rows.filter(row => row.action && row.action !== 'valid').length : original.filter(row => row.issue).length;
      $('clean-count').textContent = rows.length;
      $('clean-issues').textContent = cleaned ? 0 : issueCount;
      $('clean-missing-m').textContent = cleaned ? 0 : 2;
      $('clean-dupes').textContent = cleaned ? 0 : 1;
      $('clean-status').textContent = cleaned ? 'cleaned data' : 'raw data';
    }

    function clean() {
      const seen = new Set();
      rows = original.filter(row => { if (seen.has(row.id)) return false; seen.add(row.id); return true; }).map(row => ({ ...row }));
      const ages = rows.map(row => row.age).filter(Number.isFinite).sort((a, b) => a - b);
      const medianAge = quantile(ages, .5);
      if (missing === 'drop') rows = rows.filter(row => row.age != null && row.region);
      else rows = rows.map(row => ({ ...row, age: row.age == null ? medianAge : row.age, region: row.region || 'Unknown' }));
      rows = rows.map(row => {
        let action = row.issue || 'valid', spend = row.spend;
        if (row.issue === 'duplicate') action = 'removed duplicate';
        if (row.age === medianAge && row.id === 102) action = 'filled age median';
        if (row.region === 'Unknown') action = 'filled Unknown';
        if (row.issue === 'spend outlier' && outlier === 'cap') { spend = 1200; action = 'capped at $1,200'; }
        if (row.issue === 'spend outlier' && outlier === 'keep') action = 'outlier retained';
        return { ...row, spend, action };
      });
      cleaned = true;
      render();
    }

    wireSegment('clean-missing', value => { missing = value; });
    wireSegment('clean-outlier', value => { outlier = value; });
    $('clean-run').addEventListener('click', clean);
    $('clean-reset').addEventListener('click', () => { rows = original.map(row => ({ ...row })); cleaned = false; render(); });
    controllers.clean = { draw: render };
  })();

  /* ---------- Exploratory data analysis ---------- */
  (function edaLab() {
    const canvas = $('eda-canvas');
    let metric = 'revenue', category = 'all';

    function values() {
      return SAMPLE_DATA.filter(row => category === 'all' || row.category === category).map(row => row[metric]).sort((a, b) => a - b);
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, data = values();
      const min = data[0], max = data[data.length - 1], mean = data.reduce((sum, value) => sum + value, 0) / data.length, median = quantile(data, .5);
      const q1 = quantile(data, .25), q3 = quantile(data, .75), iqr = q3 - q1;
      const outliers = data.filter(value => value < q1 - 1.5 * iqr || value > q3 + 1.5 * iqr).length;
      const bins = 10, counts = new Array(bins).fill(0), span = Math.max(1, max - min);
      data.forEach(value => counts[Math.min(bins - 1, Math.floor((value - min) / span * bins))]++);
      const peak = Math.max(...counts, 1), pad = 42, base = H - 54, gap = 7, barW = (W - pad * 2 - gap * (bins - 1)) / bins;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(30,27,75,.16)'; ctx.beginPath(); ctx.moveTo(pad, base); ctx.lineTo(W - pad, base); ctx.stroke();
      counts.forEach((count, index) => {
        const height = count / peak * (H - 130), x = pad + index * (barW + gap), y = base - height;
        ctx.fillStyle = index > 7 ? '#22D3EE' : '#6366F1'; ctx.beginPath(); ctx.roundRect(x, y, barW, height, 5); ctx.fill();
        ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'center'; ctx.fillText(count, x + barW / 2, y - 8);
      });
      ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'left'; ctx.fillText(metric === 'revenue' ? `$${min}` : min, pad, base + 22); ctx.textAlign = 'right'; ctx.fillText(metric === 'revenue' ? `$${max}` : max, W - pad, base + 22);
      const format = value => metric === 'revenue' ? `$${Math.round(value).toLocaleString()}` : value.toFixed(1);
      $('eda-mean').textContent = format(mean); $('eda-median').textContent = format(median); $('eda-range').textContent = format(max - min); $('eda-outliers').textContent = outliers;
    }

    wireSegment('eda-metric', value => { metric = value; draw(); });
    $('eda-category').addEventListener('change', event => { category = event.target.value; draw(); });
    controllers.eda = { draw };
  })();

  /* ---------- Correlation ---------- */
  (function correlationLab() {
    const canvas = $('corr-canvas');
    let slope = .7, noise = .3, seed = 1;

    function sample() {
      return Array.from({ length: 60 }, (_, index) => {
        const x = index / 59;
        const jitter = Math.sin((index + seed * 7) * 4.73) * .65 + Math.cos((index + seed) * 2.19) * .35;
        return { x, y: .5 + slope * (x - .5) + jitter * noise * .55 };
      });
    }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, points = sample(), pad = 48;
      const mx = points.reduce((sum, point) => sum + point.x, 0) / points.length, my = points.reduce((sum, point) => sum + point.y, 0) / points.length;
      const covariance = points.reduce((sum, point) => sum + (point.x - mx) * (point.y - my), 0);
      const sx = Math.sqrt(points.reduce((sum, point) => sum + (point.x - mx) ** 2, 0));
      const sy = Math.sqrt(points.reduce((sum, point) => sum + (point.y - my) ** 2, 0));
      const r = sx && sy ? covariance / (sx * sy) : 0;
      const X = x => pad + x * (W - pad * 2), Y = y => H - pad - y * (H - pad * 2);
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.13)';
      for (let i = 0; i <= 4; i++) { const x = pad + i * (W - pad * 2) / 4, y = pad + i * (H - pad * 2) / 4; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(.5 - slope * .5)); ctx.lineTo(X(1), Y(.5 + slope * .5)); ctx.stroke();
      points.forEach(point => { ctx.fillStyle = '#6366F1'; ctx.beginPath(); ctx.arc(X(point.x), Y(point.y), 4, 0, Math.PI * 2); ctx.fill(); });
      $('corr-r').textContent = r.toFixed(3); $('corr-r2').textContent = (r * r).toFixed(3); $('corr-dir').textContent = Math.abs(r) < .15 ? 'none' : r > 0 ? 'positive' : 'negative';
    }

    $('corr-slope').addEventListener('input', event => { slope = +event.target.value; $('corr-slope-v').textContent = slope.toFixed(2); draw(); });
    $('corr-noise').addEventListener('input', event => { noise = +event.target.value; $('corr-noise-v').textContent = noise.toFixed(2); draw(); });
    $('corr-regenerate').addEventListener('click', () => { seed++; draw(); });
    controllers.corr = { draw };
  })();

  /* ---------- Time series ---------- */
  (function timeSeriesLab() {
    const canvas = $('time-canvas');
    let trend = .6, seasonality = .5, horizon = 6;

    function valueAt(index) { return 48 + trend * index + seasonality * 13 * Math.sin(index * Math.PI / 6) + Math.sin(index * 2.73) * 2; }

    function draw() {
      const fit = crisp(canvas); if (!fit) return;
      const { ctx, width: W, height: H } = fit, historyLength = 30, total = historyLength + horizon;
      const history = Array.from({ length: historyLength }, (_, index) => valueAt(index));
      const forecast = Array.from({ length: horizon }, (_, index) => 48 + trend * (historyLength + index) + seasonality * 13 * Math.sin((historyLength + index) * Math.PI / 6));
      const all = [...history, ...forecast], min = Math.min(...all) - 6, max = Math.max(...all) + 6, pad = 45;
      const X = index => pad + index / (total - 1) * (W - pad * 2), Y = value => H - pad - (value - min) / (max - min) * (H - pad * 2);
      ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(30,27,75,.13)';
      for (let i = 0; i <= 4; i++) { const y = pad + i * (H - pad * 2) / 4; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
      const divider = X(historyLength - 1); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(30,27,75,.25)'; ctx.beginPath(); ctx.moveTo(divider, pad); ctx.lineTo(divider, H - pad); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); history.forEach((value, index) => index ? ctx.lineTo(X(index), Y(value)) : ctx.moveTo(X(index), Y(value))); ctx.strokeStyle = '#6366F1'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(historyLength - 1), Y(history[history.length - 1])); forecast.forEach((value, index) => ctx.lineTo(X(historyLength + index), Y(value))); ctx.strokeStyle = '#22D3EE'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = '#6B7280'; ctx.font = '10px JetBrains Mono'; ctx.textAlign = 'right'; ctx.fillText('forecast →', W - pad, pad + 14);
      $('time-last').textContent = history[history.length - 1].toFixed(1); $('time-next').textContent = forecast[forecast.length - 1].toFixed(1); $('time-step').textContent = trend.toFixed(2); $('time-horizon-m').textContent = horizon;
    }

    $('time-trend').addEventListener('input', event => { trend = +event.target.value; $('time-trend-v').textContent = trend.toFixed(2); draw(); });
    $('time-season').addEventListener('input', event => { seasonality = +event.target.value; $('time-season-v').textContent = seasonality.toFixed(2); draw(); });
    $('time-horizon').addEventListener('input', event => { horizon = +event.target.value; $('time-horizon-v').textContent = horizon; draw(); });
    controllers.time = { draw };
  })();

  window.DataAnalysisExtra = {
    redraw(id) { if (controllers[id]) requestAnimationFrame(() => controllers[id].draw()); },
  };
  window.addEventListener('resize', () => {
    const active = document.querySelector('#tabs [role=tab][aria-selected=true]')?.dataset.tab;
    if (active && controllers[active]) controllers[active].draw();
  });
})();
