// "use server"

// import { createServerSupabaseClient } from "@/lib/supabase"
// import { revalidatePath } from "next/cache"

// // Get all gallery images
// export async function getGalleryImages() {
//   const supabase = createServerSupabaseClient()

//   try {
//     const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false })

//     if (error) throw error

//     return data || []
//   } catch (error) {
//     console.error("Error fetching gallery images:", error)
//     return []
//   }
// }

// // Upload gallery image
// export async function uploadGalleryImage(formData: FormData) {
//   const supabase = createServerSupabaseClient()

//   try {
//     const title = formData.get("title") as string
//     const description = formData.get("description") as string
//     const category = formData.get("category") as string
//     const file = formData.get("file") as File

//     if (!file) {
//       return { success: false, error: "No file provided" }
//     }

//     if (!title) {
//       return { success: false, error: "Title is required" }
//     }

//     // Generate a unique filename
//     const fileExt = file.name.split(".").pop()
//     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
//     const filePath = `gallery/${fileName}`

//     // Upload file to storage
//     const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(filePath, file)

//     if (uploadError) throw uploadError

//     // Get public URL
//     const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(filePath)

//     if (!urlData || !urlData.publicUrl) {
//       throw new Error("Failed to get public URL for uploaded file")
//     }

//     // Save to database
//     const { error: dbError } = await supabase.from("gallery_images").insert({
//       title,
//       description,
//       category,
//       image_url: urlData.publicUrl,
//       storage_path: filePath,
//     })

//     if (dbError) throw dbError

//     revalidatePath("/admin/gallery")
//     revalidatePath("/gallery")

//     return { success: true }
//   } catch (error) {
//     console.error("Error uploading gallery image:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to upload image",
//     }
//   }
// }

// // Update gallery image
// export async function updateGalleryImage(id: number, formData: FormData) {
//   const supabase = createServerSupabaseClient()

//   try {
//     if (!id) {
//       return { success: false, error: "Image ID is required" }
//     }

//     const title = formData.get("title") as string
//     const description = formData.get("description") as string
//     const category = formData.get("category") as string
//     const file = formData.get("file") as File

//     if (!title) {
//       return { success: false, error: "Title is required" }
//     }

//     // Get current image data
//     const { data: currentImage, error: fetchError } = await supabase
//       .from("gallery_images")
//       .select("storage_path, image_url")
//       .eq("id", id)
//       .single()

//     if (fetchError) throw fetchError

//     if (!currentImage) {
//       return { success: false, error: "Image not found" }
//     }

//     let imageUrl = currentImage.image_url
//     let storagePath = currentImage.storage_path

//     // If new file is provided, upload it
//     if (file && file.size > 0) {
//       // Delete old file if it exists
//       if (currentImage.storage_path) {
//         try {
//           await supabase.storage.from("hotel-assets").remove([currentImage.storage_path])
//         } catch (deleteError) {
//           console.error("Error deleting old file:", deleteError)
//           // Continue even if delete fails
//         }
//       }

//       // Generate a unique filename
//       const fileExt = file.name.split(".").pop()
//       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
//       storagePath = `gallery/${fileName}`

//       // Upload new file
//       const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(storagePath, file)

//       if (uploadError) throw uploadError

//       // Get public URL
//       const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(storagePath)

//       if (!urlData || !urlData.publicUrl) {
//         throw new Error("Failed to get public URL for uploaded file")
//       }

//       imageUrl = urlData.publicUrl
//     }

//     // Update database
//     const { error: updateError } = await supabase
//       .from("gallery_images")
//       .update({
//         title,
//         description,
//         category,
//         image_url: imageUrl,
//         storage_path: storagePath,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id)

//     if (updateError) throw updateError

//     revalidatePath("/admin/gallery")
//     revalidatePath("/gallery")

//     return { success: true }
//   } catch (error) {
//     console.error(`Error updating gallery image ${id}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to update image",
//     }
//   }
// }

// // Delete gallery image
// export async function deleteGalleryImage(id: number) {
//   const supabase = createServerSupabaseClient()

//   try {
//     if (!id) {
//       return { success: false, error: "Image ID is required" }
//     }

//     // Get storage path
//     const { data: image, error: fetchError } = await supabase
//       .from("gallery_images")
//       .select("storage_path")
//       .eq("id", id)
//       .single()

//     if (fetchError) throw fetchError

//     if (!image) {
//       return { success: false, error: "Image not found" }
//     }

//     // Delete from storage if path exists
//     if (image.storage_path) {
//       try {
//         await supabase.storage.from("hotel-assets").remove([image.storage_path])
//       } catch (deleteError) {
//         console.error("Error deleting file:", deleteError)
//         // Continue even if storage delete fails
//       }
//     }

//     // Delete from database
//     const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", id)

//     if (dbError) throw dbError

//     revalidatePath("/admin/gallery")
//     revalidatePath("/gallery")

//     return { success: true }
//   } catch (error) {
//     console.error(`Error deleting gallery image ${id}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to delete image",
//     }
//   }
// }

// // Upload room image
// export async function uploadRoomImage(file: File) {
//   const supabase = createServerSupabaseClient()

//   try {
//     if (!file) {
//       return { success: false, error: "No file provided" }
//     }

//     // Generate a unique filename
//     const fileExt = file.name.split(".").pop()
//     const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
//     const filePath = `rooms/${fileName}`

//     // Upload file to storage
//     const { error: uploadError } = await supabase.storage.from("hotel-assets").upload(filePath, file)

//     if (uploadError) throw uploadError

//     // Get public URL
//     const { data: urlData } = supabase.storage.from("hotel-assets").getPublicUrl(filePath)

//     if (!urlData || !urlData.publicUrl) {
//       throw new Error("Failed to get public URL for uploaded file")
//     }

//     return { success: true, url: urlData.publicUrl, path: filePath }
//   } catch (error) {
//     console.error("Error uploading room image:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to upload image",
//     }
//   }
// }

// // Delete room image
// export async function deleteRoomImage(path: string) {
//   const supabase = createServerSupabaseClient()

//   try {
//     if (!path) {
//       return { success: false, error: "No storage path provided" }
//     }

//     // Delete from storage
//     const { error: deleteError } = await supabase.storage.from("hotel-assets").remove([path])

//     if (deleteError) throw deleteError

//     return { success: true }
//   } catch (error) {
//     console.error(`Error deleting room image at ${path}:`, error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to delete image",
//     }
//   }
// }

"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Check if bucket exists and create it if it doesn't
async function ensureBucketExists(supabase: any, bucketName: string) {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets.some((bucket: any) => bucket.name === bucketName)

    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (error) {
        console.error("Error creating bucket:", error)
        return false
      }
      console.log(`Bucket ${bucketName} created successfully`)
    }

    return true
  } catch (error) {
    console.error("Error checking/creating bucket:", error)
    return false
  }
}

// Get all gallery images
export async function getGalleryImages() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching gallery images:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getGalleryImages:", error)
    return []
  }
}

// Upload gallery image
export async function uploadGalleryImage(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const isFeatured = formData.get("is_featured") === "true"
    const file = formData.get("file") as File

    // Validate file
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("Invalid or missing file:", file)
      return {
        success: false,
        error: "Invalid or missing file",
      }
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(supabase, "images")
    if (!bucketExists) {
      throw new Error("Failed to ensure storage bucket exists")
    }

    // Generate a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const fileExt = file.name.split(".").pop() || "jpg" // Add fallback extension
    const storagePath = `gallery/${category}/${fileName}.${fileExt}`

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage.from("images").upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (storageError) {
      console.error("Error uploading image to storage:", storageError)
      throw storageError
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(storagePath)

    // Insert record into gallery_images table
    const { data: galleryData, error: galleryError } = await supabase
      .from("gallery_images")
      .insert([
        {
          title,
          description,
          category,
          is_featured: isFeatured,
          image_url: urlData.publicUrl,
          storage_path: storagePath,
        },
      ])
      .select()

    if (galleryError) {
      console.error("Error inserting gallery image record:", galleryError)
      throw galleryError
    }

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return {
      success: true,
      data: galleryData[0],
    }
  } catch (error) {
    console.error("Error in uploadGalleryImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

// Update gallery image
export async function updateGalleryImage(id: number, formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()

    // Extract form data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const isFeatured = formData.get("is_featured") === "true"
    const file = formData.get("file") as File | null

    // Prepare update data
    const updateData: any = {
      title,
      description,
      category,
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    }

    // If a new file is provided, upload it
    if (file && file instanceof File && file.size > 0) {
      // Get the current image to delete it later
      const { data: currentImage, error: fetchError } = await supabase
        .from("gallery_images")
        .select("storage_path")
        .eq("id", id)
        .single()

      if (fetchError) {
        console.error("Error fetching current image:", fetchError)
        throw fetchError
      }

      // Ensure bucket exists
      const bucketExists = await ensureBucketExists(supabase, "images")
      if (!bucketExists) {
        throw new Error("Failed to ensure storage bucket exists")
      }

      // Generate a unique file name
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      const fileExt = file.name.split(".").pop() || "jpg" // Add fallback extension
      const storagePath = `gallery/${category}/${fileName}.${fileExt}`

      // Upload new file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("images")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (storageError) {
        console.error("Error uploading new image to storage:", storageError)
        throw storageError
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(storagePath)

      // Update data with new image info
      updateData.image_url = urlData.publicUrl
      updateData.storage_path = storagePath

      // Delete old file if it exists
      if (currentImage?.storage_path) {
        const { error: deleteError } = await supabase.storage.from("images").remove([currentImage.storage_path])
        if (deleteError) {
          console.error("Error deleting old image from storage:", deleteError)
          // Continue anyway, as the update is more important
        }
      }
    }

    // Update the gallery image record
    const { data: galleryData, error: galleryError } = await supabase
      .from("gallery_images")
      .update(updateData)
      .eq("id", id)
      .select()

    if (galleryError) {
      console.error("Error updating gallery image record:", galleryError)
      throw galleryError
    }

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return {
      success: true,
      data: galleryData[0],
    }
  } catch (error) {
    console.error("Error in updateGalleryImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    }
  }
}

// Delete gallery image
export async function deleteGalleryImage(id: number) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get the image to delete
    const { data: image, error: fetchError } = await supabase
      .from("gallery_images")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching image to delete:", fetchError)
      throw fetchError
    }

    // Delete from storage if storage_path exists
    if (image?.storage_path) {
      const { error: storageError } = await supabase.storage.from("images").remove([image.storage_path])
      if (storageError) {
        console.error("Error deleting image from storage:", storageError)
        // Continue anyway, as we still want to delete the database record
      }
    }

    // Delete from database
    const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", id)

    if (dbError) {
      console.error("Error deleting image from database:", dbError)
      throw dbError
    }

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteGalleryImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}

// Upload room image
export async function uploadRoomImage(file: File | null, category = "rooms") {
  try {
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("Invalid or missing file:", file)
      return {
        success: false,
        error: "Invalid or missing file",
      }
    }

    const supabase = await createServerSupabaseClient()

    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(supabase, "images")
    if (!bucketExists) {
      throw new Error("Failed to ensure storage bucket exists")
    }

    // Generate a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const fileExt = file.name.split(".").pop() || "jpg" // Add fallback extension
    const storagePath = `${category}/${fileName}.${fileExt}`

    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage.from("images").upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (storageError) {
      console.error("Error uploading room image to storage:", storageError)
      throw storageError
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(storagePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: storagePath,
    }
  } catch (error) {
    console.error("Error in uploadRoomImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}

// Delete room image
export async function deleteRoomImage(storagePath: string) {
  try {
    if (!storagePath) {
      return {
        success: false,
        error: "No storage path provided",
      }
    }

    const supabase = await createServerSupabaseClient()

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("images").remove([storagePath])

    if (storageError) {
      console.error("Error deleting room image from storage:", storageError)
      throw storageError
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteRoomImage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    }
  }
}
