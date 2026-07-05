import type { FoamTreeDatum, FoamTreeGraph, FoamTreeGraphNode } from "../types";

export function graphToHierarchy(graph: FoamTreeGraph): FoamTreeDatum[] {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const childrenByParent = new Map<string, string[]>();

  for (const edge of graph.edges) {
    const children = childrenByParent.get(edge.from) ?? [];
    children.push(edge.to);
    childrenByParent.set(edge.from, children);
  }

  return graph.roots.map((rootId) => buildNode(rootId, nodes, childrenByParent, new Set()));
}

function buildNode(
  id: string,
  nodes: Map<string, FoamTreeGraphNode>,
  childrenByParent: Map<string, string[]>,
  ancestors: Set<string>
): FoamTreeDatum {
  const node = nodes.get(id);
  if (!node) {
    throw new Error(`Graph node "${id}" was referenced but not provided.`);
  }

  if (ancestors.has(id)) {
    throw new Error(`Cycle detected while building hierarchy at "${id}".`);
  }

  const nextAncestors = new Set(ancestors).add(id);
  const children = (childrenByParent.get(id) ?? []).map((childId) =>
    buildNode(childId, nodes, childrenByParent, nextAncestors)
  );

  return {
    id: node.id,
    label: node.label,
    weight: Math.max(node.weight, aggregateChildWeight(children), 0.01),
    url: node.url,
    metrics: node.metrics,
    children: children.length > 0 ? children : undefined
  };
}

function aggregateChildWeight(children: FoamTreeDatum[]): number {
  return children.reduce((sum, child) => sum + child.weight, 0);
}
