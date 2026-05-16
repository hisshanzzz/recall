import { randomUUID } from "crypto"
import fs from "fs"
import path from "path"
import {
  normalizeTranscript,
  transcriptPreview,
  type SessionRow,
  type TranscriptMessageRow,
} from "./types"

const DATA_DIR = path.join(process.cwd(), "data", "sessions")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json")

type Store = {
  sessions: SessionRow[]
  messages: TranscriptMessageRow[]
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readStore(): Store {
  ensureDir()
  const sessions: SessionRow[] = fs.existsSync(SESSIONS_FILE)
    ? JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"))
    : []
  const messages: TranscriptMessageRow[] = fs.existsSync(MESSAGES_FILE)
    ? JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"))
    : []
  return { sessions, messages }
}

function writeStore(store: Store) {
  ensureDir()
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(store.sessions, null, 2))
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(store.messages, null, 2))
}

export async function createSession(
  patientId: string,
  roomName: string
): Promise<{ id: string }> {
  const store = readStore()
  const existing = store.sessions.find((s) => s.room_name === roomName)
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

  store.sessions.push(session)
  writeStore(store)
  return { id: session.id }
}

export async function completeSession(
  roomName: string,
  duration: number,
  transcript: unknown[],
  patientId = "sunil-001"
): Promise<string> {
  const store = readStore()
  const turns = normalizeTranscript(transcript)

  let session = store.sessions.find((s) => s.room_name === roomName)
  if (!session) {
    const { id } = await createSession(patientId, roomName)
    const fresh = readStore()
    session = fresh.sessions.find((s) => s.id === id)!
    store.sessions = fresh.sessions
    store.messages = fresh.messages
  }

  // Replace messages for this session
  store.messages = store.messages.filter((m) => m.session_id !== session!.id)
  const newMessages: TranscriptMessageRow[] = turns.map((msg, position) => ({
    id: randomUUID(),
    session_id: session!.id,
    speaker: msg.speaker,
    text: msg.text,
    position,
    created_at: new Date().toISOString(),
  }))
  store.messages.push(...newMessages)

  const idx = store.sessions.findIndex((s) => s.id === session!.id)
  store.sessions[idx] = {
    ...session,
    status: "completed",
    duration_seconds: Math.round(duration),
    ended_at: new Date().toISOString(),
    summary: transcriptPreview(turns),
    topic: session.topic ?? roomName,
  }

  writeStore(store)
  return session.id
}

export async function listSessions(patientId: string): Promise<SessionRow[]> {
  const { sessions } = readStore()
  return sessions
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
  const store = readStore()
  const session = store.sessions.find((s) => s.id === id)
  if (!session) throw new Error("Session not found")
  const messages = store.messages
    .filter((m) => m.session_id === id)
    .sort((a, b) => a.position - b.position)
  return { session, messages }
}
