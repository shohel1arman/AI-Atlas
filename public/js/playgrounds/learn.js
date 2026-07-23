/* ============================================================
   AI ATLAS — Learn & Run: lessons + runners (Pyodide for Python)
   ============================================================ */
window.LEARN = (function () {
  'use strict';

  const TRACKS = {
    python: { name: 'Python', real: true, lg: ['#3776AB', '#FFD43B', 'Py'], file: 'lesson.py' },
    r:      { name: 'R', real: false, lg: ['#276DC3', '#fff', 'R'], file: 'lesson.R' },
    go:     { name: 'Go', real: false, lg: ['#00ADD8', '#fff', 'Go'], file: 'lesson.go' },
  };

  const LESSONS = {
    python: [
      { t:'Variables & print', brief:'Store values in variables and print them. Edit the message, then Run.',
        code:`name = "Atlas"\nyear = 2026\nprint("Hello from", name, year)`, expect:'Hello from Atlas 2026' },
      { t:'Lists & loops', brief:'Build a list and sum it with a for-loop. Try changing the numbers.',
        code:`nums = [4, 8, 15, 16, 23]\ntotal = 0\nfor n in nums:\n    total += n\nprint("sum =", total)\nprint("max =", max(nums))`, expect:'sum = 66' },
      { t:'Functions', brief:'Define a function and call it. Add a third call with your own value.',
        code:`def square(x):\n    return x * x\n\nfor i in range(1, 5):\n    print(i, "->", square(i))`, expect:'4 -> 16' },
      { t:'NumPy arrays', brief:'NumPy gives fast vectorized math. The dot product and mean run on real NumPy.',
        code:`import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint("dot:", a @ b)\nprint("mean:", a.mean())\nprint("a * 2:", a * 2)`, expect:'dot: 32', pkg:'numpy' },
      { t:'pandas DataFrame', brief:'pandas handles tabular data. Group by region and sum the sales — for real.',
        code:`import pandas as pd\n\ndf = pd.DataFrame({\n    "region": ["N", "S", "N", "S"],\n    "sales":  [100, 240, 80, 60],\n})\nprint(df.groupby("region").sales.sum())`, expect:'180', pkg:'pandas' },
      { t:'scikit-learn: fit a model', brief:'Train a real linear regression with scikit-learn and read off the slope.',
        code:`from sklearn.linear_model import LinearRegression\nimport numpy as np\n\nX = np.array([[1],[2],[3],[4]])\ny = np.array([2, 4, 6, 8])\nmodel = LinearRegression().fit(X, y)\nprint("slope:", round(model.coef_[0], 2))\nprint("predict 5 ->", round(model.predict([[5]])[0], 1))`, expect:'slope: 2.0', pkg:'scikit-learn' },
      { t:'Matplotlib', brief:'Matplotlib builds plots. Here we compute the curve data it would draw (real NumPy).',
        code:`import numpy as np\n\nx = np.linspace(0, 6.28, 7)\ny = np.sin(x)\nfor xi, yi in zip(x.round(2), y.round(2)):\n    print(xi, "->", yi)\n# In a notebook: plt.plot(x, y); plt.show()`, expect:'->', pkg:'numpy' },
      { t:'joblib', brief:'joblib persists models and parallelizes work. Round-trip a Python object to bytes.',
        code:`import joblib, io\n\nmodel = {"weights": [0.2, 0.8], "bias": 0.1}\nbuf = io.BytesIO()\njoblib.dump(model, buf)\nbuf.seek(0)\nloaded = joblib.load(buf)\nprint("restored:", loaded)`, expect:'restored:', pkg:'joblib' },
      { t:'PyTorch (preview)', brief:'PyTorch needs a full Python environment — here is the canonical training step + its output.', preview:true,
        code:`import torch\n\nx = torch.tensor([1., 2., 3.])\nw = torch.tensor([0.5], requires_grad=True)\nloss = ((x * w) - 4).pow(2).mean()\nloss.backward()\nprint("loss:", round(loss.item(), 3))\nprint("grad:", w.grad.item())`, out:`loss: 4.250\ngrad: -7.0` },
      { t:'TensorFlow (preview)', brief:'TensorFlow/Keras needs a full environment — here is a minimal model + its output.', preview:true,
        code:`import tensorflow as tf\n\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(1, input_shape=(1,))\n])\nmodel.compile(optimizer="sgd", loss="mse")\nprint(model.summary())`, out:`Model: "sequential"\n Dense (Dense)  (None, 1)   2 params\nTotal params: 2` },
    ],
    r: [
      { t:'Vectors & stats', brief:'R is built for statistics. (Preview: shows expected output.)',
        code:`x <- c(4, 8, 15, 16, 23, 42)\ncat("mean:", mean(x), "\\n")\ncat("sd:", round(sd(x), 2), "\\n")`, out:`mean: 18\nsd: 13.69` },
      { t:'dplyr pipeline', brief:'Transform data with the tidyverse pipe. (Preview output.)',
        code:`library(dplyr)\nsales <- data.frame(region=c("N","S","N"), v=c(100,240,80))\nsales %>% group_by(region) %>% summarise(total = sum(v))`, out:`# A tibble: 2 x 2\n  region total\n1 N        180\n2 S        240` },
    ],
    go: [
      { t:'Slices & loops', brief:'Go is compiled and fast. (Preview: shows expected output.)',
        code:`package main\nimport "fmt"\n\nfunc main() {\n    nums := []int{1, 2, 3, 4}\n    sum := 0\n    for _, n := range nums {\n        sum += n\n    }\n    fmt.Println("sum:", sum)\n}`, out:`sum: 10` },
      { t:'Goroutines', brief:'Lightweight concurrency with goroutines. (Preview output.)',
        code:`package main\nimport ("fmt"; "sync")\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 0; i < 3; i++ {\n        wg.Add(1)\n        go func(n int) { defer wg.Done(); fmt.Println("worker", n) }(i)\n    }\n    wg.Wait()\n}`, out:`worker 0\nworker 1\nworker 2` },
    ],
  };

  // ---- Python runtime (Pyodide) ----
  let pyBoot = null;
  function hasPyodide() { return typeof loadPyodide !== 'undefined'; }
  function boot(onStatus) {
    if (!pyBoot) { onStatus && onStatus('booting Python runtime…'); pyBoot = loadPyodide(); }
    return pyBoot;
  }
  async function runPython(code, onLine, onStatus) {
    if (!hasPyodide()) return { ok:false, fallback:true };
    let py;
    try { py = await boot(onStatus); } catch (e) { return { ok:false, fallback:true }; }
    onStatus && onStatus('loading packages…');
    try { await py.loadPackagesFromImports(code); } catch (e) {}
    let buf = '';
    py.setStdout({ batched: (s) => { buf += s + '\n'; } });
    py.setStderr({ batched: (s) => { buf += s + '\n'; } });
    onStatus && onStatus('running…');
    try { await py.runPythonAsync(code); onLine(buf || '(no output)'); return { ok:true, out:buf }; }
    catch (e) { onLine(buf + '\n' + String(e.message || e)); return { ok:false, out:buf }; }
  }

  return { TRACKS, LESSONS, runPython, hasPyodide };
})();
