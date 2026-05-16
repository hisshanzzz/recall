"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, Clock, Calendar, ChevronRight, Search } from "lucide-react"
import { SUNIL } from "@/data/patients"
import type { SessionCard } from "@/lib/format-session"

const moodColors: Record<string, string> = {
  happy: "bg-guave",
  nostalgic: "bg-clay",
  proud: "bg-peach",
  calm: "bg-pine",
  peaceful: "bg-leather",
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storage, setStorage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(
          `/api/sessions?patientId=${encodeURIComponent(SUNIL.id)}`
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load sessions")
        }
        if (!cancelled) {
          setSessions(data.sessions ?? [])
          setStorage(data.storage ?? null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load sessions")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-creme">
      <nav className="bg-warm-white border-b border-clay/10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-extrabold text-coffee tracking-tight">
            Recall
          </h1>
          <div className="flex items-center gap-8">
            <Link
              href="/caregiver"
              className="text-sm font-medium text-leather/60 hover:text-leather transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/caregiver/sessions"
              className="text-sm font-medium text-coffee border-b-2 border-peach pb-1"
            >
              Sessions
            </Link>
            <Link
              href="/caregiver/memories"
              className="text-sm font-medium text-leather/60 hover:text-leather transition-colors"
            >
              Memories
            </Link>
            <Link
              href="/caregiver/insights"
              className="text-sm font-medium text-leather/60 hover:text-leather transition-colors"
            >
              Insights
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-coffee font-medium">
              Pradeep Perera
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clay to-leather flex items-center justify-center">
              <span className="text-sm font-semibold text-creme">PP</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-coffee">Sessions</h2>
            <p className="text-leather/60">
              Review past conversations with {SUNIL.nick}
              {storage === "memory" && (
                <span className="text-leather/40"> · stored in memory</span>
              )}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leather/40" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="pl-10 pr-4 py-2 bg-warm-white border border-clay/20 rounded-xl text-sm text-coffee placeholder:text-leather/40 focus:outline-none focus:border-peach/50 w-64"
            />
          </div>
        </div>

        {loading && (
          <p className="text-leather/60 text-sm">Loading sessions…</p>
        )}
        {error && <p className="text-peach text-sm">{error}</p>}
        {!loading && !error && sessions.length === 0 && (
          <p className="text-leather/60 text-sm">
            No sessions yet. Start a call with {SUNIL.nick} to record one.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-warm-white rounded-2xl p-6 border border-clay/10 hover:border-clay/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-peach/10 flex items-center justify-center shrink-0 group-hover:bg-peach/20 transition-colors">
                  <Play className="w-5 h-5 text-peach" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-coffee">
                      {session.topic}
                    </h3>
                    <span
                      className={`w-2 h-2 rounded-full ${moodColors[session.mood] || "bg-clay"}`}
                    />
                    <span className="text-xs text-leather/50 capitalize">
                      {session.mood}
                    </span>
                  </div>
                  <p className="text-sm text-leather/70 mb-4 line-clamp-2">
                    {session.summary}
                  </p>
                  <div className="flex items-center gap-6 text-xs text-leather/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-guave">
                        {session.memoriesRecalled} messages
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-leather/30 shrink-0 group-hover:text-leather/50 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
