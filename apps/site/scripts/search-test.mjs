import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const dist = resolve("dist");
const MIME = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".woff2":"font/woff2", ".svg":"image/svg+xml", ".png":"image/png", ".json":"application/json" };
const server = createServer(async (req,res)=>{
  const url = decodeURIComponent((req.url??"/").split("?")[0]);
  let file = join(dist,url);
  if (!existsSync(file) || url.endsWith("/")) file = join(dist,url,"index.html");
  try { const b = await readFile(file); res.writeHead(200,{"Content-Type":MIME[extname(file)]??"application/octet-stream"}); res.end(b); }
  catch { res.writeHead(404).end("nf"); }
});
await new Promise(r=>server.listen(4174,"127.0.0.1",r));

let browser;
try { browser = await chromium.launch(); } catch { browser = await chromium.launch({channel:"chrome"}); }
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4174/search/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
for (const q of ["单调栈","过河卒","负环","SPFA"]) {
  const input = await page.$("input[type=search], .pagefind-ui__search-input");
  if (!input) { console.log("no search input found"); break; }
  await input.fill(q);
  await page.waitForTimeout(1200);
  const count = await page.evaluate(() => document.querySelectorAll(".pagefind-ui__result, [data-pagefind-result]").length);
  const links = await page.evaluate(() => [...document.querySelectorAll("a.pagefind-ui__result-link, .pagefind-ui__result a")].map(a=>a.getAttribute("href")).slice(0,3));
  console.log(q, "→", count, "hit(s)", links.join(", "));
}
await browser.close();
server.close();
