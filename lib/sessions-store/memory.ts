import { randomUUID } from "crypto"
import {
  normalizeTranscript,
  transcriptPreview,
  type SessionRow,
  type TranscriptMessageRow,
} from "./types"

type MemoryState = {
  sessionsByRoom: Map<string, SessionRow>
  sessionsById: Map<string, SessionRow>
  messagesBySessionId: Map<string, TranscriptMessageRow[]>
}

const GLOBAL_KEY = "__recallMemorySessions"

function getState(): MemoryState {
  const g = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: MemoryState
  }
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      sessionsByRoom: new Map(),
      sessionsById: new Map(),
      messagesBySessionId: new Map(),
    }
  }
  return g[GLOBAL_KEY]
}

function upsertSession(state: MemoryState, session: SessionRow) {
  state.sessionsByRoom.set(session.room_name, session)
  state.sessionsById.set(session.id, session)
}

export async function createSession(
  patientId: string,
  roomName: string
): Promise<{ id: string }> {
  const state = getState()
  const existing = state.sessionsByRoom.get(roomName)
  if (existing) return { id: existing.id }

  const session: SessionRow = {
    id: randomUUID(),
    patient_id: patientId,
    room_name: roomName,
    status: "active",
    started_at: new Date().toISOString(),
    ended_at: null,
    duration_seconds: null,
    summary: null,
    mood: null,
    topic: null,
  }

  upsertSession(state, session)
  state.messagesBySessionId.set(session.id, [])
  return { id: session.id }
}

export async function completeSession(
  roomName: string,
  duration: number,
  transcript: unknown[],
  patientId = "sunil-001"
): Promise<string> {
  const state = getState()
  const turns = normalizeTranscript(transcript)
  let session = state.sessionsByRoom.get(roomName)

  if (!session) {
    await createSession(patientId, roomName)
    session = state.sessionsByRoom.get(roomName)!
  }

  const messages: TranscriptMessageRow[] = turns.map((msg, position) => ({
    id: randomUUID(),
    session_id: session.id,
    speaker: msg.speaker,
    text: msg.text,
    position,
    created_at: new Date().toISOString(),
  }))

  state.messagesBySessionId.set(session.id, messages)

  const updated: SessionRow = {
    ...session,
    status: "completed",
    duration_seconds: Math.round(duration),
    ended_at: new Date().toISOString(),
    summary: transcriptPreview(turns),
    topic: session.topic ?? roomName,
  }

  upsertSession(state, updated)
  return updated.id
}

export async function listSessions(patientId: string): Promise<SessionRow[]> {
  const state = getState()
  return [...state.sessionsById.values()]
    .filter((s) => s.patient_id === patientId)
    .sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    )
}

export async function getSession(id: string): Promise<{
  session: SessionRow
  messages: TranscriptMessageRow[]
}> {
  const state = getState()
  const session = state.sessionsById.get(id)
  if (!session) throw new Error("Session not found")

  return {
    session,
    messages: state.messagesBySessionId.get(id) ?? [],
  }
}
