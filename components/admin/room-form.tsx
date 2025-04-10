"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { createRoom, updateRoom, getRoomById } from "@/app/actions/room-actions"
import { uploadRoomImage, deleteRoomImage } from "@/app/actions/storage-actions"

// Define the form schema
const roomFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  basePrice: z.coerce.number().positive({ message: "Base price must be a positive number" }),
  discountedPrice: z.coerce
    .number()
    .positive({ message: "Discounted price must be a positive number" })
    .optional()
    .nullable(),
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive integer" }),
  beds: z.coerce.number().int().positive({ message: "Beds must be a positive integer" }),
  bathrooms: z.coerce.number().int().positive({ message: "Bathrooms must be a positive integer" }),
  size: z.coerce.number().int().positive({ message: "Size must be a positive integer" }),
  isPublished: z.boolean().default(false),
})

// Define the feature type
interface Feature {
  id: string
  name: string
  value: string
}

// Define the image type
interface RoomImage {
  id: string
  url: string
  path: string
  alt: string
}

// Define the room form props
interface RoomFormProps {
  roomId?: number
}

export default function RoomForm({ roomId }: RoomFormProps) {
  const router = useRouter()
  const [features, setFeatures] = useState<Feature[]>([])
  const [images, setImages] = useState<RoomImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      basePrice: 0,
      discountedPrice: null,
      capacity: 1,
      beds: 1,
      bathrooms: 1,
      size: 0,
      isPublished: false,
    },
  })

  // Load room data if editing
  useEffect(() => {
    async function loadRoomData() {
      if (roomId) {
        setIsLoading(true)
        try {
          const roomData = await getRoomById(roomId)

          if (roomData) {
            // Set form values
            form.reset({
              name: roomData.name || "",
              shortDescription: roomData.short_description || "",
              description: roomData.description || "",
              basePrice: roomData.base_price || 0,
              discountedPrice: roomData.discounted_price || null,
              capacity: roomData.capacity || 1,
              beds: roomData.beds || 1,
              bathrooms: roomData.bathrooms || 1,
              size: roomData.size || 0,
              isPublished: roomData.is_published || false,
            })

            // Set features and images
            if (roomData.features && Array.isArray(roomData.features)) {
              setFeatures(roomData.features)
            }

            if (roomData.images && Array.isArray(roomData.images)) {
              setImages(roomData.images)
            }
          }
        } catch (error) {
          console.error("Error loading room data:", error)
          toast({
            title: "Error",
            description: "Failed to load room data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadRoomData()
  }, [roomId, form])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof roomFormSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("shortDescription", values.shortDescription)
      formData.append("description", values.description)
      formData.append("basePrice", values.basePrice.toString())
      if (values.discountedPrice !== null && values.discountedPrice !== undefined) {
        formData.append("discountedPrice", values.discountedPrice.toString())
      }
      formData.append("capacity", values.capacity.toString())
      formData.append("beds", values.beds.toString())
      formData.append("bathrooms", values.bathrooms.toString())
      formData.append("size", values.size.toString())
      formData.append("features", JSON.stringify(features))
      formData.append("images", JSON.stringify(images))
      formData.append("isPublished", values.isPublished.toString())

      const result = roomId ? await updateRoom(roomId, formData) : await createRoom(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: roomId ? "Room updated successfully" : "Room created successfully",
        })
        router.push("/admin/rooms")
      } else {
        throw new Error(result.error || "Failed to save room")
      }
    } catch (error) {
      console.error("Error saving room:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save room",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a new feature
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        id: crypto.randomUUID(),
        name: "",
        value: "",
      },
    ])
  }

  // Update a feature
  const updateFeature = (id: string, field: "name" | "value", value: string) => {
    setFeatures(features.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)))
  }

  // Remove a feature
  const removeFeature = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id))
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploadingImage(true)

    try {
      const result = await uploadRoomImage(file)

      if (result.success && result.url) {
        setImages([
          ...images,
          {
            id: crypto.randomUUID(),
            url: result.url,
            path: result.path || "",
            alt: file.name.split(".")[0] || "Room image",
          },
        ])
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error(result.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      // Reset the input
      e.target.value = ""
    }
  }

  // Update image alt text
  const updateImageAlt = (id: string, alt: string) => {
    setImages(images.map((image) => (image.id === id ? { ...image, alt } : image)))
  }

  // Remove an image
  const removeImage = async (id: string) => {
    const imageToRemove = images.find((image) => image.id === id)
    if (!imageToRemove) return

    try {
      // If the image has a storage path, delete it from storage
      if (imageToRemove.path) {
        await deleteRoomImage(imageToRemove.path)
      }

      // Remove from state
      setImages(images.filter((image) => image.id !== id))

      toast({
        title: "Success",
        description: "Image removed successfully",
      })
    } catch (error) {
      console.error("Error removing image:", error)
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Deluxe Ocean View Room" {...field} />
                  </FormControl>
                  <FormDescription>The name of the room as it will appear to guests.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the room that will appear in listings."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>Keep it concise and highlight key features.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the room, amenities, and views."
                      {...field}
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>Provide a comprehensive description of the room.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>Standard nightly rate.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value === null || field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Optional promotional rate.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of guests.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beds</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormDescription>Number of beds in the room.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormDescription>Number of bathrooms.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (sq ft)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormDescription>Room size in square feet.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      {field.value ? "Room is visible to guests" : "Room is hidden from guests"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Room Features</h3>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          {features.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No features added yet. Click "Add Feature" to add room features.
            </p>
          ) : (
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`feature-name-${feature.id}`}>Feature</Label>
                    <Input
                      id={`feature-name-${feature.id}`}
                      value={feature.name}
                      onChange={(e) => updateFeature(feature.id, "name", e.target.value)}
                      placeholder="e.g., Wi-Fi, Air Conditioning"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`feature-value-${feature.id}`}>Value</Label>
                    <Input
                      id={`feature-value-${feature.id}`}
                      value={feature.value}
                      onChange={(e) => updateFeature(feature.id, "value", e.target.value)}
                      placeholder="e.g., Free, Included"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6"
                    onClick={() => removeFeature(feature.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Room Images</h3>
            <div className="relative">
              <Input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No images added yet. Click "Upload Image" to add room images.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id}>
                  <div className="relative aspect-video">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <Label htmlFor={`image-alt-${image.id}`}>Alt Text</Label>
                      <Input
                        id={`image-alt-${image.id}`}
                        value={image.alt}
                        onChange={(e) => updateImageAlt(image.id, e.target.value)}
                        placeholder="Describe the image"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/rooms")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {roomId ? "Updating..." : "Creating..."}
              </>
            ) : roomId ? (
              "Update Room"
            ) : (
              "Create Room"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
