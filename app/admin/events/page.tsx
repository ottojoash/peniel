"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Edit, MapPin, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EventsPage() {
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true)

      try {
        const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

        if (error) throw error

        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          title: "Error",
          description: "Failed to load events. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [supabase, toast])

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = eventTypeFilter === "all" || event.event_type === eventTypeFilter

    return matchesSearch && matchesType
  })

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const { error } = await supabase.from("events").delete().eq("id", selectedEvent.id)

      if (error) throw error

      setEvents(events.filter((event) => event.id !== selectedEvent.id))

      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully",
      })

      setShowDeleteDialog(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage hotel events and activities</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-1" />
            New Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>View and manage all events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery || eventTypeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first event to get started"}
              </p>
              {!searchQuery && eventTypeFilter === "all" && (
                <Button className="mt-4" asChild>
                  <Link href="/admin/events/new">
                    <Plus className="h-4 w-4 mr-1" />
                    New Event
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="font-medium">{event.title}</div>
                        {event.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {event.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            event.event_type === "EVENT"
                              ? "bg-green-500"
                              : event.event_type === "MAINTENANCE"
                                ? "bg-red-500"
                                : event.event_type === "STAFF"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                          }
                        >
                          {event.event_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">{format(new Date(event.start_date), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(event.start_date), "h:mm a")} -
                              {format(new Date(event.end_date), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.location ? (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedEvent(event)
                                setShowDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="py-4">
              <h3 className="font-medium">{selectedEvent.title}</h3>
              <div className="flex items-center mt-2">
                <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{format(new Date(selectedEvent.start_date), "MMM d, yyyy")}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

