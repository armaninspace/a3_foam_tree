import { describe, expect, it } from "vitest";
import { parseWorldPopulationCsv, worldPopulationCsvUrl } from "./worldPopulationCsv";

const csv = `"region";"subregion";"key";"value"
"Asia";"Eastern Asia";"China";"1400000000"
"Asia";"Eastern Asia";"Japan";"125000000"
"Europe";"Western Europe";"France";"67000000"
"Europe";"Western Europe";"Invalid zero";"0"
"Africa";"Northern Africa";"Invalid negative";"-12"
"";"Unknown";"Missing region";"10"`;

describe("parseWorldPopulationCsv", () => {
  it("groups valid rows by region and subregion", () => {
    const parsed = parseWorldPopulationCsv(csv);

    expect(parsed).toHaveLength(2);
    expect(parsed.map((item) => item.label)).toEqual(["Asia / Eastern Asia", "Europe / Western Europe"]);
    expect(parsed[0].children?.map((item) => item.label)).toEqual(["China", "Japan"]);
    expect(parsed[1].children?.map((item) => item.label)).toEqual(["France"]);
  });

  it("uses display weights while retaining population metrics", () => {
    const [asia] = parseWorldPopulationCsv(csv);
    const china = asia.children?.find((item) => item.label === "China");

    expect(asia.weight).toBeGreaterThan(1);
    expect(china?.weight).toBeCloseTo(Math.log10(1400000001), 5);
    expect(china?.metrics?.["Q1 adoption"]).toBe(1);
    expect(china?.metrics?.["Q4 adoption"]).toBe(1);
  });

  it("exposes the configured default CSV source", () => {
    expect(worldPopulationCsvUrl).toContain("11_SevCatOneNumNestedOneObsPerGroup.csv");
  });
});
