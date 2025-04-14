"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthContainer from "@/components/auth-container"
import { getCurrentUser, initializeAdmin, updateUserActivity } from "@/lib/auth"

export default function AuthPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "login"

  useEffect(() => {
    // Initialize admin user if not exists
    initializeAdmin()

    // Check if user is already logged in
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
    setLoading(false)
  }, [router])

  const handleAuthChange = (user: any) => {
    setCurrentUser(user)

    // Update user activity
    updateUserActivity(user.id, true)

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="h-screen w-full">
      <AuthContainer onAuthChange={handleAuthChange} defaultTab={defaultTab} />
    </main>
  )
}
