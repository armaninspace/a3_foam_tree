import { describe, expect, it } from "vitest";
import { hitTest } from "./hitTest";
import type { FoamTreeDatum, FoamTreeLayoutNode, Point } from "../types";

const square = (x: number, y: number, size: number): Point[] => [
  { x, y },
  { x: x + size, y },
  { x: x + size, y: y + size },
  { x, y: y + size }
];

function node(id: string, polygon: Point[], children: FoamTreeLayoutNode[] = []): FoamTreeLayoutNode {
  const source: FoamTreeDatum = { id, label: id, weight: 1 };
  return {
    id,
    label: id,
    weight: 1,
    depth: children.length > 0 ? 0 : 1,
    colorIndex: 0,
    polygon,
    centroid: polygon[0],
    area: 1,
    children,
    source
  };
}

describe("hitTest", () => {
  it("returns the deepest topmost node containing the point", () => {
    const child = node("child", square(2, 2, 4));
    const parent = node("parent", square(0, 0, 10), [child]);

    expect(hitTest([parent], { x: 3, y: 3 })?.id).toBe("child");
    expect(hitTest([parent], { x: 9, y: 9 })?.id).toBe("parent");
  });

  it("returns undefined outside all polygons", () => {
    expect(hitTest([node("a", square(0, 0, 10))], { x: 12, y: 12 })).toBeUndefined();
  });
});
