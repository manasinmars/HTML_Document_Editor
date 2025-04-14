"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCurrentUser, getActiveUsers, isAdmin, getUsers, type User } from "@/lib/auth"
import { Users, FileText, Clock, Eye } from "lucide-react"
import AdminHeader from "@/components/admin-header"

// Add a FileViewerModal component
const FileViewerModal = ({
  content,
  fileName,
  onClose,
}: { content: string; fileName: string; onClose: () => void }) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {fileName || "Untitled Document"}
          </DialogTitle>
        </DialogHeader>
        <div className="border rounded-md p-4 bg-muted/30 overflow-auto max-h-[60vh]">
          <pre className="text-sm whitespace-pre-wrap">{content}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingFile, setViewingFile] = useState<{ content: string; fileName: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = getCurrentUser()

    if (!user) {
      router.push("/")
      return
    }

    if (!isAdmin(user)) {
      router.push("/dashboard")
      return
    }

    setCurrentUser(user)

    // Get initial data
    fetchUsers()

    // Set up polling for active users
    const interval = setInterval(fetchUsers, 5000) // Poll every 5 seconds

    setLoading(false)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [router])

  const fetchUsers = () => {
    const active = getActiveUsers()
    const all = getUsers().map(({ password, ...user }) => user) // Remove passwords

    setActiveUsers(active)
    setAllUsers(all)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) return `${diffSec} seconds ago`
    if (diffMin < 60) return `${diffMin} minutes ago`
    if (diffHour < 24) return `${diffHour} hours ago`
    return `${diffDay} days ago`
  }

  const viewFileContent = (content: string, fileName: string) => {
    setViewingFile({ content, fileName })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader currentUser={currentUser} onLogout={handleLogout} />

      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                {allUsers.filter((u) => u.role === "admin").length} admins,{" "}
                {allUsers.filter((u) => u.role === "user").length} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.length}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Files Being Edited</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.filter((user) => user.currentFile).length}</div>
              <p className="text-xs text-muted-foreground">Active documents</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="all">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Users currently online and their activities</CardDescription>
              </CardHeader>
              <CardContent>
                {activeUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No active users at the moment</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Role</th>
                          <th className="text-left py-3 px-4">Current File</th>
                          <th className="text-left py-3 px-4">Last Active</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                            </td>
                            <td className="py-3 px-4">{user.currentFile || "Not editing"}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span title={user.lastActive ? formatDate(user.lastActive) : "Unknown"}>
                                  {user.lastActive ? getTimeAgo(user.lastActive) : "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {user.fileContent ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewFileContent(user.fileContent, user.currentFile || "Untitled")}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View File
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-sm">No content</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => {
                        const activeUser = activeUsers.find((activeUser) => activeUser.id === user.id)
                        const isActive = !!activeUser
                        return (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={isActive ? "success" : "secondary"}>
                                {isActive ? "Online" : "Offline"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {activeUser?.lastActive ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span title={formatDate(activeUser.lastActive)}>
                                    {getTimeAgo(activeUser.lastActive)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {viewingFile && (
        <FileViewerModal
          content={viewingFile.content}
          fileName={viewingFile.fileName}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  )
}
