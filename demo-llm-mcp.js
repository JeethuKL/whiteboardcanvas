#!/usr/bin/env node

// Demo script showing how an LLM can interact with the whiteboard via MCP
const SERVER_URL = "http://localhost:3002";

async function makeRequest(endpoint, method = "GET", data = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    return null;
  }
}

async function demonstrateMCPCommands() {
  console.log("🤖 LLM MCP Whiteboard Demo");
  console.log("===========================\n");

  // Check server status
  console.log("1. Checking MCP server status...");
  const status = await makeRequest("/status");
  console.log("   Status:", status);
  console.log();

  // Get current whiteboard data
  console.log("2. Getting current whiteboard data...");
  const currentData = await makeRequest("/whiteboard-data");
  console.log("   Current elements:", currentData?.elements?.length || 0);
  console.log();

  // Create a sticky note (simulating LLM command)
  console.log("3. LLM creating a sticky note...");
  const stickyResult = await makeRequest("/mcp/create-sticky", "POST", {
    x: 400,
    y: 300,
    text: "Created by LLM via MCP! 🤖",
    color: "blue",
  });
  console.log("   Created:", stickyResult);
  console.log();

  // Create a flow node (simulating LLM command)
  console.log("4. LLM creating a flow node...");
  const flowResult = await makeRequest("/mcp/create-flow-node", "POST", {
    x: 600,
    y: 200,
    label: "AI Process",
    shape: "diamond",
  });
  console.log("   Created:", flowResult);
  console.log();

  // Update entire whiteboard (simulating LLM command)
  console.log("5. LLM updating entire whiteboard with new layout...");
  const newWhiteboardData = {
    elements: [
      {
        type: "sticky",
        id: "llm-note-1",
        x: 100,
        y: 100,
        text: "Project Overview 📋",
        color: "yellow",
      },
      {
        type: "sticky",
        id: "llm-note-2",
        x: 300,
        y: 100,
        text: "Goals & Objectives 🎯",
        color: "green",
      },
      {
        type: "flow-node",
        id: "llm-flow-1",
        x: 500,
        y: 150,
        label: "Start Process",
        shape: "rectangle",
        connections: ["llm-flow-2"],
      },
      {
        type: "flow-node",
        id: "llm-flow-2",
        x: 700,
        y: 150,
        label: "Complete",
        shape: "circle",
        connections: [],
      },
      {
        type: "mermaid",
        id: "llm-mermaid-1",
        x: 100,
        y: 300,
        mermaidCode: `graph LR
    A[User Input] --> B{Validate}
    B -->|Valid| C[Process]
    B -->|Invalid| D[Error]
    C --> E[Success]`,
      },
    ],
  };

  const updateResult = await makeRequest(
    "/whiteboard-data",
    "POST",
    newWhiteboardData
  );
  console.log("   Updated:", updateResult);
  console.log();

  // Final status
  console.log("6. Final whiteboard status...");
  const finalData = await makeRequest("/whiteboard-data");
  console.log("   Total elements:", finalData?.elements?.length || 0);
  console.log(
    "   Element types:",
    finalData?.elements?.map((e) => e.type).join(", ") || "none"
  );
  console.log();

  console.log("✅ Demo complete!");
  console.log("🌐 Open http://localhost:5175 to see the whiteboard");
  console.log("🔗 MCP Server running at http://localhost:3002");
  console.log(
    "\nThe whiteboard should now show the elements created by the simulated LLM commands!"
  );
}

// Run the demo
demonstrateMCPCommands().catch(console.error);
