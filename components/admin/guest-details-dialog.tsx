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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Globe, FileText, User } from "lucide-react"

interface GuestDetailsDialogProps {
  guest: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function GuestDetailsDialog({ guest, open, onOpenChange }: GuestDetailsDialogProps) {
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

  // Mock booking history for the guest
  const bookingHistory = [
    {
      id: "B-1001",
      checkIn: "2025-03-10",
      checkOut: "2025-03-13",
      roomType: "Executive Conference Block Double",
      totalAmount: 240,
      status: "completed",
    },
    {
      id: "B-892",
      checkIn: "2024-12-24",
      checkOut: "2024-12-26",
      roomType: "Family Room",
      totalAmount: 200,
      status: "completed",
    },
    {
      id: "B-743",
      checkIn: "2024-09-15",
      checkOut: "2024-09-20",
      roomType: "Executive RBLK & Cottages",
      totalAmount: 280,
      status: "completed",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Guest Profile {getStatusBadge(guest.status)}</DialogTitle>
          <DialogDescription>
            Guest ID: {guest.id} | Registered: {new Date(guest.createdAt).toLocaleDateString()}
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
                <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${guest.name.charAt(0)}`} />
                <AvatarFallback className="text-2xl">{guest.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{guest.name}</h3>
                <p className="text-muted-foreground">{guest.nationality}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{guest.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{guest.address}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>Nationality: {guest.nationality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Passport: {guest.passportNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Status: {guest.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Stays</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{guest.totalStays}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${guest.totalSpent}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Last Stay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date(guest.lastStay).toLocaleDateString()}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="pt-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Booking ID</th>
                    <th className="p-2 text-left font-medium">Dates</th>
                    <th className="p-2 text-left font-medium">Room Type</th>
                    <th className="p-2 text-left font-medium">Amount</th>
                    <th className="p-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingHistory.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="p-2">{booking.id}</td>
                      <td className="p-2">
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="p-2">{booking.roomType}</td>
                      <td className="p-2">${booking.totalAmount}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="capitalize">
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bookingHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No booking history available for this guest.</div>
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
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prefers rooms with ocean view</li>
                    <li>Early check-in when available</li>
                    <li>Allergic to nuts</li>
                    <li>Prefers king-size bed</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Special Requests History</h3>
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">March 10, 2025</p>
                      <p className="text-sm text-muted-foreground">Requested airport pickup service</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">December 24, 2024</p>
                      <p className="text-sm text-muted-foreground">Requested late checkout (approved)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">September 15, 2024</p>
                      <p className="text-sm text-muted-foreground">Requested extra pillows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              New Booking
            </Button>
          </div>
          <Button className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

