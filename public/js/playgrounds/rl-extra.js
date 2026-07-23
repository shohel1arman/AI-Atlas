/* ============================================================
   AI ATLAS — Reinforcement Learning, extra interactive labs
   Adds 5 playgrounds beyond mdp/bandit/qlearn:
     loop     · The RL Loop (agent steps through an environment)
     discount · Discount & Return (gamma^t * r_t bars)
     explore  · Exploration (e-greedy vs UCB vs optimistic regret)
     sarsa    · SARSA vs Q-Learning on the cliff
     pg       · Policy Gradients (softmax preferences)
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
  function argmax(arr) { var bi = 0; for (var i = 1; i < arr.length; i++) if (arr[i] > arr[bi]) bi = i; return bi; }

  /* ============================ loop: The RL Loop ============================ */
  (function loopLab() {
    var cv = $('rl-loop-cv'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, N = 7, GOAL = 6, STEPCOST = -0.05;
    var state, ret, episode, lastA, lastR, timer = null;
    var ACT = ['← left', '→ right'];

    function reset() {
      state = 0; ret = 0; episode = 1; lastA = '—'; lastR = 0; draw(); info();
    }
    function step() {
      if (state === GOAL) { state = 0; ret = 0; episode++; }  // start a fresh episode
      // policy: right-biased with a little exploration, so the agent visibly moves
      var right = Math.random() < 0.8;
      var ns = clamp(state + (right ? 1 : -1), 0, N - 1);
      state = ns;
      lastA = ACT[right ? 1 : 0];
      lastR = (state === GOAL) ? 1 : STEPCOST;
      ret += lastR;
      draw(); info();
    }
    function info() {
      if ($('rl-loop-state')) $('rl-loop-state').textContent = 's' + state + (state === GOAL ? ' (goal)' : '');
      if ($('rl-loop-action')) $('rl-loop-action').textContent = lastA;
      if ($('rl-loop-reward')) $('rl-loop-reward').textContent = lastR.toFixed(2);
      if ($('rl-loop-return')) $('rl-loop-return').textContent = ret.toFixed(2);
      if ($('rl-loop-ep')) $('rl-loop-ep').textContent = String(episode);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var pad = 12, cw = (W - pad * 2) / N, cy = H / 2, r = Math.min(cw * 0.32, 26);
      for (var i = 0; i < N; i++) {
        var x = pad + i * cw;
        ctx.fillStyle = i === GOAL ? 'rgba(52,211,153,.85)' : 'var(--glass-2)';
        ctx.fillStyle = i === GOAL ? 'rgba(52,211,153,.28)' : 'rgba(255,255,255,.04)';
        ctx.fillRect(x + 3, cy - 34, cw - 6, 68);
        ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.strokeRect(x + 3.5, cy - 33.5, cw - 6, 68);
        ctx.fillStyle = '#7C7C92'; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText(i === GOAL ? 's6 · +1' : 's' + i, x + cw / 2, cy + 50);
        if (i === 0) { ctx.fillStyle = '#7C7C92'; ctx.fillText('start', x + cw / 2, cy - 42); }
      }
      // agent
      var ax = pad + state * cw + cw / 2;
      ctx.beginPath(); ctx.arc(ax, cy, r, 0, 7);
      ctx.fillStyle = state === GOAL ? '#34D399' : '#22D3EE'; ctx.fill();
      ctx.fillStyle = '#0c0c16'; ctx.font = 'bold 14px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText('A', ax, cy + 5);
    }
    if ($('rl-loop-step')) $('rl-loop-step').onclick = function () { if (timer) return; step(); };
    if ($('rl-loop-auto')) $('rl-loop-auto').onclick = function () {
      var btn = this;
      if (timer) { clearInterval(timer); timer = null; btn.textContent = '▶ Auto-run'; btn.classList.remove('active'); return; }
      btn.textContent = '⏸ Pause'; btn.classList.add('active');
      timer = setInterval(step, 420);
    };
    if ($('rl-loop-reset')) $('rl-loop-reset').onclick = function () {
      if (timer) { clearInterval(timer); timer = null; var b = $('rl-loop-auto'); if (b) { b.textContent = '▶ Auto-run'; b.classList.remove('active'); } }
      reset();
    };
    reset();
  })();

  /* ============================ discount: Discount & Return ============================ */
  (function discountLab() {
    var cv = $('rl-disc-cv'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    var R = [4, 1, 7, 2, 9, 3, 6, 1, 8, 2, 5, 3];        // fixed future reward sequence
    var maxR = Math.max.apply(null, R), gamma = 0.9;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var padL = 34, padB = 34, padT = 16, padR = 12;
      var plotW = W - padL - padR, plotH = H - padB - padT, base = H - padB;
      var n = R.length, bw = plotW / n, disc = 0, undisc = 0;
      // baseline
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath();
      ctx.moveTo(padL, base); ctx.lineTo(W - padR, base); ctx.stroke();
      for (var t = 0; t < n; t++) {
        var x = padL + t * bw;
        var full = R[t], dv = Math.pow(gamma, t) * R[t];
        undisc += full; disc += dv;
        var fh = (full / maxR) * plotH, dh = (dv / maxR) * plotH;
        // faint full-reward bar
        ctx.fillStyle = 'rgba(255,255,255,.08)';
        ctx.fillRect(x + bw * 0.18, base - fh, bw * 0.64, fh);
        // solid discounted bar
        ctx.fillStyle = 'rgba(34,211,238,.85)';
        ctx.fillRect(x + bw * 0.18, base - dh, bw * 0.64, dh);
        ctx.fillStyle = '#7C7C92'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText('t' + t, x + bw / 2, base + 14);
        ctx.fillText(dv.toFixed(1), x + bw / 2, base - dh - 4);
      }
      // y label hint
      ctx.fillStyle = '#7C7C92'; ctx.font = '9px JetBrains Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText('reward', padL - 30, padT + 4);
      if ($('rl-disc-return')) $('rl-disc-return').textContent = disc.toFixed(2);
      if ($('rl-disc-undisc')) $('rl-disc-undisc').textContent = undisc.toFixed(0);
      if ($('rl-disc-horizon')) $('rl-disc-horizon').textContent = gamma >= 0.999 ? '∞' : (1 / (1 - gamma)).toFixed(1) + ' steps';
      if ($('rl-disc-mood')) $('rl-disc-mood').textContent =
        gamma < 0.5 ? 'near-sighted — only the next reward or two matter'
        : gamma < 0.85 ? 'balanced — weighs the near future, discounts the far'
        : 'far-sighted — distant rewards still count almost in full';
    }
    if ($('rl-disc-gamma')) $('rl-disc-gamma').oninput = function (e) {
      gamma = +e.target.value; if ($('rl-disc-gv')) $('rl-disc-gv').textContent = gamma.toFixed(2); draw();
    };
    draw();
  })();

  /* ============================ explore: Exploration strategies ============================ */
  (function exploreLab() {
    var cv = $('rl-exp-cv'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    var TRUE = [0.20, 0.50, 0.62, 0.35, 0.75];           // hidden Bernoulli means
    var best = Math.max.apply(null, TRUE);
    var PULLS = 600, eps = 0.10;
    var COL = { eg: '#F59E0B', ucb: '#22D3EE', opt: '#34D399' };

    function runStrategy(kind) {
      var K = TRUE.length, Q = [], Nc = [], regret = [], cum = 0;
      for (var i = 0; i < K; i++) { Q[i] = (kind === 'opt') ? 5 : 0; Nc[i] = 0; }
      for (var t = 0; t < PULLS; t++) {
        var a;
        if (kind === 'eg') {
          a = Math.random() < eps ? (Math.random() * K) | 0 : argmax(Q);
        } else if (kind === 'ucb') {
          if (t < K) { a = t; }                            // seed each arm once
          else {
            var ucb = [], lnT = Math.log(t + 1);
            for (i = 0; i < K; i++) ucb[i] = Q[i] + 1.4 * Math.sqrt(lnT / Nc[i]);
            a = argmax(ucb);
          }
        } else { a = argmax(Q); }                          // optimistic-greedy
        var r = Math.random() < TRUE[a] ? 1 : 0;
        Nc[a]++; Q[a] += (r - Q[a]) / Nc[a];
        cum += best - TRUE[a];
        regret.push(cum);
      }
      return regret;
    }
    function draw() {
      var eg = runStrategy('eg'), ucb = runStrategy('ucb'), opt = runStrategy('opt');
      var maxReg = Math.max(eg[eg.length - 1], ucb[ucb.length - 1], opt[opt.length - 1], 1);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var padL = 40, padB = 28, padT = 14, padR = 12;
      var plotW = W - padL - padR, plotH = H - padB - padT, base = H - padB;
      // axes
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath();
      ctx.moveTo(padL, padT); ctx.lineTo(padL, base); ctx.lineTo(W - padR, base); ctx.stroke();
      ctx.fillStyle = '#7C7C92'; ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'right'; ctx.fillText(maxReg.toFixed(0), padL - 4, padT + 8);
      ctx.fillText('0', padL - 4, base);
      ctx.textAlign = 'center'; ctx.fillText('pulls →', padL + plotW / 2, H - 6);
      ctx.save(); ctx.translate(12, padT + plotH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('cumulative regret', 0, 0); ctx.restore();
      function line(arr, col) {
        ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
        for (var t = 0; t < arr.length; t++) {
          var x = padL + (t / (arr.length - 1)) * plotW, y = base - (arr[t] / maxReg) * plotH;
          if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      line(eg, COL.eg); line(ucb, COL.ucb); line(opt, COL.opt);
      var fin = { eg: eg[eg.length - 1], ucb: ucb[ucb.length - 1], opt: opt[opt.length - 1] };
      if ($('rl-exp-eg')) $('rl-exp-eg').textContent = fin.eg.toFixed(1);
      if ($('rl-exp-ucb')) $('rl-exp-ucb').textContent = fin.ucb.toFixed(1);
      if ($('rl-exp-opt')) $('rl-exp-opt').textContent = fin.opt.toFixed(1);
      var names = { eg: 'ε-greedy', ucb: 'UCB', opt: 'optimistic' };
      var winner = Object.keys(fin).reduce(function (a, b) { return fin[a] <= fin[b] ? a : b; });
      if ($('rl-exp-winner')) $('rl-exp-winner').textContent = names[winner];
    }
    if ($('rl-exp-eps')) $('rl-exp-eps').oninput = function (e) {
      eps = +e.target.value; if ($('rl-exp-ev')) $('rl-exp-ev').textContent = eps.toFixed(2); draw();
    };
    if ($('rl-exp-run')) $('rl-exp-run').onclick = draw;
    draw();
  })();

  /* ============================ sarsa: SARSA vs Q-Learning (cliff) ============================ */
  (function sarsaLab() {
    var cv = $('rl-sarsa-cv'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var ROWS = 4, COLS = 8, W = cv.width, H = cv.height;
    var START = [ROWS - 1, 0], GOAL = [ROWS - 1, COLS - 1];
    var ACTS = [[-1, 0], [1, 0], [0, -1], [0, 1]];        // up down left right
    var mode = 'sarsa';
    function isCliff(r, c) { return r === ROWS - 1 && c > 0 && c < COLS - 1; }
    function isGoal(r, c) { return r === GOAL[0] && c === GOAL[1]; }
    function stepEnv(r, c, a) {
      var nr = clamp(r + ACTS[a][0], 0, ROWS - 1), nc = clamp(c + ACTS[a][1], 0, COLS - 1);
      if (isCliff(nr, nc)) return { r: START[0], c: START[1], rew: -100, done: false };
      if (isGoal(nr, nc)) return { r: nr, c: nc, rew: -1, done: true };
      return { r: nr, c: nc, rew: -1, done: false };
    }
    var Q, returns;
    function newQ() { Q = []; for (var r = 0; r < ROWS; r++) { Q[r] = []; for (var c = 0; c < COLS; c++) Q[r][c] = [0, 0, 0, 0]; } }
    function egreedy(r, c, eps) { return Math.random() < eps ? (Math.random() * 4) | 0 : argmax(Q[r][c]); }
    function train(episodes) {
      newQ(); returns = [];
      var alpha = 0.5, gamma = 1.0, eps = 0.1;
      for (var e = 0; e < episodes; e++) {
        var r = START[0], c = START[1], a = egreedy(r, c, eps), ret = 0, steps = 0;
        while (steps < 200) {
          var t = stepEnv(r, c, a); ret += t.rew;
          var na = egreedy(t.r, t.c, eps);
          var target;
          if (t.done) target = t.rew;
          else if (mode === 'sarsa') target = t.rew + gamma * Q[t.r][t.c][na];   // on-policy
          else target = t.rew + gamma * Math.max.apply(null, Q[t.r][t.c]);        // off-policy (max)
          Q[r][c][a] += alpha * (target - Q[r][c][a]);
          r = t.r; c = t.c; a = na; steps++;
          if (t.done) break;
        }
        returns.push(ret);
      }
    }
    function greedyPath() {
      var path = [], r = START[0], c = START[1], seen = {}, steps = 0;
      path.push([r, c]);
      while (!isGoal(r, c) && steps < 60) {
        var a = argmax(Q[r][c]);
        var t = stepEnv(r, c, a);
        r = t.r; c = t.c; path.push([r, c]);
        var key = r + ',' + c; if (seen[key] && !isGoal(r, c)) break; seen[key] = 1; steps++;
        if (t.done) break;
      }
      return path;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cw = W / COLS, ch = H / ROWS;
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
        var x = c * cw, y = r * ch;
        if (isCliff(r, c)) ctx.fillStyle = 'rgba(251,113,133,.55)';
        else if (isGoal(r, c)) ctx.fillStyle = 'rgba(52,211,153,.75)';
        else if (r === START[0] && c === START[1]) ctx.fillStyle = 'rgba(34,211,238,.25)';
        else ctx.fillStyle = 'rgba(255,255,255,.04)';
        ctx.fillRect(x, y, cw, ch);
        ctx.strokeStyle = 'rgba(255,255,255,.10)'; ctx.strokeRect(x + .5, y + .5, cw, ch);
        ctx.fillStyle = '#9a9aae'; ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        if (isCliff(r, c)) ctx.fillText('cliff', x + cw / 2, y + ch / 2 + 3);
        else if (isGoal(r, c)) { ctx.fillStyle = '#04120c'; ctx.fillText('GOAL', x + cw / 2, y + ch / 2 + 3); }
        else if (r === START[0] && c === START[1]) ctx.fillText('S', x + cw / 2, y + ch / 2 + 3);
      }
      // learned greedy path
      var path = greedyPath();
      ctx.strokeStyle = mode === 'sarsa' ? '#34D399' : '#F59E0B';
      ctx.lineWidth = 3; ctx.beginPath();
      for (var i = 0; i < path.length; i++) {
        var px = path[i][1] * cw + cw / 2, py = path[i][0] * ch + ch / 2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      for (i = 0; i < path.length; i++) {
        ctx.beginPath(); ctx.arc(path[i][1] * cw + cw / 2, path[i][0] * ch + ch / 2, 4, 0, 7);
        ctx.fillStyle = mode === 'sarsa' ? '#34D399' : '#F59E0B'; ctx.fill();
      }
      var last = returns.slice(-20), avg = last.reduce(function (s, v) { return s + v; }, 0) / (last.length || 1);
      if ($('rl-sarsa-return')) $('rl-sarsa-return').textContent = avg.toFixed(0);
      if ($('rl-sarsa-len')) $('rl-sarsa-len').textContent = (path.length - 1) + ' steps';
      if ($('rl-sarsa-path')) $('rl-sarsa-path').textContent =
        mode === 'sarsa' ? 'safe detour (top rows)' : 'optimal edge (risky)';
    }
    function retrain() { train(500); draw(); }
    seg('rl-sarsa-mode', function (v) { mode = v; retrain(); });
    if ($('rl-sarsa-run')) $('rl-sarsa-run').onclick = retrain;
    retrain();
  })();

  /* ============================ pg: Policy Gradients (softmax preferences) ============================ */
  (function pgLab() {
    var cv = $('rl-pg-cv'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, K = 4, alpha = 0.35;
    var LABELS = ['A0', 'A1', 'A2', 'A3'];
    var COLS = ['#22D3EE', '#34D399', '#F59E0B', '#A855F7'];
    var Hpref, pi;
    function softmax() {
      var m = Math.max.apply(null, Hpref), ex = Hpref.map(function (h) { return Math.exp(h - m); });
      var s = ex.reduce(function (a, b) { return a + b; }, 0);
      pi = ex.map(function (e) { return e / s; });
    }
    function reward(a) {
      // gradient-bandit step: push chosen action's preference up, others down
      softmax();
      for (var i = 0; i < K; i++) Hpref[i] += alpha * ((i === a ? 1 : 0) - pi[i]);
      draw();
    }
    function reset() { Hpref = [0, 0, 0, 0]; draw(); }
    function draw() {
      softmax();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      var padL = 20, padB = 40, padT = 20, padR = 20;
      var plotW = W - padL - padR, plotH = H - padB - padT, base = H - padB;
      var bw = plotW / K;
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.beginPath();
      ctx.moveTo(padL, base); ctx.lineTo(W - padR, base); ctx.stroke();
      for (var i = 0; i < K; i++) {
        var x = padL + i * bw, bh = pi[i] * plotH;
        ctx.fillStyle = COLS[i];
        ctx.fillRect(x + bw * 0.2, base - bh, bw * 0.6, bh);
        ctx.fillStyle = '#e8e8f0'; ctx.font = 'bold 13px JetBrains Mono, monospace'; ctx.textAlign = 'center';
        ctx.fillText((pi[i] * 100).toFixed(1) + '%', x + bw / 2, base - bh - 8);
        ctx.fillStyle = '#9a9aae'; ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(LABELS[i], x + bw / 2, base + 16);
        ctx.fillText('H=' + Hpref[i].toFixed(2), x + bw / 2, base + 30);
      }
      var pol = pi.map(function (p, idx) { return LABELS[idx] + ' ' + (p * 100).toFixed(0) + '%'; }).join('  ·  ');
      if ($('rl-pg-probs')) $('rl-pg-probs').textContent = pol;
      if ($('rl-pg-top')) $('rl-pg-top').textContent = LABELS[argmax(pi)];
    }
    for (var i = 0; i < K; i++) (function (idx) {
      var b = $('rl-pg-r' + idx); if (b) b.onclick = function () { reward(idx); };
    })(i);
    if ($('rl-pg-reset')) $('rl-pg-reset').onclick = reset;
    reset();
  })();

})();
