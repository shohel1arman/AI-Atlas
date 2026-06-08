import { useCallback, useRef, useState } from "react";
import TopBar from "@/components/TopBar";

const SIZE = 420;
const C = SIZE / 2;
const UNIT = 48;

interface V { x: number; y: number; }
const toPx = (v: V): [number, number] => [C + v.x * UNIT, C - v.y * UNIT];
const toData = (px: number, py: number): V => ({ x: (px - C) / UNIT, y: (C - py) / UNIT });

export default function VectorsPlayground() {
  const [a, setA] = useState<V>({ x: 2.4, y: 1.6 });
  const [b, setB] = useState<V>({ x: 2.8, y: -0.8 });
  const drag = useRef<"a" | "b" | null>(null);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.hypot(a.x, a.y);
  const magB = Math.hypot(b.x, b.y);
  const cos = dot / (magA * magB || 1);
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const projScalar = dot / (magB || 1); // length of a's shadow on b
  const proj: V = { x: (dot / (magB * magB || 1)) * b.x, y: (dot / (magB * magB || 1)) * b.y };

  const paint = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    // grid + axes
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(C + i * UNIT, 0); ctx.lineTo(C + i * UNIT, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, C + i * UNIT); ctx.lineTo(SIZE, C + i * UNIT); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath(); ctx.moveTo(0, C); ctx.lineTo(SIZE, C); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(C, 0); ctx.lineTo(C, SIZE); ctx.stroke();

    // projection of a onto b (dashed) + dropline
    const arrow = (v: V, color: string, w = 3, dash: number[] = []) => {
      const [px, py] = toPx(v);
      ctx.save(); ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(C, C); ctx.lineTo(px, py); ctx.stroke();
      const ang = Math.atan2(py - C, px - C);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 11 * Math.cos(ang - 0.4), py - 11 * Math.sin(ang - 0.4));
      ctx.lineTo(px - 11 * Math.cos(ang + 0.4), py - 11 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
      ctx.restore();
    };

    // dropline from a to its projection
    const [ax, ay] = toPx(a); const [prx, pry] = toPx(proj);
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(prx, pry); ctx.stroke(); ctx.setLineDash([]);

    arrow(proj, "rgba(251,191,36,0.9)", 5);        // projection (thick gold)
    arrow(b, "#34d399");                            // b
    arrow(a, "#6c5cff");                            // a

    ctx.font = "14px JetBrains Mono"; ctx.fillStyle = "#6c5cff"; ctx.fillText("a", ax + 8, ay - 6);
    const [bx, by] = toPx(b); ctx.fillStyle = "#34d399"; ctx.fillText("b", bx + 8, by - 6);
  }, [a, b, proj]);

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  const evt = (e: React.PointerEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return toData(((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE);
  };
  const onDown = (e: React.PointerEvent) => {
    const d = evt(e);
    const near = (v: V) => Math.hypot(v.x - d.x, v.y - d.y) < 0.5;
    drag.current = near(a) ? "a" : near(b) ? "b" : null;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = evt(e);
    (drag.current === "a" ? setA : setB)(d);
  };

  return (
    <>
      <TopBar crumb="Math Lab · Vectors" tag="live · drag the arrows" />
      <div className="content">
        <h1 className="page-title">Vectors, dot product & projection</h1>
        <p className="page-sub">
          Drag the tips of <b style={{ color: "#6c5cff" }}>a</b> and <b style={{ color: "#34d399" }}>b</b>.
          The dot product is the heart of almost everything in ML — similarity, attention, neuron
          activations. The gold arrow is a's shadow (projection) onto b; when the vectors are
          perpendicular the dot product is exactly zero.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: "1 / 1", cursor: "grab" }}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} />
          </div>
          <div className="panel panel-pad">
            <div style={{ display: "grid", gap: 11 }}>
              <div className="stat"><span className="k">a&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">({a.x.toFixed(2)}, {a.y.toFixed(2)})</span></div>
              <div className="stat"><span className="k">b&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">({b.x.toFixed(2)}, {b.y.toFixed(2)})</span></div>
              <div className="stat"><span className="k">|a|&nbsp;&nbsp;&nbsp;</span><span className="v">{magA.toFixed(3)}</span></div>
              <div className="stat"><span className="k">|b|&nbsp;&nbsp;&nbsp;</span><span className="v">{magB.toFixed(3)}</span></div>
              <div className="stat"><span className="k">a · b&nbsp;</span><span className="v" style={{ color: Math.abs(dot) < 0.1 ? "var(--warn)" : "var(--good)" }}>{dot.toFixed(3)}</span></div>
              <div className="stat"><span className="k">angle&nbsp;</span><span className="v">{angle.toFixed(1)}°</span></div>
              <div className="stat"><span className="k">proj&nbsp;&nbsp;</span><span className="v">{projScalar.toFixed(3)}</span></div>
            </div>
            <pre className="mono" style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 18, lineHeight: 1.7 }}>
{`a · b = |a||b|cos θ
      = Σ aᵢ·bᵢ
proj_b a = (a·b / |b|²) b`}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
