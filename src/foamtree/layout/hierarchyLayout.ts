import type { Bounds, FoamTreeDatum, FoamTreeLayoutNode, LayoutOptions } from "../types";
import { boundsToPolygon } from "./polygon";
import { layoutWeightedVoronoi } from "./weightedVoronoi";

const DEFAULT_OPTIONS: LayoutOptions = {
  iterations: 32,
  padding: 4,
  hierarchyDepth: 2,
  weightStrength: 1,
  viewMode: "flattened"
};

export function createFoamTreeLayout(
  data: FoamTreeDatum[],
  bounds: Bounds,
  options: Partial<LayoutOptions> = {}
): FoamTreeLayoutNode[] {
  return layoutWeightedVoronoi(data, boundsToPolygon(bounds), {
    ...DEFAULT_OPTIONS,
    ...options
  });
}
