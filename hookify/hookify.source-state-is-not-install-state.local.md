---
name: source-state-is-not-install-state
enabled: true
event: all
action: warn
pattern: nativization-map\.md|serverInfo\.version|gh api[^\n]*contents
---

⚠️ **Source state is not install state**

Reading a bumped manifest back from GitHub proves what was **published**. It
says nothing about what is **installed** on any host.

**Every row of a per-host status table names the artifact it was read from on
that host:**

| Host | Read this |
| --- | --- |
| Claude Code | the cache directory under `~/.claude/plugins/cache/` |
| Codex | `~/.codex/config.toml` `last_revision`, plus its own cache |
| ChatGPT | an `initialize` call to the live worker |
| Cowork | the claude.ai UI — unreadable from a shell |

**"Carried over", "not re-checked" and "unknown" are honest.** A value inferred
from a sibling host, or from the release commit, is not — that is the drift the
status table exists to catch.

**The failure this guards (2026-09-16):** the Codex row was published reading
1.1.0 on the evidence that `gh api` returned a 1.1.0 manifest, while
`~/.codex/config.toml` still pinned `2af80cf` and the cache still held only
`1.0.1/` with no `hookify/`. The host was a full release behind the row that
described it.
