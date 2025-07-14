# Whiteboard MCP Server

This is a Model Context Protocol (MCP) server for the Whiteboard Canvas application. It allows LLMs to interact directly with your whiteboard by creating, updating, and managing whiteboard elements.

## Features

- **Real-time Integration**: Connect your frontend directly to the MCP server
- **LLM Operations**: Allow LLMs to create sticky notes, flow nodes, Mermaid diagrams, and embedded links
- **JSON Management**: LLMs can modify the entire whiteboard through JSON manipulation
- **Live Updates**: Changes from LLMs are immediately reflected in your frontend

## Quick Start

1. **Install dependencies:**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Your frontend will automatically connect!**
   
   The whiteboard application will show an MCP status indicator in the top-right corner.

## MCP Tools Available

When connected to an LLM through MCP, the following tools are available:

### Create Elements
- `create-sticky-note` - Create sticky notes with position, text, and color
- `create-flow-node` - Create flow chart nodes with shapes and labels  
- `create-mermaid-diagram` - Create Mermaid diagrams with code
- `create-embedded-link` - Embed links and videos

### Manage Elements
- `update-element` - Update any element's properties
- `remove-element` - Delete elements by ID
- `connect-flow-nodes` - Create connections between flow nodes
- `search-elements` - Find elements by text content
- `get-element` - Get detailed element information

### Whiteboard Operations
- `set-whiteboard-data` - Replace entire whiteboard with new JSON
- `clear-whiteboard` - Remove all elements

## API Endpoints

When running, the server provides these HTTP endpoints:

- `GET /status` - Server health and statistics
- `GET /whiteboard-data` - Current whiteboard JSON
- `POST /whiteboard-data` - Update whiteboard JSON
- `POST /mcp/create-sticky` - Create sticky note via HTTP
- `POST /mcp/create-flow-node` - Create flow node via HTTP

## Example LLM Interactions

Once connected via MCP, you can ask the LLM things like:

- *"Create a sticky note at position 200,100 with the text 'Meeting Notes' in blue"*
- *"Add a flow chart showing the user registration process"*
- *"Create a Mermaid diagram of our system architecture"*
- *"Update the sticky note with ID 'note-123' to say 'Updated content'"*
- *"Clear the entire whiteboard and create a new project layout"*

## Architecture

```
Frontend (React) ←→ HTTP/WebSocket ←→ MCP Server ←→ LLM Client
```

The MCP server acts as a bridge between your whiteboard frontend and LLM applications, enabling seamless AI-powered whiteboard manipulation.

## Development

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript  
- `npm start` - Run production server
- `npm run stdio` - Run in MCP stdio mode

## Configuration

The server runs on:
- HTTP: `http://localhost:3001`
- WebSocket: `ws://localhost:8080` 

These can be configured by modifying the server files or setting environment variables.
