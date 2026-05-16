"use client"

import Link from "next/link"
import { SUNIL } from "@/data/patients"
import { Avatar } from "@/components/Avatar"
import { MemoryChip } from "@/components/MemoryChip"

export default function PatientStartPage() {
  return (
    <div className="relative min-h-screen bg-warm-white overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-peach/10 animate-ping-slow" />
        <div className="absolute w-[700px] h-[700px] rounded-full border border-peach/5 animate-ping-slow" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-12 min-h-screen px-12 py-16 max-w-6xl mx-auto items-center">
        <div>
          <p className="text-sm text-leather/60 uppercase tracking-wider mb-2">Session handoff</p>
          <h1 className="text-4xl font-extrabold text-coffee mb-4">
            Ready for {SUNIL.nick}
          </h1>
          <p className="text-lg text-leather mb-8 max-w-md">
            Ama will use these memories today. Hand the tablet to {SUNIL.name.split(" ")[0]} when you are ready.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {SUNIL.memories.slice(0, 5).map((memory) => (
              <MemoryChip key={memory} label={memory.length > 42 ? `${memory.slice(0, 42)}…` : memory} />
            ))}
          </div>

          <Link
            href="/patient/loading"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-br from-peach to-maroon text-creme font-semibold rounded-full hover:scale-[1.02] transition-transform"
          >
            Begin session
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-peach/20 animate-ping-slow scale-150" />
            <Avatar size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-coffee">Ama</h2>
          <p className="text-leather mt-2">Ready and waiting</p>
        </div>
      </div>
    </div>
  )
}
