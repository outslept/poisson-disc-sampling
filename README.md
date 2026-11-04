# poisson-disc.

> Based on **Robert Bridson's** *Fast Poisson Disk Sampling in Arbitrary Dimensions* 

Interactive 2D Poisson disc sampling visualizer in vanilla JS and Canvas.

## Controls & Metrics

- **`r` (4–32)** — minimum distance between points.
- **`spd` (1–60)** — candidate steps per frame.
- **`pts`** — generated points vs. theoretical hexagonal packing limit.
- **`min`** — live nearest-neighbor distance check (flags red if $< r$).
- **Shortcuts** — `Space` to pause/resume, `R` to restart with a new seed.
