"use client"

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = "Processing..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
      <p className="text-white text-lg">{message}</p>
    </div>
  )
}
