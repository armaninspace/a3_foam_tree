export type ThemeDefinition = {
  id: string;
  label: string;
  description: string;
  categorical: string[];
  metric: {
    low: string;
    mid?: string;
    high: string;
  };
  background: string;
  labelColor: string;
  parentLabelColor: string;
  borderColor: string;
  selectedColor: string;
  highlightTop: string;
  shadowBottom: string;
};

const fractalBloom = [
  "#18a999",
  "#f7b801",
  "#f18701",
  "#f35b04",
  "#7678ed",
  "#3d348b",
  "#6dd3ce",
  "#b8de6f"
];

const d3Observable = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab"
];

const THEMES: Record<string, ThemeDefinition> = {
  foamtree: {
    id: "foamtree",
    label: "FoamTree Classic",
    description: "Bright, friendly FoamTree-like categorical colors with white gutters.",
    categorical: ["#5fa7dc", "#f18a45", "#77b94d", "#e5c241", "#8f71bf", "#4db6ad", "#d76d8c", "#93b34a"],
    metric: { low: "#fde233", high: "#1f6fb2" },
    background: "#ffffff",
    labelColor: "rgba(35, 35, 35, 0.86)",
    parentLabelColor: "rgba(60, 60, 60, 0.66)",
    borderColor: "rgba(255,255,255,0.84)",
    selectedColor: "#333333",
    highlightTop: "rgba(255, 255, 255, 0.28)",
    shadowBottom: "rgba(0, 0, 0, 0.07)"
  },
  fractalBloom: {
    id: "fractalBloom",
    label: "Fractal Bloom",
    description: "Saturated nested Voronoi colors inspired by generative fractal palettes.",
    categorical: fractalBloom,
    metric: { low: "#151515", mid: "#18a999", high: "#f7b801" },
    background: "#101114",
    labelColor: "rgba(255, 255, 255, 0.88)",
    parentLabelColor: "rgba(255, 255, 255, 0.58)",
    borderColor: "rgba(255,255,255,0.72)",
    selectedColor: "#ffffff",
    highlightTop: "rgba(255, 255, 255, 0.18)",
    shadowBottom: "rgba(0, 0, 0, 0.22)"
  },
  d3Categorical: {
    id: "d3Categorical",
    label: "D3 Categorical",
    description: "Observable/D3-style categorical palette for balanced hierarchy reading.",
    categorical: d3Observable,
    metric: { low: "#f7fbff", mid: "#6baed6", high: "#08306b" },
    background: "#ffffff",
    labelColor: "rgba(26, 32, 44, 0.86)",
    parentLabelColor: "rgba(26, 32, 44, 0.58)",
    borderColor: "rgba(255,255,255,0.88)",
    selectedColor: "#111827",
    highlightTop: "rgba(255, 255, 255, 0.24)",
    shadowBottom: "rgba(0, 0, 0, 0.06)"
  },
  sequentialLake: {
    id: "sequentialLake",
    label: "Sequential Lake",
    description: "Blue-green sequential range for metric-heavy treemaps.",
    categorical: ["#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
    metric: { low: "#edf8fb", mid: "#66c2a4", high: "#006d2c" },
    background: "#f7fbff",
    labelColor: "rgba(14, 43, 60, 0.86)",
    parentLabelColor: "rgba(14, 43, 60, 0.58)",
    borderColor: "rgba(255,255,255,0.86)",
    selectedColor: "#06364a",
    highlightTop: "rgba(255, 255, 255, 0.26)",
    shadowBottom: "rgba(0, 55, 80, 0.08)"
  },
  divergingSignal: {
    id: "divergingSignal",
    label: "Diverging Signal",
    description: "Cool-to-warm contrast for positive/negative or low/high analysis signals.",
    categorical: ["#4575b4", "#74add1", "#abd9e9", "#fee090", "#fdae61", "#f46d43", "#d73027", "#7f3b08"],
    metric: { low: "#313695", mid: "#ffffbf", high: "#a50026" },
    background: "#fffdf5",
    labelColor: "rgba(45, 32, 24, 0.86)",
    parentLabelColor: "rgba(45, 32, 24, 0.56)",
    borderColor: "rgba(255,255,255,0.9)",
    selectedColor: "#2d2018",
    highlightTop: "rgba(255, 255, 255, 0.24)",
    shadowBottom: "rgba(80, 28, 10, 0.09)"
  }
};

let customTheme: ThemeDefinition | undefined;

export function themeOptions(): ThemeDefinition[] {
  return [...Object.values(THEMES), ...(customTheme ? [customTheme] : [])];
}

export function getTheme(themeId = "foamtree"): ThemeDefinition {
  return customTheme?.id === themeId ? customTheme : THEMES[themeId] ?? THEMES.foamtree;
}

export function setCustomTheme(input: string): ThemeDefinition {
  const parsed = JSON.parse(input) as Partial<ThemeDefinition>;
  if (!Array.isArray(parsed.categorical) || parsed.categorical.length < 2) {
    throw new Error("Custom theme requires a categorical array with at least two colors.");
  }
  if (!parsed.metric?.low || !parsed.metric.high) {
    throw new Error("Custom theme requires metric.low and metric.high colors.");
  }
  customTheme = {
    ...THEMES.foamtree,
    ...parsed,
    id: "custom",
    label: parsed.label ?? "Custom",
    description: parsed.description ?? "User-defined theme",
    categorical: parsed.categorical,
    metric: parsed.metric
  };
  return customTheme;
}

export function customThemeTemplate(): string {
  return JSON.stringify(
    {
      label: "Custom",
      categorical: ["#0ea5e9", "#f97316", "#22c55e", "#eab308", "#a855f7", "#14b8a6"],
      metric: { low: "#f8fafc", mid: "#38bdf8", high: "#0f172a" },
      background: "#ffffff",
      labelColor: "rgba(15, 23, 42, 0.88)",
      parentLabelColor: "rgba(15, 23, 42, 0.58)",
      borderColor: "rgba(255,255,255,0.86)",
      selectedColor: "#0f172a"
    },
    null,
    2
  );
}

export function nodeColor(index: number, depth: number, themeId = "foamtree"): string {
  const theme = getTheme(themeId);
  const base = theme.categorical[index % theme.categorical.length];
  if (depth === 0) return base;
  return mix(base, theme.background, Math.min(0.12 * depth, 0.34));
}

export function metricColor(value: number, themeId = "foamtree"): string {
  const theme = getTheme(themeId);
  const bounded = Math.max(0, Math.min(1, value));
  if (theme.metric.mid) {
    return bounded < 0.5
      ? mix(theme.metric.low, theme.metric.mid, bounded * 2)
      : mix(theme.metric.mid, theme.metric.high, (bounded - 0.5) * 2);
  }
  return mix(theme.metric.low, theme.metric.high, bounded);
}

export function mix(hexA: string, hexB: string, amount: number): string {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  const channel = (from: number, to: number) => Math.round(from + (to - from) * amount);
  return `rgb(${channel(a.r, b.r)}, ${channel(a.g, b.g)}, ${channel(a.b, b.b)})`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return { r: 127, g: 127, b: 127 };
  }
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}
