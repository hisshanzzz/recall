import { getSupabase } from "@/lib/supabase/server"
import { normalizeTranscript } from "./types"

async function insertSessionRow(
  patientId: string,
  roomName: string
): Promise<{ id: string }> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      patient_id: patientId,
      room_name: roomName,
      status: "active",
    })
    .select("id")
    .single()

  if (error) throw error
  return data
}

export async function createSession(patientId: string, roomName: string) {
  return insertSessionRow(patientId, roomName)
}

export async function completeSession(
  roomName: string,
  duration: number,
  transcript: unknown[],
  patientId = "sunil-001"
) {
  const supabase = getSupabase()
  const turns = normalizeTranscript(transcript)

  let { data: session, error: findError } = await supabase
    .from("sessions")
    .select("id")
    .eq("room_name", roomName)
    .maybeSingle()

  if (findError) throw findError

  if (!session) {
    console.warn(
      `[sessions] No session for room ${roomName}, creating before complete`
    )
    session = await insertSessionRow(patientId, roomName)
  }

  const { error: deleteError } = await supabase
    .from("transcript_messages")
    .delete()
    .eq("session_id", session.id)

  if (deleteError) throw deleteError

  if (turns.length > 0) {
    const messages = turns.map((msg, position) => ({
      session_id: session.id,
      speaker: msg.speaker,
      text: msg.text,
      position,
    }))

    const { error: insertError } = await supabase
      .from("transcript_messages")
      .insert(messages)

    if (insertError) throw insertError
  }

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      status: "completed",
      duration_seconds: Math.round(duration),
      ended_at: new Date().toISOString(),
    })
    .eq("id", session.id)

  if (updateError) throw updateError

  return session.id
}

export async function listSessions(patientId: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("patient_id", patientId)
    .order("started_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getSession(id: string) {
  const supabase = getSupabase()

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single()

  if (sessionError) throw sessionError

  const { data: messages, error: messagesError } = await supabase
    .from("transcript_messages")
    .select("*")
    .eq("session_id", id)
    .order("position")

  if (messagesError) throw messagesError

  return { session, messages: messages ?? [] }
}
