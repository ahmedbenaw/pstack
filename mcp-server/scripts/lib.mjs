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
