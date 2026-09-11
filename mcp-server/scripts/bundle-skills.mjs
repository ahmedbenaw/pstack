#!/usr/bin/env node
// Bundles pstack's skills/ and agents/ markdown content into a single generated
// TS module the Worker can import statically (Workers can't read the filesystem
// at runtime). Re-run this whenever the source skills/agents change.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pstackRoot = path.resolve(here, "..", "..");
const skillsRoot = path.join(pstackRoot, "skills");
const agentsRoot = path.join(pstackRoot, "agents");
const outFile = path.join(here, "..", "src", "content.generated.ts");

function frontmatterField(text, field) {
  const match = text.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  if (!match) return "";
  const value = match[1].trim();
  // YAML frontmatter values are sometimes quoted (e.g. `description: "..."`)
  // and sometimes not - strip a matching pair of quotes if present so callers
  // always get the plain text, not the literal quote characters.
  const quoted = value.match(/^(["'])(.*)\1$/);
  return quoted ? quoted[2] : value;
}

function readTextFilesRecursive(dir, relativeTo) {
  const out = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(out, readTextFilesRecursive(full, relativeTo));
    } else if (/\.(md|tsv|sh|mjs|ts)$/.test(entry.name)) {
      out[path.relative(relativeTo, full)] = fs.readFileSync(full, "utf8");
    }
  }
  return out;
}

const skills = {};
for (const name of fs.readdirSync(skillsRoot).sort()) {
  const skillDir = path.join(skillsRoot, name);
  if (!fs.statSync(skillDir).isDirectory()) continue;
  const mainFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(mainFile)) continue;
  const mainText = fs.readFileSync(mainFile, "utf8");
  const files = readTextFilesRecursive(skillDir, skillDir);
  skills[name] = {
    description: frontmatterField(mainText, "description"),
    files, // relative path within the skill dir -> content, includes SKILL.md itself
  };
}

const agents = {};
for (const entry of fs.readdirSync(agentsRoot)) {
  if (!entry.endsWith(".md")) continue;
  const name = entry.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(agentsRoot, entry), "utf8");
  agents[name] = {
    description: frontmatterField(text, "description"),
    content: text,
  };
}

const banner = `// GENERATED FILE - do not edit by hand.
// Produced by scripts/bundle-skills.mjs from ../../skills and ../../agents.
// Re-run \`node scripts/bundle-skills.mjs\` after changing pstack's source content.
`;

const body = `export interface SkillBundle {
  description: string;
  files: Record<string, string>;
}
export interface AgentBundle {
  description: string;
  content: string;
}
export const SKILLS: Record<string, SkillBundle> = ${JSON.stringify(skills, null, 2)};
export const AGENTS: Record<string, AgentBundle> = ${JSON.stringify(agents, null, 2)};
`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, banner + body);

const skillCount = Object.keys(skills).length;
const agentCount = Object.keys(agents).length;
const bytes = Buffer.byteLength(banner + body);
console.log(`Bundled ${skillCount} skills, ${agentCount} agents -> ${outFile} (${bytes} bytes)`);
