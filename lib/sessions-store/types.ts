export type TranscriptTurn = { speaker: "agent" | "user"; text: string }

export type SessionRow = {
  id: string
  patient_id: string
  room_name: string
  status: "active" | "completed" | "failed"
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
  speaker: TranscriptTurn["speaker"]
  text: string
  position: number
  created_at: string
}

export function normalizeTranscript(raw: unknown[]): TranscriptTurn[] {
  const turns: TranscriptTurn[] = []

  for (const item of raw) {
    if (!item || typeof item !== "object") continue
    const row = item as Record<string, unknown>
    const text = typeof row.text === "string" ? row.text.trim() : ""
    if (!text) continue

    const speaker: TranscriptTurn["speaker"] =
      row.speaker === "user" ? "user" : "agent"
    turns.push({ speaker, text })
  }

  return turns
}

export function transcriptPreview(turns: TranscriptTurn[], maxLen = 200): string {
  if (turns.length === 0) return "No transcript recorded."
  const line = turns
    .slice(0, 4)
    .map((t) => `${t.speaker === "agent" ? "Ama" : "Thatha"}: ${t.text}`)
    .join(" ")
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line
}
