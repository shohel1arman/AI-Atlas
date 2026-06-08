/**
 * A small but real multilayer perceptron for 2D binary classification.
 *   inputs(2) -> hidden(H, tanh) -> output(1, sigmoid)
 * Trained with full-batch gradient descent on binary cross-entropy.
 * No React, no canvas — just math, so it can be tested and reused.
 */

export interface DataPoint {
  x: number; // in [-1, 1]
  y: number; // in [-1, 1]
  label: 0 | 1;
}

export type DatasetKind = "circle" | "xor" | "gauss" | "spiral";

const tanh = Math.tanh;
const dtanh = (t: number) => 1 - t * t; // derivative given the tanh OUTPUT t
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

export class MLP {
  W1: number[][]; // [H][2]
  b1: number[]; //   [H]
  W2: number[]; //   [H]
  b2 = 0;
  readonly H: number;

  constructor(hidden: number) {
    this.H = hidden;
    const r = () => (Math.random() * 2 - 1) * 0.8;
    this.W1 = Array.from({ length: hidden }, () => [r(), r()]);
    this.b1 = Array.from({ length: hidden }, () => 0);
    this.W2 = Array.from({ length: hidden }, () => r());
  }

  /** Returns hidden activations and the final probability. */
  private forward(x: number, y: number) {
    const h = new Array<number>(this.H);
    for (let i = 0; i < this.H; i++) {
      h[i] = tanh(this.W1[i][0] * x + this.W1[i][1] * y + this.b1[i]);
    }
    let z = this.b2;
    for (let i = 0; i < this.H; i++) z += this.W2[i] * h[i];
    return { h, p: sigmoid(z) };
  }

  predict(x: number, y: number): number {
    return this.forward(x, y).p;
  }

  /** One full-batch GD step. Returns mean cross-entropy loss before the update. */
  trainStep(data: DataPoint[], lr: number): number {
    const n = data.length;
    if (n === 0) return 0;

    // gradient accumulators
    const gW1 = this.W1.map(() => [0, 0]);
    const gb1 = new Array<number>(this.H).fill(0);
    const gW2 = new Array<number>(this.H).fill(0);
    let gb2 = 0;
    let loss = 0;

    for (const pt of data) {
      const { h, p } = this.forward(pt.x, pt.y);
      const t = pt.label;
      loss += -(t * Math.log(p + 1e-9) + (1 - t) * Math.log(1 - p + 1e-9));

      const dz = p - t; // dL/dz for sigmoid + BCE
      gb2 += dz;
      for (let i = 0; i < this.H; i++) {
        gW2[i] += dz * h[i];
        const dh = dz * this.W2[i] * dtanh(h[i]);
        gW1[i][0] += dh * pt.x;
        gW1[i][1] += dh * pt.y;
        gb1[i] += dh;
      }
    }

    const s = lr / n;
    for (let i = 0; i < this.H; i++) {
      this.W1[i][0] -= s * gW1[i][0];
      this.W1[i][1] -= s * gW1[i][1];
      this.b1[i] -= s * gb1[i];
      this.W2[i] -= s * gW2[i];
    }
    this.b2 -= s * gb2;

    return loss / n;
  }
}

export function makeDataset(kind: DatasetKind, n = 160): DataPoint[] {
  const pts: DataPoint[] = [];
  const noise = 0.12;
  const jitter = () => (Math.random() * 2 - 1) * noise;
  for (let i = 0; i < n; i++) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let label: 0 | 1 = 0;
    switch (kind) {
      case "circle":
        label = x * x + y * y < 0.4 ? 1 : 0;
        break;
      case "xor":
        label = x * y > 0 ? 1 : 0;
        break;
      case "gauss": {
        const c = Math.random() < 0.5 ? -0.5 : 0.5;
        x = c + jitter() * 3;
        y = c + jitter() * 3;
        label = c > 0 ? 1 : 0;
        break;
      }
      case "spiral": {
        const arm = i % 2;
        const t = (i / n) * 4 * Math.PI + arm * Math.PI;
        const r = (i / n) * 0.9;
        x = r * Math.cos(t) + jitter();
        y = r * Math.sin(t) + jitter();
        label = arm as 0 | 1;
        break;
      }
    }
    pts.push({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)), label });
  }
  return pts;
}
