from dotenv import load_dotenv

load_dotenv()

import os
import time

import requests
from livekit.agents import (
    Agent,
    AgentSession,
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.agents.llm import ChatMessage
from livekit.agents.voice.events import (
    ConversationItemAddedEvent,
    UserInputTranscribedEvent,
)
from livekit.plugins import bey, deepgram, groq, silero

from prompts import build_memory_prompt, SUNIL

PATIENT_ID = "sunil-001"


def send_session_end(
    room_name: str,
    duration_seconds: int,
    turns: list[dict[str, str]],
) -> None:
    base_url = os.environ["RECALL_APP_URL"].rstrip("/")
    url = f"{base_url}/api/sessions/end"

    headers = {
        "Authorization": f"Bearer {os.environ['SESSION_WEBHOOK_SECRET']}",
        "Content-Type": "application/json",
    }

    payload = {
        "room_name": room_name,
        "patient_id": PATIENT_ID,
        "duration_seconds": duration_seconds,
        "transcript": turns,
    }

    print(f"Sending session end: room={room_name}, turns={len(turns)}")
    res = requests.post(url, json=payload, headers=headers, timeout=30)
    print("Webhook response:", res.status_code, res.text)
    res.raise_for_status()


async def entrypoint(ctx: JobContext):
    job_transcript: list[dict[str, str]] = []
    started_at = time.time()

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=groq.LLM(model="llama-3.3-70b-versatile"),
        tts=deepgram.TTS(),
    )

    def append_turn(speaker: str, text: str) -> None:
        text = text.strip()
        if not text:
            return
        if (
            job_transcript
            and job_transcript[-1] == {"speaker": speaker, "text": text}
        ):
            return
        job_transcript.append({"speaker": speaker, "text": text})

    @session.on("conversation_item_added")
    def on_conversation_item_added(ev: ConversationItemAddedEvent) -> None:
        item = ev.item
        if not isinstance(item, ChatMessage):
            return

        text = (item.text_content or "").strip()
        if not text:
            return

        role = item.role
        if role not in ("user", "assistant"):
            return

        speaker = "user" if role == "user" else "agent"
        append_turn(speaker, text)

    @session.on("user_input_transcribed")
    def on_user_input_transcribed(ev: UserInputTranscribedEvent) -> None:
        if not ev.is_final:
            return
        append_turn("user", ev.transcript)

    async def on_shutdown(_reason: str = "") -> None:
        duration_seconds = max(0, int(time.time() - started_at))
        room_name = ctx.room.name

        recall_url = os.environ.get("RECALL_APP_URL", "").strip()
        webhook_secret = os.environ.get("SESSION_WEBHOOK_SECRET", "").strip()

        if not recall_url or not webhook_secret:
            print(
                "Skipping session webhook: set RECALL_APP_URL and SESSION_WEBHOOK_SECRET"
            )
            return

        if "localhost" in recall_url or "127.0.0.1" in recall_url:
            print(
                "WARNING: RECALL_APP_URL is localhost — use your public app URL when "
                "the agent runs on Railway."
            )

        try:
            send_session_end(room_name, duration_seconds, job_transcript)
        except Exception as exc:
            print("Webhook failed:", exc)

    ctx.add_shutdown_callback(on_shutdown)

    avatar = bey.AvatarSession(
        avatar_id=os.environ["BEY_AVATAR_ID"],
        api_key=os.environ["BEY_API_KEY"],
    )
    await avatar.start(session, ctx.room)

    await session.start(
        room=ctx.room,
        agent=Agent(instructions=build_memory_prompt(SUNIL)),
    )

    await session.say(
        f"Ayubowan, {SUNIL['nick']}! Kohomada?",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, agent_name="ama"))
