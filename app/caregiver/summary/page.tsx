"use client"

import Link from "next/link"
import { CheckCircle2, Clock, Heart, MessageCircle } from "lucide-react"
import { SUNIL } from "@/data/patients"

const WHATSAPP_MESSAGE = `Ayubowan Pradeep! 🙏

Thatha had a wonderful session with Ama today (24 minutes).

He was in great spirits and talked happily about fishing at Negombo lagoon with his brother — he even remembered the prawn catching technique! He also hummed a few lines from Sanda Eliye.

Mood: Positive and engaged throughout.

— Sent automatically by Recall`

export default function CaregiverSummaryPage() {
  const caregiver = SUNIL.family[0]

  return (
    <div className="min-h-screen bg-warm-white px-[60px] py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-pine" />
            <h1 className="text-3xl font-extrabold text-coffee tracking-tight">Session complete</h1>
          </div>
          <p className="text-leather mb-10">
            A summary was sent to {caregiver.name} in {caregiver.location} via WhatsApp.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Clock, label: "Duration", value: "24 min" },
              { icon: Heart, label: "Mood", value: "Positive" },
              { icon: MessageCircle, label: "Memories recalled", value: "3" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-coffee/[0.08]">
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
          <p className="text-sm text-leather/50 mb-3 uppercase tracking-wider">WhatsApp preview</p>
          <div className="bg-[#075E54] rounded-[14px] p-[14px] shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-[14px]">💬</div>
              <div>
                <div className="text-[11px] font-semibold text-white">Recall — {caregiver.name}</div>
                <div className="text-[9px] text-white/40">WhatsApp · Just now</div>
              </div>
            </div>
            <div className="h-px bg-white/10 mb-3" />
            <div className="bg-[#128C7E] rounded-[0px_9px_9px_9px] px-[11px] py-[9px]">
              <p className="text-[11px] text-white leading-[1.6] whitespace-pre-wrap">{WHATSAPP_MESSAGE}</p>
            </div>
            <div className="text-right mt-2">
              <span className="text-[9px] text-white/30">✓✓ Delivered to {caregiver.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
