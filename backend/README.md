Start Meeting
POST /meeting/start
Purpose: Starts the scrum meeting and initializes context.
Authentication: None (add if needed)
Request: None

Get Meeting Context
GET /meeting/context
Purpose: Returns the full meeting context, including whiteboard and memory.


ebSocket: /ws/whiteboard
Purpose: Receive live whiteboard JSON updates.
4. Frontend Integration
Connect to /ws/whiteboard WebSocket for live updates.
On message, update your React whiteboard’s state with the new JSON.
(Optional) Use /meeting/context to fetch full context on load.
5. Context7 MCP Documentation
Use the above API doc style for each endpoint.
Add example requests/responses for each.
6. Next Steps
Set up Google Cloud credentials for STT/TTS.
Install dependencies and run FastAPI backend.
Connect your React frontend to the backend WebSocket.
Test: Start meeting, speak for each participant, see whiteboard update live.