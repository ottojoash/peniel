"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// Initialize storage buckets
export async function initializeStorage() {
  const supabase = createServerSupabaseClient()

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return { success: false, error: "Failed to list storage buckets" }
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "images")

    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket("images", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return { success: false, error: "Failed to create storage bucket" }
      }

      console.log("Storage bucket 'images' created successfully")
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing storage:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to initialize storage",
    }
  }
}
