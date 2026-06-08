/* ============================================================
   AI ATLAS — reusable assistant (FAB + panel), path-aware
   ============================================================ */
(function () {
  'use strict';
  const inModules = location.pathname.includes('/modules/');
  const M = inModules ? '' : 'modules/';
  const R = inModules ? '../' : '';

  const css = `
  #atlas-chat-fab{position:fixed;bottom:24px;right:24px;z-index:200}
  #atlas-panel{position:fixed;bottom:24px;right:24px;z-index:201;width:370px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 48px);display:flex;flex-direction:column;overflow:hidden;border-radius:var(--r-lg);border:1px solid var(--stroke-hi);background:rgba(12,12,20,.88);backdrop-filter:blur(26px) saturate(1.5);box-shadow:var(--shadow);opacity:0;transform:translateY(20px) scale(.96);pointer-events:none;transition:opacity .3s,transform .35s cubic-bezier(.2,.7,.3,1)}
  #atlas-panel.open{opacity:1;transform:none;pointer-events:auto}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const fab = document.createElement('button');
  fab.id = 'atlas-chat-fab'; fab.className = 'samurai-fab'; fab.setAttribute('aria-label', 'Open Atlas Ronin');
  fab.innerHTML = `<span class="ring"></span><svg class="kabuto" width="44" height="21" viewBox="0 0 46 22" fill="none"><path d="M3 21 C5 2 41 2 43 21 C35 9 11 9 3 21 Z" fill="url(#kga)"/><defs><linearGradient id="kga" x1="0" y1="0" x2="0" y2="22"><stop stop-color="#FCD34D"/><stop offset="1" stop-color="#C2410C"/></linearGradient></defs></svg><img class="face" src="${R}assets/atlas-mark.png" alt=""/><span class="visor"></span>`;
  document.body.appendChild(fab);

  const panel = document.createElement('section');
  panel.id = 'atlas-panel';
  panel.innerHTML = `
    <div class="chat-head"><div class="samurai-av"><svg class="kabuto" width="28" height="14" viewBox="0 0 46 22" fill="none"><path d="M3 21 C5 2 41 2 43 21 C35 9 11 9 3 21 Z" fill="url(#kgb)"/><defs><linearGradient id="kgb" x1="0" y1="0" x2="0" y2="22"><stop stop-color="#FCD34D"/><stop offset="1" stop-color="#C2410C"/></linearGradient></defs></svg><img src="${R}assets/atlas-mark.png" alt=""/></div><div class="col"><span class="nm">Atlas Ronin</span><span class="st">online · your AI samurai guide</span></div><button id="atlas-close" aria-label="Close">✕</button></div>
    <div id="atlas-log"></div>
    <div class="chat-foot">
      <div id="atlas-chips">
        <button data-q="Show me transformer attention">Attention</button>
        <button data-q="Explain neural networks">Neural nets</button>
        <button data-q="How does linear regression work">Regression</button>
        <button data-q="Show me diffusion">Diffusion</button>
        <button data-q="Build an ETL pipeline">ETL</button>
      </div>
      <form id="atlas-form"><input id="atlas-input" type="text" placeholder="Ask anything about AI…" autocomplete="off"/><button id="atlas-send" type="submit" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 8 6 8-16-8Z" fill="#fff"/></svg></button></form>
    </div>`;
  document.body.appendChild(panel);

  const log = panel.querySelector('#atlas-log');
  log.className = ''; log.id = 'atlas-log';
  log.style.cssText = 'flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px';
  // reuse chat styles from landing.css class names by aliasing: copy needed inline
  const greet = document.createElement('div');
  greet.className = 'msg bot'; greet.innerHTML = `<div class="msg-av">◆</div><div class="msg-bub">Hi! Ask about any AI concept and I'll explain it, then jump you to the live playground.</div>`;
  log.appendChild(greet);

  const intents = [
    { k: ['attention','transformer','self-attention','head'], title:'Transformers', href:M+'transformers.html', say:'Attention lets every token look at every other token. Each emits a <b>query</b>, <b>key</b> and <b>value</b> — the dot-product of queries and keys is the attention weight. Opening the playground with the heatmap live →' },
    { k:['neural','backprop','network','perceptron','deep'], title:'Deep Learning', href:M+'deep-learning.html', say:'A neural net stacks weighted sums + nonlinearities; <b>backpropagation</b> nudges weights down the loss gradient. Launching the Deep Learning Lab →' },
    { k:['regression','linear','fit','least squares'], title:'Machine Learning', href:M+'machine-learning.html', say:'Linear regression finds the line minimizing squared error. Drag points and watch the fit chase your data → opening the ML Playground.' },
    { k:['vector','matrix','eigen','gradient','math','calculus'], title:'Mathematics', href:M+'mathematics.html', say:'AI math is mostly linear algebra + calculus. Drag vectors, multiply matrices, roll a ball down a loss surface → opening Mathematics.' },
    { k:['diffusion','image','generate','gan','generative'], title:'Generative AI', href:M+'generative.html', say:'Diffusion models reverse noise into an image step by step. Scrub the timeline → opening the Generative AI Lab.' },
    { k:['etl','pipeline','airflow','dag','data engineering'], title:'ETL', href:M+'etl.html', say:'ETL = Extract, Transform, Load. Build a DAG and simulate data flow → opening ETL & Data Engineering.' },
    { k:['agent','llm','build llm','local','vram','gpu','fine-tune','lora','rlhf','quantize','quantization'], title:'LLM & Agents', href:M+'llm-agents.html', say:'Build an LLM from tokenizer to RLHF, size it to your GPU\'s VRAM, and wire up a tool-using agent loop → opening the LLM & Agents Lab.' },
    { k:['shap','lime','explain','xai','saliency'], title:'Explainable AI', href:M+'xai.html', say:'Explainability asks <i>why</i> a model decided. SHAP attributes each feature\'s push → opening Explainable AI.' },
    { k:['mlops','deploy','drift','monitor','registry'], title:'MLOps', href:M+'mlops.html', say:'MLOps keeps models healthy in production: deploy, monitor, detect drift → opening MLOps.' },
    { k:['sql','data analysis','statistics','dashboard','query','distribution','a/b','ab test','visualize','chart'], title:'Data Analysis', href:M+'data-analysis.html', say:'Run real SQL on a sample dataset and build a cross-filtering dashboard → opening Data Analysis.' },
    { k:['python','golang','go ','rust','code','compiler','numpy','pandas','pytorch','tensorflow','scikit','nosql','language','library'], title:'Code & Stack', href:M+'programming.html', say:'Run Python, R and Go in a playground, explore the data-science stack (NumPy → PyTorch), and compare SQL vs NoSQL → opening Code & Stack.' },
  ];

  function add(role, html) {
    const row = document.createElement('div'); row.className = 'msg ' + role;
    row.innerHTML = role === 'bot' ? `<div class="msg-av">◆</div><div class="msg-bub">${html}</div>` : `<div class="msg-bub">${html}</div>`;
    log.appendChild(row); log.scrollTop = log.scrollHeight;
  }
  function respond(text) {
    const q = text.toLowerCase();
    const hit = intents.find(it => it.k.some(k => q.includes(k)));
    const t = document.createElement('div'); t.className='msg bot'; t.innerHTML=`<div class="msg-av">◆</div><div class="msg-bub typing"><i></i><i></i><i></i></div>`;
    log.appendChild(t); log.scrollTop = log.scrollHeight;
    setTimeout(() => { t.remove();
      if (hit) add('bot', hit.say + `<div class="msg-cta"><a class="btn btn-primary btn-sm" href="${hit.href}">Open ${hit.title} ›</a></div>`);
      else add('bot', 'Try asking about <b>attention</b>, <b>neural networks</b>, <b>linear regression</b>, <b>diffusion</b>, or <b>ETL</b> — or tap a chip below.');
    }, 700);
  }

  const open = () => { panel.classList.add('open'); fab.classList.add('hidden'); setTimeout(()=>panel.querySelector('#atlas-input').focus(),250); };
  fab.addEventListener('click', open);
  panel.querySelector('#atlas-close').addEventListener('click', () => { panel.classList.remove('open'); fab.classList.remove('hidden'); });
  panel.querySelector('#atlas-form').addEventListener('submit', (e) => { e.preventDefault(); const i = panel.querySelector('#atlas-input'); const v = i.value.trim(); if (!v) return; add('user', v); i.value=''; respond(v); });
  panel.querySelector('#atlas-chips').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (!b) return; add('user', b.dataset.q); respond(b.dataset.q); });

  document.addEventListener('keydown', (e) => { if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); open(); } });
})();
