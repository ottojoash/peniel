"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default function SimpleNewBookingPage() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserSupabaseClient())

  // Form state
  const [roomId, setRoomId] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numberOfGuests, setNumberOfGuests] = useState("1")
  const [specialRequests, setSpecialRequests] = useState("")
  const [status, setStatus] = useState("confirmed")
  const [paymentStatus, setPaymentStatus] = useState("paid")

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [rooms, setRooms] = useState<any[]>([])

  // Load rooms on component mount
  useEffect(() => {
    async function loadRooms() {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("id, name, max_occupancy")
          .eq("is_published", true)
          .eq("is_active", true)
          .order("name")

        if (error) throw error
        setRooms(data || [])
      } catch (error) {
        console.error("Error loading rooms:", error)
        setErrorMessage("Failed to load rooms. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    loadRooms()
  }, [supabase])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // Validate form
    if (!roomId || !guestName || !guestEmail || !checkInDate || !checkOutDate) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Generate a booking reference
      const bookingReference = generateBookingReference()

      // Calculate total amount (simplified)
      const room = rooms.find((r) => r.id.toString() === roomId)
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

      // Get room rate (simplified)
      const { data: roomRate } = await supabase
        .from("room_rates")
        .select("price_per_night")
        .eq("room_id", roomId)
        .eq("is_default", true)
        .single()

      const pricePerNight = roomRate?.price_per_night || 100 // Default if not found
      const totalAmount = pricePerNight * nights

      // Create booking
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          booking_reference: bookingReference,
          room_id: Number.parseInt(roomId),
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          number_of_guests: Number.parseInt(numberOfGuests),
          special_requests: specialRequests,
          total_amount: totalAmount,
          status: status,
          payment_status: paymentStatus,
        })
        .select()

      if (error) throw error

      setSuccessMessage(`Booking created successfully! Reference: ${bookingReference}`)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/bookings")
      }, 2000)
    } catch (error) {
      console.error("Error creating booking:", error)
      setErrorMessage("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate a booking reference
  const generateBookingReference = () => {
    const prefix = "PBH"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `${prefix}-${timestamp}-${random}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">New Booking</h1>
          <p className="text-muted-foreground">Create a new booking for a guest</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/bookings")}>
          Cancel
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{errorMessage}</div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Room Selection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Room Type *</Label>
                <Select value={roomId} onValueChange={setRoomId} disabled={isSubmitting}>
                  <SelectTrigger id="roomId">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.name} (Max: {room.max_occupancy} guests)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                <Select value={numberOfGuests} onValueChange={setNumberOfGuests} disabled={isSubmitting}>
                  <SelectTrigger id="numberOfGuests">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Dates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Check-in Date *</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Check-out Date *</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Guest Information</h2>

            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name *</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email Address *</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input
                  id="guestPhone"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Booking Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Booking Status</Label>
                <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus} disabled={isSubmitting}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

