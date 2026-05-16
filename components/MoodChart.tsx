const moodData = [
  { day: "M", value: 82 },
  { day: "T", value: 75 },
  { day: "W", value: 68 },
  { day: "T", value: 45 },
  { day: "F", value: 78 },
  { day: "S", value: 88 },
  { day: "S", value: 72 },
]

export function MoodChart() {
  return (
    <div>
      <div className="flex items-end gap-4 h-36">
        {moodData.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full">
              <div
                className={`w-full rounded-t-lg ${
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
          <span className="w-2 h-2 rounded-full bg-peach" /> Okay (50–74)
        </span>
        <span className="flex items-center gap-2 text-xs text-leather/50">
          <span className="w-2 h-2 rounded-full bg-clay" /> Difficult (&lt;50)
        </span>
      </div>
    </div>
  )
}
