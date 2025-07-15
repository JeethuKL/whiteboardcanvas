from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from schemas import MeetingContext, WhiteboardData
from agent import ScrumAgent
import asyncio

app = FastAPI(
    title="Scrum Meeting Agent API",
    description="API for a live scrum agent with Google ADK, STT/TTS, and whiteboard sync.",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state (replace with DB for production)
meeting_context = ScrumAgent().get_initial_context()
websockets = set()

@app.get("/meeting/context", response_model=MeetingContext)
async def get_meeting_context():
    """
    Get the full meeting context, including whiteboard and memory.
    """
    return meeting_context

@app.websocket("/ws/whiteboard")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websockets.add(websocket)
    try:
        while True:
            await asyncio.sleep(10)  # Keep alive
    except WebSocketDisconnect:
        websockets.remove(websocket)

async def broadcast_whiteboard():
    """
    Push the latest whiteboard JSON to all connected clients.
    """
    for ws in list(websockets):
        try:
            await ws.send_json(meeting_context.whiteboard.dict())
        except Exception:
            websockets.remove(ws)

@app.post("/meeting/start")
async def start_meeting():
    """
    Start the scrum meeting.
    """
    await ScrumAgent().start_meeting(meeting_context)
    await broadcast_whiteboard()
    return {"status": "started"}

@app.post("/meeting/next")
async def next_participant():
    """
    Move to the next participant.
    """
    await ScrumAgent().next_participant(meeting_context)
    await broadcast_whiteboard()
    return {"status": "next"}

@app.post("/meeting/speech")
async def process_speech(audio: bytes):
    """
    Process speech input (audio) and update context/whiteboard.
    """
    transcript = await ScrumAgent().process_speech(audio, meeting_context)
    await broadcast_whiteboard()
    return {"transcript": transcript}

# Add more endpoints as needed (manual note, end meeting, etc.)
