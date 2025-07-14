import { WhiteboardManager } from "./whiteboard-manager.js";
import { ServerMessage, WhiteboardData } from "./types.js";

export class WebSocketManager {
  private clients: Map<any, string> = new Map();
  private whiteboardManager: WhiteboardManager;

  constructor(port: number, whiteboardManager: WhiteboardManager) {
    this.whiteboardManager = whiteboardManager;
    this.setupWhiteboardSubscription();
    console.log(`WebSocket manager initialized for port ${port}`);
  }

  private setupWhiteboardSubscription() {
    this.whiteboardManager.onUpdate((data: WhiteboardData) => {
      this.broadcastToAllClients({
        type: "whiteboardData",
        data,
      });
    });
  }

  private broadcastToAllClients(message: ServerMessage) {
    console.log("Broadcasting message:", message.type);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  broadcastMessage(message: Omit<ServerMessage, "sessionId">) {
    this.broadcastToAllClients(message);
  }

  close() {
    // Cleanup when needed
  }
}
