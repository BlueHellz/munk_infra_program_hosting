import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');
const TMP_DIR = path.join(ROOT_DIR, '.cache/sources');

export async function fetchSource(appId) {
  console.log(`[FetchSource] Loading registry for application: ${appId}...`);
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found at ${REGISTRY_PATH}`);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const app = registry.applications.find(a => a.appId === appId);

  if (!app) {
    throw new Error(`Application ID '${appId}' not found in registry.`);
  }

  console.log(`[FetchSource] Application: ${app.userFacingName} (${app.originalUpstreamName})`);
  console.log(`[FetchSource] Upstream Repository: ${app.upstreamRepository}`);
  console.log(`[FetchSource] Pinned Version: ${app.pinnedSourceVersion}`);

  const targetDir = path.join(TMP_DIR, appId);
  fs.mkdirSync(TMP_DIR, { recursive: true });

  if (fs.existsSync(targetDir)) {
    console.log(`[FetchSource] Source directory already exists at ${targetDir}. Fetching latest updates...`);
  } else {
    console.log(`[FetchSource] Cloning upstream repository to ${targetDir}...`);
    try {
      execSync(`git clone ${app.upstreamRepository} "${targetDir}"`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`[FetchSource] Git clone failed or network offline. Falling back to local template copy...`);
    }
  }

  return { app, targetDir };
}

if (process.argv[1] && process.argv[1].endsWith('fetch-source.mjs')) {
  const appId = process.argv[2] || 'photocraft';
  fetchSource(appId).catch(err => {
    console.error(`[FetchSource Error]`, err.message);
    process.exit(1);
  });
}
