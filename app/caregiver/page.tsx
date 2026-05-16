"use client"

import Link from "next/link"
import { Plus, Play, Clock, TrendingUp, ChevronRight, Heart, Brain, Sparkles, Users, BarChart3 } from "lucide-react"
import { SUNIL } from "@/data/patients"

const patient = {
  name: SUNIL.name,
  age: SUNIL.age,
  initials: "SP",
  condition: SUNIL.condition,
  lastSession: "2 hours ago",
}

const caregiver = {
  name: SUNIL.family[0].name.split(" ")[0],
  initials: "PP",
}

const stats = {
  totalSessions: 47,
  thisWeek: 5,
  avgDuration: 22,
  memoriesRecalled: 34,
  positiveRate: 89,
  moodChange: 5,
}

const moodData = [
  { day: "M", value: 82 },
  { day: "T", value: 75 },
  { day: "W", value: 68 },
  { day: "T", value: 45 },
  { day: "F", value: 78 },
  { day: "S", value: 88 },
  { day: "S", value: 72 },
]

const recentSessions = [
  { id: 1, topic: "Fishing at Negombo", time: "Today, 10:30 AM", duration: "24 min", mood: "good" },
  { id: 2, topic: "Nalanda College teaching", time: "Yesterday", duration: "18 min", mood: "okay" },
  { id: 3, topic: "Amaradeva — Sanda Eliye", time: "May 14", duration: "32 min", mood: "good" },
]

const topMemories = [
  { id: 1, title: "Fishing at Negombo lagoon", score: 95 },
  { id: 2, title: "Kelaniya Raja Maha Viharaya", score: 90 },
  { id: 3, title: "1996 World Cup victory", score: 88 },
]

export default function CaregiverDashboardPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-coffee flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-creme">Recall</h1>
          <p className="text-sm text-creme/40 mt-1">Caregiver Portal</p>
        </div>

        <div className="mx-4 p-4 bg-maroon/30 rounded-2xl mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-creme/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-creme">{patient.initials}</span>
            </div>
            <div>
              <p className="font-medium text-creme">{patient.name}</p>
              <p className="text-xs text-creme/50">{patient.age} years old</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-creme/40">
            <Clock className="w-3 h-3" />
            <span>Last session {patient.lastSession}</span>
          </div>
        </div>

        <Link
          href="/patient/start"
          className="mx-4 mb-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-peach to-maroon text-creme text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Start session with {SUNIL.nick}
        </Link>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            <li>
              <Link href="/caregiver" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-creme/10 text-creme">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/caregiver/sessions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-creme/50 hover:bg-creme/5 hover:text-creme transition-colors">
                <Users className="w-5 h-5" />
                <span>Sessions</span>
              </Link>
            </li>
            <li>
              <Link href="/caregiver/memories" className="flex items-center gap-3 px-4 py-3 rounded-xl text-creme/50 hover:bg-creme/5 hover:text-creme transition-colors">
                <Heart className="w-5 h-5" />
                <span>Memories</span>
              </Link>
            </li>
            <li>
              <Link href="/caregiver/insights" className="flex items-center gap-3 px-4 py-3 rounded-xl text-creme/50 hover:bg-creme/5 hover:text-creme transition-colors">
                <Brain className="w-5 h-5" />
                <span>Insights</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-creme/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-creme/10 flex items-center justify-center">
              <span className="text-sm font-medium text-creme">{caregiver.initials}</span>
            </div>
            <span className="text-sm text-creme">{caregiver.name}</span>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-coffee">Good morning, {caregiver.name}</h2>
            <p className="text-leather/50 mt-1">Here is how {patient.name} is doing</p>
          </div>
          <Link
            href="/patient/start"
            className="flex items-center gap-2 px-6 py-3 bg-coffee text-creme rounded-full font-medium hover:bg-maroon transition-colors"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            Start session with {SUNIL.nick}
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-coffee/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-leather/50">Sessions</span>
              <span className="text-xs text-pine bg-pine/10 px-2 py-0.5 rounded-full">+{stats.thisWeek} this week</span>
            </div>
            <p className="text-3xl font-semibold text-coffee">{stats.totalSessions}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-coffee/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-leather/50">Avg Duration</span>
              <Clock className="w-4 h-4 text-leather/30" />
            </div>
            <p className="text-3xl font-semibold text-coffee">
              {stats.avgDuration}
              <span className="text-lg text-leather/40 ml-1">min</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-coffee/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-leather/50">Memories</span>
              <Heart className="w-4 h-4 text-leather/30" />
            </div>
            <p className="text-3xl font-semibold text-coffee">{stats.memoriesRecalled}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-coffee/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-leather/50">Positive Rate</span>
              <TrendingUp className="w-4 h-4 text-pine" />
            </div>
            <p className="text-3xl font-semibold text-coffee">
              {stats.positiveRate}
              <span className="text-lg text-leather/40">%</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-coffee/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-coffee">Weekly Mood</h3>
                <p className="text-sm text-leather/40">AI-analyzed sentiment from sessions</p>
              </div>
              <div className="flex items-center gap-2 bg-pine/10 text-pine px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{stats.moodChange} this week</span>
              </div>
            </div>
            <div className="flex items-end gap-4 h-36">
              {moodData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full">
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        item.value >= 75 ? "bg-pine" : item.value >= 50 ? "bg-peach" : "bg-clay"
                      }`}
                      style={{ height: `${item.value * 1.2}px` }}
                    />
                  </div>
                  <span className="text-xs text-leather/40 mt-2">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-coffee/5">
              <span className="flex items-center gap-2 text-xs text-leather/50">
                <span className="w-2 h-2 rounded-full bg-pine" /> Good (75+)
              </span>
              <span className="flex items-center gap-2 text-xs text-leather/50">
                <span className="w-2 h-2 rounded-full bg-peach" /> Okay (50-74)
              </span>
              <span className="flex items-center gap-2 text-xs text-leather/50">
                <span className="w-2 h-2 rounded-full bg-clay" /> Difficult (&lt;50)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-coffee/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-coffee">Top Memories</h3>
              <Link href="/caregiver/memories" className="text-xs text-leather/40 hover:text-coffee transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {topMemories.map((memory, i) => (
                <div key={memory.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-coffee/5 flex items-center justify-center text-xs text-coffee font-medium">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-coffee truncate">{memory.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-coffee/10 rounded-full overflow-hidden">
                        <div className="h-full bg-pine rounded-full" style={{ width: `${memory.score}%` }} />
                      </div>
                      <span className="text-xs text-pine font-medium">{memory.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 text-sm text-coffee/60 border border-dashed border-coffee/20 rounded-xl hover:border-coffee/40 hover:text-coffee transition-all"
            >
              <Plus className="w-4 h-4" />
              Add memory
            </button>
          </div>

          <div className="col-span-2 bg-white rounded-2xl p-6 border border-coffee/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-coffee">Recent Sessions</h3>
              <Link
                href="/caregiver/sessions"
                className="text-xs text-leather/40 hover:text-coffee transition-colors flex items-center gap-1"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-creme/50 transition-colors cursor-pointer group"
                >
                  <div className={`w-2 h-2 rounded-full ${session.mood === "good" ? "bg-pine" : "bg-peach"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-coffee">{session.topic}</p>
                    <p className="text-xs text-leather/40">{session.time}</p>
                  </div>
                  <span className="text-sm text-leather/40">{session.duration}</span>
                  <ChevronRight className="w-4 h-4 text-leather/20 group-hover:text-coffee transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-coffee to-maroon rounded-2xl p-6 text-creme">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">AI Insights</h3>
            </div>
            <ul className="space-y-3 text-sm text-creme/80">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-peach mt-2 flex-shrink-0" />
                Morning sessions show 40% better engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-peach mt-2 flex-shrink-0" />
                Fishing memories produce best responses
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-peach mt-2 flex-shrink-0" />
                Consider scheduling next session at 10 AM
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
