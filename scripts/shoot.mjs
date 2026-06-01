// Captura screenshots de validacao visual das telas em preview.
// Uso: node scripts/shoot.mjs [baseUrl]
// Requer o app rodando (npm run dev) e Playwright/Chromium instalados.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = "docs/product-evolution/visual-reviews";

const viewports = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 390, height: 844 },
];

const routes = [
  { name: "phase-2.1-cockpit", route: "/preview/cockpit" },
  { name: "phase-3-jornada", route: "/preview/jornada" },
  { name: "phase-4-perfil", route: "/preview/perfil" },
  { name: "phase-4-levelup", route: "/preview/levelup" },
  { name: "phase-5-jornada-completa", route: "/preview/jornada" },
  { name: "phase-6-boss-final", route: "/preview/boss-final" },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { name, route } of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const path = `${outDir}/${name}-${vp.suffix}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`saved ${path} (${vp.width}x${vp.height})`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
