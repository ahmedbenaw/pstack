import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { SKILLS, AGENTS } from "./content.generated";

// pstack, exposed as MCP tools for clients that don't have Claude's automatic
// Skill-matching (e.g. ChatGPT's Apps SDK). A client calls list_skills to see
// what's available, then get_skill to fetch one's full instructions and follow
// them itself - the tool returns text for the calling model to act on, it does
// not execute pstack's methodology on the server's behalf.
type State = Record<string, never>;
// No per-connection auth props - this server has no authentication (see
// README's security note). Record<string, never> means "no props", unlike
// `{}` which TypeScript would accept any non-nullish value for.
type Props = Record<string, never>;

export class PstackMCP extends McpAgent<Env, State, Props> {
  server = new McpServer({ name: "pstack", version: "0.15.0" });
  initialState: State = {};

  async init() {
    this.server.registerTool(
      "list_pstack_skills",
      {
        description:
          "List every pstack skill and subagent with its one-line description. Call this first to see what's available, then call get_pstack_skill or get_pstack_agent for the full instructions of whichever one matches your task.",
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        inputSchema: {},
      },
      async () => {
        const skills = Object.entries(SKILLS).map(([name, s]) => ({
          name,
          description: s.description,
        }));
        const agents = Object.entries(AGENTS).map(([name, a]) => ({
          name,
          description: a.description,
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ skills, agents }, null, 2),
            },
          ],
        };
      }
    );

    this.server.registerTool(
      "get_pstack_skill",
      {
        description:
          "Fetch the full instructions for one named pstack skill (its SKILL.md plus any reference/playbook files). Follow the returned instructions yourself - this tool returns text, it does not execute anything. Start with 'poteto-mode' if you're unsure which skill fits a task; its own instructions route to the other 46.",
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        inputSchema: {
          name: z
            .string()
            .describe(
              "Skill name, e.g. 'poteto-mode', 'how', 'tdd'. Call list_pstack_skills first if unsure of exact names."
            ),
        },
      },
      async ({ name }) => {
        const skill = SKILLS[name];
        if (!skill) {
          const names = Object.keys(SKILLS).sort().join(", ");
          return {
            content: [
              {
                type: "text",
                text: `No pstack skill named "${name}". Available: ${names}`,
              },
            ],
            isError: true,
          };
        }
        const sections = Object.entries(skill.files)
          .sort(([a], [b]) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)))
          .map(([path, content]) => `## ${path}\n\n${content}`)
          .join("\n\n---\n\n");
        return { content: [{ type: "text", text: sections }] };
      }
    );

    this.server.registerTool(
      "get_pstack_agent",
      {
        description:
          "Fetch the full definition of one named pstack subagent (poteto-agent or comment-sicko). These describe a persona/behavior mode to adopt, not a tool this server executes - read the returned text and act in that style yourself.",
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        inputSchema: {
          name: z.string().describe("Agent name: 'poteto-agent' or 'comment-sicko'."),
        },
      },
      async ({ name }) => {
        const agent = AGENTS[name];
        if (!agent) {
          const names = Object.keys(AGENTS).sort().join(", ");
          return {
            content: [
              { type: "text", text: `No pstack agent named "${name}". Available: ${names}` },
            ],
            isError: true,
          };
        }
        return { content: [{ type: "text", text: agent.content }] };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/mcp")) {
      return PstackMCP.serve("/mcp", { binding: "PSTACK_MCP" }).fetch(request, env, ctx);
    }
    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response("pstack MCP server - connect at /mcp", { status: 200 });
    }
    return new Response("Not found", { status: 404 });
  },
};
