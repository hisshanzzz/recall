"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown, Clock, Brain, Heart, Sun, Moon, Lightbulb } from "lucide-react"

const weeklyStats = [
  { label: "Total Sessions", value: "5", change: "+2", trend: "up" },
  { label: "Avg Duration", value: "23 min", change: "+4 min", trend: "up" },
  { label: "Memories Recalled", value: "13", change: "+5", trend: "up" },
  { label: "Mood Score", value: "7.2/10", change: "-0.3", trend: "down" },
]

const bestTimes = [
  { time: "Morning (9-11 AM)", score: 85, icon: Sun },
  { time: "Afternoon (2-4 PM)", score: 65, icon: Clock },
  { time: "Evening (6-8 PM)", score: 45, icon: Moon },
]

const topMemories = [
  { title: "Fishing memories", recalls: 8, engagement: "Very High" },
  { title: "Wedding & Kamala", recalls: 7, engagement: "High" },
  { title: "Teaching career", recalls: 6, engagement: "High" },
  { title: "Traditional food", recalls: 5, engagement: "Medium" },
]

const recommendations = [
  {
    title: "Schedule morning sessions",
    description: "Thatha is most alert and responsive between 9-11 AM. Consider prioritizing sessions during this window.",
    priority: "high",
  },
  {
    title: "Explore music memories",
    description: "Baila and traditional music show promising engagement. Try playing familiar songs during sessions.",
    priority: "medium",
  },
  {
    title: "Introduce visual aids",
    description: "Adding photos of Negombo lagoon and family events may strengthen memory recall.",
    priority: "medium",
  },
  {
    title: "Shorter Thursday sessions",
    description: "Data shows lower engagement on Thursdays. Consider 15-minute sessions instead of longer ones.",
    priority: "low",
  },
]

const priorityColors: Record<string, string> = {
  high: "border-l-peach bg-peach/5",
  medium: "border-l-guave bg-guave/5",
  low: "border-l-clay bg-clay/10",
}

export default function InsightsPage() {
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
            <Link href="/caregiver/memories" className="text-sm font-medium text-leather/60 hover:text-leather transition-colors">
              Memories
            </Link>
            <Link href="/caregiver/insights" className="text-sm font-medium text-coffee border-b-2 border-peach pb-1">
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-coffee">Insights</h2>
          <p className="text-leather/60">{"Understanding Thatha's patterns and progress"}</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {weeklyStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-warm-white rounded-2xl p-5 border border-clay/10"
            >
              <div className="text-sm text-leather/60 mb-2">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-coffee">{stat.value}</div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-guave" : "text-maroon"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Best Times */}
          <div className="bg-warm-white rounded-2xl p-6 border border-clay/10">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-peach" />
              <h3 className="text-lg font-semibold text-coffee">Best Times for Sessions</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {bestTimes.map((item) => (
                <div key={item.time} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-peach" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-coffee mb-1">{item.time}</div>
                    <div className="h-2 bg-clay/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-peach to-guave rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-coffee">{item.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Memory Topics */}
          <div className="bg-warm-white rounded-2xl p-6 border border-clay/10">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-5 h-5 text-guave" />
              <h3 className="text-lg font-semibold text-coffee">Most Effective Memories</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {topMemories.map((memory, index) => (
                <div
                  key={memory.title}
                  className="flex items-center gap-4 p-3 rounded-xl bg-clay/5"
                >
                  <div className="w-8 h-8 rounded-full bg-guave/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-guave">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-coffee">{memory.title}</div>
                    <div className="text-xs text-leather/50">{memory.recalls} times recalled</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-guave/10 text-guave font-medium">
                    {memory.engagement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-warm-white rounded-2xl p-6 border border-clay/10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-peach" />
            <h3 className="text-lg font-semibold text-coffee">Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.title}
                className={`p-4 rounded-xl border-l-4 ${priorityColors[rec.priority]}`}
              >
                <h4 className="font-medium text-coffee mb-1">{rec.title}</h4>
                <p className="text-sm text-leather/60">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Trend */}
        <div className="mt-8 bg-warm-white rounded-2xl p-6 border border-clay/10">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-maroon" />
            <h3 className="text-lg font-semibold text-coffee">Emotional Journey</h3>
          </div>
          
          <p className="text-sm text-leather/70 leading-relaxed">
            {"Over the past two weeks, Thatha has shown improved engagement during sessions focused on his teaching career and family memories. The fishing memories at Negombo lagoon remain the strongest trigger for positive emotions and detailed recall. We recommend continuing to build on these core memories while gently introducing related topics like his students' achievements and family gatherings at the lagoon."}
          </p>
        </div>
      </main>
    </div>
  )
}
