import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { buildApp } from './build-app.mjs';
import { verifyDist } from './verify-dist.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');

async function runPoCVerification() {
  console.log(`\n========================================`);
  console.log(`MUNKEE STUDIO - PROOF OF CONCEPT VERIFICATION`);
  console.log(`Target Application: PhotoCraft (Photo & Raster)`);
  console.log(`========================================\n`);

  // Step 1: Build Application
  console.log(`[PoC Step 1] Executing Application Build Pipeline for PhotoCraft...`);
  const buildResult = await buildApp('photocraft');
  console.log(`[PoC Step 1] Build Completed at: ${buildResult.outDir}`);

  // Step 2: Distribution File Verification
  console.log(`\n[PoC Step 2] Verifying Distribution Files and Manifest Structure...`);
  const verificationResult = verifyDist('photocraft', '1.0.0');
  console.log(`[PoC Step 2] File structure and Manifest verification SUCCESSFUL.`);

  // Step 3: Local Server & HTTP Delivery Verification
  console.log(`\n[PoC Step 3] Starting Local Delivery Server & Checking HTTP Endpoints...`);
  const app = express();

  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  app.get('/api/registry', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')));
  });

  app.use('/', express.static(DIST_DIR));

  const PORT = 8089;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[PoC Step 3] Test Server listening on http://localhost:${PORT}`);

  const endpointsToTest = [
    { url: `http://localhost:${PORT}/apps/photocraft/v1.0.0/index.html`, expectedHeader: 'cross-origin-opener-policy', expectedContent: 'MUNKEE STUDIO' },
    { url: `http://localhost:${PORT}/apps/photocraft/v1.0.0/manifest.json`, expectedContent: 'photocraft' },
    { url: `http://localhost:${PORT}/apps/photocraft/v1.0.0/css/munkee-branding.css`, expectedContent: '--munkee-blue' },
    { url: `http://localhost:${PORT}/apps/photocraft/v1.0.0/legal/LICENSE`, expectedContent: 'MiniPaint' },
    { url: `http://localhost:${PORT}/api/registry`, expectedContent: 'photocraft' }
  ];

  let passedEndpoints = 0;

  for (const ep of endpointsToTest) {
    await new Promise((resolve, reject) => {
      http.get(ep.url, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`❌ HTTP Request Failed for ${ep.url} with Status: ${res.statusCode}`);
            reject(new Error(`Status ${res.statusCode}`));
            return;
          }

          if (ep.expectedHeader && !res.headers[ep.expectedHeader]) {
            console.error(`❌ Missing Expected Header '${ep.expectedHeader}' on ${ep.url}`);
            reject(new Error(`Header ${ep.expectedHeader} missing`));
            return;
          }

          if (ep.expectedContent && !body.includes(ep.expectedContent)) {
            console.error(`❌ Content check failed for ${ep.url}. Expected to contain '${ep.expectedContent}'`);
            reject(new Error(`Content missing`));
            return;
          }

          console.log(`✅ [HTTP 200 OK] Verified endpoint: ${ep.url}`);
          passedEndpoints++;
          resolve();
        });
      }).on('error', (err) => reject(err));
    });
  }

  server.close();
  console.log(`[PoC Step 3] Test Server closed successfully.`);

  console.log(`\n========================================`);
  console.log(`🎉 PROOF OF CONCEPT VERIFICATION COMPLETE`);
  console.log(`Application: PhotoCraft (Photo & Raster)`);
  console.log(`Status: VERIFIED & OPERATIONAL`);
  console.log(`Endpoints Passed: ${passedEndpoints}/${endpointsToTest.length}`);
  console.log(`========================================\n`);
}

runPoCVerification().catch(err => {
  console.error(`[PoC Failure]`, err);
  process.exit(1);
});
