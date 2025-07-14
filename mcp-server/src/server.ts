import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { WhiteboardManager } from "./whiteboard-manager.js";
import { WebSocketManager } from "./websocket-manager.js";
import { randomUUID } from "crypto";

// Initialize managers
const whiteboardManager = new WhiteboardManager();
const wsManager = new WebSocketManager(8080, whiteboardManager);

// Create MCP server
const mcpServer = new McpServer({
  name: "whiteboard-mcp-server",
  version: "1.0.0",
});

// ==================== RESOURCES ====================

// Current whiteboard data resource
mcpServer.registerResource(
  "whiteboard-data",
  "whiteboard://current",
  {
    title: "Current Whiteboard Data",
    description: "Current state of the whiteboard with all elements",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(whiteboardManager.getData(), null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// Whiteboard statistics resource
mcpServer.registerResource(
  "whiteboard-stats",
  "whiteboard://stats",
  {
    title: "Whiteboard Statistics",
    description: "Statistics about the current whiteboard content",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(whiteboardManager.getStats(), null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// ==================== TOOLS ====================

// Create sticky note
mcpServer.registerTool(
  "create-sticky-note",
  {
    title: "Create Sticky Note",
    description: "Create a new sticky note on the whiteboard",
    inputSchema: {
      x: z.number().describe("X coordinate position"),
      y: z.number().describe("Y coordinate position"),
      text: z.string().describe("Text content of the sticky note"),
      color: z
        .enum(["yellow", "pink", "blue", "green", "purple", "orange"])
        .default("yellow")
        .describe("Color of the sticky note"),
    },
  },
  async ({ x, y, text, color }) => {
    const element = whiteboardManager.createStickyNote(x, y, text, color);
    return {
      content: [
        {
          type: "text",
          text: `Created sticky note with ID: ${element.id} at position (${x}, ${y}) with text: "${text}"`,
        },
      ],
    };
  }
);

// Create flow node
mcpServer.registerTool(
  "create-flow-node",
  {
    title: "Create Flow Node",
    description: "Create a new flow chart node on the whiteboard",
    inputSchema: {
      x: z.number().describe("X coordinate position"),
      y: z.number().describe("Y coordinate position"),
      label: z.string().describe("Label text for the flow node"),
      shape: z
        .enum(["rectangle", "diamond", "circle", "ellipse"])
        .default("rectangle")
        .describe("Shape of the flow node"),
    },
  },
  async ({ x, y, label, shape }) => {
    const element = whiteboardManager.createFlowNode(x, y, label, shape);
    return {
      content: [
        {
          type: "text",
          text: `Created flow node with ID: ${element.id} at position (${x}, ${y}) with label: "${label}" and shape: ${shape}`,
        },
      ],
    };
  }
);

// Create Mermaid diagram
mcpServer.registerTool(
  "create-mermaid-diagram",
  {
    title: "Create Mermaid Diagram",
    description: "Create a new Mermaid diagram on the whiteboard",
    inputSchema: {
      x: z.number().describe("X coordinate position"),
      y: z.number().describe("Y coordinate position"),
      mermaidCode: z.string().describe("Mermaid diagram code"),
    },
  },
  async ({ x, y, mermaidCode }) => {
    const element = whiteboardManager.createMermaidDiagram(x, y, mermaidCode);
    return {
      content: [
        {
          type: "text",
          text: `Created Mermaid diagram with ID: ${element.id} at position (${x}, ${y})`,
        },
      ],
    };
  }
);

// Create embedded link
mcpServer.registerTool(
  "create-embedded-link",
  {
    title: "Create Embedded Link",
    description: "Create a new embedded link/iframe on the whiteboard",
    inputSchema: {
      x: z.number().describe("X coordinate position"),
      y: z.number().describe("Y coordinate position"),
      url: z.string().url().describe("URL to embed"),
      embedType: z
        .enum(["iframe", "video"])
        .default("iframe")
        .describe("Type of embed"),
    },
  },
  async ({ x, y, url, embedType }) => {
    const element = whiteboardManager.createEmbeddedLink(x, y, url, embedType);
    return {
      content: [
        {
          type: "text",
          text: `Created embedded link with ID: ${element.id} at position (${x}, ${y}) for URL: ${url}`,
        },
      ],
    };
  }
);

// Update element
mcpServer.registerTool(
  "update-element",
  {
    title: "Update Element",
    description: "Update an existing whiteboard element",
    inputSchema: {
      id: z.string().describe("ID of the element to update"),
      updates: z
        .record(z.any())
        .describe("Object containing the properties to update"),
    },
  },
  async ({ id, updates }) => {
    const element = whiteboardManager.updateElement(id, updates);
    if (element) {
      return {
        content: [
          {
            type: "text",
            text: `Updated element ${id} successfully`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Element with ID ${id} not found`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Remove element
mcpServer.registerTool(
  "remove-element",
  {
    title: "Remove Element",
    description: "Remove an element from the whiteboard",
    inputSchema: {
      id: z.string().describe("ID of the element to remove"),
    },
  },
  async ({ id }) => {
    const success = whiteboardManager.removeElement(id);
    if (success) {
      return {
        content: [
          {
            type: "text",
            text: `Removed element ${id} successfully`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Element with ID ${id} not found`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Connect flow nodes
mcpServer.registerTool(
  "connect-flow-nodes",
  {
    title: "Connect Flow Nodes",
    description: "Create a connection between two flow nodes",
    inputSchema: {
      fromId: z.string().describe("ID of the source flow node"),
      toId: z.string().describe("ID of the target flow node"),
    },
  },
  async ({ fromId, toId }) => {
    const success = whiteboardManager.connectFlowNodes(fromId, toId);
    if (success) {
      return {
        content: [
          {
            type: "text",
            text: `Connected flow node ${fromId} to ${toId}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Failed to connect nodes. Make sure both nodes exist and the source is a flow node.`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Search elements
mcpServer.registerTool(
  "search-elements",
  {
    title: "Search Elements",
    description: "Search for elements containing specific text",
    inputSchema: {
      query: z.string().describe("Text to search for in element content"),
    },
  },
  async ({ query }) => {
    const results = whiteboardManager.searchElements(query);
    return {
      content: [
        {
          type: "text",
          text: `Found ${results.length} elements matching "${query}": ${results
            .map((el) => `${el.type}:${el.id}`)
            .join(", ")}`,
        },
      ],
    };
  }
);

// Get element details
mcpServer.registerTool(
  "get-element",
  {
    title: "Get Element Details",
    description: "Get detailed information about a specific element",
    inputSchema: {
      id: z.string().describe("ID of the element to retrieve"),
    },
  },
  async ({ id }) => {
    const element = whiteboardManager.getElement(id);
    if (element) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(element, null, 2),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Element with ID ${id} not found`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Set entire whiteboard data
mcpServer.registerTool(
  "set-whiteboard-data",
  {
    title: "Set Whiteboard Data",
    description: "Replace the entire whiteboard with new data",
    inputSchema: {
      data: z
        .object({
          elements: z.array(z.any()),
        })
        .describe("Complete whiteboard data object"),
    },
  },
  async ({ data }) => {
    try {
      whiteboardManager.setData(data);
      return {
        content: [
          {
            type: "text",
            text: `Whiteboard data updated successfully with ${data.elements.length} elements`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating whiteboard data: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Clear whiteboard
mcpServer.registerTool(
  "clear-whiteboard",
  {
    title: "Clear Whiteboard",
    description: "Remove all elements from the whiteboard",
    inputSchema: {},
  },
  async () => {
    whiteboardManager.clearAll();
    return {
      content: [
        {
          type: "text",
          text: "Whiteboard cleared successfully",
        },
      ],
    };
  }
);

// ==================== PROMPTS ====================

mcpServer.registerPrompt(
  "analyze-whiteboard",
  {
    title: "Analyze Whiteboard",
    description: "Analyze the current whiteboard content and provide insights",
    argsSchema: {},
  },
  () => {
    const data = whiteboardManager.getData();
    const stats = whiteboardManager.getStats();

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Analyze this whiteboard data and provide insights about the content, structure, and potential improvements:

Current Statistics:
- Total Elements: ${stats.totalElements}
- Sticky Notes: ${stats.stickyNotes}
- Flow Nodes: ${stats.flowNodes}
- Mermaid Diagrams: ${stats.mermaidDiagrams}
- Embedded Links: ${stats.embeddedLinks}
- Connections: ${stats.connections}

Full Data:
${JSON.stringify(data, null, 2)}`,
          },
        },
      ],
    };
  }
);

mcpServer.registerPrompt(
  "suggest-improvements",
  {
    title: "Suggest Whiteboard Improvements",
    description:
      "Get suggestions for improving the whiteboard layout and content",
    argsSchema: {
      focus: z
        .enum(["layout", "content", "connections", "organization"])
        .optional()
        .describe("Specific area to focus suggestions on"),
    },
  },
  ({ focus }) => {
    const data = whiteboardManager.getData();

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Provide suggestions for improving this whiteboard${
              focus ? ` with focus on ${focus}` : ""
            }:

${JSON.stringify(data, null, 2)}

Consider:
- Element positioning and spacing
- Visual hierarchy and organization
- Missing connections or relationships
- Content clarity and completeness
- Overall design and usability`,
          },
        },
      ],
    };
  }
);

// ==================== SERVER SETUP ====================

async function startServer() {
  const args = process.argv.slice(2);

  if (args.includes("--stdio")) {
    // Start in stdio mode for direct MCP client connections
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.log("MCP Server running in stdio mode");
  } else {
    // Start HTTP server for web client connections
    const app = express();
    app.use(
      cors({
        origin: "*",
        exposedHeaders: ["Mcp-Session-Id"],
        allowedHeaders: ["Content-Type", "mcp-session-id"],
      })
    );
    app.use(express.json());

    const transports: { [sessionId: string]: StreamableHTTPServerTransport } =
      {};

    app.post("/mcp", async (req, res) => {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
      } else {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            transports[sessionId] = transport;
          },
          enableDnsRebindingProtection: false,
        });

        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
          }
        };

        await mcpServer.connect(transport);
      }

      await transport.handleRequest(req, res, req.body);
    });

    const handleSessionRequest = async (
      req: express.Request,
      res: express.Response
    ) => {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send("Invalid or missing session ID");
        return;
      }

      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    };

    app.get("/mcp", handleSessionRequest);
    app.delete("/mcp", handleSessionRequest);

    // Serve basic info page
    app.get("/", (req, res) => {
      res.json({
        name: "Whiteboard MCP Server",
        version: "1.0.0",
        description: "MCP server for whiteboard canvas application",
        websocket: "ws://localhost:8080",
        mcp_endpoint: "/mcp",
        connected_clients: wsManager.getConnectedClients(),
        whiteboard_stats: whiteboardManager.getStats(),
      });
    });

    const PORT = parseInt(process.env.PORT || "3001");
    app.listen(PORT, () => {
      console.log(`MCP HTTP Server running on port ${PORT}`);
      console.log(`WebSocket Server running on port 8080`);
      console.log(`Frontend should connect to: ws://localhost:8080`);
    });
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  wsManager.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  wsManager.close();
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
