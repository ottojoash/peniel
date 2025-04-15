"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBooking, checkRoomAvailability } from "@/app/actions/booking-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RoomBookingFormProps {
  roomId: number
  roomName: string
  basePrice: number
  maxGuests: number
}

export default function RoomBookingForm({ roomId, roomName, basePrice, maxGuests }: RoomBookingFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Calculate total nights and price
  const totalNights = checkInDate && checkOutDate ? Math.max(1, differenceInDays(checkOutDate, checkInDate)) : 0
  const totalPrice = totalNights * basePrice

  // Generate guest options based on max guests
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1)

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (checkInDate >= checkOutDate) {
      setError("Check-out date must be after check-in date")
      return
    }

    setError("")
    setIsBookingDialogOpen(true)
  }

  const handleSubmitBooking = async () => {
    if (!formRef.current) {
      console.error("Form reference is null")
      setError("An error occurred. Please try again.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Format dates for API
      const formattedCheckIn = format(checkInDate!, "yyyy-MM-dd")
      const formattedCheckOut = format(checkOutDate!, "yyyy-MM-dd")

      // Check room availability
      const availabilityResult = await checkRoomAvailability(roomId, formattedCheckIn, formattedCheckOut)

      if (!availabilityResult.available) {
        setError("This room is not available for the selected dates")
        setIsSubmitting(false)
        setIsBookingDialogOpen(false)
        return
      }

      // Create FormData from form
      const formData = new FormData(formRef.current)

      // Add additional data
      formData.set("roomId", roomId.toString())
      formData.set("checkInDate", formattedCheckIn)
      formData.set("checkOutDate", formattedCheckOut)
      formData.set("numberOfGuests", numberOfGuests.toString())
      formData.set("totalAmount", totalPrice.toString())

      console.log("Submitting booking with form data:", {
        roomId,
        checkInDate: formattedCheckIn,
        checkOutDate: formattedCheckOut,
        numberOfGuests,
        totalAmount: totalPrice,
      })

      // Submit booking
      const result = await createBooking(formData)

      if (result.success) {
        setBookingReference(result.bookingReference)
        setIsBookingDialogOpen(false)
        setIsConfirmationDialogOpen(true)
        // Reset form
        formRef.current.reset()
        // Refresh the page data
        router.refresh()
      } else {
        setError(result.error || "Failed to create booking")
      }
    } catch (err) {
      console.error("Error submitting booking:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div>
        <h3 className="text-lg font-semibold mb-2">{roomName}</h3>
        <p className="text-gray-600 mb-4">${basePrice} per night</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="check-in">Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-in"
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-out">Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-out"
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfGuests">Number of Guests</Label>
          <select
            id="numberOfGuests"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(Number(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guestOptions.map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        {totalNights > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span>Price per night:</span>
              <span>${basePrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of nights:</span>
              <span>{totalNights}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <Button onClick={handleBookNow} className="w-full" disabled={isSubmitting || !checkInDate || !checkOutDate}>
          Book Now
        </Button>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>Please provide your details to complete the booking.</DialogDescription>
          </DialogHeader>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitBooking()
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Full Name</Label>
                  <Input id="guestName" name="guestName" placeholder="John Doe" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input id="guestEmail" name="guestEmail" type="email" placeholder="john@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPhone">Phone</Label>
                  <Input id="guestPhone" name="guestPhone" placeholder="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Any special requests or requirements..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Room:</div>
                  <div className="font-medium">{roomName}</div>
                  <div>Check-in:</div>
                  <div className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "-"}</div>
                  <div>Check-out:</div>
                  <div className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "-"}</div>
                  <div>Guests:</div>
                  <div className="font-medium">{numberOfGuests}</div>
                  <div>Nights:</div>
                  <div className="font-medium">{totalNights}</div>
                  <div>Total:</div>
                  <div className="font-medium">${totalPrice}</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>Your booking has been successfully confirmed.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 mb-4">
              <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">Booking Reference</div>
                <div className="text-xl font-bold">{bookingReference}</div>
              </div>
              <div className="text-sm text-center text-muted-foreground">
                Please save this reference number for your records.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Room:</div>
              <div className="font-medium">{roomName}</div>
              <div>Check-in:</div>
              <div className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "-"}</div>
              <div>Check-out:</div>
              <div className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "-"}</div>
              <div>Guests:</div>
              <div className="font-medium">{numberOfGuests}</div>
              <div>Nights:</div>
              <div className="font-medium">{totalNights}</div>
              <div>Total:</div>
              <div className="font-medium">${totalPrice}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                setIsConfirmationDialogOpen(false)
                router.push("/")
              }}
            >
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
