export const SERIES_COLORS = ['#1976d2', '#f59e0b', '#7c3aed', '#10b981', '#ef4444'];
export const SERIES_NAMES = ['LINE-01', 'LINE-02', 'LINE-03', 'LINE-04', 'LINE-05'];

export interface Series {
  name: string;
  color: string;
  data: number[];
}

function seeded(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export function generateSeries(
  seed: number,
  points: number,
  base: number,
  variance: number,
  trend = 0,
): number[] {
  const rng = seeded(seed);
  const data: number[] = [];
  let v = base + (rng() - 0.5) * variance;
  for (let i = 0; i < points; i++) {
    const target = base + trend * i;
    v += (target - v) * 0.15 + (rng() - 0.5) * variance * 0.4;
    data.push(Math.max(0, +v.toFixed(2)));
  }
  return data;
}

export function makeTimeLabels(points: number, intervalMinutes = 5): string[] {
  const labels: string[] = [];
  const now = new Date();
  now.setSeconds(0, 0);
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    labels.push(`${hh}:${mm}`);
  }
  return labels;
}

export function buildSeries(
  seedBase: number,
  points: number,
  base: number,
  variance: number,
  trend: number,
): Series[] {
  return SERIES_NAMES.map((name, i) => ({
    name,
    color: SERIES_COLORS[i],
    data: generateSeries(seedBase + i * 17, points, base + i * (variance * 0.2), variance, trend),
  }));
}
