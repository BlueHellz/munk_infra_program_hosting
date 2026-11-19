# MUNKEE STUDIO — APPLICATION INFRASTRUCTURE REPOSITORY

This repository manages the application integrations, build configurations, permitted branding modifications, browser distribution packaging, machine-readable application registry, static application hosting configs, and legal attributions for **MUNKEE STUDIO** creative applications inside the MUNK platform.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Application Audit Summary
```bash
npm run audit
```

### 3. Build Proof-of-Concept Application (PhotoCraft / Photo & Raster)
```bash
npm run build:photocraft
```

### 4. Verify Proof of Concept & Run Integration Tests
```bash
npm run test:poc
```

### 5. Start Local Application Delivery Server
```bash
npm run serve
```
Open **http://localhost:8080/apps/photocraft/v1.0.0/index.html** in your browser.

---

## 📂 Repository Structure

```text
munkee-studio-infrastructure/
├── apps/                        # Application configurations & workspace definitions
├── registry/                    # Applications database & JSON Schema
│   ├── applications.json        # Machine-readable registry (12 apps)
│   └── schema.json              # Schema specification
├── branding/                    # Permitted MUNKEE STUDIO branding layer
│   ├── theme.json               # Brand design tokens (#0066FF, #181A1F)
│   ├── branding.css             # Uniform titlebar & CSS overrides
│   └── patches/                 # Branding patches
├── build/                       # Build scripts & pipeline
│   └── scripts/                 # Fetch, patch, build, verify, audit scripts
├── dist/                        # Built browser distributions & manifests
│   └── apps/                    # Versioned distribution packages
├── hosting/                     # Static hosting server & CDN configurations
│   ├── server.mjs               # Node/Express local delivery server with COOP/COEP
│   ├── nginx.conf               # Production Nginx config
│   └── s3-deploy.sh             # S3/R2 deployment script
├── legal/                       # Upstream licenses & attribution matrix
│   ├── LICENSES.md
│   ├── ATTRIBUTION.md
│   └── TRADEMARK_GUIDELINES.md
└── docs/                        # Technical documentation & audits
    ├── ARCHITECTURE.md
    ├── AUDIT_REPORT.md
    ├── BROWSER_COMPATIBILITY.md
    └── PROOF_OF_CONCEPT.md
```

---

## 🎨 Applications in Scope

| Application ID | Category | User-Facing Name | Upstream Engine | License | Browser Status |
|---|---|---|---|---|---|
| `photocraft` | Art | Photo & Raster | MiniPaint | BSD-3-Clause | `INTEGRATION VERIFIED` (PoC) |
| `figcraft` | Art | UI & Prototype | Penpot | MPL-2.0 | `BROWSER BUILD AVAILABLE` |
| `vectorcraft` | Art | Vector & Logo | SVG-Edit | MIT | `BROWSER BUILD AVAILABLE` |
| `anicraft` | Editing | 2D Animation | Wick Editor | MIT | `BROWSER BUILD AVAILABLE` |
| `soundcraft` | Audio | Music & DAW | Wavacity / Audacity WASM | GPL-3.0-or-later | `BROWSER BUILD AVAILABLE` |
| `audiopost` | Audio | Audio Post & FX | SoundCraft Audio FX | GPL-3.0-or-later | `AUDIT COMPLETE` |
| `texturecraft` | 3D | Texture Painter | ArmorPaint | zlib/libpng | `BROWSER BUILD AVAILABLE` |
| `materialcraft` | 3D | PBR Materials | ArmorLab | zlib/libpng | `BROWSER BUILD AVAILABLE` |
| `filmcraft` | Editing | Video Timeline | Shotcut / MLT | GPL-3.0-or-later | `DESKTOP ONLY / UNVERIFIED` |
| `effectcraft` | Editing | Motion & VFX | Natron | GPL-2.0-or-later | `DESKTOP ONLY / UNVERIFIED` |
| `lightcraft` | Art | RAW & Color | Darktable | GPL-3.0-or-later | `DESKTOP ONLY / UNVERIFIED` |
| `designcraft` | Art | Print & Layout | Scribus | GPL-2.0-or-later | `DESKTOP ONLY / UNVERIFIED` |

---

## 🔒 Security & Browser Requirements
- **SharedArrayBuffer & WebAssembly**: Multi-threaded applications require Cross-Origin Isolation:
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
- **MIME Types**: WebAssembly binaries must be served with `Content-Type: application/wasm`.

---

## ⚖️ Legal & Attributions
All upstream software licenses, copyright headers, and attributions are preserved in full. See `legal/LICENSES.md` and `legal/ATTRIBUTION.md`.
