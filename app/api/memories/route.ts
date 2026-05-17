import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import path from "path"

const memoriesPath = path.join(process.cwd(), "data", "memories.json")

function readMemories() {
  const raw = readFileSync(memoriesPath, "utf-8")
  return JSON.parse(raw)
}

export async function GET() {
  try {
    const memories = readMemories()
    return NextResponse.json(memories)
  } catch (e) {
    console.error("[memories GET]", e)
    return NextResponse.json({ error: "Failed to read memories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, category, description } = body

    if (!title || !category || !description) {
      return NextResponse.json({ error: "title, category, and description are required" }, { status: 400 })
    }

    const memories = readMemories()
    const newMemory = {
      id: Date.now(),
      title,
      category,
      description,
      dateAdded: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      timesRecalled: 0,
      effectiveness: "medium",
    }

    memories.push(newMemory)
    writeFileSync(memoriesPath, JSON.stringify(memories, null, 2))

    return NextResponse.json(newMemory, { status: 201 })
  } catch (e) {
    console.error("[memories POST]", e)
    return NextResponse.json({ error: "Failed to save memory" }, { status: 500 })
  }
}
