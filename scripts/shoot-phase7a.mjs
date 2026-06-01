// Captura screenshots de validacao visual da Fase 7A (Motion).
// Uso: node scripts/shoot-phase7a.mjs [baseUrl]
// Requer o app rodando e Playwright/Chromium instalados.
// Faz scroll ate o fim (dispara animacoes whileInView, que sao `once`) e
// volta ao topo antes do screenshot, garantindo o estado final assentado.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

const viewports = [
  { suffix: "desktop", width: 1440, height: 900 },
  { suffix: "mobile", width: 390, height: 844 },
];

const routes = [
  { name: "phase-7a-landing", route: "/" },
  { name: "phase-7a-cockpit", route: "/preview/cockpit" },
  { name: "phase-7a-jornada", route: "/preview/jornada" },
  { name: "phase-7a-levelup", route: "/preview/levelup" },
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
      // Dispara animacoes de entrada (whileInView once) percorrendo a pagina.
      await page.evaluate(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const total = document.body.scrollHeight;
        for (let y = 0; y <= total; y += Math.round(window.innerHeight * 0.8)) {
          window.scrollTo(0, y);
          await sleep(120);
        }
        window.scrollTo(0, total);
        await sleep(300);
        window.scrollTo(0, 0);
        await sleep(300);
      });
      await page.waitForTimeout(900);
      const path = `${outDir}/${name}-${vp.suffix}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`saved ${path} (${vp.width}x${vp.height})`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
