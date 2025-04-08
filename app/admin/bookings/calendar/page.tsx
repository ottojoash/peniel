"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  RefreshCcw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Setup the localizer
const localizer = momentLocalizer(moment)

// Event types and colors
const EVENT_TYPES = {
  BOOKING: {
    label: "Booking",
    color: "#3498db", // Blue
    textColor: "white",
  },
  EVENT: {
    label: "Event",
    color: "#2ecc71", // Green
    textColor: "white",
  },
  MAINTENANCE: {
    label: "Maintenance",
    color: "#e74c3c", // Red
    textColor: "white",
  },
  STAFF: {
    label: "Staff",
    color: "#f39c12", // Orange
    textColor: "white",
  },
}

export default function CalendarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [view, setView] = useState("month")
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [filters, setFilters] = useState(Object.keys(EVENT_TYPES))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDialog, setShowEventDialog] = useState(false)

  // Custom toolbar component
  const CustomToolbar = ({ date, onNavigate, onView, view }) => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => onNavigate("PREV")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="mx-2" onClick={() => onNavigate("TODAY")}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => onNavigate("NEXT")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold ml-4">
            {moment(date).format(view === "month" ? "MMMM YYYY" : "MMMM D, YYYY")}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={onView} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    )
  }

  // Fetch events
  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching bookings and events...")

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase.from("bookings").select(`
          id,
          booking_reference,
          guest_name,
          guest_email,
          guest_phone,
          check_in_date,
          check_out_date,
          number_of_guests,
          status,
          payment_status,
          room_id,
          rooms(id, name)
        `)

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
        throw new Error(`Failed to fetch bookings: ${bookingsError.message}`)
      }

      console.log(`Successfully fetched ${bookings?.length || 0} bookings`)

      // Check if events table exists
      const { error: tableCheckError } = await supabase.from("events").select("id").limit(1)

      let eventsList = []

      // If events table exists, fetch events
      if (!tableCheckError) {
        const { data: calendarEvents, error: eventsError } = await supabase.from("events").select("*")

        if (eventsError) {
          console.error("Error fetching events:", eventsError)
          // Don't throw here, just log the error and continue with empty events
        } else {
          eventsList = calendarEvents || []
          console.log(`Successfully fetched ${eventsList.length} events`)
        }
      } else {
        console.log("Events table doesn't exist yet. Skipping events fetch.")
      }

      // Transform bookings to calendar events
      const bookingEvents = (bookings || []).map((booking) => ({
        id: `booking-${booking.id}`,
        title: `${booking.guest_name} - ${booking.rooms?.name || "Unknown Room"}`,
        start: new Date(booking.check_in_date),
        end: new Date(booking.check_out_date),
        type: "BOOKING",
        resource: booking,
        allDay: true,
      }))

      // Transform events to calendar events
      const otherEvents = eventsList.map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        type: event.event_type || "EVENT",
        resource: event,
        allDay: false,
      }))

      // Combine all events
      const allEvents = [...bookingEvents, ...otherEvents]
      setEvents(allEvents)
    } catch (err) {
      console.error("Error in fetchEvents:", err)
      setError(err.message || "Failed to load calendar data")
      toast({
        title: "Error",
        description: "Failed to load calendar data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Apply filters
  useEffect(() => {
    const filtered = events.filter((event) => filters.includes(event.type))
    setFilteredEvents(filtered)
  }, [events, filters])

  // Toggle filter
  const toggleFilter = (type) => {
    if (filters.includes(type)) {
      setFilters(filters.filter((f) => f !== type))
    } else {
      setFilters([...filters, type])
    }
  }

  // Event styling
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: EVENT_TYPES[event.type]?.color || "#9b59b6",
      color: EVENT_TYPES[event.type]?.textColor || "white",
      borderRadius: "4px",
      opacity: 0.8,
      border: "0px",
      display: "block",
    }

    return { style }
  }

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }

  // Handle event dialog close
  const handleCloseEventDialog = () => {
    setShowEventDialog(false)
    setSelectedEvent(null)
  }

  // Handle event navigation
  const handleEventAction = () => {
    if (selectedEvent?.type === "BOOKING") {
      const bookingId = selectedEvent.id.replace("booking-", "")
      router.push(`/admin/bookings/${bookingId}`)
    } else if (selectedEvent?.type === "EVENT") {
      const eventId = selectedEvent.id.replace("event-", "")
      router.push(`/admin/events/${eventId}`)
    }
    setShowEventDialog(false)
  }

  // Handle retry
  const handleRetry = () => {
    fetchEvents()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage bookings and events</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/bookings/add">
              <Plus className="h-4 w-4 mr-1" />
              New Booking
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/events/new">
              <Plus className="h-4 w-4 mr-1" />
              New Event
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="w-fit mt-2" onClick={handleRetry}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Show/hide event types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(EVENT_TYPES).map(([type, { label, color }]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${type}`}
                      checked={filters.includes(type)}
                      onCheckedChange={() => toggleFilter(type)}
                    />
                    <Label htmlFor={`filter-${type}`} className="flex items-center cursor-pointer">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/bookings">View All Bookings</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/events">Manage Events</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/availability">Room Availability</Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={handleRetry} disabled={isLoading}>
                <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendar View
              </CardTitle>
              <CardDescription>View and manage bookings, events, and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[700px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading calendar data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-[700px]">
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    views={["month", "week", "day"]}
                    view={view}
                    date={date}
                    onView={(newView) => setView(newView)}
                    onNavigate={(newDate) => setDate(newDate)}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    components={{
                      toolbar: CustomToolbar,
                    }}
                    dayPropGetter={(date) => {
                      const today = new Date()
                      return {
                        className:
                          date.getDate() === today.getDate() &&
                          date.getMonth() === today.getMonth() &&
                          date.getFullYear() === today.getFullYear()
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : undefined,
                      }
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.type === "BOOKING" ? "Booking Details" : "Event Details"}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {selectedEvent.type === "BOOKING" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reference:</span>
                    <Badge variant="outline">{selectedEvent.resource.booking_reference}</Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.resource.guest_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.resource.number_of_guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.resource.rooms?.name || "Unknown Room"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(selectedEvent.resource.check_in_date), "MMM d, yyyy")} -
                        {format(new Date(selectedEvent.resource.check_out_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge
                      className={
                        selectedEvent.resource.status === "confirmed"
                          ? "bg-green-500"
                          : selectedEvent.resource.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {selectedEvent.resource.status.charAt(0).toUpperCase() + selectedEvent.resource.status.slice(1)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={
                        selectedEvent.resource.payment_status === "paid"
                          ? "text-green-500 border-green-500"
                          : selectedEvent.resource.payment_status === "pending"
                            ? "text-yellow-500 border-yellow-500"
                            : "text-red-500 border-red-500"
                      }
                    >
                      {selectedEvent.resource.payment_status.charAt(0).toUpperCase() +
                        selectedEvent.resource.payment_status.slice(1)}
                    </Badge>
                  </div>
                </>
              )}

              {selectedEvent.type !== "BOOKING" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge
                      style={{
                        backgroundColor: EVENT_TYPES[selectedEvent.type]?.color,
                        color: EVENT_TYPES[selectedEvent.type]?.textColor,
                      }}
                    >
                      {EVENT_TYPES[selectedEvent.type]?.label || selectedEvent.type}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {selectedEvent.resource.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEvent.resource.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(selectedEvent.start, "MMM d, yyyy")}
                        {!selectedEvent.allDay && ` ${format(selectedEvent.start, "h:mm a")}`}
                      </span>
                    </div>
                    {!selectedEvent.allDay && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(selectedEvent.start, "h:mm a")} - {format(selectedEvent.end, "h:mm a")}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedEvent.resource.description && (
                    <div className="pt-2">
                      <p className="text-sm">{selectedEvent.resource.description}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEventDialog}>
              Close
            </Button>
            <Button onClick={handleEventAction}>View Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

