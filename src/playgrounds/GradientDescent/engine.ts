/**
 * Pure math for linear regression by gradient descent.
 * Kept free of React so it can be unit-tested and reused by any renderer.
 *
 * Model:   ŷ = w·x + b
 * Loss:    MSE = (1/N) Σ (ŷ − y)²
 * Grads:   ∂L/∂w = (2/N) Σ (ŷ − y)·x
 *          ∂L/∂b = (2/N) Σ (ŷ − y)
 */

export interface Point {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
}

export interface Params {
  w: number;
  b: number;
}

/** Mean squared error of the current line over the points. */
export function mse(points: Point[], { w, b }: Params): number {
  if (points.length === 0) return 0;
  let sum = 0;
  for (const p of points) {
    const err = w * p.x + b - p.y;
    sum += err * err;
  }
  return sum / points.length;
}

/** One gradient-descent update. Returns the new params and the loss *before* the step. */
export function gradientStep(points: Point[], params: Params, lr: number): { params: Params; loss: number } {
  const n = points.length;
  const loss = mse(points, params);
  if (n === 0) return { params, loss };

  let gw = 0;
  let gb = 0;
  for (const p of points) {
    const err = params.w * p.x + params.b - p.y;
    gw += err * p.x;
    gb += err;
  }
  gw = (2 / n) * gw;
  gb = (2 / n) * gb;

  return {
    params: { w: params.w - lr * gw, b: params.b - lr * gb },
    loss,
  };
}

/** Closed-form least-squares solution — the target GD is converging toward. */
export function ordinaryLeastSquares(points: Point[]): Params {
  const n = points.length;
  if (n < 2) return { w: 0, b: 0.5 };
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of points) {
    sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y;
  }
  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-9) return { w: 0, b: sy / n };
  const w = (n * sxy - sx * sy) / denom;
  const b = (sy - w * sx) / n;
  return { w, b };
}

/** A noisy linear cloud to start with. */
export function sampleData(count = 18, slope = 0.7, intercept = 0.18, noise = 0.08): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) / count;
    const y = slope * x + intercept + (Math.random() - 0.5) * 2 * noise;
    pts.push({ x, y: Math.max(0.02, Math.min(0.98, y)) });
  }
  return pts;
}
