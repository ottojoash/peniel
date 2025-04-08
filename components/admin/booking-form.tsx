"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, isBefore, isToday, differenceInDays } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createBooking } from "@/app/actions/booking-actions"
import { useToast } from "@/components/ui/use-toast"

type Room = {
  id: number
  name: string
  max_occupancy: number
  default_rate: number
}

interface BookingFormProps {
  rooms: Room[]
}

export default function BookingForm({ rooms }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [roomId, setRoomId] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState<Date>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 1))
  const [numberOfGuests, setNumberOfGuests] = useState("1")
  const [specialRequests, setSpecialRequests] = useState("")
  const [status, setStatus] = useState("confirmed")
  const [paymentStatus, setPaymentStatus] = useState("paid")

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get the selected room
  const selectedRoom = rooms.find((room) => room.id.toString() === roomId)

  // Calculate nights
  const nights = checkInDate && checkOutDate ? Math.max(1, differenceInDays(checkOutDate, checkInDate)) : 1

  // Calculate total amount
  const totalAmount = selectedRoom ? nights * selectedRoom.default_rate : 0

  // Generate guest options based on selected room's capacity
  const getGuestOptions = () => {
    const maxGuests = selectedRoom?.max_occupancy || 1
    return Array.from({ length: maxGuests }, (_, i) => i + 1)
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!roomId) newErrors.roomId = "Please select a room"
    if (!guestName) newErrors.guestName = "Guest name is required"
    if (!guestEmail) newErrors.guestEmail = "Guest email is required"

    if (!checkInDate) {
      newErrors.checkInDate = "Check-in date is required"
    } else if (isBefore(checkInDate, new Date()) && !isToday(checkInDate)) {
      newErrors.checkInDate = "Check-in date cannot be in the past"
    }

    if (!checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required"
    } else if (isBefore(checkOutDate, checkInDate)) {
      newErrors.checkOutDate = "Check-out date must be after check-in date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("roomId", roomId)
      formData.append("guestName", guestName)
      formData.append("guestEmail", guestEmail)
      formData.append("guestPhone", guestPhone)
      formData.append("checkInDate", checkInDate.toISOString().split("T")[0])
      formData.append("checkOutDate", checkOutDate.toISOString().split("T")[0])
      formData.append("numberOfGuests", numberOfGuests)
      formData.append("specialRequests", specialRequests)
      formData.append("status", status)
      formData.append("paymentStatus", paymentStatus)
      formData.append("totalAmount", totalAmount.toString())

      const result = await createBooking(formData)

      if (result.success) {
        toast({
          title: "Booking Created",
          description: `Booking reference: ${result.bookingReference}`,
        })
        router.push("/admin/bookings")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create booking",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomId" className={errors.roomId ? "text-destructive" : ""}>
                    Room Type *
                  </Label>
                  <Select value={roomId} onValueChange={setRoomId} disabled={isSubmitting}>
                    <SelectTrigger id="roomId" className={errors.roomId ? "border-destructive" : ""}>
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
                  {errors.roomId && <p className="text-sm text-destructive">{errors.roomId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                  <Select
                    value={numberOfGuests}
                    onValueChange={setNumberOfGuests}
                    disabled={!selectedRoom || isSubmitting}
                  >
                    <SelectTrigger id="numberOfGuests">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {getGuestOptions().map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedRoom && (
                <div className="mt-4 p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center">
                    <span>
                      Selected Room: <strong>{selectedRoom.name}</strong> - Rate:{" "}
                      <strong>${selectedRoom.default_rate}/night</strong>
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={errors.checkInDate ? "text-destructive" : ""}>Check-in Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground",
                          errors.checkInDate && "border-destructive",
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => {
                          setCheckInDate(date || new Date())
                          // Ensure checkout is at least one day after checkin
                          if (date && checkOutDate && date >= checkOutDate) {
                            setCheckOutDate(addDays(date, 1))
                          }
                        }}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date()) && !isToday(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.checkInDate && <p className="text-sm text-destructive">{errors.checkInDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={errors.checkOutDate ? "text-destructive" : ""}>Check-out Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground",
                          errors.checkOutDate && "border-destructive",
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={(date) => date && setCheckOutDate(date)}
                        initialFocus
                        disabled={(date) => isBefore(date, new Date()) || (checkInDate && isBefore(date, checkInDate))}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.checkOutDate && <p className="text-sm text-destructive">{errors.checkOutDate}</p>}
                </div>
              </div>

              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <div className="flex items-center">
                  <span>
                    Duration:{" "}
                    <strong>
                      {nights} {nights === 1 ? "night" : "nights"}
                    </strong>
                    ({format(checkInDate, "MMM d, yyyy")} - {format(checkOutDate, "MMM d, yyyy")})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className={errors.guestName ? "text-destructive" : ""}>
                    Full Name *
                  </Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className={errors.guestName ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.guestName && <p className="text-sm text-destructive">{errors.guestName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail" className={errors.guestEmail ? "text-destructive" : ""}>
                      Email Address *
                    </Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      className={errors.guestEmail ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.guestEmail && <p className="text-sm text-destructive">{errors.guestEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Phone Number</Label>
                    <Input
                      id="guestPhone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
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
                    placeholder="Any special requests or requirements..."
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room Rate:</span>
                    <span>${selectedRoom?.default_rate.toFixed(2) || "0.00"}/night</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select booking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Booking"
                )}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/bookings")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

