/* ============================================================
   AI ATLAS — editable value inputs
   Every range slider gets a small number box beside it, prefilled
   with the current (example) value. Users can type any value and
   the playground updates — the box and slider stay in sync. Works
   site-wide, including sliders that playground scripts inject after
   load (via a MutationObserver). No per-playground edits needed.
   ============================================================ */
(function () {
  'use strict';

  function clamp(v, min, max) {
    if (min !== '' && v < +min) v = +min;
    if (max !== '' && v > +max) v = +max;
    return v;
  }

  function enhance(range) {
    if (!range || range.dataset.vEnhanced) return;
    range.dataset.vEnhanced = '1';

    var num = document.createElement('input');
    num.type = 'number';
    num.className = 'val-input';
    if (range.min !== '') num.min = range.min;
    if (range.max !== '') num.max = range.max;
    if (range.step !== '') num.step = range.step;
    num.value = range.value;
    num.setAttribute('aria-label', (range.getAttribute('aria-label') || 'value') + ' — type a value');
    num.setAttribute('data-no-i18n', '');

    range.insertAdjacentElement('afterend', num);

    // slider drag → number box
    range.addEventListener('input', function () {
      if (document.activeElement !== num) num.value = range.value;
    });

    // number box → slider (and the playground reacts to the native events)
    function apply() {
      var v = parseFloat(num.value);
      if (isNaN(v)) { num.value = range.value; return; }
      v = clamp(v, range.min, range.max);
      range.value = v;
      range.dispatchEvent(new Event('input', { bubbles: true }));
      range.dispatchEvent(new Event('change', { bubbles: true }));
      num.value = range.value;
    }
    num.addEventListener('change', apply);
    num.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.tagName === 'INPUT' && root.type === 'range') enhance(root);
    if (root.querySelectorAll) {
      var list = root.querySelectorAll('input[type="range"]');
      for (var i = 0; i < list.length; i++) enhance(list[i]);
    }
  }

  function boot() {
    scan(document);
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        if (!added) continue;
        for (var j = 0; j < added.length; j++) if (added[j].nodeType === 1) scan(added[j]);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
