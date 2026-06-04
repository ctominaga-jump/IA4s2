// Screenshots da evolucao de avatar com o GLB real do Agente Aurora plugado
// (modelUrl=/assets/3d/avatar-aurora.glb): 7 estados hibridos + fallback 2D.
// Uso: node scripts/shoot-avatar-aurora.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  // 3D hibrido (GLB + camadas procedurais) — desktop + mobile.
  for (const vp of [
    { suffix: "desktop", width: 1440, height: 900 },
    { suffix: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}/preview/avatar-evolution`, { waitUntil: "networkidle" });
    // Rola para disparar o mount-on-visible dos cards e aguarda o chunk three,
    // o download do GLB e alguns frames dos 7 canvases.
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
    await page.waitForTimeout(6000);
    const path = `${outDir}/phase-avatar-aurora-glb-${vp.suffix}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (3D ${vp.width}x${vp.height})`);
    await page.close();
  }

  // Fallback 2D (?fallback=1) — desktop, precisa continuar intacto.
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${base}/preview/avatar-evolution?fallback=1`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(800);
  const fbPath = `${outDir}/phase-avatar-aurora-glb-fallback-desktop.png`;
  await page.screenshot({ path: fbPath, fullPage: true });
  console.log(`saved ${fbPath} (fallback 2D)`);
  await page.close();
} finally {
  await browser.close();
}
