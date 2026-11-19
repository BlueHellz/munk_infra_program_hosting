# MUNKEE STUDIO - APPLICATION INFRASTRUCTURE ARCHITECTURE

## 1. Overview
The `munkee-studio-infrastructure` repository manages the build pipeline, source integrations, permitted branding layer, packaging, application registry, and static hosting architecture for creative applications running inside **MUNKEE STUDIO** windows.

This repository does NOT rebuild creative applications from scratch, nor does it replace creative engines with mockups. It prepares, builds, packages, and serves official open-source creative software distributions to the MUNK web application platform.

---

## 2. Directory & Component Structure

```text
munkee-studio-infrastructure/
├── apps/                        # Application source configs & workspaces
│   ├── photocraft/              # Photo & Raster (MiniPaint engine)
│   ├── figcraft/                # UI & Prototype (Penpot engine)
│   ├── vectorcraft/             # Vector & Logo (SVG-Edit engine)
│   ├── anicraft/                # 2D Animation (Wick Editor engine)
│   ├── soundcraft/              # Music & DAW (Wavacity/Audacity engine)
│   ├── audiopost/               # Audio Post & FX (SoundCraft Audio FX module)
│   ├── texturecraft/            # Texture Painter (ArmorPaint engine)
│   ├── materialcraft/           # PBR Materials (ArmorLab engine)
│   ├── filmcraft/               # Video Timeline (Shotcut/MLT target)
│   ├── effectcraft/             # Motion & VFX (Natron target)
│   ├── lightcraft/              # RAW & Color (Darktable target)
│   └── designcraft/             # Print & Layout (Scribus target)
├── registry/                    # Machine-readable application registry
│   ├── applications.json        # Unified applications database
│   └── schema.json              # Registry JSON Schema
├── branding/                    # Permitted MUNKEE STUDIO branding layer
│   ├── theme.json               # Brand design tokens (#0066FF, #181A1F)
│   ├── branding.css             # Uniform window titlebar, header & CSS tokens
│   ├── assets/                  # Logos, icons, favicons
│   └── patches/                 # Per-application branding patches
├── build/                       # Build automation scripts & toolchain
│   └── scripts/                 # Fetch, patch, build, package, verify scripts
├── dist/                        # Output browser distributions (versioned)
│   └── apps/                    # Built application assets & manifests
├── hosting/                     # Static hosting & delivery configs
│   ├── server.mjs               # Node/Express local delivery server with COOP/COEP
│   ├── nginx.conf               # Production CDN/Nginx configuration
│   └── s3-deploy.sh             # S3/R2/CDN deployment script
├── legal/                       # Upstream licenses & attribution matrix
│   ├── LICENSES.md              # Unified upstream licenses summary
│   ├── ATTRIBUTION.md           # Copyright & attribution notices
│   └── TRADEMARK_GUIDELINES.md  # Trademark boundaries & permitted branding
└── docs/                        # Technical documentation & audits
    ├── ARCHITECTURE.md
    ├── AUDIT_REPORT.md
    ├── BROWSER_COMPATIBILITY.md
    └── PROOF_OF_CONCEPT.md
```

---

## 3. Build & Packaging Lifecycle

1. **Source Pinning**: Every application specifies a pinned upstream Git repository, commit hash, or tag in `registry/applications.json`.
2. **Branding Layer Application**: The build pipeline injects MUNKEE STUDIO visual identity:
   - Header Bar: Dark Charcoal (`#181A1F`), MUNK Electric Blue (`#0066FF`) highlights.
   - Title & Version tag presentation.
   - Preserves 100% of the upstream editing environment, tools, canvas, layers, and shortcuts.
   - Retains original copyright & license notices in dedicated legal footers.
3. **Compilation & Packaging**: Compiles WebAssembly modules (where applicable), bundles HTML/JS/CSS assets into `dist/apps/<appId>/v<version>/`.
4. **Manifest Generation**: Generates machine-readable `manifest.json` describing required browser capabilities, entry points, security headers, and legal notices.
5. **Distribution Verification**: `verify-dist.mjs` checks file integrity, MIME header declarations, and branding elements.

---

## 4. Delivery & Security Headers

The hosting layer is configured to serve WebAssembly and cross-origin isolated applications:
- `Cross-Origin-Opener-Policy: same-origin` (COOP)
- `Cross-Origin-Embedder-Policy: require-corp` (COEP)
- `Content-Type: application/wasm` for WebAssembly binaries
- Immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`) for versioned assets.
