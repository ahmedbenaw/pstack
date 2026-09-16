---
name: warn-setup-pstack-confirmation-gate
enabled: true
event: prompt
action: warn
pattern: setup-pstack
---

⚠️ **`/setup-pstack` has a mandatory confirmation gate — do not write first**

Step 3 of the skill is **required before any file is written**:

> "Show every role with its current model, marking any real slug not in the
> detected set as needing a choice. Ask whether to accept as-is or change
> specific roles… Prefer AskUserQuestion over free text."

A recommended mapping is a **proposal, not a decision**. The user picks.

**Order of operations:**
1. Detect real slugs — the Task subagent `model` enum is the dependable source.
   `inherit-parent` and `auto` are always valid; they mean "omit the model param",
   so the role rides the PARENT chat model (often the most expensive one).
2. Load current state — `~/.pstack/models.md`, else the `.mdc` fallback, else defaults.
3. **AskUserQuestion** showing every role's current → proposed model.
4. Validate: every real slug must be in the detected set.
5. Only then write, canonical path first.

**Note:** hookify is stateless per tool call and cannot verify that step 3
actually happened. This is a reminder, not an enforced precondition — the
discipline is yours.
