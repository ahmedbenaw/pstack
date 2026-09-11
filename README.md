# pstack (Claude Code port)

This is a Claude-Code port of [`pstack`](https://github.com/cursor/plugins/tree/main/pstack), a plugin originally built for [Cursor](https://cursor.com) by [Lauren Tan](https://x.com/poteto). It is MIT licensed (see `LICENSE`); the copyright and license are unchanged from upstream.

pstack is a set of rigorous engineering-workflow skills — `poteto-mode`'s playbooks, the twenty-three principle skills, review and investigation skills (`how`, `why`, `interrogate`, `architect`, `arena`, `swarm`, ...), and the `poteto-agent` / `Comment Sicko` subagents. See `docs/guide/README.md` for the full getting-started guide (also ported from upstream) and the top-level skill/agent files for what each one does.

## Provenance and what changed from upstream

This port keeps the methodology, playbooks, and principles content verbatim — that's the valuable part. What changed is the plugin-runtime plumbing that's specific to Cursor:

- **`.cursor-plugin/plugin.json` → `.claude-plugin/plugin.json`**, rewritten to Claude Code's flat plugin manifest shape (`name`, `version`, `description`, `author`, `homepage`).
- **SKILL.md frontmatter cleanup.** Every `SKILL.md` (skills, references, benny automations) kept only `name` and `description`, which is what Claude Code's skill loader reads. Cursor-runtime-only fields were dropped: `disable-model-invocation`, `icon`, `color`, `paths`. Two fields carried operational meaning worth keeping, so instead of silently dropping them they were folded into a short prose note in the skill body:
  - `poteto-mode`'s `mode: true` (Cursor's "sticky mode") and its `reminder` field — noted in `skills/poteto-mode/SKILL.md`.
  - `typescript-best-practices`'s `paths: ["**/*.ts", "**/*.tsx"]` auto-attach glob — noted in `skills/typescript-best-practices/SKILL.md`.
- **Agent frontmatter cleanup.** `agents/poteto-agent.md` and `agents/comment-sicko.md` keep `name`/`description`. `poteto-agent`'s `is_background: true` has no Claude Code frontmatter equivalent (backgrounding is a dispatch-time choice, not a per-agent declaration), so it was dropped and replaced with a one-line note in the agent body instead.
- **Cursor tool name.** `AskQuestion` (Cursor's structured-question tool) was renamed to Claude Code's `AskUserQuestion` everywhere it's referenced in prose (`poteto-mode`, `automate-me`, `setup-pstack` skills, and the `autonomous-run` playbook).
- **`cursor-team-kit` dependencies left visible, not faked.** A few skills and playbooks call out to `deslop`, `control-cli`, and `control-ui`, which ship in a separate Cursor plugin called `cursor-team-kit` that is not part of this port. Rather than fabricate a Claude Code equivalent, every reference to those skills now carries an inline note that they're from the un-vendored `cursor-team-kit` plugin, with a plain-words fallback where the original text already suggested one. Affected files: `skills/poteto-mode/SKILL.md`, `skills/poteto-mode/playbooks/{opening-a-pr,multi-phase-plan,autopilot-full,autopilot-stack,orchestrate,shipping}.md`, and `docs/guide/05-build-and-clean.md`.
- Everything else — the `automations/benny` dormant bug-triage pack, `docs/guide/**`, `assets/logo.png`, all playbooks, references, and scripts — was copied over unchanged (only the same SKILL.md frontmatter cleanup applies to `automations/benny/skills/**`).

If you want the full original feature set, including `cursor-team-kit`'s `deslop`, `control-cli`, and `control-ui` skills, use pstack directly in Cursor.

## License

MIT, Copyright (c) 2026 Lauren Tan. See `LICENSE`.
