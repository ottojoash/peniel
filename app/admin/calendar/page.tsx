"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

// Setup the localizer
const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState("month")
  const supabase = createClientComponentClient()

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase.from("bookings").select("*")

      if (bookingsError) throw bookingsError

      // Try to fetch events, but don't fail if the table doesn't exist
      const { data: eventsData, error: eventsError } = await supabase.from("events").select("*")

      // Transform bookings into calendar events
      const bookingEvents =
        bookingsData?.map((booking) => ({
          id: `booking-${booking.id}`,
          title: `Booking: ${booking.guest_name}`,
          start: new Date(booking.check_in_date),
          end: new Date(booking.check_out_date),
          allDay: true,
          resource: { type: "booking", data: booking },
        })) || []

      // Transform events into calendar events
      const calendarEvents =
        eventsData?.map((event) => ({
          id: `event-${event.id}`,
          title: event.title,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: false,
          resource: { type: "event", data: event },
        })) || []

      setBookings(bookingsData || [])
      setEvents([...bookingEvents, ...calendarEvents])
    } catch (err) {
      console.error("Error fetching calendar data:", err)
      setError("Failed to load calendar data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEventSelect = (event) => {
    const { type, data } = event.resource

    if (type === "booking") {
      window.location.href = `/admin/bookings/${data.id}`
    } else if (type === "event") {
      // You can implement event details view here
      alert(
        `Event: ${data.title}\nDescription: ${data.description || "No description"}\nLocation: ${data.location || "No location"}`,
      )
    }
  }

  const eventStyleGetter = (event) => {
    const { type } = event.resource

    if (type === "booking") {
      return {
        style: {
          backgroundColor: "#3498db",
          borderRadius: "4px",
          color: "white",
          border: "none",
        },
      }
    } else {
      return {
        style: {
          backgroundColor: "#2ecc71",
          borderRadius: "4px",
          color: "white",
          border: "none",
        },
      }
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/bookings/add">New Booking</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/events/add">Add Event</Link>
          </Button>
          {!isLoading && (
            <Button onClick={fetchData} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="events">Events ({events.length - bookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <div className="flex gap-2">
                  <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")} size="sm">
                    Month
                  </Button>
                  <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")} size="sm">
                    Week
                  </Button>
                  <Button variant={view === "day" ? "default" : "outline"} onClick={() => setView("day")} size="sm">
                    Day
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-[600px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[600px]">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    onSelectEvent={handleEventSelect}
                    eventPropGetter={eventStyleGetter}
                    view={view}
                    onView={setView}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{booking.guest_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                          {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/bookings/${booking.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No bookings found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : events.length > bookings.length ? (
                <div className="space-y-4">
                  {events
                    .filter((event) => event.resource.type === "event")
                    .map((event) => (
                      <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.start.toLocaleDateString()}{" "}
                            {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Button onClick={() => handleEventSelect(event)} variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No events found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

