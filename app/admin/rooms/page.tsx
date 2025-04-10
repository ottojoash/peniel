"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  BedDouble,
  Users,
  Bath,
  SquareIcon as SquareFootIcon,
} from "lucide-react"
import { getRooms, deleteRoom, toggleRoomPublishStatus } from "@/app/actions/room-actions"
import RoomForm from "@/components/admin/room-form"

// Define the Room type
interface Room {
  id: number
  name: string
  slug: string
  short_description: string
  description: string
  base_price: number
  discounted_price: number | null
  capacity: number
  beds: number
  bathrooms: number
  size: number
  features: Array<{ id: string; name: string; value: string }>
  images: Array<{ id: string; url: string; path: string; alt: string }>
  is_published: boolean
  created_at: string
  updated_at: string | null
}

export default function RoomManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<Room[]>([])
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  // Check if we're in edit mode
  const editMode = searchParams?.get("mode") === "edit"
  const roomId = searchParams?.get("id") ? Number.parseInt(searchParams.get("id") as string) : undefined

  // Fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoading(true)
        const data = await getRooms()
        setRooms(data)
        setFilteredRooms(data)
      } catch (error) {
        console.error("Error fetching rooms:", error)
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Filter rooms based on search term and active tab
  useEffect(() => {
    let filtered = rooms

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.short_description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab === "published") {
      filtered = filtered.filter((room) => room.is_published)
    } else if (activeTab === "drafts") {
      filtered = filtered.filter((room) => !room.is_published)
    }

    setFilteredRooms(filtered)
  }, [rooms, searchTerm, activeTab])

  // Handle room deletion
  const handleDeleteRoom = async () => {
    if (!roomToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteRoom(roomToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Room deleted successfully",
        })
        // Remove the deleted room from the state
        setRooms(rooms.filter((room) => room.id !== roomToDelete.id))
      } else {
        throw new Error(result.error || "Failed to delete room")
      }
    } catch (error) {
      console.error("Error deleting room:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete room",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
    }
  }

  // Handle toggling publish status
  const handleTogglePublish = async (room: Room) => {
    try {
      setIsTogglingPublish(true)
      const result = await toggleRoomPublishStatus(room.id, !room.is_published)

      if (result.success) {
        toast({
          title: "Success",
          description: `Room ${!room.is_published ? "published" : "unpublished"} successfully`,
        })
        // Update the room in the state
        setRooms(rooms.map((r) => (r.id === room.id ? { ...r, is_published: !room.is_published } : r)))
      } else {
        throw new Error(result.error || "Failed to update publish status")
      }
    } catch (error) {
      console.error("Error toggling publish status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update publish status",
        variant: "destructive",
      })
    } finally {
      setIsTogglingPublish(false)
    }
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  // If in edit mode, show the room form
  if (editMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{roomId ? "Edit Room" : "Add Room"}</h1>
            <p className="text-muted-foreground">
              {roomId ? "Update the details of an existing room" : "Add a new room to your hotel"}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/rooms")}>
            Back to Rooms
          </Button>
        </div>

        <RoomForm roomId={roomId} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">Manage your hotel rooms and suites</p>
        </div>
        <Button onClick={() => router.push("/admin/rooms?mode=edit")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
          <CardDescription>View, edit, and manage all your hotel rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Rooms</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rooms..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <h3 className="text-lg font-medium">No rooms found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm
                    ? "No rooms match your search criteria"
                    : activeTab === "published"
                      ? "No published rooms found"
                      : activeTab === "drafts"
                        ? "No draft rooms found"
                        : "No rooms have been created yet"}
                </p>
                <Button className="mt-4" onClick={() => router.push("/admin/rooms?mode=edit")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/4 h-48 md:h-auto">
                        <Image
                          src={
                            room.images && room.images.length > 0
                              ? room.images[0].url
                              : "/placeholder.svg?height=400&width=300"
                          }
                          alt={room.name}
                          fill
                          className="object-cover"
                        />
                        {!room.is_published && (
                          <Badge variant="secondary" className="absolute top-2 left-2 bg-yellow-500/90 text-white">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold">{room.name}</h3>
                            <p className="text-muted-foreground mt-1 line-clamp-2">{room.short_description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {formatPrice(room.discounted_price || room.base_price)}
                              </div>
                              {room.discounted_price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  {formatPrice(room.base_price)}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">per night</div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/admin/rooms?mode=edit&id=${room.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/rooms/${room.slug}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleTogglePublish(room)}
                                  disabled={isTogglingPublish}
                                >
                                  {room.is_published ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Publish
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    setRoomToDelete(room)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BedDouble className="mr-1 h-4 w-4" />
                            {room.beds} {room.beds === 1 ? "Bed" : "Beds"}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Bath className="mr-1 h-4 w-4" />
                            {room.bathrooms} {room.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <SquareFootIcon className="mr-1 h-4 w-4" />
                            {room.size} sq ft
                          </div>
                        </div>

                        {room.features && room.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {room.features.slice(0, 4).map((feature) => (
                              <Badge key={feature.id} variant="outline">
                                {feature.name}
                              </Badge>
                            ))}
                            {room.features.length > 4 && (
                              <Badge variant="outline">+{room.features.length - 4} more</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {roomToDelete && (
            <div className="py-4">
              <h3 className="font-medium">{roomToDelete.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{roomToDelete.short_description}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
