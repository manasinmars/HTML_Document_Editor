"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Send, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [feedbackType, setFeedbackType] = useState("general")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this data to your backend
      console.log({
        name,
        email,
        feedbackType,
        message,
        timestamp: new Date().toISOString(),
      })

      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
              <ThumbsUp className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Feedback</h1>

          <Card>
            <CardHeader>
              <CardTitle>Share Your Thoughts</CardTitle>
              <CardDescription>
                We value your feedback to improve our HTML Document Editor. Please let us know your thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general">General Feedback</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bug" id="bug" />
                      <Label htmlFor="bug">Bug Report</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feature" id="feature" />
                      <Label htmlFor="feature">Feature Request</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your feedback in detail..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
