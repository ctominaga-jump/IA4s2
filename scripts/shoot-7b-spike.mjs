// Screenshots do spike 3D (Fase 7B-spike): cena procedural + fallback estatico.
// Uso: node scripts/shoot-7b-spike.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

const viewports = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 390, height: 844 },
];

const routes = [
  { name: "phase-7b-spike-scene", route: "/preview/scene-3d", wait: 3500 },
  { name: "phase-7b-spike-fallback", route: "/preview/scene-3d?fallback=1", wait: 800 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { name, route, wait } of routes) {
    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      // Rola ate a cena para disparar o mount-on-visible (IntersectionObserver)
      // e da tempo do chunk do three.js baixar e renderizar um frame.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(wait);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      const path = `${outDir}/${name}-${vp.suffix}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`saved ${path} (${vp.width}x${vp.height})`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
