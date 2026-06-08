import { useCallback, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { assign, initCentroids, inertia, makeBlobs, update, type Labeled, type Pt } from "./engine";

const SIZE = 440;
const PALETTE = ["#6c5cff", "#34d399", "#fbbf24", "#f87171", "#38bdf8", "#f472b6"];

export default function KMeansPlayground() {
  const [k, setK] = useState(3);
  const [points, setPoints] = useState<Pt[]>(() => makeBlobs(3));
  const [centroids, setCentroids] = useState<Pt[]>(() => initCentroids(3));
  const [labeled, setLabeled] = useState<Labeled[]>(() => assign(points, centroids));
  const [iter, setIter] = useState(0);
  const [converged, setConverged] = useState(false);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const reset = useCallback((nk: number) => {
    const pts = makeBlobs(nk);
    const cs = initCentroids(nk);
    setPoints(pts);
    setCentroids(cs);
    setLabeled(assign(pts, cs));
    setIter(0);
    setConverged(false);
  }, []);

  const step = useCallback(() => {
    // one Lloyd iteration: assign, then move centroids
    const lab = assign(points, centroids);
    const { centroids: next, shift } = update(lab, centroids);
    setLabeled(assign(points, next));
    setCentroids(next);
    setIter((i) => i + 1);
    if (shift < 1e-4) setConverged(true);
  }, [points, centroids]);

  const paint = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    for (const p of labeled) {
      ctx.beginPath();
      ctx.arc(p.x * SIZE, (1 - p.y) * SIZE, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE[p.c % PALETTE.length] + "cc";
      ctx.fill();
    }
    centroids.forEach((c, i) => {
      const cx = c.x * SIZE, cy = (1 - c.y) * SIZE;
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.strokeStyle = "#0a0a0f";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // draw a diamond for the centroid
      ctx.moveTo(cx, cy - 9); ctx.lineTo(cx + 9, cy); ctx.lineTo(cx, cy + 9); ctx.lineTo(cx - 9, cy);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });
  }, [labeled, centroids]);

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  return (
    <>
      <TopBar crumb="Machine Learning · K-Means" tag="live · clustering" />
      <div className="content">
        <h1 className="page-title">K-Means, one step at a time</h1>
        <p className="page-sub">
          K-means alternates two moves: assign every point to its nearest centroid, then slide each
          centroid to the average of its points. Repeat until nothing moves. Step through it
          manually to see exactly how the clusters lock into place.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: "1 / 1" }} />
          </div>

          <div className="panel panel-pad">
            <div className="control">
              <label>Clusters (k) <span className="val">{k}</span></label>
              <input type="range" min={2} max={6} step={1} value={k}
                onChange={(e) => { const v = +e.target.value; setK(v); reset(v); }} />
            </div>

            <div className="btn-row" style={{ marginBottom: 22 }}>
              <button className="btn primary" onClick={step} disabled={converged}>
                ▶ Step
              </button>
              <button className="btn" onClick={() => reset(k)}>New data</button>
            </div>

            <div style={{ display: "grid", gap: 9 }}>
              <div className="stat"><span className="k">iteration&nbsp;</span><span className="v">{iter}</span></div>
              <div className="stat"><span className="k">inertia&nbsp;&nbsp;&nbsp;</span><span className="v" style={{ color: "var(--good)" }}>{inertia(labeled, centroids).toFixed(3)}</span></div>
              <div className="stat"><span className="k">status&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v">{converged ? "converged ✓" : "running…"}</span></div>
            </div>

            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 16 }}>
              Diamonds are centroids. Inertia (within-cluster spread) only ever goes down — that's
              what guarantees k-means terminates.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
