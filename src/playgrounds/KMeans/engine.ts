/** K-means clustering math. Pure TS, no rendering. */

export interface Pt { x: number; y: number; } // in [0,1]
export interface Labeled extends Pt { c: number; } // c = centroid index

export function makeBlobs(k = 3, perCluster = 40): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < k; i++) {
    const cx = 0.15 + Math.random() * 0.7;
    const cy = 0.15 + Math.random() * 0.7;
    for (let j = 0; j < perCluster; j++) {
      pts.push({
        x: Math.min(0.98, Math.max(0.02, cx + (Math.random() - 0.5) * 0.22)),
        y: Math.min(0.98, Math.max(0.02, cy + (Math.random() - 0.5) * 0.22)),
      });
    }
  }
  return pts;
}

export function initCentroids(k: number): Pt[] {
  return Array.from({ length: k }, () => ({ x: Math.random(), y: Math.random() }));
}

/** Assign each point to its nearest centroid. */
export function assign(points: Pt[], centroids: Pt[]): Labeled[] {
  return points.map((p) => {
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, i) => {
      const d = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return { ...p, c: best };
  });
}

/** Move each centroid to the mean of its assigned points. Returns how far they moved. */
export function update(labeled: Labeled[], centroids: Pt[]): { centroids: Pt[]; shift: number } {
  let shift = 0;
  const next = centroids.map((c, i) => {
    const mine = labeled.filter((p) => p.c === i);
    if (mine.length === 0) return c;
    const nx = mine.reduce((s, p) => s + p.x, 0) / mine.length;
    const ny = mine.reduce((s, p) => s + p.y, 0) / mine.length;
    shift += Math.hypot(nx - c.x, ny - c.y);
    return { x: nx, y: ny };
  });
  return { centroids: next, shift };
}

/** Within-cluster sum of squares — the objective k-means minimizes. */
export function inertia(labeled: Labeled[], centroids: Pt[]): number {
  return labeled.reduce((s, p) => {
    const c = centroids[p.c];
    return s + (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
  }, 0);
}
