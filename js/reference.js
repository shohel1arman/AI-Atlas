/* ============================================================
   AI ATLAS — Deep-dive content layer  (loader + renderer)
   ------------------------------------------------------------
   Each module gets a rich, example-driven written companion that
   goes far beyond the interactive tabs: full explanations, worked
   examples, formulas, code and comparison tables.

   Content lives in one file per page: js/deepdive/<page>.js, which
   calls  window.AtlasRef.register('<page>', { color, lead, sections })
   This file (loaded on every module page) defines the renderer,
   auto-injects the matching content file, and mounts it at the
   bottom of .page. No per-page HTML edits needed.

   Section schema (all fields except `h` optional):
     { h, p:[html…], eqn, code, note,
       ex:[ { h, p:[html…], eqn, code } ],
       terms:[ [term, def] ],
       table:{ cols:[…], rows:[[…]] } }
   ============================================================ */
(function () {
  'use strict';

  var page = document.body.dataset.page || '';
  var inModules = location.pathname.indexOf('/modules/') !== -1;
  var ROOT = inModules ? '../' : '';

  var store = {};       // page -> data
  var mounted = false;

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------- render helpers ---------- */
  function paras(arr){ return (arr||[]).map(function(t){ return '<p class="rf-p">'+t+'</p>'; }).join(''); }
  function eqnHTML(e){ return e ? '<div class="rf-eqn">'+esc(e)+'</div>' : ''; }
  function codeHTML(c){ return c ? '<pre class="rf-code"><code>'+esc(c)+'</code></pre>' : ''; }
  function noteHTML(n){ return n ? '<p class="rf-note">'+n+'</p>' : ''; }
  function termsHTML(t){ if(!t) return '';
    return '<div class="rf-terms">'+t.map(function(kv){
      return '<div class="rf-term"><b>'+kv[0]+'</b><span>'+kv[1]+'</span></div>'; }).join('')+'</div>'; }
  function tableHTML(tb){ if(!tb) return '';
    return '<div class="rf-tablewrap"><table class="rf-table"><thead><tr>'+
      tb.cols.map(function(c){ return '<th>'+esc(c)+'</th>'; }).join('')+'</tr></thead><tbody>'+
      tb.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+
      '</tbody></table></div>'; }
  function exHTML(exs){ if(!exs) return '';
    return exs.map(function(x){
      return '<div class="rf-ex"><div class="rf-ex-h"><span class="rf-ex-badge">Example</span>'+(x.h?esc(x.h):'')+'</div>'+
        paras(x.p)+eqnHTML(x.eqn)+codeHTML(x.code)+'</div>'; }).join(''); }

  function sectionHTML(s){
    var body = paras(s.p) + eqnHTML(s.eqn) + termsHTML(s.terms) + exHTML(s.ex) + codeHTML(s.code) + tableHTML(s.table) + noteHTML(s.note);
    return '<details class="rf-sec"><summary><span class="rf-dot"></span><span class="rf-h">'+esc(s.h)+'</span>'+
      '<svg class="rf-chev" width="14" height="14" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>'+
      '<div class="rf-body">'+body+'</div></details>';
  }

  function blockHTML(R){
    return '<section class="rf-wrap" style="--rc:'+(R.color||'#8B8CF6')+'">'+
      '<div class="rf-head"><span class="rf-eyebrow">Deep dive</span>'+
      '<h2>'+esc(R.title||'Everything in this module')+'</h2>'+
      '<p class="rf-lead">'+(R.lead||'')+' Expand any topic below — the complete written course behind the playgrounds, with worked examples and code.</p>'+
      '<div class="rf-tools"><button class="rf-btn" id="rf-expand">Expand all</button><button class="rf-btn" id="rf-collapse">Collapse all</button><span class="rf-count" id="rf-count"></span></div></div>'+
      R.sections.map(sectionHTML).join('')+
      '</section>';
  }

  function render(){
    if (mounted) return;
    var R = store[page];
    if (!R || !R.sections || !R.sections.length) return;
    var pageEl = document.querySelector('.page');
    if (!pageEl || pageEl.querySelector('.rf-wrap')) return;
    injectStyles();
    pageEl.insertAdjacentHTML('beforeend', blockHTML(R));
    mounted = true;
    var all = pageEl.querySelectorAll('.rf-sec');
    var cnt = document.getElementById('rf-count');
    if (cnt) cnt.textContent = all.length + ' topics';
    var ex = document.getElementById('rf-expand'), co = document.getElementById('rf-collapse');
    if (ex) ex.onclick = function(){ all.forEach(function(d){ d.open = true; }); };
    if (co) co.onclick = function(){ all.forEach(function(d){ d.open = false; }); };
  }

  /* public registration API used by js/deepdive/<page>.js */
  window.AtlasRef = {
    register: function(pg, data){
      store[pg] = data;
      if (pg === page) whenReady(render);
    }
  };

  function whenReady(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* dynamically load this page's content file */
  if (page) {
    var s = document.createElement('script');
    s.src = ROOT + 'js/deepdive/' + page + '.js';
    s.async = true;
    s.onerror = function(){ /* no deep-dive file for this page yet — fine */ };
    document.head.appendChild(s);
  }

  /* ---------- styles ---------- */
  function injectStyles(){
    if (document.getElementById('rf-css')) return;
    var css = ''+
      '.rf-wrap{margin:54px 0 8px;border-top:1px solid var(--stroke);padding-top:36px}'+
      '.rf-head{margin-bottom:22px}'+
      '.rf-eyebrow{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--rc);opacity:.95}'+
      '.rf-head h2{font-size:26px;margin:9px 0 9px;letter-spacing:-.01em}'+
      '.rf-lead{color:var(--ink-soft);font-size:15px;line-height:1.65;max-width:820px;margin:0 0 16px}'+
      '.rf-tools{display:flex;align-items:center;gap:10px}'+
      '.rf-btn{font-family:var(--mono);font-size:12px;padding:6px 12px;border-radius:999px;border:1px solid var(--stroke);background:var(--glass);color:var(--ink-mute);cursor:pointer;transition:.15s}'+
      '.rf-btn:hover{border-color:var(--rc);color:var(--ink)}'+
      '.rf-count{font-family:var(--mono);font-size:12px;color:var(--ink-mute);margin-left:auto}'+
      '.rf-sec{border:1px solid var(--stroke);border-radius:14px;background:var(--glass);margin-bottom:11px;overflow:hidden;transition:border-color .2s}'+
      '.rf-sec[open]{background:var(--glass-2);border-color:var(--stroke-hi)}'+
      '.rf-sec summary{display:flex;align-items:center;gap:12px;cursor:pointer;padding:16px 18px;font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink);list-style:none;user-select:none}'+
      '.rf-sec summary::-webkit-details-marker{display:none}'+
      '.rf-dot{width:8px;height:8px;border-radius:50%;background:var(--rc);flex:0 0 auto;box-shadow:0 0 10px var(--rc)}'+
      '.rf-h{flex:1}'+
      '.rf-chev{margin-left:auto;color:var(--ink-mute);transition:transform .2s;flex:0 0 auto}'+
      '.rf-sec[open] .rf-chev{transform:rotate(180deg)}'+
      '.rf-body{padding:2px 20px 20px 38px}'+
      '.rf-p{color:var(--ink-soft);font-size:14.5px;line-height:1.75;margin:0 0 13px}'+
      '.rf-p b{color:var(--ink)}'+
      '.rf-p code,.rf-note code{font-family:var(--mono);font-size:.9em;background:rgba(255,255,255,.06);border:1px solid var(--stroke);border-radius:5px;padding:1px 5px;color:var(--cyan)}'+
      '.rf-eqn{font-family:var(--mono);font-size:13.5px;line-height:1.7;color:var(--cyan);background:#0c0c16;border:1px solid var(--stroke);border-left:3px solid var(--rc);border-radius:10px;padding:13px 15px;margin:0 0 15px;overflow-x:auto;white-space:pre-wrap}'+
      '.rf-code{font-family:var(--mono);font-size:12.5px;line-height:1.65;color:var(--ink-soft);background:#0a0a12;border:1px solid var(--stroke);border-radius:10px;padding:14px 16px;margin:0 0 15px;overflow-x:auto}'+
      '.rf-code code{color:inherit}'+
      '.rf-note{font-size:13px;color:var(--ink-mute);line-height:1.6;margin:0 0 12px;padding-left:13px;border-left:2px solid var(--stroke)}'+
      '.rf-terms{display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;margin:2px 0 15px}'+
      '.rf-term{font-size:13.5px;line-height:1.55;color:var(--ink-mute);padding-left:15px;position:relative}'+
      '.rf-term::before{content:"▸";position:absolute;left:0;top:0;color:var(--rc);font-size:11px}'+
      '.rf-term b{color:var(--ink);font-weight:600;margin-right:4px}'+
      '.rf-ex{background:linear-gradient(180deg,color-mix(in srgb,var(--rc) 9%,transparent),transparent);border:1px solid var(--stroke);border-radius:12px;padding:15px 17px;margin:0 0 15px}'+
      '.rf-ex-h{display:flex;align-items:center;gap:10px;font-family:var(--display);font-weight:600;font-size:14px;color:var(--ink);margin-bottom:10px}'+
      '.rf-ex-badge{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#06120c;background:var(--rc);border-radius:5px;padding:3px 7px}'+
      '.rf-ex .rf-p{font-size:14px;margin-bottom:10px}'+
      '.rf-ex .rf-eqn,.rf-ex .rf-code{margin-bottom:10px}'+
      '.rf-tablewrap{overflow-x:auto;margin:2px 0 14px}'+
      '.rf-table{width:100%;border-collapse:collapse;font-size:13px}'+
      '.rf-table th,.rf-table td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--stroke);color:var(--ink-soft);vertical-align:top}'+
      '.rf-table th{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-mute)}'+
      '.rf-table td b{color:var(--ink)}'+
      '@media(max-width:720px){.rf-terms{grid-template-columns:1fr}.rf-body{padding-left:18px}}';
    var st = document.createElement('style'); st.id = 'rf-css'; st.textContent = css;
    document.head.appendChild(st);
  }
})();
