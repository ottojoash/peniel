"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function NewEventPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [eventType, setEventType] = useState("EVENT")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !startDate || !endDate) {
      return toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }

    if (endDate < startDate) {
      return toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive",
      })
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("events").insert({
        title,
        description,
        location,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        event_type: eventType,
      })

      if (error) throw error

      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      })

      router.push("/admin/bookings/calendar")
      router.refresh()
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create New Event</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Create a new event for the hotel calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Staff Meeting"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Conference Room A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about the event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP HH:mm") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setHours(new Date().getHours())
                          newDate.setMinutes(new Date().getMinutes())
                          setStartDate(newDate)
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        value={startDate ? format(startDate, "HH:mm") : ""}
                        onChange={(e) => {
                          if (startDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(startDate)
                            newDate.setHours(Number.parseInt(hours, 10))
                            newDate.setMinutes(Number.parseInt(minutes, 10))
                            setStartDate(newDate)
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date & Time *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP HH:mm") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setHours(new Date().getHours() + 1)
                          newDate.setMinutes(new Date().getMinutes())
                          setEndDate(newDate)
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        value={endDate ? format(endDate, "HH:mm") : ""}
                        onChange={(e) => {
                          if (endDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(endDate)
                            newDate.setHours(Number.parseInt(hours, 10))
                            newDate.setMinutes(Number.parseInt(minutes, 10))
                            setEndDate(newDate)
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/bookings/calendar")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

