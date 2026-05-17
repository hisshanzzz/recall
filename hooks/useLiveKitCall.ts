"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type Participant,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type TranscriptionSegment,
} from "livekit-client"
import { LIVEKIT_CHAT_TOPIC } from "@/lib/livekit-chat"
import {
  clearLiveKitSession,
  fetchLiveKitToken,
  loadLiveKitSession,
  type LiveKitSession,
} from "@/lib/livekit-session"

export type CallConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

export type CallChatMessage = {
  id: string
  sender: "You" | "Ama"
  text: string
  time: string
}

type UseLiveKitCallOptions = {
  onConnected?: () => void
  onDisconnected?: () => void
}

function formatChatTime(connectedAtMs: number | null): string {
  if (connectedAtMs == null) return "0:00"
  const secs = Math.max(0, Math.floor((Date.now() - connectedAtMs) / 1000))
  const mins = Math.floor(secs / 60)
  const rem = secs % 60
  return `${mins}:${rem.toString().padStart(2, "0")}`
}

let messageIdCounter = 0
function nextMessageId(): string {
  messageIdCounter += 1
  return `msg-${messageIdCounter}`
}

export function useLiveKitCall(options?: UseLiveKitCallOptions) {
  const [status, setStatus] = useState<CallConnectionStatus>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<CallChatMessage[]>([])
  const [isSendingText, setIsSendingText] = useState(false)

  const roomRef = useRef<Room | null>(null)
  const avatarVideoRef = useRef<HTMLVideoElement>(null)
  const audioElementsRef = useRef<HTMLAudioElement[]>([])
  const connectedAtRef = useRef<number | null>(null)
  const segmentToMessageIdRef = useRef<Map<string, string>>(new Map())

  const appendMessage = useCallback((sender: "You" | "Ama", text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((prev) => [
      ...prev,
      {
        id: nextMessageId(),
        sender,
        text: trimmed,
        time: formatChatTime(connectedAtRef.current),
      },
    ])
  }, [])

  const upsertAmaFromTranscription = useCallback(
    (segments: TranscriptionSegment[]) => {
      for (const seg of segments) {
        const text = seg.text.trim()
        if (!text) continue

        const existingMessageId = segmentToMessageIdRef.current.get(seg.id)
        if (existingMessageId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === existingMessageId ? { ...m, text } : m
            )
          )
        } else {
          const id = nextMessageId()
          segmentToMessageIdRef.current.set(seg.id, id)
          setMessages((prev) => [
            ...prev,
            {
              id,
              sender: "Ama",
              text,
              time: formatChatTime(connectedAtRef.current),
            },
          ])
        }

        if (seg.final) {
          segmentToMessageIdRef.current.delete(seg.id)
        }
      }
    },
    []
  )

  const handleTranscriptionReceived = useCallback(
    (
      segments: TranscriptionSegment[],
      participant?: Participant
    ) => {
      const room = roomRef.current
      if (!room || !participant) return
      if (participant.identity === room.localParticipant.identity) return
      upsertAmaFromTranscription(segments)
    },
    [upsertAmaFromTranscription]
  )

  const cleanupAudioElements = useCallback(() => {
    audioElementsRef.current.forEach((el) => {
      el.remove()
    })
    audioElementsRef.current = []
  }, [])

  const attachVideoTrack = useCallback((track: RemoteTrack) => {
    const el = avatarVideoRef.current
    if (!el || track.kind !== Track.Kind.Video) return
    track.attach(el)
  }, [])

  const attachAudioTrack = useCallback((track: RemoteTrack) => {
    if (track.kind !== Track.Kind.Audio) return
    const audio = document.createElement("audio")
    audio.autoplay = true
    track.attach(audio)
    document.body.appendChild(audio)
    audioElementsRef.current.push(audio)
  }, [])

  const handleTrackSubscribed = useCallback(
    (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Video) attachVideoTrack(track)
      if (track.kind === Track.Kind.Audio) attachAudioTrack(track)
    },
    [attachAudioTrack, attachVideoTrack]
  )

  const subscribeParticipantTracks = useCallback(
    (participant: RemoteParticipant) => {
      participant.trackPublications.forEach((pub: RemoteTrackPublication) => {
        if (pub.track) {
          handleTrackSubscribed(pub.track)
        } else if (pub.kind === Track.Kind.Video || pub.kind === Track.Kind.Audio) {
          void pub.setSubscribed(true)
        }
      })
    },
    [handleTrackSubscribed]
  )

  const connect = useCallback(async () => {
    setStatus("connecting")
    setError(null)

    try {
      let session: LiveKitSession | null = loadLiveKitSession()
      if (!session?.token) {
        session = await fetchLiveKitToken()
      }

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      })
      roomRef.current = room

      room.on(RoomEvent.TrackSubscribed, (track) => {
        handleTrackSubscribed(track)
      })

      room.on(RoomEvent.ParticipantConnected, (participant) => {
        subscribeParticipantTracks(participant)
      })

      room.on(RoomEvent.TranscriptionReceived, handleTranscriptionReceived)

      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        if (state === ConnectionState.Connected) {
          connectedAtRef.current = Date.now()
          setStatus("connected")
          options?.onConnected?.()
        } else if (
          state === ConnectionState.Disconnected ||
          state === ConnectionState.Reconnecting
        ) {
          if (state === ConnectionState.Disconnected) {
            setStatus("disconnected")
          }
        }
      })

      room.on(RoomEvent.Disconnected, () => {
        setStatus("disconnected")
        connectedAtRef.current = null
        cleanupAudioElements()
        options?.onDisconnected?.()
      })

      await room.connect(session.url, session.token)

      await room.localParticipant.setMicrophoneEnabled(true)

      room.remoteParticipants.forEach((participant) => {
        subscribeParticipantTracks(participant)
      })

      connectedAtRef.current = Date.now()
      setStatus("connected")
      options?.onConnected?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed"
      setError(message)
      setStatus("error")
    }
  }, [
    cleanupAudioElements,
    handleTrackSubscribed,
    handleTranscriptionReceived,
    options,
    subscribeParticipantTracks,
  ])

  const disconnect = useCallback(async () => {
    const room = roomRef.current
    if (room) {
      room.off(RoomEvent.TranscriptionReceived, handleTranscriptionReceived)
      await room.disconnect()
      roomRef.current = null
    }
    cleanupAudioElements()
    clearLiveKitSession()
    connectedAtRef.current = null
    segmentToMessageIdRef.current.clear()
    setStatus("disconnected")
  }, [cleanupAudioElements, handleTranscriptionReceived])

  const setMicrophoneEnabled = useCallback(async (enabled: boolean) => {
    await roomRef.current?.localParticipant.setMicrophoneEnabled(enabled)
  }, [])

  const sendText = useCallback(
    async (text: string) => {
      const room = roomRef.current
      const trimmed = text.trim()
      if (!trimmed || !room || room.state !== ConnectionState.Connected) return

      setIsSendingText(true)
      try {
        appendMessage("You", trimmed)
        await room.localParticipant.sendText(trimmed, {
          topic: LIVEKIT_CHAT_TOPIC,
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to send message"
        setError(message)
        throw err
      } finally {
        setIsSendingText(false)
      }
    },
    [appendMessage]
  )

  useEffect(() => {
    void connect()
    return () => {
      void disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- connect once on mount
  }, [])

  return {
    status,
    error,
    messages,
    isSendingText,
    avatarVideoRef,
    connect,
    disconnect,
    setMicrophoneEnabled,
    sendText,
  }
}
