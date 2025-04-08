"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, isBefore } from "date-fns"
import { createBooking } from "@/app/actions/booking-actions"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookingFormProps {
  roomId?: number
  roomName?: string
  defaultPrice?: number
}

export default function BookingForm({ roomId, roomName, defaultPrice }: BookingFormProps) {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Calculate total guests
  const totalGuests = Number.parseInt(adults) + Number.parseInt(children)

  // Calculate total nights and price
  const totalNights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const totalPrice = totalNights * (defaultPrice || 0)

  // Handle check-in date change
  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date)

    // If check-out date is before new check-in date, reset it
    if (date && checkOutDate && isBefore(checkOutDate, date)) {
      setCheckOutDate(undefined)
    }
  }

  // Handle form submission
  const handleCheckAvailability = () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    // If we have a room ID, open the booking dialog
    if (roomId) {
      setIsBookingDialogOpen(true)
    } else {
      // Otherwise, redirect to rooms page with dates as query params
      const params = new URLSearchParams({
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: totalGuests.toString(),
      })
      router.push(`/rooms?${params.toString()}`)
    }
  }

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add the hidden fields
      formData.append("roomId", roomId?.toString() || "")
      formData.append("checkInDate", checkInDate?.toISOString() || "")
      formData.append("checkOutDate", checkOutDate?.toISOString() || "")
      formData.append("numberOfGuests", totalGuests.toString())

      const result = await createBooking(formData)

      if (result.success) {
        setBookingReference(result.booking.booking_reference)
        toast({
          title: "Booking successful!",
          description: `Your booking reference is ${result.booking.booking_reference}`,
        })
      } else {
        toast({
          title: "Booking failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Check In</label>
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
                  onSelect={handleCheckInChange}
                  initialFocus
                  disabled={(date) => isBefore(date, new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Check Out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !checkOutDate && "text-muted-foreground")}
                  disabled={!checkInDate}
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
                  disabled={(date) => (checkInDate ? isBefore(date, checkInDate) : true)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Adults</label>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Adult</SelectItem>
                <SelectItem value="2">2 Adults</SelectItem>
                <SelectItem value="3">3 Adults</SelectItem>
                <SelectItem value="4">4 Adults</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Children</label>
            <Select value={children} onValueChange={setChildren}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Children</SelectItem>
                <SelectItem value="1">1 Child</SelectItem>
                <SelectItem value="2">2 Children</SelectItem>
                <SelectItem value="3">3 Children</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex items-end">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleCheckAvailability}
            disabled={!checkInDate || !checkOutDate}
          >
            {roomId ? "Book Now" : "Check Availability"}
          </Button>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              {roomName ? `Booking ${roomName}` : "Complete your reservation details below"}
            </DialogDescription>
          </DialogHeader>

          {bookingReference ? (
            <div className="space-y-4 py-4 text-center">
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                <h3 className="text-lg font-medium">Booking Confirmed!</h3>
                <p className="mt-2">Your booking reference is:</p>
                <p className="mt-1 text-xl font-bold">{bookingReference}</p>
              </div>
              <p>Thank you for choosing Peniel Beach Hotel. We look forward to welcoming you!</p>
              <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check In</Label>
                  <div className="p-2 border rounded-md bg-muted/50">
                    {checkInDate ? format(checkInDate, "PPP") : "Not selected"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check Out</Label>
                  <div className="p-2 border rounded-md bg-muted/50">
                    {checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestName">Full Name</Label>
                <Input id="guestName" name="guestName" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input id="guestEmail" name="guestEmail" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestPhone">Phone</Label>
                  <Input id="guestPhone" name="guestPhone" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea id="specialRequests" name="specialRequests" />
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span>Room:</span>
                  <span>{roomName}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Guests:</span>
                  <span>
                    {totalGuests} ({adults} adults, {children} children)
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Nights:</span>
                  <span>{totalNights}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

