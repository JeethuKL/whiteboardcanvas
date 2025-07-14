// Whiteboard types that match your frontend
export interface BaseElement {
  id: string;
  x: number;
  y: number;
  type: string;
}

export interface StickyNote extends BaseElement {
  type: "sticky";
  text: string;
  color: string;
}

export interface FlowNode extends BaseElement {
  type: "flow-node";
  label: string;
  shape: "rectangle" | "diamond" | "circle" | "ellipse";
  connections: string[];
}

export interface MermaidDiagram extends BaseElement {
  type: "mermaid";
  mermaidCode: string;
}

export interface EmbeddedLink extends BaseElement {
  type: "embed";
  url: string;
  embedType: "iframe" | "video";
}

export type WhiteboardElement =
  | StickyNote
  | FlowNode
  | MermaidDiagram
  | EmbeddedLink;

export interface WhiteboardData {
  elements: WhiteboardElement[];
}

export interface ClientMessage {
  type: "whiteboardUpdate" | "subscribe" | "unsubscribe";
  data?: WhiteboardData;
  sessionId?: string;
}

export interface ServerMessage {
  type: "whiteboardData" | "error" | "connected";
  data?: WhiteboardData;
  message?: string;
  sessionId?: string;
}
