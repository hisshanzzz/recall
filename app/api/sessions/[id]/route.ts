import { NextResponse } from "next/server"
import { SUNIL } from "@/data/patients"
import { formatDbError } from "@/lib/db-errors"
import { formatWhatsAppSummary } from "@/lib/format-whatsapp"
import { getSession } from "@/lib/sessions"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await getSession(id)
    const caregiver = SUNIL.family.find((m) => m.alerts) ?? SUNIL.family[0]
    const caregiverFirstName = caregiver.name.split(" ")[0]

    const whatsappPreview =
      data.session.summary != null
        ? formatWhatsAppSummary({
            caregiverFirstName,
            patientNick: SUNIL.nick,
            endedAt: data.session.ended_at,
            durationSeconds: data.session.duration_seconds,
            summary: data.session.summary,
          })
        : null

    return NextResponse.json({ ...data, whatsappPreview })
  } catch (e) {
    console.error("[sessions/[id]]", e)
    const payload = formatDbError(e)
    const status = payload.error.toLowerCase().includes("not found") ? 404 : 500
    return NextResponse.json(payload, { status })
  }
}