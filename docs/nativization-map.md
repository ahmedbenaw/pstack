# Nativization map

What in the upstream pstack content is still bound to Cursor, what the native
equivalent is on each host we support, and which rows cannot be closed.

**Inventory is complete.** 47 skills, 2 agents and the `automations/` tree match
upstream `cursor/plugins@0.15.2` exactly — nothing was dropped in the port. Every
gap below is a *Cursor-coupled instruction inside a feature that is present*, not
a missing feature.

**Scope.** 47 distinct files under `skills/`, `agents/`, `automations/`, `docs/`
carry at least one Cursor-coupled reference.

Hosts: **CC** Claude Code · **CX** Codex · **GPT** ChatGPT connector (`mcp-server/`) · **CW** Cowork.

## Legend

| Status | Meaning |
| --- | --- |
| **port** | A real equivalent exists on every host we ship to. Mechanical, no behaviour lost. |
| **partial** | Native on some hosts, absent on others. Closable only by naming the limitation per host. |
| **compromise** | No equivalent anywhere. Cannot be closed without dropping or redefining the feature. Needs a decision. |

## The map

| # | Cursor reference | Files | Native equivalent | CC | CX | GPT | CW | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl` (`recall`, `reflect`) | 7 | `~/.claude/projects/<slug>/<uuid>.jsonl` — **verified present on this machine**; flat, no `agent-transcripts/<uuid>/` nesting | ✅ | ? | ❌ | ✅ | **port** |
| 2 | `cursor-team-kit` `/deslop` (**code** slop) | 8 | **Not `unslop`** — `unslop` is prose-only by its own frontmatter, and `docs/guide/05-build-and-clean.md` states the split explicitly. The outcome is now written inline (narrating comments, unsupported guards, dead compatibility paths, unrelated edits), with `principle-subtract-before-you-add` as the rule and Claude Code's `/simplify` as a one-pass accelerator | ✅ | ~ | ~ | ✅ | **port** |
| 3 | `cursor-team-kit` `control-cli` / `control-ui` | 5 | `skills/create-verification-skill/` + `maintain-verification-skill/` — already in this repo | ✅ | ✅ | ✅ | ✅ | **port** |
| 4 | Graphite (`gt`) | 7 | Already documented as never-required; prune to `gh` | ✅ | ✅ | ✅ | ✅ | **port** |
| 5 | Origin CLI (`origin pr …`) | 6 | `gh` is already the documented default; Origin is the optional branch | ✅ | ✅ | ✅ | ✅ | **port** |
| 6 | `~/.cursor/skills/`, `~/.cursor/plugins/` install paths | 4 | `~/.claude/skills/`, `~/.claude/plugins/`; Codex `~/.codex/plugins/` | ✅ | ✅ | n/a | ✅ | **port** |
| 7 | `.cursor/skills/verify-<app>/` output dir | 4 | `.claude/skills/verify-<app>/` | ✅ | ✅ | n/a | ✅ | **port** |
| 8 | `.cursor/settings.json` | 3 | `.claude/settings.json` | ✅ | ✅ | n/a | ✅ | **port** |
| 9 | `~/.cursor/rules/pstack-models.mdc` (`setup-pstack`, and the `interrogate`/`swarm`/`arena` readers) | 5 | Canonical `~/.pstack/models.md`, readable on every host; the Cursor `.mdc` is still written on Cursor for `alwaysApply`, and readers fall back to it so an existing Cursor setup keeps working. (Prose instructions, not executable code — an earlier draft of this row called it "real logic"; it is not.) | ✅ | ✅ | ❌ | ✅ | **port** |
| 10 | `/loop` (Cursor built-in) | 11 | Claude Code ships a native `/loop`. Codex/GPT equivalence **unverified** | ✅ | ? | ❌ | ? | **partial** |
| 11 | Cursor cloud agents / parallel subagent fan-out (`swarm`, `arena`, `architect`, `interrogate`, autopilot playbooks) | 3+ | Claude Code `Agent` tool. No subagent spawn from the MCP connector | ✅ | ~ | ❌ | ✅ | **partial** |
| 12 | `automations/benny/` — Cursor-hosted automation runner (`.cursor/automations/benny/`, `.cursor/benny/routing.md`, `feature-map.md`) | 8 | No host-managed automation runner. Nearest: scheduled tasks / cron | ~ | ❌ | ❌ | ~ | **partial** |
| 13 | **Bugbot** review triage (`references/bugbot-triage.md`, and `scripts/watch-pr/` types, render, github clients + tests) | 11 | Generalized to *automated review*, per Ben's decision. `references/review-triage.md` keeps the rubric, which judges the claim rather than the filer, and `watch-pr` renames `isBugbot`/`bugbotReviewPasses` to `isAutomatedReview`/`reviewPasses` and now detects Copilot, CodeRabbit, Sonar, Codacy and DeepSource alongside Bugbot. Caveat: `/code-review --comment` posts under the human's own login, so the watcher cannot label it; the doc says to apply the rubric by hand there | ✅ | ✅ | ~ | ✅ | **port** |

## The rows that cannot be closed

Everything marked **port** above is mechanical and loses nothing. Row 13 was a
compromise until Ben chose to retarget it; the two below do not close, and saying
otherwise would be false:

1. **Parallel subagents on the ChatGPT connector (row 11).** The MCP server exposes
   three read-only tools; it cannot spawn agents. Every playbook whose core move is
   "fan out N verifiers" — `swarm`, `arena`, `architect`, `interrogate`, both
   autopilots — is inherently degraded there. No amount of porting changes this;
   it is a property of the host.

2. **The benny automation (row 12).** It assumes a Cursor-hosted runner that
   watches a repo and dispatches agents. Claude Code has scheduled tasks, which is
   adjacent but not the same execution model.

## Consequence to accept before starting

Nativizing the reference lines **ends version parity with upstream**. Today this
fork tracks upstream's version exactly (0.15.2) and upstream patches apply cleanly
except at reference lines. After this work the fork diverges deliberately, and every
future upstream sync becomes a merge at precisely these 47 files. That is the price
of nativization and it should be a conscious trade, not a surprise.

`CONTRIBUTING.md` currently states that ported content's "whole value is staying
faithful to the Cursor original." That sentence and this work cannot both stand as
written. The resolution that keeps upstream syncing viable: **nativize tool and
surface references (the *how*); keep workflow prose verbatim (the *what*)** — which
is what `README.md`'s provenance section already claims ("tool-name references
fixed"). `CONTRIBUTING.md` needs updating to say so explicitly.
