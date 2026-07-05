import { describe, expect, it } from "vitest";
import { createFoamTreeLayout } from "./hierarchyLayout";
import { polygonArea } from "./polygon";
import type { FoamTreeDatum, FoamTreeLayoutNode } from "../types";

const data: FoamTreeDatum[] = [
  {
    id: "a",
    label: "A",
    weight: 6,
    children: [
      { id: "a1", label: "A1", weight: 3 },
      { id: "a2", label: "A2", weight: 3 }
    ]
  },
  { id: "b", label: "B", weight: 4 },
  { id: "c", label: "C", weight: 2 }
];

describe("createFoamTreeLayout", () => {
  it("creates bounded cells with positive area", () => {
    const layout = createFoamTreeLayout(data, { x: 0, y: 0, width: 300, height: 180 }, {
      iterations: 8,
      padding: 2,
      hierarchyDepth: 2,
      weightStrength: 0.8,
      viewMode: "hierarchical"
    });

    expect(layout).toHaveLength(3);
    for (const node of flatten(layout)) {
      expect(node.area).toBeGreaterThan(0);
      expect(polygonArea(node.polygon)).toBeGreaterThan(0);
      for (const point of node.polygon) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(300);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(180);
      }
    }
  });

  it("honors hierarchy depth", () => {
    const shallow = createFoamTreeLayout(data, { x: 0, y: 0, width: 300, height: 180 }, {
      iterations: 4,
      padding: 0,
      hierarchyDepth: 1,
      weightStrength: 0,
      viewMode: "hierarchical"
    });

    expect(shallow[0].children).toEqual([]);
  });
});

function flatten(nodes: FoamTreeLayoutNode[]): FoamTreeLayoutNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)]);
}
