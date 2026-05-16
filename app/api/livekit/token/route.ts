import { NextResponse } from "next/server"
import { SUNIL } from "@/data/patients"
import { createPatientLiveKitSession } from "@/lib/livekit-server"
import { createSession } from "@/lib/sessions"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const room =
      typeof (body as { room?: string }).room === "string"
        ? (body as { room: string }).room
        : undefined
    const identity =
      typeof (body as { identity?: string }).identity === "string"
        ? (body as { identity: string }).identity
        : undefined

    const session = await createPatientLiveKitSession({ room, identity })

    try {
      await createSession(SUNIL.id, session.room)
    } catch (dbError) {
      console.error("[livekit/token] createSession", dbError)
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("[livekit/token]", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create LiveKit token",
      },
      { status: 500 }
    )
  }
}
