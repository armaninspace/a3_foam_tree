import type { FoamTreeDatum } from "../foamtree/types";

export const d3TreemapData: FoamTreeDatum[] = [
  {
    id: "treemap-layout",
    label: "treemap()",
    weight: 36,
    metrics: metric(0.86, 0.82, 0.78, 0.9),
    url: "https://d3js.org/d3-hierarchy/treemap#treemap",
    children: [
      {
        id: "treemap-root",
        label: "treemap(root)",
        weight: 12,
        metrics: metric(0.84, 0.78, 0.74, 0.88),
        url: "https://d3js.org/d3-hierarchy/treemap#_treemap"
      },
      {
        id: "treemap-size",
        label: "size",
        weight: 7,
        metrics: metric(0.52, 0.61, 0.67, 0.72),
        url: "https://d3js.org/d3-hierarchy/treemap#treemap_size"
      },
      {
        id: "treemap-round",
        label: "round",
        weight: 4,
        metrics: metric(0.34, 0.4, 0.46, 0.5),
        url: "https://d3js.org/d3-hierarchy/treemap#treemap_round"
      },
      {
        id: "treemap-node-coordinates",
        label: "node x0 y0 x1 y1",
        weight: 13,
        metrics: metric(0.78, 0.76, 0.8, 0.84),
        children: [
          { id: "node-x0", label: "x0", weight: 3, metrics: metric(0.63, 0.7, 0.72, 0.76) },
          { id: "node-y0", label: "y0", weight: 3, metrics: metric(0.58, 0.66, 0.69, 0.72) },
          { id: "node-x1", label: "x1", weight: 3, metrics: metric(0.65, 0.72, 0.74, 0.78) },
          { id: "node-y1", label: "y1", weight: 3, metrics: metric(0.6, 0.68, 0.71, 0.75) }
        ]
      }
    ]
  },
  {
    id: "tiling-methods",
    label: "Tiling methods",
    weight: 34,
    metrics: metric(0.68, 0.74, 0.79, 0.83),
    url: "https://d3js.org/d3-hierarchy/treemap#treemap_tile",
    children: [
      {
        id: "tile-squarify",
        label: "squarify",
        weight: 11,
        metrics: metric(0.88, 0.9, 0.88, 0.92),
        url: "https://d3js.org/d3-hierarchy/treemap#treemapSquarify"
      },
      {
        id: "tile-resquarify",
        label: "resquarify",
        weight: 8,
        metrics: metric(0.8, 0.82, 0.86, 0.88),
        url: "https://d3js.org/d3-hierarchy/treemap#treemapResquarify"
      },
      {
        id: "tile-binary",
        label: "binary",
        weight: 6,
        metrics: metric(0.52, 0.6, 0.66, 0.7),
        url: "https://d3js.org/d3-hierarchy/treemap#treemapBinary"
      },
      {
        id: "tile-slice-dice",
        label: "slice / dice",
        weight: 9,
        metrics: metric(0.42, 0.51, 0.58, 0.62),
        children: [
          { id: "tile-slice", label: "slice", weight: 4, metrics: metric(0.4, 0.48, 0.55, 0.58) },
          { id: "tile-dice", label: "dice", weight: 4, metrics: metric(0.44, 0.52, 0.58, 0.62) },
          { id: "tile-slicedice", label: "sliceDice", weight: 3, metrics: metric(0.46, 0.54, 0.6, 0.64) }
        ]
      }
    ]
  },
  {
    id: "padding",
    label: "Padding",
    weight: 22,
    metrics: metric(0.44, 0.56, 0.62, 0.68),
    url: "https://d3js.org/d3-hierarchy/treemap#treemap_padding",
    children: [
      { id: "padding-inner", label: "inner", weight: 6, metrics: metric(0.5, 0.6, 0.66, 0.72) },
      { id: "padding-outer", label: "outer", weight: 5, metrics: metric(0.44, 0.52, 0.6, 0.66) },
      { id: "padding-top", label: "top", weight: 3, metrics: metric(0.36, 0.46, 0.52, 0.58) },
      { id: "padding-right", label: "right", weight: 3, metrics: metric(0.38, 0.48, 0.55, 0.6) },
      { id: "padding-bottom", label: "bottom", weight: 3, metrics: metric(0.4, 0.5, 0.56, 0.62) },
      { id: "padding-left", label: "left", weight: 3, metrics: metric(0.42, 0.51, 0.57, 0.63) }
    ]
  },
  {
    id: "hierarchy-input",
    label: "Hierarchy input",
    weight: 18,
    metrics: metric(0.72, 0.76, 0.82, 0.86),
    url: "https://d3js.org/d3-hierarchy/hierarchy",
    children: [
      { id: "root-sum", label: "root.sum", weight: 7, metrics: metric(0.76, 0.8, 0.84, 0.88) },
      { id: "root-sort", label: "root.sort", weight: 5, metrics: metric(0.68, 0.72, 0.78, 0.82) },
      { id: "children", label: "children", weight: 4, metrics: metric(0.58, 0.66, 0.72, 0.77) },
      { id: "node-value", label: "node.value", weight: 4, metrics: metric(0.64, 0.7, 0.76, 0.82) }
    ]
  },
  {
    id: "readability",
    label: "Readability",
    weight: 14,
    metrics: metric(0.55, 0.67, 0.74, 0.8),
    children: [
      { id: "golden-ratio", label: "golden ratio", weight: 6, metrics: metric(0.76, 0.8, 0.82, 0.86) },
      { id: "aspect-ratio", label: "aspect ratio", weight: 5, metrics: metric(0.58, 0.68, 0.74, 0.78) },
      { id: "stable-update", label: "stable update", weight: 4, metrics: metric(0.62, 0.7, 0.78, 0.84) }
    ]
  }
];

function metric(q1: number, q2: number, q3: number, q4: number): Record<string, number> {
  return {
    "Q1 adoption": q1,
    "Q2 adoption": q2,
    "Q3 adoption": q3,
    "Q4 adoption": q4
  };
}
