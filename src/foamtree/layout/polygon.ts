import type { Bounds, Point } from "../types";

const EPSILON = 1e-8;

export function boundsToPolygon(bounds: Bounds): Point[] {
  const x0 = bounds.x;
  const y0 = bounds.y;
  const x1 = bounds.x + bounds.width;
  const y1 = bounds.y + bounds.height;
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 }
  ];
}

export function polygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

export function signedPolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return sum / 2;
}

export function polygonCentroid(points: Point[]): Point {
  const area = signedPolygonArea(points);
  if (Math.abs(area) < EPSILON) {
    return averagePoint(points);
  }

  let x = 0;
  let y = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const cross = a.x * b.y - b.x * a.y;
    x += (a.x + b.x) * cross;
    y += (a.y + b.y) * cross;
  }

  return {
    x: x / (6 * area),
    y: y / (6 * area)
  };
}

export function averagePoint(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  const total = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  return { x: total.x / points.length, y: total.y / points.length };
}

export function insetPolygon(points: Point[], amount: number): Point[] {
  if (amount <= 0 || points.length < 3) return points;
  const center = polygonCentroid(points);
  return points.map((point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= amount) return point;
    const scale = (distance - amount) / distance;
    return {
      x: center.x + dx * scale,
      y: center.y + dy * scale
    };
  });
}

export function clipPolygonWithHalfPlane(
  polygon: Point[],
  a: number,
  b: number,
  c: number
): Point[] {
  if (polygon.length === 0) return [];

  const output: Point[] = [];
  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const previous = polygon[(i + polygon.length - 1) % polygon.length];
    const currentInside = a * current.x + b * current.y <= c + EPSILON;
    const previousInside = a * previous.x + b * previous.y <= c + EPSILON;

    if (currentInside !== previousInside) {
      output.push(intersectSegmentWithLine(previous, current, a, b, c));
    }

    if (currentInside) {
      output.push(current);
    }
  }

  return dedupePoints(output);
}

function intersectSegmentWithLine(
  start: Point,
  end: Point,
  a: number,
  b: number,
  c: number
): Point {
  const startValue = a * start.x + b * start.y - c;
  const endValue = a * end.x + b * end.y - c;
  const denominator = startValue - endValue;
  const t = Math.abs(denominator) < EPSILON ? 0 : startValue / denominator;

  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t
  };
}

function dedupePoints(points: Point[]): Point[] {
  return points.filter((point, index) => {
    const previous = points[(index + points.length - 1) % points.length];
    return Math.hypot(point.x - previous.x, point.y - previous.y) > 0.05;
  });
}

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const intersects =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}
