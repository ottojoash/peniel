"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { format, addDays } from "date-fns"
import { Loader2 } from "lucide-react"
import { updateRoomAvailability, bulkUpdateRoomAvailability } from "@/app/actions/room-actions"

export default function AvailabilityPage() {
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState("")
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [availabilityData, setAvailabilityData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAvailable, setIsAvailable] = useState(true)
  const [priceOverride, setPriceOverride] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const [rangeStartDate, setRangeStartDate] = useState(new Date())
  const [rangeEndDate, setRangeEndDate] = useState(addDays(new Date(), 7))
  const [bulkIsAvailable, setBulkIsAvailable] = useState(true)
  const [bulkPriceOverride, setBulkPriceOverride] = useState("")
  const [bulkNotes, setBulkNotes] = useState("")

  // Fetch rooms
  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select(`
            id, 
            name,
            room_rates(price_per_night, is_default)
          `)
          .eq("is_published", true)
          .order("name")

        if (error) throw error

        setRooms(data || [])

        if (data && data.length > 0) {
          setSelectedRoomId(data[0].id.toString())
          setSelectedRoom(data[0])
        }
      } catch (error) {
        console.error("Error fetching rooms:", error)
        toast({
          title: "Error",
          description: "Failed to load rooms. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [supabase, toast])

  // Update selected room when roomId changes
  useEffect(() => {
    if (selectedRoomId) {
      const room = rooms.find((r) => r.id.toString() === selectedRoomId)
      setSelectedRoom(room)

      // Reset form
      setIsAvailable(true)
      setPriceOverride("")
      setNotes("")

      // Fetch availability data
      fetchAvailabilityData(Number.parseInt(selectedRoomId, 10))
    }
  }, [selectedRoomId, rooms])

  // Fetch availability data for selected room
  const fetchAvailabilityData = async (roomId) => {
    setIsLoading(true)

    try {
      // Get dates for current month and next month
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)

      const { data, error } = await supabase
        .from("room_availability")
        .select("*")
        .eq("room_id", roomId)
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0])

      if (error) throw error

      setAvailabilityData(data || [])
    } catch (error) {
      console.error(`Error fetching availability for room ${roomId}:`, error)
      toast({
        title: "Error",
        description: "Failed to load availability data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date)

    // Check if we have availability data for this date
    const dateStr = format(date, "yyyy-MM-dd")
    const availabilityEntry = availabilityData.find((entry) => entry.date === dateStr)

    if (availabilityEntry) {
      setIsAvailable(availabilityEntry.is_available)
      setPriceOverride(availabilityEntry.price_override ? availabilityEntry.price_override.toString() : "")
      setNotes(availabilityEntry.notes || "")
    } else {
      setIsAvailable(true)
      setPriceOverride("")
      setNotes("")
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!selectedRoomId) return

    setIsSaving(true)

    try {
      const result = await updateRoomAvailability(
        Number.parseInt(selectedRoomId, 10),
        format(selectedDate, "yyyy-MM-dd"),
        isAvailable,
        priceOverride ? Number.parseFloat(priceOverride) : undefined,
        notes || undefined,
      )

      if (!result.success) throw new Error(result.error)

      toast({
        title: "Success",
        description: "Availability updated successfully",
      })

      // Refresh data
      fetchAvailabilityData(Number.parseInt(selectedRoomId, 10))
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle bulk save
  const handleBulkSave = async () => {
    if (!selectedRoomId) return

    setIsSaving(true)

    try {
      const result = await bulkUpdateRoomAvailability(
        Number.parseInt(selectedRoomId, 10),
        format(rangeStartDate, "yyyy-MM-dd"),
        format(rangeEndDate, "yyyy-MM-dd"),
        bulkIsAvailable,
        bulkPriceOverride ? Number.parseFloat(bulkPriceOverride) : undefined,
        bulkNotes || undefined,
      )

      if (!result.success) throw new Error(result.error)

      toast({
        title: "Success",
        description: "Availability updated successfully",
      })

      // Refresh data
      fetchAvailabilityData(Number.parseInt(selectedRoomId, 10))
    } catch (error) {
      console.error("Error updating availability:", error)
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Custom day renderer for calendar
  const renderDay = (day) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const availabilityEntry = availabilityData.find((entry) => entry.date === dateStr)

    let className = ""

    if (availabilityEntry) {
      className = availabilityEntry.is_available ? "bg-green-100" : "bg-red-100"

      if (availabilityEntry.price_override) {
        className += " border-b-2 border-blue-500"
      }
    }

    return <div className={`w-full h-full flex items-center justify-center ${className}`}>{day.getDate()}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Room Availability</h1>
        <p className="text-muted-foreground">Manage room availability and pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Selection</CardTitle>
              <CardDescription>Select a room to manage availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRoom && (
                <div className="mt-4 p-4 border rounded-md bg-muted/50">
                  <h3 className="font-medium">{selectedRoom.name}</h3>
                  <p className="text-sm mt-1">
                    Standard Rate: $
                    {selectedRoom.room_rates?.find((r) => r.is_default)?.price_per_night.toFixed(2) || "0.00"}/night
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
              <CardDescription>Calendar color codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 mr-2"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-sm">Custom Price</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Click on a date to manage availability</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  components={{
                    Day: ({ day, ...props }) => <button {...props}>{renderDay(day)}</button>,
                  }}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Update availability settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Date</TabsTrigger>
                  <TabsTrigger value="range">Date Range</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</h3>
                      <p className="text-sm text-muted-foreground">{format(selectedDate, "EEEE")}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="is-available">Available</Label>
                      <Switch id="is-available" checked={isAvailable} onCheckedChange={setIsAvailable} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-override">Price Override (Optional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="price-override"
                        type="number"
                        placeholder="Leave empty for standard rate"
                        className="pl-7"
                        value={priceOverride}
                        onChange={(e) => setPriceOverride(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Standard rate: $
                      {selectedRoom?.room_rates?.find((r) => r.is_default)?.price_per_night.toFixed(2) || "0.00"}/night
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this date"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={handleSave} disabled={isSaving || !selectedRoomId}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="range" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Calendar
                        mode="single"
                        selected={rangeStartDate}
                        onSelect={(date) => date && setRangeStartDate(date)}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Calendar
                        mode="single"
                        selected={rangeEndDate}
                        onSelect={(date) => date && setRangeEndDate(date)}
                        disabled={(date) => date < rangeStartDate}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="bulk-is-available">Available</Label>
                    <Switch id="bulk-is-available" checked={bulkIsAvailable} onCheckedChange={setBulkIsAvailable} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-price-override">Price Override (Optional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="bulk-price-override"
                        type="number"
                        placeholder="Leave empty for standard rate"
                        className="pl-7"
                        value={bulkPriceOverride}
                        onChange={(e) => setBulkPriceOverride(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bulk-notes">Notes (Optional)</Label>
                    <Textarea
                      id="bulk-notes"
                      placeholder="Add any notes about this date range"
                      value={bulkNotes}
                      onChange={(e) => setBulkNotes(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={handleBulkSave} disabled={isSaving || !selectedRoomId}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Update Date Range"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

