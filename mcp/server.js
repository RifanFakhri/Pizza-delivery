import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
    {
        name: "nextjs-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_users",
                description: "Get users from database",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (req) => {
    if (req.params.name === "get_users") {
        return {
            content: [
                {
                    type: "text",
                    text: "List of users",
                },
            ],
        };
    }
    throw new Error(`Tool not found: ${req.params.name}`);
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});