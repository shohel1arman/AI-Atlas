/* ============================================================
   AI ATLAS — Supabase auth + progress layer
   ------------------------------------------------------------
   Loaded on every hub/module page (after app-shell.js). It:
     1. creates the Supabase client from js/supabase-config.js
     2. keeps progress locally for anonymous learners
     3. syncs progress to Supabase when a user signs in
     4. shows the signed-in user in the sidebar footer + logout
     5. tracks lesson progress — auto (on interaction) + manual
        ("Mark complete" toggle injected into each lesson panel)
   Everything is exposed on window.Atlas for the dashboard.
   ============================================================ */
(function () {
  'use strict';

  var page = document.body.dataset.page || '';
  var isAuthPage = page === 'auth';
  var mod = window.ATLAS_MODULE_BY_ID ? window.ATLAS_MODULE_BY_ID[page] : null;

  /* ---- client ---------------------------------------------- */
  var cfg = window.ATLAS_SUPABASE || {};
  var configured = !!(window.supabase && cfg.url && cfg.anonKey && cfg.url.indexOf('YOUR-PROJECT') !== 0);
  var client = configured ? window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    }) : null;

  var STORAGE_KEY = 'ai-atlas-progress-v2';
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function writeLocal(progress) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (e) {}
  }

  var Atlas = window.Atlas = {
    client: client,
    user: null,
    module: mod,
    _progress: readLocal(), // "module/lesson" -> true or cloud row
    _readyResolve: null,
  };
  Atlas.ready = new Promise(function (res) { Atlas._readyResolve = res; });

  /* ---- auth helpers ---------------------------------------- */
  Atlas.signUp = function (email, password, fullName) {
    if (!client) return Promise.resolve({ error: { message: 'Cloud progress is not configured.' } });
    return client.auth.signUp({
      email: email, password: password,
      options: { data: { full_name: fullName || '' } },
    });
  };
  Atlas.signIn = function (email, password) {
    if (!client) return Promise.resolve({ error: { message: 'Cloud progress is not configured.' } });
    return client.auth.signInWithPassword({ email: email, password: password });
  };
  Atlas.signOut = function () {
    if (!client) return Promise.resolve();
    return client.auth.signOut().then(function () { location.replace('/atlas/'); });
  };

  /* ---- progress -------------------------------------------- */
  function key(m, l) { return m + '/' + l; }

  Atlas.loadProgress = function () {
    if (!client || !Atlas.user) return Promise.resolve(Atlas._progress);
    return client.from('progress').select('module,lesson,completed,source')
      .then(function (r) {
        (r.data || []).forEach(function (row) { Atlas._progress[key(row.module, row.lesson)] = row; });
        var localRows = Object.keys(Atlas._progress)
          .filter(function (item) { return Atlas._progress[item] === true; })
          .map(function (item) {
            var slash = item.indexOf('/');
            return {
              user_id: Atlas.user.id,
              module: item.slice(0, slash),
              lesson: item.slice(slash + 1),
              completed: true,
              source: 'local',
              updated_at: new Date().toISOString(),
            };
          });
        var sync = localRows.length ? client.from('progress').upsert(localRows) : Promise.resolve({ error: null });
        return sync.then(function (result) {
          if (result.error) console.error('[Atlas] local progress sync failed', result.error.message);
          writeLocal(Object.fromEntries(Object.keys(Atlas._progress).map(function (item) { return [item, true]; })));
          document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
          return Atlas._progress;
        });
      });
  };

  Atlas.isDone = function (m, l) {
    var row = Atlas._progress[key(m, l)];
    return row === true || !!(row && row.completed);
  };

  // set/unset a lesson. completed=false removes the row.
  Atlas.setLesson = function (m, l, completed, source) {
    var kk = key(m, l);
    if (completed) {
      Atlas._progress[kk] = true;
      writeLocal(Atlas._progress);
      document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
      if (!client || !Atlas.user) return Promise.resolve();
      var row = { user_id: Atlas.user.id, module: m, lesson: l, completed: true,
        source: source || 'manual', updated_at: new Date().toISOString() };
      Atlas._progress[kk] = row;
      return client.from('progress').upsert(row).then(function (res) {
        if (res.error) console.error('[Atlas] save failed', res.error.message);
      });
    } else {
      delete Atlas._progress[kk];
      writeLocal(Atlas._progress);
      document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
      if (!client || !Atlas.user) return Promise.resolve();
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
      '.lc-toggle{display:inline-flex;align-items:center;gap:9px;background:#fff;' +
        'border:1px solid #94A3B8;color:#334155;border-radius:999px;' +
        'padding:7px 14px;font-size:13px;cursor:pointer;font-family:inherit;transition:.15s}' +
      '.lc-toggle:hover{border-color:#475569;color:#0F172A;background:#F8FAFC}' +
      '.lc-toggle:focus-visible{outline:3px solid rgba(37,99,235,.35);outline-offset:2px}' +
      '.lc-box{display:grid;place-items:center;width:18px;height:18px;border-radius:6px;' +
        'border:1.5px solid #64748B;color:transparent;transition:.15s}' +
      '.lesson-complete.is-done .lc-toggle{color:#047857;border-color:#059669;background:#ECFDF5}' +
      '.lesson-complete.is-done .lc-box{background:#059669;border-color:#059669;color:#fff}';
    document.head.appendChild(s);
  }

  /* ---- boot ------------------------------------------------ */
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function startAnonymous() {
    if (!isAuthPage) {
      injectStyles();
      onReady(function () { mountCompleteBars(); wireAutoTracking(); });
    }
    if (Atlas._readyResolve) Atlas._readyResolve(Atlas);
    document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
  }

  if (!client) {
    startAnonymous();
    return;
  }

  client.auth.getSession().then(function (res) {
    var session = res.data && res.data.session;
    Atlas.user = session ? session.user : null;

    if (Atlas.user && isAuthPage) { location.replace('/atlas/'); return; }

    if (!isAuthPage) {
      injectStyles();
      if (Atlas.user) onReady(renderProfile);
      Atlas.loadProgress().then(function () {
        onReady(function () { mountCompleteBars(); wireAutoTracking(); });
      });
    }
    if (Atlas._readyResolve) Atlas._readyResolve(Atlas);
    document.dispatchEvent(new CustomEvent('atlas:progress', { detail: Atlas._progress }));
  });

  // Signing out returns to anonymous mode; learning remains available.
  client.auth.onAuthStateChange(function (event) {
    if (event === 'SIGNED_OUT') Atlas.user = null;
  });
})();
