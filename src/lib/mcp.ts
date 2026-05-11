import { createMcpHandler } from "mcp-handler";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Standard text-content response wrapper for MCP tool callbacks.
 * Serializes any data as a pretty-printed JSON string.
 */
export function mcpJsonText(data: unknown) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify(data, null, 2) },
    ],
  };
}

/**
 * Build a Streamable-HTTP MCP route handler for Sevenpreneur.
 *
 * Convention:
 *   File path: src/app/(api)/api/mcp/<name>/route.ts
 *   URL:       /api/mcp/<name>
 *   Server ID: sevenpreneur-<name>
 *
 * The returned handler:
 *   - Validates `Authorization: Bearer ${SECRET_KEY_MCP}` on every request
 *   - Exposes Streamable HTTP transport only (SSE disabled)
 *   - Should be re-exported as GET, POST, and DELETE from the route file
 */
export function createSevenpreneurMcp(
  name: string,
  setup: (server: McpServer) => void | Promise<void>,
) {
  // NOTE: do NOT pass `basePath` — when set, mcp-handler force-derives the
  // endpoint as `${basePath}/mcp` and ignores `streamableHttpEndpoint`. We
  // pass the full URL path explicitly instead so each MCP can live at
  // /api/mcp/<name> without an extra `/mcp` segment.
  const handler = createMcpHandler(
    setup,
    { serverInfo: { name: `sevenpreneur-${name}`, version: "1.0.0" } },
    {
      streamableHttpEndpoint: `/api/mcp/${name}`,
      disableSse: true,
      verboseLogs: false,
    },
  );

  return async (req: Request) => {
    const expected = process.env.SECRET_KEY_MCP;
    if (!expected) {
      return new Response(
        JSON.stringify({
          error:
            "MCP server is not configured. Set the SECRET_KEY_MCP environment variable.",
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }
    if (req.headers.get("authorization") !== `Bearer ${expected}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "content-type": "application/json",
          "www-authenticate": "Bearer",
        },
      });
    }
    return handler(req);
  };
}
