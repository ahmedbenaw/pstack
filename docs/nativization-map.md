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

**Shipped as 1.2.0** (`775e3de`). Every row below marked **port** is done and live,
not planned. The fork tracked upstream's version exactly through 0.15.2; 1.0.0 was the
first release on its own line, because the content here deliberately diverges.

Only 1.0.0 has a git tag and a GitHub release. 1.0.1, 1.1.0 and 1.2.0 shipped by pushing
`main` with the manifests bumped, so they are identified by commit here rather than by
a release link. An earlier version of this line linked to `releases/tag/v1.0.1`, which
has never existed.

All three exist because of the cache rule below the table: the cache is keyed by
version and will not serve a change that keeps the same number. 1.0.1 carried two skill
fixes — a `description:` that reached every MCP host as the literal string `">-"`
instead of the folded block scalar, and two skill `name:` fields that were display
headings rather than slugs. 1.1.0 carries `hookify/`, two rules guarding pstack's own
configuration. 1.2.0 adds two more, guarding the release path itself — both written
from ways the 1.1.0 release actually went wrong. All are additive content; none of
them changes a skill.

Verified independently on each host rather than inferred from one:

| Host | State | How it was checked |
| --- | --- | --- |
| Claude Code | 1.2.0 | `claude plugin update pstack@pstack` stepped 1.1.0 → 1.2.0; `~/.claude/plugins/cache/pstack/pstack/1.2.0/hookify/` holds all four rules. A restart is required before a session loads it |
| Codex | 1.2.0 | `codex plugin marketplace upgrade pstack` moved the snapshot and re-materialized the install; `codex plugin list` reports 1.2.0 installed and enabled, with four rules in its cache |
| ChatGPT | 1.0.1 | Deliberately not moved. An `initialize` call still returns `serverInfo.version` 1.0.1, which is correct — `mcp-server/` was not rebuilt or deployed, because `hookify/` is copied files rather than anything served over MCP |
| Cowork | unknown | Not re-checked for this release. claude.ai state cannot be read from the command line, and the 2026-09-14 UI check saw `b0689c4`, which predates both 1.0.1 and 1.1.0 |

Two host-sync behaviours worth knowing before trusting a "done":

- **claude.ai's "Sync automatically" did not fire on push**, three times running. After
  any push, use the marketplace's ⋮ → *Check for updates* and judge by the commit hash
  on the card, not the toggle.
- **Claude Code's plugin cache is keyed by version**, so content changes that keep the
  same version are not re-extracted. A content-only fix needs a version bump or a
  forced reinstall. Updating to 1.1.0 also showed the cache does not replace the old
  copy: `1.0.1/` and `1.1.0/` now sit side by side. An earlier version of this table
  said the directory holds one version and nothing else — true when only one release
  had ever been installed, but not a rule.
- **Codex and Claude Code differ here.** The same release left Claude Code holding both
  version directories and left Codex holding only `1.1.0/`. Codex also re-materializes
  the install from `codex plugin marketplace upgrade` alone; `codex plugin add pstack`
  is not needed and in fact errors without a `@marketplace` qualifier.
- **Check the install, not the source.** Reading a bumped manifest back from GitHub
  proves what was published, not what is installed. This table once recorded Codex at
  1.1.0 on that basis while `~/.codex/config.toml` still pinned `2af80cf` and the cache
  still held `1.0.1/`. Each row names the per-host artifact it was read from.

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
