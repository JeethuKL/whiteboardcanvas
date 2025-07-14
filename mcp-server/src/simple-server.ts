// Simple MCP server for whiteboard without external dependencies
import { WhiteboardManager } from "./whiteboard-manager.js";

// Initialize managers
const whiteboardManager = new WhiteboardManager();

// Simple server that can be enhanced with MCP SDK later
console.log("Whiteboard MCP Server Starting...");

// Example of how to create elements
const stickyNote = whiteboardManager.createStickyNote(
  100,
  100,
  "Hello from MCP!",
  "yellow"
);
console.log("Created sticky note:", stickyNote.id);

const flowNode = whiteboardManager.createFlowNode(
  300,
  200,
  "Start",
  "rectangle"
);
console.log("Created flow node:", flowNode.id);

const mermaidDiagram = whiteboardManager.createMermaidDiagram(
  500,
  300,
  `
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
`
);
console.log("Created mermaid diagram:", mermaidDiagram.id);

// Show current data
console.log("Current whiteboard data:");
console.log(JSON.stringify(whiteboardManager.getData(), null, 2));

// Show stats
console.log("Whiteboard statistics:");
console.log(whiteboardManager.getStats());

console.log("Basic MCP server ready!");

// This can be extended with the full MCP SDK once dependencies are installed
