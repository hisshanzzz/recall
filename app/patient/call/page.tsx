"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MoreHorizontal,
  Volume2,
  SwitchCamera,
  AlertCircle,
  X,
  MessageSquare,
  Send,
} from "lucide-react"
import { useLiveKitCall } from "@/hooks/useLiveKitCall"
import type { CallConnectionStatus } from "@/hooks/useLiveKitCall"

function ControlButton({
  children,
  variant = "default",
  active = true,
  onClick,
}: {
  children: React.ReactNode
  variant?: "default" | "danger"
  active?: boolean
  onClick?: () => void
}) {
  const baseClasses =
    "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200"

  if (variant === "danger") {
    return (
      <button
        className={`${baseClasses} bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30`}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`${baseClasses} ${
        active
          ? "bg-creme/20 backdrop-blur-xl text-creme hover:bg-creme/30"
          : "bg-creme text-coffee hover:bg-creme/90"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function statusLabel(status: CallConnectionStatus, error: string | null) {
  if (status === "error") return error ?? "Connection error"
  if (status === "connecting") return "Connecting…"
  if (status === "connected") return "Connected"
  return "Disconnected"
}

function statusDotClass(status: CallConnectionStatus) {
  if (status === "connected") return "bg-green-500 animate-pulse"
  if (status === "connecting") return "bg-yellow-500 animate-pulse"
  if (status === "error") return "bg-red-500"
  return "bg-creme/40"
}

export default function PatientCallPage() {
  const router = useRouter()
  const {
    status,
    error,
    messages,
    isSendingText,
    avatarVideoRef,
    disconnect,
    setMicrophoneEnabled,
    sendText,
  } = useLiveKitCall()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [hasConnected, setHasConnected] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (status !== "connected") return
    const durationTimer = setInterval(
      () => setCallDuration((d) => d + 1),
      1000
    )
    return () => clearInterval(durationTimer)
  }, [status])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleToggleMute = async () => {
    const next = !isMuted
    setIsMuted(next)
    await setMicrophoneEnabled(!next)
  }

  useEffect(() => {
    if (status === "connected") setHasConnected(true)
  }, [status])

  useEffect(() => {
    if (hasConnected && status === "disconnected") {
      router.push("/patient")
    }
  }, [hasConnected, status, router])

  const handleEndCall = async () => {
    await disconnect()
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text || status !== "connected" || isSendingText) return
    setChatInput("")
    try {
      await sendText(text)
    } catch {
      setChatInput(text)
    }
  }

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="relative min-h-screen bg-maroon overflow-hidden">
      <div className="absolute inset-0 bg-maroon" />

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusDotClass(status)}`} />
          <span className="text-sm font-medium text-creme/80">
            {statusLabel(status, error)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-creme">Ama</span>
          <span className="text-sm text-creme/50">
            {formatDuration(callDuration)}
          </span>
        </div>

        <div className="text-creme/50 text-sm">{formatTime(currentTime)}</div>
      </header>

      <main className="relative z-10 min-h-screen">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <video
              ref={avatarVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {status !== "connected" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-maroon/90 text-creme/70 gap-3">
                <div className="w-20 h-20 rounded-full border-2 border-peach/40 flex items-center justify-center">
                  <span className="text-3xl">A</span>
                </div>
                <p className="text-sm">{statusLabel(status, error)}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            {status === "connected" && (
              <div className="absolute inset-4 rounded-3xl border-2 border-peach/30 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>
      </main>

      <div
        className={`absolute top-20 z-20 transition-all duration-300 ${showChat ? "right-80 md:right-96" : "right-4 md:right-6"}`}
      >
        <div className="w-28 h-40 md:w-36 md:h-48 rounded-2xl bg-coffee border-2 border-creme/20 shadow-2xl overflow-hidden">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-maroon">
              <VideoOff className="w-8 h-8 text-creme/40" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-coffee to-maroon">
              <span className="text-3xl font-bold text-creme/60">You</span>
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute top-0 right-0 h-full z-30 transition-transform duration-300 ease-out ${showChat ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="w-72 md:w-88 h-full bg-black/80 backdrop-blur-xl border-l border-creme/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-creme/10">
            <h3 className="text-lg font-semibold text-creme">Transcript</h3>
            <button
              type="button"
              onClick={() => setShowChat(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-creme/10 text-creme/50 hover:text-creme transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-creme/50">
                    {message.sender}
                  </span>
                  <span className="text-xs text-creme/30">{message.time}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.sender === "You"
                      ? "bg-peach/20 text-creme rounded-br-md"
                      : "bg-creme/10 text-creme rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          <form
            onSubmit={(e) => void handleSendMessage(e)}
            className="px-4 py-3 border-t border-creme/10 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                disabled={status !== "connected" || isSendingText}
                className="flex-1 min-w-0 rounded-xl bg-creme/10 border border-creme/10 px-3 py-2 text-sm text-creme placeholder:text-creme/40 focus:outline-none focus:ring-2 focus:ring-peach/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={
                  status !== "connected" ||
                  isSendingText ||
                  !chatInput.trim()
                }
                className="w-10 h-10 flex shrink-0 items-center justify-center rounded-xl bg-peach/30 text-creme hover:bg-peach/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-creme/50">
              {status === "connected"
                ? "Voice or type to reply"
                : "Connect to send messages"}
            </p>
          </form>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-10 pt-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <ControlButton active={!isMuted} onClick={() => void handleToggleMute()}>
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </ControlButton>

          <ControlButton
            active={!isVideoOff}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6" />
            ) : (
              <Video className="w-6 h-6" />
            )}
          </ControlButton>

          <ControlButton variant="danger" onClick={() => void handleEndCall()}>
            <PhoneOff className="w-6 h-6" />
          </ControlButton>

          <ControlButton active={!showChat} onClick={() => setShowChat(!showChat)}>
            <MessageSquare className="w-6 h-6" />
          </ControlButton>

          <div className="relative">
            <ControlButton onClick={() => setShowMenu(!showMenu)}>
              <MoreHorizontal className="w-6 h-6" />
            </ControlButton>

            {showMenu && (
              <div className="absolute bottom-20 right-0 w-56 bg-black/80 backdrop-blur-xl rounded-2xl border border-creme/10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-creme/10">
                  <span className="text-sm font-semibold text-creme">Options</span>
                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    className="text-creme/50 hover:text-creme"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="py-2">
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-creme hover:bg-creme/10 transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-creme/70" />
                    <span className="text-sm">Speaker</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-creme hover:bg-creme/10 transition-colors"
                  >
                    <SwitchCamera className="w-5 h-5 text-creme/70" />
                    <span className="text-sm">Flip Camera</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Report an Issue</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
