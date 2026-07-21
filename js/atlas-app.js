/* ============================================================
   AI ATLAS — Supabase auth + progress layer
   ------------------------------------------------------------
   Loaded on every hub/module page (after app-shell.js). It:
     1. creates the Supabase client from js/supabase-config.js
     2. guards protected pages (redirect to auth.html if signed out)
     3. shows the signed-in user in the sidebar footer + logout
     4. tracks lesson progress — auto (on interaction) + manual
        ("Mark complete" toggle injected into each lesson panel)
   Everything is exposed on window.Atlas for the dashboard.
   ============================================================ */
(function () {
  'use strict';

  var page = document.body.dataset.page || '';
  var isAuthPage = page === 'auth';
  // path prefix: module pages live in /modules, hub/auth at root
  var inModules = location.pathname.indexOf('/modules/') !== -1;
  var ROOT = inModules ? '../' : '';
  var mod = window.ATLAS_MODULE_BY_ID ? window.ATLAS_MODULE_BY_ID[page] : null;

  /* ---- fast, pre-async guard: avoids a content flash -------- */
  function hasStoredSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('sb-') === 0 && k.indexOf('-auth-token') !== -1) return true;
      }
    } catch (e) {}
    return false;
  }
  if (!isAuthPage && !hasStoredSession()) {
    location.replace(ROOT + 'auth.html');
    return;
  }

  /* ---- client ---------------------------------------------- */
  var cfg = window.ATLAS_SUPABASE || {};
  if (!window.supabase || !cfg.url || cfg.url.indexOf('YOUR-PROJECT') === 0) {
    console.error('[Atlas] Supabase not configured — edit js/supabase-config.js');
    return;
  }
  var client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  var Atlas = window.Atlas = {
    client: client,
    user: null,
    module: mod,
    _progress: {},        // "module/lesson" -> row
    _readyResolve: null,
  };
  Atlas.ready = new Promise(function (res) { Atlas._readyResolve = res; });

  /* ---- auth helpers ---------------------------------------- */
  Atlas.signUp = function (email, password, fullName) {
    return client.auth.signUp({
      email: email, password: password,
      options: { data: { full_name: fullName || '' } },
    });
  };
  Atlas.signIn = function (email, password) {
    return client.auth.signInWithPassword({ email: email, password: password });
  };
  Atlas.signOut = function () {
    return client.auth.signOut().then(function () { location.replace(ROOT + 'auth.html'); });
  };

  /* ---- progress -------------------------------------------- */
  function key(m, l) { return m + '/' + l; }

  Atlas.loadProgress = function () {
    if (!Atlas.user) return Promise.resolve({});
    return client.from('progress').select('module,lesson,completed,source')
      .then(function (r) {
        Atlas._progress = {};
        (r.data || []).forEach(function (row) { Atlas._progress[key(row.module, row.lesson)] = row; });
        document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
        return Atlas._progress;
      });
  };

  Atlas.isDone = function (m, l) {
    var row = Atlas._progress[key(m, l)];
    return !!(row && row.completed);
  };

  // set/unset a lesson. completed=false removes the row.
  Atlas.setLesson = function (m, l, completed, source) {
    if (!Atlas.user) return Promise.resolve();
    var kk = key(m, l);
    if (completed) {
      var row = { user_id: Atlas.user.id, module: m, lesson: l, completed: true,
        source: source || 'manual', updated_at: new Date().toISOString() };
      Atlas._progress[kk] = row;
      document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
      return client.from('progress').upsert(row).then(function (res) {
        if (res.error) console.error('[Atlas] save failed', res.error.message);
      });
    } else {
      delete Atlas._progress[kk];
      document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
      return client.from('progress').delete()
        .eq('user_id', Atlas.user.id).eq('module', m).eq('lesson', l)
        .then(function (res) { if (res.error) console.error('[Atlas] remove failed', res.error.message); });
    }
  };

  // percent complete for a module id, given the current cache
  Atlas.modulePercent = function (m) {
    var def = window.ATLAS_MODULE_BY_ID[m];
    if (!def || !def.lessons.length) return 0;
    var done = def.lessons.filter(function (ls) { return Atlas.isDone(m, ls.id); }).length;
    return Math.round(100 * done / def.lessons.length);
  };

  /* ---- sidebar footer: signed-in user ---------------------- */
  function initials(name, email) {
    var s = (name || '').trim();
    if (s) { var p = s.split(/\s+/); return ((p[0][0] || '') + (p[1] ? p[1][0] : '')).toUpperCase(); }
    return (email || '?').slice(0, 2).toUpperCase();
  }
  function renderProfile() {
    var el = document.querySelector('.side-profile');
    if (!el || !Atlas.user) return;
    var name = (Atlas.user.user_metadata && Atlas.user.user_metadata.full_name) || '';
    var email = Atlas.user.email || '';
    el.innerHTML =
      '<span class="av">' + initials(name, email) + '</span>' +
      '<div style="min-width:0;flex:1"><div class="nm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' +
        (name || email) + '</div><div class="sub">Student</div></div>' +
      '<button id="atlas-logout" class="btn btn-ghost btn-sm" title="Sign out" style="padding:5px 9px">Sign out</button>';
    var btn = document.getElementById('atlas-logout');
    if (btn) btn.onclick = function () { Atlas.signOut(); };
  }

  /* ---- lesson "Mark complete" UI + auto tracking ----------- */
  function completeBar(m, l) {
    var done = Atlas.isDone(m, l);
    var wrap = document.createElement('div');
    wrap.className = 'lesson-complete' + (done ? ' is-done' : '');
    wrap.setAttribute('data-module', m);
    wrap.setAttribute('data-lesson', l);
    wrap.innerHTML =
      '<button class="lc-toggle" type="button">' +
        '<span class="lc-box"><svg viewBox="0 0 16 16" width="13" height="13"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span class="lc-label">' + (done ? 'Completed' : 'Mark this lesson complete') + '</span>' +
      '</button>';
    wrap.querySelector('.lc-toggle').onclick = function () {
      var nowDone = !wrap.classList.contains('is-done');
      Atlas.setLesson(m, l, nowDone, 'manual');
      paintBar(wrap, nowDone);
    };
    return wrap;
  }
  function paintBar(wrap, done) {
    wrap.classList.toggle('is-done', done);
    var lbl = wrap.querySelector('.lc-label');
    if (lbl) lbl.textContent = done ? 'Completed' : 'Mark this lesson complete';
  }

  function mountCompleteBars() {
    if (!mod) return;
    mod.lessons.forEach(function (ls) {
      var host = document.getElementById('panel-' + ls.id);   // tabbed page
      if (host) {
        if (host.querySelector(':scope > .lesson-complete')) return;
        host.insertBefore(completeBar(mod.id, ls.id), host.firstChild);
      } else {                                                 // single-interaction page
        var head = document.querySelector('.page-head');
        if (head && !document.querySelector('.lesson-complete')) {
          head.parentNode.insertBefore(completeBar(mod.id, ls.id), head.nextSibling);
        }
      }
    });
  }

  // AUTO: a real interaction (click on a control) inside a lesson marks it done
  function wireAutoTracking() {
    if (!mod) return;
    document.addEventListener('click', function (e) {
      // a real control interaction (play / step / run …), NOT just opening a tab
      var btn = e.target.closest('button, .iconbtn');
      if (!btn) return;
      if (btn.closest('.lesson-complete')) return;   // the toggle itself isn't "interaction"
      // which lesson? nearest panel, else the single-page lesson
      var panel = btn.closest('[id^="panel-"]');
      var lessonId = panel ? panel.id.replace('panel-', '')
        : (mod.lessons.length === 1 ? mod.lessons[0].id : null);
      if (!lessonId) return;
      if (Atlas.isDone(mod.id, lessonId)) return;
      Atlas.setLesson(mod.id, lessonId, true, 'auto');
      var bar = document.querySelector('.lesson-complete[data-lesson="' + lessonId + '"]');
      if (bar) paintBar(bar, true);
    }, true);
  }

  /* ---- styles for injected UI ------------------------------ */
  function injectStyles() {
    if (document.getElementById('atlas-app-css')) return;
    var s = document.createElement('style');
    s.id = 'atlas-app-css';
    s.textContent =
      '.lesson-complete{display:flex;justify-content:flex-end;margin:0 0 14px}' +
      '.lc-toggle{display:inline-flex;align-items:center;gap:9px;background:rgba(20,20,32,.6);' +
        'border:1px solid var(--line,#2a2a3a);color:var(--ink-mute,#9aa);border-radius:999px;' +
        'padding:7px 14px;font-size:13px;cursor:pointer;font-family:inherit;transition:.15s}' +
      '.lc-toggle:hover{border-color:#34D39955;color:#cfe}' +
      '.lc-box{display:grid;place-items:center;width:18px;height:18px;border-radius:6px;' +
        'border:1.5px solid var(--line,#3a3a4a);color:transparent;transition:.15s}' +
      '.lesson-complete.is-done .lc-toggle{color:#34D399;border-color:#34D39955;background:#34D39914}' +
      '.lesson-complete.is-done .lc-box{background:#34D399;border-color:#34D399;color:#06120c}';
    document.head.appendChild(s);
  }

  /* ---- boot ------------------------------------------------ */
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  client.auth.getSession().then(function (res) {
    var session = res.data && res.data.session;
    Atlas.user = session ? session.user : null;

    // guard / redirects
    if (!Atlas.user && !isAuthPage) { location.replace(ROOT + 'auth.html'); return; }
    if (Atlas.user && isAuthPage) { location.replace('app.html'); return; }

    if (Atlas.user && !isAuthPage) {
      injectStyles();
      onReady(renderProfile);
      Atlas.loadProgress().then(function () {
        onReady(function () { mountCompleteBars(); wireAutoTracking(); });
      });
    }
    if (Atlas._readyResolve) Atlas._readyResolve(Atlas);
  });

  // keep the tab in sync if the user signs out elsewhere
  client.auth.onAuthStateChange(function (event) {
    if (event === 'SIGNED_OUT' && !isAuthPage) location.replace(ROOT + 'auth.html');
  });
})();
