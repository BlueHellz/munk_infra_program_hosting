import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');
const BRANDING_CSS_PATH = path.join(ROOT_DIR, 'branding/branding.css');
const THEME_PATH = path.join(ROOT_DIR, 'branding/theme.json');

export function applyBranding(app, sourceDir, outputDir) {
  console.log(`[ApplyBranding] Applying MUNKEE STUDIO branding patch for '${app.appId}'...`);

  const theme = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
  const brandingCss = fs.readFileSync(BRANDING_CSS_PATH, 'utf8');

  // Copy branding CSS into output
  const outputCssDir = path.join(outputDir, 'css');
  fs.mkdirSync(outputCssDir, { recursive: true });
  fs.writeFileSync(path.join(outputCssDir, 'munkee-branding.css'), brandingCss);

  // Prepare header HTML bar
  const headerHtml = `
  <div class="munkee-studio-header-bar">
    <div class="logo-badge">
      <div class="dot"></div>
      <div class="app-title">MUNKEE STUDIO <span>// ${app.userFacingName.toUpperCase()}</span></div>
    </div>
    <div class="status-tag">VERSION ${app.deployedVersion}</div>
  </div>
  `;

  // Prepare footer legal attribution
  const legalHtml = `
  <div class="munkee-studio-legal-notice">
    Powered by ${app.originalUpstreamName} (${app.license}).
    Retained & delivered under MUNKEE STUDIO Infrastructure.
  </div>
  `;

  // Inject into index.html if it exists
  const indexPath = path.join(sourceDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');

    // Add stylesheet link before </head>
    const styleLink = `<link rel="stylesheet" href="css/munkee-branding.css">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">`;
    if (indexContent.includes('</head>')) {
      indexContent = indexContent.replace('</head>', `${styleLink}\n</head>`);
    }

    // Replace title
    indexContent = indexContent.replace(/<title>.*?<\/title>/i, `<title>MUNKEE STUDIO - ${app.userFacingName}</title>`);

    // Add header after <body>
    if (indexContent.includes('<body')) {
      indexContent = indexContent.replace(/(<body[^>]*>)/i, `$1\n${headerHtml}`);
    }

    // Add legal attribution before </body>
    if (indexContent.includes('</body>')) {
      indexContent = indexContent.replace('</body>', `${legalHtml}\n</body>`);
    }

    fs.writeFileSync(path.join(outputDir, 'index.html'), indexContent);
    console.log(`[ApplyBranding] Injected MUNKEE STUDIO header, CSS, and legal notices into index.html`);
  } else {
    console.warn(`[ApplyBranding] index.html not found in sourceDir ${sourceDir}`);
  }
}
