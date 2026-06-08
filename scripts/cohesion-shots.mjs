import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const OUT = "scripts/.cohesion-shots";
mkdirSync(OUT, { recursive: true });

// Rotas publicas / preview (sem auth) que renderizam os mesmos componentes
// do cockpit e perfil autenticados.
const ROUTES = [
  { name: "landing", path: "/" },
  { name: "cockpit", path: "/preview/cockpit?phase=5" },
  { name: "perfil", path: "/preview/perfil?phase=5" },
  { name: "jornada", path: "/preview/jornada" },
  { name: "avatar-evolution", path: "/preview/avatar-evolution" },
];

const VIEWPORTS = [
  { tag: "desktop", width: 1280, height: 900 },
  { tag: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle" });
    // Rola a pagina inteira em passos para disparar animacoes whileInView
    // (framer-motion) e lazy-mount, depois volta ao topo.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 250));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200); // motion/3D settle
    const file = `${OUT}/${route.name}-${vp.tag}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`shot ${file}`);
  }
  await ctx.close();
}
await browser.close();
console.log("done");
