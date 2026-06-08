import { useCallback, useMemo, useRef, useState } from "react";
import TopBar from "@/components/TopBar";

const W = 460, H = 300, PAD = 30;
const XMIN = -6, XMAX = 6;
const xToPx = (x: number) => PAD + ((x - XMIN) / (XMAX - XMIN)) * (W - 2 * PAD);

const pdf = (x: number, mu: number, sigma: number) =>
  (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

// Box–Muller transform: two uniforms -> one standard normal.
function gauss(mu: number, sigma: number) {
  const u = Math.random() || 1e-9;
  const v = Math.random();
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export default function GaussianPlayground() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1.2);
  const [seed, setSeed] = useState(0); // bump to resample
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const samples = useMemo(() => {
    void seed;
    return Array.from({ length: 600 }, () => gauss(mu, sigma));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mu, sigma, seed]);

  const sampleMean = samples.reduce((s, v) => s + v, 0) / samples.length;
  const sampleStd = Math.sqrt(samples.reduce((s, v) => s + (v - sampleMean) ** 2, 0) / samples.length);

  const paint = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const peak = pdf(mu, mu, sigma);
    const yToPx = (d: number) => H - PAD - (d / (peak * 1.15)) * (H - 2 * PAD);

    // ±1σ shaded band
    ctx.fillStyle = "rgba(108,92,255,0.10)";
    ctx.fillRect(xToPx(mu - sigma), PAD, xToPx(mu + sigma) - xToPx(mu - sigma), H - 2 * PAD);

    // histogram of samples
    const BINS = 40;
    const counts = new Array(BINS).fill(0);
    for (const v of samples) {
      const idx = Math.floor(((v - XMIN) / (XMAX - XMIN)) * BINS);
      if (idx >= 0 && idx < BINS) counts[idx]++;
    }
    const binW = (XMAX - XMIN) / BINS;
    const maxDensity = Math.max(...counts) / (samples.length * binW);
    counts.forEach((c, i) => {
      const density = c / (samples.length * binW);
      const x0 = xToPx(XMIN + i * binW);
      const x1 = xToPx(XMIN + (i + 1) * binW);
      const scaled = (density / (maxDensity || 1)) * peak;
      ctx.fillStyle = "rgba(52,211,153,0.30)";
      ctx.fillRect(x0, yToPx(scaled), x1 - x0 - 1, H - PAD - yToPx(scaled));
    });

    // the true bell curve
    ctx.strokeStyle = "#6c5cff"; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let i = 0; i <= 240; i++) {
      const x = XMIN + (i / 240) * (XMAX - XMIN);
      const px = xToPx(x), py = yToPx(pdf(x, mu, sigma));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // mean line
    ctx.strokeStyle = "rgba(251,191,36,0.7)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xToPx(mu), PAD); ctx.lineTo(xToPx(mu), H - PAD); ctx.stroke();
    ctx.setLineDash([]);

    // axis
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath(); ctx.moveTo(PAD, H - PAD); ctx.lineTo(W - PAD, H - PAD); ctx.stroke();
  }, [mu, sigma, samples]);

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  return (
    <>
      <TopBar crumb="Math Lab · Gaussian" tag="live · sampling" />
      <div className="content">
        <h1 className="page-title">The normal distribution</h1>
        <p className="page-sub">
          The bell curve shows up everywhere — measurement noise, weight initialization, the
          assumptions behind half of statistics. The <b style={{ color: "#6c5cff" }}>curve</b> is the
          true density; the <b style={{ color: "#34d399" }}>green bars</b> are 600 fresh random draws.
          Notice the samples never match the curve perfectly — that gap is sampling error.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: `${W}/${H}` }} />
          </div>
          <div className="panel panel-pad">
            <div className="control">
              <label>Mean μ <span className="val">{mu.toFixed(2)}</span></label>
              <input type="range" min={-3} max={3} step={0.1} value={mu} onChange={(e) => setMu(+e.target.value)} />
            </div>
            <div className="control">
              <label>Std dev σ <span className="val">{sigma.toFixed(2)}</span></label>
              <input type="range" min={0.3} max={2.5} step={0.05} value={sigma} onChange={(e) => setSigma(+e.target.value)} />
            </div>
            <div className="btn-row" style={{ marginBottom: 20 }}>
              <button className="btn primary" onClick={() => setSeed((s) => s + 1)}>↻ Resample</button>
            </div>
            <div style={{ display: "grid", gap: 9 }}>
              <div className="stat"><span className="k">sample mean&nbsp;</span><span className="v">{sampleMean.toFixed(3)}</span> <span className="k">(μ={mu.toFixed(2)})</span></div>
              <div className="stat"><span className="k">sample std&nbsp;&nbsp;</span><span className="v">{sampleStd.toFixed(3)}</span> <span className="k">(σ={sigma.toFixed(2)})</span></div>
            </div>
            <pre className="mono" style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 18, lineHeight: 1.7 }}>
{`         1            (x−μ)²
f(x) = ───── · exp(− ────── )
       σ√2π            2σ²`}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
