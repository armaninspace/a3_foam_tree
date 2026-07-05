import type { FoamTreeLayoutNode, Point } from "../types";
import { pointInPolygon } from "../layout/polygon";

export function hitTest(nodes: FoamTreeLayoutNode[], point: Point): FoamTreeLayoutNode | undefined {
  const flattened = flattenNodes(nodes);
  for (let index = flattened.length - 1; index >= 0; index -= 1) {
    const node = flattened[index];
    if (pointInPolygon(point, node.polygon)) return node;
  }
  return undefined;
}

function flattenNodes(nodes: FoamTreeLayoutNode[]): FoamTreeLayoutNode[] {
  const flattened: FoamTreeLayoutNode[] = [];
  for (const node of nodes) {
    flattened.push(node);
    flattened.push(...flattenNodes(node.children));
  }
  return flattened;
}
