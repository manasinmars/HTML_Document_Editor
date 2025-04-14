"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, FileText, Users, MessageSquare, ArrowRight } from "lucide-react"
import { getCurrentUser, initializeAdmin } from "@/lib/auth"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initialize admin user if not exists
    initializeAdmin()

    // Check if user is already logged in
    const user = getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
    setLoading(false)
  }, [])

  const handleDashboardClick = () => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/auth")
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
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-[radial-gradient(var(--primary-light)_1px,transparent_1px)] bg-[size:20px_20px]">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
              <Code size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              HTML Document Editor
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A powerful HTML editor with live preview, file management, and collaboration features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {currentUser ? (
                <Button size="lg" onClick={handleDashboardClick}>
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => router.push("/auth")}>
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => router.push("/auth?tab=signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rich HTML Editing</h3>
                <p className="text-muted-foreground">
                  Powerful code editor with syntax highlighting, live preview, and support for multiple file formats.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">User Management</h3>
                <p className="text-muted-foreground">
                  Secure authentication, user profiles, and role-based access control for teams and organizations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-8">
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Collaboration Tools</h3>
                <p className="text-muted-foreground">
                  Track user activity, monitor document changes, and provide feedback through the integrated system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start creating?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of developers and content creators to build beautiful HTML documents with ease.
          </p>
          <Button size="lg" onClick={handleDashboardClick}>
            {currentUser ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Code className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">HTML Document Editor</span>
            </div>
            <div className="flex gap-6">
              <Link href="/auth" className="text-muted-foreground hover:text-primary">
                Login
              </Link>
              <Link href="/feedback" className="text-muted-foreground hover:text-primary">
                Feedback
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HTML Document Editor. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
