"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import Header from "@/components/header"
import UserModal from "@/components/user-modal"
import LoadingOverlay from "@/components/loading-overlay"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/auth"
import dynamic from "next/dynamic"
import type React from "react"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@/components/monaco-editor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading editor...</div>,
})

interface EditorContainerProps {
  currentUser: User
  onLogout: () => void
  onFileChange?: (fileName: string) => void
}

export default function EditorContainer({ currentUser, onLogout, onFileChange }: EditorContainerProps) {
  const [editorContent, setEditorContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [showUserModal, setShowUserModal] = useState(false)
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor")
  const [currentFileName, setCurrentFileName] = useState<string>("Untitled")
  const previewRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()

  // Default HTML template
  const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>My HTML Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #4f46e5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to HTML Document Editor</h1>
    <p>This is a paragraph of text. You can edit this HTML code on the left side.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <button>Click Me</button>
  </div>
</body>
</html>`

  useEffect(() => {
    // Only load default HTML if there's no content yet
    if (!editorContent) {
      // Load user-specific saved HTML or default
      const userId = currentUser.id
      const savedHtml = localStorage.getItem(`savedHtml_${userId}`) || defaultHtml
      setEditorContent(savedHtml)
    }

    // Notify about file change
    if (onFileChange) {
      onFileChange(currentFileName)
    }
  }, [currentUser, onFileChange, currentFileName])

  // Update preview when editor content changes
  useEffect(() => {
    if (previewRef.current) {
      const iframe = previewRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(editorContent)
        iframeDoc.close()
      }
    }
  }, [editorContent])

  const handleEditorChange = (value: string) => {
    setEditorContent(value)
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editorContent)
      toast({
        title: "Success",
        description: "HTML copied to clipboard!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleSaveToLocalStorage = () => {
    try {
      const userId = currentUser.id
      localStorage.setItem(`savedHtml_${userId}`, editorContent)
      toast({
        title: "Success",
        description: "HTML saved to browser storage!",
      })

      // Update file name if needed
      if (currentFileName === "Untitled") {
        const newFileName = `Document_${new Date().toISOString().slice(0, 10)}`
        setCurrentFileName(newFileName)

        // Notify about file change
        if (onFileChange) {
          onFileChange(newFileName)
        }
      } else {
        // Notify about file change
        if (onFileChange) {
          onFileChange(currentFileName)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving to browser storage",
        variant: "destructive",
      })
    }
  }

  const handleLoadFromLocalStorage = () => {
    try {
      const userId = currentUser.id
      const savedHtml = localStorage.getItem(`savedHtml_${userId}`)

      if (savedHtml) {
        setEditorContent(savedHtml)
        toast({
          title: "Success",
          description: "HTML loaded from browser storage!",
        })
      } else {
        toast({
          title: "Info",
          description: "No saved HTML found in browser storage",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading from browser storage",
        variant: "destructive",
      })
    }
  }

  const handleDownloadHtml = () => {
    try {
      const blob = new Blob([editorContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentFileName}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "HTML file downloaded!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error downloading HTML file",
        variant: "destructive",
      })
    }
  }

  const handleDownloadTxt = () => {
    try {
      // Extract only visible content from the preview iframe
      let visibleContent = ""
      if (previewRef.current) {
        const iframe = previewRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc && iframeDoc.body) {
          // Get only the visible text content, but exclude the title/filename
          const bodyContent = iframeDoc.body.textContent || ""

          // Remove the filename if it appears at the beginning of the content
          const filenamePattern = new RegExp(`^\\s*${currentFileName}\\s*`, "i")
          visibleContent = bodyContent.replace(filenamePattern, "")
        }
      }

      // Create and download the text file
      const blob = new Blob([visibleContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentFileName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Text file downloaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error downloading text file",
        variant: "destructive",
      })
    }
  }

  const handleDownloadDocx = async () => {
    try {
      setIsLoading(true)
      setLoadingMessage("Generating DOCX...")

      // Import docx library dynamically
      const docx = await import("docx")
      const { Document, Paragraph, TextRun, Packer } = docx

      // Extract only visible content from the preview iframe
      let visibleContent = ""
      if (previewRef.current) {
        const iframe = previewRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc && iframeDoc.body) {
          // Get only the visible text content, but exclude the title/filename
          const bodyContent = iframeDoc.body.textContent || ""

          // Remove the filename if it appears at the beginning of the content
          const filenamePattern = new RegExp(`^\\s*${currentFileName}\\s*`, "i")
          visibleContent = bodyContent.replace(filenamePattern, "")
        }
      }

      // Split content into paragraphs
      const paragraphs = visibleContent
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line)],
            }),
        )

      // Create document without the filename at the top
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs, // No title paragraph
          },
        ],
      })

      // Generate and save document
      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentFileName}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsLoading(false)
      toast({
        title: "Success",
        description: "DOCX with visible content downloaded successfully!",
      })
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Error downloading DOCX file",
        variant: "destructive",
      })
    }
  }

  const handleUploadHtml = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (file) {
        setIsLoading(true)
        setLoadingMessage("Loading HTML file...")

        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string

            // Directly set the content from the file without any modification
            setEditorContent(content)

            // Update file name
            const fileName = file.name.replace(/\.html$/, "") || "Untitled"
            setCurrentFileName(fileName)

            // Notify about file change
            if (onFileChange) {
              onFileChange(fileName)
            }

            setIsLoading(false)

            toast({
              title: "Success",
              description: "HTML file loaded successfully!",
            })
          } catch (error) {
            setIsLoading(false)
            toast({
              title: "Error",
              description: "Error loading HTML file",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Error uploading HTML file",
        variant: "destructive",
      })
    }
  }

  const handleUploadTxt = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      setLoadingMessage("Loading text file...")

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string

          // Update file name
          const fileName = file.name.replace(/\.txt$/, "") || "Text_Document"
          setCurrentFileName(fileName)

          // Notify about file change
          if (onFileChange) {
            onFileChange(fileName)
          }

          // Create a clean HTML document with the text content
          const escapedContent = content
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")

          // Check if the content is already HTML
          if (
            content.trim().toLowerCase().startsWith("<!doctype html>") ||
            content.trim().toLowerCase().startsWith("<html")
          ) {
            // If it's HTML, use it directly
            setEditorContent(content)
          } else {
            // If it's plain text, wrap it in HTML
            const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${fileName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <div>${escapedContent
      .split("\n")
      .map((line) => `<p>${line || "&nbsp;"}</p>`)
      .join("")}</div>
  </div>
</body>
</html>`
            setEditorContent(htmlContent)
          }

          setIsLoading(false)

          toast({
            title: "Success",
            description: "Text file loaded successfully!",
          })
        } catch (error) {
          setIsLoading(false)
          toast({
            title: "Error",
            description: "Error loading text file",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Error uploading text file",
        variant: "destructive",
      })
    }
  }

  const handleUploadDocx = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      setIsLoading(true)
      setLoadingMessage("Extracting content from DOCX...")

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer

          // Import mammoth.js dynamically
          const mammoth = await import("mammoth")

          // Update file name
          const fileName = file.name.replace(/\.docx$/, "") || "Word_Document"
          setCurrentFileName(fileName)

          // Notify about file change
          if (onFileChange) {
            onFileChange(fileName)
          }

          // Use mammoth.js to convert DOCX to HTML
          const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer })

          // Create a clean HTML document with the extracted content (without filename in heading)
          const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${fileName}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <div>${result.value}</div>
  </div>
</body>
</html>`

          setEditorContent(htmlContent)
          setIsLoading(false)

          toast({
            title: "Success",
            description: "DOCX content extracted successfully!",
          })
        } catch (error) {
          setIsLoading(false)
          toast({
            title: "Error",
            description: "Error extracting content from DOCX",
            variant: "destructive",
          })
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Error uploading DOCX file",
        variant: "destructive",
      })
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        currentUser={currentUser}
        currentFileName={currentFileName}
        onLogout={onLogout}
        onCopy={handleCopyToClipboard}
        onSave={handleSaveToLocalStorage}
        onLoad={handleLoadFromLocalStorage}
        onDownloadHtml={handleDownloadHtml}
        onDownloadTxt={handleDownloadTxt}
        onDownloadDocx={handleDownloadDocx}
        onUploadHtml={handleUploadHtml}
        onUploadTxt={handleUploadTxt}
        onUploadDocx={handleUploadDocx}
        onToggleTheme={toggleTheme}
        onShowUserModal={() => setShowUserModal(true)}
        theme={theme || "light"}
      />

      {isMobile ? (
        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as "editor" | "preview")}
            className="h-full"
          >
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="h-[calc(100%-40px)]">
              <MonacoEditor
                value={editorContent}
                onChange={handleEditorChange}
                language="html"
                theme={theme === "dark" ? "vs-dark" : "vs"}
              />
            </TabsContent>
            <TabsContent value="preview" className="h-[calc(100%-40px)]">
              <iframe ref={previewRef} title="HTML Preview" className="w-full h-full border-none bg-white" />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r">
            <MonacoEditor
              value={editorContent}
              onChange={handleEditorChange}
              language="html"
              theme={theme === "dark" ? "vs-dark" : "vs"}
            />
          </div>
          <div className="flex-1">
            <iframe ref={previewRef} title="HTML Preview" className="w-full h-full border-none bg-white" />
          </div>
        </div>
      )}

      {showUserModal && <UserModal user={currentUser} onClose={() => setShowUserModal(false)} />}

      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  )
}
