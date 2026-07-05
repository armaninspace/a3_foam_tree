# Testing Guide

The project uses Vitest for unit tests.

```bash
npm run test      # watch mode
npm run test:run  # CI-style one-shot run
npm run check     # tests plus production build
```

## Current Coverage Areas

- World population CSV parsing and filtering.
- Graph-to-hierarchy conversion, missing-node errors, and cycle detection.
- Polygon area, centroid, clipping, insetting, and point inclusion.
- Voronoi layout bounds and hierarchy-depth behavior.
- Hit testing for parent and child cells.
- Theme registry, interpolation, and custom theme validation.

## Test File Convention

Place tests next to the module they cover:

```text
src/foamtree/layout/polygon.ts
src/foamtree/layout/polygon.test.ts
```

## What To Test Next

- Browser-level smoke tests for app boot and canvas sizing.
- Screenshot regression tests for theme captures.
- URL state behavior for dataset, theme, metric, and drilldown path.
- Custom theme editor DOM interactions.

For browser tests, prefer Playwright and keep them separate from the fast Vitest suite.

