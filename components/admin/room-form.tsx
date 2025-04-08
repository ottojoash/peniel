"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, ImageIcon } from "lucide-react"
import { createRoom, updateRoom, getRoomById } from "@/app/actions/room-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RoomForm({ room, roomTypes, roomFeatures, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [roomData, setRoomData] = useState({
    id: null,
    name: "",
    roomTypeId: "",
    description: "",
    longDescription: "",
    size: "",
    maxOccupancy: "2",
    bedType: "",
    isFeatured: false,
    isPublished: false,
    price: "",
    currency: "USD",
    featureIds: [],
    policies: [""],
    imageUrls: [""],
  })

  // Load room data if editing
  useEffect(() => {
    let isMounted = true

    async function loadRoomData() {
      if (room) {
        try {
          setIsLoading(true)
          setError("")
          const fullRoomData = await getRoomById(room.id)

          if (isMounted) {
            setRoomData({
              id: fullRoomData.id,
              name: fullRoomData.name || "",
              roomTypeId: fullRoomData.room_type_id?.toString() || "",
              description: fullRoomData.description || "",
              longDescription: fullRoomData.long_description || "",
              size: fullRoomData.size || "",
              maxOccupancy: fullRoomData.max_occupancy?.toString() || "2",
              bedType: fullRoomData.bed_type || "",
              isFeatured: fullRoomData.is_featured || false,
              isPublished: fullRoomData.is_published || false,
              price: fullRoomData.rates?.[0]?.price_per_night?.toString() || "",
              currency: fullRoomData.rates?.[0]?.currency || "USD",
              featureIds: fullRoomData.feature_ids || [],
              policies: fullRoomData.policies?.map((p) => p.policy_text) || [""],
              imageUrls: fullRoomData.images?.map((img) => img.image_url) || [""],
            })
            setIsLoading(false)
          }
        } catch (error) {
          console.error("Error loading room data:", error)
          if (isMounted) {
            setError("Failed to load room data. Please try again.")
            setIsLoading(false)
          }
        }
      }
    }

    loadRoomData()

    return () => {
      isMounted = false
    }
  }, [room])

  const handleChange = (field, value) => {
    setRoomData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (featureId) => {
    setRoomData((prev) => {
      const featureIds = [...prev.featureIds]

      if (featureIds.includes(featureId)) {
        return { ...prev, featureIds: featureIds.filter((id) => id !== featureId) }
      } else {
        return { ...prev, featureIds: [...featureIds, featureId] }
      }
    })
  }

  const addPolicy = () => {
    setRoomData((prev) => ({
      ...prev,
      policies: [...prev.policies, ""],
    }))
  }

  const updatePolicy = (index, value) => {
    setRoomData((prev) => {
      const policies = [...prev.policies]
      policies[index] = value
      return { ...prev, policies }
    })
  }

  const removePolicy = (index) => {
    setRoomData((prev) => {
      const policies = [...prev.policies]
      policies.splice(index, 1)
      return { ...prev, policies }
    })
  }

  const addImageUrl = () => {
    setRoomData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }))
  }

  const updateImageUrl = (index, value) => {
    setRoomData((prev) => {
      const imageUrls = [...prev.imageUrls]
      imageUrls[index] = value
      return { ...prev, imageUrls }
    })
  }

  const removeImageUrl = (index) => {
    setRoomData((prev) => {
      const imageUrls = [...prev.imageUrls]
      imageUrls.splice(index, 1)
      return { ...prev, imageUrls }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    try {
      setIsLoading(true)

      const formData = new FormData(event.target)

      // Add feature IDs to form data
      roomData.featureIds.forEach((id) => {
        formData.append("features[]", id.toString())
      })

      // Add policies to form data
      roomData.policies.filter(Boolean).forEach((policy) => {
        formData.append("policies[]", policy)
      })

      // Add image URLs to form data
      roomData.imageUrls.filter(Boolean).forEach((url) => {
        formData.append("imageUrls[]", url)
      })

      if (roomData.id) {
        await updateRoom(roomData.id, formData)
      } else {
        await createRoom(formData)
      }

      onClose(true) // Pass true to indicate data should be refreshed
    } catch (error) {
      console.error("Error saving room:", error)
      setError("Failed to save room. Please try again.")
      setIsLoading(false)
    }
  }

  if (isLoading && room) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name</Label>
          <Input
            id="name"
            name="name"
            value={roomData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomTypeId">Room Type</Label>
          <Select
            name="roomTypeId"
            value={roomData.roomTypeId}
            onValueChange={(value) => handleChange("roomTypeId", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Room Size</Label>
          <Input
            id="size"
            name="size"
            placeholder="e.g., 30m²"
            value={roomData.size}
            onChange={(e) => handleChange("size", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxOccupancy">Max Occupancy</Label>
          <Input
            id="maxOccupancy"
            name="maxOccupancy"
            type="number"
            min="1"
            value={roomData.maxOccupancy}
            onChange={(e) => handleChange("maxOccupancy", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedType">Bed Type</Label>
          <Input
            id="bedType"
            name="bedType"
            placeholder="e.g., King Bed, Twin Beds"
            value={roomData.bedType}
            onChange={(e) => handleChange("bedType", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price Per Night</Label>
          <div className="flex gap-2">
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={roomData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              className="flex-1"
            />
            <Select
              name="currency"
              value={roomData.currency}
              onValueChange={(value) => handleChange("currency", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="UGX">UGX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          value={roomData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          name="longDescription"
          value={roomData.longDescription}
          onChange={(e) => handleChange("longDescription", e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            name="isFeatured"
            checked={roomData.isFeatured}
            onCheckedChange={(checked) => handleChange("isFeatured", checked)}
          />
          <Label htmlFor="isFeatured">Featured Room</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublished"
            name="isPublished"
            checked={roomData.isPublished}
            onCheckedChange={(checked) => handleChange("isPublished", checked)}
          />
          <Label htmlFor="isPublished">Publish Room</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Room Features & Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {roomFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={`feature-${feature.id}`}
                checked={roomData.featureIds.includes(feature.id)}
                onCheckedChange={() => handleFeatureToggle(feature.id)}
              />
              <Label htmlFor={`feature-${feature.id}`}>{feature.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Room Policies</Label>
          <Button type="button" variant="outline" size="sm" onClick={addPolicy}>
            <Plus className="h-4 w-4 mr-1" /> Add Policy
          </Button>
        </div>

        {roomData.policies.map((policy, index) => (
          <div key={`policy-${index}`} className="flex gap-2">
            <Input
              value={policy}
              onChange={(e) => updatePolicy(index, e.target.value)}
              placeholder="e.g., Check-in: 2:00 PM"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removePolicy(index)}
              disabled={roomData.policies.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Room Images</Label>
          <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
            <Plus className="h-4 w-4 mr-1" /> Add Image
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          Enter image URLs for the room. In a production environment, you would upload images directly.
        </div>

        {roomData.imageUrls.map((url, index) => (
          <div key={`image-${index}`} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={url}
                onChange={(e) => updateImageUrl(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {url && (
                <div className="absolute right-2 top-2 bg-background rounded-full p-1">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeImageUrl(index)}
              disabled={roomData.imageUrls.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <div className="animate-spin mr-2 h-4 w-4 border-2 border-background rounded-full" />}
          {roomData.isPublished ? "Publish" : "Save as Draft"}
        </Button>
      </DialogFooter>
    </form>
  )
}

