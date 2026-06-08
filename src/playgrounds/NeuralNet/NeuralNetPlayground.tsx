import { useCallback, useMemo, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { MLP, makeDataset, type DatasetKind, type DataPoint } from "./engine";

const SIZE = 420;
const GRID = 56; // decision-boundary resolution

const DATASETS: { id: DatasetKind; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "xor", label: "XOR" },
  { id: "gauss", label: "Two blobs" },
  { id: "spiral", label: "Spiral" },
];

// data coords [-1,1] -> pixels
const px = (v: number) => ((v + 1) / 2) * SIZE;

export default function NeuralNetPlayground() {
  const [dataset, setDataset] = useState<DatasetKind>("circle");
  const [hidden, setHidden] = useState(6);
  const [lr, setLr] = useState(0.5);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);

  const [data, setData] = useState<DataPoint[]>(() => makeDataset("circle"));
  const netRef = useRef<MLP>(new MLP(6));
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  const rebuild = useCallback(
    (kind: DatasetKind, h: number) => {
      netRef.current = new MLP(h);
      setData(makeDataset(kind));
      setEpoch(0);
      setLoss(0);
      setRunning(false);
    },
    [],
  );

  // train several steps per frame so convergence is quick but watchable
  useAnimationFrame(() => {
    let l = 0;
    for (let i = 0; i < 3; i++) l = netRef.current.trainStep(data, lr);
    setLoss(l);
    setEpoch((e) => e + 3);
    paint(canvasEl.current);
  }, running);

  const paint = useCallback(
    (cv: HTMLCanvasElement | null) => {
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      cv.width = SIZE * dpr;
      cv.height = SIZE * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const net = netRef.current;
      const cell = SIZE / GRID;
      for (let i = 0; i < GRID; i++) {
        for (let j = 0; j < GRID; j++) {
          const dx = (i / (GRID - 1)) * 2 - 1;
          const dy = (j / (GRID - 1)) * 2 - 1;
          const p = net.predict(dx, dy); // 0..1
          // blue (class 0) -> violet midline -> green (class 1)
          const r = Math.round(40 + (1 - p) * 70 + p * 40);
          const g = Math.round(60 + p * 150);
          const b = Math.round(60 + (1 - p) * 160);
          ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
          ctx.fillRect(i * cell, SIZE - (j + 1) * cell, cell + 1, cell + 1);
        }
      }

      for (const pt of data) {
        ctx.beginPath();
        ctx.arc(px(pt.x), SIZE - px(pt.y), 4, 0, Math.PI * 2);
        ctx.fillStyle = pt.label === 1 ? "#eafff4" : "#0a0a0f";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = pt.label === 1 ? "#0a0a0f" : "#eafff4";
        ctx.stroke();
      }
    },
    [data],
  );

  if (canvasEl.current) paint(canvasEl.current);
  const setCanvas = (n: HTMLCanvasElement | null) => { canvasEl.current = n; paint(n); };

  const accuracy = useMemo(() => {
    if (!running && epoch === 0) return null;
    const net = netRef.current;
    let correct = 0;
    for (const p of data) if ((net.predict(p.x, p.y) > 0.5 ? 1 : 0) === p.label) correct++;
    return correct / data.length;
  }, [data, epoch, running]);

  return (
    <>
      <TopBar crumb="Deep Learning Lab · Neural Net" tag="live · backprop" />
      <div className="content">
        <h1 className="page-title">Train a neural network</h1>
        <p className="page-sub">
          A real 2-layer network (tanh hidden units, sigmoid output) learning to separate two
          classes. The colored field is its decision boundary, repainted as it trains. Switch
          datasets, change the hidden-layer width, and watch how many neurons it takes to bend the
          boundary around the data.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 1fr", gap: 20, marginTop: 28 }}>
          <div className="panel panel-pad">
            <canvas ref={setCanvas} style={{ width: "100%", aspectRatio: "1 / 1" }} />
          </div>

          <div className="panel panel-pad">
            <div className="control">
              <label>Dataset</label>
              <div className="btn-row">
                {DATASETS.map((d) => (
                  <button
                    key={d.id}
                    className={`btn${dataset === d.id ? " primary" : ""}`}
                    onClick={() => { setDataset(d.id); rebuild(d.id, hidden); }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control" style={{ marginTop: 18 }}>
              <label>Hidden neurons <span className="val">{hidden}</span></label>
              <input type="range" min={1} max={16} step={1} value={hidden}
                onChange={(e) => { const h = +e.target.value; setHidden(h); rebuild(dataset, h); }} />
            </div>

            <div className="control">
              <label>Learning rate <span className="val">{lr.toFixed(2)}</span></label>
              <input type="range" min={0.05} max={2} step={0.05} value={lr}
                onChange={(e) => setLr(+e.target.value)} />
            </div>

            <div className="btn-row" style={{ marginBottom: 22 }}>
              <button className="btn primary" onClick={() => setRunning((r) => !r)}>
                {running ? "⏸ Pause" : "▶ Train"}
              </button>
              <button className="btn" onClick={() => rebuild(dataset, hidden)}>Reset</button>
            </div>

            <div style={{ display: "grid", gap: 9 }}>
              <div className="stat"><span className="k">epoch&nbsp;&nbsp;&nbsp;</span><span className="v">{epoch}</span></div>
              <div className="stat"><span className="k">loss&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="v" style={{ color: "var(--good)" }}>{loss.toFixed(4)}</span></div>
              {accuracy !== null && (
                <div className="stat"><span className="k">accuracy</span> <span className="v">{(accuracy * 100).toFixed(1)}%</span></div>
              )}
            </div>

            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 16 }}>
              Try Spiral with 4 neurons (it struggles), then bump to 12.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
