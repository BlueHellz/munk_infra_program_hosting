import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');

const app = express();
const PORT = process.env.PORT || 8080;

// Security and WebAssembly Headers Middleware
app.use((req, res, next) => {
  // Cross-Origin Isolation for SharedArrayBuffer & WebAssembly Threads
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Custom MIME Types (Ensuring .wasm is application/wasm)
express.static.mime.define({
  'application/wasm': ['wasm'],
  'application/json': ['json', 'map'],
  'image/svg+xml': ['svg']
});

// Serve Registry API
app.get('/api/registry', (req, res) => {
  if (fs.existsSync(REGISTRY_PATH)) {
    res.json(JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')));
  } else {
    res.status(404).json({ error: 'Registry not found' });
  }
});

// Serve Built Applications
app.use('/', express.static(DIST_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    } else if (filePath.match(/\.(js|css|wasm|png|jpg|svg|woff2)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`[MunkeeStudioHosting] Static Application Server running at: http://localhost:${PORT}`);
  console.log(`[MunkeeStudioHosting] PhotoCraft Proof-of-Concept URL: http://localhost:${PORT}/apps/photocraft/v1.0.0/index.html`);
  console.log(`[MunkeeStudioHosting] Registry API Endpoint: http://localhost:${PORT}/api/registry`);
});
