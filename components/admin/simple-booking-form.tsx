"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSimpleBooking } from "@/app/actions/simple-booking-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Room = {
  id: number
  name: string
  max_occupancy: number
}

interface SimpleBookingFormProps {
  rooms: Room[]
}

export default function SimpleBookingForm({ rooms }: SimpleBookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [roomId, setRoomId] = useState<string>("")
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)

  // Handle form submission
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await createSimpleBooking(formData)

      if (result.success) {
        setSuccess(`Booking created successfully! Reference: ${result.bookingReference}`)
        setTimeout(() => {
          router.push("/admin/bookings")
        }, 2000)
      } else {
        setError(result.error || "Failed to create booking")
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Selection */}
        <div className="space-y-2">
          <Label htmlFor="roomId">Room Type *</Label>
          <Select name="roomId" value={roomId} onValueChange={setRoomId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id.toString()}>
                    {room.name} (Max: {room.max_occupancy} guests)
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-rooms" disabled>
                  No rooms available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Guests */}
        <div className="space-y-2">
          <Label htmlFor="numberOfGuests">Number of Guests *</Label>
          <Input type="number" id="numberOfGuests" name="numberOfGuests" min="1" max="10" defaultValue="2" required />
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <Label htmlFor="checkInDate">Check-in Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !checkInDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          <input
            type="hidden"
            name="checkInDate"
            value={checkInDate ? format(checkInDate, "yyyy-MM-dd") : ""}
            required
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label htmlFor="checkOutDate">Check-out Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !checkOutDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                initialFocus
                disabled={(date) => date < new Date() || (checkInDate ? date <= checkInDate : false)}
              />
            </PopoverContent>
          </Popover>
          <input
            type="hidden"
            name="checkOutDate"
            value={checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : ""}
            required
          />
        </div>

        {/* Guest Name */}
        <div className="space-y-2">
          <Label htmlFor="guestName">Guest Name *</Label>
          <Input id="guestName" name="guestName" required />
        </div>

        {/* Guest Email */}
        <div className="space-y-2">
          <Label htmlFor="guestEmail">Guest Email *</Label>
          <Input type="email" id="guestEmail" name="guestEmail" required />
        </div>

        {/* Guest Phone */}
        <div className="space-y-2">
          <Label htmlFor="guestPhone">Guest Phone</Label>
          <Input id="guestPhone" name="guestPhone" />
        </div>

        {/* Booking Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Booking Status</Label>
          <Select name="status" defaultValue="confirmed">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select name="paymentStatus" defaultValue="paid">
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Special Requests */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea id="specialRequests" name="specialRequests" rows={3} />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/bookings")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Booking..." : "Create Booking"}
        </Button>
      </div>
    </form>
  )
}

