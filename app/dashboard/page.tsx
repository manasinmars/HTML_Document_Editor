"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EditorContainer from "@/components/editor-container"
import { getCurrentUser, updateUserActivity } from "@/lib/auth"
import type { User } from "@/lib/auth"

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser()

    if (!user) {
      router.push("/")
      return
    }

    // If user is admin, redirect to admin dashboard
    if (user.role === "admin") {
      router.push("/admin")
      return
    }

    setCurrentUser(user)
    setLoading(false)

    // Update user activity
    updateUserActivity(user.id, true)

    // Set up activity tracking
    const activityInterval = setInterval(() => {
      updateUserActivity(user.id, true)
    }, 60000) // Update every minute

    // Clean up on unmount
    return () => {
      clearInterval(activityInterval)
      if (user) {
        updateUserActivity(user.id, false)
      }
    }
  }, [router])

  const handleLogout = () => {
    if (currentUser) {
      updateUserActivity(currentUser.id, false)
    }
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleFileChange = (fileName: string) => {
    if (currentUser) {
      updateUserActivity(currentUser.id, true, fileName)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <main className="h-screen w-full">
      {currentUser && (
        <EditorContainer currentUser={currentUser} onLogout={handleLogout} onFileChange={handleFileChange} />
      )}
    </main>
  )
}
