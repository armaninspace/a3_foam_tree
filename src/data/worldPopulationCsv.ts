import type { FoamTreeDatum } from "../foamtree/types";

export const worldPopulationCsvUrl =
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/11_SevCatOneNumNestedOneObsPerGroup.csv";

type PopulationRow = {
  region: string;
  subregion: string;
  key: string;
  value: number;
};

export function parseWorldPopulationCsv(csv: string): FoamTreeDatum[] {
  const rows = parseRows(csv).filter((row) => row.value > 0 && row.region && row.subregion);
  const max = Math.max(...rows.map((row) => row.value));
  const subregions = new Map<string, PopulationRow[]>();

  for (const row of rows) {
    const key = `${row.region} / ${row.subregion}`;
    const countries = subregions.get(key) ?? [];
    countries.push(row);
    subregions.set(key, countries);
  }

  return [...subregions.entries()]
    .map(([subregionKey, countries]) => ({
      id: slug(subregionKey),
      label: subregionKey,
      weight: sumDisplayRows(countries),
      metrics: populationMetrics(sumRows(countries), max),
      children: countries
        .sort((a, b) => b.value - a.value)
        .map((country) => ({
          id: `${slug(subregionKey)}-${slug(country.key)}`,
          label: country.key,
          weight: displayWeight(country.value),
          metrics: populationMetrics(country.value, max),
          url: `https://www.data-to-viz.com/graph/treemap.html`
        }))
    }))
    .sort((a, b) => b.weight - a.weight);
}

function parseRows(csv: string): PopulationRow[] {
  const lines = csv.trim().split(/\r?\n/);
  return lines.slice(1).map((line) => {
    const [region, subregion, key, value] = line
      .split(";")
      .map((field) => field.replace(/^"|"$/g, ""));
    return {
      region,
      subregion,
      key,
      value: Number(value)
    };
  });
}

function sumRows(rows: PopulationRow[]): number {
  return rows.reduce((sum, row) => sum + row.value, 0);
}

function sumDisplayRows(rows: PopulationRow[]): number {
  return rows.reduce((sum, row) => sum + displayWeight(row.value), 0);
}

function displayWeight(value: number): number {
  return Math.max(1, Math.log10(value + 1));
}

function populationMetrics(value: number, max: number): Record<string, number> {
  const share = value / max;
  const logShare = Math.log10(value) / Math.log10(max);
  return {
    "Q1 adoption": share,
    "Q2 adoption": logShare,
    "Q3 adoption": Math.sqrt(share),
    "Q4 adoption": Math.min(1, logShare * 1.08)
  };
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
