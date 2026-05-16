type AvatarProps = {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "w-16 h-16 text-2xl",
  md: "w-32 h-32 text-4xl",
  lg: "w-40 h-40 text-5xl",
}

export function Avatar({ size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-peach to-maroon flex items-center justify-center text-creme font-bold shadow-lg ${className || sizes[size]}`}
    >
      N
    </div>
  )
}
