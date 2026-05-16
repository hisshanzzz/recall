export type SessionStatus = "active" | "completed" | "failed"

export type TranscriptSpeaker = "agent" | "user"

export type SessionRow = {
  id: string
  patient_id: string
  room_name: string
  status: SessionStatus
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  summary: string | null
  mood: string | null
  topic: string | null
}

export type TranscriptMessageRow = {
  id: string
  session_id: string
  speaker: TranscriptSpeaker
  text: string
  position: number
  created_at: string
}

export type TranscriptTurn = {
  speaker: TranscriptSpeaker
  text: string
}

export type SessionEndPayload = {
  room_name: string
  patient_id: string
  duration_seconds: number
  transcript: TranscriptTurn[]
}

export type SessionListItem = {
  id: string
  startedAt: string
  endedAt: string | null
  durationSeconds: number | null
  status: SessionStatus
  summary: string | null
  mood: string | null
  topic: string | null
  messageCount: number
}

export type SessionDetail = SessionListItem & {
  roomName: string
  patientId: string
  messages: TranscriptTurn[]
}
