import { getBookingById } from "@/app/actions/booking-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, ChevronLeft, Clock, CreditCard, Mail, MapPin, Phone, User, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BookingDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  // Validate the ID parameter - properly await params
  const id = params?.id
  if (!id) {
    notFound() // Redirect to 404 page if ID is not provided
  }

  const bookingId = Number.parseInt(id)
  if (isNaN(bookingId)) {
    notFound() // Redirect to 404 page if ID is not a valid number
  }

  // Fetch booking data
  let booking
  try {
    booking = await getBookingById(bookingId.toString())

    if (!booking) {
      console.error(`Booking with ID ${bookingId} not found`)
      notFound()
    }

    console.log(`Booking data for ID ${bookingId}:`, JSON.stringify(booking, null, 2))
  } catch (error) {
    console.error("Error fetching booking:", error)
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>
      case "checked-in":
        return <Badge className="bg-green-500">Checked In</Badge>
      case "checked-out":
        return <Badge className="bg-purple-500">Checked Out</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-500">Paid</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calculate nights
  const calculateNights = () => {
    try {
      const checkIn = new Date(booking.check_in_date)
      const checkOut = new Date(booking.check_out_date)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    } catch (error) {
      console.error("Error calculating nights:", error)
      return 0
    }
  }

  const nights = calculateNights()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/bookings">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
          </div>
          <p className="text-muted-foreground">Booking Reference: {booking?.booking_reference || "N/A"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Print</Button>
          <Button variant="outline">Email Guest</Button>
          <Button>Edit Booking</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Information</span>
              {getStatusBadge(booking?.status || "unknown")}
            </CardTitle>
            <CardDescription>
              Created on {booking?.created_at ? new Date(booking.created_at).toLocaleString() : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Guest Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking?.guest_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking?.guest_email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking?.guest_phone || "N/A"}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Reservation Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking?.room?.name || "Room not specified"}
                    {booking?.room && (
                      <Link
                        href={`/admin/content?tab=rooms&edit=${booking.room.id}`}
                        className="ml-2 text-sm text-blue-500 hover:underline"
                      >
                        View Room
                      </Link>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Check-in: {booking?.check_in_date ? new Date(booking.check_in_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Check-out: {booking?.check_out_date ? new Date(booking.check_out_date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {nights} night{nights !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking?.number_of_guests || 0} guest{booking?.number_of_guests !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {booking?.special_requests && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Special Requests</h3>
                  <p className="text-muted-foreground">{booking.special_requests}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Booking payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              {getPaymentStatusBadge(booking?.payment_status || "unknown")}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Rate:</span>
                <span>
                  ${nights > 0 && booking?.total_amount ? (booking.total_amount / nights).toFixed(2) : "0.00"}
                  <span className="text-xs text-muted-foreground"> / night</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nights:</span>
                <span>{nights}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>${booking?.total_amount ? booking.total_amount.toFixed(2) : "0.00"}</span>
              </div>
            </div>
            <div className="pt-4">
              <Button className="w-full" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
