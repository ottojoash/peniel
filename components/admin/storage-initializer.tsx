"use client"

import { useEffect, useState } from "react"
import { initializeStorage } from "@/app/actions/init-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StorageInitializer() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      try {
        const result = await initializeStorage()
        if (!result.success) {
          setError(result.error || "Failed to initialize storage")
        }
      } catch (err) {
        console.error("Error initializing storage:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      }
    }

    initialize()
  }, [])

  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Storage Error</AlertTitle>
      <AlertDescription>{error}. Some features like image uploads may not work correctly.</AlertDescription>
    </Alert>
  )
}
