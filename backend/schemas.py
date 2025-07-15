from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class WhiteboardElement(BaseModel):
    id: str
    type: str
    x: float
    y: float
    text: Optional[str] = None
    color: Optional[str] = None
    label: Optional[str] = None
    shape: Optional[str] = None
    connections: Optional[List[str]] = None
    mermaidCode: Optional[str] = None
    url: Optional[str] = None
    embedType: Optional[str] = None

class WhiteboardData(BaseModel):
    elements: List[WhiteboardElement]

class MeetingParticipant(BaseModel):
    id: str
    name: str
    role: str

class MeetingContext(BaseModel):
    id: str
    status: str
    participants: List[MeetingParticipant]
    current_speaker: Optional[str]
    agenda: List[str]
    notes: List[str]
    whiteboard: WhiteboardData
    memory: Dict[str, Any]
