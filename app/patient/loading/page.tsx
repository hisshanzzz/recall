"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/Avatar"
import { Check } from "lucide-react"
import {
  fetchLiveKitToken,
  saveLiveKitSession,
} from "@/lib/livekit-session"

const STEPS = [
  "Memory loaded",
  "Voice ready",
  "BP avatar starting",
  "LiveKit connecting",
]

const STEP_MS = 1200
const MIN_LOADING_MS = STEPS.length * STEP_MS

export default function PatientLoadingPage() {
  const router = useRouter()
  const [completed, setCompleted] = useState(0)
  const [tokenReady, setTokenReady] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  const loadToken = useCallback(async () => {
    setTokenError(null)
    try {
      const session = await fetchLiveKitToken()
      saveLiveKitSession(session)
      setTokenReady(true)
    } catch (err) {
      setTokenReady(false)
      setTokenError(
        err instanceof Error ? err.message : "Could not connect to LiveKit"
      )
    }
  }, [])

  useEffect(() => {
    void loadToken()
  }, [loadToken])

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setCompleted(i + 1), (i + 1) * STEP_MS)
    )
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(minTimer)
    }
  }, [])

  useEffect(() => {
    if (minTimeElapsed && tokenReady && !tokenError) {
      router.push("/patient/call")
    }
  }, [minTimeElapsed, tokenReady, tokenError, router])

  return (
    <div className="min-h-screen bg-coffee grid grid-cols-2 gap-12 px-12 py-16 items-center max-w-6xl mx-auto">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-peach/30 animate-ping-slow scale-125" />
          <div
            className="absolute inset-0 rounded-full border border-creme/10 animate-ping-slow scale-150"
            style={{ animationDelay: "0.4s" }}
          />
          <Avatar size="lg" className="relative z-10" />
        </div>
        <p className="text-creme mt-6 text-lg font-medium">Ama</p>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-creme mb-8">Preparing your session</h1>
        {STEPS.map((step, i) => {
          const done = completed > i
          const isLast = i === STEPS.length - 1
          const failed = isLast && tokenError
          return (
            <div
              key={step}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
                failed
                  ? "bg-red-500/10 text-red-200"
                  : done
                    ? "bg-creme/10 text-creme"
                    : "text-creme/40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  failed
                    ? "bg-red-500/30 text-red-100"
                    : done
                      ? "bg-pine text-creme"
                      : "bg-creme/10"
                }`}
              >
                {done && !failed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm">{i + 1}</span>
                )}
              </div>
              <span className="font-medium">{step}</span>
            </div>
          )
        })}
        {tokenError && (
          <div className="pt-4 space-y-3">
            <p className="text-sm text-red-200">{tokenError}</p>
            <button
              type="button"
              onClick={() => void loadToken()}
              className="px-5 py-2.5 rounded-xl bg-peach text-creme font-medium hover:bg-peach/90 transition-colors"
            >
              Retry connection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}