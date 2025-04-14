"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "lucide-react"
import { getUsers } from "@/lib/auth"
import Link from "next/link"

interface AuthContainerProps {
  onAuthChange: (user: any) => void
  defaultTab?: string
}

export default function AuthContainer({ onAuthChange, defaultTab = "login" }: AuthContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")
  const [isShaking, setIsShaking] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Get users from localStorage
    const users = getUsers()

    // Find user
    const user = users.find((u) => u.email === loginEmail && u.password === loginPassword)

    if (user) {
      // Store current user (without password)
      const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role || "user", // Default to 'user' if role is not set
      }

      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      onAuthChange(currentUser)
    } else {
      setLoginError("Invalid email or password")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError("")

    // Validate passwords match
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Get existing users
    const users = getUsers()

    // Check if email already exists
    if (users.some((user) => user.email === signupEmail)) {
      setSignupError("Email already in use")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: signupName,
      email: signupEmail,
      password: signupPassword, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
      role: "user", // Default role for new users
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Store current user (without password)
    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      role: newUser.role,
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    onAuthChange(currentUser)
  }

  return (
    <div className="auth-container flex justify-center items-center min-h-screen p-4 bg-background bg-[radial-gradient(var(--primary-light)_1px,transparent_1px)] bg-[size:20px_20px]">
      <Card className="w-full max-width-450 max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
        <CardHeader className="flex flex-col items-center space-y-4 pt-8">
          <div className="auth-logo">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center">
              <Code size={48} className="text-primary" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">HTML Document Editor</h1>
            <p className="text-muted-foreground">Sign in to access your document editor</p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form
                onSubmit={handleLogin}
                className={`space-y-4 ${isShaking && activeTab === "login" ? "animate-shake" : ""}`}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <span>Email</span>
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <span>Password</span>
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {loginError && <p className="text-error text-sm">{loginError}</p>}
                <Button type="submit" className="w-full">
                  <span>Login</span>
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form
                onSubmit={handleSignup}
                className={`space-y-4 ${isShaking && activeTab === "signup" ? "animate-shake" : ""}`}
              >
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="flex items-center gap-2">
                    <span>Name</span>
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <span>Email</span>
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <span>Password</span>
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="flex items-center gap-2">
                    <span>Confirm Password</span>
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    required
                  />
                </div>
                {signupError && <p className="text-error text-sm">{signupError}</p>}
                <Button type="submit" className="w-full">
                  <span>Sign Up</span>
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
