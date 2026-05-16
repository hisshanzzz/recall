export {
  createSession,
  completeSession,
  listSessions,
  getSession,
} from "./json-file"

export function getSessionStorageMode(): string {
  return "json-file"
}
