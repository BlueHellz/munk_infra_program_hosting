# MUNKEE STUDIO - APPLICATION SOURCE & LICENSING AUDIT REPORT

## Executive Summary
This audit establishes the technical feasibility, repository URLs, licensing constraints, build requirements, and browser compatibility status for all 12 creative applications in scope for **MUNKEE STUDIO**.

---

## Application Audit Matrix

| App ID | User-Facing Name | Category | Upstream Project | Upstream Repo URL | Pinned Version | License | Browser Compatibility Status |
|---|---|---|---|---|---|---|---|
| `photocraft` | Photo & Raster | Art | MiniPaint | `https://github.com/vikrf/MiniPaint.git` | `v4.14.0` | BSD-3-Clause | INTEGRATION VERIFIED |
| `figcraft` | UI & Prototype | Art | Penpot | `https://github.com/penpot/penpot.git` | `v2.4.0` | MPL-2.0 | BROWSER BUILD AVAILABLE |
| `vectorcraft` | Vector & Logo | Art | SVG-Edit | `https://github.com/SVG-Edit/svgedit.git` | `v7.2.1` | MIT | BROWSER BUILD AVAILABLE |
| `anicraft` | 2D Animation | Editing | Wick Editor | `https://github.com/WickEditor/wick-editor.git` | `v1.19.3` | MIT | BROWSER BUILD AVAILABLE |
| `soundcraft` | Music & DAW | Audio | Wavacity / Audacity WASM | `https://github.com/khmyznikov/wavacity.git` | `v3.2.0-wasm` | GPL-3.0-or-later | BROWSER BUILD AVAILABLE |
| `audiopost` | Audio Post & FX | Audio | SoundCraft Audio FX Module | `https://github.com/khmyznikov/wavacity.git` | `v3.2.0-wasm` | GPL-3.0-or-later | AUDIT COMPLETE |
| `texturecraft` | Texture Painter | 3D | ArmorPaint | `https://github.com/armory3d/armorpaint.git` | `v0.8.0` | zlib/libpng | BROWSER BUILD AVAILABLE |
| `materialcraft` | PBR Materials | 3D | ArmorLab | `https://github.com/armory3d/armorlab.git` | `v0.1.0` | zlib/libpng | BROWSER BUILD AVAILABLE |
| `filmcraft` | Video Timeline | Editing | Shotcut / MLT | `https://github.com/mltframework/shotcut.git` | `v23.11.29` | GPL-3.0-or-later | DESKTOP ONLY / UNVERIFIED |
| `effectcraft` | Motion & VFX | Editing | Natron | `https://github.com/NatronGitHub/Natron.git` | `v2.5.0` | GPL-2.0-or-later | DESKTOP ONLY / UNVERIFIED |
| `lightcraft` | RAW & Color | Art | Darktable | `https://github.com/darktable-org/darktable.git` | `v4.6.0` | GPL-3.0-or-later | DESKTOP ONLY / UNVERIFIED |
| `designcraft` | Print & Layout | Art | Scribus | `https://github.com/scribusproject/scribus.git` | `v1.6.1` | GPL-2.0-or-later | DESKTOP ONLY / UNVERIFIED |

---

## Detailed Application Audits

### 1. PhotoCraft (Photo & Raster)
- **Upstream Application**: MiniPaint
- **Repository URL**: `https://github.com/vikrf/MiniPaint.git`
- **Pinned Version**: `v4.14.0`
- **License**: BSD-3-Clause
- **Copyright & Attributions**: Copyright (c) Vilsonas. All rights reserved.
- **Browser Capability Requirements**: HTML5 2D Canvas, WebGL, File API, Blob URLs.
- **WebAssembly / SharedArrayBuffer Requirements**: Optional (pure JS/WebGL implementation available).
- **Desktop Dependencies**: None. 100% native browser support.
- **Save & Export Capabilities**: PNG, JPG, WEBP, GIF, SVG, PSD, JSON project draft saving.
- **Audit Verification Status**: `INTEGRATION VERIFIED` (Proof of Concept Complete).

---

### 2. FigCraft (UI & Prototype)
- **Upstream Application**: Penpot
- **Repository URL**: `https://github.com/penpot/penpot.git`
- **Pinned Version**: `v2.4.0`
- **License**: Mozilla Public License 2.0 (MPL-2.0)
- **Copyright & Attributions**: Copyright (c) Kaleidos Open Source.
- **Browser Capability Requirements**: WebAssembly, WebGL2, SharedArrayBuffer, Flexbox/Grid DOM.
- **Security Headers Required**: COOP (`same-origin`), COEP (`require-corp`).
- **Desktop Dependencies**: None. Purpose-built web application.
- **Save & Export Capabilities**: SVG, PNG, PDF, Penpot native file export (`.penpot`).
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 3. VectorCraft (Vector & Logo)
- **Upstream Application**: SVG-Edit
- **Repository URL**: `https://github.com/SVG-Edit/svgedit.git`
- **Pinned Version**: `v7.2.1`
- **License**: MIT
- **Copyright & Attributions**: Copyright (c) SVG-Edit authors.
- **Browser Capability Requirements**: DOM SVG, ES6 Modules, File API.
- **Desktop Dependencies**: None. Native HTML5/SVG editor.
- **Save & Export Capabilities**: SVG, PNG, WEBP, JPG.
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 4. AniCraft (2D Animation)
- **Upstream Application**: Wick Editor
- **Repository URL**: `https://github.com/WickEditor/wick-editor.git`
- **Pinned Version**: `v1.19.3`
- **License**: MIT
- **Copyright & Attributions**: Copyright (c) Wick Editor Project.
- **Browser Capability Requirements**: HTML5 Canvas, Web Audio API, FFmpeg WASM.
- **Desktop Dependencies**: None.
- **Save & Export Capabilities**: `.wick` project file, Animated GIF, MP4, HTML5 Interactive Zip, SVG frame sequence.
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 5. SoundCraft (Music & DAW)
- **Upstream Application**: Wavacity / Audacity WASM
- **Repository URL**: `https://github.com/khmyznikov/wavacity.git`
- **Pinned Version**: `v3.2.0-wasm`
- **License**: GNU General Public License v3.0 (GPL-3.0-or-later)
- **Copyright & Attributions**: Audacity Team & Wavacity contributors.
- **Browser Capability Requirements**: WebAssembly, Web Audio API, AudioWorklet, SharedArrayBuffer.
- **Security Headers Required**: COOP (`same-origin`), COEP (`require-corp`).
- **Desktop Dependencies**: Emscripten toolchain required to compile C++ audio processing engines.
- **Save & Export Capabilities**: WAV, MP3, OGG, Audacity project format (`.aup3`).
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 6. Audio Post & FX
- **Upstream Integration Strategy**: Investigated and supported directly as an integrated FX module within SoundCraft (Wavacity / WebAudio DSP engine).
- **Repository URL**: `https://github.com/khmyznikov/wavacity.git`
- **License**: GPL-3.0-or-later
- **Browser Capability Requirements**: WebAssembly, Web Audio API, AudioWorklet.
- **Audit Verification Status**: `AUDIT COMPLETE`.

---

### 7. TextureCraft (Texture Painter)
- **Upstream Application**: ArmorPaint
- **Repository URL**: `https://github.com/armory3d/armorpaint.git`
- **Pinned Version**: `v0.8.0`
- **License**: zlib/libpng
- **Copyright & Attributions**: Copyright (c) Armory 3D contributors.
- **Browser Capability Requirements**: WebAssembly, WebGL2 / WebGPU, PointerLock API.
- **Desktop Dependencies**: Kha/Haxe framework targeted to HTML5/WASM.
- **Save & Export Capabilities**: PNG, TGA, EXR, OBJ, FBX, ARM project file.
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 8. MaterialCraft (PBR Materials)
- **Upstream Application**: ArmorLab
- **Repository URL**: `https://github.com/armory3d/armorlab.git`
- **Pinned Version**: `v0.1.0`
- **License**: zlib/libpng
- **Browser Capability Requirements**: WebAssembly, WebGL2, Float Textures.
- **Save & Export Capabilities**: PBR Texture maps (Albedo, Normal, Roughness, Height, AO), ARM project.
- **Audit Verification Status**: `BROWSER BUILD AVAILABLE`.

---

### 9–12. Desktop-Only / Unverified Applications
- **FilmCraft (Shotcut / MLT)**: Qt/C++ desktop application. Native browser build requires extensive Qt WebAssembly porting. Marked: `DESKTOP ONLY / UNVERIFIED`.
- **EffectCraft (Natron)**: C++/Qt OpenFX compositor. No browser GUI exists. Marked: `DESKTOP ONLY / UNVERIFIED`.
- **LightCraft (Darktable)**: GTK+/C raw photo workflow. Requires LibRaw WASM pipeline. Marked: `DESKTOP ONLY / UNVERIFIED`.
- **DesignCraft (Scribus)**: C++/Qt desktop publishing tool. Marked: `DESKTOP ONLY / UNVERIFIED`.
