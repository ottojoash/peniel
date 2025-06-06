import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import EditBookingForm from "../edit-booking-form"

async function getBooking(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      room:rooms(id, name)
    `)
    .eq("id", id)
    .single()

  if (error || !booking) {
    console.error("Error fetching booking:", error)
    return null
  }

  return booking
}

async function getRooms() {
  const supabase = createServerSupabaseClient()

  try {
    // Query without the 'type' column that doesn't exist
    const { data: rooms, error } = await supabase.from("rooms").select("id, name").order("name")

    if (error) {
      console.error("Error fetching rooms:", error)
      return []
    }

    return rooms || []
  } catch (error) {
    console.error("Exception fetching rooms:", error)
    return []
  }
}

interface EditBookingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  // Await params first (Next.js 15 requirement)
  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    notFound() // Redirect to 404 page if ID is not provided
  }

  const bookingId = Number.parseInt(id)
  if (isNaN(bookingId)) {
    notFound() // Redirect to 404 page if ID is not a valid number
  }

  // Now fetch the booking and rooms with the validated ID
  const [booking, rooms] = await Promise.all([getBooking(id), getRooms()])

  if (!booking) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Booking</h1>
        <p className="text-muted-foreground">
          Update booking details for {booking.guest_name} - {booking.booking_reference}
        </p>
      </div>

      <EditBookingForm booking={booking} rooms={rooms} />
    </div>
  )
}
