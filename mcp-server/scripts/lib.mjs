import fs from "node:fs";
import path from "node:path";

// Directories that never hold pstack content but can appear under skills/ once
// anyone runs an install in a skill's own scripts dir. Without this, a single
// `bun install` under skills/poteto-mode/scripts/ swept 37MB of node_modules
// into the generated bundle (631KB -> 8.7MB). .gitignore keeps them out of git;
// it does not keep them out of a plain recursive read.
export const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
]);

export function readTextFilesRecursive(dir, relativeTo) {
  const out = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(out, readTextFilesRecursive(full, relativeTo));
    } else if (/\.(md|tsv|sh|mjs|ts)$/.test(entry.name)) {
      out[path.relative(relativeTo, full)] = fs.readFileSync(full, "utf8");
    }
  }
  return out;
}

// Pure helpers for bundle-skills.mjs, split out so they're unit-testable
// without touching the filesystem.

export function frontmatterField(text, field) {
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  // YAML frontmatter values are sometimes quoted (e.g. `description: "..."`)
  // and sometimes not - strip a matching pair of quotes if present so callers
  // always get the plain text, not the literal quote characters.
  const quoted = value.match(/^(["'])(.*)\1$/);
  return quoted ? quoted[2] : value;
}
