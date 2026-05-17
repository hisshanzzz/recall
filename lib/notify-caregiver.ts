import { SUNIL } from "@/data/patients"
import { generateCaregiverSummary } from "@/lib/gemini"
import { formatWhatsAppSummary } from "@/lib/format-whatsapp"
import { getSession, updateSessionSummary } from "@/lib/sessions"
import type { TranscriptTurn } from "@/lib/sessions-store/types"
import { notifyCaregiversWhatsApp } from "@/lib/twilio"

function getPatient(patientId: string) {
  if (patientId === SUNIL.id) return SUNIL
  return SUNIL
}

export async function notifyCaregiverAfterSession(
  sessionId: string,
  patientId: string
) {
  const patient = getPatient(patientId)
  const alertMembers = patient.family.filter((m) => m.alerts)
  const primary = alertMembers[0] ?? patient.family[0]
  const caregiverFirstName = primary.name.split(" ")[0]

  const { session, messages } = await getSession(sessionId)
  const turns: TranscriptTurn[] = messages.map((m) => ({
    speaker: m.speaker,
    text: m.text,
  }))

  const { summary, mood } = await generateCaregiverSummary({
    turns,
    patientName: patient.name,
    patientNick: patient.nick,
    caregiverName: caregiverFirstName,
  })

  await updateSessionSummary(sessionId, { summary, mood })

  const whatsappMessage = formatWhatsAppSummary({
    caregiverFirstName,
    patientNick: patient.nick,
    endedAt: session.ended_at,
    durationSeconds: session.duration_seconds,
    summary,
  })

  const whatsapp = await notifyCaregiversWhatsApp(patient.family, whatsappMessage)

  return { summary, mood, whatsappMessage, whatsapp }
}
