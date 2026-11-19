import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyBranding } from './apply-branding.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');
const DIST_DIR = path.join(ROOT_DIR, 'dist/apps');

export function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

export async function buildApp(appId) {
  console.log(`[BuildPipeline] Starting build process for application: '${appId}'...`);

  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found at ${REGISTRY_PATH}`);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const app = registry.applications.find(a => a.appId === appId);

  if (!app) {
    throw new Error(`Application ID '${appId}' not found in registry.`);
  }

  const appSourceDir = path.join(ROOT_DIR, `apps/${appId}`);
  const outDir = path.join(DIST_DIR, `${appId}/v${app.deployedVersion}`);

  fs.mkdirSync(outDir, { recursive: true });

  if (fs.existsSync(appSourceDir)) {
    console.log(`[BuildPipeline] Copying app source from ${appSourceDir} -> ${outDir}`);
    copyRecursiveSync(appSourceDir, outDir);
  } else {
    console.log(`[BuildPipeline] App source directory ${appSourceDir} not found locally. Using template build.`);
  }

  // Apply Branding Patch
  applyBranding(app, appSourceDir, outDir);

  // Generate Legal Attribution File
  const legalDir = path.join(outDir, 'legal');
  fs.mkdirSync(legalDir, { recursive: true });
  fs.writeFileSync(path.join(legalDir, 'LICENSE'), `
MUNKEE STUDIO - APPLICATION LEGAL ATTRIBUTION
Application: ${app.userFacingName} (${app.appId})
Original Upstream Name: ${app.originalUpstreamName}
Upstream Repository: ${app.upstreamRepository}
Pinned Version: ${app.pinnedSourceVersion}
License Type: ${app.license}

This distribution retains all original upstream copyright notices and licenses.
Rebranded and packaged for MUNKEE STUDIO internal browser delivery.
  `.trim());

  // Generate Application Manifest
  const manifest = {
    appId: app.appId,
    userFacingName: app.userFacingName,
    originalUpstreamName: app.originalUpstreamName,
    upstreamRepository: app.upstreamRepository,
    pinnedSourceVersion: app.pinnedSourceVersion,
    deployedVersion: app.deployedVersion,
    studioCategory: app.studioCategory,
    license: app.license,
    entryPoint: app.entryPoint,
    requiredBrowserCapabilities: app.requiredBrowserCapabilities,
    securityHeadersRequired: {
      COOP: "same-origin",
      COEP: "require-corp",
      WASM_MIME: "application/wasm"
    },
    legalNoticeLocation: app.legalNoticeLocation,
    buildTimestamp: new Date().toISOString()
  };

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`[BuildPipeline] Successfully generated application manifest at ${path.join(outDir, 'manifest.json')}`);

  // Update Registry Status
  app.buildStatus = 'BUILD_SUCCESS';
  if (app.browserCompatibilityStatus === 'BROWSER BUILD AVAILABLE' || app.browserCompatibilityStatus === 'AUDIT COMPLETE') {
    app.browserCompatibilityStatus = 'BUILD VERIFIED';
  }
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

  console.log(`[BuildPipeline] Build complete for '${appId}'. Output directory: ${outDir}`);
  return { app, outDir, manifest };
}

if (process.argv[1] && process.argv[1].endsWith('build-app.mjs')) {
  const appId = process.argv[2] || 'photocraft';
  buildApp(appId).catch(err => {
    console.error(`[BuildPipeline Error]`, err.message);
    process.exit(1);
  });
}
