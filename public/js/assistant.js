/* ============================================================
   AI ATLAS — dynamic assistant (FAB + panel)
   ------------------------------------------------------------
   Data-driven: reads window.ATLAS_MODULES (the live module +
   lesson manifest) at runtime, so it always knows the current
   catalogue — every module and every lesson, with no hard-coded
   list. It fuzzy-matches whatever the user types, deep-links to
   the exact module AND tab (#tab-<lessonId>), and activates that
   tab on arrival. Fully self-styled so it renders on any page.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- self-contained styling ---------------- */
  var css = ''
    + '@keyframes atlbob{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}'
    + '#atlas-chat-fab{position:fixed;bottom:24px;right:24px;z-index:200;width:58px;height:58px;border-radius:50%;border:1px solid var(--stroke-hi,rgba(255,255,255,.16));cursor:pointer;'
    + 'background:radial-gradient(120% 120% at 30% 20%,#2a2350,#12121f);box-shadow:0 14px 34px -12px rgba(0,0,0,.7),0 0 0 0 rgba(99,102,241,.5);display:grid;place-items:center;transition:transform .25s,box-shadow .3s,opacity .2s}'
    + '#atlas-chat-fab:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 18px 40px -12px rgba(0,0,0,.75),0 0 0 6px rgba(99,102,241,.12)}'
    + '#atlas-chat-fab.hidden{opacity:0;pointer-events:none;transform:scale(.6)}'
    + '#atlas-chat-fab .face{width:30px;height:30px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}'
    + '#atlas-chat-fab .kabuto{position:absolute;top:9px;opacity:.95}'
    + '#atlas-chat-fab .ring{position:absolute;inset:-1px;border-radius:50%;border:1.5px solid transparent;border-top-color:rgba(139,140,246,.8);animation:atlspin 3.4s linear infinite}'
    + '@keyframes atlspin{to{transform:rotate(360deg)}}'
    + '#atlas-panel{position:fixed;bottom:24px;right:24px;z-index:201;width:378px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;'
    + 'border-radius:20px;border:1px solid var(--stroke-hi,rgba(255,255,255,.16));background:rgba(12,12,20,.9);backdrop-filter:blur(26px) saturate(1.5);-webkit-backdrop-filter:blur(26px) saturate(1.5);'
    + 'box-shadow:0 30px 80px -30px rgba(0,0,0,.85);opacity:0;transform:translateY(20px) scale(.96);pointer-events:none;transition:opacity .3s,transform .35s cubic-bezier(.2,.7,.3,1)}'
    + '#atlas-panel.open{opacity:1;transform:none;pointer-events:auto}'
    + '#atlas-panel .chat-head{display:flex;align-items:center;gap:11px;padding:15px 16px;border-bottom:1px solid var(--stroke,rgba(255,255,255,.09))}'
    + '#atlas-panel .samurai-av{width:34px;height:34px;border-radius:10px;flex:0 0 34px;display:grid;place-items:center;position:relative;background:radial-gradient(120% 120% at 30% 20%,#2a2350,#12121f);border:1px solid var(--stroke,rgba(255,255,255,.09))}'
    + '#atlas-panel .samurai-av img{width:19px;height:19px;object-fit:contain}'
    + '#atlas-panel .samurai-av .kabuto{position:absolute;top:5px}'
    + '#atlas-panel .chat-head .col{display:flex;flex-direction:column;flex:1;min-width:0}'
    + '#atlas-panel .chat-head .nm{font-family:var(--display,sans-serif);font-weight:600;font-size:14.5px;color:var(--ink,#ececf6)}'
    + '#atlas-panel .chat-head .st{font-size:11px;color:var(--emerald,#34d399);font-family:var(--mono,monospace);display:flex;align-items:center;gap:5px}'
    + '#atlas-panel .chat-head .st::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--emerald,#34d399);box-shadow:0 0 8px var(--emerald,#34d399)}'
    + '#atlas-close{margin-left:auto;background:transparent;border:0;color:var(--ink-mute,#7c7c92);font-size:16px;cursor:pointer;padding:4px 8px;border-radius:8px;transition:.15s}'
    + '#atlas-close:hover{background:var(--glass-2,rgba(255,255,255,.055));color:var(--ink,#ececf6)}'
    + '#atlas-log{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px}'
    + '#atlas-panel .msg{display:flex;gap:9px;max-width:100%}'
    + '#atlas-panel .msg.user{justify-content:flex-end}'
    + '#atlas-panel .msg-av{width:26px;height:26px;border-radius:7px;flex:0 0 26px;display:grid;place-items:center;background:linear-gradient(180deg,var(--indigo-lt,#8b8cf6),var(--indigo-dk,#4f46e5));color:#fff;font-size:11px;margin-top:2px}'
    + '#atlas-panel .msg-bub{padding:11px 14px;border-radius:14px;font-size:14px;line-height:1.55;max-width:82%;word-wrap:break-word}'
    + '#atlas-panel .msg.bot .msg-bub{background:var(--glass-2,rgba(255,255,255,.055));border:1px solid var(--stroke,rgba(255,255,255,.09));border-top-left-radius:5px;color:var(--ink,#ececf6)}'
    + '#atlas-panel .msg.user .msg-bub{background:linear-gradient(180deg,var(--indigo,#6366f1),var(--indigo-dk,#4f46e5));color:#fff;border-top-right-radius:5px}'
    + '#atlas-panel .msg-bub b{color:var(--indigo-lt,#8b8cf6);font-weight:600}'
    + '#atlas-panel .msg.user .msg-bub b{color:#fff}'
    + '#atlas-panel .msg-cta{margin-top:11px;display:flex;flex-wrap:wrap;gap:8px}'
    + '#atlas-panel .msg-cta .btn{font-size:12.5px;padding:7px 12px}'
    + '#atlas-panel .rel{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}'
    + '#atlas-panel .rel button{font-family:var(--mono,monospace);font-size:11.5px;padding:5px 10px;border-radius:999px;border:1px solid var(--stroke,rgba(255,255,255,.12));background:var(--glass,rgba(255,255,255,.035));color:var(--ink-soft,#b9b9cc);cursor:pointer;transition:.15s}'
    + '#atlas-panel .rel button:hover{border-color:var(--indigo-lt,#8b8cf6);color:var(--ink,#ececf6)}'
    + '#atlas-panel .typing{display:flex;gap:5px;align-items:center;padding:4px 2px}'
    + '#atlas-panel .typing i{width:7px;height:7px;border-radius:50%;background:var(--ink-mute,#7c7c92);animation:atlbob 1.2s infinite}'
    + '#atlas-panel .typing i:nth-child(2){animation-delay:.15s}#atlas-panel .typing i:nth-child(3){animation-delay:.3s}'
    + '#atlas-panel .chat-foot{border-top:1px solid var(--stroke,rgba(255,255,255,.09));padding:12px}'
    + '#atlas-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}'
    + '#atlas-chips button{font-family:var(--mono,monospace);font-size:11.5px;padding:6px 11px;border-radius:999px;border:1px solid var(--stroke,rgba(255,255,255,.12));background:var(--glass,rgba(255,255,255,.035));color:var(--ink-soft,#b9b9cc);cursor:pointer;transition:.15s;white-space:nowrap}'
    + '#atlas-chips button:hover{border-color:var(--indigo-lt,#8b8cf6);color:var(--ink,#ececf6)}'
    + '#atlas-form{display:flex;gap:8px;align-items:center}'
    + '#atlas-input{flex:1;padding:11px 14px;border-radius:12px;border:1px solid var(--stroke,rgba(255,255,255,.12));background:rgba(12,12,20,.6);color:var(--ink,#ececf6);font:inherit;font-size:14px;outline:none;transition:.15s}'
    + '#atlas-input:focus{border-color:var(--indigo,#6366f1)}'
    + '#atlas-send{flex:0 0 auto;width:40px;height:40px;border-radius:11px;border:0;cursor:pointer;background:linear-gradient(180deg,var(--indigo-lt,#8b8cf6),var(--indigo-dk,#4f46e5));display:grid;place-items:center;transition:.15s}'
    + '#atlas-send:hover{filter:brightness(1.1)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var KABUTO = '<svg class="kabuto" width="30" height="14" viewBox="0 0 46 22" fill="none"><path d="M3 21 C5 2 41 2 43 21 C35 9 11 9 3 21 Z" fill="url(#kga)"/><defs><linearGradient id="kga" x1="0" y1="0" x2="0" y2="22"><stop stop-color="#FCD34D"/><stop offset="1" stop-color="#C2410C"/></linearGradient></defs></svg>';

  /* ---------------- markup ---------------- */
  var fab = document.createElement('button');
  fab.id = 'atlas-chat-fab'; fab.setAttribute('aria-label', 'Open Atlas guide');
  fab.innerHTML = '<span class="ring"></span>' + KABUTO + '<img class="face" src="/assets/atlas-mark.png" alt=""/>';
  document.body.appendChild(fab);

  var panel = document.createElement('section');
  panel.id = 'atlas-panel';
  panel.innerHTML =
    '<div class="chat-head"><div class="samurai-av">' + KABUTO + '<img src="/assets/atlas-mark.png" alt=""/></div>'
    + '<div class="col"><span class="nm">Atlas Guide</span><span class="st" id="atlas-status">online</span></div>'
    + '<button id="atlas-close" aria-label="Close">✕</button></div>'
    + '<div id="atlas-log"></div>'
    + '<div class="chat-foot"><div id="atlas-chips"></div>'
    + '<form id="atlas-form"><input id="atlas-input" type="text" placeholder="Ask about any AI topic…" autocomplete="off"/>'
    + '<button id="atlas-send" type="submit" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 8 6 8-16-8Z" fill="#fff"/></svg></button></form></div>';
  document.body.appendChild(panel);

  var log = panel.querySelector('#atlas-log');

  /* ---------------- live catalogue index ---------------- */
  var MODS = (window.ATLAS_MODULES || []).slice();
  var byId = {}; MODS.forEach(function (m) { byId[m.id] = m; });

  function tokens(s) { return (String(s).toLowerCase().match(/[a-z0-9]+/g) || []).filter(function (t) { return t.length > 1; }); }

  // one searchable entry per module and per lesson (deep-links to #tab-<lessonId>)
  var ITEMS = [];
  MODS.forEach(function (m) {
    ITEMS.push({ kind: 'module', mod: m, id: m.id, label: m.title, href: m.href, terms: tokens(m.title + ' ' + m.id) });
    (m.lessons || []).forEach(function (l) {
      ITEMS.push({ kind: 'lesson', mod: m, id: l.id, label: l.label, href: m.href + '#tab-' + l.id, terms: tokens(l.label + ' ' + m.title) });
    });
  });
  var LESSON_COUNT = ITEMS.filter(function (i) { return i.kind === 'lesson'; }).length;

  // phrasing → module id, to catch synonyms the labels don't contain
  var SYN = {
    'neural': 'deep-learning', 'network': 'deep-learning', 'backprop': 'deep-learning', 'perceptron': 'deep-learning', 'activation': 'deep-learning', 'optimizer': 'deep-learning', 'dropout': 'deep-learning',
    'attention': 'transformers', 'transformer': 'transformers', 'self-attention': 'transformers', 'gpt': 'transformers', 'bert': 'transformers', 'positional': 'transformers', 'context window': 'transformers',
    'llm': 'llm-agents', 'agent': 'llm-agents', 'tool call': 'llm-agents', 'lora': 'llm-agents', 'fine-tune': 'llm-agents', 'fine tune': 'llm-agents', 'quantiz': 'llm-agents', 'vram': 'llm-agents', 'rlhf': 'llm-agents',
    'regression': 'machine-learning', 'classif': 'machine-learning', 'cluster': 'machine-learning', 'k-means': 'machine-learning', 'kmeans': 'machine-learning', 'svm': 'machine-learning', 'random forest': 'machine-learning', 'xgboost': 'machine-learning', 'ensemble': 'machine-learning', 'overfit': 'machine-learning', 'knn': 'machine-learning',
    'vector': 'mathematics', 'matrix': 'mathematics', 'gradient': 'mathematics', 'eigen': 'mathematics', 'calculus': 'mathematics', 'derivative': 'mathematics', 'probability': 'mathematics', 'statistics': 'mathematics', 'distribution': 'mathematics', 'linear algebra': 'mathematics', 'pca': 'mathematics', 'entropy': 'mathematics',
    'diffusion': 'generative', 'gan': 'generative', 'vae': 'generative', 'latent': 'generative', 'stable diffusion': 'generative', 'text to image': 'generative', 'text-to-image': 'generative',
    'sql': 'data-analysis', 'query': 'data-analysis', 'dashboard': 'data-analysis', 'eda': 'data-analysis', 'a/b': 'data-analysis', 'correlation': 'data-analysis', 'pandas query': 'data-analysis',
    'etl': 'etl', 'airflow': 'etl', 'spark': 'etl', 'kafka': 'etl', 'warehouse': 'etl', 'dag': 'etl', 'data engineering': 'etl', 'feature store': 'etl',
    'shap': 'xai', 'lime': 'xai', 'explain': 'xai', 'interpret': 'xai', 'saliency': 'xai', 'grad-cam': 'xai', 'gradcam': 'xai', 'counterfactual': 'xai',
    'deploy': 'mlops', 'drift': 'mlops', 'monitor': 'mlops', 'mlflow': 'mlops', 'registry': 'mlops', 'ci/cd': 'mlops', 'retrain': 'mlops', 'production': 'mlops',
    'python': 'programming', 'pandas': 'programming', 'numpy': 'programming', 'pytorch': 'programming', 'tensorflow': 'programming', 'nosql': 'programming', 'docker': 'programming', 'library': 'programming', 'container': 'programming',
    'token': 'nlp', 'embedding': 'nlp', 'word2vec': 'nlp', 'tfidf': 'nlp', 'tf-idf': 'nlp', 'sentiment': 'nlp', 'n-gram': 'nlp', 'ngram': 'nlp', 'named entit': 'nlp', 'language model': 'nlp',
    'vision': 'cv', 'image': 'cv', 'convolution': 'cv', 'kernel': 'cv', 'object detection': 'cv', 'segmentation': 'cv', 'yolo': 'cv', 'pixel': 'cv', 'cnn': 'cv', 'pooling': 'cv', 'augmentation': 'cv',
    'reinforcement': 'rl', 'reward': 'rl', 'q-learning': 'rl', 'q learning': 'rl', 'bandit': 'rl', 'policy': 'rl', 'mdp': 'rl', 'bellman': 'rl', 'sarsa': 'rl', 'exploration': 'rl',
    'time series': 'timeseries', 'forecast': 'timeseries', 'arima': 'timeseries', 'seasonal': 'timeseries', 'trend': 'timeseries', 'autocorrelation': 'timeseries', 'stationar': 'timeseries', 'anomaly': 'timeseries',
    'prompt': 'prompting', 'chain-of-thought': 'prompting', 'chain of thought': 'prompting', 'few-shot': 'prompting', 'few shot': 'prompting', 'zero-shot': 'prompting', 'jailbreak': 'prompting', 'injection': 'prompting', 'structured output': 'prompting',
    'bias': 'ethics', 'fairness': 'ethics', 'ethic': 'ethics', 'privacy': 'ethics', 'differential privacy': 'ethics', 'alignment': 'ethics', 'governance': 'ethics', 'regulation': 'ethics', 'red team': 'ethics', 'red-team': 'ethics', 'responsible': 'ethics',
    'workflow': 'foundations', 'history of ai': 'foundations', 'pipeline': 'foundations', 'what is ai': 'foundations', 'lifecycle': 'foundations'
  };

  function search(query) {
    var q = query.toLowerCase();
    var qtok = tokens(query);
    var boost = {};
    Object.keys(SYN).forEach(function (k) { if (q.indexOf(k) !== -1 && byId[SYN[k]]) boost[SYN[k]] = (boost[SYN[k]] || 0) + 3; });
    return ITEMS.map(function (it) {
      var s = 0;
      qtok.forEach(function (t) {
        it.terms.forEach(function (w) {
          if (w === t) s += it.kind === 'lesson' ? 3 : 2;
          else if (t.length >= 3 && w.indexOf(t) === 0) s += 1.2;
          else if (w.length >= 4 && t.indexOf(w) !== -1) s += 0.6;
        });
      });
      if (q.length >= 3 && it.label.toLowerCase().indexOf(q) !== -1) s += 5;
      if (boost[it.mod.id]) s += boost[it.mod.id] * (it.kind === 'lesson' ? 0.4 : 1);
      return { it: it, s: s };
    }).filter(function (x) { return x.s > 0.5; }).sort(function (a, b) { return b.s - a.s; });
  }

  /* ---------------- rendering ---------------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function add(role, html) {
    var row = document.createElement('div'); row.className = 'msg ' + role;
    row.innerHTML = role === 'bot'
      ? '<div class="msg-av">◆</div><div class="msg-bub">' + html + '</div>'
      : '<div class="msg-bub">' + html + '</div>';
    log.appendChild(row); log.scrollTop = log.scrollHeight;
    return row;
  }

  function answer(text) {
    var results = search(text);
    if (!MODS.length) { add('bot', 'The module catalogue has not loaded yet — try reloading the page.'); return; }
    if (!results.length) {
      add('bot', "I could not match that to a lesson. Try a topic like <b>attention</b>, <b>convolution</b>, <b>Q-learning</b>, <b>diffusion</b> or <b>SQL</b> — or open the <b><a style=\"color:var(--indigo-lt)\" href=\"/atlas/\">full module map</a></b>.");
      return;
    }
    var top = results[0].it;
    var body, cta;
    if (top.kind === 'lesson') {
      body = '<b>' + esc(top.label) + '</b> is a lesson in the <b>' + esc(top.mod.title) + '</b> module. Jump straight into the live playground:';
      cta = '<a class="btn btn-primary btn-sm" href="' + top.href + '">Open “' + esc(top.label) + '” ›</a>';
    } else {
      var ls = (top.mod.lessons || []).map(function (l) { return l.label; });
      var preview = ls.slice(0, 4).join(', ') + (ls.length > 4 ? ', and more' : '');
      body = 'The <b>' + esc(top.mod.title) + '</b> module has ' + ls.length + ' interactive lessons — ' + esc(preview) + '.';
      cta = '<a class="btn btn-primary btn-sm" href="' + top.href + '">Open ' + esc(top.mod.title) + ' ›</a>';
    }
    // related: next few distinct lessons
    var seen = {}; seen[top.label] = 1;
    var rel = [];
    for (var i = 1; i < results.length && rel.length < 3; i++) {
      var r = results[i].it;
      if (seen[r.label]) continue; seen[r.label] = 1;
      rel.push(r);
    }
    var relHtml = rel.length
      ? '<div class="rel">' + rel.map(function (r) { return '<button data-go="' + r.href + '">' + esc(r.label) + '</button>'; }).join('') + '</div>'
      : '';
    add('bot', body + '<div class="msg-cta">' + cta + '</div>' + relHtml);
  }

  function respond(text) {
    var t = document.createElement('div'); t.className = 'msg bot';
    t.innerHTML = '<div class="msg-av">◆</div><div class="msg-bub"><div class="typing"><i></i><i></i><i></i></div></div>';
    log.appendChild(t); log.scrollTop = log.scrollHeight;
    setTimeout(function () { t.remove(); answer(text); }, 480);
  }

  /* ---------------- greeting + dynamic chips ---------------- */
  add('bot', "Hi — I am your Atlas guide. I know all <b>" + MODS.length + " modules</b> and <b>" + LESSON_COUNT + " lessons</b>. Ask about any AI topic and I will take you straight to the live playground.");

  var CHIP_PREF = ['transformers/attn', 'cv/conv', 'rl/qlearn', 'generative/generative', 'machine-learning/reg', 'nlp/tok', 'timeseries/forecast', 'ethics/fair'];
  var chips = [];
  CHIP_PREF.forEach(function (ref) {
    if (chips.length >= 5) return;
    var parts = ref.split('/'), m = byId[parts[0]]; if (!m) return;
    var l = (m.lessons || []).filter(function (x) { return x.id === parts[1]; })[0] || m.lessons[0];
    if (l) chips.push({ label: l.label, q: l.label });
  });
  if (chips.length < 3) { MODS.slice(0, 5).forEach(function (m) { if (chips.length < 5) chips.push({ label: m.title, q: m.title }); }); }
  var chipsEl = panel.querySelector('#atlas-chips');
  chipsEl.innerHTML = chips.map(function (c) { return '<button data-q="' + esc(c.q) + '">' + esc(c.label) + '</button>'; }).join('');

  /* ---------------- interaction ---------------- */
  var input = panel.querySelector('#atlas-input');
  function open() { panel.classList.add('open'); fab.classList.add('hidden'); setTimeout(function () { input.focus(); }, 250); }
  function close() { panel.classList.remove('open'); fab.classList.remove('hidden'); }
  fab.addEventListener('click', open);
  panel.querySelector('#atlas-close').addEventListener('click', close);
  panel.querySelector('#atlas-form').addEventListener('submit', function (e) {
    e.preventDefault(); var v = input.value.trim(); if (!v) return; add('user', esc(v)); input.value = ''; respond(v);
  });
  chipsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (!b) return; add('user', esc(b.dataset.q)); respond(b.dataset.q); });
  log.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) location.assign(b.getAttribute('data-go')); });
  document.addEventListener('keydown', function (e) { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); } });

  /* ---------------- deep-link → activate a tab ---------------- */
  function activateFromHash() {
    var h = location.hash || '';
    if (h.indexOf('#tab-') !== 0) return;
    var el = document.getElementById(h.slice(1));           // e.g. tab-eigen
    if (el && el.classList.contains('tab')) {
      el.click();
      try { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
    }
  }
  // runs after the module's own inline tab script has wired up (DOMContentLoaded fires after both)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', activateFromHash);
  else activateFromHash();
  window.addEventListener('hashchange', activateFromHash);   // same-page jumps from related chips
})();
