import { useState, useEffect, useCallback } from 'react';
import { WhiteboardData } from '../types/whiteboard';

interface MCPConnection {
  isConnected: boolean;
  sendWhiteboardData: (data: WhiteboardData) => void;
  data: WhiteboardData | null;
  error: string | null;
}

export function useMCPConnection(serverUrl: string = 'http://localhost:3002'): MCPConnection {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<WhiteboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple HTTP-based connection to MCP server
  const sendWhiteboardData = useCallback(async (whiteboardData: WhiteboardData) => {
    try {
      const response = await fetch(`${serverUrl}/whiteboard-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whiteboardData),
      });

      if (response.ok) {
        console.log('Whiteboard data sent to MCP server successfully');
      } else {
        console.error('Failed to send whiteboard data to MCP server');
      }
    } catch (err) {
      console.error('Error sending whiteboard data to MCP server:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [serverUrl]);

  // Polling for updates from MCP server
  useEffect(() => {
    let intervalId: number;

    const checkConnection = async () => {
      try {
        const response = await fetch(`${serverUrl}/status`);
        if (response.ok) {
          setIsConnected(true);
          setError(null);
          
          // Try to get current whiteboard data
          const dataResponse = await fetch(`${serverUrl}/whiteboard-data`);
          if (dataResponse.ok) {
            const serverData = await dataResponse.json();
            setData(serverData);
          }
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    checkConnection();
    intervalId = window.setInterval(checkConnection, 5000); // Check every 5 seconds

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [serverUrl]);

  return {
    isConnected,
    sendWhiteboardData,
    data,
    error,
  };
}

// MCP Status indicator component
export function MCPStatusIndicator({ connection }: { connection: MCPConnection }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
          connection.isConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}
      >
        <div 
          className={`w-2 h-2 rounded-full ${
            connection.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {connection.isConnected ? 'MCP Connected' : 'MCP Disconnected'}
        {connection.error && (
          <span className="text-xs">({connection.error})</span>
        )}
      </div>
    </div>
  );
}
