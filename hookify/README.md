# hookify rules

Two guards for pstack's own configuration, written as [hookify](https://github.com/anthropics/claude-plugins-official) rules. Both encode a real failure rather than a hypothetical one.

| Rule | Event | Guards |
|---|---|---|
| `hookify.warn-pstack-config-canonical-path.local.md` | `all` | Writes to `~/.pstack/models.md` or the Cursor `.mdc` fallback |
| `hookify.warn-setup-pstack-confirmation-gate.local.md` | `prompt` | `/setup-pstack` invocations, before anything is written |

## These are templates — copy them, don't point at them

hookify discovers rules with a single relative, non-recursive glob:

```python
pattern = os.path.join('.claude', 'hookify.*.local.md')
files = glob.glob(pattern)
```

That resolves against the **session's working directory** and nothing else. There is no `~` expansion, no `**` recursion, and no global rule location — a rule in `~/.claude/` is as inert as a rule in this directory. To arm one, copy it into the project you want it to fire in:

```bash
cp hookify/hookify.*.local.md /path/to/project/.claude/
```

Rules are read fresh on each tool use, so a copied rule is live immediately — no restart. Symlinks resolve fine if you would rather link than copy.

## What they are and are not

They are **reminders**, not enforcement. Both use `action: warn`, which surfaces the message and allows the operation. hookify is stateless per tool call: the confirmation-gate rule cannot verify that the gate was actually honoured, only that the skill was invoked.

The canonical-path rule uses `event: all` rather than `event: file` deliberately. `file` covers only the Edit, Write and MultiEdit tools, and an agent in auto mode writes through Bash heredocs — which a `file` rule never sees.

## The failures they encode

**Canonical path.** A `/setup-pstack` run wrote only `~/.cursor/rules/pstack-models.mdc` and never created `~/.pstack/models.md`. On Claude Code nothing reads the `.mdc`, so the config looked correct and did nothing for five days. Write both paths, canonical first, and `diff` them back.

**Confirmation gate.** Step 3 of `setup-pstack` requires showing every role's current and proposed model and asking before any file is written. A recommended mapping is a proposal, not a decision. A run came within one tool call of skipping it.

A third fact worth carrying: pstack's shipped default slugs (`grok-4.6-fast-xhigh`, `gpt-5.6-sol-max`, `claude-*-thinking-max`) are Cursor slugs and are invalid on Claude Code. Validate every slug against what the running host can actually pass to a subagent.
