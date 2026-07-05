# ReCall

[![Cursor Buildathon Colombo 2026](https://img.shields.io/badge/Cursor-24H%20Buildathon%202026-000000?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5bC01LjQ2IDQuNzRMMTYuMTggMjIgMTIgMTguMjcgNy44MiAyMiA5LjU0IDEzLjc0IDQgOS4xMSAxMC45MSA4LjI2IDEyIDJ6Ii8+PC9zdmc+)](https://buildathon.cursorsrilanka.com/)
[![Demo](https://img.shields.io/badge/Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtube.com/shorts/dYMUKUocIl4)
[![Team SustainX](https://img.shields.io/badge/Team-SustainX-f0b429?style=for-the-badge)](https://github.com/hisshanzzz/recall)

AI companion for dementia patients in Sri Lanka. **Ama** speaks with patients using their memory book; caregivers receive session summaries after each call.

> **Built in 24 hours** at the Cursor Buildathon Colombo (May 16–17, 2026) by Team SustainX.

## About this project

| | |
|---|---|
| **Event** | Cursor 24H Buildathon Colombo 2026 (Team SustainX) |
| **Demo video** | [Project ReCall on YouTube](https://youtube.com/shorts/dYMUKUocIl4) |
| **Original repo** | [methuliH/recall](https://github.com/methuliH/recall) |
| **Team** | Hiruka Devendra, Methuli Heenkenda, Sehara Kodikara, Mohamed Jaufer Mohamed Hisshan |

We hope to explore collaboration with the **Lanka Alzheimer's Foundation, Colombo** in the future.

---

## Run locally (two terminals)

**Terminal 1 — Python voice agent (LiveKit + Beyond Presence):**

```bash
cd livekit-bey-agent
cp .env.example .env
# Fill in LIVEKIT_*, GOOGLE_API_KEY, GOOGLE_APPLICATION_CREDENTIALS, BEY_*
uv run agent.py dev
```

**Terminal 2 — Next.js frontend:**

```bash
npm install
cp .env.local.example .env.local
# Fill in LIVEKIT_* (same project as agent)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## LiveKit dispatch rule

In [LiveKit Cloud](https://cloud.livekit.io) → **Agents** → **Dispatch rules**:

| Field | Value |
|-------|--------|
| Rule type | Individual |
| Room prefix | `recall-room` |
| Agent | `ama` |

## Environment variables

### Next.js (`.env.local`)

| Variable | Purpose |
|----------|---------|
| `LIVEKIT_URL` | Server-side LiveKit URL (`wss://...`) |
| `LIVEKIT_API_KEY` | API key |
| `LIVEKIT_API_SECRET` | API secret |
| `NEXT_PUBLIC_LIVEKIT_URL` | Client connect URL (usually same as `LIVEKIT_URL`) |
| `SESSION_WEBHOOK_SECRET` | Bearer token for `POST /api/sessions/end` (same as agent `.env`) |
| `USE_SUPABASE` | `false` = in-memory sessions (no DB). Auto-on if Supabase URL + service role key are set |

### Run without Supabase (local demo)

1. Set `USE_SUPABASE=false` in `.env.local` (or leave out Supabase keys).
2. Set `SESSION_WEBHOOK_SECRET` and the same secret in `livekit-bey-agent/.env`.
3. Set `RECALL_APP_URL=http://localhost:3000` in the agent `.env`.
4. Start Next.js + agent as usual. Transcripts persist until you restart `npm run dev`.

For production persistence, use Supabase: run `supabase/migrations/001_sessions.sql`, set `USE_SUPABASE=true`, and add `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

### Python agent (`livekit-bey-agent/.env`)

See [`livekit-bey-agent/.env.example`](livekit-bey-agent/.env.example). Do not wrap values in quotes.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/patient` | Patient home |
| `/patient/start` | Handoff — memory chips, begin session |
| `/patient/loading` | Token fetch + agent dispatch |
| `/patient/call` | LiveKit call with Ama avatar |
| `/caregiver` | Caregiver dashboard |
| `/caregiver/summary` | Session end + WhatsApp preview |

## Flow

Caregiver **Start session with Thatha** → `/patient/start` → **Begin session** → `/patient/loading` (POST `/api/livekit/token`) → `/patient/call` (LiveKit room) → end call → `/caregiver/summary`.

## Deploy

| Component | Platform | Command |
|-----------|----------|---------|
| Frontend | Netlify | `npm run build` |
| Agent | Railway | `uv run agent.py start` in `livekit-bey-agent/` |

See `project_overview.md` for WhatsApp/webhook APIs (not yet wired). The voice stack uses **Google STT + Gemini LLM/TTS + Beyond Presence** (see `livekit-bey-agent/`).
