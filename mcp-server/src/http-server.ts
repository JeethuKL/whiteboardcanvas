// Simple HTTP server for MCP whiteboard integration
import { createServer } from "http";
import { parse } from "url";
import { WhiteboardManager } from "./whiteboard-manager.js";

const whiteboardManager = new WhiteboardManager();
const PORT = 3002;

const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = parse(req.url || "", true);
  const path = parsedUrl.pathname;

  // Handle different routes
  if (path === "/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "connected",
        server: "whiteboard-mcp",
        stats: whiteboardManager.getStats(),
      })
    );
  } else if (path === "/whiteboard-data" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(whiteboardManager.getData()));
  } else if (path === "/whiteboard-data" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        whiteboardManager.setData(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else if (path === "/mcp/create-sticky" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { x, y, text, color } = JSON.parse(body);
        const element = whiteboardManager.createStickyNote(x, y, text, color);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, element }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request" }));
      }
    });
  } else if (path === "/mcp/create-flow-node" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const { x, y, label, shape } = JSON.parse(body);
        const element = whiteboardManager.createFlowNode(x, y, label, shape);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, element }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request" }));
      }
    });
  } else if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "Whiteboard MCP Server",
        version: "1.0.0",
        description: "MCP server for whiteboard canvas application",
        endpoints: {
          "/status": "GET - Server status",
          "/whiteboard-data": "GET/POST - Get or set whiteboard data",
          "/mcp/create-sticky": "POST - Create sticky note",
          "/mcp/create-flow-node": "POST - Create flow node",
        },
        stats: whiteboardManager.getStats(),
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Whiteboard MCP Server running on http://localhost:${PORT}`);
  console.log(`📊 Status endpoint: http://localhost:${PORT}/status`);
  console.log(`📋 Whiteboard data: http://localhost:${PORT}/whiteboard-data`);
  console.log(`🔗 Connect your frontend to this server for MCP integration`);
});

export default server;
