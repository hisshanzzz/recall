import { formatSessionDuration, formatSessionDate } from "@/lib/format-session"

export type WhatsAppSummaryInput = {
  caregiverFirstName: string
  patientNick: string
  endedAt: string | null
  durationSeconds: number | null
  summary: string
}

const MAX_BODY_CHARS = 3800

export function formatWhatsAppSummary(input: WhatsAppSummaryInput): string {
  const dateLine = formatSessionDate(input.endedAt)
  const duration = formatSessionDuration(input.durationSeconds)

  const header = `Ayubowan ${input.caregiverFirstName}!

Recall — session with ${input.patientNick}
${dateLine} · ${duration}

`

  const footer = "\n\n— Sent automatically by Recall"
  const maxSummaryLen = MAX_BODY_CHARS - header.length - footer.length

  let summary = input.summary.trim()
  if (summary.length > maxSummaryLen) {
    summary = `${summary.slice(0, maxSummaryLen - 1)}…`
  }

  return `${header}${summary}${footer}`
}
