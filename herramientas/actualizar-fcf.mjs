// =====================================================================
//  Actualiza los datos de la FCF (clasificación y partidos) de cada equipo.
//  Versión para GitHub Actions (Node + Chrome). Equivalente a actualizar-fcf.ps1.
//
//  Lee los grupId de js/data.js (fcfGrupos), abre la API de la FCF con un
//  Chrome real en segundo plano (su protección antibots solo deja pasar a
//  navegadores) y guarda data/fcf/<grupId>.js.
//
//  Uso local (si tienes Node y Chrome):  node herramientas/actualizar-fcf.mjs
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataJs = readFileSync(path.join(root, "js", "data.js"), "utf8");
const TEMP = (dataJs.match(/temporadaId=(\d+)/) || [, "22"])[1];
const grupos = [...new Set([...dataJs.matchAll(/grupId:\s*"(\d+)"/g)].map(m => m[1]))];
if (!grupos.length) { console.log("No hay grupos configurados en js/data.js (fcfGrupos)."); process.exit(0); }

const candidates = [
  process.env.CHROME_PATH,
  "google-chrome", "google-chrome-stable", "chromium-browser", "chromium",
  "/usr/bin/google-chrome", "/opt/hostedtoolcache/chromium/latest/x64/chrome",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
let chrome = null;
for (const c of candidates) {
  try { execFileSync(c, ["--version"], { stdio: "ignore" }); chrome = c; break; } catch {}
}
if (!chrome) { console.error("No se ha encontrado Chrome/Chromium."); process.exit(1); }

function getJson(url) {
  const html = execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run",
    "--virtual-time-budget=20000", "--dump-dom", url,
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
  const m = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
  if (!m) return null;
  const txt = m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();
  if (!/^[\[{]/.test(txt)) return null;
  try { JSON.parse(txt); } catch { return null; }
  return txt;
}

const outDir = path.join(root, "data", "fcf");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const stamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Madrid" }).slice(0, 16);
let ok = 0;
for (const g of grupos) {
  process.stdout.write(`Grupo ${g} ... `);
  const clas = getJson(`https://www.fcf.cat/api/competition/classificacio?grupId=${g}`);
  const gole = getJson(`https://www.fcf.cat/api/competition/goleadores?grupId=${g}&temporada=${TEMP}`) || "[]";
  const sanc = getJson(`https://www.fcf.cat/api/competition/sanciones?grupId=${g}&temporada=${TEMP}`) || "{}";
  const part = getJson(`https://www.fcf.cat/api/competition/partidos?grupId=${g}`);
  if (!clas || !part) { console.log("ERROR (sin datos, se mantiene el archivo anterior)"); continue; }
  const content =
    `/* Datos de la FCF - grupo ${g} - actualizado ${stamp} - generado por herramientas/actualizar-fcf.mjs */\n` +
    `window.FCF = window.FCF || {};\n` +
    `window.FCF["${g}"] = { actualizado: "${stamp}", clasificacion: ${clas}, partidos: ${part} };\n`;
  writeFileSync(path.join(outDir, `${g}.js`), content, "utf8");
  console.log("OK");
  ok++;
}
console.log(`Listo: ${ok}/${grupos.length} grupos actualizados.`);
