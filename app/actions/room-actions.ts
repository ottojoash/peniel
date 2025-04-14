// "use server"

// import { createServerSupabaseClient } from "@/lib/supabase"
// import { revalidatePath } from "next/cache"
// import { generateUniqueSlug } from "@/lib/utils"

// // Get all rooms
// export async function getRooms() {
//   const supabase = createServerSupabaseClient()

//   try {
//     const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

//     if (error) {
//       console.error("Error fetching rooms:", error)
//       throw error
//     }

//     return data || []
//   } catch (error) {
//     console.error("Error in getRooms:", error)
//     return []
//   }
// }

// // Get published rooms
// export async function getPublishedRooms() {
//   const supabase = createServerSupabaseClient()

//   try {
//     // First, let's log the structure of the rooms table to understand it better
//     console.log("Fetching published rooms...")

//     const { data, error } = await supabase
//       .from("rooms")
//       .select(`
//         *,
//         room_type:room_type_id(id, name),
//         rates:room_rates(*),
//         features:room_features_junction(
//           feature:feature_id(id, name, icon)
//         ),
//         policies:room_policies(*)
//       `)
//       .eq("is_published", true)
//       .order("created_at", { ascending: false })

//     if (error) {
//       console.error("Error fetching published rooms:", error)
//       throw error
//     }

//     // Log the first room to see its structure
//     if (data && data.length > 0) {
//       console.log("First room data structure:", JSON.stringify(data[0], null, 2))
//     }

//     // Transform the features array to make it easier to work with
//     const transformedData =
//       data?.map((room) => {
//         if (room && room.features) {
//           return {
//             ...room,
//             features: room.features.map((item: any) => item.feature),
//           }
//         }
//         return room
//       }) || []

//     return transformedData
//   } catch (error) {
//     console.error("Error in getPublishedRooms:", error)
//     return []
//   }
// }

// // Get room by ID
// export async function getRoomById(id: number) {
//   const supabase = createServerSupabaseClient()

//   try {
//     const { data, error } = await supabase.from("rooms").select("*").eq("id", id).single()

//     if (error) {
//       console.error(`Error fetching room with ID ${id}:`, error)
//       throw error
//     }

//     return data
//   } catch (error) {
//     console.error(`Error in getRoomById for ID ${id}:`, error)
//     return null
//   }
// }

// // Get room by slug
// export async function getRoomBySlug(slug: string) {
//   const supabase = createServerSupabaseClient()

//   try {
//     // First get the room
//     const { data: room, error } = await supabase
//       .from("rooms")
//       .select(`
//         *,
//         room_type:room_type_id(id, name),
//         rates:room_rates(*),
//         features:room_features_junction(
//           feature:feature_id(id, name, icon)
//         ),
//         policies:room_policies(*)
//       `)
//       .eq("slug", slug)
//       .single()

//     if (error) {
//       console.error(`Error fetching room with slug ${slug}:`, error)
//       throw error
//     }

//     // Log the room data to see its structure
//     console.log(`Room data for slug ${slug}:`, JSON.stringify(room, null, 2))

//     // Transform the features array to make it easier to work with
//     if (room && room.features) {
//       room.features = room.features.map((item: any) => item.feature)
//     }

//     return room
//   } catch (error) {
//     console.error(`Error in getRoomBySlug for slug ${slug}:`, error)
//     throw error
//   }
// }

// // Create room
// export async function createRoom(formData: FormData) {
//   const supabase = createServerSupabaseClient()

//   try {
//     // Extract form data
//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const shortDescription = formData.get("shortDescription") as string
//     const basePrice = Number.parseFloat(formData.get("basePrice") as string)
//     const discountedPrice = formData.get("discountedPrice")
//       ? Number.parseFloat(formData.get("discountedPrice") as string)
//       : null
//     const capacity = Number.parseInt(formData.get("capacity") as string)
//     const beds = Number.parseInt(formData.get("beds") as string)
//     const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
//     const size = Number.parseInt(formData.get("size") as string)
//     const featuresJson = formData.get("features") as string
//     const imagesJson = formData.get("images") as string
//     const isPublished = formData.get("isPublished") === "true"

//     // Parse JSON strings
//     const features = featuresJson ? JSON.parse(featuresJson) : []
//     const images = imagesJson ? JSON.parse(imagesJson) : []

//     // Generate slug from name
//     const slug = await generateUniqueSlug(name, "rooms", "slug", supabase)

//     // Create room
//     const { data, error } = await supabase
//       .from("rooms")
//       .insert({
//         name,
//         slug,
//         description,
//         short_description: shortDescription,
//         base_price: basePrice,
//         discounted_price: discountedPrice,
//         capacity,
//         beds,
//         bathrooms,
//         size,
//         features,
//         images,
//         is_published: isPublished,
//       })
//       .select()
//       .single()

//     if (error) {
//       console.error("Error creating room:", error)
//       throw error
//     }

//     revalidatePath("/admin/rooms")
//     revalidatePath("/rooms")

//     return { success: true, data }
//   } catch (error) {
//     console.error("Error in createRoom:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to create room",
//     }
//   }
// }

// // Update room
// export async function updateRoom(id: number, formData: FormData) {
//   const supabase = createServerSupabaseClient()

//   try {
//     // Extract form data
//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const shortDescription = formData.get("shortDescription") as string
//     const basePrice = Number.parseFloat(formData.get("basePrice") as string)
//     const discountedPrice = formData.get("discountedPrice")
//       ? Number.parseFloat(formData.get("discountedPrice") as string)
//       : null
//     const capacity = Number.parseInt(formData.get("capacity") as string)
//     const beds = Number.parseInt(formData.get("beds") as string)
//     const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
//     const size = Number.parseInt(formData.get("size") as string)
//     const featuresJson = formData.get("features") as string
//     const imagesJson = formData.get("images") as string
//     const isPublished = formData.get("isPublished") === "true"

//     // Parse JSON strings
//     const features = featuresJson ? JSON.parse(featuresJson) : []
//     const images = imagesJson ? JSON.parse(imagesJson) : []

//     // Get current room data
//     const { data: currentRoom, error: fetchError } = await supabase
//       .from("rooms")
//       .select("slug, name")
//       .eq("id", id)
//       .single()

//     if (fetchError) {
//       console.error(`Error fetching room with ID ${id}:`, fetchError)
//       throw fetchError
//     }

//     // Generate new slug if name has changed
//     let slug = currentRoom.slug
//     if (name !== currentRoom.name) {
//       slug = await generateUniqueSlug(name, "rooms", "slug", supabase)
//     }

//     // Update room
//     const { data, error } = await supabase
//       .from("rooms")
//       .update({
//         name,
//         slug,
//         description,
//         short_description: shortDescription,
//         base_price: basePrice,
//         discounted_price: discountedPrice,
//         capacity,
//         beds,
//         bathrooms,
//         size,
//         features,
//         images,
//         is_published: isPublished,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id)
//       .select()
//       .single()

//     if (error) {
//       console.error(`Error updating room with ID ${id}:`, error)
//       throw error
//     }

//     revalidatePath("/admin/rooms")
//     revalidatePath("/rooms")
//     revalidatePath(`/rooms/${slug}`)

//     return { success: true, data }
//   } catch (error) {
//     console.error(`Error in updateRoom for ID ${id}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to update room",
//     }
//   }
// }

// // Delete room
// export async function deleteRoom(id: number) {
//   const supabase = createServerSupabaseClient()

//   try {
//     // Get room slug for path revalidation
//     const { data: room, error: fetchError } = await supabase.from("rooms").select("slug").eq("id", id).single()

//     if (fetchError) {
//       console.error(`Error fetching room with ID ${id}:`, fetchError)
//       throw fetchError
//     }

//     // Delete room
//     const { error } = await supabase.from("rooms").delete().eq("id", id)

//     if (error) {
//       console.error(`Error deleting room with ID ${id}:`, error)
//       throw error
//     }

//     revalidatePath("/admin/rooms")
//     revalidatePath("/rooms")
//     if (room?.slug) {
//       revalidatePath(`/rooms/${room.slug}`)
//     }

//     return { success: true }
//   } catch (error) {
//     console.error(`Error in deleteRoom for ID ${id}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to delete room",
//     }
//   }
// }

// // Toggle room publish status
// export async function toggleRoomPublishStatus(id: number, isPublished: boolean) {
//   const supabase = createServerSupabaseClient()

//   try {
//     // Get room slug for path revalidation
//     const { data: room, error: fetchError } = await supabase.from("rooms").select("slug").eq("id", id).single()

//     if (fetchError) {
//       console.error(`Error fetching room with ID ${id}:`, fetchError)
//       throw fetchError
//     }

//     // Update publish status
//     const { error } = await supabase
//       .from("rooms")
//       .update({
//         is_published: isPublished,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id)

//     if (error) {
//       console.error(`Error updating publish status for room with ID ${id}:`, error)
//       throw error
//     }

//     revalidatePath("/admin/rooms")
//     revalidatePath("/rooms")
//     if (room?.slug) {
//       revalidatePath(`/rooms/${room.slug}`)
//     }

//     return { success: true }
//   } catch (error) {
//     console.error(`Error in toggleRoomPublishStatus for ID ${id}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to update publish status",
//     }
//   }
// }


"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { generateUniqueSlug } from "@/lib/utils"

// Get all rooms
export async function getRooms() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching rooms:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getRooms:", error)
    return []
  }
}

// Get published rooms
export async function getPublishedRooms() {
  const supabase = await createServerSupabaseClient()

  try {
    // First, let's log the structure of the rooms table to understand it better
    console.log("Fetching published rooms...")

    const { data, error } = await supabase
      .from("rooms")
      .select(`
        *,
        room_type:room_type_id(id, name),
        rates:room_rates(*),
        features:room_features_junction(
          feature:feature_id(id, name, icon)
        ),
        policies:room_policies(*)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching published rooms:", error)
      throw error
    }

    // Log the first room to see its structure
    if (data && data.length > 0) {
      console.log("First room data structure:", JSON.stringify(data[0], null, 2))
    }

    // Transform the features array to make it easier to work with
    const transformedData =
      data?.map((room) => {
        if (room && room.features) {
          return {
            ...room,
            features: room.features.map((item: any) => item.feature),
          }
        }
        return room
      }) || []

    return transformedData
  } catch (error) {
    console.error("Error in getPublishedRooms:", error)
    return []
  }
}

// Get room by ID
export async function getRoomById(id: number) {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("rooms").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching room with ID ${id}:`, error)
      throw error
    }

    return data
  } catch (error) {
    console.error(`Error in getRoomById for ID ${id}:`, error)
    return null
  }
}

// Get room by slug
export async function getRoomBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()

  try {
    // First get the room
    const { data: room, error } = await supabase
      .from("rooms")
      .select(`
        *,
        room_type:room_type_id(id, name),
        rates:room_rates(*),
        features:room_features_junction(
          feature:feature_id(id, name, icon)
        ),
        policies:room_policies(*)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error(`Error fetching room with slug ${slug}:`, error)
      throw error
    }

    // Log the room data to see its structure
    console.log(`Room data for slug ${slug}:`, JSON.stringify(room, null, 2))

    // Transform the features array to make it easier to work with
    if (room && room.features) {
      room.features = room.features.map((item: any) => item.feature)
    }

    return room
  } catch (error) {
    console.error(`Error in getRoomBySlug for slug ${slug}:`, error)
    throw error
  }
}

// Create room
export async function createRoom(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  try {
    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const shortDescription = formData.get("shortDescription") as string
    const basePrice = Number.parseFloat(formData.get("basePrice") as string)
    const discountedPrice = formData.get("discountedPrice")
      ? Number.parseFloat(formData.get("discountedPrice") as string)
      : null
    const capacity = Number.parseInt(formData.get("capacity") as string)
    const beds = Number.parseInt(formData.get("beds") as string)
    const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
    const size = Number.parseInt(formData.get("size") as string)
    const featuresJson = formData.get("features") as string
    const imagesJson = formData.get("images") as string
    const isPublished = formData.get("isPublished") === "true"

    // Parse JSON strings
    const features = featuresJson ? JSON.parse(featuresJson) : []
    const images = imagesJson ? JSON.parse(imagesJson) : []

    // Generate slug from name
    const slug = await generateUniqueSlug(name, "rooms", "slug", supabase)

    // Create room
    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name,
        slug,
        description,
        short_description: shortDescription,
        base_price: basePrice,
        discounted_price: discountedPrice,
        capacity,
        beds,
        bathrooms,
        size,
        features,
        images,
        is_published: isPublished,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating room:", error)
      throw error
    }

    revalidatePath("/admin/rooms")
    revalidatePath("/rooms")

    return { success: true, data }
  } catch (error) {
    console.error("Error in createRoom:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create room",
    }
  }
}

// Update room
export async function updateRoom(id: number, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  try {
    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const shortDescription = formData.get("shortDescription") as string
    const basePrice = Number.parseFloat(formData.get("basePrice") as string)
    const discountedPrice = formData.get("discountedPrice")
      ? Number.parseFloat(formData.get("discountedPrice") as string)
      : null
    const capacity = Number.parseInt(formData.get("capacity") as string)
    const beds = Number.parseInt(formData.get("beds") as string)
    const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
    const size = Number.parseInt(formData.get("size") as string)
    const featuresJson = formData.get("features") as string
    const imagesJson = formData.get("images") as string
    const isPublished = formData.get("isPublished") === "true"

    // Parse JSON strings
    const features = featuresJson ? JSON.parse(featuresJson) : []
    const images = imagesJson ? JSON.parse(imagesJson) : []

    // Get current room data
    const { data: currentRoom, error: fetchError } = await supabase
      .from("rooms")
      .select("slug, name")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error(`Error fetching room with ID ${id}:`, fetchError)
      throw fetchError
    }

    // Generate new slug if name has changed
    let slug = currentRoom.slug
    if (name !== currentRoom.name) {
      slug = await generateUniqueSlug(name, "rooms", "slug", supabase)
    }

    // Update room
    const { data, error } = await supabase
      .from("rooms")
      .update({
        name,
        slug,
        description,
        short_description: shortDescription,
        base_price: basePrice,
        discounted_price: discountedPrice,
        capacity,
        beds,
        bathrooms,
        size,
        features,
        images,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating room with ID ${id}:`, error)
      throw error
    }

    revalidatePath("/admin/rooms")
    revalidatePath("/rooms")
    revalidatePath(`/rooms/${slug}`)

    return { success: true, data }
  } catch (error) {
    console.error(`Error in updateRoom for ID ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update room",
    }
  }
}

// Delete room
export async function deleteRoom(id: number) {
  const supabase = await createServerSupabaseClient()

  try {
    // Get room slug for path revalidation
    const { data: room, error: fetchError } = await supabase.from("rooms").select("slug").eq("id", id).single()

    if (fetchError) {
      console.error(`Error fetching room with ID ${id}:`, fetchError)
      throw fetchError
    }

    // Delete room
    const { error } = await supabase.from("rooms").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting room with ID ${id}:`, error)
      throw error
    }

    revalidatePath("/admin/rooms")
    revalidatePath("/rooms")
    if (room?.slug) {
      revalidatePath(`/rooms/${room.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in deleteRoom for ID ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete room",
    }
  }
}

// Toggle room publish status
export async function toggleRoomPublishStatus(id: number, isPublished: boolean) {
  const supabase = await createServerSupabaseClient()

  try {
    // Get room slug for path revalidation
    const { data: room, error: fetchError } = await supabase.from("rooms").select("slug").eq("id", id).single()

    if (fetchError) {
      console.error(`Error fetching room with ID ${id}:`, fetchError)
      throw fetchError
    }

    // Update publish status
    const { error } = await supabase
      .from("rooms")
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error(`Error updating publish status for room with ID ${id}:`, error)
      throw error
    }

    revalidatePath("/admin/rooms")
    revalidatePath("/rooms")
    if (room?.slug) {
      revalidatePath(`/rooms/${room.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in toggleRoomPublishStatus for ID ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update publish status",
    }
  }
}
