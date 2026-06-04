// Screenshots do 7B-final v1: nucleo 3D branded no card do hero da landing.
// Captura com JS ligado (cena 3D) e com JS desligado (fallback estatico Bot).
// Uso: node scripts/shoot-7bfinal.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

const viewports = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 390, height: 844 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  // 1) JS ligado: cena 3D no hero (desktop + mobile).
  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}/`, { waitUntil: "networkidle" });
    // Hero esta no topo: o IntersectionObserver dispara de imediato; aguarda o
    // chunk three.js baixar, compilar e renderizar alguns frames.
    await page.waitForTimeout(4000);
    const path = `${outDir}/phase-7b-final-landing-${vp.suffix}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (3D, ${vp.width}x${vp.height})`);
    await page.close();
  }

  // 2) JS desligado: prova do fallback estatico (Bot) e do noscript de motion.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const fbPath = `${outDir}/phase-7b-final-landing-fallback-desktop.png`;
  await page.screenshot({ path: fbPath, fullPage: true });
  console.log(`saved ${fbPath} (fallback / no-JS)`);
  await ctx.close();
} finally {
  await browser.close();
}
