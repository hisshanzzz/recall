"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"

export default function PatientHomePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

  const getGreeting = () => {
    if (!currentTime) return "Hello"
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="relative min-h-screen bg-creme overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-leather/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-peach/15 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-radial from-peach/10 to-transparent rounded-full blur-2xl translate-x-1/2" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-radial from-leather/10 to-transparent rounded-full blur-2xl -translate-x-1/2" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-extrabold text-coffee tracking-tight">Recall</h1>
        {currentTime && (
          <div className="text-right text-leather/60">
            <div className="text-lg font-medium">{formatTime(currentTime)}</div>
            <div className="text-sm">{formatDate(currentTime)}</div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-coffee mb-4 text-balance">
            {getGreeting()}, Sunil <span className="text-peach">Thatha</span>
          </h2>
          <p className="text-xl text-leather">Ama is waiting to talk with you</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[220px] h-[220px] rounded-full border-2 border-peach/30 animate-ripple" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[220px] h-[220px] rounded-full border-2 border-peach/20 animate-ripple-delayed" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[220px] h-[220px] rounded-full border-2 border-peach/10 animate-ripple-delayed-2" />
          </div>

          <Link
            href="/patient/call"
            className="relative flex flex-col items-center justify-center w-[220px] h-[220px] rounded-full bg-gradient-to-br from-peach to-maroon text-white transition-transform hover:scale-105 active:scale-95 animate-pulse-glow cursor-pointer"
          >
            <Phone className="w-12 h-12 text-white mb-3" strokeWidth={2} />
            <span className="text-lg font-semibold text-creme">Talk to Ama</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
