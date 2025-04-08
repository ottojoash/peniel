"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RoomFeatureForm({ feature = null, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: feature?.name || "",
    icon: feature?.icon || "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    try {
      setIsLoading(true)

      const url = feature ? `/api/room-features/${feature.id}` : "/api/room-features"

      const method = feature ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save room feature")
      }

      onClose(true) // Pass true to indicate data should be refreshed
    } catch (error) {
      console.error("Error saving room feature:", error)
      setError("Failed to save room feature. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Feature Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          placeholder="e.g., wifi, tv, parking"
        />
        <p className="text-sm text-muted-foreground">Enter an icon name from Lucide icons or leave blank</p>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-background rounded-full" />}
          {feature ? "Update" : "Create"} Feature
        </Button>
      </DialogFooter>
    </form>
  )
}

