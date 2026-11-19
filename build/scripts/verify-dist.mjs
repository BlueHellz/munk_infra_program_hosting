import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const DIST_DIR = path.join(ROOT_DIR, 'dist/apps');

export function verifyDist(appId, version = '1.0.0') {
  console.log(`[VerifyDist] Validating distribution package for '${appId}' (v${version})...`);
  const appDistDir = path.join(DIST_DIR, `${appId}/v${version}`);

  if (!fs.existsSync(appDistDir)) {
    throw new Error(`Distribution directory missing: ${appDistDir}`);
  }

  const requiredFiles = [
    'index.html',
    'manifest.json',
    'css/munkee-branding.css',
    'legal/LICENSE'
  ];

  const missingFiles = [];
  for (const relFile of requiredFiles) {
    const fullPath = path.join(appDistDir, relFile);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(relFile);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`Verification failed! Missing distribution files: ${missingFiles.join(', ')}`);
  }

  // Validate manifest.json
  const manifestPath = path.join(appDistDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const requiredManifestKeys = ['appId', 'userFacingName', 'originalUpstreamName', 'deployedVersion', 'entryPoint', 'legalNoticeLocation'];
  for (const key of requiredManifestKeys) {
    if (!manifest[key]) {
      throw new Error(`Manifest error: Missing key '${key}' in ${manifestPath}`);
    }
  }

  // Validate index.html content
  const indexContent = fs.readFileSync(path.join(appDistDir, 'index.html'), 'utf8');
  if (!indexContent.includes('munkee-studio-header-bar') && !indexContent.includes('MUNKEE STUDIO')) {
    throw new Error(`Branding error: index.html missing MUNKEE STUDIO header or branding element.`);
  }

  console.log(`[VerifyDist] ✅ Verification SUCCESSFUL for '${appId}' (v${version})! All required distribution resources, manifests, and branding elements present.`);
  return { success: true, manifest };
}

if (process.argv[1] && process.argv[1].endsWith('verify-dist.mjs')) {
  const appId = process.argv[2] || 'photocraft';
  try {
    verifyDist(appId);
  } catch (err) {
    console.error(`[VerifyDist Error]`, err.message);
    process.exit(1);
  }
}
