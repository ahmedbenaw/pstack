---
name: verify-plugin-cache-actually-moved
enabled: true
event: bash
action: warn
pattern: (claude|codex)\s+plugin[^\n]*(update|upgrade)|git\s+push[^\n]*pstack
---

⚠️ **A version-keyed plugin cache ignores a content-only push**

`claude plugin update` compares **version strings**, not commits. When the repo
has moved and the number has not, it answers *"already at the latest version"*
and leaves the cache directory untouched — original timestamp and all.

**Before deciding a version bump is unnecessary:**
- Run the updater.
- `ls` the cache directory and confirm it **changed**.
- Confirm the new content is actually inside it.

**Hosts behave differently, so check the one you mean:**
- Claude Code: `~/.claude/plugins/cache/<mkt>/<plugin>/<version>/` — keeps the
  old version directory alongside the new one.
- Codex: `~/.codex/plugins/cache/<mkt>/<plugin>/<version>/` — replaces it.
  `codex plugin marketplace upgrade` re-materializes the install by itself;
  `codex plugin add <name>` is unnecessary and errors without `@marketplace`.

**The failure this guards (2026-09-16):** pstack shipped new `hookify/` content
with no version bump, on the reasoning that copied templates are not loaded by
the plugin system so the version does not gate them. True about loading,
irrelevant to delivery — the files could not reach any install at all. The
repo's own 1.0.1 release commit had already written the rule down: *"the fixes
were content-only, and a version-keyed cache will not serve those without a
version bump."*
