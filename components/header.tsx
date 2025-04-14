"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import type { User } from "@/lib/auth"
import { Code, Copy, Download, Upload, Save, FolderOpen, Sun, Moon, UserIcon, FileText } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  currentUser: User
  currentFileName?: string
  onLogout: () => void
  onCopy: () => void
  onSave: () => void
  onLoad: () => void
  onDownloadHtml: () => void
  onDownloadTxt: () => void
  onDownloadDocx: () => void
  onUploadHtml: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadTxt: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadDocx: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleTheme: () => void
  onShowUserModal: () => void
  theme: string
}

export default function Header({
  currentUser,
  currentFileName = "Untitled",
  onLogout,
  onCopy,
  onSave,
  onLoad,
  onDownloadHtml,
  onDownloadTxt,
  onDownloadDocx,
  onUploadHtml,
  onUploadTxt,
  onUploadDocx,
  onToggleTheme,
  onShowUserModal,
  theme,
}: HeaderProps) {
  const fileInputHtmlRef = useRef<HTMLInputElement>(null)
  const fileInputTxtRef = useRef<HTMLInputElement>(null)
  const fileInputDocRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()

  const handleUploadHtmlClick = () => {
    fileInputHtmlRef.current?.click()
  }

  const handleUploadTxtClick = () => {
    fileInputTxtRef.current?.click()
  }

  const handleUploadDocxClick = () => {
    fileInputDocRef.current?.click()
  }

  return (
    <header className="flex justify-between items-center p-4 bg-background border-b">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">HTML Document Editor</h1>
        </Link>

        {!isMobile && (
          <div className="ml-4 flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-1" />
            <span className="max-w-[200px] truncate">{currentFileName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCopy} title="Copy HTML">
          <Copy className="h-4 w-4 mr-2" />
          {!isMobile && <span>Copy</span>}
        </Button>

        <Button variant="outline" size="sm" onClick={onSave} title="Save to Browser">
          <Save className="h-4 w-4 mr-2" />
          {!isMobile && <span>Save</span>}
        </Button>

        <Button variant="outline" size="sm" onClick={onLoad} title="Load from Browser">
          <FolderOpen className="h-4 w-4 mr-2" />
          {!isMobile && <span>Load</span>}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" title="Download">
              <Download className="h-4 w-4 mr-2" />
              {!isMobile && <span>Download</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onDownloadHtml}>HTML (.html)</DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadTxt}>Text (.txt)</DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadDocx}>Word (.docx)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" title="Upload">
              <Upload className="h-4 w-4 mr-2" />
              {!isMobile && <span>Upload</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleUploadHtmlClick}>HTML (.html)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleUploadTxtClick}>Text (.txt)</DropdownMenuItem>
            <DropdownMenuItem onClick={handleUploadDocxClick}>Word (.docx)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={onToggleTheme} title="Toggle Theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" title="User Profile">
              <UserIcon className="h-4 w-4 mr-2" />
              {!isMobile && <span>{currentUser.name.split(" ")[0]}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onShowUserModal}>View Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">User Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/feedback">Send Feedback</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden file inputs */}
        <input
          type="file"
          id="file-input-html"
          ref={fileInputHtmlRef}
          accept=".html,.htm"
          style={{ display: "none" }}
          onChange={onUploadHtml}
        />
        <input
          type="file"
          id="file-input-txt"
          ref={fileInputTxtRef}
          accept=".txt"
          style={{ display: "none" }}
          onChange={onUploadTxt}
        />
        <input
          type="file"
          id="file-input-doc"
          ref={fileInputDocRef}
          accept=".doc,.docx"
          style={{ display: "none" }}
          onChange={onUploadDocx}
        />
      </div>
    </header>
  )
}
