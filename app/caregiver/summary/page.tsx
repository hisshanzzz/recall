"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Heart, MessageCircle } from "lucide-react"
import { SUNIL } from "@/data/patients"
import { formatSessionDuration } from "@/lib/format-session"
import type { SessionRow } from "@/lib/sessions-store/types"

const caregiver = SUNIL.family.find((m) => m.alerts) ?? SUNIL.family[0]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function CaregiverSummaryPage() {
  const [session, setSession] = useState<SessionRow | null>(null)
  const [whatsappMessage, setWhatsappMessage] = useState<string | null>(null)
  const [messageCount, setMessageCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    const maxAttempts = 8

    async function load() {
      try {
        const listRes = await fetch(
          `/api/sessions?patientId=${encodeURIComponent(SUNIL.id)}`
        )
        const listData = await listRes.json()
        const latest = (listData.sessions as { id: string }[])?.[0]
        if (!latest?.id) {
          if (!cancelled) setLoading(false)
          return
        }

        const detailRes = await fetch(`/api/sessions/${latest.id}`)
        const detail = await detailRes.json()
        if (cancelled) return

        setSession(detail.session)
        setMessageCount(detail.messages?.length ?? 0)
        if (detail.whatsappPreview) {
          setWhatsappMessage(detail.whatsappPreview)
          setLoading(false)
        } else if (attempts < maxAttempts) {
          attempts += 1
          setTimeout(load, 2000)
        } else {
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const duration =
    session?.duration_seconds != null
      ? formatSessionDuration(session.duration_seconds)
      : "—"
  const mood = session?.mood ? capitalize(session.mood) : loading ? "…" : "—"

  const previewText =
    whatsappMessage ??
    (loading
      ? "Generating summary and sending to WhatsApp…"
      : "Summary will appear here once the session is processed.")

  return (
    <div className="min-h-screen bg-warm-white px-[60px] py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-pine" />
            <h1 className="text-3xl font-extrabold text-coffee tracking-tight">
              Session complete
            </h1>
          </div>
          <p className="text-leather mb-10">
            A summary was sent to {caregiver.name} in {caregiver.location} via
            WhatsApp.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Clock, label: "Duration", value: duration },
              { icon: Heart, label: "Mood", value: mood },
              {
                icon: MessageCircle,
                label: "Messages",
                value: String(messageCount),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 border border-coffee/[0.08]"
              >
                <Icon className="w-5 h-5 text-peach mb-2" />
                <p className="text-2xl font-semibold text-coffee">{value}</p>
                <p className="text-xs text-leather/50 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/caregiver"
            className="inline-flex px-6 py-3 bg-coffee text-creme font-medium rounded-full hover:bg-maroon transition-colors"
          >
            Back to dashboard
          </Link>
        </div>

        <div>
          <p className="text-sm text-leather/50 mb-3 uppercase tracking-wider">
            WhatsApp preview
          </p>
          <div className="bg-[#075E54] rounded-[14px] p-[14px] shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-[14px]">
                💬
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">
                  Recall — {caregiver.name}
                </div>
                <div className="text-[9px] text-white/40">WhatsApp · Just now</div>
              </div>
            </div>
            <div className="h-px bg-white/10 mb-3" />
            <div className="bg-[#128C7E] rounded-[0px_9px_9px_9px] px-[11px] py-[9px]">
              <p className="text-[11px] text-white leading-[1.6] whitespace-pre-wrap">
                {previewText}
              </p>
            </div>
            <div className="text-right mt-2">
              <span className="text-[9px] text-white/30">
                ✓✓ Delivered to {caregiver.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}