# User Guide

Modern FoamTree is an interactive hierarchical map. Each polygon is a cluster or leaf item. Larger weights get more visual space, while colors come from the selected theme or selected metric.

## Main Controls

Dataset:
Choose between the world population CSV, the D3-style sample, the local sample hierarchy, and the graph fixture.

View:
Use `Hierarchical` to show nested groups. Use `Flattened` to show the current level as a single flat set.

Quality:
Changes layout iterations, padding, depth, and weight force together.

Theme:
Select one of the built-in palettes. The swatches below the select preview the categorical colors.

Custom theme:
Open the JSON editor, change colors, and apply. Invalid JSON or incomplete theme definitions are rejected.

Metric Playback:
Step through metric columns or play them automatically. The `Theme colors` state uses categorical colors instead of metric colors.

## Interaction

Click:
Select a cell and update the readout.

Double-click:
Drill into a cell with children.

Escape:
Return to the root view.

Press and hold:
Invokes the node detail hook. Nodes with URLs update the URL hash.

Hover:
Shows tooltip details and updates the active readout.

## Reading The Map

Top-level white gutters separate major groups. Inner gutters separate children. Labels are shown when a cell has enough space; small cells use truncated labels.

The default world population dataset uses log-scaled display weights. This keeps countries with very large populations from swallowing the entire map while still preserving relative importance.

## Visual Examples

The repository intentionally keeps recorded demo videos out of source control. Lightweight SVG examples live in `docs/assets/` and are used by the README.
