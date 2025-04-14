"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Calendar } from "lucide-react"

interface UserModalProps {
  user: any
  onClose: () => void
}

export default function UserModal({ user, onClose }: UserModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            User Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Name</div>
              <div className="text-sm text-muted-foreground">{user.name}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Account Created</div>
              <div className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
