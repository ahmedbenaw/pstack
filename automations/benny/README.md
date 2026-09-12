# benny

benny gives you two cursor automations for slack issue reports. one triages each report. the other reproduces confirmed bugs and may prepare a small draft fix.

the files in this directory are dormant setup and automation sources. they do not appear as slash skills.

## host support

benny has two halves, and only one of them ports.

the **runner** is a cursor hosted automation: cursor watches the repo, fires on a
slack issue report, and dispatches an agent. no other host this plugin ships to has
an equivalent. on claude code the nearest thing is a scheduled task (`/schedule`, or
`/loop` for an in-session watch), which you arm yourself and which polls rather than
receiving a webhook. codex and the chatgpt connector have neither.

the **skills** under `skills/` are ordinary pstack skills and are host-neutral. you
can run `triage-issue-reports` and `reproduce-and-fix-issues` directly on any host,
handing them a report instead of waiting for the automation to deliver one. that is
the supported path off cursor.

the setup steps below install the cursor runner and are written for cursor. on claude
code substitute `.claude/settings.json` for `.cursor/settings.json`; the rest of the
runner wiring has no target.

## set it up

1. point cursor at [`FOR_AGENTS.md`](./FOR_AGENTS.md) and name the target repository.
2. let setup merge this whole directory into the target at `.cursor/automations/benny/`. it must preserve destination-only files and review conflicts instead of overwriting local edits.
3. let setup enable pstack in the target repository's `.cursor/settings.json` for shared dependencies:

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. keep user-owned configuration outside the copied pack, for example in `.cursor/benny/`. adapt [`configuration.example.yaml`](./templates/configuration.example.yaml) and [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md).
5. commit `.cursor/settings.json`, `.cursor/automations/benny/`, and any secret-free configuration before enabling either automation.
6. review each new automation draft or update existing automations in their editors. then send a harmless test report and verify every source-channel post stays in the original thread.
