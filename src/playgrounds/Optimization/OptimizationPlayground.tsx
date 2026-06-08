import { useCallback, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";

const SIZE = 440;
const RANGE = 3; // domain [-RANGE, RANGE]^2

// An elongated bowl — anisotropic so the learning-rate trade-off is visible.
const f = (x: number, y: number) => 0.5 * (x * x) / 2.2 + 0.5 * (y * y) * 1.7;
const grad = (x: number, y: number) => ({ gx: x / 2.2, gy: y * 1.7 });

const toPx = (x: number, y: number): [number, number] => [
  ((x + RANGE) / (2 * RANGE)) * SIZE,
  SIZE - ((y + RANGE) / (2 * RANGE)) * SIZE,
];
const toData = (px: number, py: number) => ({
  x: (px / SIZE) * 2 * RANGE - RANGE,
  y: ((SIZE - py) / SIZE) * 2 * RANGE - RANGE,
});

export default function OptimizationPlayground() {
  const [lr, setLr] = useState(0.18);
  const [running, setRunning] = useState(false);
  const [path, setPath] = useState<{ x: number; y: number }[]>([{ x: -2.4, y: 2.1 }]);
  const accum = useRef(0);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const head = path[path.length - 1];
  const loss = f(head.x, head.y);

  useAnimationFrame((dt) => {
    accum.current += dt;
    if (accum.current < 0.08) return;
    accum.current = 0;
    setPath((p) => {
      const cur = p[p.length - 1];
      const { gx, gy } = grad(cur.x, cur.y);
      const next = { x: cur.x - lr * gx, y: cur.y - lr * gy };
      // stop if converged or blown up
      if (Math.hypot(next.x - cur.x, next.y - cur.y) < 1e-4 || Math.abs(next.x) > RANGE * 3) {
        setRunning(false);
        return p;
      }
      return [...p.slice(-200), next];
    });
  }, running);

  const paint = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // contour field (filled)
    const N = 80, cell = SIZE / N;
    let fmax = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const { x, y } = toData(i * cell, j * cell);
      fmax = Math.max(fmax, f(x, y));
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const { x, y } = toData(i * cell + cell / 2, j * cell + cell / 2);
        const t = Math.sqrt(f(x, y) / fmax); // sqrt for nicer banding
        const band = Math.floor(t * 8) / 8; // discrete iso-bands
        const c = Math.round(20 + band * 90);
        ctx.fillStyle = `rgb(${c + band * 40}, ${c}, ${Math.round(40 + (1 - band) * 120)})`;
        ctx.fillRect(i * cell, j * cell, cell + 1, cell + 1);
      }
    }

    // descent path
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
    ctx.beginPath();
    path.forEach((p, i) => {
      const [px, py] = toPx(p.x, p.y);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    path.forEach((p) => {
      const [px, py] = toPx(p.x, p.y);
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    // current point + minimum marker
    const [hx, hy] = toPx(head.x, head.y);
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI * 2); ctx.fill();
    const [mx, my] = toPx(0, 0);
    ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mx - 6, my); ctx.lineTo(mx + 6, my); ctx.moveTo(mx, my - 6); ctx.lineTo(mx, my + 6); ctx.stroke();
  }, [path, head]);

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  const onClick = (e: React.MouseEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const d = toData(((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE);
    setRunning(false);
    setPath([d]);
  };

  return (
    <>
      <TopBar crumb="Math Lab · Optimization" tag="live · contours" />
      <div className="content">
        <h1 className="page-title">Rolling downhill on a loss surface</h1>
        <p className="page-sub">
          Gradient descent follows the steepest downhill direction. Click anywhere to drop a ball,
          then train. The valley is stretched, so a learning rate that's too big makes the path
          bounce across the narrow axis instead of sliding down it — the central tension of training
          every model. Green cross marks the minimum.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: "1 / 1", cursor: "crosshair" }} onClick={onClick} />
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10 }}>Click to reposition the starting point.</p>
          </div>
          <div className="panel panel-pad">
            <div className="control">
              <label>Learning rate <span className="val">{lr.toFixed(2)}</span></label>
              <input type="range" min={0.02} max={1.3} step={0.02} value={lr} onChange={(e) => setLr(+e.target.value)} />
            </div>
            <div className="btn-row" style={{ marginBottom: 22 }}>
              <button className="btn primary" onClick={() => setRunning((r) => !r)}>{running ? "⏸ Pause" : "▶ Descend"}</button>
              <button className="btn" onClick={() => { setRunning(false); setPath([{ x: -2.4, y: 2.1 }]); }}>Reset</button>
            </div>
            <div style={{ display: "grid", gap: 9 }}>
              <div className="stat"><span className="k">steps&nbsp;&nbsp;</span><span className="v">{path.length - 1}</span></div>
              <div className="stat"><span className="k">pos&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">({head.x.toFixed(2)}, {head.y.toFixed(2)})</span></div>
              <div className="stat"><span className="k">f(x,y)</span> <span className="v" style={{ color: "var(--good)" }}>{loss.toFixed(4)}</span></div>
            </div>
            {lr > 1.0 && <p style={{ fontSize: 12, color: "var(--warn)", marginTop: 14 }}>⚠ Watch it overshoot and diverge.</p>}
            <pre className="mono" style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 16, lineHeight: 1.7 }}>
{`xₜ₊₁ = xₜ − lr · ∇f(xₜ)`}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
