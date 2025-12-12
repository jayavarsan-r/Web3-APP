"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Mail, Lock, User, CheckCircle2, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setApiError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setApiError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {}
          data.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field] = err.message
          })
          setErrors(fieldErrors)
        } else {
          setApiError(data.error || "Signup failed")
        }
        return
      }

      router.push("/dashboard")
    } catch (error) {
      setApiError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-purple-500/30 dark:bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-pink-500/30 dark:bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-2 shadow-2xl rounded-3xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-60" />
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                <UserPlus className="h-9 w-9 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base">Start your productivity journey today</CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <Alert variant="destructive" className="rounded-2xl border-2">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-sm text-destructive font-medium">{errors.password}</p>}
              <p className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl shadow-xl shadow-purple-500/30 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Sign in
                <CheckCircle2 className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
