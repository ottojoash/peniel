"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Plus, Upload, Save, FileText, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getRooms,
  getRoomTypes,
  getRoomFeatures,
  deleteRoom,
  publishRoom,
  unpublishRoom,
} from "@/app/actions/room-actions"
import RoomForm from "@/components/admin/room-form"
import RoomTypeForm from "@/components/admin/room-type-form"
import RoomFeatureForm from "@/components/admin/room-feature-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ContentManagementPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState(tabParam || "rooms")
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
    let isMounted = true

    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [roomsData, typesData, featuresData] = await Promise.all([
          getRooms().catch((err) => {
            console.error("Error fetching rooms:", err)
            return []
          }),
          getRoomTypes().catch((err) => {
            console.error("Error fetching room types:", err)
            return []
          }),
          getRoomFeatures().catch((err) => {
            console.error("Error fetching room features:", err)
            return []
          }),
        ])

        if (isMounted) {
          setRooms(roomsData || [])
          setRoomTypes(typesData || [])
          setRoomFeatures(featuresData || [])
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        if (isMounted) {
          setError("Failed to load content. Please try again.")
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Handle tab change
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

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
      await deleteRoom(roomToDelete.id)
      setRooms(rooms.filter((r) => r.id !== roomToDelete.id))
      setDeleteDialogOpen(false)
      setRoomToDelete(null)
    } catch (error) {
      console.error("Error deleting room:", error)
    }
  }

  const handlePublishRoom = async (room) => {
    try {
      await publishRoom(room.id)
      // Update the local state
      setRooms(rooms.map((r) => (r.id === room.id ? { ...r, is_published: true } : r)))
    } catch (error) {
      console.error("Error publishing room:", error)
    }
  }

  const handleUnpublishRoom = async (room) => {
    try {
      await unpublishRoom(room.id)
      // Update the local state
      setRooms(rooms.map((r) => (r.id === room.id ? { ...r, is_published: false } : r)))
    } catch (error) {
      console.error("Error unpublishing room:", error)
    }
  }

  const handlePublishAll = async () => {
    try {
      // Get all unpublished rooms
      const unpublishedRooms = rooms.filter((room) => !room.is_published)

      // Publish each room
      await Promise.all(unpublishedRooms.map((room) => publishRoom(room.id)))

      // Update the local state
      setRooms(rooms.map((room) => ({ ...room, is_published: true })))
    } catch (error) {
      console.error("Error publishing all rooms:", error)
    }
  }

  const handleRoomFormClose = async (refreshData = false) => {
    setRoomFormOpen(false)
    setSelectedRoom(null)

    if (refreshData) {
      setLoading(true)
      try {
        const roomsData = await getRooms()
        setRooms(roomsData || [])
      } catch (error) {
        console.error("Error refreshing rooms data:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRoomTypeFormClose = async (refreshData = false) => {
    setRoomTypeFormOpen(false)

    if (refreshData) {
      try {
        const typesData = await getRoomTypes()
        setRoomTypes(typesData || [])
      } catch (error) {
        console.error("Error refreshing room types data:", error)
      }
    }
  }

  const handleRoomFeatureFormClose = async (refreshData = false) => {
    setRoomFeatureFormOpen(false)

    if (refreshData) {
      try {
        const featuresData = await getRoomFeatures()
        setRoomFeatures(featuresData || [])
      } catch (error) {
        console.error("Error refreshing room features data:", error)
      }
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)

    Promise.all([getRooms(), getRoomTypes(), getRoomFeatures()])
      .then(([roomsData, typesData, featuresData]) => {
        setRooms(roomsData || [])
        setRoomTypes(typesData || [])
        setRoomFeatures(featuresData || [])
      })
      .catch((error) => {
        console.error("Error retrying data load:", error)
        setError("Failed to load content. Please try again.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Update and manage your website content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Save className="mr-2 h-4 w-4" />
            Save All Drafts
          </Button>
          <Button onClick={handlePublishAll}>
            <Upload className="mr-2 h-4 w-4" />
            Publish All
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" onClick={handleRetry} className="p-0 h-auto font-normal ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="rooms">Rooms & Rates</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant Menu</TabsTrigger>
          <TabsTrigger value="kids-park">Kids Park</TabsTrigger>
          <TabsTrigger value="pages">Website Pages</TabsTrigger>
        </TabsList>

        {/* Rooms & Rates Tab */}
        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Rooms & Suites</CardTitle>
                <CardDescription>Manage room information, prices, and availability</CardDescription>
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
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        <TableHead>Featured</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No rooms found. Add your first room to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rooms.map((room) => (
                          <TableRow key={room.id} className={!room.is_published ? "bg-muted/20" : ""}>
                            <TableCell className="font-medium">{room.name}</TableCell>
                            <TableCell>{room.room_type?.name || "Unknown"}</TableCell>
                            <TableCell>
                              {room.default_rate
                                ? `${room.default_rate.currency} ${room.default_rate.price_per_night}`
                                : "N/A"}
                            </TableCell>
                            <TableCell>{room.max_occupancy}</TableCell>
                            <TableCell>
                              {room.is_featured ? (
                                <Badge className="bg-primary">Featured</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restaurant Menu Tab */}
        <TabsContent value="restaurant" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Restaurant Menu</CardTitle>
                <CardDescription>Manage menu items, prices, and categories</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Restaurant menu management will be implemented in the next phase.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kids Park Tab */}
        <TabsContent value="kids-park" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kids Park Activities</CardTitle>
                <CardDescription>Manage activities, prices, and age ranges</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Kids park activity management will be implemented in the next phase.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Website Pages</CardTitle>
                <CardDescription>Edit content on your website pages</CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Preview Site
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Website page management will be implemented in the next phase.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Room Form Dialog */}
      {roomFormOpen && (
        <Dialog open={roomFormOpen} onOpenChange={(open) => !open && handleRoomFormClose()}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                {selectedRoom ? "Update the details for this room." : "Fill in the details to create a new room."}
              </DialogDescription>
            </DialogHeader>
            <RoomForm
              room={selectedRoom}
              roomTypes={roomTypes}
              roomFeatures={roomFeatures}
              onClose={(refreshData) => handleRoomFormClose(refreshData)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Room Type Form Dialog */}
      {roomTypeFormOpen && (
        <Dialog open={roomTypeFormOpen} onOpenChange={(open) => !open && handleRoomTypeFormClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Room Type</DialogTitle>
              <DialogDescription>Create a new room type category.</DialogDescription>
            </DialogHeader>
            <RoomTypeForm onClose={(refreshData) => handleRoomTypeFormClose(refreshData)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Room Feature Form Dialog */}
      {roomFeatureFormOpen && (
        <Dialog open={roomFeatureFormOpen} onOpenChange={(open) => !open && handleRoomFeatureFormClose()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Room Feature</DialogTitle>
              <DialogDescription>Create a new room feature or amenity.</DialogDescription>
            </DialogHeader>
            <RoomFeatureForm onClose={(refreshData) => handleRoomFeatureFormClose(refreshData)} />
          </DialogContent>
        </Dialog>
      )}

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

