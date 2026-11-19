import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry/applications.json');

function generateAuditReport() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  console.log(`\n============================================================`);
  console.log(`MUNKEE STUDIO - APPLICATION SOURCE & LICENSE AUDIT SUMMARY`);
  console.log(`Total Applications Audited: ${registry.applications.length}`);
  console.log(`============================================================\n`);

  registry.applications.forEach((app, idx) => {
    console.log(`${idx + 1}. ${app.userFacingName} [App ID: ${app.appId}]`);
    console.log(`   Category:             ${app.studioCategory.toUpperCase()}`);
    console.log(`   Upstream Name:        ${app.originalUpstreamName}`);
    console.log(`   Upstream Repo:        ${app.upstreamRepository}`);
    console.log(`   Pinned Version:       ${app.pinnedSourceVersion}`);
    console.log(`   License:              ${app.license}`);
    console.log(`   Browser Status:       ${app.browserCompatibilityStatus}`);
    console.log(`   Build Status:         ${app.buildStatus}`);
    console.log(`   Browser Capabilities: ${app.requiredBrowserCapabilities.join(', ')}`);
    console.log(`   Legal Notice:         ${app.legalNoticeLocation}`);
    console.log(`------------------------------------------------------------`);
  });
}

generateAuditReport();
