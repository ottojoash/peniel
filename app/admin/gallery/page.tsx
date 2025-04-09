"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Upload, Trash2, Edit, Search, Filter, Video, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "@/app/actions/storage-actions"
import { useRouter } from "next/navigation"

// Define the GalleryImage type
interface GalleryImage {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  storage_path: string
  is_featured?: boolean
  created_at: string
  updated_at?: string
}

export default function GalleryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("photos")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "hotel",
    isFeatured: false,
  })

  // Fetch gallery images
  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setIsLoading(true)
        const images = await getGalleryImages()
        setGalleryImages(images)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        toast({
          title: "Error",
          description: "Failed to load gallery images. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  // Filter gallery items based on search term and category filter
  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const openEditDialog = (item: GalleryImage) => {
    setSelectedItem(item)
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      isFeatured: item.is_featured || false,
    })
    setUploadFile(null)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (item: GalleryImage) => {
    setSelectedItem(item)
    setDeleteDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isFeatured: checked }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "hotel",
      isFeatured: false,
    })
    setUploadFile(null)
    setUploadProgress(0)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      setUploadProgress(10)

      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("is_featured", formData.isFeatured.toString())
      formDataToSend.append("file", uploadFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const result = await uploadGalleryImage(formDataToSend)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })

        // Refresh the gallery images
        const images = await getGalleryImages()
        setGalleryImages(images)

        resetForm()
        setTimeout(() => {
          setUploadDialogOpen(false)
        }, 500)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem) return

    try {
      setIsSubmitting(true)

      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("is_featured", formData.isFeatured.toString())

      if (uploadFile) {
        formDataToSend.append("file", uploadFile)
      }

      const result = await updateGalleryImage(selectedItem.id, formDataToSend)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image updated successfully",
        })

        // Refresh the gallery images
        const images = await getGalleryImages()
        setGalleryImages(images)

        setEditDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return

    try {
      setIsSubmitting(true)

      const result = await deleteGalleryImage(selectedItem.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Image deleted successfully",
        })

        // Refresh the gallery images
        const images = await getGalleryImages()
        setGalleryImages(images)

        setDeleteDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return

    try {
      setIsSubmitting(true)

      let successCount = 0
      let errorCount = 0

      for (const id of selectedItems) {
        const result = await deleteGalleryImage(id)
        if (result.success) {
          successCount++
        } else {
          errorCount++
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} image(s) deleted successfully${
            errorCount > 0 ? `. ${errorCount} failed.` : ""
          }`,
        })

        // Refresh the gallery images
        const images = await getGalleryImages()
        setGalleryImages(images)

        setSelectedItems([])
      } else {
        toast({
          title: "Error",
          description: "Failed to delete selected images",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting selected images:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage photos and videos for your website</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={selectedItems.length === 0 || isSubmitting}
            onClick={handleDeleteSelected}
          >
            {isSubmitting && selectedItems.length > 0 ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Selected
          </Button>
          <Button
            onClick={() => {
              resetForm()
              setUploadDialogOpen(true)
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>Manage all photos and videos used on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="photos" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Photos
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2" disabled>
                  <Video className="h-4 w-4" />
                  Videos
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search media..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="rooms">Rooms</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="amenities">Amenities</SelectItem>
                      <SelectItem value="kids-park">Kids Park</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value="photos" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/20">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No photos found</h3>
                  <p className="text-muted-foreground mb-4">No photos match your search criteria</p>
                  <Button
                    onClick={() => {
                      resetForm()
                      setUploadDialogOpen(true)
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="group relative border rounded-md overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedItems.includes(image.id)}
                          onCheckedChange={() => toggleItemSelection(image.id)}
                          className="h-5 w-5 border-2 border-white bg-black/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        />
                      </div>

                      {image.is_featured && <Badge className="absolute top-2 right-2 z-10 bg-primary">Featured</Badge>}

                      <div className="relative aspect-square">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                            onClick={() => openEditDialog(image)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                            onClick={() => window.open(image.image_url, "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                            onClick={() => openDeleteDialog(image)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-2 bg-white">
                        <h3 className="font-medium text-sm truncate">{image.title}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{image.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="text-center py-12 border rounded-md bg-muted/20">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Video support coming soon</h3>
                <p className="text-muted-foreground mb-4">
                  Video gallery functionality will be available in a future update
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setUploadDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>Upload photos to your gallery. Supported formats: JPG, PNG, GIF.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
                uploadFile ? "border-primary" : ""
              }`}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {uploadFile ? (
                <div className="space-y-2">
                  <div className="relative w-40 h-40 mx-auto">
                    <Image
                      src={URL.createObjectURL(uploadFile) || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium">{uploadFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-1">Drag and drop files here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                </>
              )}
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for this media"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description for this media"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="rooms">Rooms</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="amenities">Amenities</SelectItem>
                    <SelectItem value="kids-park">Kids Park</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isFeatured" checked={formData.isFeatured} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="isFeatured">Mark as featured</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !uploadFile}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setEditDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update information for this media item.</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
              <div className="relative aspect-video rounded-md overflow-hidden">
                <Image
                  src={uploadFile ? URL.createObjectURL(uploadFile) : selectedItem.image_url}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select name="category" value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="rooms">Rooms</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="amenities">Amenities</SelectItem>
                      <SelectItem value="kids-park">Kids Park</SelectItem>
                      <SelectItem value="beach">Beach</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-isFeatured" checked={formData.isFeatured} onCheckedChange={handleCheckboxChange} />
                  <Label htmlFor="edit-isFeatured">Mark as featured</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-file">Replace Image</Label>
                  <Input id="edit-file" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setDeleteDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                <Image
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-medium">{selectedItem.title}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
