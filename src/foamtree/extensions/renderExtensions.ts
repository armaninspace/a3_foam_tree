import type { FoamTreeLayoutNode, Point } from "../types";
import type { FoamTreeRenderExtension } from "../render/CanvasFoamTree";

export const weightHeatExtension: FoamTreeRenderExtension = {
  id: "weight-heat",
  afterNode: (context, node) => {
    if (node.depth > 1 || node.weight < 7) return;
    drawPolygon(context, node.polygon);
    context.save();
    context.globalCompositeOperation = "multiply";
    context.fillStyle = `rgba(255, 120, 0, ${Math.min(0.22, node.weight / 140)})`;
    context.fill();
    context.restore();
  }
};

export const riskBadgeExtension: FoamTreeRenderExtension = {
  id: "risk-badges",
  afterNode: (context, node) => {
    if (!shouldBadge(node)) return;
    const radius = node.depth === 0 ? 12 : 9;
    const x = node.centroid.x + Math.min(34, Math.sqrt(node.area) * 0.18);
    const y = node.centroid.y - Math.min(28, Math.sqrt(node.area) * 0.14);

    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "#f07b42";
    context.stroke();
    context.fillStyle = "#d85f2a";
    context.font = `800 ${radius + 1}px Inter, ui-sans-serif, system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("!", x, y + 0.5);
    context.restore();
  }
};

function drawPolygon(context: CanvasRenderingContext2D, polygon: Point[]): void {
  if (polygon.length < 3) return;
  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for (let index = 1; index < polygon.length; index += 1) {
    context.lineTo(polygon[index].x, polygon[index].y);
  }
  context.closePath();
}

function shouldBadge(node: FoamTreeLayoutNode): boolean {
  return (
    node.id.includes("risk") ||
    node.id.includes("security") ||
    node.id.includes("compliance") ||
    node.id.includes("reliability") ||
    node.id.includes("pricing")
  );
}
