"use client"

import Link from "next/link"
import { Plus, MapPin, Utensils, Music, Briefcase, Heart, Star } from "lucide-react"

const categories = [
  { id: "all", label: "All", count: 12 },
  { id: "place", label: "Places", count: 4, icon: MapPin },
  { id: "food", label: "Food", count: 2, icon: Utensils },
  { id: "music", label: "Music", count: 2, icon: Music },
  { id: "career", label: "Career", count: 2, icon: Briefcase },
  { id: "faith", label: "Faith", count: 1, icon: Heart },
  { id: "family", label: "Family", count: 1, icon: Star },
]

const memories = [
  {
    id: 1,
    title: "Fishing at Negombo lagoon",
    category: "place",
    description: "Spent weekends fishing with brother Anura. Would catch prawns and sell at local market. The lagoon was peaceful in early mornings.",
    dateAdded: "May 10, 2024",
    timesRecalled: 8,
    effectiveness: "high",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Amma's milk rice",
    category: "food",
    description: "Mother's special milk rice for Sinhala New Year. The aroma of coconut milk and jaggery. Always served on banana leaves.",
    dateAdded: "May 8, 2024",
    timesRecalled: 5,
    effectiveness: "high",
    icon: Utensils,
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "Teaching at Royal College",
    category: "career",
    description: "35 years teaching mathematics. Proud of students who became doctors and engineers. The old classroom with wooden desks.",
    dateAdded: "May 5, 2024",
    timesRecalled: 6,
    effectiveness: "high",
    icon: Briefcase,
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Kataragama pilgrimage",
    category: "faith",
    description: "Annual journey to Kataragama temple. Walking barefoot on hot sand. The peacocks at the temple grounds.",
    dateAdded: "May 3, 2024",
    timesRecalled: 4,
    effectiveness: "medium",
    icon: Heart,
    color: "bg-purple-500",
  },
  {
    id: 5,
    title: "Baila with Anura",
    category: "music",
    description: "Dancing baila at weddings with brother. The sound of the rabana drum. Everyone in a circle, clapping hands.",
    dateAdded: "May 1, 2024",
    timesRecalled: 3,
    effectiveness: "medium",
    icon: Music,
    color: "bg-pink-500",
  },
  {
    id: 6,
    title: "Wedding day with Kamala",
    category: "family",
    description: "The sari she wore, deep red with gold border. Exchange of rings at the poruwa ceremony. Her smile.",
    dateAdded: "April 28, 2024",
    timesRecalled: 7,
    effectiveness: "high",
    icon: Star,
    color: "bg-rose-500",
  },
]

const effectivenessColors: Record<string, string> = {
  high: "text-guave bg-guave/10",
  medium: "text-clay bg-clay/20",
  low: "text-leather/50 bg-leather/10",
}

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-creme">
      {/* Top Navigation */}
      <nav className="bg-warm-white border-b border-clay/10">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-extrabold text-coffee tracking-tight">Recall</h1>
          
          <div className="flex items-center gap-8">
            <Link href="/caregiver" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">
              Overview
            </Link>
            <Link href="/caregiver/sessions" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">
              Sessions
            </Link>
            <Link href="/caregiver/memories" className="text-sm font-medium text-coffee border-b-2 border-peach pb-1">
              Memories
            </Link>
            <Link href="/caregiver/insights" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">
              Insights
            </Link>
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
          
          <button className="flex items-center gap-2 bg-coffee text-creme px-4 py-2.5 rounded-xl font-medium hover:bg-coffee/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
                category.id === "all"
                  ? "bg-coffee text-creme"
                  : "bg-warm-white text-leather hover:bg-clay/20"
              }`}
            >
              {category.icon && <category.icon className="w-4 h-4" />}
              <span>{category.label}</span>
              <span className={`text-xs ${category.id === "all" ? "text-creme/70" : "text-leather/50"}`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Memories Grid */}
        <div className="grid grid-cols-2 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="bg-warm-white rounded-2xl p-6 border border-clay/10 hover:border-clay/20 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl ${memory.color} flex items-center justify-center shrink-0`}>
                  <memory.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-coffee mb-1 group-hover:text-peach transition-colors">
                    {memory.title}
                  </h3>
                  <span className="text-xs text-leather/50 capitalize">{memory.category}</span>
                </div>
              </div>
              
              <p className="text-sm text-leather/70 mb-4 leading-relaxed">
                {memory.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-clay/10">
                <div className="flex items-center gap-4 text-xs text-leather/50">
                  <span>Added {memory.dateAdded}</span>
                  <span>Recalled {memory.timesRecalled}x</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${effectivenessColors[memory.effectiveness]}`}>
                  {memory.effectiveness} impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
