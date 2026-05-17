# Recall LiveKit + Beyond Presence agent

Python voice agent for Recall patient calls: Google Cloud STT (Chirp 2, `us-central1`), Gemini LLM, Gemini TTS (beta), Silero VAD, Beyond Presence avatar via `livekit-plugins-bey`.

## API keys

Copy `.env.example` to `.env` (no quotes around values).

| Variable | Used for | Where to get it |
|----------|----------|-----------------|
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | LiveKit room | [cloud.livekit.io](https://cloud.livekit.io) → Settings → Keys |
| `GOOGLE_API_KEY` | Gemini LLM + Gemini TTS | [Google AI Studio](https://aistudio.google.com) |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Cloud STT (Chirp 2) only | Service account JSON from [Google Cloud Console](https://console.cloud.google.com) with **Speech-to-Text API** enabled. Agent uses model `chirp_2` in `us-central1` (not the deprecated v1 `chirp` name). |
| `BEY_API_KEY`, `BEY_AVATAR_ID` | Avatar | [app.bey.chat](https://app.bey.chat) |
| `RECALL_APP_URL`, `SESSION_WEBHOOK_SECRET` | Post-call webhook | Same secret as Next.js `.env.local` |

**Do not confuse the two Google credentials:** `GOOGLE_API_KEY` is a string API key; `GOOGLE_APPLICATION_CREDENTIALS` is a **file path** to a JSON key file (place `service-account.json` in this folder or adjust the path).

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
- Upload `service-account.json` or set `GOOGLE_APPLICATION_CREDENTIALS` to your secret mount path

## Notes

- Avatar API: `await avatar.start(session, room)` then `await session.start(...)` per installed `livekit-plugins-bey`.
- On Windows, prefer `./service-account.json` over backslash paths for `GOOGLE_APPLICATION_CREDENTIALS`.
