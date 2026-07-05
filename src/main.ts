import { graphFixture, metricColumns } from "./data/graphFixture";
import { d3TreemapData } from "./data/d3TreemapData";
import { sampleData } from "./data/samples";
import { parseWorldPopulationCsv, worldPopulationCsvUrl } from "./data/worldPopulationCsv";
import { graphToHierarchy } from "./foamtree/data/graphToHierarchy";
import { riskBadgeExtension, weightHeatExtension } from "./foamtree/extensions/renderExtensions";
import { hitTest } from "./foamtree/interaction/hitTest";
import { createFoamTreeLayout } from "./foamtree/layout/hierarchyLayout";
import { renderFoamTree } from "./foamtree/render/CanvasFoamTree";
import type { FoamTreeRenderExtension } from "./foamtree/render/CanvasFoamTree";
import { customThemeTemplate, setCustomTheme, themeOptions } from "./foamtree/render/colors";
import type {
  FoamTreeDatum,
  FoamTreeExtensionHooks,
  FoamTreeLayoutNode,
  LayoutOptions,
  Point
} from "./foamtree/types";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

app.innerHTML = `
  <main class="workspace">
    <div id="loading" class="loading" hidden><div></div><span>Loading clusters</span></div>
    <aside class="panel">
      <div class="brand" aria-label="FoamTree Lab">
        <div class="mark" aria-hidden="true"></div>
        <div>
          <h1>FoamTree Lab</h1>
          <p>Hierarchical cluster browser</p>
        </div>
      </div>

      <div class="stats">
        <div>
          <strong id="groupCount">0</strong>
          <span>clusters</span>
        </div>
        <div>
          <strong id="leafCount">0</strong>
          <span>signals</span>
        </div>
        <div>
          <strong id="weightTotal">0</strong>
          <span>weight</span>
        </div>
      </div>

      <div class="controlGroup">
        <h2>Layout</h2>

        <label>
          <span><span>Dataset</span></span>
          <select id="datasetSource">
            <option value="world">World population CSV</option>
            <option value="d3">D3 treemap docs</option>
            <option value="sample">Sample hierarchy</option>
            <option value="graph">Graph import</option>
          </select>
        </label>

        <label>
          <span><span>View</span></span>
          <select id="viewMode">
            <option value="flattened">Flattened</option>
            <option value="hierarchical" selected>Hierarchical</option>
          </select>
        </label>

        <label>
          <span><span>Quality</span></span>
          <select id="qualityPreset">
            <option value="balanced">Balanced</option>
            <option value="large">Large data</option>
            <option value="presentation">Presentation</option>
          </select>
        </label>

        <label>
          <span><span>Theme</span></span>
          <select id="colorProfile">
          </select>
        </label>

        <div class="themePreview" id="themePreview"></div>

        <details class="customTheme">
          <summary>Custom theme</summary>
          <textarea id="customThemeInput" spellcheck="false"></textarea>
          <div>
            <button id="applyCustomTheme" type="button">Apply</button>
            <button id="resetCustomTheme" type="button">Reset</button>
          </div>
          <small id="customThemeStatus">Edit JSON and apply.</small>
        </details>

      <label>
          <span><span>Iterations</span><output id="iterationsValue">32</output></span>
        <input id="iterations" type="range" min="4" max="80" value="32" />
      </label>

      <label>
          <span><span>Padding</span><output id="paddingValue">4</output></span>
        <input id="padding" type="range" min="0" max="12" value="4" />
      </label>

      <label>
          <span><span>Weight force</span><output id="weightStrengthValue">1.0</output></span>
        <input id="weightStrength" type="range" min="0" max="3" step="0.1" value="1" />
      </label>

      <label>
          <span><span>Depth</span><output id="hierarchyDepthValue">2</output></span>
        <input id="hierarchyDepth" type="range" min="1" max="3" value="2" />
      </label>
      </div>

      <div class="readout">
        <span id="activeLabel">No cluster selected</span>
        <strong id="activeWeight"></strong>
        <small id="activePath">Move over a cell to inspect it.</small>
      </div>

      <div class="eventPanel">
        <h2>Events</h2>
        <ol id="eventLog"></ol>
      </div>

      <div class="extensionPanel">
        <h2>Extensions</h2>
        <label>
          <input id="heatExtension" type="checkbox" checked />
          <span>Weight heat overlay</span>
        </label>
        <label>
          <input id="badgeExtension" type="checkbox" checked />
          <span>Risk badges</span>
        </label>
      </div>

      <div class="playbackPanel">
        <h2>Metric Playback</h2>
        <div class="playbackButtons">
          <button id="prevMetric" type="button">«</button>
          <button id="playMetric" type="button">▶</button>
          <button id="nextMetric" type="button">»</button>
        </div>
        <output id="metricName">Theme colors</output>
      </div>
    </aside>

    <section class="stage">
      <header class="stageHeader">
        <div>
          <p>Weighted Voronoi treemap</p>
          <h2>World Population FoamTree</h2>
        </div>
        <nav id="breadcrumbs" class="breadcrumbs" aria-label="Cluster path"></nav>
        <div class="legend">
          <span><i class="legendMarket"></i> Africa</span>
          <span><i class="legendProduct"></i> Asia</span>
          <span><i class="legendPlatform"></i> Europe</span>
        </div>
        <button id="helpButton" class="helpButton" type="button">?</button>
      </header>
      <canvas id="foamtree"></canvas>
      <div id="tooltip" class="tooltip" hidden></div>
      <dialog id="interactionGuide" class="interactionGuide">
        <form method="dialog">
          <button aria-label="Close">×</button>
        </form>
        <h2>Interaction Guide</h2>
        <dl>
          <dt>Click</dt><dd>Select a cluster</dd>
          <dt>Double-click</dt><dd>Drill into a cluster with children</dd>
          <dt>Escape</dt><dd>Return to all clusters</dd>
          <dt>Press and hold</dt><dd>Open the node detail hook</dd>
          <dt>Playback</dt><dd>Step through metric columns and recolor the tree</dd>
        </dl>
      </dialog>
    </section>
  </main>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#foamtree");
const activeLabel = document.querySelector<HTMLSpanElement>("#activeLabel");
const activeWeight = document.querySelector<HTMLElement>("#activeWeight");
const activePath = document.querySelector<HTMLElement>("#activePath");
const groupCount = document.querySelector<HTMLElement>("#groupCount");
const leafCount = document.querySelector<HTMLElement>("#leafCount");
const weightTotal = document.querySelector<HTMLElement>("#weightTotal");
const eventLog = document.querySelector<HTMLOListElement>("#eventLog");
const tooltip = document.querySelector<HTMLDivElement>("#tooltip");
const breadcrumbs = document.querySelector<HTMLElement>("#breadcrumbs");
const loading = document.querySelector<HTMLElement>("#loading");
const interactionGuide = document.querySelector<HTMLDialogElement>("#interactionGuide");
const helpButton = document.querySelector<HTMLButtonElement>("#helpButton");
const metricName = document.querySelector<HTMLOutputElement>("#metricName");
const datasetSource = document.querySelector<HTMLSelectElement>("#datasetSource");
const viewMode = document.querySelector<HTMLSelectElement>("#viewMode");
const qualityPreset = document.querySelector<HTMLSelectElement>("#qualityPreset");
const colorProfile = document.querySelector<HTMLSelectElement>("#colorProfile");
const themePreview = document.querySelector<HTMLDivElement>("#themePreview");
const customThemeInput = document.querySelector<HTMLTextAreaElement>("#customThemeInput");
const applyCustomTheme = document.querySelector<HTMLButtonElement>("#applyCustomTheme");
const resetCustomTheme = document.querySelector<HTMLButtonElement>("#resetCustomTheme");
const customThemeStatus = document.querySelector<HTMLElement>("#customThemeStatus");
const prevMetric = document.querySelector<HTMLButtonElement>("#prevMetric");
const playMetric = document.querySelector<HTMLButtonElement>("#playMetric");
const nextMetric = document.querySelector<HTMLButtonElement>("#nextMetric");
const extensionControls = {
  heat: document.querySelector<HTMLInputElement>("#heatExtension"),
  badges: document.querySelector<HTMLInputElement>("#badgeExtension")
};
const controls = {
  iterations: document.querySelector<HTMLInputElement>("#iterations"),
  padding: document.querySelector<HTMLInputElement>("#padding"),
  weightStrength: document.querySelector<HTMLInputElement>("#weightStrength"),
  hierarchyDepth: document.querySelector<HTMLInputElement>("#hierarchyDepth")
};
const controlValues = {
  iterations: document.querySelector<HTMLOutputElement>("#iterationsValue"),
  padding: document.querySelector<HTMLOutputElement>("#paddingValue"),
  weightStrength: document.querySelector<HTMLOutputElement>("#weightStrengthValue"),
  hierarchyDepth: document.querySelector<HTMLOutputElement>("#hierarchyDepthValue")
};

if (
  !canvas ||
  !activeLabel ||
  !activeWeight ||
  !activePath ||
  !groupCount ||
  !leafCount ||
  !weightTotal ||
  !eventLog ||
  !tooltip ||
  !breadcrumbs ||
  !loading ||
  !interactionGuide ||
  !helpButton ||
  !metricName ||
  !datasetSource ||
  !viewMode ||
  !qualityPreset ||
  !colorProfile ||
  !themePreview ||
  !customThemeInput ||
  !applyCustomTheme ||
  !resetCustomTheme ||
  !customThemeStatus ||
  !prevMetric ||
  !playMetric ||
  !nextMetric ||
  Object.values(extensionControls).some((control) => !control) ||
  Object.values(controls).some((control) => !control) ||
  Object.values(controlValues).some((value) => !value)
) {
  throw new Error("FoamTree controls were not found.");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Canvas 2D context is not available.");
}

const foamTreeCanvas = canvas;
const foamTreeContext = context;
const readoutLabel = activeLabel;
const readoutWeight = activeWeight;
const readoutPath = activePath;
const interactionLog = eventLog;
const hoverTooltip = tooltip;
const viewportBreadcrumbs = breadcrumbs;
const loadingOverlay = loading;
const metricOutput = metricName;
const datasetSelect = datasetSource;
const viewModeSelect = viewMode;
const qualityPresetSelect = qualityPreset;
const colorProfileSelect = colorProfile;
const themePreviewElement = themePreview;
const customThemeEditor = customThemeInput;
const applyCustomThemeButton = applyCustomTheme;
const resetCustomThemeButton = resetCustomTheme;
const customThemeStatusText = customThemeStatus;
const playMetricButton = playMetric;
const groupCountValue = groupCount;
const leafCountValue = leafCount;
const weightTotalValue = weightTotal;

let layout: FoamTreeLayoutNode[] = [];
let hoveredId: string | undefined;
let selectedId: string | undefined;
let lastPointer: Point | undefined;
let viewportPath: FoamTreeDatum[] = [];
let dataset: FoamTreeDatum[] = [];
let metricIndex = -1;
let playbackId: number | undefined;
let holdTimer: number | undefined;

const hooks: FoamTreeExtensionHooks = {
  onNodeHover: ({ node, point, path }) => {
    setActiveNode(node);
    updateTooltip(node, point, path);
    if (node) addEvent(`hover ${node.label}`);
  },
  onNodeSelect: ({ node, path }) => {
    setActiveNode(node);
    addEvent(node ? `select ${path.map((item) => item.label).join(" / ")}` : "clear selection");
  },
  onNodeHold: ({ node }) => {
    if (!node) return;
    addEvent(`hold ${node.label}${node.source.url ? " -> detail" : ""}`);
    if (node.source.url) window.location.hash = node.source.url;
  },
  onLayoutChange: (nodes) => {
    addEvent(`layout ${flattenNodes(nodes).length} visible cells`);
  },
  onViewportChange: (path) => {
    const label = path.length === 0 ? "root" : path.map((item) => item.label).join(" / ");
    addEvent(`viewport ${label}`);
    renderBreadcrumbs();
  }
};

function currentOptions(): LayoutOptions {
  const view = viewModeSelect.value === "hierarchical" ? "hierarchical" : "flattened";
  return {
    iterations: Number(controls.iterations!.value),
    padding: Number(controls.padding!.value),
    weightStrength: Number(controls.weightStrength!.value),
    hierarchyDepth: view === "hierarchical" ? Number(controls.hierarchyDepth!.value) : 1,
    viewMode: view
  };
}

function resizeCanvas(): void {
  const rect = foamTreeCanvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  foamTreeCanvas.width = Math.max(1, Math.floor(rect.width * scale));
  foamTreeCanvas.height = Math.max(1, Math.floor(rect.height * scale));
  foamTreeContext.setTransform(scale, 0, 0, scale, 0, 0);
  relayout();
}

function relayout(): void {
  const rect = foamTreeCanvas.getBoundingClientRect();
  syncControlValues();
  const data = currentData();
  layout = createFoamTreeLayout(
    data,
    {
      x: 24,
      y: 24,
      width: Math.max(1, rect.width - 48),
      height: Math.max(1, rect.height - 48)
    },
    currentOptions()
  );
  hooks.onLayoutChange?.(layout);
  render();
  writeUrlState();
}

function render(): void {
  updateThemePreview();
  renderFoamTree(foamTreeContext, layout, {
    hoveredId,
    selectedId,
    extensions: activeExtensions(),
    metricColumn: currentMetricColumn(),
    colorProfile: colorProfileSelect.value
  });
}

function populateThemes(): void {
  colorProfileSelect.innerHTML = "";
  for (const theme of themeOptions()) {
    const option = document.createElement("option");
    option.value = theme.id;
    option.textContent = theme.label;
    option.title = theme.description;
    colorProfileSelect.append(option);
  }
}

function updateThemePreview(): void {
  const selected = themeOptions().find((theme) => theme.id === colorProfileSelect.value) ?? themeOptions()[0];
  themePreviewElement.innerHTML = "";
  for (const color of selected.categorical.slice(0, 10)) {
    const swatch = document.createElement("i");
    swatch.style.background = color;
    themePreviewElement.append(swatch);
  }
}

function applyCustomThemeFromEditor(): void {
  try {
    const theme = setCustomTheme(customThemeEditor.value);
    populateThemes();
    colorProfileSelect.value = theme.id;
    customThemeStatusText.textContent = "Custom theme applied.";
    render();
  } catch (error) {
    customThemeStatusText.textContent = error instanceof Error ? error.message : "Invalid custom theme.";
  }
}

function canvasPoint(event: MouseEvent): { x: number; y: number } {
  const rect = foamTreeCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function setActiveNode(node: FoamTreeLayoutNode | undefined): void {
  readoutLabel.textContent = node ? node.label : "No cluster selected";
  readoutWeight.textContent = node ? `weight ${node.weight}` : "";
  readoutPath.textContent = node
    ? findNodePath(layout, node.id)
        .map((item) => item.label)
        .join(" / ")
    : "Move over a cell to inspect it.";
}

foamTreeCanvas.addEventListener("mousemove", (event) => {
  const point = canvasPoint(event);
  lastPointer = point;
  const node = hitTest(layout, point);
  const nextHoveredId = node?.id;
  if (nextHoveredId !== hoveredId) {
    hoveredId = nextHoveredId;
    foamTreeCanvas.style.cursor = node ? "pointer" : "default";
    hooks.onNodeHover?.({ node, point, path: node ? findNodePath(layout, node.id) : [] });
    render();
  } else if (node) {
    updateTooltip(node, point, findNodePath(layout, node.id));
  }
});

foamTreeCanvas.addEventListener("mouseleave", () => {
  hoveredId = undefined;
  foamTreeCanvas.style.cursor = "default";
  setActiveNode(selectedId ? findNode(layout, selectedId) : undefined);
  hoverTooltip.hidden = true;
  render();
});

foamTreeCanvas.addEventListener("click", (event) => {
  const node = hitTest(layout, canvasPoint(event));
  selectedId = node?.id;
  hooks.onNodeSelect?.({ node, point: lastPointer, path: node ? findNodePath(layout, node.id) : [] });
  render();
});

foamTreeCanvas.addEventListener("dblclick", (event) => {
  const node = hitTest(layout, canvasPoint(event));
  if (!node?.source.children?.length) return;
  viewportPath = [...viewportPath, node.source];
  hoveredId = undefined;
  selectedId = undefined;
  hoverTooltip.hidden = true;
  hooks.onViewportChange?.(viewportPath);
  relayout();
});

foamTreeCanvas.addEventListener("mousedown", (event) => {
  const point = canvasPoint(event);
  const node = hitTest(layout, point);
  window.clearTimeout(holdTimer);
  holdTimer = window.setTimeout(() => {
    hooks.onNodeHold?.({ node, point, path: node ? findNodePath(layout, node.id) : [] });
  }, 650);
});

window.addEventListener("mouseup", () => window.clearTimeout(holdTimer));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewportPath.length > 0) {
    viewportPath = [];
    selectedId = undefined;
    hoveredId = undefined;
    hoverTooltip.hidden = true;
    hooks.onViewportChange?.(viewportPath);
    relayout();
  }
});

for (const control of Object.values(controls)) {
  control!.addEventListener("input", relayout);
}

datasetSelect.addEventListener("change", () => loadDataset(datasetSelect.value));
viewModeSelect.addEventListener("change", () => {
  viewportPath = [];
  renderBreadcrumbs();
  relayout();
});
qualityPresetSelect.addEventListener("change", applyQualityPreset);
colorProfileSelect.addEventListener("change", render);
applyCustomThemeButton.addEventListener("click", applyCustomThemeFromEditor);
resetCustomThemeButton.addEventListener("click", () => {
  customThemeEditor.value = customThemeTemplate();
  customThemeStatusText.textContent = "Template restored.";
});
helpButton.addEventListener("click", () => interactionGuide.showModal());
prevMetric.addEventListener("click", () => stepMetric(-1));
nextMetric.addEventListener("click", () => stepMetric(1));
playMetric.addEventListener("click", togglePlayback);

for (const control of Object.values(extensionControls)) {
  control!.addEventListener("change", () => {
    addEvent(`extensions ${activeExtensions().map((extension) => extension.id).join(", ") || "none"}`);
    render();
  });
}

function syncControlValues(): void {
  controlValues.iterations!.value = controls.iterations!.value;
  controlValues.padding!.value = controls.padding!.value;
  controlValues.weightStrength!.value = Number(controls.weightStrength!.value).toFixed(1);
  controlValues.hierarchyDepth!.value = controls.hierarchyDepth!.value;
}

function currentData(): FoamTreeDatum[] {
  const root = viewportPath.at(-1);
  return root?.children ?? dataset;
}

function activeExtensions(): FoamTreeRenderExtension[] {
  return [
    extensionControls.heat!.checked ? weightHeatExtension : undefined,
    extensionControls.badges!.checked ? riskBadgeExtension : undefined
  ].filter((extension): extension is FoamTreeRenderExtension => extension !== undefined);
}

function currentMetricColumn(): string | undefined {
  return metricIndex >= 0 ? metricColumns[metricIndex] : undefined;
}

function syncMetricOutput(): void {
  metricOutput.value = currentMetricColumn() ?? "Theme colors";
}

function stepMetric(delta: number): void {
  metricIndex = (metricIndex + delta + metricColumns.length + 1) % (metricColumns.length + 1);
  if (metricIndex === metricColumns.length) metricIndex = -1;
  syncMetricOutput();
  addEvent(`metric ${metricOutput.value}`);
  render();
}

function togglePlayback(): void {
  if (playbackId) {
    window.clearInterval(playbackId);
    playbackId = undefined;
    playMetricButton.textContent = "▶";
    return;
  }
  playMetricButton.textContent = "Ⅱ";
  playbackId = window.setInterval(() => stepMetric(1), 1600);
}

function applyQualityPreset(): void {
  const preset = qualityPresetSelect.value;
  const settings =
    preset === "large"
      ? { iterations: 18, padding: 2, depth: 2, force: 0.8 }
      : preset === "presentation"
        ? { iterations: 60, padding: 6, depth: 3, force: 1.4 }
        : { iterations: 32, padding: 4, depth: 2, force: 1 };
  controls.iterations!.value = settings.iterations.toString();
  controls.padding!.value = settings.padding.toString();
  controls.hierarchyDepth!.value = settings.depth.toString();
  controls.weightStrength!.value = settings.force.toString();
  relayout();
}

async function loadDataset(source: string): Promise<void> {
  loadingOverlay.hidden = false;
  addEvent(`load ${source}`);
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  dataset =
    source === "world"
      ? await loadWorldPopulationData()
      : source === "graph"
        ? graphToHierarchy(graphFixture)
        : source === "sample"
          ? sampleData
          : d3TreemapData;
  viewportPath = [];
  selectedId = undefined;
  hoveredId = undefined;
  renderBreadcrumbs();
  updateStats(dataset);
  loadingOverlay.hidden = true;
  relayout();
}

async function loadWorldPopulationData(): Promise<FoamTreeDatum[]> {
  const response = await fetch(worldPopulationCsvUrl);
  if (!response.ok) {
    throw new Error(`Unable to load world population CSV: ${response.status}`);
  }
  return parseWorldPopulationCsv(await response.text());
}

function writeUrlState(): void {
  const params = new URLSearchParams();
  params.set("dataset", datasetSelect.value);
  params.set("view", viewModeSelect.value);
  params.set("metric", currentMetricColumn() ?? "none");
  params.set("theme", colorProfileSelect.value);
  if (viewportPath.length > 0) params.set("path", viewportPath.map((item) => item.id).join("/"));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
}

function renderBreadcrumbs(): void {
  viewportBreadcrumbs.innerHTML = "";
  const rootButton = document.createElement("button");
  rootButton.type = "button";
  rootButton.textContent = "All clusters";
  rootButton.addEventListener("click", () => {
    viewportPath = [];
    selectedId = undefined;
    hoveredId = undefined;
    hooks.onViewportChange?.(viewportPath);
    relayout();
  });
  viewportBreadcrumbs.append(rootButton);

  viewportPath.forEach((item, index) => {
    const separator = document.createElement("span");
    separator.textContent = "/";
    viewportBreadcrumbs.append(separator);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    button.addEventListener("click", () => {
      viewportPath = viewportPath.slice(0, index + 1);
      selectedId = undefined;
      hoveredId = undefined;
      hooks.onViewportChange?.(viewportPath);
      relayout();
    });
    viewportBreadcrumbs.append(button);
  });
}

function findNode(nodes: FoamTreeLayoutNode[], id: string): FoamTreeLayoutNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findNode(node.children, id);
    if (child) return child;
  }
  return undefined;
}

function findNodePath(
  nodes: FoamTreeLayoutNode[],
  id: string,
  path: FoamTreeLayoutNode[] = []
): FoamTreeLayoutNode[] {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === id) return nextPath;
    const childPath = findNodePath(node.children, id, nextPath);
    if (childPath.length > 0) return childPath;
  }
  return [];
}

function updateTooltip(
  node: FoamTreeLayoutNode | undefined,
  point: Point | undefined,
  path: FoamTreeLayoutNode[]
): void {
  if (!node || !point) {
    hoverTooltip.hidden = true;
    return;
  }

  hoverTooltip.hidden = false;
  const canvasRect = foamTreeCanvas.getBoundingClientRect();
  const parentRect = foamTreeCanvas.parentElement?.getBoundingClientRect();
  const offsetX = parentRect ? canvasRect.left - parentRect.left : 0;
  const offsetY = parentRect ? canvasRect.top - parentRect.top : 0;
  hoverTooltip.style.left = `${offsetX + point.x + 14}px`;
  hoverTooltip.style.top = `${offsetY + point.y + 14}px`;
  hoverTooltip.innerHTML = `
    <strong>${node.label}</strong>
    <span>${path.map((item) => item.label).join(" / ")}</span>
    <em>weight ${node.weight} · ${Math.round(node.area).toLocaleString()} px²</em>
  `;
}

function addEvent(message: string): void {
  const item = document.createElement("li");
  item.textContent = message;
  interactionLog.prepend(item);
  while (interactionLog.children.length > 5) {
    interactionLog.lastElementChild?.remove();
  }
}

function flattenNodes(nodes: FoamTreeLayoutNode[]): FoamTreeLayoutNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);
}

function countNodes(nodes: FoamTreeDatum[]): { groups: number; leaves: number; weight: number } {
  return nodes.reduce(
    (acc, node) => {
      const childStats = countNodes(node.children ?? []);
      return {
        groups: acc.groups + 1 + childStats.groups,
        leaves: acc.leaves + (node.children?.length ? childStats.leaves : 1),
        weight: acc.weight + node.weight + childStats.weight
      };
    },
    { groups: 0, leaves: 0, weight: 0 }
  );
}

function applyInitialUrlState(): void {
  const params = new URLSearchParams(location.search);
  const datasetParam = params.get("dataset");
  const viewParam = params.get("view");
  const metricParam = params.get("metric");
  const themeParam = params.get("theme");

  if (datasetParam === "graph") {
    datasetSelect.value = "graph";
    dataset = graphToHierarchy(graphFixture);
  } else if (datasetParam === "sample") {
    datasetSelect.value = "sample";
    dataset = sampleData;
  } else if (datasetParam === "d3") {
    datasetSelect.value = "d3";
    dataset = d3TreemapData;
  } else {
    datasetSelect.value = "world";
  }
  if (viewParam === "hierarchical" || viewParam === "flattened") {
    viewModeSelect.value = viewParam;
  }
  if (metricParam === "none") {
    metricIndex = -1;
    syncMetricOutput();
  } else if (metricParam && metricColumns.includes(metricParam)) {
    metricIndex = metricColumns.indexOf(metricParam);
    syncMetricOutput();
  }
  if (themeParam && themeOptions().some((theme) => theme.id === themeParam)) {
    colorProfileSelect.value = themeParam;
  }

  const pathIds = params.get("path")?.split("/").filter(Boolean) ?? [];
  viewportPath = resolveDatumPath(dataset, pathIds);
}

function resolveDatumPath(nodes: FoamTreeDatum[], ids: string[]): FoamTreeDatum[] {
  const resolved: FoamTreeDatum[] = [];
  let level = nodes;
  for (const id of ids) {
    const node = level.find((item) => item.id === id);
    if (!node) break;
    resolved.push(node);
    level = node.children ?? [];
  }
  return resolved;
}

populateThemes();
customThemeEditor.value = customThemeTemplate();
applyInitialUrlState();
updateStats(dataset);
renderBreadcrumbs();

function updateStats(nodes: FoamTreeDatum[]): void {
  const stats = countNodes(nodes);
  groupCountValue.textContent = stats.groups.toString();
  leafCountValue.textContent = stats.leaves.toString();
  weightTotalValue.textContent = stats.weight.toString();
}

window.addEventListener("resize", resizeCanvas);
initializeApp();

async function initializeApp(): Promise<void> {
  if (datasetSelect.value === "world") {
    await loadDataset("world");
  }
  resizeCanvas();
}
