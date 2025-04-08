"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RoomTypeForm({ roomType = null, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: roomType?.name || "",
    description: roomType?.description || "",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    try {
      setIsLoading(true)

      const url = roomType ? `/api/room-types/${roomType.id}` : "/api/room-types"

      const method = roomType ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save room type")
      }

      onClose(true) // Pass true to indicate data should be refreshed
    } catch (error) {
      console.error("Error saving room type:", error)
      setError("Failed to save room type. Please try again.")
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
        <Label htmlFor="name">Room Type Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-background rounded-full" />}
          {roomType ? "Update" : "Create"} Room Type
        </Button>
      </DialogFooter>
    </form>
  )
}

