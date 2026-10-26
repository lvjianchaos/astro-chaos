/**
 * Screenshot the built site with the locally installed Chrome.
 *
 * Usage: node scripts/screenshot.mjs [baseUrl]
 * Serves apps/site/dist over a throwaway static server, captures the home
 * page and every post in both themes, and writes PNGs to .screenshots/.
 */
import { createServer } from "node:http";
import { readFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const dist = resolve(process.cwd(), "dist");
const outDir = resolve(process.cwd(), ".screenshots");
const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".xml": "application/xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

async function serve() {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = join(dist, url);
    if (existsSync(file) && file.endsWith(".html") === false) {
      // directory request
    }
    if (!existsSync(file) || url.endsWith("/")) {
      file = join(dist, url, "index.html");
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": MIME[extname(file)] ?? "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise(r => server.listen(4173, "127.0.0.1", r));
  return server;
}

/** Every HTML page in dist, as routes. */
async function routes() {
  const out = [];
  async function walk(dir, prefix) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        await walk(join(dir, entry.name), `${prefix}/${entry.name}`);
      } else if (entry.name === "index.html") {
        out.push(prefix === "" ? "/" : `${prefix}/`);
      }
    }
  }
  await walk(dist, "");
  return out;
}

/** Playwright's own Chromium if it is installed, else the system Chrome. */
async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    return await chromium.launch({ channel: "chrome" });
  }
}

const server = await serve();
await mkdir(outDir, { recursive: true });

const browser = await launchBrowser();
const pages = await routes();
const targets = process.env.ONLY
  ? pages.filter(p => p.includes(process.env.ONLY))
  : pages;

for (const route of targets) {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    await page.addInitScript(
      ([t]) => localStorage.setItem("theme", t),
      [theme]
    );
    await page.goto(baseUrl + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const name =
      (route === "/" ? "home" : route.replace(/^\//, "").replace(/\/$/, "")) +
      `-${theme}.png`;
    await page.screenshot({
      path: join(outDir, name),
      fullPage: process.env.FULL === "1",
    });
    console.log("saved", name);
    await page.close();
  }
}

await browser.close();
server.close();
console.log("done:", targets.length, "routes");
