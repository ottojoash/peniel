"use server"

import { createServiceSupabaseClient } from "@/lib/supabase"
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

// Get all rooms with retry logic
export async function getRoomsWithRetry(retries = 3, delay = 1000) {
  let lastError

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const supabase = createServiceSupabaseClient()

      const { data, error } = await supabase
        .from("rooms")
        .select("id, name, max_occupancy, room_rates(price_per_night, is_default)")
        .eq("is_published", true)
        .eq("is_active", true)
        .order("name")

      if (error) {
        console.error(`Attempt ${attempt + 1}: Error fetching rooms:`, error)
        lastError = error
        // Wait before retrying
        if (attempt < retries - 1) await new Promise((r) => setTimeout(r, delay))
        continue
      }

      // Transform data to include default rate
      const transformedData = data.map((room) => ({
        ...room,
        default_rate: room.room_rates.find((rate: any) => rate.is_default)?.price_per_night || 100,
      }))

      return { success: true, rooms: transformedData }
    } catch (error) {
      console.error(`Attempt ${attempt + 1}: Exception fetching rooms:`, error)
      lastError = error
      // Wait before retrying
      if (attempt < retries - 1) await new Promise((r) => setTimeout(r, delay))
    }
  }

  console.error(`All ${retries} attempts to fetch rooms failed. Last error:`, lastError)
  return {
    success: false,
    error: `Failed to fetch rooms after ${retries} attempts`,
    lastError,
  }
}

// Create a new booking
export async function createBooking(formData: FormData) {
  try {
    const supabase = createServiceSupabaseClient()

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
    const totalAmount = (formData.get("totalAmount") as string) || "0"

    // Validate required fields
    if (!roomId || !guestName || !guestEmail || !checkInDate || !checkOutDate) {
      return { success: false, error: "Please fill in all required fields" }
    }

    // Generate a unique booking reference
    const bookingReference = generateBookingReference()

    console.log("Creating booking with service role client:", {
      booking_reference: bookingReference,
      room_id: Number.parseInt(roomId),
      guest_name: guestName,
      guest_email: guestEmail,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    })

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
        total_amount: Number.parseFloat(totalAmount),
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

// Get all bookings
export async function getBookings() {
  try {
    const supabase = createServiceSupabaseClient()

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        room:rooms (id, name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getBookings:", error)
    return []
  }
}

// Get a single booking by ID
export async function getBookingById(id: string) {
  try {
    const supabase = createServiceSupabaseClient()

    console.log(`Fetching booking with ID: ${id}`)

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        room:rooms (id, name, description, images)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching booking ${id}:`, error)
      return null
    }

    console.log(`Booking data retrieved:`, data)
    return data
  } catch (error) {
    console.error(`Error in getBookingById ${id}:`, error)
    return null
  }
}

// Check room availability
export async function checkRoomAvailability(roomId: number, startDate: string, endDate: string) {
  try {
    const supabase = createServiceSupabaseClient()

    // Check if there are any bookings for this room that overlap with the requested dates
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", roomId)
      .eq("status", "confirmed")
      .or(`check_in_date.lte.${endDate},check_out_date.gte.${startDate}`)
      .not("status", "eq", "cancelled")

    if (error) {
      console.error(`Error checking availability for room ${roomId}:`, error)
      return { available: false, error: "Failed to check availability" }
    }

    // If there are no overlapping bookings, the room is available
    return { available: data.length === 0 }
  } catch (error) {
    console.error(`Error in checkRoomAvailability for room ${roomId}:`, error)
    return { available: false, error: "Failed to check availability" }
  }
}
