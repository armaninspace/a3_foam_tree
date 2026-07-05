import { Delaunay } from "d3-delaunay";
import type { FoamTreeDatum, FoamTreeLayoutNode, LayoutOptions, Point } from "../types";
import {
  clipPolygonWithHalfPlane,
  insetPolygon,
  polygonArea,
  polygonCentroid
} from "./polygon";

type Site = {
  datum: FoamTreeDatum;
  x: number;
  y: number;
  power: number;
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function layoutWeightedVoronoi(
  data: FoamTreeDatum[],
  container: Point[],
  options: LayoutOptions,
  depth = 0
): FoamTreeLayoutNode[] {
  if (data.length === 0 || container.length < 3) return [];

  const containerArea = polygonArea(container);
  if (containerArea <= 1) return [];
  const bounds = polygonBounds(container);

  let sites = createInitialSites(data, container);
  let cells = computePowerCells(sites, container);

  for (let iteration = 0; iteration < options.iterations; iteration += 1) {
    const totalWeight = data.reduce((sum, item) => sum + Math.max(item.weight, 0.01), 0);
    const delaunay = Delaunay.from(
      sites,
      (site) => site.x,
      (site) => site.y
    );

    cells = computePowerCells(sites, container);

    sites = sites.map((site, index) => {
      const cell = cells[index] ?? [];
      const area = polygonArea(cell);
      const targetArea = containerArea * (Math.max(site.datum.weight, 0.01) / totalWeight);
      const centroid = cell.length >= 3 ? polygonCentroid(cell) : { x: site.x, y: site.y };
      const neighbors = Array.from(delaunay.neighbors(index));
      const neighborPull = averageNeighborPoint(sites, neighbors, site);
      const areaError = targetArea > 0 ? (targetArea - area) / targetArea : 0;

      const nextX = site.x + (centroid.x - site.x) * 0.55 + (neighborPull.x - site.x) * 0.03;
      const nextY = site.y + (centroid.y - site.y) * 0.55 + (neighborPull.y - site.y) * 0.03;

      return {
        ...site,
        x: clamp(nextX, bounds.minX, bounds.maxX),
        y: clamp(nextY, bounds.minY, bounds.maxY),
        power: Math.max(
          -containerArea,
          Math.min(containerArea, site.power + areaError * containerArea * 0.015 * options.weightStrength)
        )
      };
    });
  }

  cells = computePowerCells(sites, container);

  return sites.map((site, index) => {
    const rawPolygon = cells[index] ?? [];
    const polygon = insetPolygon(rawPolygon, options.padding);
    const area = polygonArea(polygon);
    const centroid = polygon.length >= 3 ? polygonCentroid(polygon) : { x: site.x, y: site.y };
    const children =
      site.datum.children && depth + 1 < options.hierarchyDepth
        ? layoutWeightedVoronoi(site.datum.children, polygon, options, depth + 1)
        : [];

    return {
      id: site.datum.id,
      label: site.datum.label,
      weight: site.datum.weight,
      depth,
      colorIndex: index,
      polygon,
      centroid,
      area,
      children,
      source: site.datum
    };
  });
}

function polygonBounds(points: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxX: Math.max(bounds.maxX, point.x),
      maxY: Math.max(bounds.maxY, point.y)
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    }
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createInitialSites(data: FoamTreeDatum[], container: Point[]): Site[] {
  const center = polygonCentroid(container);
  const area = polygonArea(container);
  const radius = Math.sqrt(area / Math.PI) * 0.5;

  return data.map((datum, index) => {
    const angle = index * GOLDEN_ANGLE;
    const distance = radius * Math.sqrt((index + 0.5) / data.length);

    return {
      datum,
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
      power: 0
    };
  });
}

function computePowerCells(sites: Site[], container: Point[]): Point[][] {
  return sites.map((site, index) => {
    let cell = container;
    for (let otherIndex = 0; otherIndex < sites.length; otherIndex += 1) {
      if (otherIndex === index) continue;
      const other = sites[otherIndex];
      const a = 2 * (other.x - site.x);
      const b = 2 * (other.y - site.y);
      const c =
        other.x * other.x +
        other.y * other.y -
        other.power -
        (site.x * site.x + site.y * site.y - site.power);

      cell = clipPolygonWithHalfPlane(cell, a, b, c);
      if (cell.length === 0) break;
    }
    return cell;
  });
}

function averageNeighborPoint(sites: Site[], neighborIndexes: number[], fallback: Site): Point {
  if (neighborIndexes.length === 0) return fallback;
  const sum = neighborIndexes.reduce(
    (acc, index) => ({
      x: acc.x + sites[index].x,
      y: acc.y + sites[index].y
    }),
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / neighborIndexes.length,
    y: sum.y / neighborIndexes.length
  };
}
