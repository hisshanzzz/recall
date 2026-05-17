import { transcriptPreview, type TranscriptTurn } from "@/lib/sessions-store/types"

const GEMINI_MODEL = process.env.GEMINI_SUMMARY_MODEL ?? "gemini-2.0-flash"

export type CaregiverSummaryInput = {
  turns: TranscriptTurn[]
  patientName: string
  patientNick: string
  caregiverName: string
}

export type CaregiverSummaryResult = {
  summary: string
  mood: string
}

function turnsToDialogue(turns: TranscriptTurn[]): string {
  return turns
    .map((t) => `${t.speaker === "agent" ? "Ama" : "Thatha"}: ${t.text}`)
    .join("\n")
}

function parseSummaryResponse(raw: string): CaregiverSummaryResult {
  const moodMatch = raw.match(/\nMOOD:\s*(\w+)\s*$/i)
  if (moodMatch) {
    const mood = moodMatch[1].toLowerCase()
    const summary = raw.replace(/\nMOOD:\s*\w+\s*$/i, "").trim()
    return { summary, mood }
  }
  return { summary: raw.trim(), mood: "calm" }
}

function stubSummary(input: CaregiverSummaryInput): CaregiverSummaryResult {
  const preview = transcriptPreview(input.turns, 400)
  return {
    summary: `${input.patientNick} finished a session with Ama. ${preview}`,
    mood: "calm",
  }
}

export async function generateCaregiverSummary(
  input: CaregiverSummaryInput
): Promise<CaregiverSummaryResult> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim()
  if (!apiKey) {
    console.warn("[gemini] GOOGLE_API_KEY not set — using stub summary")
    return stubSummary(input)
  }

  if (input.turns.length === 0) {
    return {
      summary: `${input.patientNick} had a short session with Ama today. No conversation was captured.`,
      mood: "calm",
    }
  }

  const dialogue = turnsToDialogue(input.turns)
  const prompt = `You write brief WhatsApp updates for a family caregiver about their parent with dementia.

Patient: ${input.patientName} ("${input.patientNick}")
Caregiver: ${input.caregiverName} (lives abroad)

Session transcript:
${dialogue}

Write 2–4 short paragraphs for ${input.caregiverName}. Mention mood, topics discussed, and how engaged ${input.patientNick} seemed. Warm, reassuring tone. Do not quote the transcript line-by-line. Do not mention AI or technology.

End with exactly one line: MOOD: <one word> (e.g. positive, calm, nostalgic, peaceful, happy)`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("[gemini] API error", res.status, errText)
    return stubSummary(input)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) {
    console.warn("[gemini] empty response — using stub")
    return stubSummary(input)
  }

  return parseSummaryResponse(text)
}
