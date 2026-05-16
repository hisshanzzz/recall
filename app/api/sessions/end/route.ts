import { NextRequest, NextResponse } from "next/server"
import { formatDbError } from "@/lib/db-errors"
import { completeSession } from "@/lib/sessions"

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization")

  if (auth !== `Bearer ${process.env.SESSION_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { room_name, duration_seconds, transcript, patient_id } = body

  if (!room_name || typeof duration_seconds !== "number") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  try {
    const sessionId = await completeSession(
      room_name,
      duration_seconds,
      Array.isArray(transcript) ? transcript : [],
      typeof patient_id === "string" ? patient_id : "sunil-001"
    )
    return NextResponse.json({ success: true, sessionId })
  } catch (e) {
    console.error("[sessions/end]", e)
    const payload = formatDbError(e)
    const status = payload.error.toLowerCase().includes("not found") ? 404 : 500
    return NextResponse.json(payload, { status })
  }
}
