"use client"

import { updateBookingStatus, updatePaymentStatus } from "@/app/actions/booking-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Calendar, ChevronDown, Clock, CreditCard, Mail, MapPin, Phone, User, Users } from "lucide-react"
import { useState } from "react"

interface BookingDetailsDialogProps {
  booking: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  const [status, setStatus] = useState(booking.status)
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await updateBookingStatus(booking.id, newStatus)
      setStatus(newStatus)
      toast({
        title: "Status updated",
        description: `Booking status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await updatePaymentStatus(booking.id, newStatus)
      setPaymentStatus(newStatus)
      toast({
        title: "Payment status updated",
        description: `Payment status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Booking Details {getStatusBadge(status)}</DialogTitle>
          <DialogDescription>
            Booking ID: {booking.booking_reference} | Created: {new Date(booking.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Guest Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.guest_phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Reservation Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{booking.room?.name || "Room not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {(() => {
                    const checkIn = new Date(booking.check_in_date)
                    const checkOut = new Date(booking.check_out_date)
                    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return `${diffDays} night${diffDays !== 1 ? "s" : ""}`
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.number_of_guests} guest{booking.number_of_guests !== 1 ? "s" : ""}
                </span>
              </div>
              {booking.special_requests && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Special Requests:</p>
                  <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Payment Information</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Payment Status:</span>
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentStatusBadge(paymentStatus)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isUpdating}>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePaymentStatusChange("pending")}>
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePaymentStatusChange("paid")}>
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePaymentStatusChange("refunded")}>
                        Mark as Refunded
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Total Amount:</span>
                <span>${booking.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              Print
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Email
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none" disabled={isUpdating}>
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>Mark as Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("confirmed")}>Mark as Confirmed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("checked-in")}>Mark as Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("checked-out")}>
                  Mark as Checked Out
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>Mark as Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

