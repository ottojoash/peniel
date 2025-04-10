import { createServerSupabaseClient } from "@/lib/supabase"

// Check if a bucket exists and create it if it doesn't
export async function ensureStorageBucketExists(bucketName: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return false
    }

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return false
      }

      console.log(`Bucket ${bucketName} created successfully`)

      // Set up public access policy for the bucket
      try {
        // This is a simplified approach - in production you might want more granular policies
        const { error: policyError } = await supabase.rpc("create_storage_policy", {
          bucket_name: bucketName,
          policy_name: "Public Access",
          definition: `(bucket_id = '${bucketName}'::text)`,
        })

        if (policyError) {
          console.error("Error setting bucket policy:", policyError)
          // Continue even if policy setting fails
        }
      } catch (policyError) {
        console.error("Error setting bucket policy:", policyError)
        // Continue even if policy setting fails
      }
    }

    return true
  } catch (error) {
    console.error("Error checking/creating bucket:", error)
    return false
  }
}
