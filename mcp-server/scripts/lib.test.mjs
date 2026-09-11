import { test } from "node:test";
import assert from "node:assert/strict";
import { frontmatterField } from "./lib.mjs";

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
