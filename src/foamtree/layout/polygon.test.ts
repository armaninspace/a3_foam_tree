import { describe, expect, it } from "vitest";
import {
  boundsToPolygon,
  clipPolygonWithHalfPlane,
  insetPolygon,
  pointInPolygon,
  polygonArea,
  polygonCentroid
} from "./polygon";

describe("polygon utilities", () => {
  it("converts bounds and computes area and centroid", () => {
    const polygon = boundsToPolygon({ x: 10, y: 20, width: 30, height: 40 });

    expect(polygonArea(polygon)).toBe(1200);
    expect(polygonCentroid(polygon)).toEqual({ x: 25, y: 40 });
  });

  it("clips a polygon with a half plane", () => {
    const clipped = clipPolygonWithHalfPlane(boundsToPolygon({ x: 0, y: 0, width: 10, height: 10 }), 1, 0, 5);

    expect(polygonArea(clipped)).toBeCloseTo(50, 5);
    expect(clipped.every((point) => point.x <= 5.000001)).toBe(true);
  });

  it("insets polygons and tests point inclusion", () => {
    const polygon = boundsToPolygon({ x: 0, y: 0, width: 10, height: 10 });
    const inset = insetPolygon(polygon, 1);

    expect(polygonArea(inset)).toBeLessThan(polygonArea(polygon));
    expect(pointInPolygon({ x: 5, y: 5 }, polygon)).toBe(true);
    expect(pointInPolygon({ x: 12, y: 5 }, polygon)).toBe(false);
  });
});
