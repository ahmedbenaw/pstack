### Authoring or modifying a skill

**You own the skill's voice.**

1. Author the `SKILL.md` directly: YAML frontmatter with `name` (kebab-case, matching the directory) and a `description` that names the trigger phrases someone would actually type, then the body. Without frontmatter the skill never registers. On Cursor, the built-in `create-skill` does this in one pass; this port does not ship an equivalent, so write it yourself and check the frontmatter loads before moving on.
2. Validate the skill: frontmatter has `name` and `description`, referenced files exist, cross-skill links resolve.
3. Test cases if structural. Skip if subjective.
4. Run **Opening a PR**.

When in doubt, delete. Keep only prose that changes a decision. Tell it to do the thing and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (types, READMEs, config) per the **encode-lessons-in-structure** principle skill. Delegate to other skills by path. Don't restate. A workflow you keep hitting but isn't captured → propose a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.
