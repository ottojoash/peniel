"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Globe, FileText, User, Loader2, AlertTriangle } from "lucide-react"
import { deleteGuest } from "@/app/actions/guest-actions"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import GuestForm from "./guest-form"

interface GuestDetailsDialogProps {
  guest: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onGuestUpdated?: () => void
}

export default function GuestDetailsDialog({ guest, open, onOpenChange, onGuestUpdated }: GuestDetailsDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleDeleteGuest = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteGuest(guest.id)
      if (result.success) {
        toast({
          title: "Guest deleted",
          description: "The guest has been deleted successfully.",
        })
        onOpenChange(false)
        if (onGuestUpdated) onGuestUpdated()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete guest.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting guest:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      case "blacklisted":
        return <Badge className="bg-red-500">Blacklisted</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
            <DialogDescription>Update guest information</DialogDescription>
          </DialogHeader>
          <GuestForm
            guest={guest}
            onSuccess={() => {
              setIsEditing(false)
              if (onGuestUpdated) onGuestUpdated()
              toast({
                title: "Guest updated",
                description: "The guest has been updated successfully.",
              })
            }}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Guest Profile {guest.status && getStatusBadge(guest.status)}
            </DialogTitle>
            <DialogDescription>
              Guest ID: {guest.id} | Registered:{" "}
              {guest.created_at ? new Date(guest.created_at).toLocaleDateString() : "N/A"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Booking History</TabsTrigger>
              <TabsTrigger value="notes">Notes & Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${guest.first_name?.charAt(0) || "G"}`} />
                  <AvatarFallback className="text-2xl">{guest.first_name?.charAt(0) || "G"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {guest.first_name} {guest.last_name}
                  </h3>
                  <p className="text-muted-foreground">{guest.country || "No country specified"}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{guest.email || "No email specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{guest.phone || "No phone specified"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {guest.address
                        ? `${guest.address}${guest.city ? `, ${guest.city}` : ""}${
                            guest.state ? `, ${guest.state}` : ""
                          }${guest.postal_code ? ` ${guest.postal_code}` : ""}`
                        : "No address specified"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Country: {guest.country || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>ID/Passport: {guest.id_number || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {guest.status || "Active"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Stays</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{guest.bookings?.length || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      $
                      {guest.bookings
                        ?.reduce((total: number, booking: any) => total + (booking.total_amount || 0), 0)
                        .toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Last Stay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {guest.bookings && guest.bookings.length > 0
                        ? new Date(
                            Math.max(...guest.bookings.map((b: any) => new Date(b.check_in_date).getTime())),
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="pt-4">
              {guest.bookings && guest.bookings.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Booking ID</th>
                        <th className="p-2 text-left font-medium">Dates</th>
                        <th className="p-2 text-left font-medium">Room</th>
                        <th className="p-2 text-left font-medium">Amount</th>
                        <th className="p-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guest.bookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b">
                          <td className="p-2">{booking.booking_reference}</td>
                          <td className="p-2">
                            {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </td>
                          <td className="p-2">{booking.rooms?.name || `Room #${booking.room_id}`}</td>
                          <td className="p-2">${booking.total_amount?.toFixed(2) || "0.00"}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="capitalize">
                              {booking.status || "pending"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No booking history available for this guest.
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <div className="p-4 border rounded-md bg-muted/50">
                    <p>{guest.notes || "No notes available for this guest."}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Preferences</h3>
                  <div className="p-4 border rounded-md bg-muted/50">
                    {guest.preferences ? (
                      <ul className="list-disc list-inside space-y-1">
                        {guest.preferences.split("\n").map((pref: string, index: number) => (
                          <li key={index}>{pref}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No preferences recorded for this guest.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Special Requests History</h3>
                  <div className="p-4 border rounded-md bg-muted/50">
                    {guest.special_requests ? (
                      <div className="space-y-2">
                        {guest.special_requests.map((request: any, index: number) => (
                          <div key={index}>
                            <p className="text-sm font-medium">{new Date(request.date).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{request.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No special requests history available.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                New Booking
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="destructive" className="flex-1 sm:flex-none" onClick={() => setShowDeleteConfirm(true)}>
                Delete Guest
              </Button>
              <Button className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this guest?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guest and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGuest} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
