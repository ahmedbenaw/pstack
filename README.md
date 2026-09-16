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
- **`cursor-team-kit` dependencies resolved.** A few skills and playbooks called out to `deslop`, `control-cli`, and `control-ui` from Cursor's separate `cursor-team-kit` plugin. They now point at capabilities this repo actually has: `control-cli`/`control-ui` → `create-verification-skill` and `maintain-verification-skill`, which generate and maintain a project-local skill that drives the real app. `deslop` has no single equivalent — it strips slop from *code*, where this repo's `unslop` handles *prose* — so the outcome is written inline (narrating comments, unsupported guards, dead compatibility paths, unrelated edits), with `principle-subtract-before-you-add` as the rule and Claude Code's `/simplify` as a one-pass accelerator.
- Everything else — the `automations/benny` dormant bug-triage pack, `docs/guide/**`, `assets/logo.png`, all playbooks, references, and scripts — was copied over unchanged (only the same SKILL.md frontmatter cleanup applies to `automations/benny/skills/**`).

## Nativization

Beyond the plumbing above, the ported content has been taken off Cursor-specific
tooling so an instruction names something the running host actually has:
`gh` is the single forge (Origin CLI and Graphite are gone), skill/plugin/transcript
paths resolve per host, the model config lives at `~/.pstack/models.md`, `/loop` and
agent runtimes are described by capability rather than by vendor, and Bugbot triage
is generalized to automated review of any kind.

[`docs/nativization-map.md`](docs/nativization-map.md) is the full audit: every
Cursor reference, its equivalent, and which of the four hosts it works on.

Two things genuinely do not port, and the map says so rather than pretending:

- **Parallel subagents on the ChatGPT connector.** The MCP server exposes three
  read-only tools and cannot spawn agents, so any playbook whose core move is
  "fan out N verifiers" — `swarm`, `arena`, `architect`, `interrogate`, both
  autopilots — is degraded there. That is a property of the host.
- **The `benny` runner.** Cursor hosts the automation that watches a repo and fires
  on a webhook. benny's *skills* are host-neutral and run anywhere; its runner has
  no equivalent, and on Claude Code the nearest thing is a scheduled task.

## hookify rules

[`hookify/`](hookify/) carries two guards for pstack's own configuration — one on writes to `~/.pstack/models.md`, one on `/setup-pstack` invocations. Both encode a real failure: a setup run that wrote only the Cursor `.mdc` fallback and left the canonical file missing for five days, and a run that nearly skipped the skill's mandatory confirmation gate.

They are templates. hookify globs `.claude/hookify.*.local.md` relative to the session's working directory only — there is no global rule location — so a rule fires only once copied into the project's own `.claude/`. [`hookify/README.md`](hookify/README.md) has the detail.

## Versioning

This fork tracked upstream's version exactly up to 0.15.2. Nativization makes the
content deliberately diverge, so from 1.0.0 the fork keeps its own version line.
Upstream releases are still tracked and merged; they just no longer set the number.

## License

MIT, Copyright (c) 2026 Lauren Tan. See `LICENSE`.
