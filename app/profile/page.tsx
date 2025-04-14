"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, updateUserActivity } from "@/lib/auth"
import { FileText, User, Mail, Calendar, Clock, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"

export default function UserProfile() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editedFiles, setEditedFiles] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser()

    if (!user) {
      router.push("/auth")
      return
    }

    setCurrentUser(user)

    // Get edited files from localStorage
    const files = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`savedHtml_${user.id}`)) {
        const fileName = key.replace(`savedHtml_${user.id}_`, "") || "Untitled"
        const lastEdited = localStorage.getItem(`lastEdited_${user.id}_${fileName}`) || new Date().toISOString()
        files.push({
          name: fileName,
          lastEdited,
        })
      }
    }

    // If no specific files found, add the default one
    if (files.length === 0 && localStorage.getItem(`savedHtml_${user.id}`)) {
      files.push({
        name: "Default Document",
        lastEdited: new Date().toISOString(),
      })
    }

    setEditedFiles(files)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href={currentUser.role === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to {currentUser.role === "admin" ? "Admin" : "Dashboard"}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <Badge variant={currentUser.role === "admin" ? "default" : "outline"}>{currentUser.role}</Badge>
                    <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">Account Created</div>
                      <div className="text-sm text-muted-foreground">{formatDate(currentUser.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Documents</CardTitle>
                <CardDescription>Documents you have created or edited</CardDescription>
              </CardHeader>
              <CardContent>
                {editedFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>You haven't created any documents yet.</p>
                    <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                      Create Your First Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last edited: {formatDate(file.lastEdited)}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => router.push("/dashboard")}>
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Account settings functionality will be implemented in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and document changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {editedFiles.length > 0 ? (
                      editedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border-b last:border-0">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm">
                              Edited document <span className="font-medium">{file.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{formatDate(file.lastEdited)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No recent activity to display.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
