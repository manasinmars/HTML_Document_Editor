"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: string
}

export default function MonacoEditor({ value, onChange, language = "html", theme = "vs" }: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      // Create editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: "on",
        lineNumbers: "on",
        tabSize: 2,
      })

      // Set up change event
      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (monacoEditorRef.current) {
          const newValue = monacoEditorRef.current.getValue()
          onChange(newValue)
        }
      })
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose()
      }
    }
  }, [])

  // Update editor value if it changes externally
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue()
      if (value !== currentValue) {
        monacoEditorRef.current.setValue(value)
      }
    }
  }, [value])

  // Update editor theme if it changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      monaco.editor.setTheme(theme)
    }
  }, [theme])

  return <div ref={editorRef} className="h-full w-full" />
}
