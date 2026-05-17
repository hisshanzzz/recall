type FamilyMember = {
  name: string
  whatsapp: string
  alerts: boolean
}

export type WhatsAppSendResult = {
  sent: boolean
  dryRun: boolean
  recipients: string[]
  errors?: string[]
}

function normalizeWhatsAppAddress(phone: string): string {
  const trimmed = phone.trim()
  if (trimmed.startsWith("whatsapp:")) return trimmed
  return `whatsapp:${trimmed.startsWith("+") ? trimmed : `+${trimmed}`}`
}

function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_WHATSAPP_FROM?.trim()
  )
}

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ sid?: string; dryRun: boolean }> {
  const from = process.env.TWILIO_WHATSAPP_FROM!.trim()
  const toAddress = normalizeWhatsAppAddress(to)

  if (!twilioConfigured()) {
    console.log("[twilio] dry run — would send to", toAddress)
    console.log("[twilio] message:\n", body)
    return { dryRun: true }
  }

  const auth = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString("base64")

  const params = new URLSearchParams({
    From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    To: toAddress,
    Body: body,
  })

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Twilio ${res.status}: ${errText}`)
  }

  const data = (await res.json()) as { sid: string }
  return { sid: data.sid, dryRun: false }
}

export async function notifyCaregiversWhatsApp(
  family: readonly FamilyMember[],
  body: string
): Promise<WhatsAppSendResult> {
  const recipients = family.filter((m) => m.alerts).map((m) => m.whatsapp)

  if (recipients.length === 0) {
    return { sent: false, dryRun: !twilioConfigured(), recipients: [] }
  }

  const dryRun = !twilioConfigured()
  const errors: string[] = []
  let anySent = false

  for (const phone of recipients) {
    try {
      const result = await sendWhatsAppMessage(phone, body)
      if (!result.dryRun) anySent = true
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error("[twilio] send failed", phone, msg)
      errors.push(`${phone}: ${msg}`)
    }
  }

  return {
    sent: anySent,
    dryRun,
    recipients,
    ...(errors.length > 0 ? { errors } : {}),
  }
}
