# Whiteboard Canvas with MCP Integration 🎨🤖

A dynamic, interactive whiteboard application with **Model Context Protocol (MCP)** integration that allows LLMs to directly interact with and modify your whiteboard in real-time.

## Features

### 🎨 Interactive Whiteboard
- **Sticky Notes** with multiple colors and editable text
- **Flow Nodes** with different shapes (rectangle, diamond, circle, ellipse)
- **Mermaid Diagrams** with live code editing and rendering
- **Embedded Links** for websites, videos, and other content
- **Drag & Drop** interface with zoom and pan controls
- **JSON Editor** for direct data manipulation

### 🤖 MCP Integration
- **Real-time LLM interaction** with your whiteboard
- **Direct element creation** - LLMs can add sticky notes, flow nodes, diagrams
- **Content modification** - Update text, colors, positions, and properties
- **Intelligent layout** - AI can organize and structure your whiteboard
- **JSON manipulation** - Complete whiteboard state management

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd whiteboardCanvas
npm install
```

### 2. Start MCP Server
```bash
cd mcp-server
npm install
npm run dev
```
The MCP server will start on `http://localhost:3002`

### 3. Start Frontend
```bash
# In the main directory
npm run dev
```
The whiteboard will open at `http://localhost:5175`

### 4. Test LLM Integration
```bash
node demo-llm-mcp.js
```

## MCP Server API

### Core Endpoints
- `GET /status` - Server health and statistics
- `GET /whiteboard-data` - Current whiteboard JSON
- `POST /whiteboard-data` - Update entire whiteboard
- `POST /mcp/create-sticky` - Create sticky note
- `POST /mcp/create-flow-node` - Create flow node

### LLM Commands Available

When connected via MCP, LLMs can use these tools:

#### Element Creation
```javascript
// Create sticky note
create-sticky-note({
  x: 200, y: 100,
  text: "Meeting Notes",
  color: "blue"
})

// Create flow node
create-flow-node({
  x: 400, y: 200,
  label: "Process Step",
  shape: "diamond"
})

// Create Mermaid diagram
create-mermaid-diagram({
  x: 100, y: 300,
  mermaidCode: "graph TD; A-->B; B-->C;"
})
```

#### Element Management
```javascript
// Update any element
update-element({
  id: "sticky-123",
  updates: { text: "Updated content", color: "green" }
})

// Remove element
remove-element({ id: "flow-456" })

// Connect flow nodes
connect-flow-nodes({ fromId: "node-1", toId: "node-2" })
```

#### Whiteboard Operations
```javascript
// Replace entire whiteboard
set-whiteboard-data({
  data: { elements: [...] }
})

// Clear everything
clear-whiteboard()

// Search content
search-elements({ query: "meeting" })
```

## Example LLM Interactions

Once connected via MCP, you can ask an LLM:

### 💬 Natural Language Commands
- *"Create a sticky note at position 200,100 with 'Project Goals' in yellow"*
- *"Add a flow chart showing the user registration process"*
- *"Create a Mermaid diagram of our system architecture"*
- *"Update all sticky notes to use blue color"*
- *"Organize the whiteboard elements in a grid layout"*
- *"Create a project planning board with phases and tasks"*

### 🔧 Complex Operations
- *"Clear the whiteboard and create a new meeting agenda layout"*
- *"Connect all the flow nodes to show the process flow"*
- *"Add timestamps and priority levels to all sticky notes"*
- *"Create a mind map structure for brainstorming"*

## Architecture

```
┌─────────────────┐    HTTP/WS    ┌─────────────────┐    MCP    ┌─────────────────┐
│                 │◄──────────────►│                 │◄──────────►│                 │
│  React Frontend │               │   MCP Server    │           │   LLM Client    │
│                 │               │                 │           │                 │
└─────────────────┘               └─────────────────┘           └─────────────────┘
│                                 │                             │
│ • Interactive UI                │ • Whiteboard State          │ • Natural Language
│ • Real-time Updates             │ • Element Management        │ • Tool Execution  
│ • JSON Editor                   │ • HTTP/WebSocket API        │ • JSON Generation
│ • Drag & Drop                   │ • MCP Protocol              │ • Content Creation
└─────────────────────────────────┴─────────────────────────────┴─────────────────────┘
```

## Project Structure

```
whiteboardCanvas/
├── src/
│   ├── components/          # React components
│   │   ├── Whiteboard.tsx  # Main whiteboard component
│   │   ├── StickyNote.tsx  # Sticky note element
│   │   ├── FlowNode.tsx    # Flow chart node
│   │   └── ...
│   ├── hooks/
│   │   └── useMCPConnection.tsx  # MCP integration hook
│   └── types/
│       └── whiteboard.ts   # TypeScript definitions
├── mcp-server/             # MCP server implementation
│   ├── src/
│   │   ├── server.ts       # Full MCP server with SDK
│   │   ├── http-server.ts  # Simple HTTP API server
│   │   ├── whiteboard-manager.ts  # Core logic
│   │   └── types.ts        # Shared type definitions
│   └── package.json
├── demo-llm-mcp.js        # Demo script
└── README.md
```

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### MCP Server Development
```bash
cd mcp-server
npm run dev          # Start with auto-reload
npm run simple       # Run basic test server
npm run stdio        # Run in MCP stdio mode
npm run build        # Build TypeScript
```

### Testing MCP Integration
```bash
node demo-llm-mcp.js    # Run demo commands
```

## Configuration

### Server Ports
- Frontend: `http://localhost:5175`
- MCP Server: `http://localhost:3002`
- WebSocket: `ws://localhost:8080` (planned)

### Environment Variables
```bash
PORT=3002              # MCP server port
FRONTEND_URL=http://localhost:5175  # Frontend URL for CORS
```

## Features in Detail

### 🎨 Whiteboard Elements

#### Sticky Notes
- Multiple colors (yellow, pink, blue, green, purple, orange)
- Editable text with markdown support
- Drag and drop positioning
- Hover effects and animations

#### Flow Nodes
- Multiple shapes (rectangle, diamond, circle, ellipse)
- Connectable with arrows
- Editable labels
- Visual flow representation

#### Mermaid Diagrams
- Live code editing
- Real-time rendering
- Syntax error handling
- Professional diagram generation

#### Embedded Content
- iframe embedding
- YouTube video support
- External link integration
- Responsive sizing

### 🤖 MCP Integration Features

#### Real-time Synchronization
- Instant updates from LLM actions
- Bidirectional data flow
- Conflict resolution
- State consistency

#### Natural Language Processing
- Convert text descriptions to elements
- Intelligent positioning
- Content generation
- Layout optimization

#### Advanced AI Operations
- Batch element creation
- Pattern recognition
- Auto-organization
- Smart connections

## Use Cases

### 📊 Business Applications
- **Project Planning**: AI-generated Gantt charts and timelines
- **Meeting Notes**: Automated sticky note organization
- **Process Mapping**: Flow chart generation from descriptions
- **Brainstorming**: AI-assisted idea organization

### 🎓 Educational Use
- **Learning Diagrams**: Auto-generated concept maps
- **Study Guides**: AI-structured content layout
- **Presentations**: Dynamic slide content creation
- **Research Organization**: Reference and note management

### 🛠️ Development Workflows
- **System Architecture**: AI-generated technical diagrams
- **API Documentation**: Interactive flow charts
- **Code Review**: Visual process mapping
- **Sprint Planning**: Automated board organization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the MCP integration
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [MCP Specification](https://spec.modelcontextprotocol.io)
- 🔧 [Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

**🚀 Ready to let AI transform your whiteboard experience!**
