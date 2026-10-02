import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, "screenshots");
const OUT_PDF = path.join(ROOT, "screenshots", "Skin-Studio-Ithaca-UI-Showcase.pdf");
const HTML_PATH = path.join(ROOT, "screenshots", "_presentation.html");

const pages = [
  { slug: "home", path: "/", title: "Home Page", desc: "Main landing page — hero, services, before & after results, team showcase, testimonials, and booking CTA." },
  { slug: "about", path: "/about", title: "About Page", desc: "Company overview with Skin Studio's story, values, and medical-grade skincare philosophy." },
  { slug: "team", path: "/team", title: "Our Team", desc: "Featured founder section for Natalie Sweeney, team member grid, testimonials, and booking CTA." },
  { slug: "services", path: "/services", title: "Services Overview", desc: "Services index listing all treatments with descriptions and links to detail pages." },
  { slug: "facial-treatments", path: "/services/facial-treatments", title: "Facial Treatments", desc: "Service detail page for facial treatment options, pricing, and booking." },
  { slug: "micro-infusion", path: "/services/micro-infusion-facial", title: "Micro-Infusion Facial", desc: "Micro-Infusion Facial treatment details, procedure info, and results." },
  { slug: "ipl-treatments", path: "/services/ipl-treatments", title: "Photo Facial / IPL", desc: "IPL photo facial service page with benefits and expected results." },
  { slug: "laser-hair-removal", path: "/services/laser-hair-removal", title: "Laser Hair Removal", desc: "Laser hair removal with treatment areas, pricing, and consultation." },
  { slug: "lash-services", path: "/services/lash-services", title: "Lash Services", desc: "Lash lift and tint service page with details, aftercare, and booking." },
  { slug: "offers", path: "/offers", title: "Special Offers", desc: "Current promotions, special offers, and waitlist signup." },
  { slug: "book", path: "/book", title: "Book Appointment", desc: "Booking page with date selection, service picker, and contact form." },
  { slug: "gift-card", path: "/product/gift-card", title: "Gift Certificates", desc: "Multi-step gift card purchase flow — amount, recipient, review, checkout." },
  { slug: "contact", path: "/contact", title: "Contact Us", desc: "Contact information, studio hours, contact form, and location." },
];

function toFileUrl(p) {
  return "file:///" + p.replace(/\\/g, "/");
}

function buildHtml() {
  const desktopDir = toFileUrl(path.join(SHOTS, "desktop"));
  const mobileDir = toFileUrl(path.join(SHOTS, "mobile"));

  let pagesHtml = "";

  pages.forEach((pg, i) => {
    pagesHtml += `
    <!-- ${pg.title} - Desktop -->
    <div class="spread">
      <div class="spread-sidebar">
        <div class="spread-num">${String(i + 1).padStart(2, "0")}</div>
        <h2 class="spread-title">${pg.title}</h2>
        <p class="spread-route">${pg.path}</p>
        <div class="spread-divider"></div>
        <p class="spread-desc">${pg.desc}</p>
        <div class="spread-viewport">
          <span class="viewport-dot desktop-dot"></span>
          Desktop — 1440px
        </div>
      </div>
      <div class="spread-screenshot">
        <div class="browser-chrome">
          <div class="browser-dots"><span></span><span></span><span></span></div>
          <div class="browser-url">localhost:3001${pg.path}</div>
        </div>
        <div class="screenshot-scroll">
          <img src="${desktopDir}/${pg.slug}.png" alt="${pg.title}" />
        </div>
      </div>
    </div>

    <!-- ${pg.title} - Mobile -->
    <div class="spread mobile-spread">
      <div class="spread-sidebar">
        <div class="spread-num">${String(i + 1).padStart(2, "0")}</div>
        <h2 class="spread-title">${pg.title}</h2>
        <p class="spread-route">${pg.path}</p>
        <div class="spread-divider"></div>
        <p class="spread-desc">Responsive mobile layout at 375px viewport width.</p>
        <div class="spread-viewport">
          <span class="viewport-dot mobile-dot"></span>
          Mobile — 375 × 812
        </div>
      </div>
      <div class="spread-screenshot mobile-screenshot-area">
        <div class="mobile-device">
          <div class="mobile-notch"></div>
          <div class="mobile-screen">
            <img src="${mobileDir}/${pg.slug}.png" alt="${pg.title} Mobile" />
          </div>
        </div>
      </div>
    </div>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Skin Studio Ithaca — UI Design Showcase</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600;700&display=swap');

  @page {
    size: A4 landscape;
    margin: 0;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --dark: #1F201D;
    --dark-secondary: #292A26;
    --dark-deep: #181916;
    --ivory: #F4EFE8;
    --muted: #D6D0C8;
    --rose: #C25A83;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Manrope', system-ui, sans-serif;
  }

  body {
    background: var(--dark);
    color: var(--ivory);
    font-family: var(--sans);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ─── Cover ─── */
  .cover {
    width: 297mm;
    height: 210mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(160deg, var(--dark-deep) 0%, var(--dark) 40%, var(--dark-secondary) 100%);
    padding: 40px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }

  .cover::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(194,90,131,0.1), transparent 70%);
    border-radius: 50%;
  }

  .cover-logo {
    font-family: var(--serif);
    font-size: 13px;
    letter-spacing: 0.3em;
    color: var(--muted);
    opacity: 0.6;
    text-transform: uppercase;
    margin-bottom: 36px;
  }

  .cover-title {
    font-family: var(--serif);
    font-size: 56px;
    font-weight: 300;
    line-height: 1.1;
    color: var(--ivory);
    margin-bottom: 12px;
  }

  .cover-title em { font-style: italic; font-weight: 300; }

  .cover-subtitle {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 32px;
  }

  .cover-line {
    width: 50px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--rose), transparent);
    margin-bottom: 28px;
  }

  .cover-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.9;
    max-width: 420px;
  }

  .cover-meta {
    margin-top: 48px;
    display: flex;
    gap: 40px;
  }

  .cover-meta-value {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
  }

  .cover-meta-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.5;
    margin-top: 2px;
  }

  .cover-footer {
    position: absolute;
    bottom: 24px;
    font-size: 10px;
    color: rgba(214,208,200,0.25);
    letter-spacing: 0.1em;
  }

  /* ─── TOC ─── */
  .toc {
    width: 297mm;
    height: 210mm;
    padding: 48px 56px;
    background: var(--dark);
    page-break-after: always;
  }

  .toc-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 16px;
  }

  .toc-heading {
    font-family: var(--serif);
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 28px;
  }

  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 40px;
  }

  .toc-item {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .toc-num {
    font-family: var(--serif);
    font-size: 18px;
    color: var(--rose);
    opacity: 0.4;
    min-width: 24px;
  }

  .toc-name {
    font-size: 13px;
    font-weight: 500;
    flex: 1;
  }

  .toc-route {
    font-size: 10px;
    color: var(--muted);
    opacity: 0.35;
    font-family: 'Courier New', monospace;
  }

  /* ─── Spread (Desktop + Mobile) ─── */
  .spread {
    width: 297mm;
    height: 210mm;
    display: flex;
    background: var(--dark-secondary);
    page-break-after: always;
    overflow: hidden;
  }

  .spread-sidebar {
    width: 220px;
    flex-shrink: 0;
    padding: 36px 28px;
    background: var(--dark);
    display: flex;
    flex-direction: column;
  }

  .spread-num {
    font-family: var(--serif);
    font-size: 48px;
    font-weight: 300;
    color: var(--rose);
    opacity: 0.15;
    line-height: 1;
    margin-bottom: 12px;
  }

  .spread-title {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 400;
    color: var(--ivory);
    margin-bottom: 6px;
  }

  .spread-route {
    font-size: 10px;
    font-family: 'Courier New', monospace;
    color: var(--muted);
    opacity: 0.4;
    margin-bottom: 16px;
  }

  .spread-divider {
    width: 28px;
    height: 1px;
    background: var(--rose);
    opacity: 0.4;
    margin-bottom: 16px;
  }

  .spread-desc {
    font-size: 11px;
    color: var(--muted);
    opacity: 0.7;
    line-height: 1.7;
    flex: 1;
  }

  .spread-viewport {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.4;
  }

  .viewport-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .desktop-dot { background: #4CAF50; }
  .mobile-dot { background: #2196F3; }

  /* Browser chrome */
  .spread-screenshot {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 24px 20px 0;
    min-width: 0;
  }

  .browser-chrome {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #151613;
    border-radius: 8px 8px 0 0;
    padding: 8px 14px;
    flex-shrink: 0;
  }

  .browser-dots {
    display: flex;
    gap: 5px;
  }

  .browser-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }

  .browser-dots span:first-child { background: #ff5f57; }
  .browser-dots span:nth-child(2) { background: #febc2e; }
  .browser-dots span:nth-child(3) { background: #28c840; }

  .browser-url {
    font-size: 10px;
    font-family: 'Courier New', monospace;
    color: var(--muted);
    opacity: 0.4;
    background: rgba(255,255,255,0.03);
    border-radius: 4px;
    padding: 3px 10px;
  }

  .screenshot-scroll {
    flex: 1;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: var(--dark-deep);
  }

  .screenshot-scroll img {
    width: 100%;
    display: block;
  }

  /* Mobile layout */
  .mobile-screenshot-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px 20px 0;
  }

  .mobile-device {
    width: 200px;
    background: #0a0a09;
    border-radius: 28px;
    padding: 8px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06);
  }

  .mobile-notch {
    width: 80px;
    height: 16px;
    margin: 0 auto 4px;
    background: #0a0a09;
    border-radius: 0 0 12px 12px;
    position: relative;
    z-index: 1;
  }

  .mobile-screen {
    border-radius: 20px;
    overflow: hidden;
    background: var(--dark-deep);
    max-height: 540px;
  }

  .mobile-screen img {
    width: 100%;
    display: block;
  }

  /* ─── End ─── */
  .end-page {
    width: 297mm;
    height: 210mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(160deg, var(--dark-deep) 0%, var(--dark) 100%);
    page-break-after: always;
  }

  .end-logo {
    font-family: var(--serif);
    font-size: 40px;
    letter-spacing: 0.15em;
  }

  .end-tagline {
    font-family: var(--serif);
    font-style: italic;
    font-size: 16px;
    color: var(--muted);
    opacity: 0.5;
    margin: 8px 0 36px;
  }

  .end-info {
    font-size: 11px;
    color: var(--muted);
    opacity: 0.35;
    line-height: 2;
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-logo">Skin Studio Ithaca</div>
  <h1 class="cover-title">Website <em>Redesign</em></h1>
  <p class="cover-subtitle">UI Design Showcase</p>
  <div class="cover-line"></div>
  <p class="cover-desc">
    A complete visual presentation of the redesigned Skin Studio Ithaca website.
    Medical-grade skincare meets luxury design — crafted for trust, clarity, and conversion.
  </p>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="cover-meta-value">13</div>
      <div class="cover-meta-label">Pages</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-value">5</div>
      <div class="cover-meta-label">Service Pages</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-value">26</div>
      <div class="cover-meta-label">Screenshots</div>
    </div>
  </div>
  <div class="cover-footer">Prepared September 2026</div>
</div>

<!-- TOC -->
<div class="toc">
  <div class="toc-label">Table of Contents</div>
  <h2 class="toc-heading">Pages</h2>
  <div class="toc-grid">
    ${pages.map((pg, i) => `
    <div class="toc-item">
      <span class="toc-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="toc-name">${pg.title}</span>
      <span class="toc-route">${pg.path}</span>
    </div>`).join("")}
  </div>
</div>

${pagesHtml}

<!-- End -->
<div class="end-page">
  <div class="end-logo">SKIN STUDIO</div>
  <div class="end-tagline">Serious skincare. Serious results.</div>
  <div class="end-info">
    903 Hanshaw Rd, Suite 104 · Ithaca, NY 14850<br>
    607-262-8566<br><br>
    Website Redesign UI Showcase · © 2026
  </div>
</div>

</body>
</html>`;
}

async function generatePdf() {
  console.log("Building HTML presentation...");
  const html = buildHtml();
  fs.writeFileSync(HTML_PATH, html, "utf-8");

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(toFileUrl(HTML_PATH), { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Generating PDF...");
  await page.pdf({
    path: OUT_PDF,
    width: "297mm",
    height: "210mm",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();

  const size = fs.statSync(OUT_PDF).size;
  console.log(`PDF: ${OUT_PDF}`);
  console.log(`Size: ${(size / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`Pages: ~${2 + pages.length * 2 + 1} (cover + TOC + ${pages.length} desktop + ${pages.length} mobile + end)`);
}

generatePdf().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
