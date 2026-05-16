export type DbErrorPayload = {
  error: string
  code?: string
  details?: string
}

export function formatDbError(e: unknown): DbErrorPayload {
  if (e instanceof Error) {
    return { error: e.message }
  }

  if (e && typeof e === "object") {
    const row = e as Record<string, unknown>
    const message =
      typeof row.message === "string"
        ? row.message
        : typeof row.error === "string"
          ? row.error
          : "Database error"

    return {
      error: message,
      code: typeof row.code === "string" ? row.code : undefined,
      details: typeof row.details === "string" ? row.details : undefined,
    }
  }

  return { error: String(e) }
}
