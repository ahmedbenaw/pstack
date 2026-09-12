# Contributing

This repo is [pstack](https://github.com/cursor/plugins/tree/main/pstack)
(Lauren Tan, MIT), ported to work outside Cursor: as a native Claude Code /
Cowork skill, a Codex plugin, and a ChatGPT connector (`mcp-server/`).

## Scope: what gets formatted, linted, and tested

**In scope**: `mcp-server/` - this fork's own build, not upstream content.

**Out of scope, deliberately** (see `.prettierignore` / `eslint.config.js`):

- `skills/`, `agents/`, `docs/`, `automations/`, `assets/` - upstream-ported
  content. Reformatting it would work against staying close to the Cursor
  original, which is what makes upstream syncs tractable. See `README.md`'s
  provenance section for exactly what was adapted and what was kept verbatim.

### What we do change in ported content

The dividing line is the *how*, not the *what*. Workflow prose - the methodology,
the playbooks, the principles - stays upstream's. Tool and surface references get
nativized, so an instruction names something the running host actually has: forge
commands, file paths, config locations, wake mechanisms, agent runtimes, and the
names of sibling skills. `docs/nativization-map.md` is the audit of every such
change and which hosts it applies to.

This is the reason an upstream patch usually applies cleanly except at reference
lines. When `git apply` rejects a hunk on a sync, that is where to look: take
upstream's prose and keep this port's references.

## Commands

```bash
npm install
npm run format:check   # prettier --check .
npm run lint           # eslint .
npm test               # node --test, colocated *.test.mjs (see tests/README.md)
```

The MCP server has its own `package.json` and is typechecked separately:

```bash
cd mcp-server
npm install
npx wrangler types      # regenerate worker-configuration.d.ts from wrangler.jsonc
npx tsc --noEmit
```

CI (`.github/workflows/ci.yml`) runs all of the above on every push and PR to `main`.

## Style

Double quotes, trailing commas where ES5 allows, 100-column print width - see
`.prettierrc.json`; don't hand-format. ESM everywhere in `mcp-server/`. New
code gets a real regression test when it fixes a real bug.
