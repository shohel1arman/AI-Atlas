/* ============================================================
   AI ATLAS — Computer Vision, extra interactive labs
   Adds 5 playgrounds beyond conv/detect/segment:
     repr    · Image as Numbers (RGB channels + pixel values)
     pool    · Pooling & Stride (max/avg downsampling)
     augment · Data Augmentation (flip / rotate / brightness / zoom)
     vit     · Vision Transformers (patchify → tokens)
     arch    · CNN Architectures (volume through the layers)
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

  /* ---------- a small procedural RGB "photo": a lit sphere on a gradient ---------- */
  function scene(W, H, x, y) {
    // returns {r,g,b} 0..255 for normalized coords via pixel sampling
    var cx = W * 0.5, cy = H * 0.46, R = Math.min(W, H) * 0.34;
    var dx = x - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
    // background: cool vertical gradient
    var bg = { r: 30 + 40 * (y / H), g: 40 + 60 * (y / H), b: 70 + 90 * (y / H) };
    if (d > R) return bg;
    // sphere with a light from upper-left
    var nz = Math.sqrt(Math.max(0, R * R - dx * dx - dy * dy)) / R;
    var lx = -0.5, ly = -0.6, lz = 0.62;
    var nx = dx / R, ny = dy / R;
    var lit = clamp(nx * lx + ny * ly + nz * lz, 0, 1);
    var base = { r: 240, g: 110, b: 90 };            // warm sphere
    var amb = 0.20;
    return { r: base.r * (amb + 0.9 * lit), g: base.g * (amb + 0.9 * lit), b: base.b * (amb + 0.9 * lit) };
  }

  /* ============================ repr: Image as Numbers ============================ */
  (function reprLab() {
    var cv = $('repr-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height, GRID = 24, view = 'rgb';
    function draw() {
      var cell = W / GRID;
      for (var gy = 0; gy < GRID; gy++) for (var gx = 0; gx < GRID; gx++) {
        var px = (gx + 0.5) * (W / GRID), py = (gy + 0.5) * (H / GRID);
        var c = scene(W, H, px, py);
        var r = c.r, g = c.g, b = c.b, gray = 0.299 * r + 0.587 * g + 0.114 * b;
        var col;
        if (view === 'rgb') col = 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';
        else if (view === 'r') col = 'rgb(' + (r|0) + ',0,0)';
        else if (view === 'g') col = 'rgb(0,' + (g|0) + ',0)';
        else if (view === 'b') col = 'rgb(0,0,' + (b|0) + ')';
        else col = 'rgb(' + (gray|0) + ',' + (gray|0) + ',' + (gray|0) + ')';
        ctx.fillStyle = col;
        ctx.fillRect(gx * cell, gy * cell, cell + 1, cell + 1);
      }
      // read a 5x5 patch from the centre and print its numbers
      var vals = [], sx = 9, sy = 9;
      for (var yy = 0; yy < 5; yy++) { var row = [];
        for (var xx = 0; xx < 5; xx++) {
          var c2 = scene(W, H, (sx + xx + 0.5) * (W / GRID), (sy + yy + 0.5) * (H / GRID));
          var val = view === 'r' ? c2.r : view === 'g' ? c2.g : view === 'b' ? c2.b
            : view === 'gray' ? (0.299 * c2.r + 0.587 * c2.g + 0.114 * c2.b) : c2.r;
          row.push(('' + (val|0)).padStart(3, ' '));
        }
        vals.push(row.join('  '));
      }
      if ($('repr-vals')) $('repr-vals').textContent = vals.join('\n');
      // outline the sampled patch
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2;
      ctx.strokeRect(sx * cell, sy * cell, 5 * cell, 5 * cell);
      if ($('repr-dim')) $('repr-dim').textContent = GRID + '×' + GRID + '×' + (view === 'rgb' ? 3 : 1);
      if ($('repr-view-lbl')) $('repr-view-lbl').textContent =
        view === 'rgb' ? 'all channels' : view === 'gray' ? 'luminance' : view.toUpperCase() + ' channel';
    }
    seg('repr-view', function (v) { view = v; draw(); });
    draw();
  })();

  /* ============================ pool: Pooling & Stride ============================ */
  (function poolLab() {
    var inC = $('pool-in'), outC = $('pool-out'); if (!inC) return;
    var ictx = inC.getContext('2d'), octx = outC.getContext('2d');
    var N = 8, mode = 'max', size = 2, stride = 2;
    var data = [];
    (function seed() { for (var i = 0; i < N * N; i++) {
      var x = i % N, y = (i / N) | 0;
      data[i] = clamp(40 + 180 * Math.abs(Math.sin(x * 0.9) * Math.cos(y * 0.7)) + (i * 37 % 40), 0, 255);
    } })();
    function poolAt(px, py) {
      var best = mode === 'max' ? -1 : 0, sum = 0, n = 0;
      for (var dy = 0; dy < size; dy++) for (var dx = 0; dx < size; dx++) {
        var xx = px + dx, yy = py + dy; if (xx >= N || yy >= N) continue;
        var v = data[yy * N + xx]; sum += v; n++; if (v > best) best = v;
      }
      return mode === 'max' ? best : (sum / (n || 1));
    }
    function drawGrid(ctx, arr, dim, side, label) {
      var cell = side / dim;
      for (var y = 0; y < dim; y++) for (var x = 0; x < dim; x++) {
        var v = arr[y * dim + x] | 0;
        ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
        ctx.fillRect(x * cell, y * cell, cell, cell);
        ctx.fillStyle = v > 130 ? '#111' : '#ccc'; ctx.font = (dim > 6 ? 9 : 12) + 'px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.fillText(v, x * cell + cell / 2, y * cell + cell / 2 + 3);
      }
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      for (var i = 0; i <= dim; i++) { ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, side); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(side, i * cell); ctx.stroke(); }
    }
    function draw() {
      ictx.clearRect(0, 0, inC.width, inC.height); octx.clearRect(0, 0, outC.width, outC.height);
      drawGrid(ictx, data, N, inC.width);
      var outDim = Math.floor((N - size) / stride) + 1, out = [];
      for (var oy = 0; oy < outDim; oy++) for (var ox = 0; ox < outDim; ox++)
        out[oy * outDim + ox] = poolAt(ox * stride, oy * stride);
      drawGrid(octx, out, outDim, outC.width);
      if ($('pool-outdim')) $('pool-outdim').textContent = outDim + '×' + outDim;
      if ($('pool-reduce')) $('pool-reduce').textContent = (100 - Math.round(100 * outDim * outDim / (N * N))) + '%';
    }
    seg('pool-mode', function (v) { mode = v; draw(); });
    if ($('pool-size')) $('pool-size').oninput = function (e) { size = +e.target.value; $('pool-size-v').textContent = size + '×' + size; draw(); };
    if ($('pool-stride')) $('pool-stride').oninput = function (e) { stride = +e.target.value; $('pool-stride-v').textContent = stride; draw(); };
    draw();
  })();

  /* ============================ augment: Data Augmentation ============================ */
  (function augLab() {
    var cv = $('aug-canvas'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var st = { flipH: false, flipV: false, rot: 0, bright: 1, zoom: 1 };
    function draw() {
      ctx.save(); ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0c0c16'; ctx.fillRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2);
      ctx.rotate(st.rot * Math.PI / 180);
      ctx.scale((st.flipH ? -1 : 1) * st.zoom, (st.flipV ? -1 : 1) * st.zoom);
      // draw the procedural scene into an offscreen at low res, then blit scaled
      var S = 64, off = draw._off || (draw._off = document.createElement('canvas'));
      off.width = S; off.height = S; var octx = off.getContext('2d');
      var img = octx.createImageData(S, S);
      for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
        var c = scene(S, S, x + 0.5, y + 0.5); var i = (y * S + x) * 4;
        img.data[i] = clamp(c.r * st.bright, 0, 255); img.data[i + 1] = clamp(c.g * st.bright, 0, 255);
        img.data[i + 2] = clamp(c.b * st.bright, 0, 255); img.data[i + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      var d = Math.min(W, H) * 0.78;
      ctx.drawImage(off, -d / 2, -d / 2, d, d);
      ctx.restore();
      // frame
      ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }
    if ($('aug-fliph')) $('aug-fliph').onclick = function () { st.flipH = !st.flipH; this.classList.toggle('active', st.flipH); draw(); };
    if ($('aug-flipv')) $('aug-flipv').onclick = function () { st.flipV = !st.flipV; this.classList.toggle('active', st.flipV); draw(); };
    if ($('aug-rot')) $('aug-rot').oninput = function (e) { st.rot = +e.target.value; $('aug-rot-v').textContent = st.rot + '°'; draw(); };
    if ($('aug-bright')) $('aug-bright').oninput = function (e) { st.bright = +e.target.value; $('aug-bright-v').textContent = st.bright.toFixed(2) + '×'; draw(); };
    if ($('aug-zoom')) $('aug-zoom').oninput = function (e) { st.zoom = +e.target.value; $('aug-zoom-v').textContent = st.zoom.toFixed(2) + '×'; draw(); };
    if ($('aug-reset')) $('aug-reset').onclick = function () {
      st = { flipH: false, flipV: false, rot: 0, bright: 1, zoom: 1 };
      ['aug-rot','aug-bright','aug-zoom'].forEach(function (id) { var el = $(id); if (el) el.value = id === 'aug-rot' ? 0 : 1; });
      $('aug-rot-v').textContent = '0°'; $('aug-bright-v').textContent = '1.00×'; $('aug-zoom-v').textContent = '1.00×';
      $('aug-fliph').classList.remove('active'); $('aug-flipv').classList.remove('active'); draw();
    };
    draw();
  })();

  /* ============================ vit: Vision Transformers ============================ */
  (function vitLab() {
    var cv = $('vit-canvas'), tk = $('vit-tokens'); if (!cv) return;
    var ctx = cv.getContext('2d'), tctx = tk.getContext('2d');
    var W = cv.width, H = cv.height, patch = 16, IMG = 96;
    function draw() {
      // render the scene
      var off = draw._off || (draw._off = document.createElement('canvas'));
      off.width = IMG; off.height = IMG; var octx = off.getContext('2d');
      var im = octx.createImageData(IMG, IMG);
      for (var y = 0; y < IMG; y++) for (var x = 0; x < IMG; x++) {
        var c = scene(IMG, IMG, x + 0.5, y + 0.5); var i = (y * IMG + x) * 4;
        im.data[i] = c.r; im.data[i + 1] = c.g; im.data[i + 2] = c.b; im.data[i + 3] = 255;
      }
      octx.putImageData(im, 0, 0);
      ctx.clearRect(0, 0, W, H); ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, W, H);
      // patch grid overlay
      var n = Math.round(IMG / patch), cell = W / n;
      ctx.strokeStyle = 'rgba(168,85,247,.9)'; ctx.lineWidth = 1.5;
      for (var k = 0; k <= n; k++) { ctx.beginPath(); ctx.moveTo(k * cell, 0); ctx.lineTo(k * cell, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, k * cell); ctx.lineTo(W, k * cell); ctx.stroke(); }
      // token sequence: average colour of each patch as a square in a row
      tctx.clearRect(0, 0, tk.width, tk.height);
      var total = n * n, tw = tk.width / Math.min(total, 36), size = Math.min(tw - 3, tk.height - 18);
      for (var p = 0; p < total && p < 36; p++) {
        var pgx = p % n, pgy = (p / n) | 0, r = 0, g = 0, b = 0, cnt = 0;
        for (var yy = 0; yy < patch; yy++) for (var xx = 0; xx < patch; xx++) {
          var c3 = scene(IMG, IMG, pgx * patch + xx + 0.5, pgy * patch + yy + 0.5);
          r += c3.r; g += c3.g; b += c3.b; cnt++;
        }
        r /= cnt; g /= cnt; b /= cnt;
        var tx = p * tw + 2;
        tctx.fillStyle = 'rgb(' + (r|0) + ',' + (g|0) + ',' + (b|0) + ')';
        tctx.fillRect(tx, 2, size, size);
        tctx.fillStyle = '#7C7C92'; tctx.font = '8px JetBrains Mono, monospace'; tctx.textAlign = 'center';
        tctx.fillText(p + 1, tx + size / 2, tk.height - 5);
      }
      if ($('vit-npatch')) $('vit-npatch').textContent = n + '×' + n;
      if ($('vit-seqlen')) $('vit-seqlen').textContent = (total + 1) + ' (+CLS)';
      if ($('vit-dim')) $('vit-dim').textContent = patch + '×' + patch + '×3 = ' + (patch * patch * 3);
    }
    if ($('vit-patch')) $('vit-patch').oninput = function (e) { patch = +e.target.value; $('vit-patch-v').textContent = patch + ' px'; draw(); };
    draw();
  })();

  /* ============================ arch: CNN Architectures ============================ */
  (function archLab() {
    var host = $('arch-diagram'); if (!host) return;
    var MODELS = {
      lenet: { name: 'LeNet-5 (1998)', layers: [['Input', 32, 1], ['Conv 5×5', 28, 6], ['Pool', 14, 6], ['Conv 5×5', 10, 16], ['Pool', 5, 16], ['FC', 1, 120], ['Out', 1, 10]] },
      alexnet: { name: 'AlexNet (2012)', layers: [['Input', 227, 3], ['Conv 11×11', 55, 96], ['Pool', 27, 96], ['Conv 5×5', 27, 256], ['Pool', 13, 256], ['Conv 3×3', 13, 384], ['Pool', 6, 256], ['FC', 1, 4096], ['Out', 1, 1000]] },
      vgg: { name: 'VGG-16 (2014)', layers: [['Input', 224, 3], ['Conv×2', 224, 64], ['Pool', 112, 128], ['Conv×2', 112, 128], ['Pool', 56, 256], ['Conv×3', 56, 256], ['Pool', 28, 512], ['Conv×3', 28, 512], ['Pool', 7, 512], ['FC', 1, 4096], ['Out', 1, 1000]] },
      resnet: { name: 'ResNet-50 (2015)', layers: [['Input', 224, 3], ['Conv 7×7', 112, 64], ['Pool', 56, 64], ['Res ×3', 56, 256], ['Res ×4', 28, 512], ['Res ×6', 14, 1024], ['Res ×3', 7, 2048], ['Pool', 1, 2048], ['Out', 1, 1000]] }
    };
    var cur = 'lenet';
    function draw() {
      var m = MODELS[cur], maxC = 0, maxS = 0;
      m.layers.forEach(function (l) { maxC = Math.max(maxC, l[2]); maxS = Math.max(maxS, l[1]); });
      var html = '';
      m.layers.forEach(function (l, i) {
        var spatial = l[1], ch = l[2];
        var hgt = 26 + 78 * Math.sqrt(spatial / maxS);          // block height ~ spatial size
        var wid = 12 + 34 * Math.sqrt(ch / maxC);               // block width ~ channels (depth)
        html += '<div class="arch-col">'
          + '<div class="arch-block" style="height:' + hgt + 'px;width:' + wid + 'px"></div>'
          + '<div class="arch-meta"><span class="arch-name">' + l[0] + '</span>'
          + '<span class="arch-dim">' + (spatial > 1 ? spatial + '² ' : '') + '×' + ch + '</span></div>'
          + '</div>';
        if (i < m.layers.length - 1) html += '<div class="arch-arrow">→</div>';
      });
      host.innerHTML = html;
      if ($('arch-title')) $('arch-title').textContent = m.name;
      if ($('arch-depth')) $('arch-depth').textContent = m.layers.length + ' stages';
      if ($('arch-final')) $('arch-final').textContent = m.layers[m.layers.length - 1][2] + ' classes';
    }
    seg('arch-model', function (v) { cur = v; draw(); });
    draw();
  })();

})();
