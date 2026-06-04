// Screenshots da fase "avatares 3D reais por variante":
// identidades (4 GLBs) + evolucao procedural + fallback + reduced motion + erro de asset.
// Uso: node scripts/shoot-avatar-variants.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";
const route = "/preview/avatar-evolution";

await mkdir(outDir, { recursive: true });

/** Rola a pagina para montar os canvases (mount-on-visible) e aguarda frames. */
async function settle(page, ms = 6000) {
  await page.evaluate(async () => {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));
    const total = document.body.scrollHeight;
    for (let y = 0; y <= total; y += Math.round(window.innerHeight * 0.8)) {
      window.scrollTo(0, y);
      await sleep(150);
    }
    window.scrollTo(0, 0);
    await sleep(300);
  });
  await page.waitForTimeout(ms);
}

const browser = await chromium.launch();
try {
  // 1) Identidades + strip Aurora — desktop e mobile.
  for (const vp of [
    { suffix: "desktop", width: 1440, height: 900 },
    { suffix: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await settle(page);
    const path = `${outDir}/phase-avatar-variants-${vp.suffix}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (${vp.width}x${vp.height})`);
    await page.close();
  }

  // 2) Strip de evolucao por variante (desktop) — valida GLB + camadas + coroa.
  for (const variant of ["ember", "verdant", "nebula"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${route}?variant=${variant}`, {
      waitUntil: "networkidle",
    });
    await settle(page);
    const path = `${outDir}/phase-avatar-variants-${variant}-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (variant ${variant})`);
    await page.close();
  }

  // 3) Fallback 2D (?fallback=1).
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${route}?fallback=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const path = `${outDir}/phase-avatar-variants-fallback-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (fallback 2D)`);
    await page.close();
  }

  // 4) Reduced motion (anima/frameloop congelados).
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await settle(page, 4000);
    const path = `${outDir}/phase-avatar-variants-reduced-motion-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (reduced motion)`);
    await page.close();
  }

  // 5) Erro de asset: bloqueia o GLB da Brasa e verifica que a pagina vive.
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    await page.route("**/assets/3d/avatar-brasa.glb", (r) => r.abort());
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await settle(page, 4000);
    const heading = await page
      .locator("h1")
      .first()
      .textContent()
      .catch(() => null);
    const path = `${outDir}/phase-avatar-variants-asset-error-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (asset error)`);
    console.log(
      `asset-error check: heading=${JSON.stringify(heading)} pageErrors=${pageErrors.length}`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
