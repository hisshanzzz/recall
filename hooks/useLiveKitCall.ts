"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
} from "livekit-client"
import {
  clearLiveKitSession,
  fetchLiveKitToken,
  loadLiveKitSession,
  type LiveKitSession,
} from "@/lib/livekit-session"

export type CallConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

type UseLiveKitCallOptions = {
  onConnected?: () => void
  onDisconnected?: () => void
}

export function useLiveKitCall(options?: UseLiveKitCallOptions) {
  const [status, setStatus] = useState<CallConnectionStatus>("disconnected")
  const [error, setError] = useState<string | null>(null)
  const roomRef = useRef<Room | null>(null)
  const avatarVideoRef = useRef<HTMLVideoElement>(null)
  const audioElementsRef = useRef<HTMLAudioElement[]>([])

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

      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        if (state === ConnectionState.Connected) {
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
        cleanupAudioElements()
        options?.onDisconnected?.()
      })

      await room.connect(session.url, session.token)

      await room.localParticipant.setMicrophoneEnabled(true)

      room.remoteParticipants.forEach((participant) => {
        subscribeParticipantTracks(participant)
      })

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
    options,
    subscribeParticipantTracks,
  ])

  const disconnect = useCallback(async () => {
    const room = roomRef.current
    if (room) {
      await room.disconnect()
      roomRef.current = null
    }
    cleanupAudioElements()
    clearLiveKitSession()
    setStatus("disconnected")
  }, [cleanupAudioElements])

  const setMicrophoneEnabled = useCallback(async (enabled: boolean) => {
    await roomRef.current?.localParticipant.setMicrophoneEnabled(enabled)
  }, [])

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
    avatarVideoRef,
    connect,
    disconnect,
    setMicrophoneEnabled,
  }
}
