import { useCallback, useMemo, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import {
  gradientStep,
  mse,
  ordinaryLeastSquares,
  sampleData,
  type Params,
  type Point,
} from "./engine";

const W = 560;
const H = 380;
const PAD = 36;

// Map normalized (0..1) data coords to canvas pixels.
const toPx = (x: number, y: number): [number, number] => [
  PAD + x * (W - 2 * PAD),
  H - PAD - y * (H - 2 * PAD),
];
const toData = (px: number, py: number): Point => ({
  x: (px - PAD) / (W - 2 * PAD),
  y: (H - PAD - py) / (H - 2 * PAD),
});

export default function GradientDescentPlayground() {
  const [points, setPoints] = useState<Point[]>(() => sampleData());
  const [params, setParams] = useState<Params>({ w: 0.1, b: 0.9 });
  const [lr, setLr] = useState(0.3);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);

  const dragIndex = useRef<number | null>(null);
  const accum = useRef(0); // throttles steps to a readable speed

  const loss = useMemo(() => mse(points, params), [points, params]);
  const ols = useMemo(() => ordinaryLeastSquares(points), [points]);

  // ── Training loop: one GD step every ~60ms so the eye can follow it ──
  useAnimationFrame((dt) => {
    accum.current += dt;
    if (accum.current < 0.06) return;
    accum.current = 0;
    setParams((prev) => {
      const { params: next, loss: l } = gradientStep(points, prev, lr);
      setLossHistory((h) => [...h.slice(-159), l]);
      return next;
    });
    setSteps((s) => s + 1);
  }, running && points.length > 1);

  // ── Canvas painting ──
  const paint = useCallback(
    (cv: HTMLCanvasElement | null) => {
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const gx = PAD + (i / 10) * (W - 2 * PAD);
        const gy = PAD + (i / 10) * (H - 2 * PAD);
        ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, H - PAD); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(W - PAD, gy); ctx.stroke();
      }

      // OLS target line (faint dashed — the "answer")
      drawLine(ctx, ols, "rgba(52,211,153,0.45)", 1.5, [5, 5]);
      // current model line (solid accent)
      drawLine(ctx, params, "#6c5cff", 2.5);

      // residuals + points
      for (const p of points) {
        const [px, py] = toPx(p.x, p.y);
        const [, lpy] = toPx(p.x, params.w * p.x + params.b);
        ctx.strokeStyle = "rgba(248,113,113,0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, lpy); ctx.stroke();

        ctx.fillStyle = "#ececf1";
        ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#0a0a0f"; ctx.lineWidth = 2; ctx.stroke();
      }
    },
    [points, params, ols],
  );

  // Re-paint whenever state changes (cheap; canvas is imperative, not reconciled).
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const setCanvas = (node: HTMLCanvasElement | null) => { canvasEl.current = node; paint(node); };
  if (canvasEl.current) paint(canvasEl.current);

  // ── Pointer interaction: drag a point or drop a new one ──
  const evtToCanvas = (e: React.PointerEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { px: ((e.clientX - r.left) / r.width) * W, py: ((e.clientY - r.top) / r.height) * H };
  };
  const onDown = (e: React.PointerEvent) => {
    const { px, py } = evtToCanvas(e);
    let hit = -1;
    points.forEach((p, i) => {
      const [qx, qy] = toPx(p.x, p.y);
      if (Math.hypot(qx - px, qy - py) < 10) hit = i;
    });
    if (hit >= 0) { dragIndex.current = hit; }
    else {
      const d = toData(px, py);
      if (d.x >= 0 && d.x <= 1 && d.y >= 0 && d.y <= 1) setPoints((p) => [...p, d]);
    }
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragIndex.current === null) return;
    const { px, py } = evtToCanvas(e);
    const d = toData(px, py);
    setPoints((prev) => prev.map((p, i) => (i === dragIndex.current ? d : p)));
  };
  const onUp = () => { dragIndex.current = null; };

  const reset = () => {
    setRunning(false);
    setParams({ w: 0.1, b: 0.9 });
    setSteps(0);
    setLossHistory([]);
  };
  const newData = () => { reset(); setPoints(sampleData()); };

  return (
    <>
      <TopBar crumb="Gradient Descent" tag="live · canvas" />
      <div className="content">
        <h1 className="page-title">Watch a line learn</h1>
        <p className="page-sub">
          Gradient descent nudges the line downhill on the error surface. Drag points, click to add
          them, change the learning rate, and hit train. The dashed green line is the exact
          least-squares answer — gradient descent should crawl toward it.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas
              ref={setCanvas}
              style={{ width: "100%", aspectRatio: `${W}/${H}`, cursor: "crosshair" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
            />
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10 }}>
              <span style={{ color: "#6c5cff" }}>━</span> model &nbsp;·&nbsp;
              <span style={{ color: "#34d399" }}>┄</span> least-squares optimum &nbsp;·&nbsp;
              <span style={{ color: "#f87171" }}>┃</span> residuals
            </p>
          </div>

          <div className="panel panel-pad">
            <div className="control">
              <label>
                Learning rate <span className="val">{lr.toFixed(2)}</span>
              </label>
              <input type="range" min={0.01} max={1.2} step={0.01} value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))} />
            </div>

            <div className="btn-row" style={{ marginBottom: 22 }}>
              <button className="btn primary" onClick={() => setRunning((r) => !r)}>
                {running ? "⏸ Pause" : "▶ Train"}
              </button>
              <button className="btn" onClick={reset}>Reset</button>
              <button className="btn" onClick={newData}>New data</button>
            </div>

            <div style={{ display: "grid", gap: 9 }}>
              <div className="stat"><span className="k">step&nbsp;&nbsp;</span><span className="v">{steps}</span></div>
              <div className="stat"><span className="k">w&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">{params.w.toFixed(3)}</span> <span className="k">(opt {ols.w.toFixed(3)})</span></div>
              <div className="stat"><span className="k">b&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">{params.b.toFixed(3)}</span> <span className="k">(opt {ols.b.toFixed(3)})</span></div>
              <div className="stat"><span className="k">loss&nbsp;&nbsp;</span><span className="v" style={{ color: "var(--good)" }}>{loss.toFixed(5)}</span></div>
            </div>

            <LossSparkline history={lossHistory} />

            {lr > 0.95 && (
              <p style={{ fontSize: 12, color: "var(--warn)", marginTop: 14 }}>
                ⚠ High learning rate — watch the loss bounce or diverge instead of settling.
              </p>
            )}
          </div>
        </div>

        <div className="panel panel-pad" style={{ marginTop: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 18, marginBottom: 10 }}>
            The math
          </h3>
          <pre className="mono" style={{ fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.7, overflowX: "auto" }}>
{`ŷ = w·x + b
L = (1/N) Σ (ŷ − y)²            ← mean squared error
∂L/∂w = (2/N) Σ (ŷ − y)·x       w ← w − lr · ∂L/∂w
∂L/∂b = (2/N) Σ (ŷ − y)         b ← b − lr · ∂L/∂b`}
          </pre>
        </div>
      </div>
    </>
  );
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  { w, b }: Params,
  color: string,
  width: number,
  dash: number[] = [],
) {
  const [x0, y0] = toPx(0, b);
  const [x1, y1] = toPx(1, w * 1 + b);
  ctx.save();
  ctx.setLineDash(dash);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.restore();
}

function LossSparkline({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  const max = Math.max(...history, 1e-6);
  const w = 240, h = 54;
  const pts = history
    .map((v, i) => `${(i / (history.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <div style={{ marginTop: 20 }}>
      <label style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        loss over time
      </label>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 54, marginTop: 6 }}>
        <polyline points={pts} fill="none" stroke="var(--good)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
