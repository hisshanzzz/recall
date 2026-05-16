# Recall LiveKit + Beyond Presence agent

Python voice agent for Recall patient calls: Deepgram STT/TTS, Groq LLM, Silero VAD, Beyond Presence avatar via `livekit-plugins-bey`.

## API keys

Copy `.env.example` to `.env` (no quotes around values).

| Variable | Where to get it |
|----------|-----------------|
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | [cloud.livekit.io](https://cloud.livekit.io) → Settings → Keys |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `DEEPGRAM_API_KEY` | [deepgram.com](https://deepgram.com) |
| `BEY_API_KEY`, `BEY_AVATAR_ID` | [app.bey.chat](https://app.bey.chat) |

The Next.js app uses the same LiveKit URL/keys for token generation (see root `.env.local.example`).

## LiveKit dispatch rule

In [LiveKit Cloud](https://cloud.livekit.io) → **Agents** → **Dispatch rules** → **Create rule**:

| Field | Value |
|-------|--------|
| Rule type | Individual |
| Room prefix | `recall-room` |
| Agent | `ama` |

The agent registers as `ama` in `agent.py` (`WorkerOptions(agent_name="ama")`).

## Run locally

**Terminal 1 — agent:**

```bash
cd livekit-bey-agent
uv run agent.py dev
```

**Terminal 2 — Next.js (repo root):**

```bash
npm run dev
```

Flow: caregiver starts session → patient loading fetches token → `/patient/call` connects to LiveKit.

## Deploy (Railway)

- Root directory: `livekit-bey-agent`
- Start command: `uv run agent.py start`
- Set all env vars from `.env.example`

## Notes

- Do not use Google STT/TTS (requires Cloud service account, not API keys).
- Do not use decommissioned Groq model `llama3-70b-8192`; use `llama-3.3-70b-versatile`.
- Avatar API: `await avatar.start(session, room)` then `await session.start(...)` per installed `livekit-plugins-bey`.
