# pstack MCP server

Exposes [pstack](../README.md)'s skills and agents as MCP tools, for clients
that don't have Claude's automatic Skill-matching - primarily ChatGPT's Apps
SDK, which requires a remote MCP endpoint rather than local skill files.

## What it does

Three tools, all read-only, all returning text for the calling model to act
on itself (the server never executes pstack's methodology on your behalf):

- `list_pstack_skills` - names + one-line descriptions of all 47 skills and 2 agents.
- `get_pstack_skill(name)` - full SKILL.md + references/playbooks for one skill.
- `get_pstack_agent(name)` - full definition for `poteto-agent` or `comment-sicko`.

Content is bundled at build time from `../skills` and `../agents` into
`src/content.generated.ts` (see `scripts/bundle-skills.mjs`) since Cloudflare
Workers can't read the filesystem at runtime. Re-run the bundler after
changing pstack's source content:

```bash
node scripts/bundle-skills.mjs
```

## Security note

This server has **no authentication**. Anyone with the deployed URL can call
its tools. That's a deliberate choice, not an oversight: every tool is
read-only and returns nothing but this plugin's own public, MIT-licensed
markdown content - no user data, no side effects, no destructive actions.
If you fork this to serve anything sensitive, add OAuth via
`@cloudflare/workers-oauth-provider` before deploying (see the
[Cloudflare Agents SDK securing-MCP-servers guide](https://developers.cloudflare.com/agents/api-reference/securing-mcp-servers/)).

## Develop and test locally

```bash
npm install
npm run dev          # wrangler dev, serves on http://localhost:8787/mcp
```

Verified this way during development: MCP `initialize` handshake, `tools/list`,
and `tools/call` round-trips for `list_pstack_skills` and `get_pstack_skill`
against the actual running server - not just read-through.

## Deploy

Requires your own Cloudflare account (not something this session's non-interactive
environment can do - `wrangler login` needs a browser):

```bash
npx wrangler login
npm run deploy
```

Then register the deployed URL as a custom connector in ChatGPT: Settings →
Apps → Advanced settings → enable Developer Mode → Settings → Connectors →
Create, pointing at `https://<your-worker>.workers.dev/mcp`.
