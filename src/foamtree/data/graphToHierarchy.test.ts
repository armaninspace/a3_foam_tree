import { describe, expect, it } from "vitest";
import { graphToHierarchy } from "./graphToHierarchy";
import type { FoamTreeGraph } from "../types";

describe("graphToHierarchy", () => {
  it("builds nested data and aggregates parent weight from children", () => {
    const graph: FoamTreeGraph = {
      roots: ["root"],
      nodes: [
        { id: "root", label: "Root", weight: 1 },
        { id: "child-a", label: "Child A", weight: 3 },
        { id: "child-b", label: "Child B", weight: 4, metrics: { score: 0.7 } }
      ],
      edges: [
        { from: "root", to: "child-a" },
        { from: "root", to: "child-b" }
      ]
    };

    const [root] = graphToHierarchy(graph);

    expect(root.weight).toBe(7);
    expect(root.children?.map((child) => child.id)).toEqual(["child-a", "child-b"]);
    expect(root.children?.[1].metrics?.score).toBe(0.7);
  });

  it("throws when an edge references a missing node", () => {
    const graph: FoamTreeGraph = {
      roots: ["root"],
      nodes: [{ id: "root", label: "Root", weight: 1 }],
      edges: [{ from: "root", to: "missing" }]
    };

    expect(() => graphToHierarchy(graph)).toThrow('Graph node "missing" was referenced');
  });

  it("throws when the graph contains a cycle", () => {
    const graph: FoamTreeGraph = {
      roots: ["a"],
      nodes: [
        { id: "a", label: "A", weight: 1 },
        { id: "b", label: "B", weight: 1 }
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "a" }
      ]
    };

    expect(() => graphToHierarchy(graph)).toThrow('Cycle detected while building hierarchy at "a"');
  });
});
