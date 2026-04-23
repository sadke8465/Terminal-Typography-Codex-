# Terminal Typography Codex

Terminal Typography Codex is a local-first authoring project for designing terminal text animations and exporting them as lightweight JSON for downstream renderers (for example Go or Rust terminal runtimes).

## What this project includes

This repository contains the **core animation and authoring logic**:

- A modular animation engine with double-buffer frame rendering.
- A shape-mapping pipeline that converts text + bitmap font data into grid coordinates.
- Built-in animation presets (`sheen`, `wave`, `swipe`).
- A state schema/store and JSON export pipeline.
- Storm UI module files for a split layout (preview stage + control panel).

## Repository structure

```text
src/
├── main.storm
├── app.ts
├── core/
│   ├── engine.ts
│   ├── grid_mapper.ts
│   └── math_utils.ts
├── assets/
│   ├── fonts.json
│   └── glyph_palettes.json
├── animations/
│   ├── sheen.ts
│   ├── wave.ts
│   └── swipe.ts
├── state/
│   ├── schema.ts
│   ├── store.ts
│   └── exporter.ts
└── ui/
    ├── canvas/
    │   └── Stage.storm
    └── controls/
        ├── ControlPanel.storm
        ├── PresetSelector.storm
        ├── FontSelector.storm
        ├── GlyphSelector.storm
        └── ParameterSlider.storm
```

## Features

### 1) Shape pipeline (text boundaries)
`src/core/grid_mapper.ts` maps text and font definitions into a coordinate grid, including boundary metadata used by effects.

### 2) Texture pipeline (glyph styling)
`src/assets/glyph_palettes.json` defines density-to-glyph mappings used to render different terminal looks (solid, matrix-like, braille-style, etc.).

### 3) Animation presets
- **Sheen**: diagonal sweep highlight.
- **Wave**: time-based sinusoidal vertical offset.
- **Swipe**: directional reveal/conceal mask with optional edge decay.

### 4) Export-first workflow
`src/state/exporter.ts` emits minimal JSON payloads that can be consumed by production terminal runtimes.

## Installation

> This repository currently does **not** include a package manifest (`package.json`) or lockfile, so there is no one-command dependency install yet.

### Prerequisites

Install the following on your machine:

1. **Node.js 20+** (recommended).
2. **TypeScript toolchain** (`typescript`, `ts-node` or your preferred runner).
3. **Storm framework CLI/runtime** compatible with `.storm` modules.

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd Terminal-Typography-Codex-
```

### 2) Initialize a Node workspace (if starting from this repo state)

```bash
npm init -y
npm install -D typescript ts-node @types/node
```

### 3) Create a TypeScript config (if missing)

```bash
npx tsc --init
```

### 4) Install/configure Storm tooling

Use your environment's Storm setup instructions to install the CLI/runtime and point it at `src/main.storm` as the application entry.

### 5) Run in development

Because runtime scripts are not yet committed in this repo snapshot, run using your local Storm/TypeScript workflow (for example, Storm dev server + TS transpile/watch).

## Programmatic usage

From `src/app.ts`, you can use the core public helpers:

- `renderSingleFrame(): string[]` → renders one frame.
- `getAnimationJson(): string` → exports the current configuration JSON.
- `getStateSnapshot()` → returns current in-memory authoring state.

## Example exported JSON

```json
{
  "version": "1.0.0",
  "text": "STORM",
  "font": "cybermedium",
  "glyphSet": "solid_block",
  "preset": "swipe",
  "parameters": {
    "direction": "left_to_right",
    "action": "reveal",
    "edgeDecay": true,
    "edgeDecayDistance": 3,
    "speed": 2.5
  }
}
```

## Roadmap suggestions

- Add `package.json` scripts (`dev`, `build`, `typecheck`, `test`).
- Add formal installation automation for Storm runtime dependencies.
- Add sample CLI renderer integration (Go/Rust reference adapter).
