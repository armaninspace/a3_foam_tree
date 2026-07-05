# Developer Guide

## Architecture

The app is intentionally split into small pure modules:

- `src/data/*`: fixture data and CSV parsing.
- `src/foamtree/data/graphToHierarchy.ts`: graph adapter.
- `src/foamtree/layout/*`: geometry and weighted Voronoi layout.
- `src/foamtree/render/*`: Canvas drawing and theme handling.
- `src/foamtree/interaction/hitTest.ts`: pointer hit testing.
- `src/main.ts`: DOM, controls, URL state, and app lifecycle.

Prefer keeping new behavior in pure modules and wiring it from `main.ts`. That keeps tests fast and avoids browser setup where it is not needed.

## Layout Flow

1. App data is loaded as `FoamTreeDatum[]`.
2. `createFoamTreeLayout` converts bounds into a polygon container.
3. `layoutWeightedVoronoi` creates seeded sites, iteratively relaxes them, computes clipped cells, applies padding, and recurses into children.
4. `renderFoamTree` draws cells first and labels in a second pass.
5. `hitTest` flattens the layout from deepest/topmost order and returns the containing node.

## Data Contracts

`FoamTreeDatum`:

```ts
type FoamTreeDatum = {
  id: string;
  label: string;
  weight: number;
  url?: string;
  metrics?: Record<string, number | undefined>;
  children?: FoamTreeDatum[];
};
```

Weights should be positive. If raw values are highly skewed, transform them before assigning to `weight` and keep raw values in metrics or external metadata.

## Theme Contracts

Themes live in `src/foamtree/render/colors.ts`. A theme needs:

- `id`
- `label`
- `description`
- `categorical`
- `metric.low`
- `metric.high`
- canvas/background/label/border colors

Custom themes reuse the FoamTree theme defaults for omitted optional fields.

## Adding A Dataset

1. Add a parser or fixture under `src/data/`.
2. Return `FoamTreeDatum[]`.
3. Add the option in `src/main.ts`.
4. Update tests for parser behavior.
5. Document the dataset in `docs/DATA_AND_THEMES.md`.

## Adding An Extension

Render extensions implement `FoamTreeRenderExtension`:

```ts
type FoamTreeRenderExtension = {
  id: string;
  afterNode?: (context, node, state) => void;
};
```

Keep extensions visual-only. Selection, routing, and state transitions should stay in `main.ts` or a dedicated interaction module.

## Coding Standards

- Keep layout and parser code deterministic.
- Avoid DOM dependencies in core modules.
- Add tests for parser, layout, geometry, theme, and interaction behavior.
- Run `npm run check` before handing off changes.

