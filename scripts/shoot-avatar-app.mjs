// Screenshots da fase "EvolvingAvatar no app" (cockpit/perfil do aluno):
// usa as rotas de preview com fixture (sem auth/banco) que renderizam os
// MESMOS componentes das rotas vivas (/aluno e /aluno/perfil).
// Cenarios: 4 variantes, fase boss, fallback 2D, erro de asset, reduced motion
// + sanity do /preview/avatar-evolution.
// Uso: node scripts/shoot-avatar-app.mjs [baseUrl]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "docs/product-evolution/visual-reviews";

await mkdir(outDir, { recursive: true });

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

async function shot(browser, { route, file, vp, reduced, blockGlob, note }) {
  const page = await browser.newPage({
    viewport: vp ?? { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ...(reduced ? { reducedMotion: "reduce" } : {}),
  });
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  if (blockGlob) await page.route(blockGlob, (r) => r.abort());
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await settle(page);
  const path = `${outDir}/${file}`;
  await page.screenshot({ path, fullPage: true });
  console.log(
    `saved ${path}${note ? ` (${note})` : ""}${blockGlob ? ` pageErrors=${pageErrors.length}` : ""}`,
  );
  await page.close();
}

const browser = await chromium.launch();
try {
  // 1) Cockpit: desktop + mobile (Aurora, fase 3 = kit criador).
  await shot(browser, {
    route: "/preview/cockpit",
    file: "phase-app-avatar-cockpit-desktop.png",
    note: "cockpit aurora 3D",
  });
  await shot(browser, {
    route: "/preview/cockpit",
    file: "phase-app-avatar-cockpit-mobile.png",
    vp: { width: 390, height: 844 },
    note: "cockpit aurora mobile",
  });

  // 2) Cockpit: demais variantes (desktop).
  for (const v of ["ember", "verdant", "nebula"]) {
    await shot(browser, {
      route: `/preview/cockpit?variant=${v}`,
      file: `phase-app-avatar-cockpit-${v}-desktop.png`,
      note: `cockpit ${v}`,
    });
  }

  // 3) Cockpit: fase Boss Final (kit boss + coroa do kit).
  await shot(browser, {
    route: "/preview/cockpit?phase=6",
    file: "phase-app-avatar-cockpit-boss-desktop.png",
    note: "cockpit boss final",
  });

  // 4) Cockpit: fallback 2D forcado (gate desligado).
  await shot(browser, {
    route: "/preview/cockpit?fallback=1",
    file: "phase-app-avatar-cockpit-fallback-desktop.png",
    note: "cockpit fallback 2D",
  });

  // 5) Cockpit: erro de asset (base GLB bloqueado) -> card cai para 2D,
  //    pagina vive.
  await shot(browser, {
    route: "/preview/cockpit",
    file: "phase-app-avatar-cockpit-asset-error-desktop.png",
    blockGlob: "**/assets/3d/avatar-aurora.glb",
    note: "cockpit erro de GLB base",
  });

  // 6) Cockpit: reduced motion.
  await shot(browser, {
    route: "/preview/cockpit",
    file: "phase-app-avatar-cockpit-reduced-motion-desktop.png",
    reduced: true,
    note: "cockpit reduced motion",
  });

  // 7) Perfil: desktop + mobile (Aurora) + uma variante.
  await shot(browser, {
    route: "/preview/perfil",
    file: "phase-app-avatar-perfil-desktop.png",
    note: "perfil aurora 3D",
  });
  await shot(browser, {
    route: "/preview/perfil",
    file: "phase-app-avatar-perfil-mobile.png",
    vp: { width: 390, height: 844 },
    note: "perfil aurora mobile",
  });
  await shot(browser, {
    route: "/preview/perfil?variant=nebula",
    file: "phase-app-avatar-perfil-nebula-desktop.png",
    note: "perfil nebula",
  });

  // 8) Sanity: preview de evolucao continua integro.
  await shot(browser, {
    route: "/preview/avatar-evolution",
    file: "phase-app-avatar-evolution-sanity-desktop.png",
    note: "sanity preview evolucao",
  });
} finally {
  await browser.close();
}
