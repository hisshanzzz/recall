import type { SessionRow } from "@/lib/sessions-store/types"

export type SessionCard = {
  id: string
  date: string
  duration: string
  topic: string
  summary: string
  mood: string
  memoriesRecalled: number
}

export function formatSessionDuration(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return "—"
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `${minutes} min`
}

export function formatSessionDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function sessionToCard(
  session: SessionRow,
  messageCount = 0
): SessionCard {
  return {
    id: session.id,
    date: formatSessionDate(session.ended_at ?? session.started_at),
    duration: formatSessionDuration(session.duration_seconds),
    topic: session.topic ?? session.room_name,
    summary: session.summary ?? "Session completed.",
    mood: session.mood ?? "calm",
    memoriesRecalled: messageCount,
  }
}
