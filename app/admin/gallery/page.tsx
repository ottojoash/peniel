"use client"

import { useState } from "react"
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

// Mock data for gallery images
const galleryImages = [
  {
    id: 1,
    title: "Hotel Exterior",
    src: "/placeholder.svg?height=600&width=800&text=Hotel+Exterior",
    category: "hotel",
    tags: ["exterior", "building", "architecture"],
    featured: true,
    uploadedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Deluxe Room",
    src: "/placeholder.svg?height=600&width=800&text=Deluxe+Room",
    category: "rooms",
    tags: ["room", "interior", "accommodation"],
    featured: true,
    uploadedAt: "2025-01-16T11:20:00Z",
  },
  {
    id: 3,
    title: "Restaurant Dining Area",
    src: "/placeholder.svg?height=600&width=800&text=Restaurant",
    category: "restaurant",
    tags: ["dining", "food", "interior"],
    featured: false,
    uploadedAt: "2025-01-17T09:45:00Z",
  },
  {
    id: 4,
    title: "Swimming Pool",
    src: "/placeholder.svg?height=600&width=800&text=Swimming+Pool",
    category: "amenities",
    tags: ["pool", "outdoor", "leisure"],
    featured: true,
    uploadedAt: "2025-01-18T14:10:00Z",
  },
  {
    id: 5,
    title: "Kids Park",
    src: "/placeholder.svg?height=600&width=800&text=Kids+Park",
    category: "kids-park",
    tags: ["children", "play", "outdoor"],
    featured: false,
    uploadedAt: "2025-01-19T13:25:00Z",
  },
  {
    id: 6,
    title: "Beach View",
    src: "/placeholder.svg?height=600&width=800&text=Beach+View",
    category: "beach",
    tags: ["beach", "outdoor", "nature"],
    featured: true,
    uploadedAt: "2025-01-20T15:50:00Z",
  },
  {
    id: 7,
    title: "Wedding Setup",
    src: "/placeholder.svg?height=600&width=800&text=Wedding+Setup",
    category: "events",
    tags: ["wedding", "event", "decoration"],
    featured: false,
    uploadedAt: "2025-01-21T12:15:00Z",
  },
  {
    id: 8,
    title: "Conference Room",
    src: "/placeholder.svg?height=600&width=800&text=Conference+Room",
    category: "amenities",
    tags: ["business", "meeting", "interior"],
    featured: false,
    uploadedAt: "2025-01-22T10:40:00Z",
  },
  {
    id: 9,
    title: "Aerial View",
    src: "/placeholder.svg?height=600&width=800&text=Aerial+View",
    category: "hotel",
    tags: ["aerial", "overview", "property"],
    featured: true,
    uploadedAt: "2025-01-23T16:30:00Z",
  },
]

// Mock data for gallery videos
const galleryVideos = [
  {
    id: 1,
    title: "Hotel Tour",
    src: "/placeholder.svg?height=600&width=800&text=Hotel+Tour+Video",
    thumbnail: "/placeholder.svg?height=600&width=800&text=Hotel+Tour+Thumbnail",
    category: "hotel",
    duration: "3:45",
    featured: true,
    uploadedAt: "2025-01-24T11:20:00Z",
  },
  {
    id: 2,
    title: "Wedding Event",
    src: "/placeholder.svg?height=600&width=800&text=Wedding+Video",
    thumbnail: "/placeholder.svg?height=600&width=800&text=Wedding+Thumbnail",
    category: "events",
    duration: "5:20",
    featured: true,
    uploadedAt: "2025-01-25T14:30:00Z",
  },
  {
    id: 3,
    title: "Kids Park Activities",
    src: "/placeholder.svg?height=600&width=800&text=Kids+Park+Video",
    thumbnail: "/placeholder.svg?height=600&width=800&text=Kids+Park+Thumbnail",
    category: "kids-park",
    duration: "2:15",
    featured: false,
    uploadedAt: "2025-01-26T09:45:00Z",
  },
  {
    id: 4,
    title: "Restaurant Showcase",
    src: "/placeholder.svg?height=600&width=800&text=Restaurant+Video",
    thumbnail: "/placeholder.svg?height=600&width=800&text=Restaurant+Thumbnail",
    category: "restaurant",
    duration: "4:10",
    featured: false,
    uploadedAt: "2025-01-27T13:15:00Z",
  },
]

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("photos")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Filter gallery items based on search term and category filter
  const filteredImages = galleryImages.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || image.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const filteredVideos = galleryVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const openEditDialog = (item: any) => {
    setSelectedItem(item)
    setTimeout(() => {
      setEditDialogOpen(true)
    }, 0)
  }

  // Simulate file upload progress
  const simulateUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploadDialogOpen(false)
            setUploadProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage photos and videos for your website</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={selectedItems.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)}>
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
                <TabsTrigger value="videos" className="flex items-center gap-2">
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
              {filteredImages.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/20">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No photos found</h3>
                  <p className="text-muted-foreground mb-4">No photos match your search criteria</p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
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

                      {image.featured && <Badge className="absolute top-2 right-2 z-10 bg-primary">Featured</Badge>}

                      <div className="relative aspect-square">
                        <Image src={image.src || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
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
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
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
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12 border rounded-md bg-muted/20">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No videos found</h3>
                  <p className="text-muted-foreground mb-4">No videos match your search criteria</p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Videos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="group relative border rounded-md overflow-hidden">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedItems.includes(video.id)}
                          onCheckedChange={() => toggleItemSelection(video.id)}
                          className="h-5 w-5 border-2 border-white bg-black/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        />
                      </div>

                      {video.featured && <Badge className="absolute top-2 right-2 z-10 bg-primary">Featured</Badge>}

                      <div className="relative aspect-video">
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                            {video.duration}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                            onClick={() => openEditDialog(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-white border-white/30 bg-black/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-3 bg-white">
                        <h3 className="font-medium truncate">{video.title}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{video.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload photos or videos to your gallery. Supported formats: JPG, PNG, GIF, MP4, WebM.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-1">Drag and drop files here</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <Button variant="outline">Browse Files</Button>
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
                <Input id="title" placeholder="Enter a title for this media" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
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

              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="e.g., beach, sunset, exterior" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Mark as featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={simulateUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update information for this media item.</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="relative aspect-video rounded-md overflow-hidden">
                <Image
                  src={selectedItem.src || selectedItem.thumbnail}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" defaultValue={selectedItem.title} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={selectedItem.category}>
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

                <div className="grid gap-2">
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input id="edit-tags" defaultValue={selectedItem.tags?.join(", ")} />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-featured" defaultChecked={selectedItem.featured} />
                  <Label htmlFor="edit-featured">Mark as featured</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

