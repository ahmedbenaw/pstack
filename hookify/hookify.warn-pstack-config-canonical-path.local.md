---
name: warn-pstack-config-canonical-path
enabled: true
event: all
action: warn
pattern: (>|>>|tee|cp|mv|sed -i)[^\n]*(\.pstack/models\.md|pstack-models\.mdc)
---

⚠️ **Writing pstack model config — canonical path check**

`~/.pstack/models.md` is **CANONICAL**. The arena, architect, interrogate,
swarm, how, why and reflect skills read it first, on every host.

`~/.cursor/rules/pstack-models.mdc` is a **Cursor-only fallback**. On Claude
Code nothing reads it.

**The failure this guards (2026-09-11):** a `/setup-pstack` run wrote only the
`.mdc` fallback and never created the canonical file. The config looked correct
and did nothing for five days.

**Before moving on:**
- Write **both** paths, canonical first.
- `cat` both back and `diff` them — do not assume the write landed.
- Validate every slug against the model slugs this session can actually pass to
  a Task subagent. pstack's shipped defaults (`grok-4.6-fast-xhigh`,
  `gpt-5.6-sol-max`, `claude-*-thinking-max`) are Cursor slugs and are invalid
  on Claude Code.
- Panel roles take a LIST — list length sets the agent fan-out. Changing the
  number of entries changes behaviour, not just content.
