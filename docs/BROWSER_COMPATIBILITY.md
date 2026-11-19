# MUNKEE STUDIO - BROWSER COMPATIBILITY & CAPABILITIES MATRIX

## 1. Overview
This matrix details the browser feature requirements, security headers, hardware acceleration, WebAssembly, WebGPU, and cross-origin requirements for each creative application in MUNKEE STUDIO.

---

## 2. Capability Requirements Matrix

| Application | WebAssembly | WebGL / WebGL2 | WebGPU | SharedArrayBuffer | AudioWorklet | COOP/COEP Required |
|---|---|---|---|---|---|---|
| **PhotoCraft** | Optional | WebGL | No | No | No | Optional |
| **FigCraft** | Required | WebGL2 | No | Required | No | Required |
| **VectorCraft** | No | Optional | No | No | No | No |
| **AniCraft** | Required (FFmpeg) | Canvas2D | No | Optional | Yes | Optional |
| **SoundCraft** | Required | No | No | Required | Required | Required |
| **Audio Post & FX** | Required | No | No | Required | Required | Required |
| **TextureCraft** | Required | WebGL2 | Supported | Optional | No | Optional |
| **MaterialCraft** | Required | WebGL2 | No | Optional | No | Optional |
| **FilmCraft** | Required | WebGL2 | No | Required | Yes | Required |
| **EffectCraft** | Required | WebGL2 | No | Required | No | Required |
| **LightCraft** | Required | WebGL2 | No | Optional | No | Optional |
| **DesignCraft** | Required | Canvas2D | No | Optional | No | Optional |

---

## 3. Required Headers for Cross-Origin Isolation

Applications utilizing `SharedArrayBuffer` (e.g. FigCraft, SoundCraft, TextureCraft) or multi-threaded WebAssembly require Cross-Origin Isolation.

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: cross-origin
```

> **IMPORTANT**: Cross-Origin isolation headers must be configured on application hosting subdomains (e.g., `studio-apps.munkee.io`), NOT globally on the primary MUNK platform domain, to avoid interfering with external authentication providers (e.g. Privy, OAuth, Wallet Connect).
