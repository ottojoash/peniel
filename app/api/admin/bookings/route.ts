import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Generate a unique booking reference
function generateBookingReference() {
  const prefix = "PBH"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  try {
    const formData = await request.formData()

    // Extract booking data
    const roomId = formData.get("roomId") as string
    const guestName = formData.get("guestName") as string
    const guestEmail = formData.get("guestEmail") as string
    const guestPhone = formData.get("guestPhone") as string
    const checkInDate = formData.get("checkInDate") as string
    const checkOutDate = formData.get("checkOutDate") as string
    const numberOfGuests = Number.parseInt(formData.get("numberOfGuests") as string, 10)
    const specialRequests = formData.get("specialRequests") as string

    // Generate a unique booking reference
    const bookingReference = generateBookingReference()

    // Get room rate for calculation
    const { data: roomRate, error: rateError } = await supabase
      .from("room_rates")
      .select("price_per_night")
      .eq("room_id", roomId)
      .eq("is_default", true)
      .single()

    if (rateError) {
      console.error("Error fetching room rate:", rateError)
      return NextResponse.json({ success: false, error: "Failed to fetch room rate" }, { status: 500 })
    }

    // Calculate number of nights
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate total amount
    const totalAmount = roomRate.price_per_night * nights

    // Insert the booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        booking_reference: bookingReference,
        room_id: Number.parseInt(roomId, 10),
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_guests: numberOfGuests,
        total_amount: totalAmount,
        status: "confirmed", // Admin-created bookings are confirmed by default
        payment_status: "paid", // Admin-created bookings are marked as paid by default
        special_requests: specialRequests,
      })
      .select()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 })
    }

    revalidatePath("/admin/bookings")

    return NextResponse.json({
      success: true,
      bookingReference,
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ success: false, error: "Failed to create booking. Please try again." }, { status: 500 })
  }
}

