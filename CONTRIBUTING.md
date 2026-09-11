# Contributing

This repo is [pstack](https://github.com/cursor/plugins/tree/main/pstack)
(Lauren Tan, MIT), ported to work outside Cursor: as a native Claude Code /
Cowork skill, a Codex plugin, and a ChatGPT connector (`mcp-server/`).

## Scope: what gets formatted, linted, and tested

**In scope**: `mcp-server/` - this fork's own build, not upstream content.

**Out of scope, deliberately** (see `.prettierignore` / `eslint.config.js`):

- `skills/`, `agents/`, `docs/`, `automations/`, `assets/` - upstream-ported
  content. Its whole value is staying faithful to the Cursor original;
  reformatting it would work against that. See `README.md`'s provenance
  section for exactly what was adapted (frontmatter trimmed to
  name/description, tool-name references fixed) and what was kept verbatim.

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
