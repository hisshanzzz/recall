import { randomUUID } from "crypto"
import { AccessToken, AgentDispatchClient } from "livekit-server-sdk"

const AGENT_NAME = "ama"
const ROOM_PREFIX = "recall-room"

function getLiveKitConfig() {
  const url = process.env.LIVEKIT_URL
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!url || !apiKey || !apiSecret) {
    throw new Error(
      "Missing LIVEKIT_URL, LIVEKIT_API_KEY, or LIVEKIT_API_SECRET"
    )
  }

  return { url, apiKey, apiSecret }
}

export function createRoomName(customRoom?: string): string {
  if (customRoom?.startsWith(ROOM_PREFIX)) return customRoom
  return `${ROOM_PREFIX}-${randomUUID().slice(0, 8)}`
}

export async function createPatientLiveKitSession(options?: {
  room?: string
  identity?: string
}) {
  const { url, apiKey, apiSecret } = getLiveKitConfig()
  const room = createRoomName(options?.room)
  const identity = options?.identity ?? `patient-${randomUUID().slice(0, 8)}`

  const dispatchClient = new AgentDispatchClient(url, apiKey, apiSecret)
  await dispatchClient.createDispatch(room, AGENT_NAME)

  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name: identity,
  })
  token.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
  })

  const clientUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? url

  return {
    token: await token.toJwt(),
    url: clientUrl,
    room,
    identity,
  }
}
