"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get all gallery images
export async function getGalleryImages() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

// Upload gallery image
export async function uploadGalleryImage(formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (!title) {
      return { success: false, error: "Title is required" }
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `gallery/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file")
    }

    // Save to database
    const { error: dbError } = await supabase.from("gallery_images").insert({
      title,
      description,
      category,
      image_url: urlData.publicUrl,
      storage_path: filePath,
    })

    if (dbError) throw dbError

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return { success: true }
  } catch (error) {
    console.error("Error uploading gallery image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

// Update gallery image
export async function updateGalleryImage(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    if (!id) {
      return { success: false, error: "Image ID is required" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const file = formData.get("file") as File

    if (!title) {
      return { success: false, error: "Title is required" }
    }

    // Get current image data
    const { data: currentImage, error: fetchError } = await supabase
      .from("gallery_images")
      .select("storage_path, image_url")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (!currentImage) {
      return { success: false, error: "Image not found" }
    }

    let imageUrl = currentImage.image_url
    let storagePath = currentImage.storage_path

    // If new file is provided, upload it
    if (file && file.size > 0) {
      // Delete old file if it exists
      if (currentImage.storage_path) {
        try {
          await supabase.storage.from("hotel-assets").remove([currentImage.storage_path])
        } catch (deleteError) {
          console.error("Error deleting old file:", deleteError)
          // Continue even if delete fails
        }
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      storagePath = `gallery/${fileName}`

      // Upload new file
      const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(storagePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(storagePath)

      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file")
      }

      imageUrl = urlData.publicUrl
    }

    // Update database
    const { error: updateError } = await supabase
      .from("gallery_images")
      .update({
        title,
        description,
        category,
        image_url: imageUrl,
        storage_path: storagePath,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return { success: true }
  } catch (error) {
    console.error(`Error updating gallery image ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    }
  }
}

// Delete gallery image
export async function deleteGalleryImage(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    if (!id) {
      return { success: false, error: "Image ID is required" }
    }

    // Get storage path
    const { data: image, error: fetchError } = await supabase
      .from("gallery_images")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (!image) {
      return { success: false, error: "Image not found" }
    }

    // Delete from storage if path exists
    if (image.storage_path) {
      try {
        await supabase.storage.from("hotel-assets").remove([image.storage_path])
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError)
        // Continue even if storage delete fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", id)

    if (dbError) throw dbError

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return { success: true }
  } catch (error) {
    console.error(`Error deleting gallery image ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}

//
error: error instanceof Error ? error.message : "Failed to delete image"
\
    }
  }
}

// Upload room image
export async function uploadRoomImage(file: File) {
  const supabase = createServerSupabaseClient()

  try {
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `rooms/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file")
    }

    return { success: true, url: urlData.publicUrl, path: filePath }
  } catch (error) {
    console.error("Error uploading room image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

// Delete room image
export async function deleteRoomImage(path: string) {
  const supabase = createServerSupabaseClient()

  try {
    if (!path) {
      return { success: false, error: "No storage path provided" }
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage.from("hotel-assets").remove([path])

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error(`Error deleting room image at ${path}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}

