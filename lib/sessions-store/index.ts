import * as memoryStore from "./memory"
import * as supabaseStore from "./supabase"

export function useSupabase(): boolean {
  const flag = process.env.USE_SUPABASE?.toLowerCase()
  if (flag === "false" || flag === "0") return false
  if (flag === "true" || flag === "1") return true

  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
}

const store = useSupabase() ? supabaseStore : memoryStore

export const createSession = store.createSession
export const completeSession = store.completeSession
export const listSessions = store.listSessions
export const getSession = store.getSession

export function getSessionStorageMode(): "supabase" | "memory" {
  return useSupabase() ? "supabase" : "memory"
}
