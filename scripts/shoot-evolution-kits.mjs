// Screenshots da fase "Evolution Kits": identidades + strip com kits por
// variante + matriz 4x7 + fallback + reduced motion + erro de asset de KIT
// (so o card/celula afetada deve degradar, a pagina vive).
// Uso: node scripts/shoot-evolution-kits.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";
const route = "/preview/avatar-evolution";

await mkdir(outDir, { recursive: true });

/** Rola a pagina para montar os canvases (mount-on-visible) e aguarda frames. */
async function settle(page, ms = 7000) {
  await page.evaluate(async () => {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));
    const total = document.body.scrollHeight;
    for (let y = 0; y <= total; y += Math.round(window.innerHeight * 0.8)) {
      window.scrollTo(0, y);
      await sleep(200);
    }
    window.scrollTo(0, 0);
    await sleep(300);
  });
  await page.waitForTimeout(ms);
}

const browser = await chromium.launch();
try {
  // 1) Pagina completa (identidades + strip aurora + matriz) — desktop/mobile.
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
    const path = `${outDir}/phase-evolution-kits-${vp.suffix}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (${vp.width}x${vp.height})`);
    await page.close();
  }

  // 2) Strip de evolucao por variante (desktop) — kits por fase.
  for (const variant of ["ember", "verdant", "nebula"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${route}?variant=${variant}`, {
      waitUntil: "networkidle",
    });
    await settle(page);
    const path = `${outDir}/phase-evolution-kits-${variant}-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (variant ${variant})`);
    await page.close();
  }

  // 3) Fallback 2D (?fallback=1) — inclui fallback da matriz.
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(`${base}${route}?fallback=1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const path = `${outDir}/phase-evolution-kits-fallback-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (fallback 2D)`);
    await page.close();
  }

  // 4) Reduced motion (rotacao/particulas congeladas, matriz em demand).
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await settle(page, 4000);
    const path = `${outDir}/phase-evolution-kits-reduced-motion-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (reduced motion)`);
    await page.close();
  }

  // 5) Erro de asset de KIT: bloqueia um kit e verifica que a pagina vive e o
  //    avatar continua aparecendo (base + camadas, so o kit some).
  {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(String(err)));
    await page.route("**/assets/3d/avatar-aurora-kit-*.glb", (r) => r.abort());
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await settle(page, 4000);
    const heading = await page
      .locator("h1")
      .first()
      .textContent()
      .catch(() => null);
    const path = `${outDir}/phase-evolution-kits-kit-error-desktop.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`saved ${path} (kit asset error)`);
    console.log(
      `kit-error check: heading=${JSON.stringify(heading)} pageErrors=${pageErrors.length}`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
