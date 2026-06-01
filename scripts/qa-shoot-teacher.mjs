// QA visual das telas do professor (login real). Uso:
//   node scripts/qa-shoot-teacher.mjs <baseUrl> <projectId>
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const projectId = process.argv[3];
const outDir = "docs/product-evolution/visual-reviews";
const EMAIL = "qa.professor.boss@example.com";
const PASSWORD = "QaProfessor!2026";

const viewports = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 390, height: 844 },
];

const targets = [
  { name: "phase-6-prof-fila", path: "/professor/boss-final" },
  { name: "phase-6-prof-avaliar", path: `/professor/boss-final/${projectId}` },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

try {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Login como professor.
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await Promise.all([
      page.waitForURL("**/professor**", { timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);

    for (const t of targets) {
      await page.goto(`${base}${t.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const path = `${outDir}/${t.name}-${vp.suffix}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`saved ${path} (${vp.width}x${vp.height})`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
