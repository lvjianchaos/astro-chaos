/**
 * 项目记忆体检。
 *
 * Usage: pnpm memory:check
 *
 * 检查 .memory/ 里的记忆文件是否还在健康范围：
 *   1. frontmatter 必须有 name / description / type
 *   2. 单文件超过 4KB → 该拆或精简
 *   3. 文件数超过 12 个 → 该合并
 *   4. [[wiki 链接]]必须指向真实存在的文件
 *   5. 两条记忆的描述高度相似 → 可能该合并成一个
 *   6. 超过 180 天没动过 → 建议复核是否已过时
 *
 * 规则见 AGENTS.md「记忆维护」一节。只报告，不自动改写。
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const memoryDir = join(repoRoot, ".memory");

const MAX_FILE_BYTES = 4 * 1024;
const MAX_FILES = 12;
const STALE_DAYS = 180;

const problems = [];
const warnings = [];
const notes = [];

async function main() {
  let entries;
  try {
    entries = await readdir(memoryDir, { withFileTypes: true });
  } catch {
    console.log("没有 .memory/ 目录，跳过。");
    return;
  }
  const files = entries.filter(e => e.isFile() && e.name.endsWith(".md"));
  if (!files.length) {
    console.log(".memory/ 是空的，跳过。");
    return;
  }

  const docs = [];
  for (const entry of files) {
    const path = join(memoryDir, entry.name);
    const raw = await readFile(path, "utf8");
    const info = await stat(path);
    const name = entry.name.replace(/\.md$/, "");
    const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
    const meta = {};
    if (front) {
      for (const line of front[1].split(/\r?\n/)) {
        const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
        if (m) meta[m[1]] = m[2].trim();
      }
    } else {
      problems.push(`${entry.name}：缺少 frontmatter`);
    }
    for (const key of ["name", "description", "type"]) {
      if (!meta[key]) problems.push(`${entry.name}：frontmatter 缺少 ${key}`);
    }
    if (info.size > MAX_FILE_BYTES) {
      warnings.push(
        `${entry.name}：${(info.size / 1024).toFixed(1)}KB，超过 4KB —— 该拆成几个文件或精简`
      );
    }
    const days = Math.floor((Date.now() - info.mtimeMs) / 86400000);
    if (days > STALE_DAYS) {
      notes.push(`${entry.name}：${days} 天没更新了，顺手复核一下结论是否还成立`);
    }
    docs.push({ name, meta, raw, description: meta.description ?? "" });
  }

  if (docs.length > MAX_FILES) {
    warnings.push(
      `记忆文件有 ${docs.length} 个，超过 ${MAX_FILES} 个 —— 该合并同话题的条目了`
    );
  }

  // wiki 链接
  const known = new Set(docs.map(d => d.name));
  for (const doc of docs) {
    for (const m of doc.raw.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
      const target = m[1].trim();
      if (!known.has(target)) {
        problems.push(`${doc.name}.md：[[${target}]] 指向不存在的记忆文件`);
      }
    }
  }

  // 描述相似度（Jaccard）
  const tokens = s => new Set((s.toLowerCase().match(/[a-z0-9]+|[\u4e00-\u9fff]/g) ?? []));
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = tokens(docs[i].description);
      const b = tokens(docs[j].description);
      if (!a.size || !b.size) continue;
      const inter = [...a].filter(x => b.has(x)).length;
      const score = inter / (a.size + b.size - inter);
      if (score >= 0.6) {
        warnings.push(
          `${docs[i].name}.md 与 ${docs[j].name}.md 的描述相似度 ${(score * 100).toFixed(0)}% —— 可能该合并成一个文件`
        );
      }
    }
  }

  for (const p of problems) console.log("✗", p);
  for (const w of warnings) console.log("⚠", w);
  for (const n of notes) console.log("·", n);

  console.log(
    `\n${docs.length} 个记忆文件 · ${problems.length} 个问题 · ${warnings.length} 个提醒` +
      (problems.length ? "（有问题，退出码 1）" : "（没问题）")
  );
  if (problems.length) process.exitCode = 1;
}

await main();
