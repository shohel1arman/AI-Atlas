import { useCallback, useRef, useState } from "react";
import TopBar from "@/components/TopBar";

const SIZE = 440;
const UNIT = 46; // pixels per unit
const C = SIZE / 2; // center

type Mat = { a: number; b: number; c: number; d: number };

const PRESETS: { name: string; m: Mat }[] = [
  { name: "Identity", m: { a: 1, b: 0, c: 0, d: 1 } },
  { name: "Rotate 30°", m: { a: 0.866, b: -0.5, c: 0.5, d: 0.866 } },
  { name: "Shear", m: { a: 1, b: 1, c: 0, d: 1 } },
  { name: "Scale 2×", m: { a: 2, b: 0, c: 0, d: 2 } },
  { name: "Reflect", m: { a: 1, b: 0, c: 0, d: -1 } },
  { name: "Squash", m: { a: 1, b: 0.6, c: 0.6, d: 1 } },
];

// transform a point (data units) and map to canvas pixels
const tx = (m: Mat, x: number, y: number): [number, number] => [
  C + (m.a * x + m.b * y) * UNIT,
  C - (m.c * x + m.d * y) * UNIT,
];

export default function LinearAlgebraPlayground() {
  const [m, setM] = useState<Mat>({ a: 1, b: 0.5, c: 0.3, d: 1 });
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const det = m.a * m.d - m.b * m.c;

  const paint = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    const R = 5;
    // original (untransformed) faint grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = -R; i <= R; i++) {
      ctx.beginPath(); ctx.moveTo(C + i * UNIT, 0); ctx.lineTo(C + i * UNIT, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, C + i * UNIT); ctx.lineTo(SIZE, C + i * UNIT); ctx.stroke();
    }

    // transformed grid (the matrix applied to all of space)
    ctx.strokeStyle = "rgba(108,92,255,0.45)";
    ctx.lineWidth = 1;
    for (let i = -R; i <= R; i++) {
      // vertical line x=i, y from -R..R
      let [sx, sy] = tx(m, i, -R); ctx.beginPath(); ctx.moveTo(sx, sy);
      [sx, sy] = tx(m, i, R); ctx.lineTo(sx, sy); ctx.stroke();
      // horizontal line y=i
      [sx, sy] = tx(m, -R, i); ctx.beginPath(); ctx.moveTo(sx, sy);
      [sx, sy] = tx(m, R, i); ctx.lineTo(sx, sy); ctx.stroke();
    }

    // unit square (shaded — its area equals |det|)
    ctx.fillStyle = det < 0 ? "rgba(248,113,113,0.18)" : "rgba(52,211,153,0.18)";
    ctx.beginPath();
    let [x0, y0] = tx(m, 0, 0); ctx.moveTo(x0, y0);
    let [x1, y1] = tx(m, 1, 0); ctx.lineTo(x1, y1);
    [x1, y1] = tx(m, 1, 1); ctx.lineTo(x1, y1);
    [x1, y1] = tx(m, 0, 1); ctx.lineTo(x1, y1);
    ctx.closePath(); ctx.fill();

    // basis vectors î and ĵ
    const drawVec = (ex: number, ey: number, color: string, label: string) => {
      const [px, py] = tx(m, ex, ey);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(C, C); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = "13px JetBrains Mono"; ctx.fillText(label, px + 6, py - 6);
    };
    drawVec(1, 0, "#34d399", "î");
    drawVec(0, 1, "#fbbf24", "ĵ");

    void x0; void y0;
  }, [m, det]);

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  const slider = (key: keyof Mat, label: string) => (
    <div className="control">
      <label>{label} <span className="val">{m[key].toFixed(2)}</span></label>
      <input type="range" min={-2} max={2} step={0.05} value={m[key]}
        onChange={(e) => setM((prev) => ({ ...prev, [key]: +e.target.value }))} />
    </div>
  );

  return (
    <>
      <TopBar crumb="Math · Linear Algebra" tag="live · transforms" />
      <div className="content">
        <h1 className="page-title">A matrix is a transformation of space</h1>
        <p className="page-sub">
          A 2×2 matrix tells the two basis vectors î and ĵ where to land — and that's enough to move
          every point in the plane. The shaded square is the unit square; its area is the
          determinant. When the determinant goes negative, space flips inside-out.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: "1 / 1" }} />
          </div>

          <div className="panel panel-pad">
            <p className="mono" style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>
              [ {m.a.toFixed(2)}&nbsp; {m.b.toFixed(2)} ]<br />
              [ {m.c.toFixed(2)}&nbsp; {m.d.toFixed(2)} ]
            </p>

            {slider("a", "a  (î.x)")}
            {slider("c", "c  (î.y)")}
            {slider("b", "b  (ĵ.x)")}
            {slider("d", "d  (ĵ.y)")}

            <div className="stat" style={{ marginTop: 6 }}>
              <span className="k">det&nbsp;=&nbsp;</span>
              <span className="v" style={{ color: det < 0 ? "var(--bad)" : "var(--good)" }}>
                {det.toFixed(3)}
              </span>
              <span className="k">&nbsp;&nbsp;({det < 0 ? "orientation flipped" : det === 0 ? "collapsed" : "area ×" + Math.abs(det).toFixed(2)})</span>
            </div>

            <div className="control" style={{ marginTop: 18 }}>
              <label>Presets</label>
              <div className="btn-row">
                {PRESETS.map((p) => (
                  <button key={p.name} className="btn" onClick={() => setM(p.m)}>{p.name}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
