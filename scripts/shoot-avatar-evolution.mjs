// Screenshots da evolucao de avatar (infra 3D real): 7 estados procedurais + fallback.
// Uso: node scripts/shoot-avatar-evolution.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  // 3D procedural — desktop + mobile.
  for (const vp of [
    { suffix: "desktop", width: 1440, height: 900 },
    { suffix: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}/preview/avatar-evolution`, { waitUntil: "networkidle" });
    // Rola para disparar o mount-on-visible dos cards e aguarda o chunk three +
    // os 7 canvases renderizarem alguns frames.
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const total = document.body.scrollHeight;
      for (let y = 0; y <= total; y += Math.round(window.innerHeight * 0.8)) {
        window.scrollTo(0, y);
        await sleep(150);
      }
      window.scrollTo(0, 0);
      await sleep(300);
    });
    await page.waitForTimeout(4500);
    const path = `${outDir}/phase-avatar-evolution-${vp.suffix}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (3D ${vp.width}x${vp.height})`);
    await page.close();
  }

  // Fallback 2D (?fallback=1) — desktop.
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${base}/preview/avatar-evolution?fallback=1`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(800);
  const fbPath = `${outDir}/phase-avatar-evolution-fallback-desktop.png`;
  await page.screenshot({ path: fbPath, fullPage: true });
  console.log(`saved ${fbPath} (fallback 2D)`);
  await page.close();
} finally {
  await browser.close();
}
