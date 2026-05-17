"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, MapPin, Utensils, Music, Briefcase, Heart, Star, X } from "lucide-react"

const categoryMeta: Record<string, { icon: React.ElementType; color: string }> = {
  place:  { icon: MapPin,    color: "bg-blue-500" },
  food:   { icon: Utensils,  color: "bg-amber-500" },
  music:  { icon: Music,     color: "bg-pink-500" },
  career: { icon: Briefcase, color: "bg-green-500" },
  faith:  { icon: Heart,     color: "bg-purple-500" },
  family: { icon: Star,      color: "bg-rose-500" },
}

const categoryOptions = ["place", "food", "music", "career", "faith", "family"]

const effectivenessColors: Record<string, string> = {
  high:   "text-guave bg-guave/10",
  medium: "text-clay bg-clay/20",
  low:    "text-leather/50 bg-leather/10",
}

type Memory = {
  id: number
  title: string
  category: string
  description: string
  dateAdded: string
  timesRecalled: number
  effectiveness: string
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: "", category: "place", description: "" })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/memories")
      .then((r) => r.json())
      .then(setMemories)
      .catch(console.error)
  }, [])

  const categories = [
    { id: "all", label: "All", count: memories.length },
    ...categoryOptions.map((id) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1) + (id === "place" ? "s" : id === "family" ? "" : ""),
      count: memories.filter((m) => m.category === id).length,
      icon: categoryMeta[id]?.icon,
    })),
  ]

  const visible = activeCategory === "all" ? memories : memories.filter((m) => m.category === activeCategory)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save")
      const newMemory = await res.json()
      setMemories((prev) => [...prev, newMemory])
      setForm({ title: "", category: "place", description: "" })
      setShowModal(false)
    } catch {
      setError("Could not save memory. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-creme">
      {/* Top Navigation */}
      <nav className="bg-warm-white border-b border-clay/10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-extrabold text-coffee tracking-tight">Recall</h1>
          <div className="flex items-center gap-8">
            <Link href="/caregiver" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">Overview</Link>
            <Link href="/caregiver/sessions" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">Sessions</Link>
            <Link href="/caregiver/memories" className="text-sm font-medium text-coffee border-b-2 border-peach pb-1">Memories</Link>
            <Link href="/caregiver/insights" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">Insights</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-coffee font-medium">Pradeep Perera</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clay to-leather flex items-center justify-center">
              <span className="text-sm font-semibold text-creme">PP</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-coffee">Memory Book</h2>
            <p className="text-leather/60">{"Curated memories to help Thatha remember"}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-coffee text-creme px-4 py-2.5 rounded-xl font-medium hover:bg-coffee/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
                activeCategory === cat.id ? "bg-coffee text-creme" : "bg-warm-white text-leather hover:bg-clay/20"
              }`}
            >
              {"icon" in cat && cat.icon && <cat.icon className="w-4 h-4" />}
              <span>{cat.label}</span>
              <span className={`text-xs ${activeCategory === cat.id ? "text-creme/70" : "text-leather/50"}`}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Memories Grid */}
        <div className="grid grid-cols-2 gap-6">
          {visible.map((memory) => {
            const meta = categoryMeta[memory.category] ?? { icon: Star, color: "bg-gray-400" }
            const Icon = meta.icon
            return (
              <div
                key={memory.id}
                className="bg-warm-white rounded-2xl p-6 border border-clay/10 hover:border-clay/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${meta.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-coffee mb-1 group-hover:text-peach transition-colors">{memory.title}</h3>
                    <span className="text-xs text-leather/50 capitalize">{memory.category}</span>
                  </div>
                </div>
                <p className="text-sm text-leather/70 mb-4 leading-relaxed">{memory.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-clay/10">
                  <div className="flex items-center gap-4 text-xs text-leather/50">
                    <span>Added {memory.dateAdded}</span>
                    <span>Recalled {memory.timesRecalled}x</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${effectivenessColors[memory.effectiveness] ?? ""}`}>
                    {memory.effectiveness} impact
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Add Memory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-warm-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-coffee">Add Memory</h3>
              <button onClick={() => setShowModal(false)} className="text-leather/40 hover:text-leather transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Sunday cricket matches"
                  className="w-full border border-clay/20 rounded-xl px-4 py-2.5 text-sm text-coffee placeholder:text-leather/30 focus:outline-none focus:border-clay/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-clay/20 rounded-xl px-4 py-2.5 text-sm text-coffee focus:outline-none focus:border-clay/50"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe this memory in detail..."
                  className="w-full border border-clay/20 rounded-xl px-4 py-2.5 text-sm text-coffee placeholder:text-leather/30 focus:outline-none focus:border-clay/50 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-clay/20 rounded-xl py-2.5 text-sm font-medium text-leather hover:bg-clay/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-coffee text-creme rounded-xl py-2.5 text-sm font-medium hover:bg-coffee/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Memory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
