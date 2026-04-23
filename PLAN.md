# Terminal Typography Animator: Architectural & Implementation Specification
**Target Environment:** Local-First Desktop/Terminal Utility (Built on Storm Framework)
**Primary Output:** Lightweight JSON Configuration (animation.json) for Go/Rust Runtimes
This document serves as the comprehensive architectural blueprint for the Terminal Typography Animator. It outlines the modular file structure, the distinct shape/texture rendering pipelines, the underlying mathematical models for animation, and the "Liquid" UI paradigm.
## 1. Project Architecture & File Structure
The application follows a strictly modular architecture, separating the rendering loop (core/engine) from the user interface (ui/) and the configuration state (state/).
### Directory Tree Overview
```text
src/
├── main.storm                  # Application entry point and layout shell
├── core/                       # The high-performance logic layer
│   ├── engine.ts               # requestRender() loop, buffer management, 60fps tick
│   ├── grid_mapper.ts          # 2D coordinate text layout & boundary calculation
│   └── math_utils.ts           # Trigonometry and clipping algorithms
├── assets/                     # Zero-network dependency dictionaries
│   ├── fonts.json              # Mappings for geometric text boundaries
│   └── glyph_palettes.json     # Dictionaries for Solid, Cyber, Braille, etc.
├── animations/                 # Isolated animation logic modules
│   ├── sheen.ts                # Diagonal sweep calculation
│   ├── wave.ts                 # Sine-wave stagger calculation
│   └── swipe.ts                # Directional clipping mask calculation
├── state/                      # Centralized configuration management
│   ├── store.ts                # Reactive state holding current UI selections
│   └── exporter.ts             # Compiles state into the final animation.json
└── ui/                         # The "Liquid" UI components
    ├── canvas/                 # Top-half rendering view
    │   └── Stage.storm         # Holds the typed array output
    └── controls/               # Bottom-half interaction view
        ├── ControlPanel.storm  # Container for dynamic controls
        ├── PresetSelector.storm# Toggles between Sheen, Wave, Swipe
        ├── GlyphSelector.storm # Toggles texture palettes
        └── ParameterSlider.storm# Reusable input component for numerical tweaks

```
### Core File Responsibilities
 * **engine.ts**: The heart of the application. It maintains two typed arrays (front buffer / back buffer) and executes a strict update-draw loop without triggering UI DOM reflows.
 * **grid_mapper.ts**: Translates a string (e.g., "STORM") and a font selection into a 2D matrix of active/inactive coordinates. This represents the **Shape**.
 * **glyph_palettes.json**: Defines the **Texture**. It maps conceptual density levels (0.0 to 1.0) to specific ASCII/Unicode characters.
 * **exporter.ts**: Strips away all UI and rendering overhead to output a minimal, pure-data JSON file representing the mathematical intent of the animation.
## 2. Usability & UI Paradigm
The UI is divided into two distinct, non-blocking hemispheres:
### Top Hemisphere: The Canvas
 * **Technology**: Built using a dedicated <Canvas> component utilizing Storm’s imperative requestRender() loop.
 * **Performance**: Manipulates typed arrays directly to ensure a locked 60fps, zero-stutter playback. It bypasses standard component lifecycles to guarantee realtime terminal emulation.
### Bottom Hemisphere: The "Liquid" Control Panel
 * **Design**: A highly responsive, minimalistic control panel.
 * **Transitions**: Utilizes Storm's <Transition> components. Switching between animation presets (e.g., moving from "Wave" parameters to "Swipe" parameters) triggers hardware-accelerated micro-animations.
 * **UX Principle**: Zero layout thrashing. The panel geometry remains fixed, while the internal sliders and dropdowns cross-fade seamlessly based on the active context.
## 3. The Rendering Pipeline: Shape vs. Texture
The visual engine separates the *boundaries* of the text from the *characters* that fill it.
### A. Shape (The Font Engine)
The grid mapper calculates the bounding boxes and structural pixels of the input string. It outputs a boolean grid or density map representing where text *should* exist.
### B. Texture (The Glyph Sets)
Characters are applied dynamically based on the chosen palette. This allows animations to alter not just color, but the physical characters themselves.
| Palette Name | Character Set | Ideal Use Case |
|---|---|---|
| **Solid Block** | █ ▓ ▒ ░ | Heavy typography, smooth gradients, volumetric fades. |
| **Cyber / Matrix** | ｦ ｧ ｨ ｩ ｪ ｫ ｬ 1 0 ﾊ ﾐ ﾋ ｰ | Dense, technical, fast-changing data aesthetics. |
| **Architectural** | ╬ ═ ║ ╗ ╝ ╚ ╔ | Crisp, intersecting geometric structures. |
| **Braille** | ⡆ ⡇ ⡈ ⡉ ⡊ ⡋ | Minimalist, high-resolution sub-pixel rendering. |
## 4. Animation Subsystems & Mathematics
Each animation preset is an isolated module that applies mathematical transformations to the 2D grid per frame.
### Preset 1: The Sheen
A sweeping diagonal band of high-intensity color or altered characters.
 * **Implementation**: For a sheen line defined by Ax + By + C = 0, a character at grid coordinate (x, y) is highlighted if its orthogonal distance d to the line is less than the thickness radius R:
   
 * **Parameters**:
   * angle: Slope of the sweeping line (0° to 360°).
   * speed: Movement modifier per frame.
   * thickness: Width of the bounding box (2R).
   * highlightColor: ANSI hex override.
   * glyphOverride: Shifts characters to the "highest" density value in the palette during the sweep.
### Preset 2: The Wave
Vertical staggered displacement of individual letters.
 * **Implementation**: Calculates vertical displacement using a time-based sine wave, staggered by the character's horizontal index. For a character at horizontal index i, the vertical offset \Delta y at time t is:
   
   
   *(Where A is amplitude, f is frequency/speed, and S is the phase stagger).*
 * **Parameters**:
   * amplitude: Number of terminal rows the text shifts.
   * speed: Frequency (f) of the wave.
   * stagger: Phase offset (S). High stagger = tight ripples; Low stagger = rolling waves.
   * easing: Optional physics override (e.g., adding a damping coefficient to mimic spring tension).
### Preset 3: Swipe Reveal / Conceal
Dynamic masking behaving like a physical slide over the text.
 * **Implementation**: A directional clipping mask. Bounding coordinates [x_{min}(t), x_{max}(t)] or [y_{min}(t), y_{max}(t)] are calculated per frame. Coordinates outside the bounds are dropped from the render buffer.
 * **Parameters**:
   * direction: Left-to-Right, Top-to-Bottom, Radial, etc.
   * action: Expand (Reveal) or Contract (Conceal).
   * speed: Columns/rows advanced per frame.
   * edgeDecay: Applies mathematical degradation at the mask boundary. Instead of a boolean cut-off, density D decays over a distance L, shifting characters (e.g., █ \rightarrow ▓ \rightarrow ▒ \rightarrow ░).
## 5. Export & Handoff Pipeline
The primary purpose of the Storm application is to act as a visual IDE. The actual terminal rendering is executed in production by a runtime package (e.g., glyphmotion-go).
The exporter compiles the reactive state into a strictly typed, lightweight JSON file.
**Example animation.json:**
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
**Developer Workflow:**
 1. Designer creates the animation in the Storm UI.
 2. The animation.json is exported.
 3. The developer loads the JSON into their target application.
 4. The Go/Rust runtime parses the configuration, applies the texture dictionary to the shape coordinates, and executes the math formulas locally within their native terminal instance, completely independent of the Storm authoring environment.
