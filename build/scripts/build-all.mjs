import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildApp } from './build-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');

async function buildAll() {
  console.log(`[BuildAll] Reading applications registry...`);
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  const results = [];
  for (const app of registry.applications) {
    console.log(`\n========================================`);
    console.log(`Building Application: ${app.userFacingName} (${app.appId})`);
    console.log(`Status: ${app.browserCompatibilityStatus}`);
    console.log(`========================================`);

    try {
      const res = await buildApp(app.appId);
      results.push({ appId: app.appId, status: 'SUCCESS', details: res });
    } catch (err) {
      console.error(`Failed building '${app.appId}': ${err.message}`);
      results.push({ appId: app.appId, status: 'FAILED', error: err.message });
    }
  }

  console.log(`\n========================================`);
  console.log(`BUILD ALL SUMMARY`);
  console.log(`========================================`);
  results.forEach(r => {
    console.log(`- ${r.appId}: ${r.status}`);
  });
}

buildAll();
