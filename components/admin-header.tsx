"use client"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/auth"
import { Code, LogOut } from "lucide-react"

interface AdminHeaderProps {
  currentUser: User | null
  onLogout: () => void
}

export default function AdminHeader({ currentUser, onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">HTML Document Editor Admin</span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{currentUser.name}</span>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
