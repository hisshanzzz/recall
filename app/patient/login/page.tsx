"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PatientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const VALID_EMAIL = "patient@recall.com"
  const VALID_PASSWORD = "patient123"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      router.push("/patient")
    } else {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-coffee flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon via-coffee to-maroon" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-peach/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-guave/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-6xl font-bold text-creme tracking-tight mb-6">
            Recall
          </h1>
          <p className="text-xl text-creme/60 leading-relaxed max-w-md">
            Reconnecting memories, one conversation at a time.
          </p>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-creme">
        <div className="w-full max-w-sm">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-leather/50 hover:text-coffee transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="text-3xl font-bold text-coffee">Recall</h1>
          </div>

          {/* Welcome text */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-coffee mb-2">Welcome back!</h2>
            <p className="text-leather/60">Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-coffee mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-transparent border-b-2 border-leather/20 text-coffee placeholder:text-leather/30 focus:outline-none focus:border-coffee transition-colors"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-coffee mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent border-b-2 border-leather/20 text-coffee placeholder:text-leather/30 focus:outline-none focus:border-coffee transition-colors pr-12"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-leather/40 hover:text-coffee transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-leather/50 hover:text-coffee transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-coffee text-creme font-medium rounded-full hover:bg-maroon active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-creme/30 border-t-creme rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Help */}
          <p className="mt-10 text-center text-sm text-leather/40">
            Need help? Contact your caregiver
          </p>
        </div>
      </div>
    </div>
  )
}
