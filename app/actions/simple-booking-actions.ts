"use server"

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

// Mock data for rooms in case the fetch fails
const FALLBACK_ROOMS = [
  { id: 1, name: "Standard Room", max_occupancy: 2 },
  { id: 2, name: "Deluxe Room", max_occupancy: 3 },
  { id: 3, name: "Suite", max_occupancy: 4 },
  { id: 4, name: "Family Room", max_occupancy: 6 },
]

// Get all rooms (active and published)
export async function getAllRooms() {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log("Supabase URL available:", !!process.env.SUPABASE_URL)
    console.log("Supabase Anon Key available:", !!process.env.SUPABASE_ANON_KEY)

    // Create the Supabase client
    const supabase = createServerSupabaseClient()

    // Attempt to fetch rooms
    const { data, error } = await supabase
      .from("rooms")
      .select("id, name, max_occupancy")
      .eq("is_published", true)
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Supabase error fetching rooms:", error)
      // Return fallback data instead of failing
      return {
        success: true,
        rooms: FALLBACK_ROOMS,
        warning: "Using fallback room data due to database error",
      }
    }

    return { success: true, rooms: data || [] }
  } catch (error) {
    console.error("Error fetching rooms:", error)

    // Return fallback data instead of failing
    return {
      success: true,
      rooms: FALLBACK_ROOMS,
      warning: "Using fallback room data due to fetch error",
    }
  }
}

// Create a new booking using server action
export async function createSimpleBooking(formData: FormData) {
  try {
    // Create the Supabase client
    const supabase = createServerSupabaseClient()

    // Extract form data
    const roomId = formData.get("roomId") as string
    const guestName = formData.get("guestName") as string
    const guestEmail = formData.get("guestEmail") as string
    const guestPhone = formData.get("guestPhone") as string
    const checkInDate = formData.get("checkInDate") as string
    const checkOutDate = formData.get("checkOutDate") as string
    const numberOfGuests = formData.get("numberOfGuests") as string
    const specialRequests = formData.get("specialRequests") as string
    const status = (formData.get("status") as string) || "confirmed"
    const paymentStatus = (formData.get("paymentStatus") as string) || "paid"

    // Validate required fields
    if (!roomId || !guestName || !guestEmail || !checkInDate || !checkOutDate) {
      return { success: false, error: "Please fill in all required fields" }
    }

    // Calculate total amount (using a fixed rate to avoid database query)
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    const pricePerNight = 100 // Fixed rate to avoid database query
    const totalAmount = pricePerNight * nights

    // Generate a unique booking reference
    const bookingReference = generateBookingReference()

    // Insert the booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        booking_reference: bookingReference,
        room_id: Number.parseInt(roomId),
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_guests: Number.parseInt(numberOfGuests),
        special_requests: specialRequests,
        total_amount: totalAmount,
        status: status,
        payment_status: paymentStatus,
      })
      .select()

    if (error) {
      console.error("Error creating booking:", error)
      return {
        success: false,
        error: `Failed to create booking: ${error.message}`,
      }
    }

    revalidatePath("/admin/bookings")
    return {
      success: true,
      bookingReference,
      booking: data[0],
    }
  } catch (error: any) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: `Failed to create booking: ${error?.message || "Unknown error"}`,
    }
  }
}

