#!/bin/bash

echo "🔧 Setting up Whiteboard MCP Server..."

cd mcp-server

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building TypeScript..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  cd mcp-server"
echo "  npm start"
echo ""
echo "For development with auto-reload:"
echo "  cd mcp-server" 
echo "  npm run dev"
echo ""
echo "The server will run on http://localhost:3001"
echo "Your frontend will automatically connect to it!"
