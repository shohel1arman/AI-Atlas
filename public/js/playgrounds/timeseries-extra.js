/* ============================================================
   AI ATLAS — Time Series & Forecasting, extra interactive labs
   Adds 5 playgrounds beyond decomp/smooth/forecast:
     stationarity · differencing a trend+season series flat
     autocorr     · AR(1) series → ACF bar plot (lags 0..20)
     arima        · p/d/q dials → one-step fit + residuals
     eval         · rolling-origin backtest folds + MAE/RMSE/MAPE
     anomaly      · z-score threshold on residuals + precision/recall
   Fixed-size canvases draw on load, so hidden panels are fine.
   ============================================================ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function seg(id, cb) {
    var el = $(id); if (!el) return;
    el.onclick = function (e) { var b = e.target.closest('button'); if (!b) return;
      [].forEach.call(el.children, function (c) { c.classList.remove('active'); });
      b.classList.add('active'); cb(b.dataset.v); };
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- shared plotting helpers ---------- */
  function niceRange(arr) {
    var lo = Infinity, hi = -Infinity;
    for (var i = 0; i < arr.length; i++) { if (arr[i] < lo) lo = arr[i]; if (arr[i] > hi) hi = arr[i]; }
    if (!isFinite(lo)) { lo = 0; hi = 1; }
    var m = (hi - lo) * 0.12 || 1; return [lo - m, hi + m];
  }
  // map fn for a series drawn across [pad .. W-8]
  function mapper(W, H, pad, lo, hi, n) {
    return {
      X: function (i) { return pad + (W - pad - 8) * (n > 1 ? i / (n - 1) : 0); },
      Y: function (v) { return (H - pad) - (H - 2 * pad) * ((v - lo) / (hi - lo || 1)); }
    };
  }
  function baseline(ctx, W, H, pad, yPix) {
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, yPix); ctx.lineTo(W - 6, yPix); ctx.stroke();
  }
  function polyline(ctx, data, mp, color, width, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = width || 1.6; ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (var i = 0; i < data.length; i++) {
      var x = mp.X(i), y = mp.Y(data[i]);
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }
  // fixed noise draw so a slider re-derives the same base unless rerolled
  function noiseArray(n) { var a = []; for (var i = 0; i < n; i++) a.push(Math.random() * 2 - 1); return a; }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : 0; }
  function variance(a) { var m = mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return a.length ? s / a.length : 0; }
  function diff(a) { var o = []; for (var i = 1; i < a.length; i++) o.push(a[i] - a[i - 1]); return o; }

  /* ============================ stationarity ============================ */
  (function stationarityLab() {
    var cv = $('stat-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, pad = 30;
    var N = 150, PER = 24, mode = 'none';
    var eps = noiseArray(N), base = [];
    function build() {
      base = [];
      for (var i = 0; i < N; i++) base.push(40 + 0.45 * i + 14 * Math.sin(2 * Math.PI * i / PER) + 5 * eps[i]);
    }
    function transform() {
      if (mode === 'none') return base.slice();
      if (mode === 'first') return diff(base);
      if (mode === 'second') return diff(diff(base));
      // seasonal: subtract value one period back
      var o = []; for (var i = PER; i < base.length; i++) o.push(base[i] - base[i - PER]); return o;
    }
    // rolling window stats to expose (non)stationarity
    function rollStats(s, win) {
      var means = [], vars = [];
      for (var i = 0; i + win <= s.length; i++) {
        var seg = s.slice(i, i + win);
        means.push(mean(seg)); vars.push(variance(seg));
      }
      return { means: means, vars: vars };
    }
    var NOTES = {
      none: 'Raw series: trend and season make the mean drift — clearly non-stationary.',
      first: 'First difference removes the linear trend; the series now wobbles around a flat mean.',
      second: 'Second difference flattens even curved trends — but can over-difference and add noise.',
      seasonal: 'Seasonal difference (lag ' + PER + ') cancels the repeating pattern, leaving trend + noise.'
    };
    function draw() {
      build();
      var s = transform(), win = Math.max(10, Math.round(s.length / 6));
      var rng = niceRange(s), mp = mapper(W, H, pad, rng[0], rng[1], s.length);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      // zero (or mean) reference line
      var refY = mp.Y(mode === 'none' ? mean(s) : 0);
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, refY); ctx.lineTo(W - 6, refY); ctx.stroke(); ctx.setLineDash([]);
      polyline(ctx, s, mp, '#22D3EE', 1.8);
      // rolling mean overlay
      var rs = rollStats(s, win);
      if (rs.means.length > 1) {
        var mmp = { X: function (i) { return mp.X(i + Math.floor(win / 2)); }, Y: mp.Y };
        polyline(ctx, rs.means, mmp, '#F59E0B', 2);
      }
      // metrics: spread of rolling mean & variance
      var mSpread = rs.means.length ? (Math.max.apply(null, rs.means) - Math.min.apply(null, rs.means)) : 0;
      var vSpread = rs.vars.length ? (Math.max.apply(null, rs.vars) - Math.min.apply(null, rs.vars)) : 0;
      var overall = Math.abs(mean(s)) + 1;
      if ($('stat-mean')) $('stat-mean').textContent = mSpread.toFixed(1);
      if ($('stat-var')) $('stat-var').textContent = vSpread.toFixed(1);
      var stationary = mSpread < overall * 0.5 && mode !== 'none';
      var v = $('stat-verdict');
      if (v) {
        if (mode === 'none') { v.textContent = '✗ non-stationary'; v.style.color = 'var(--rose)'; }
        else if (stationary) { v.textContent = '✓ ~stationary'; v.style.color = 'var(--emerald)'; }
        else { v.textContent = '~ closer'; v.style.color = 'var(--amber)'; }
      }
      if ($('stat-note')) $('stat-note').textContent = NOTES[mode];
    }
    seg('stat-mode', function (m) { mode = m; draw(); });
    draw();
  })();

  /* ============================ autocorr ============================ */
  (function autocorrLab() {
    var cv = $('acf-canvas'), sc = $('acf-series'); if (!cv) return;
    var ctx = cv.getContext('2d'), sctx = sc.getContext('2d');
    var W = cv.width, H = cv.height, SW = sc.width, SH = sc.height, pad = 30;
    var N = 220, MAXLAG = 20, phi = 0.7;
    var eps = noiseArray(N);
    function series() {
      var x = [0];
      for (var t = 1; t < N; t++) x.push(phi * x[t - 1] + eps[t]);
      return x;
    }
    function acf(s) {
      var m = mean(s), denom = 0, i;
      for (i = 0; i < s.length; i++) denom += (s[i] - m) * (s[i] - m);
      var out = [];
      for (var k = 0; k <= MAXLAG; k++) {
        var num = 0;
        for (i = k; i < s.length; i++) num += (s[i] - m) * (s[i - k] - m);
        out.push(denom ? num / denom : 0);
      }
      return out;
    }
    function draw() {
      var s = series(), r = acf(s), band = 1.96 / Math.sqrt(N);
      // top: the series itself
      var rng = niceRange(s), smp = mapper(SW, SH, 18, rng[0], rng[1], s.length);
      sctx.clearRect(0, 0, SW, SH); sctx.fillStyle = '#0c0c16'; sctx.fillRect(0, 0, SW, SH);
      polyline(sctx, s, smp, '#8B8CF6', 1.4);
      // bottom: ACF bar plot
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var zeroY = (H - pad) - (H - 2 * pad) * ((0 - (-1)) / (1 - (-1)));
      var Y = function (v) { return (H - pad) - (H - 2 * pad) * ((v - (-1)) / (1 - (-1))); };
      baseline(ctx, W, H, pad, zeroY);
      // significance band
      ctx.fillStyle = 'rgba(52,211,153,.10)';
      ctx.fillRect(pad, Y(band), W - pad - 6, Y(-band) - Y(band));
      ctx.strokeStyle = 'rgba(52,211,153,.55)'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, Y(band)); ctx.lineTo(W - 6, Y(band)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad, Y(-band)); ctx.lineTo(W - 6, Y(-band)); ctx.stroke(); ctx.setLineDash([]);
      // bars
      var step = (W - pad - 12) / (MAXLAG + 1), bw = Math.min(step * 0.55, 18);
      var cut = -1;
      for (var k = 0; k <= MAXLAG; k++) {
        var cx = pad + step * (k + 0.5), val = r[k];
        var y = Y(val), top = Math.min(y, zeroY), h = Math.abs(y - zeroY);
        ctx.fillStyle = k === 0 ? '#6366F1' : (Math.abs(val) > band ? '#22D3EE' : 'rgba(120,130,160,.6)');
        ctx.fillRect(cx - bw / 2, top, bw, Math.max(1, h));
        if (cut < 0 && k > 0 && Math.abs(val) <= band) cut = k;
        ctx.fillStyle = '#7C7C92'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        if (k % 2 === 0) ctx.fillText(k, cx, H - pad + 12);
      }
      if ($('acf-phi-v')) $('acf-phi-v').textContent = phi.toFixed(2);
      if ($('acf-r1')) $('acf-r1').textContent = r[1].toFixed(3);
      if ($('acf-cut')) $('acf-cut').textContent = cut < 0 ? '> 20' : ('lag ' + cut);
    }
    if ($('acf-phi')) $('acf-phi').oninput = function (e) { phi = +e.target.value; draw(); };
    if ($('acf-reroll')) $('acf-reroll').onclick = function () { eps = noiseArray(N); draw(); };
    draw();
  })();

  /* ============================ arima ============================ */
  (function arimaLab() {
    var cv = $('arima-canvas'), rc = $('arima-resid'); if (!cv) return;
    var ctx = cv.getContext('2d'), rctx = rc.getContext('2d');
    var W = cv.width, H = cv.height, RW = rc.width, RH = rc.height, pad = 30;
    var N = 120, p = 1, d = 1, q = 1;
    var eps = noiseArray(N), actual = [];
    (function build() {
      var ar = 0;
      for (var i = 0; i < N; i++) { ar = 0.55 * ar + eps[i]; actual.push(48 + 0.25 * i + 6 * ar + 5 * Math.sin(i / 7)); }
    })();
    function difference(a, times) { var s = a.slice(); for (var t = 0; t < times; t++) s = diff(s); return s; }
    // least-squares AR(p) one-step predictions on an already-stationary series
    function solve(A, b) {
      var n = b.length, i, j, k;
      for (i = 0; i < n; i++) {
        var piv = i; for (k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[piv][i])) piv = k;
        var tmp = A[i]; A[i] = A[piv]; A[piv] = tmp; var tb = b[i]; b[i] = b[piv]; b[piv] = tb;
        if (Math.abs(A[i][i]) < 1e-9) continue;
        for (k = i + 1; k < n; k++) { var f = A[k][i] / A[i][i]; for (j = i; j < n; j++) A[k][j] -= f * A[i][j]; b[k] -= f * b[i]; }
      }
      var x = new Array(n).fill(0);
      for (i = n - 1; i >= 0; i--) { var s = b[i]; for (j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = Math.abs(A[i][i]) < 1e-9 ? 0 : s / A[i][i]; }
      return x;
    }
    function arFit(s, order) {
      // predict s[t] from [1, s[t-1]..s[t-order]] via normal equations
      var pred = s.slice();
      if (order === 0) { var mu = mean(s); for (var t = 0; t < s.length; t++) pred[t] = mu; return pred; }
      var cols = order + 1, A = [], b = [], rows = [], y = [];
      for (var i = order; i < s.length; i++) {
        var row = [1]; for (var k = 1; k <= order; k++) row.push(s[i - k]);
        rows.push(row); y.push(s[i]);
      }
      for (var a = 0; a < cols; a++) { A.push(new Array(cols).fill(0)); b.push(0);
        for (var r = 0; r < rows.length; r++) { b[a] += rows[r][a] * y[r]; for (var c = 0; c < cols; c++) A[a][c] += rows[r][a] * rows[r][c]; } }
      var coef = solve(A, b);
      for (var t2 = 0; t2 < s.length; t2++) {
        if (t2 < order) { pred[t2] = s[t2]; continue; }
        var v = coef[0]; for (var kk = 1; kk <= order; kk++) v += coef[kk] * s[t2 - kk]; pred[t2] = v;
      }
      return pred;
    }
    function integrate(fromVal, seedTail, times) {
      // undo `times` differences; seedTail holds the last real values to anchor levels
      var s = fromVal.slice();
      for (var t = times; t >= 1; t--) {
        var anchor = seedTail[t - 1];
        var o = [anchor];
        for (var i = 0; i < s.length; i++) o.push(o[o.length - 1] + s[i]);
        s = o;
      }
      return s;
    }
    function draw() {
      // work in the d-times differenced domain
      var w = difference(actual, d);
      var pred = arFit(w, p);
      // MA(q): blend last q residuals back into the prediction
      var res = []; for (var i = 0; i < w.length; i++) res.push(w[i] - pred[i]);
      if (q > 0) {
        for (var t = 0; t < w.length; t++) {
          var acc = 0, cnt = 0;
          for (var kk = 1; kk <= q && t - kk >= 0; kk++) { acc += res[t - kk]; cnt++; }
          if (cnt) pred[t] += (0.5) * (acc / cnt);
        }
      }
      // reconstruct fitted back to original level
      var seedTail = [];
      var tmp = actual.slice();
      for (var td = 0; td < d; td++) { seedTail.push(tmp[0]); tmp = diff(tmp); }
      var fitted = integrate(pred, seedTail, d);
      // align lengths (integration adds d points at the front)
      fitted = fitted.slice(fitted.length - actual.length);
      var resid = []; for (var j = 0; j < actual.length; j++) resid.push(actual[j] - fitted[j]);

      var rng = niceRange(actual.concat(fitted)), mp = mapper(W, H, pad, rng[0], rng[1], actual.length);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      polyline(ctx, actual, mp, '#B9B9CC', 1.6);
      polyline(ctx, fitted, mp, '#8B8CF6', 2);

      // residual panel
      rctx.clearRect(0, 0, RW, RH); rctx.fillStyle = '#0c0c16'; rctx.fillRect(0, 0, RW, RH);
      var rr = niceRange(resid.concat([0])), rmp = mapper(RW, RH, 18, rr[0], rr[1], resid.length);
      var zeroY = rmp.Y(0);
      rctx.strokeStyle = 'rgba(255,255,255,.15)'; rctx.setLineDash([4, 4]);
      rctx.beginPath(); rctx.moveTo(18, zeroY); rctx.lineTo(RW - 6, zeroY); rctx.stroke(); rctx.setLineDash([]);
      var step = (RW - 24) / resid.length;
      for (var b2 = 0; b2 < resid.length; b2++) {
        var x = rmp.X(b2), y = rmp.Y(resid[b2]);
        rctx.strokeStyle = Math.abs(resid[b2]) > 2 * Math.sqrt(variance(resid)) ? '#FB7185' : 'rgba(251,113,133,.6)';
        rctx.lineWidth = Math.max(1, step * 0.5);
        rctx.beginPath(); rctx.moveTo(x, zeroY); rctx.lineTo(x, y); rctx.stroke();
      }
      var rstd = Math.sqrt(variance(resid));
      var k = p + q + d + 1, aic = actual.length * Math.log(variance(resid) + 1e-9) + 2 * k;
      if ($('arima-p-v')) $('arima-p-v').textContent = p;
      if ($('arima-d-v')) $('arima-d-v').textContent = d;
      if ($('arima-q-v')) $('arima-q-v').textContent = q;
      if ($('arima-rstd')) $('arima-rstd').textContent = rstd.toFixed(2);
      if ($('arima-aic')) $('arima-aic').textContent = aic.toFixed(0);
      if ($('arima-note')) $('arima-note').textContent =
        'AR(' + p + '): regress on the last ' + p + ' value' + (p === 1 ? '' : 's') +
        ' · I(' + d + '): ' + d + ' difference' + (d === 1 ? '' : 's') + ' to detrend' +
        ' · MA(' + q + '): correct with the last ' + q + ' error' + (q === 1 ? '' : 's') + '.';
    }
    function bind(id, set) { var el = $(id); if (el) el.oninput = function (e) { set(+e.target.value); draw(); }; }
    bind('arima-p', function (x) { p = x; }); bind('arima-d', function (x) { d = x; }); bind('arima-q', function (x) { q = x; });
    draw();
  })();

  /* ============================ eval: backtesting ============================ */
  (function backtestLab() {
    var cv = $('bt-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, pad = 30;
    var N = 132, folds = 4;
    var series = [];
    function build() {
      series = []; var ar = 0;
      for (var i = 0; i < N; i++) { ar = 0.5 * ar + (Math.random() * 2 - 1); series.push(60 + 0.35 * i + 10 * Math.sin(2 * Math.PI * i / 20) + 4 * ar); }
    }
    build();
    function driftForecast(train, len) {
      var last = train[train.length - 1];
      var tail = train.slice(-12);
      var slope = (tail[tail.length - 1] - tail[0]) / Math.max(1, tail.length - 1);
      var o = []; for (var h = 1; h <= len; h++) o.push(last + slope * h); return o;
    }
    function draw() {
      var testSize = Math.max(6, Math.floor(N / (folds + 2)));
      var rng = niceRange(series), mp = mapper(W, H, pad, rng[0], rng[1], N);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var absErr = 0, sqErr = 0, pctErr = 0, cnt = 0, fc;
      for (fc = 0; fc < folds; fc++) {
        var testStart = N - (folds - fc) * testSize;
        var testEnd = testStart + testSize;
        if (testStart <= 4) continue;
        var train = series.slice(0, testStart);
        var pred = driftForecast(train, testSize);
        // shade train region (faint) and test region (emerald) for this fold's band row
        var y0 = pad + (H - 2 * pad) * (fc / folds), y1 = pad + (H - 2 * pad) * ((fc + 0.9) / folds);
        ctx.fillStyle = 'rgba(139,140,246,.10)';
        ctx.fillRect(mp.X(0), y0, mp.X(testStart - 1) - mp.X(0), y1 - y0);
        ctx.fillStyle = 'rgba(52,211,153,.18)';
        ctx.fillRect(mp.X(testStart), y0, mp.X(testEnd - 1) - mp.X(testStart), y1 - y0);
        // per-fold forecast dashed over the test window
        ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
        for (var h = 0; h < testSize && testStart + h < N; h++) {
          var x = mp.X(testStart + h), y = mp.Y(pred[h]);
          if (h) ctx.lineTo(x, y); else ctx.moveTo(x, y);
          var act = series[testStart + h], e = act - pred[h];
          absErr += Math.abs(e); sqErr += e * e; pctErr += Math.abs(e / (act || 1)); cnt++;
        }
        ctx.stroke(); ctx.setLineDash([]);
        // fold boundary
        ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.setLineDash([3, 4]); ctx.beginPath();
        ctx.moveTo(mp.X(testStart), pad); ctx.lineTo(mp.X(testStart), H - pad); ctx.stroke(); ctx.setLineDash([]);
      }
      // the series on top
      polyline(ctx, series, mp, '#B9B9CC', 1.7);
      if ($('bt-folds-v')) $('bt-folds-v').textContent = folds;
      if ($('bt-mae')) $('bt-mae').textContent = cnt ? (absErr / cnt).toFixed(2) : '—';
      if ($('bt-rmse')) $('bt-rmse').textContent = cnt ? Math.sqrt(sqErr / cnt).toFixed(2) : '—';
      if ($('bt-mape')) $('bt-mape').textContent = cnt ? (100 * pctErr / cnt).toFixed(1) + '%' : '—';
    }
    if ($('bt-folds')) $('bt-folds').oninput = function (e) { folds = +e.target.value; draw(); };
    if ($('bt-reroll')) $('bt-reroll').onclick = function () { build(); draw(); };
    draw();
  })();

  /* ============================ anomaly ============================ */
  (function anomalyLab() {
    var cv = $('anom-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, pad = 30;
    var N = 160, z = 3.0;
    var series = [], truth = [];
    function build() {
      series = []; truth = []; var ar = 0;
      for (var i = 0; i < N; i++) { ar = 0.4 * ar + (Math.random() * 2 - 1); series.push(50 + 8 * Math.sin(2 * Math.PI * i / 26) + 3 * ar); }
      var nSpikes = 4 + (Math.random() * 3 | 0);
      for (var k = 0; k < nSpikes; k++) {
        var idx = 10 + (Math.random() * (N - 20) | 0);
        var mag = (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 12);
        series[idx] += mag; truth.push(idx);
      }
    }
    build();
    function rollingMedian(a, win) {
      var o = [];
      for (var i = 0; i < a.length; i++) {
        var s = a.slice(Math.max(0, i - win), Math.min(a.length, i + win + 1)).slice().sort(function (x, y) { return x - y; });
        o.push(s[s.length >> 1]);
      }
      return o;
    }
    function draw() {
      var med = rollingMedian(series, 6), resid = [];
      for (var i = 0; i < N; i++) resid.push(series[i] - med[i]);
      var sd = Math.sqrt(variance(resid)) || 1;
      var flagged = [];
      for (i = 0; i < N; i++) if (Math.abs(resid[i] / sd) > z) flagged.push(i);
      // precision / recall vs injected truth (± 1 index tolerance)
      var truthSet = {}; truth.forEach(function (t) { truthSet[t] = true; });
      var tp = 0;
      flagged.forEach(function (f) { if (truthSet[f] || truthSet[f - 1] || truthSet[f + 1]) tp++; });
      var covered = 0;
      truth.forEach(function (t) { if (flagged.indexOf(t) >= 0 || flagged.indexOf(t - 1) >= 0 || flagged.indexOf(t + 1) >= 0) covered++; });
      var precision = flagged.length ? tp / flagged.length : 0;
      var recall = truth.length ? covered / truth.length : 0;

      var rng = niceRange(series), mp = mapper(W, H, pad, rng[0], rng[1], N);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      // ±z band around rolling median
      ctx.fillStyle = 'rgba(52,211,153,.10)'; ctx.beginPath();
      for (i = 0; i < N; i++) { var x = mp.X(i), y = mp.Y(med[i] + z * sd); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      for (i = N - 1; i >= 0; i--) ctx.lineTo(mp.X(i), mp.Y(med[i] - z * sd));
      ctx.closePath(); ctx.fill();
      // series
      polyline(ctx, series, mp, '#B9B9CC', 1.6);
      // true injected spikes (amber ring)
      truth.forEach(function (t) {
        ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(mp.X(t), mp.Y(series[t]), 6, 0, Math.PI * 2); ctx.stroke();
      });
      // flagged points (red dot)
      flagged.forEach(function (f) {
        ctx.fillStyle = '#FB7185';
        ctx.beginPath(); ctx.arc(mp.X(f), mp.Y(series[f]), 3.4, 0, Math.PI * 2); ctx.fill();
      });
      if ($('anom-z-v')) $('anom-z-v').textContent = z.toFixed(1);
      if ($('anom-count')) $('anom-count').textContent = flagged.length + ' / ' + truth.length;
      if ($('anom-prec')) $('anom-prec').textContent = (100 * precision).toFixed(0) + '%';
      if ($('anom-rec')) $('anom-rec').textContent = (100 * recall).toFixed(0) + '%';
    }
    if ($('anom-z')) $('anom-z').oninput = function (e) { z = +e.target.value; draw(); };
    if ($('anom-reroll')) $('anom-reroll').onclick = function () { build(); draw(); };
    draw();
  })();

})();
