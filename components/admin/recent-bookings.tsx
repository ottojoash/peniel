import { getBookings } from "@/app/actions/booking-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function RecentBookings() {
  // Fetch the most recent bookings
  const allBookings = await getBookings()
  const recentBookings = allBookings.slice(0, 5) // Get the first 5 bookings

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

  return (
    <div className="space-y-4">
      {recentBookings.length === 0 ? (
        <div className="text-muted-foreground text-center py-4">No recent bookings found</div>
      ) : (
        recentBookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/admin/bookings/${booking.id}`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar>
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${booking.guest_name.charAt(0)}`} />
              <AvatarFallback>{booking.guest_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium truncate">{booking.guest_name}</div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="text-sm text-muted-foreground truncate">{booking.room?.name || "Room not specified"}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                {new Date(booking.check_out_date).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">${booking.total_amount}</div>
              <div className="text-xs text-muted-foreground">{new Date(booking.created_at).toLocaleDateString()}</div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

