/**
 * 清空本地可再生产物。
 *
 * Usage: pnpm clean
 *
 * 只删“随时可以重建”的东西：截图缓存、构建产物、Astro 生成的类型。
 * 不会碰 .memory/（记忆）、docs/（文档）、.sage-cache/（图表缓存，已入库）。
 */
import { rm, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  ".cache", // 截图等一次性产物
  "apps/site/dist", // 构建产物
  "apps/site/.astro", // Astro 生成的类型
  "apps/site/node_modules/.astro", // 内容集合类型缓存
];

let removed = 0;
for (const target of targets) {
  const path = join(repoRoot, target);
  try {
    await stat(path);
  } catch {
    continue;
  }
  await rm(path, { recursive: true, force: true });
  console.log("removed", target);
  removed += 1;
}

console.log(removed ? `done: ${removed} 个目录已清空` : "done: 没有需要清理的目录");
