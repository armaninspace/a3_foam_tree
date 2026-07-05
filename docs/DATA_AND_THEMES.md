# Data And Themes

## Default Data

The default dataset is fetched from:

`https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/11_SevCatOneNumNestedOneObsPerGroup.csv`

The CSV has semicolon-separated fields:

```text
region;subregion;key;value
```

The parser groups rows by `region / subregion` and uses country rows as children.

Rows are ignored when:

- `value <= 0`
- `region` is empty
- `subregion` is empty

## Weighting

Raw population values are too skewed for a readable FoamTree, so display weights use:

```ts
Math.max(1, Math.log10(value + 1))
```

Metrics keep normalized population signals:

- `Q1 adoption`: raw share of maximum population.
- `Q2 adoption`: log share.
- `Q3 adoption`: square-root share.
- `Q4 adoption`: boosted log share capped at 1.

The metric names are currently shared with the sample datasets. Rename them before a public release if this becomes a population-specific product.

## Built-In Themes

FoamTree Classic:
Bright, FoamTree-like categorical colors with white gutters.

Fractal Bloom:
Saturated nested Voronoi colors inspired by generative fractal palettes.

D3 Categorical:
Observable/D3-style categorical palette.

Sequential Lake:
Blue-green range for metric-heavy maps.

Diverging Signal:
Cool-to-warm contrast for low/high signals.

## Custom Themes

The custom theme editor accepts JSON. Minimum shape:

```json
{
  "label": "Custom",
  "categorical": ["#0ea5e9", "#f97316", "#22c55e"],
  "metric": {
    "low": "#f8fafc",
    "high": "#0f172a"
  }
}
```

Optional fields include:

- `description`
- `background`
- `labelColor`
- `parentLabelColor`
- `borderColor`
- `selectedColor`
- `highlightTop`
- `shadowBottom`

## Screenshot Capture

The current theme screenshots use:

```text
?dataset=world&view=hierarchical&metric=none
```

Using `metric=none` shows categorical palette differences. Metric screenshots should be captured separately when validating metric gradients.

