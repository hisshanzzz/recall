# Recall API

## POST /api/livekit/token

Creates a LiveKit room, dispatches the `ama` agent, and returns a patient join token.

**Request body (optional):**

```json
{
  "room": "recall-room-abc12345",
  "identity": "patient-abc12345"
}
```

If omitted, the server generates `recall-room-{uuid}` and `patient-{uuid}`.

**Response:**

```json
{
  "token": "eyJhbGci...",
  "url": "wss://your-project.livekit.cloud",
  "room": "recall-room-a1b2c3d4",
  "identity": "patient-e5f6g7h8"
}
```

**Errors:**

```json
{ "error": "Missing LIVEKIT_URL, LIVEKIT_API_KEY, or LIVEKIT_API_SECRET" }
```

Used by: `/patient/loading` (prefetch) and `/patient/call` (fallback if session storage is empty).

---

## Planned (see project_overview.md)

- `POST /api/webhook` — Beyond Presence call-end transcript
- `POST /api/summary` — Claude summary for WhatsApp
