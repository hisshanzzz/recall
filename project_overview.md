# Recall — Project Overview for Cursor Plan Mode

## What we are building
Recall is a web-based AI companion for dementia patients in Sri Lanka.
A digital avatar called Nanda speaks Sinhala, knows the patient's life
story, and has warm conversations with them. After every session, the
patient's family automatically gets a WhatsApp summary.

## The two users
- Patient (Sunil, 74, dementia) — sits in front of a tablet, talks to Nanda
- Caregiver (Pradeep, son in Melbourne) — manages memory book, gets WhatsApp alerts

## Core tech stack
- Frontend: Next.js 14 App Router, Tailwind CSS, TypeScript, Inter font
- Avatar + voice: Beyond Presence + Gemini Live API + LiveKit
- AI summary: Claude API (Anthropic)
- WhatsApp: Twilio
- Frontend deploy: Netlify
- Agent deploy: Railway (Python)

---

## Project file structure

```
recall-app/
├── app/
│   ├── patient/
│   │   ├── page.tsx                  # Patient home — big call button
│   │   ├── call/page.tsx             # Patient call — full screen avatar
│   │   ├── start/page.tsx            # Transition — handoff moment
│   │   └── loading/page.tsx          # Loading — BP injecting context
│   ├── caregiver/
│   │   ├── page.tsx                  # Caregiver dashboard
│   │   └── summary/page.tsx          # Session end + WhatsApp preview
│   └── api/
│       ├── token/route.ts            # POST — generates LiveKit room token
│       ├── webhook/route.ts          # POST — receives BP call-end + transcript
│       └── summary/route.ts          # POST — Claude summary → Twilio WhatsApp
├── components/
│   ├── Avatar.tsx                    # SVG avatar face
│   ├── WaveBars.tsx                  # Animated speaking indicator
│   ├── MemoryChip.tsx                # Memory tag pill
│   └── MoodChart.tsx                 # Weekly mood bar chart
├── lib/
│   ├── claude.ts                     # Claude API helper
│   ├── twilio.ts                     # Twilio WhatsApp helper
│   ├── livekit.ts                    # LiveKit token generator
│   └── memory.ts                     # Build system prompt from patient profile
├── data/
│   └── patients.ts                   # Hardcoded Sunil profile for demo
├── livekit-agent/                    # Separate Python project → deployed to Railway
│   ├── main.py                       # Gemini Live + BP LiveKit agent
│   ├── requirements.txt
│   └── .env
├── tailwind.config.ts
├── API.md
└── .env.local
```

---

## Colour palette — add to tailwind.config.ts

```ts
colors: {
  coffee:  '#371E13',
  maroon:  '#5E2A25',
  clay:    '#C0AA8A',
  creme:   '#E1D3A9',
  leather: '#734F31',
  peach:   '#A85530',
  guave:   '#8F7C3A',
  pine:    '#534B31',
  offwhite: '#FAF6EE',
}
```

---

## Environment variables

### Next.js — .env.local
```
ANTHROPIC_API_KEY=
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
NEXT_PUBLIC_LIVEKIT_URL=
```

### Python agent — livekit-agent/.env
```
BEY_API_KEY=
GOOGLE_API_KEY=
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
```

---

## Hardcoded demo patient — data/patients.ts

```ts
export const SUNIL = {
  id: "sunil-001",
  name: "Sunil Perera",
  nick: "Thatha",
  age: 74,
  location: "Colombo 7",
  condition: "Dementia (moderate)",
  language: "sinhala",
  memories: [
    "Loved fishing at Negombo lagoon every Sunday for 40 years",
    "Favourite food: pol sambol with rice and dhal curry",
    "Buddhist — visits Kelaniya Raja Maha Viharaya every Poya day",
    "Maths teacher at Nalanda College for 30 years — very proud of this",
    "Loves Amaradeva songs, especially Sanda Eliye",
    "Has a small dog named Sitha who sleeps at his feet",
    "Proudest moment: watching Sri Lanka win the 1996 World Cup",
  ],
  family: [
    {
      name: "Pradeep Perera",
      relation: "Son",
      location: "Melbourne",
      whatsapp: "+94771234567",
      alerts: true,
    },
    {
      name: "Nimali Perera",
      relation: "Daughter",
      location: "Kandy",
      whatsapp: "+94771234568",
      alerts: false,
    },
  ],
}
```

---

## API contract — app/api/

### POST /api/token
No request body needed.
Generates a LiveKit room token for the patient session.

Response:
```json
{ "token": "eyJhbGci..." }
```

Used by: patient call screen to connect to LiveKit room.

---

### POST /api/webhook
Called automatically by Beyond Presence when a call ends.
Contains the full session transcript.

Request body:
```json
{
  "session_id": "abc123",
  "transcript": [
    { "speaker": "agent", "text": "Ayubowan Thatha!" },
    { "speaker": "user",  "text": "Kohomada?" }
  ],
  "duration_seconds": 480
}
```

Response:
```json
{ "ok": true }
```

This route: extracts transcript → calls /api/summary → sends WhatsApp via Twilio.

---

### POST /api/summary
Takes a transcript string, returns a warm WhatsApp-ready summary via Claude.

Request:
```json
{
  "transcript": "Nanda: Ayubowan Thatha!\nSunil: Kohomada?...",
  "caregiver_name": "Pradeep",
  "patient_name": "Sunil"
}
```

Response:
```json
{ "message": "Thatha was in great spirits today!..." }
```

---

## lib/memory.ts — build system prompt from patient profile

```ts
export function buildMemoryPrompt(patient: typeof SUNIL): string {
  return `You are Nanda, a warm AI companion talking to ${patient.name} 
("${patient.nick}"), a ${patient.age}-year-old retired teacher in 
${patient.location} with ${patient.condition}.

ABOUT ${patient.name.toUpperCase()}:
${patient.memories.map(m => `- ${m}`).join('\n')}

YOUR STYLE:
- ALWAYS open with "Ayubowan, ${patient.nick}!"
- Speak in Sinhala. Short sentences only (2-3 max).
- Weave in Sinhala words: hondai, hari, api, kohomada
- Proactively bring up memories to engage them
- NEVER correct confusion — gently redirect
- Never mention you are an AI
- You are a loving companion, not a nurse or doctor`
}
```

---

## livekit-agent/main.py — Python agent skeleton

```python
import os
import asyncio
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import AgentSession
from livekit.plugins import google, bey
from data.patients import SUNIL
from lib.memory import build_memory_prompt

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect()

    agent = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.0-flash-live-001",
            voice="Aoede",
            instructions=build_memory_prompt(SUNIL),
        )
    )

    avatar = bey.AvatarSession(api_key=os.getenv("BEY_API_KEY"))
    await avatar.start(agent, room=ctx.room)
    await agent.start(ctx.room)

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

### livekit-agent/requirements.txt
```
livekit-agents>=0.8.0
livekit-plugins-bey
livekit-plugins-google
python-dotenv
```

---

## The 6 screens — what each page does

### /patient (Patient Home)
- Full screen creme background
- One thing: giant circular call button (peach → maroon gradient)
- "Talk to Nanda" + Sinhala label inside button
- Pulsing ripple animation
- Live clock top right
- Tiny "Call family" at bottom — barely visible
- Nothing else. No navigation, no menus.
- On click → navigate to /patient/start

### /patient/start (Transition)
- Two column layout
- Left: title, memory chips, handoff instruction, Begin button
- Right: Nanda avatar, "Ready and waiting"
- Animated expanding ring circles in background
- On "Begin session" click → navigate to /patient/loading

### /patient/loading (Loading)
- Dark coffee background
- Two column: avatar with pulse rings left, loading steps right
- 4 steps tick off with animation (1.2s delay between each)
- Steps: memory loaded → voice ready → BP avatar starting → LiveKit connecting
- Auto-navigate to /patient/call when done (after 3.6s)

### /patient/call (Call Screen)
- Full screen coffee dark background
- Two column: avatar left (260px ring, wave bars), conversation right
- Sinhala speech bubble with English translation below
- Memory recalled card below bubble
- Tiny end button at bottom center
- LiveKit VideoConference component renders actual BP avatar here

### /caregiver (Dashboard)
- Sidebar layout: 260px sidebar left, main content right
- Top nav: logo, tabs (Overview/Sessions/Memories/Insights), user
- Sidebar: patient card, start session button, memory book, family
- Main: mood chart + session history cards, WhatsApp preview full width

### /caregiver/summary (Session End)
- Dark olive background
- Two column: stats left, WhatsApp card right
- Left: checkmark, "Session complete", 3 stat cards, back button
- Right: full WhatsApp message in dark green card

---

## Full session flow

1. Caregiver opens /caregiver → sees dashboard
2. Clicks "Start session with Thatha" → goes to /patient/start
3. Hands tablet to Sunil → taps "Begin session" → goes to /patient/loading
4. App calls BP API with Sunil's memory prompt (just-in-time context)
5. App calls /api/token → gets LiveKit token
6. Loading steps tick off → auto-navigates to /patient/call
7. LiveKit connects to Python agent running on Railway
8. Gemini Live handles Sinhala conversation
9. BP renders avatar face lip-synced to Gemini audio
10. Session ends → BP fires webhook to /api/webhook
11. Webhook extracts transcript → calls Claude → gets summary
12. Twilio sends WhatsApp to Pradeep in Melbourne
13. App navigates to /caregiver/summary

---

## Build order for the hackathon (priority order)

1. tailwind.config.ts with colour palette
2. data/patients.ts with SUNIL profile
3. /patient page — just the UI, fake onClick
4. /caregiver page — hardcoded data, all UI
5. /api/token route — real LiveKit token
6. livekit-agent/main.py — Gemini + BP agent running locally
7. /patient/call — connected to LiveKit, real avatar
8. /api/webhook + /api/summary + Twilio
9. /patient/start + /patient/loading — transition screens
10. /caregiver/summary — session end screen
11. Wire start session button end to end
12. Polish all screens

---

## What NOT to build (cut for hackathon)

- User authentication or login of any kind
- Real database — use hardcoded SUNIL profile
- Multiple patient profiles
- Tamil language support
- Medication reminders
- Push notifications (WhatsApp is enough)
- Mobile responsive (desktop only for demo)
- Doctor report generation

---

## Submission checklist

- [ ] GitHub repo is public
- [ ] recall.app is deployed and live on Netlify
- [ ] Python agent is live on Railway
- [ ] 2-minute demo video recorded and uploaded
- [ ] Project overview doc attached
- [ ] All 4 team members listed on submission