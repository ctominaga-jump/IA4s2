// Captura screenshots de validacao visual do cockpit do aluno.
// Uso: node scripts/shoot-cockpit.mjs [baseUrl]
// Requer o app rodando (npm run dev) e Playwright/Chromium instalados.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = "docs/product-evolution/visual-reviews";

const shots = [
  { name: "phase-2.1-cockpit-desktop", route: "/preview/cockpit", width: 1440, height: 900 },
  { name: "phase-2.1-cockpit-mobile", route: "/preview/cockpit", width: 390, height: 844 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${shot.route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const path = `${outDir}/${shot.name}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (${shot.width}x${shot.height})`);
    await page.close();
  }
} finally {
  await browser.close();
}
