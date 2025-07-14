import {
  WhiteboardData,
  WhiteboardElement,
  StickyNote,
  FlowNode,
  MermaidDiagram,
  EmbeddedLink,
} from "./types.js";

export class WhiteboardManager {
  private whiteboardData: WhiteboardData;
  private updateCallbacks: Set<(data: WhiteboardData) => void> = new Set();

  constructor(initialData?: WhiteboardData) {
    this.whiteboardData = initialData || {
      elements: [
        {
          type: "sticky",
          id: "welcome-note",
          x: 100,
          y: 150,
          text: "Welcome! This whiteboard is now connected to MCP 🎨",
          color: "yellow",
        },
      ],
    };
  }

  // Subscribe to whiteboard changes
  onUpdate(callback: (data: WhiteboardData) => void): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  // Notify all subscribers of changes
  private notifyUpdate() {
    this.updateCallbacks.forEach((callback) => {
      try {
        callback(this.whiteboardData);
      } catch (error) {
        console.error("Error in update callback:", error);
      }
    });
  }

  // Get current whiteboard data
  getData(): WhiteboardData {
    return JSON.parse(JSON.stringify(this.whiteboardData));
  }

  // Set entire whiteboard data
  setData(data: WhiteboardData): void {
    this.whiteboardData = data;
    this.notifyUpdate();
  }

  // Add a new element
  addElement(
    element: Omit<WhiteboardElement, "id"> &
      Partial<Pick<WhiteboardElement, "id">>
  ): WhiteboardElement {
    const newElement: WhiteboardElement = {
      id:
        element.id ||
        `${element.type}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      ...element,
    } as WhiteboardElement;

    this.whiteboardData.elements.push(newElement);
    this.notifyUpdate();
    return newElement;
  }

  // Update an existing element
  updateElement(
    id: string,
    updates: Partial<WhiteboardElement>
  ): WhiteboardElement | null {
    const elementIndex = this.whiteboardData.elements.findIndex(
      (el) => el.id === id
    );
    if (elementIndex === -1) {
      return null;
    }

    this.whiteboardData.elements[elementIndex] = {
      ...this.whiteboardData.elements[elementIndex],
      ...updates,
      id, // Ensure ID doesn't change
    } as WhiteboardElement;

    this.notifyUpdate();
    return this.whiteboardData.elements[elementIndex];
  }

  // Remove an element
  removeElement(id: string): boolean {
    const initialLength = this.whiteboardData.elements.length;
    this.whiteboardData.elements = this.whiteboardData.elements.filter(
      (el) => el.id !== id
    );

    if (this.whiteboardData.elements.length < initialLength) {
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  // Get element by ID
  getElement(id: string): WhiteboardElement | null {
    return this.whiteboardData.elements.find((el) => el.id === id) || null;
  }

  // Get elements by type
  getElementsByType(type: string): WhiteboardElement[] {
    return this.whiteboardData.elements.filter((el) => el.type === type);
  }

  // Clear all elements
  clearAll(): void {
    this.whiteboardData.elements = [];
    this.notifyUpdate();
  }

  // Create a sticky note
  createStickyNote(
    x: number,
    y: number,
    text: string,
    color: string = "yellow"
  ): StickyNote {
    const element: Omit<StickyNote, "id"> = {
      type: "sticky",
      x,
      y,
      text,
      color,
    };
    return this.addElement(element) as StickyNote;
  }

  // Create a flow node
  createFlowNode(
    x: number,
    y: number,
    label: string,
    shape: "rectangle" | "diamond" | "circle" | "ellipse" = "rectangle"
  ): FlowNode {
    const element: Omit<FlowNode, "id"> = {
      type: "flow-node",
      x,
      y,
      label,
      shape,
      connections: [],
    };
    return this.addElement(element) as FlowNode;
  }

  // Create a mermaid diagram
  createMermaidDiagram(
    x: number,
    y: number,
    mermaidCode: string
  ): MermaidDiagram {
    const element: Omit<MermaidDiagram, "id"> = {
      type: "mermaid",
      x,
      y,
      mermaidCode,
    };
    return this.addElement(element) as MermaidDiagram;
  }

  // Create an embedded link
  createEmbeddedLink(
    x: number,
    y: number,
    url: string,
    embedType: "iframe" | "video" = "iframe"
  ): EmbeddedLink {
    const element: Omit<EmbeddedLink, "id"> = {
      type: "embed",
      x,
      y,
      url,
      embedType,
    };
    return this.addElement(element) as EmbeddedLink;
  }

  // Connect two flow nodes
  connectFlowNodes(fromId: string, toId: string): boolean {
    const fromElement = this.getElement(fromId);
    if (!fromElement || fromElement.type !== "flow-node") {
      return false;
    }

    const toElement = this.getElement(toId);
    if (!toElement) {
      return false;
    }

    const flowNode = fromElement as FlowNode;
    if (!flowNode.connections.includes(toId)) {
      flowNode.connections.push(toId);
      this.notifyUpdate();
      return true;
    }

    return false;
  }

  // Disconnect flow nodes
  disconnectFlowNodes(fromId: string, toId: string): boolean {
    const fromElement = this.getElement(fromId);
    if (!fromElement || fromElement.type !== "flow-node") {
      return false;
    }

    const flowNode = fromElement as FlowNode;
    const initialLength = flowNode.connections.length;
    flowNode.connections = flowNode.connections.filter((id) => id !== toId);

    if (flowNode.connections.length < initialLength) {
      this.notifyUpdate();
      return true;
    }

    return false;
  }

  // Search elements by text content
  searchElements(query: string): WhiteboardElement[] {
    const lowercaseQuery = query.toLowerCase();
    return this.whiteboardData.elements.filter((element) => {
      switch (element.type) {
        case "sticky":
          return (element as StickyNote).text
            .toLowerCase()
            .includes(lowercaseQuery);
        case "flow-node":
          return (element as FlowNode).label
            .toLowerCase()
            .includes(lowercaseQuery);
        case "mermaid":
          return (element as MermaidDiagram).mermaidCode
            .toLowerCase()
            .includes(lowercaseQuery);
        case "embed":
          return (element as EmbeddedLink).url
            .toLowerCase()
            .includes(lowercaseQuery);
        default:
          return false;
      }
    });
  }

  // Get statistics about the whiteboard
  getStats() {
    const stats = {
      totalElements: this.whiteboardData.elements.length,
      stickyNotes: 0,
      flowNodes: 0,
      mermaidDiagrams: 0,
      embeddedLinks: 0,
      connections: 0,
    };

    this.whiteboardData.elements.forEach((element) => {
      switch (element.type) {
        case "sticky":
          stats.stickyNotes++;
          break;
        case "flow-node":
          stats.flowNodes++;
          stats.connections += (element as FlowNode).connections.length;
          break;
        case "mermaid":
          stats.mermaidDiagrams++;
          break;
        case "embed":
          stats.embeddedLinks++;
          break;
      }
    });

    return stats;
  }
}
