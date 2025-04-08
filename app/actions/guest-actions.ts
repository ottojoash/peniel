"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get all guests
export async function getGuests() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select(`
      *,
      bookings(id, booking_reference, check_in_date, check_out_date, status)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching guests:", error)
    return []
  }

  return data
}

// Get guest by ID
export async function getGuestById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select(`
      *,
      bookings(
        id, 
        booking_reference, 
        check_in_date, 
        check_out_date, 
        status,
        payment_status,
        total_amount,
        room_id,
        rooms(id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching guest ${id}:`, error)
    return null
  }

  return data
}

// Create a new guest
export async function createGuest(formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const notes = formData.get("notes") as string

    const { data, error } = await supabase
      .from("guests")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        postal_code: postalCode,
        country,
        notes,
      })
      .select()

    if (error) throw error

    revalidatePath("/admin/guests")

    return { success: true, guestId: data[0].id }
  } catch (error) {
    console.error("Error creating guest:", error)
    return { success: false, error: "Failed to create guest" }
  }
}

// Update a guest
export async function updateGuest(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const notes = formData.get("notes") as string

    const { error } = await supabase
      .from("guests")
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        postal_code: postalCode,
        country,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/guests")
    revalidatePath(`/admin/guests/${id}`)

    return { success: true }
  } catch (error) {
    console.error(`Error updating guest ${id}:`, error)
    return { success: false, error: "Failed to update guest" }
  }
}

// Delete a guest
export async function deleteGuest(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if guest has bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("id")
      .eq("guest_id", id)
      .limit(1)

    if (bookingsError) throw bookingsError

    if (bookings && bookings.length > 0) {
      return {
        success: false,
        error: "Cannot delete guest with existing bookings",
      }
    }

    const { error } = await supabase.from("guests").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/guests")

    return { success: true }
  } catch (error) {
    console.error(`Error deleting guest ${id}:`, error)
    return { success: false, error: "Failed to delete guest" }
  }
}

// Search guests
export async function searchGuests(query: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select("id, first_name, last_name, email, phone")
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order("last_name")
    .limit(10)

  if (error) {
    console.error(`Error searching guests with query "${query}":`, error)
    return []
  }

  return data
}
\
Let's now create a comprehensive room availability management system:

