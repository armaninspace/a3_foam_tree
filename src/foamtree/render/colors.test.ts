import { describe, expect, it } from "vitest";
import { getTheme, metricColor, mix, nodeColor, setCustomTheme, themeOptions } from "./colors";

describe("theme colors", () => {
  it("returns configured themes and cycles categorical colors", () => {
    expect(themeOptions().map((theme) => theme.id)).toContain("foamtree");
    expect(nodeColor(0, 0, "foamtree")).toBe("#5fa7dc");
    expect(nodeColor(8, 0, "foamtree")).toBe("#5fa7dc");
  });

  it("interpolates metric colors", () => {
    expect(mix("#000000", "#ffffff", 0.5)).toBe("rgb(128, 128, 128)");
    expect(metricColor(0, "d3Categorical")).toBe("rgb(247, 251, 255)");
    expect(metricColor(1, "d3Categorical")).toBe("rgb(8, 48, 107)");
  });

  it("validates and applies custom themes", () => {
    const theme = setCustomTheme(
      JSON.stringify({
        label: "Test Theme",
        categorical: ["#000000", "#ffffff"],
        metric: { low: "#000000", high: "#ffffff" }
      })
    );

    expect(theme.id).toBe("custom");
    expect(getTheme("custom").label).toBe("Test Theme");
    expect(() => setCustomTheme(JSON.stringify({ categorical: ["#000000"] }))).toThrow("categorical array");
  });
});
