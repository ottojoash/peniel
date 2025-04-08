"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Calendar, Receipt, User, FileText, DollarSign } from "lucide-react"

interface PaymentDetailsDialogProps {
  payment: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaymentDetailsDialog({ payment, open, onOpenChange }: PaymentDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "refunded":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Refunded
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentMethodDetails = (method: string) => {
    switch (method) {
      case "credit_card":
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>
              Credit Card ({payment.cardInfo?.type || "Unknown"} ending in {payment.cardInfo?.last4 || "****"})
            </span>
          </div>
        )
      case "bank_transfer":
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Bank Transfer</span>
          </div>
        )
      case "paypal":
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>PayPal</span>
          </div>
        )
      case "mobile_money":
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Mobile Money</span>
          </div>
        )
      case "cash":
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Cash</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{method}</span>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payment Details {getStatusBadge(payment.status)}
          </DialogTitle>
          <DialogDescription>
            Payment ID: {payment.id} | Transaction Date: {new Date(payment.date).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold">${payment.amount}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <div>{getStatusBadge(payment.status)}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Guest: {payment.guestName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span>Booking ID: {payment.bookingId}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Transaction Date: {new Date(payment.date).toLocaleString()}</span>
            </div>

            {getPaymentMethodDetails(payment.method)}
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Payment Breakdown</h3>

            <div className="space-y-2 p-4 border rounded-md bg-muted/20">
              <div className="flex justify-between">
                <span>Room Charges</span>
                <span>${(payment.amount * 0.8).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${(payment.amount * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Additional Services</span>
                <span>${(payment.amount * 0.05).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${payment.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Receipt className="mr-2 h-4 w-4" />
              Generate Receipt
            </Button>
            {payment.status === "completed" && (
              <Button variant="outline" className="flex-1 sm:flex-none">
                <FileText className="mr-2 h-4 w-4" />
                Issue Refund
              </Button>
            )}
          </div>
          <Button className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

