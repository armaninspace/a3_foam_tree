# Production Checklist

This project is now suitable for iterative development, but a hosted production release should still address the items below.

## Required Before Public Release

- Decide whether the app should fetch the CSV live or ship a cached local copy.
- Add a visible loading/error state for failed CSV fetches.
- Rename sample metric labels if the default product remains population-focused.
- Add Playwright smoke tests for app boot, canvas sizing, dataset switching, and theme switching.
- Add screenshot regression checks for the five built-in themes.
- Keep third-party reference implementations outside the product repository unless their licenses and distribution terms have been reviewed.
- Keep recorded demo videos as release artifacts rather than repository files unless there is a specific product reason to version them.

## Operational Readiness

- Run `npm run check` in CI.
- Pin Node.js version in CI and deployment.
- Serve the Vite build from immutable static hosting.
- Set cache headers for JS/CSS assets.
- Use a short cache or local mirror for the remote CSV if the example experience must be stable.

## Accessibility

- Add keyboard focus styles for canvas-adjacent controls.
- Add a table/list fallback for screen readers.
- Add reduced-motion handling if animated transitions are introduced.
- Improve color contrast for every custom theme field.

## Performance

- Add a budget for maximum visible leaf count.
- Consider caching layout results by dataset, view, bounds, and options.
- Consider moving heavy layout work to a Web Worker.
- Add benchmark data for large hierarchies.

## Security And Supply Chain

- Keep `npm audit` clean.
- Avoid evaluating custom theme input beyond JSON parsing.
- Treat remote datasets as untrusted input.
- Do not expose private reference assets or licensed material without review.
