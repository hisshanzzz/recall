export function MemoryChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1.5 rounded-full bg-clay/30 text-coffee border border-clay/50 text-sm">
      {label}
    </span>
  )
}
