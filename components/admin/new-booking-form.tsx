"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  CalendarIcon,
  Loader2,
  CreditCard,
  User,
  Users,
  Building,
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { format, differenceInDays, addDays, isBefore, isToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createBooking, checkRoomAvailability } from "@/app/actions/booking-actions"

export default function NewBookingForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  // State for form fields
  const [rooms, setRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [roomId, setRoomId] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [checkInDate, setCheckInDate] = useState<Date>(new Date())
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 1))
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentStatus, setPaymentStatus] = useState("paid")
  const [bookingStatus, setBookingStatus] = useState("confirmed")

  // State for UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)
  const [nights, setNights] = useState(1)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [isRoomAvailable, setIsRoomAvailable] = useState(true)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Fetch rooms on component mount
  useEffect(() => {
    async function fetchRooms() {
      try {
        setIsLoadingRooms(true)
        const { data, error } = await supabase
          .from("rooms")
          .select(`
            id, 
            name, 
            max_occupancy, 
            description,
            image_url,
            room_rates(price_per_night, is_default)
          `)
          .eq("is_published", true)
          .eq("is_active", true)
          .order("name")

        if (error) throw error

        setRooms(data || [])
      } catch (error) {
        console.error("Error fetching rooms:", error)
        toast({
          title: "Error",
          description: "Failed to load rooms. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingRooms(false)
      }
    }

    fetchRooms()
  }, [supabase, toast])

  // Update selected room when roomId changes
  useEffect(() => {
    if (roomId) {
      const room = rooms.find((r) => r.id.toString() === roomId)
      setSelectedRoom(room)

      // Reset number of guests if the new room has a lower capacity
      if (room && numberOfGuests > room.max_occupancy) {
        setNumberOfGuests(room.max_occupancy)
      }

      // Check availability when room changes
      if (checkInDate && checkOutDate) {
        checkAvailability(Number.parseInt(roomId), checkInDate, checkOutDate)
      }
    } else {
      setSelectedRoom(null)
    }
  }, [roomId, rooms])

  // Calculate nights and total amount
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nightsCount = Math.max(1, differenceInDays(checkOutDate, checkInDate))
      setNights(nightsCount)

      if (selectedRoom) {
        const defaultRate = selectedRoom.room_rates.find((rate: any) => rate.is_default)
        if (defaultRate) {
          setTotalAmount(defaultRate.price_per_night * nightsCount)
        }
      }

      // Check availability when dates change
      if (roomId) {
        checkAvailability(Number.parseInt(roomId), checkInDate, checkOutDate)
      }
    }
  }, [checkInDate, checkOutDate, selectedRoom, roomId])

  // Check room availability
  const checkAvailability = async (roomId: number, startDate: Date, endDate: Date) => {
    if (!roomId || !startDate || !endDate) return

    try {
      setIsCheckingAvailability(true)
      const result = await checkRoomAvailability(
        roomId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      )
      setIsRoomAvailable(result.available)
    } catch (error) {
      console.error("Error checking availability:", error)
      // Default to available if check fails
      setIsRoomAvailable(true)
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!roomId) errors.roomId = "Please select a room"
    if (!guestName) errors.guestName = "Guest name is required"
    if (!guestEmail) errors.guestEmail = "Guest email is required"
    if (!guestPhone) errors.guestPhone = "Guest phone is required"

    if (!checkInDate) {
      errors.checkInDate = "Check-in date is required"
    } else if (isBefore(checkInDate, new Date()) && !isToday(checkInDate)) {
      errors.checkInDate = "Check-in date cannot be in the past"
    }

    if (!checkOutDate) {
      errors.checkOutDate = "Check-out date is required"
    } else if (isBefore(checkOutDate, checkInDate)) {
      errors.checkOutDate = "Check-out date must be after check-in date"
    }

    if (!isRoomAvailable) {
      errors.availability = "This room is not available for the selected dates"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
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

    setIsConfirmDialogOpen(true)
  }

  // Handle confirmed submission
  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true)
    setIsConfirmDialogOpen(false)

    try {
      const formData = new FormData()
      formData.append("roomId", roomId)
      formData.append("guestName", guestName)
      formData.append("guestEmail", guestEmail)
      formData.append("guestPhone", guestPhone)
      formData.append("checkInDate", checkInDate.toISOString().split("T")[0])
      formData.append("checkOutDate", checkOutDate.toISOString().split("T")[0])
      formData.append("numberOfGuests", numberOfGuests.toString())
      formData.append("specialRequests", specialRequests)
      formData.append("status", bookingStatus)
      formData.append("paymentStatus", paymentStatus)

      const result = await createBooking(formData)

      if (result.success) {
        setBookingReference(result.booking.booking_reference)
        setIsSuccessDialogOpen(true)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create booking. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate guest options based on selected room's capacity
  const getGuestOptions = () => {
    const maxGuests = selectedRoom?.max_occupancy || 1
    return Array.from({ length: maxGuests }, (_, i) => i + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">New Booking</h1>
          <p className="text-muted-foreground">Create a new booking for a guest</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/bookings")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isCheckingAvailability}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Booking"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Room Selection
              </CardTitle>
              <CardDescription>Select a room for this booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId" className={formErrors.roomId ? "text-destructive" : ""}>
                      Room Type *
                    </Label>
                    <Select value={roomId} onValueChange={setRoomId} disabled={isLoadingRooms || isSubmitting}>
                      <SelectTrigger id="roomId" className={formErrors.roomId ? "border-destructive" : ""}>
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
                    {formErrors.roomId && <p className="text-sm text-destructive mt-1">{formErrors.roomId}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                    <Select
                      value={numberOfGuests.toString()}
                      onValueChange={(value) => setNumberOfGuests(Number.parseInt(value, 10))}
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
                    <div className="flex gap-4">
                      {selectedRoom.image_url && (
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img
                            src={selectedRoom.image_url || "/placeholder.svg?height=96&width=96"}
                            alt={selectedRoom.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{selectedRoom.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                        <div className="mt-2 flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">Max capacity: {selectedRoom.max_occupancy} guests</span>
                        </div>

                        {isCheckingAvailability ? (
                          <div className="mt-2 flex items-center">
                            <Loader2 className="h-4 w-4 mr-1 animate-spin text-muted-foreground" />
                            <span className="text-sm">Checking availability...</span>
                          </div>
                        ) : !isRoomAvailable ? (
                          <div className="mt-2 flex items-center text-destructive">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Not available for selected dates</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Available for selected dates</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formErrors.availability && (
                  <div className="text-sm text-destructive mt-1">{formErrors.availability}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                Booking Dates
              </CardTitle>
              <CardDescription>Select check-in and check-out dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={formErrors.checkInDate ? "text-destructive" : ""}>Check-in Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground",
                          formErrors.checkInDate && "border-destructive",
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
                  {formErrors.checkInDate && <p className="text-sm text-destructive mt-1">{formErrors.checkInDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label className={formErrors.checkOutDate ? "text-destructive" : ""}>Check-out Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground",
                          formErrors.checkOutDate && "border-destructive",
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
                  {formErrors.checkOutDate && (
                    <p className="text-sm text-destructive mt-1">{formErrors.checkOutDate}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
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
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Guest Information
              </CardTitle>
              <CardDescription>Enter guest details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className={formErrors.guestName ? "text-destructive" : ""}>
                    Full Name *
                  </Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="John Doe"
                    className={formErrors.guestName ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {formErrors.guestName && <p className="text-sm text-destructive mt-1">{formErrors.guestName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail" className={formErrors.guestEmail ? "text-destructive" : ""}>
                      Email Address *
                    </Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      className={formErrors.guestEmail ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.guestEmail && <p className="text-sm text-destructive mt-1">{formErrors.guestEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestPhone" className={formErrors.guestPhone ? "text-destructive" : ""}>
                      Phone Number *
                    </Label>
                    <Input
                      id="guestPhone"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={formErrors.guestPhone ? "border-destructive" : ""}
                      disabled={isSubmitting}
                    />
                    {formErrors.guestPhone && <p className="text-sm text-destructive mt-1">{formErrors.guestPhone}</p>}
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
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>Booking summary and payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room Rate:</span>
                    <span>
                      ${selectedRoom?.room_rates?.find((r: any) => r.is_default)?.price_per_night.toFixed(2) || "0.00"}
                      /night
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isSubmitting}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bookingStatus">Status</Label>
                <Select value={bookingStatus} onValueChange={setBookingStatus} disabled={isSubmitting}>
                  <SelectTrigger id="bookingStatus">
                    <SelectValue placeholder="Select booking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 flex justify-center">
                  {bookingStatus === "confirmed" && <Badge className="bg-green-500">Confirmed</Badge>}
                  {bookingStatus === "pending" && <Badge className="bg-yellow-500">Pending</Badge>}
                  {bookingStatus === "cancelled" && <Badge className="bg-red-500">Cancelled</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || isCheckingAvailability}>
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
                  onClick={() => router.push("/admin/bookings")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>Please review the booking details before confirming.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Room:</div>
              <div>{selectedRoom?.name}</div>

              <div className="font-medium">Guest:</div>
              <div>{guestName}</div>

              <div className="font-medium">Check-in:</div>
              <div>{checkInDate ? format(checkInDate, "PPP") : "-"}</div>

              <div className="font-medium">Check-out:</div>
              <div>{checkOutDate ? format(checkOutDate, "PPP") : "-"}</div>

              <div className="font-medium">Guests:</div>
              <div>{numberOfGuests}</div>

              <div className="font-medium">Total Amount:</div>
              <div>${totalAmount.toFixed(2)}</div>

              <div className="font-medium">Payment Status:</div>
              <div>
                <Badge variant={paymentStatus === "paid" ? "default" : "outline"}>
                  {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                </Badge>
              </div>

              <div className="font-medium">Booking Status:</div>
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    bookingStatus === "confirmed" && "bg-green-500 text-white",
                    bookingStatus === "pending" && "bg-yellow-500 text-white",
                    bookingStatus === "cancelled" && "bg-red-500 text-white",
                  )}
                >
                  {bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isSubmitting}>
              Back
            </Button>
            <Button onClick={handleConfirmedSubmit} disabled={isSubmitting}>
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
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Booking Created Successfully
            </DialogTitle>
            <DialogDescription>The booking has been created with the following details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              <div className="font-medium">Room:</div>
              <div>{selectedRoom?.name}</div>

              <div className="font-medium">Guest:</div>
              <div>{guestName}</div>

              <div className="font-medium">Check-in:</div>
              <div>{checkInDate ? format(checkInDate, "PPP") : "-"}</div>

              <div className="font-medium">Check-out:</div>
              <div>{checkOutDate ? format(checkOutDate, "PPP") : "-"}</div>

              <div className="font-medium">Total Amount:</div>
              <div>${totalAmount.toFixed(2)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsSuccessDialogOpen(false)
                router.push("/admin/bookings")
              }}
            >
              Go to Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccessDialogOpen(false)
                // Reset form for a new booking
                setRoomId("")
                setSelectedRoom(null)
                setGuestName("")
                setGuestEmail("")
                setGuestPhone("")
                setCheckInDate(new Date())
                setCheckOutDate(addDays(new Date(), 1))
                setNumberOfGuests(1)
                setSpecialRequests("")
                setPaymentMethod("card")
                setPaymentStatus("paid")
                setBookingStatus("confirmed")
                setFormErrors({})
              }}
            >
              Create Another Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

