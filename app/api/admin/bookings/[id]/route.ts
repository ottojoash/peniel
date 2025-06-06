import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("PUT request received for booking ID:", params.id)

  const supabase = createServerSupabaseClient()

  try {
    const bookingId = params.id
    const body = await request.json()

    console.log("Request body:", body)
    console.log("Booking ID:", bookingId)

    const {
      guestName,
      guestEmail,
      guestPhone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomId,
      status,
      paymentStatus,
      specialRequests,
    } = body

    // Validate required fields
    if (!guestName || !guestEmail || !guestPhone || !checkInDate || !checkOutDate || !numberOfGuests || !roomId) {
      console.log("Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if booking exists
    console.log("Checking if booking exists...")
    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, room_id, total_amount")
      .eq("id", bookingId)
      .single()

    console.log("Existing booking:", existingBooking)
    console.log("Fetch error:", fetchError)

    if (fetchError || !existingBooking) {
      console.log("Booking not found")
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    // For now, let's skip the room rate recalculation to simplify
    // We'll just update the booking without changing the total amount

    // Update the booking
    const updateData = {
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      number_of_guests: numberOfGuests,
      room_id: roomId,
      status,
      payment_status: paymentStatus,
      special_requests: specialRequests,
    }

    console.log("Update data:", updateData)

    const { data, error } = await supabase.from("bookings").update(updateData).eq("id", bookingId).select()

    console.log("Update result:", data)
    console.log("Update error:", error)

    if (error) {
      console.error("Error updating booking:", error)
      return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 })
    }

    revalidatePath("/admin/bookings")
    revalidatePath(`/admin/bookings/${bookingId}`)

    return NextResponse.json({
      success: true,
      booking: data[0],
    })
  } catch (error) {
    console.error("Exception in PUT handler:", error)
    return NextResponse.json({ success: false, error: "Failed to update booking. Please try again." }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  try {
    const bookingId = params.id

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        room:rooms(id, name)
      `)
      .eq("id", bookingId)
      .single()

    if (error || !booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      booking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 })
  }
}
