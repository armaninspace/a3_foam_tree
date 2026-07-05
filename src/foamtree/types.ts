export type Point = {
  x: number;
  y: number;
};

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FoamTreeDatum = {
  id: string;
  label: string;
  weight: number;
  url?: string;
  metrics?: Record<string, number | undefined>;
  children?: FoamTreeDatum[];
};

export type FoamTreeGraphNode = {
  id: string;
  label: string;
  weight: number;
  url?: string;
  metrics?: Record<string, number | undefined>;
};

export type FoamTreeGraphEdge = {
  from: string;
  to: string;
};

export type FoamTreeGraph = {
  nodes: FoamTreeGraphNode[];
  edges: FoamTreeGraphEdge[];
  roots: string[];
};

export type FoamTreeLayoutNode = {
  id: string;
  label: string;
  weight: number;
  depth: number;
  colorIndex: number;
  polygon: Point[];
  centroid: Point;
  area: number;
  children: FoamTreeLayoutNode[];
  source: FoamTreeDatum;
};

export type LayoutOptions = {
  iterations: number;
  padding: number;
  hierarchyDepth: number;
  weightStrength: number;
  viewMode: "flattened" | "hierarchical";
};

export type FoamTreeInteractionEvent = {
  node?: FoamTreeLayoutNode;
  point?: Point;
  path: FoamTreeLayoutNode[];
};

export type FoamTreeExtensionHooks = {
  onNodeHover?: (event: FoamTreeInteractionEvent) => void;
  onNodeSelect?: (event: FoamTreeInteractionEvent) => void;
  onNodeHold?: (event: FoamTreeInteractionEvent) => void;
  onLayoutChange?: (nodes: FoamTreeLayoutNode[]) => void;
  onViewportChange?: (path: FoamTreeDatum[]) => void;
};
