export const LIVEKIT_SESSION_KEY = "recall-livekit"

export type LiveKitSession = {
  token: string
  url: string
  room: string
  identity: string
}

export function saveLiveKitSession(session: LiveKitSession): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(LIVEKIT_SESSION_KEY, JSON.stringify(session))
}

export function loadLiveKitSession(): LiveKitSession | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(LIVEKIT_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as LiveKitSession
  } catch {
    return null
  }
}

export function clearLiveKitSession(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(LIVEKIT_SESSION_KEY)
}

export async function fetchLiveKitToken(room?: string): Promise<LiveKitSession> {
  const res = await fetch("/api/livekit/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room ? { room } : {}),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { error?: string }).error ?? `Token request failed (${res.status})`
    )
  }
  return res.json() as Promise<LiveKitSession>
}
