import { getBookings } from "@/app/actions/booking-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Suspense } from "react"
import Link from "next/link"

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage and track all guest reservations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div>Loading bookings...</div>}>
        <BookingsTable />
      </Suspense>
    </div>
  )
}

async function BookingsTable() {
  // Fetch bookings from the database
  const bookings = await getBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>View and manage all guest reservations at your hotel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, or booking ID..." className="pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="checked-out">Checked Out</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.guest_name}</div>
                      <div className="text-xs text-muted-foreground">{booking.guest_email}</div>
                    </TableCell>
                    <TableCell>{booking.room?.name || "N/A"}</TableCell>
                    <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.check_out_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                    <TableCell>${booking.total_amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/admin/bookings/${booking.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`/admin/bookings/edit/${booking.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Booking
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to render status badges
function getStatusBadge(status: string) {
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

// Helper function to render payment status badges
function getPaymentStatusBadge(status: string) {
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

