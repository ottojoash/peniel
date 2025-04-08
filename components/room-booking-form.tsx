"use client"

import type React from "react"

import { createBooking } from "@/app/actions/booking-actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { format, isBefore, isToday } from "date-fns"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface RoomBookingFormProps {
  roomId: number
  roomName: string
  basePrice: number
  maxGuests: number
}

export default function RoomBookingForm({ roomId, roomName, basePrice, maxGuests }: RoomBookingFormProps) {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined)
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Generate guest options based on maxGuests
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1)

  // Calculate total price when dates or guests change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      if (nights > 0) {
        setTotalPrice(basePrice * nights)
      }
    } else {
      setTotalPrice(0)
    }
  }, [checkInDate, checkOutDate, basePrice])

  // Disable past dates and dates before check-in for check-out calendar
  const disableDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // For check-in calendar, disable past dates
    if (!checkInDate) {
      return isBefore(date, today) && !isToday(date)
    }

    // For check-out calendar, disable dates before check-in
    return isBefore(date, checkInDate) || (isBefore(date, today) && !isToday(date))
  }

  // Handle check-in date change
  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date)
    // If check-out date is before new check-in date, reset it
    if (date && checkOutDate && isBefore(checkOutDate, date)) {
      setCheckOutDate(undefined)
    }
  }

  // Handle booking form submission
  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing dates",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      })
      return
    }

    setIsBookingDialogOpen(true)
  }

  // Handle guest information submission
  const handleSubmitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("roomId", roomId.toString())
      formData.append("checkInDate", checkInDate!.toISOString().split("T")[0])
      formData.append("checkOutDate", checkOutDate!.toISOString().split("T")[0])
      formData.append("numberOfGuests", numberOfGuests.toString())

      const result = await createBooking(formData)

      if (result.success) {
        setBookingReference(result.booking.booking_reference)
        setIsBookingDialogOpen(false)
        setIsConfirmationDialogOpen(true)
      } else {
        toast({
          title: "Booking failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Book Your Stay</CardTitle>
          <CardDescription>Select your dates and number of guests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check-in">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground",
                    )}
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
                    disabled={disableDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground",
                    )}
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
                    disabled={disableDates}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Select
              value={numberOfGuests.toString()}
              onValueChange={(value) => setNumberOfGuests(Number.parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {guestOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {totalPrice > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {checkInDate && checkOutDate
                    ? `${Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights`
                    : "0 nights"}
                </span>
                <span className="font-medium">${basePrice}/night</span>
              </div>
              <div className="flex justify-between items-center mt-2 font-bold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleBookNow} disabled={!checkInDate || !checkOutDate}>
            Book Now
          </Button>
        </CardFooter>
      </Card>

      {/* Guest Information Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please provide your information to complete the booking for {roomName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitBooking}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="guestName">Full Name</Label>
                <Input id="guestName" name="guestName" placeholder="John Doe" required />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="guestEmail">Email</Label>
                <Input id="guestEmail" name="guestEmail" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input id="guestPhone" name="guestPhone" placeholder="+256 772 123 456" required />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder="Any special requests or requirements..."
                  rows={3}
                />
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Booking Summary</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Room:</div>
                  <div className="font-medium">{roomName}</div>
                  <div>Check-in:</div>
                  <div className="font-medium">{checkInDate ? format(checkInDate, "PPP") : "-"}</div>
                  <div>Check-out:</div>
                  <div className="font-medium">{checkOutDate ? format(checkOutDate, "PPP") : "-"}</div>
                  <div>Guests:</div>
                  <div className="font-medium">{numberOfGuests}</div>
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
                  "Complete Booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              Booking Confirmed!
            </DialogTitle>
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
    </>
  )
}

