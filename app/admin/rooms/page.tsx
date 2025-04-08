"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Plus, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import RoomForm from "@/components/admin/room-form"
import RoomTypeForm from "@/components/admin/room-type-form"
import RoomFeatureForm from "@/components/admin/room-feature-form"

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([])
  const [roomTypes, setRoomTypes] = useState([])
  const [roomFeatures, setRoomFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [roomFormOpen, setRoomFormOpen] = useState(false)
  const [roomTypeFormOpen, setRoomTypeFormOpen] = useState(false)
  const [roomFeatureFormOpen, setRoomFeatureFormOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch rooms
      const roomsResponse = await fetch("/api/rooms")
      if (!roomsResponse.ok) throw new Error("Failed to fetch rooms")
      const roomsData = await roomsResponse.json()

      // Fetch room types
      const typesResponse = await fetch("/api/room-types")
      if (!typesResponse.ok) throw new Error("Failed to fetch room types")
      const typesData = await typesResponse.json()

      // Fetch room features
      const featuresResponse = await fetch("/api/room-features")
      if (!featuresResponse.ok) throw new Error("Failed to fetch room features")
      const featuresData = await featuresResponse.json()

      setRooms(roomsData || [])
      setRoomTypes(typesData || [])
      setRoomFeatures(featuresData || [])
      setLoading(false)
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load room data. Please try again.")
      setLoading(false)
    }
  }

  const openRoomForm = (room = null) => {
    setSelectedRoom(room)
    setRoomFormOpen(true)
  }

  const confirmDeleteRoom = (room) => {
    setRoomToDelete(room)
    setDeleteDialogOpen(true)
  }

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return

    try {
      const response = await fetch(`/api/rooms/${roomToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete room")

      setRooms(rooms.filter((r) => r.id !== roomToDelete.id))
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
    } catch (error) {
      console.error("Error deleting room:", error)
      setError("Failed to delete room. Please try again.")
    }
  }

  const handlePublishRoom = async (room) => {
    try {
      const response = await fetch(`/api/rooms/${room.id}/publish`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to publish room")

      // Update the local state
      setRooms(rooms.map((r) => (r.id === room.id ? { ...r, is_published: true } : r)))
    } catch (error) {
      console.error("Error publishing room:", error)
      setError("Failed to publish room. Please try again.")
    }
  }

  const handleUnpublishRoom = async (room) => {
    try {
      const response = await fetch(`/api/rooms/${room.id}/unpublish`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to unpublish room")

      // Update the local state
      setRooms(rooms.map((r) => (r.id === room.id ? { ...r, is_published: false } : r)))
    } catch (error) {
      console.error("Error unpublishing room:", error)
      setError("Failed to unpublish room. Please try again.")
    }
  }

  const handleRoomFormClose = (refreshData = false) => {
    setRoomFormOpen(false)
    setSelectedRoom(null)

    if (refreshData) {
      loadData()
    }
  }

  const handleRoomTypeFormClose = (refreshData = false) => {
    setRoomTypeFormOpen(false)

    if (refreshData) {
      loadData()
    }
  }

  const handleRoomFeatureFormClose = (refreshData = false) => {
    setRoomFeatureFormOpen(false)

    if (refreshData) {
      loadData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
          <p className="text-muted-foreground">Manage rooms, types, and features</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setRoomTypeFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room Type
          </Button>
          <Button variant="outline" onClick={() => setRoomFeatureFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
          <Button onClick={() => openRoomForm()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Room
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" onClick={loadData} className="p-0 h-auto font-normal ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rooms & Suites</CardTitle>
          <CardDescription>Manage room information, prices, and availability</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rooms found. Add your first room to get started.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Max Occupancy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id} className={!room.is_published ? "bg-muted/20" : ""}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.room_type?.name || "Unknown"}</TableCell>
                      <TableCell>{room.price_per_night ? `$${room.price_per_night}` : "N/A"}</TableCell>
                      <TableCell>{room.max_occupancy}</TableCell>
                      <TableCell>
                        {room.is_published ? (
                          <Badge className="bg-green-500">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-500 border-amber-500">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openRoomForm(room)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>

                            {room.is_published ? (
                              <DropdownMenuItem onClick={() => handleUnpublishRoom(room)}>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Save as Draft
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handlePublishRoom(room)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteRoom(room)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Room
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Form Dialog */}
      <Dialog open={roomFormOpen} onOpenChange={setRoomFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>
              {selectedRoom ? "Update the details for this room" : "Add a new room to your hotel inventory"}
            </DialogDescription>
          </DialogHeader>
          <RoomForm
            room={selectedRoom}
            roomTypes={roomTypes}
            roomFeatures={roomFeatures}
            onClose={handleRoomFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* Room Type Form Dialog */}
      <Dialog open={roomTypeFormOpen} onOpenChange={setRoomTypeFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Room Type</DialogTitle>
            <DialogDescription>Create a new room type category</DialogDescription>
          </DialogHeader>
          <RoomTypeForm onClose={handleRoomTypeFormClose} />
        </DialogContent>
      </Dialog>

      {/* Room Feature Form Dialog */}
      <Dialog open={roomFeatureFormOpen} onOpenChange={setRoomFeatureFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Room Feature</DialogTitle>
            <DialogDescription>Create a new room feature or amenity</DialogDescription>
          </DialogHeader>
          <RoomFeatureForm onClose={handleRoomFeatureFormClose} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the room "{roomToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

