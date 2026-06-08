/* ============================================================
   AI ATLAS — shared app shell
   Injects sidebar nav + mobile toggle + compact assistant.
   Pages set <body data-page="..."> and live in /modules/* or root.
   ============================================================ */
(function () {
  'use strict';
  const page = document.body.dataset.page || '';
  // path prefix: module pages live in /modules, hub at root
  const inModules = location.pathname.includes('/modules/');
  const R = inModules ? '../' : '';        // root
  const M = inModules ? '' : 'modules/';   // modules dir

  const I = {
    home:  '<path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
    math:  '<path d="M4 4h12M7 4l3 6-3 6h6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    ml:    '<circle cx="5" cy="6" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="14" cy="14" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M7 7l5 5" stroke="currentColor" stroke-width="1.4"/>',
    dl:    '<circle cx="4" cy="10" r="1.6" fill="currentColor"/><circle cx="10" cy="5" r="1.6" fill="currentColor"/><circle cx="10" cy="15" r="1.6" fill="currentColor"/><circle cx="16" cy="10" r="1.6" fill="currentColor"/><path d="M5.4 9L9 6m1 1.4v5M11 6l3.4 3M11 14l3.4-3" stroke="currentColor" stroke-width="1.2"/>',
    tf:    '<rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M7 7h6M7 10h6M7 13h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    gen:   '<path d="M10 3l1.8 4.2L16 9l-4.2 1.8L10 15l-1.8-4.2L4 9l4.2-1.8z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/>',
    xai:   '<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M13 13l4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    etl:   '<rect x="3" y="4" width="5" height="4" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="12" y="4" width="5" height="4" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><rect x="7.5" y="12" width="5" height="4" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M5.5 8v2h9V8M10 10v2" stroke="currentColor" stroke-width="1.3" fill="none"/>',
    ops:   '<path d="M10 3v3M10 14v3M3 10h3M14 10h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="10" cy="10" r="3.2" stroke="currentColor" stroke-width="1.4" fill="none"/>',
    research: '<path d="M8 3v5l-4 7a1 1 0 0 0 .9 1.5h10.2A1 1 0 0 0 16 15l-4-7V3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M7 3h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    llm: '<rect x="3" y="4" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M7 16l3-3 3 3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><circle cx="7" cy="8.5" r="1.1" fill="currentColor"/><circle cx="10" cy="8.5" r="1.1" fill="currentColor"/><circle cx="13" cy="8.5" r="1.1" fill="currentColor"/>',
    data: '<path d="M3 5v10c0 1.1 3.1 2 7 2s7-.9 7-2V5" stroke="currentColor" stroke-width="1.4" fill="none"/><ellipse cx="10" cy="5" rx="7" ry="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M3 10c0 1.1 3.1 2 7 2s7-.9 7-2" stroke="currentColor" stroke-width="1.2" fill="none" opacity=".6"/>',
    code: '<path d="M7 6l-4 4 4 4M13 6l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  };

  const NAV = [
    { group: 'Overview', items: [
      { id: 'hub', label: 'Atlas Home', icon: I.home, href: R + 'app.html' },
    ]},
    { group: 'Foundations', items: [
      { id: 'mathematics', label: 'Mathematics', icon: I.math, href: M + 'mathematics.html', badge: '4' },
      { id: 'data-analysis', label: 'Data Analysis', icon: I.data, href: M + 'data-analysis.html', badge: 'SQL' },
      { id: 'machine-learning', label: 'Machine Learning', icon: I.ml, href: M + 'machine-learning.html', badge: '4' },
      { id: 'deep-learning', label: 'Deep Learning Lab', icon: I.dl, href: M + 'deep-learning.html', badge: '4' },
    ]},
    { group: 'Language & Generation', items: [
      { id: 'transformers', label: 'Transformers & LLMs', icon: I.tf, href: M + 'transformers.html' },
      { id: 'llm-agents', label: 'LLM & Agents Lab', icon: I.llm, href: M + 'llm-agents.html', badge: 'new' },
      { id: 'generative', label: 'Generative AI', icon: I.gen, href: M + 'generative.html' },
      { id: 'xai', label: 'Explainable AI', icon: I.xai, href: M + 'xai.html' },
    ]},
    { group: 'Systems & Research', items: [
      { id: 'programming', label: 'Code & Stack', icon: I.code, href: M + 'programming.html', badge: 'new' },
      { id: 'etl', label: 'ETL & Data Eng.', icon: I.etl, href: M + 'etl.html' },
      { id: 'mlops', label: 'MLOps', icon: I.ops, href: M + 'mlops.html' },
      { id: 'research', label: 'Research Lab', icon: I.research, href: M + 'research.html' },
    ]},
  ];

  const mark = `<img class="brand-mark" src="${R}assets/atlas-mark.png" alt="" style="width:26px;height:26px" />`;

  let html = `<aside class="side" id="side">
    <a class="side-brand" href="${R}index.html">${mark} AI Atlas</a>
    <div class="side-search" onclick="document.getElementById('atlas-chat-fab')&&document.getElementById('atlas-chat-fab').click()">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      Ask Atlas… <span class="kbd">⌘K</span>
    </div>`;
  NAV.forEach(g => {
    html += `<div class="side-group">${g.group}</div>`;
    g.items.forEach(it => {
      const active = it.id === page ? ' active' : '';
      html += `<a class="side-link${active}" href="${it.href}"><span class="si"><svg viewBox="0 0 20 20" width="18" height="18">${it.icon}</svg></span>${it.label}${it.badge ? `<span class="badge">${it.badge}</span>` : ''}</a>`;
    });
  });
  html += `<div class="side-foot"><div class="side-profile">
      <span class="av">YU</span>
      <div><div class="nm">Your Atlas</div><div class="sub">Free explorer</div></div>
    </div></div></aside>`;

  const mount = document.getElementById('shell-side');
  if (mount) mount.outerHTML = html;

  // mobile toggle
  const side = document.getElementById('side');
  const scrim = document.getElementById('scrim');
  window.toggleSide = () => { side.classList.toggle('open'); if (scrim) scrim.classList.toggle('show'); };
  if (scrim) scrim.addEventListener('click', () => { side.classList.remove('open'); scrim.classList.remove('show'); });
})();
