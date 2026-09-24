// =====================================================================
//  Actualiza la lista de publicaciones de Instagram (data/instagram.js)
//  ---------------------------------------------------------------------
//  Abre con Chrome el embed público del perfil (instagram.com/<usuario>/embed/),
//  saca los identificadores de las últimas publicaciones y genera la lista
//  de enlaces que la web muestra en la cuadrícula (fotos enteras, formato 4:5).
//  Si hay posts escritos a mano en js/data.js (instagramPosts), tienen prioridad.
//
//  Uso local:  node herramientas/actualizar-instagram.mjs
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataJs = readFileSync(path.join(root, "js", "data.js"), "utf8");
const profile = (dataJs.match(/instagramPerfil:\s*"([^"]+)"/) || [, "fenix_fs"])[1];
const max = Number((dataJs.match(/instagramMax:\s*(\d+)/) || [, 6])[1]) || 6;

const candidates = [
  process.env.CHROME_PATH, "google-chrome", "google-chrome-stable", "chromium-browser", "chromium",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
].filter(Boolean);
let chrome = null;
for (const c of candidates) { try { execFileSync(c, ["--version"], { stdio: "ignore" }); chrome = c; break; } catch {} }
if (!chrome) { console.error("No se ha encontrado Chrome/Chromium."); process.exit(1); }

const html = execFileSync(chrome, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--window-size=760,900",
  "--virtual-time-budget=25000", "--dump-dom", `https://www.instagram.com/${profile}/embed/`,
], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });

/* Cada miniatura lleva ig_cache_key=<base64 del id del post>. El id se convierte al código corto de la URL. */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const toShortcode = (id) => { let n = BigInt(id), s = ""; while (n > 0n) { s = ALPHA[Number(n % 64n)] + s; n /= 64n; } return s; };
const seen = new Set(); const links = [];
for (const m of html.matchAll(/ig_cache_key=([A-Za-z0-9%]+)/g)) {
  let id;
  try { id = Buffer.from(decodeURIComponent(m[1]), "base64").toString("ascii").replace(/\..*$/, ""); } catch { continue; }
  if (!/^\d{10,19}$/.test(id) || seen.has(id)) continue;   // ids más largos son la foto de perfil, no posts
  seen.add(id);
  links.push(`https://www.instagram.com/p/${toShortcode(id)}/`);
  if (links.length >= max) break;
}
if (!links.length) { console.error("No se han encontrado publicaciones; se mantiene la lista anterior."); process.exit(0); }

const outDir = path.join(root, "data");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
/* Completar hasta 'max' con las publicaciones que ya teníamos (las más antiguas siguen siendo válidas) */
const prevFile = path.join(outDir, "instagram.js");
if (existsSync(prevFile)) {
  const prev = [...readFileSync(prevFile, "utf8").matchAll(/"(https:\/\/www\.instagram\.com\/p\/[\w-]+\/)"/g)].map(m => m[1]);
  for (const u of prev) { if (links.length >= max) break; if (!links.includes(u)) links.push(u); }
}
const stamp = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Madrid" }).slice(0, 16);
const content =
  `/* Últimas publicaciones de @${profile} - actualizado ${stamp} - generado por herramientas/actualizar-instagram.mjs */\n` +
  `window.INSTAGRAM_POSTS = ${JSON.stringify(links, null, 2)};\n`;
writeFileSync(path.join(outDir, "instagram.js"), content, "utf8");
console.log(`Listo: ${links.length} publicaciones de @${profile}.`);
links.forEach(l => console.log("  " + l));
