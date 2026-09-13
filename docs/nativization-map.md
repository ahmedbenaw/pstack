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

## Status

**Shipped as [v1.0.0](https://github.com/ahmedbenaw/pstack/releases/tag/v1.0.0).** Every
row below marked **port** is done and live, not planned. The fork tracked upstream's
version exactly through 0.15.2; 1.0.0 is the first release on its own line, because the
content here deliberately diverges.

Verified independently on each host rather than inferred from one:

| Host | State | How it was checked |
| --- | --- | --- |
| Claude Code | 1.0.0 | Plugin cache force-re-extracted — the cache is version-keyed, so `plugin update` reported "already latest" while still serving pre-nativization content |
| Codex | 1.0.0 | `codex plugin marketplace upgrade pstack`; clone at the release commit |
| ChatGPT | 1.0.0 | Live on the wire at `https://pstack-mcp.pstack.workers.dev/mcp` — `serverInfo.version`, plus content assertions that the Origin/Graphite and Cursor-path references are gone |
| Cowork | 1.0.0 | claude.ai marketplace synced to the release commit; 47 skills, 2 agents |

Two host-sync behaviours worth knowing before trusting a "done":

- **claude.ai's "Sync automatically" did not fire on push**, three times running. After
  any push, use the marketplace's ⋮ → *Check for updates* and judge by the commit hash
  on the card, not the toggle.
- **Claude Code's plugin cache is keyed by version**, so content changes that keep the
  same version are not re-extracted. A content-only fix needs a version bump or a
  forced reinstall.

Upstream `cursor/plugins` has not touched `pstack/` since 0.15.2, so nothing is pending
to merge as of this release.

## Legend

| Status | Meaning |
| --- | --- |
| **port** | A real equivalent exists on every host we ship to. Mechanical, no behaviour lost. |
| **partial** | Native on some hosts, absent on others. Closable only by naming the limitation per host. |
| **compromise** | No equivalent anywhere. Cannot be closed without dropping or redefining the feature. Needs a decision. |

Host columns mean **the reference names something correct for that host**, not that the
capability executes there. The ChatGPT connector exposes three read-only tools and runs
nothing, so a ✅ in its column means an agent reading the instruction on that host is told
the right thing, and ❌ means the instruction still names something it cannot reach at all.

## The map

| # | Cursor reference | Files | Native equivalent | CC | CX | GPT | CW | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl` (`recall`, `reflect`) | 7 | `~/.claude/projects/<slug>/<uuid>.jsonl` — **verified present on this machine**; flat, no `agent-transcripts/<uuid>/` nesting | ✅ | ? | ❌ | ✅ | **port** |
| 2 | `cursor-team-kit` `/deslop` (**code** slop) | 8 | **Not `unslop`** — `unslop` is prose-only by its own frontmatter, and `docs/guide/05-build-and-clean.md` states the split explicitly. The outcome is now written inline (narrating comments, unsupported guards, dead compatibility paths, unrelated edits), with `principle-subtract-before-you-add` as the rule and Claude Code's `/simplify` as a one-pass accelerator | ✅ | ~ | ~ | ✅ | **port** |
| 3 | `cursor-team-kit` `control-cli` / `control-ui` | 5 | `skills/create-verification-skill/` + `maintain-verification-skill/` — already in this repo | ✅ | ✅ | ✅ | ✅ | **port** |
| 4 | Graphite (`gt`) | 7 prose + `scripts/orch/` | Prose pruned to `gh`. The prose count understated this: `scripts/orch/store.ts` **shelled out to `gt log short --stack` and `gt info`** to resolve the stack frontier, so the playbook's own tool still required Graphite after the prose said otherwise. `graphiteFrontier` is replaced by a walk down PR base refs from the checked-out branch via `gh pr list`, reversed to read bottom-to-top — the same ordering, from the forge this port already depends on. `FrontierPrState` was already `OPEN|MERGED|CLOSED`, so the contract was unchanged | ✅ | ✅ | ✅ | ✅ | **port** |
| 5 | Origin CLI (`origin pr …`) | 6 | `gh` is already the documented default; Origin is the optional branch | ✅ | ✅ | ✅ | ✅ | **port** |
| 6 | `~/.cursor/skills/`, `~/.cursor/plugins/` install paths | 4 | `~/.claude/skills/`, `~/.claude/plugins/`; Codex `~/.codex/plugins/` | ✅ | ✅ | n/a | ✅ | **port** |
| 7 | `.cursor/skills/verify-<app>/` output dir | 4 | `.claude/skills/verify-<app>/` | ✅ | ✅ | n/a | ✅ | **port** |
| 8 | `.cursor/settings.json` | 3 | `.claude/settings.json` | ✅ | ✅ | n/a | ✅ | **port** |
| 9 | `~/.cursor/rules/pstack-models.mdc` (`setup-pstack`, and the `interrogate`/`swarm`/`arena` readers) | 5 | Canonical `~/.pstack/models.md`, readable on every host; the Cursor `.mdc` is still written on Cursor for `alwaysApply`, and readers fall back to it so an existing Cursor setup keeps working. (Prose instructions, not executable code — an earlier draft of this row called it "real logic"; it is not.) | ✅ | ✅ | ❌ | ✅ | **port** |
| 10 | `/loop` (Cursor built-in) | 11 | Claude Code ships a native `/loop`. Codex/GPT equivalence **unverified** | ✅ | ? | ❌ | ? | **partial** |
| 11 | Cursor cloud agents / parallel subagent fan-out (`swarm`, `arena`, `architect`, `interrogate`, autopilot playbooks) | 3+ | Claude Code `Agent` tool. No subagent spawn from the MCP connector | ✅ | ~ | ❌ | ✅ | **partial** |
| 12 | `automations/benny/` — Cursor-hosted automation runner (`.cursor/automations/benny/`, `.cursor/benny/routing.md`, `feature-map.md`) | 8 | No host-managed automation runner. Nearest: scheduled tasks / cron | ~ | ❌ | ❌ | ~ | **partial** |
| 13 | **Bugbot** review triage (`references/bugbot-triage.md`, and `scripts/watch-pr/` types, render, policy, github clients + tests) | 11 | Generalized to *automated review*, per Ben's decision. `references/review-triage.md` keeps the rubric, which judges the claim rather than the filer, and `watch-pr` renames `isBugbot`/`bugbotReviewPasses` to `isAutomatedReview`/`reviewPasses` and now detects Copilot, CodeRabbit, Sonar, Codacy and DeepSource alongside Bugbot. Caveat: `/code-review --comment` posts under the human's own login, so the watcher cannot label it; the doc says to apply the rubric by hand there | ✅ | ✅ | ~ | ✅ | **port** |
| 14 | `create-skill` (Cursor built-in, used by `authoring-a-skill`, `automate-me`, `reflect`, and the guide) | 6 | None shipped here, and Claude Code has no equivalent built-in. `playbooks/authoring-a-skill.md` now states the frontmatter and body requirements inline and is the referenced authority; Cursor's built-in is named as the one-pass shortcut where it exists | ✅ | ✅ | ✅ | ✅ | **port** |

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

## What this cost, in hindsight

Nativization ended version parity with upstream. The fork tracked upstream's
number exactly through 0.15.2 and now runs its own line from 1.0.0, so every
future upstream sync is a merge at these files rather than a clean apply. That
was a deliberate trade, taken with the version decision.

The rule that keeps syncing tractable: **nativize tool and surface references
(the *how*); keep workflow prose verbatim (the *what*).** `CONTRIBUTING.md`
states it under "What we do change in ported content", and it predicts exactly
which hunks will reject on the next sync.

## What the review board caught

A five-lens adversarial review ran over the finished diff and found work that
the residual greps had not. Recorded here because the pattern repeats:

- **A sweep that excludes by line content is not a sweep.** An early residual
  check filtered out every line *mentioning* `scripts/` rather than files under
  that directory, and missed live Cursor references in `orchestrate.md` and the
  guide.
- **Markdown greps do not find coupling in code.** `scripts/orch/store.ts` still
  shelled out to Graphite long after the prose said `gh`, because the prose was
  what had been searched.
- **Porting a resolver is not the same as reimplementing it.** The first `gh`
  frontier walk only descended from the checked-out branch, silently dropping
  every PR above it, and treated trunk and fork PRs as stack members.
- **Renaming a concept in one file leaves the other one behind.** `github.ts`
  learned six new review bots while `policy.ts` still knew only Bugbot.
