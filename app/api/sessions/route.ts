import { NextRequest, NextResponse } from "next/server"
import { formatDbError } from "@/lib/db-errors"
import { sessionToCard } from "@/lib/format-session"
import { getSession, getSessionStorageMode, listSessions } from "@/lib/sessions"

export async function GET(req: NextRequest) {
  const patientId = req.nextUrl.searchParams.get("patientId")

  if (!patientId) {
    return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  }

  try {
    const rows = await listSessions(patientId)
    const sessions = await Promise.all(
      rows.map(async (row) => {
        const { messages } = await getSession(row.id)
        return sessionToCard(row, messages.length)
      })
    )
    return NextResponse.json({
      sessions,
      storage: getSessionStorageMode(),
    })
  } catch (e) {
    console.error("[sessions]", e)
    return NextResponse.json(formatDbError(e), { status: 500 })
  }
}