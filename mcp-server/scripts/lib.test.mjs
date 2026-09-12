import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { frontmatterField, readTextFilesRecursive } from "./lib.mjs";

// Regression test for a real bug: the first version of frontmatterField kept
// the literal YAML quote characters (e.g. description became `"Sketch types..."`
// with the quotes still in the string), caught by hand-testing the deployed
// MCP server's list_pstack_skills output on 2026-09-11.

test("strips double-quoted YAML values", () => {
  const text = '---\nname: architect\ndescription: "Sketch types before code."\n---\n';
  assert.equal(frontmatterField(text, "description"), "Sketch types before code.");
});

test("strips single-quoted YAML values", () => {
  const text = "---\nname: bro\ndescription: 'Restate plainly.'\n---\n";
  assert.equal(frontmatterField(text, "description"), "Restate plainly.");
});

test("leaves unquoted YAML values untouched", () => {
  const text = "---\nname: tdd\ndescription: Use only when explicitly asked.\n---\n";
  assert.equal(frontmatterField(text, "description"), "Use only when explicitly asked.");
});

test("returns empty string when the field is absent", () => {
  const text = "---\nname: no-description\n---\n";
  assert.equal(frontmatterField(text, "description"), "");
});

test("only strips a matching quote pair, not a stray leading quote", () => {
  const text = '---\ndescription: "unbalanced\n---\n';
  assert.equal(frontmatterField(text, "description"), '"unbalanced');
});

// Regression test for a real bug caught on 2026-09-13: readTextFilesRecursive
// walked every directory under skills/, so running `bun install` in
// skills/poteto-mode/scripts/ (needed to run the watch-pr test suite) swept 37MB
// of node_modules into content.generated.ts and took the bundle from 631KB to
// 8.7MB. node_modules is gitignored, but a plain recursive read does not consult
// .gitignore.

test("the content walk skips dependency and build directories", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pstack-walk-"));
  fs.mkdirSync(path.join(root, "real"), { recursive: true });
  fs.writeFileSync(path.join(root, "real", "SKILL.md"), "# keep me\n");
  for (const skipped of ["node_modules", "dist", ".git"]) {
    fs.mkdirSync(path.join(root, skipped, "nested"), { recursive: true });
    fs.writeFileSync(path.join(root, skipped, "nested", "README.md"), "# drop me\n");
  }

  const found = Object.keys(readTextFilesRecursive(root, root));

  assert.deepEqual(found, [path.join("real", "SKILL.md")]);
  for (const skipped of ["node_modules", "dist", ".git"]) {
    assert.ok(
      !found.some((f) => f.startsWith(skipped)),
      `expected no files from ${skipped}, got ${found.join(", ")}`
    );
  }
  fs.rmSync(root, { recursive: true, force: true });
});
