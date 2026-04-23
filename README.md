# Terminal Typography Animator

A local-first authoring system for terminal typography animations using a modular Storm-style architecture.

## Implemented architecture

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
│   ├── store.ts
│   └── exporter.ts
└── ui/
    ├── canvas/
    │   └── Stage.storm
    └── controls/
        ├── ControlPanel.storm
        ├── PresetSelector.storm
        ├── GlyphSelector.storm
        └── ParameterSlider.storm
```

## Core concepts

- **Shape pipeline:** `grid_mapper.ts` maps text + font bitmap into a boolean/density grid.
- **Texture pipeline:** `glyph_palettes.json` maps density levels to terminal glyphs.
- **Animation modules:** independent math modules for `sheen`, `wave`, and `swipe`.
- **Engine loop:** `engine.ts` uses front/back typed-array buffers and a 60fps-capable tick model.
- **Export handoff:** `state/exporter.ts` emits a lightweight `animation.json` for Go/Rust runtimes.

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
    "speed": 2.5
  }
}
```
