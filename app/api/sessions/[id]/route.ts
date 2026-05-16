import { NextResponse } from "next/server"
import { formatDbError } from "@/lib/db-errors"
import { getSession } from "@/lib/sessions"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await getSession(id)
    return NextResponse.json(data)
  } catch (e) {
    console.error("[sessions/[id]]", e)
    const payload = formatDbError(e)
    const status = payload.error.toLowerCase().includes("not found") ? 404 : 500
    return NextResponse.json(payload, { status })
  }
}