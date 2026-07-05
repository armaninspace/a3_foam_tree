import type { FoamTreeLayoutNode, Point } from "../types";
import { getTheme, metricColor, nodeColor } from "./colors";

export type RenderState = {
  hoveredId?: string;
  selectedId?: string;
  extensions?: FoamTreeRenderExtension[];
  metricColumn?: string;
  colorProfile?: string;
};

export type FoamTreeRenderExtension = {
  id: string;
  afterNode?: (
    context: CanvasRenderingContext2D,
    node: FoamTreeLayoutNode,
    state: { isHovered: boolean; isSelected: boolean }
  ) => void;
};

export function renderFoamTree(
  context: CanvasRenderingContext2D,
  nodes: FoamTreeLayoutNode[],
  state: RenderState
): void {
  const canvas = context.canvas;
  const width = canvas.clientWidth || canvas.width;
  const height = canvas.clientHeight || canvas.height;
  const theme = getTheme(state.colorProfile);
  canvas.dataset.theme = theme.id;
  context.clearRect(0, 0, width, height);
  context.fillStyle = theme.background;
  context.fillRect(0, 0, width, height);

  const flattened = flattenNodes(nodes);
  for (const node of flattened) {
    drawNode(context, node, state);
  }
  for (const node of flattened) {
    drawLabel(context, node, state, state.hoveredId === node.id || state.selectedId === node.id);
  }
}

function drawNode(
  context: CanvasRenderingContext2D,
  node: FoamTreeLayoutNode,
  state: RenderState
): void {
  if (node.polygon.length < 3) return;
  const isHovered = state.hoveredId === node.id;
  const isSelected = state.selectedId === node.id;
  const theme = getTheme(state.colorProfile);

  drawPolygon(context, node.polygon);
  context.fillStyle = fillColor(node, state);
  context.globalAlpha = node.depth === 0 ? 0.98 : 0.9;
  context.fill();
  context.globalAlpha = 1;

  drawPolygon(context, node.polygon);
  context.save();
  context.clip();
  const bounds = polygonBounds(node.polygon);
  const highlight = context.createLinearGradient(0, bounds.y, 0, bounds.y + bounds.height);
  highlight.addColorStop(0, theme.highlightTop);
  highlight.addColorStop(0.45, "rgba(255, 255, 255, 0.04)");
  highlight.addColorStop(1, theme.shadowBottom);
  context.fillStyle = highlight;
  context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.restore();

  context.strokeStyle = isSelected
    ? theme.selectedColor
    : isHovered
      ? "#ffffff"
      : theme.borderColor;
  context.lineWidth = isSelected ? 4.5 : isHovered ? 3.5 : node.depth === 0 ? 3 : 1.8;
  context.stroke();

  for (const extension of state.extensions ?? []) {
    extension.afterNode?.(context, node, { isHovered, isSelected });
  }
}

function fillColor(node: FoamTreeLayoutNode, state: RenderState): string {
  const metric = state.metricColumn ? node.source.metrics?.[state.metricColumn] : undefined;
  if (typeof metric === "number") {
    return metricColor(metric, state.colorProfile);
  }
  return nodeColor(node.colorIndex, node.depth, state.colorProfile);
}

function drawPolygon(context: CanvasRenderingContext2D, polygon: Point[]): void {
  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for (let index = 1; index < polygon.length; index += 1) {
    context.lineTo(polygon[index].x, polygon[index].y);
  }
  context.closePath();
}

function drawLabel(
  context: CanvasRenderingContext2D,
  node: FoamTreeLayoutNode,
  state: RenderState,
  emphasized: boolean
): void {
  if (node.children.length > 0 && !emphasized) return;

  const minimumArea = emphasized ? 360 : node.depth === 0 ? 2400 : 520;
  if (node.area < minimumArea) return;

  const bounds = polygonBounds(node.polygon);
  if (bounds.width < 24 || bounds.height < 13) return;

  const fontSize = Math.max(7, Math.min(node.depth === 0 ? 17 : 13, Math.sqrt(node.area) / 8.8, bounds.height * 0.38));
  if (bounds.height < fontSize * 1.25) return;

  context.save();
  context.font = `${emphasized ? 700 : 600} ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const fill = fillColor(node, state);
  const lightLabel = contrastText(fill) === "light";
  context.fillStyle = lightLabel ? "rgba(255, 255, 255, 0.9)" : "rgba(27, 31, 35, 0.82)";
  context.strokeStyle = lightLabel ? "rgba(0, 0, 0, 0.32)" : "rgba(255, 255, 255, 0.72)";
  context.lineWidth = Math.max(2, fontSize * 0.24);

  const maxWidth = Math.min(
    bounds.width * 0.86,
    Math.sqrt(node.area) * (node.depth === 0 ? 1.42 : 1.62)
  );
  const label = fitText(context, node.label, maxWidth);
  if (label.length < 2) {
    context.restore();
    return;
  }
  context.strokeText(label, node.centroid.x, node.centroid.y, maxWidth);
  context.fillText(label, node.centroid.x, node.centroid.y, maxWidth);
  context.restore();
}

function fitText(context: CanvasRenderingContext2D, label: string, maxWidth: number): string {
  if (context.measureText(label).width <= maxWidth) return label;
  let clipped = label;
  while (clipped.length > 3 && context.measureText(`${clipped}...`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped.trim()}...`;
}

function contrastText(color: string): "dark" | "light" {
  const channels = parseColor(color);
  if (!channels) return "dark";
  const luminance = (0.2126 * channels.r + 0.7152 * channels.g + 0.0722 * channels.b) / 255;
  return luminance > 0.54 ? "dark" : "light";
}

function parseColor(color: string): { r: number; g: number; b: number } | undefined {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return {
      r: Number.parseInt(hex[1].slice(0, 2), 16),
      g: Number.parseInt(hex[1].slice(2, 4), 16),
      b: Number.parseInt(hex[1].slice(4, 6), 16)
    };
  }

  const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  if (!rgb) return undefined;
  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3])
  };
}

function flattenNodes(nodes: FoamTreeLayoutNode[]): FoamTreeLayoutNode[] {
  const flattened: FoamTreeLayoutNode[] = [];
  for (const node of nodes) {
    flattened.push(node);
    flattened.push(...flattenNodes(node.children));
  }
  return flattened;
}

function polygonBounds(polygon: Point[]): { x: number; y: number; width: number; height: number } {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const point of polygon) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
