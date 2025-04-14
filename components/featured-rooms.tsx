"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getPublishedRooms } from "@/app/actions/room-actions"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        const featuredRooms = await getPublishedRooms(3)
        console.log("Featured rooms:", featuredRooms)
        setRooms(featuredRooms)
      } catch (error) {
        console.error("Error fetching featured rooms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  // Debug function to check image data
  const getImageUrl = (room: any) => {
    console.log("Room image data:", room.images)

    if (!room.images) return "/placeholder.svg"

    // Try different ways to access the image
    if (Array.isArray(room.images) && room.images.length > 0) {
      const firstImage = room.images[0]
      console.log("First image:", firstImage)

      // If it's a string URL
      if (typeof firstImage === "string") {
        return firstImage
      }

      // If it's an object with url property
      if (typeof firstImage === "object" && firstImage !== null) {
        if (firstImage.url) return firstImage.url
        if (firstImage.image_url) return firstImage.image_url
        if (firstImage.path) return firstImage.path
      }
    }

    // If images is a string
    if (typeof room.images === "string") {
      return room.images
    }

    // If room has a direct image_url property
    if (room.image_url) {
      return room.image_url
    }

    // Fallback
    return "/placeholder.svg"
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Rooms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience luxury and comfort in our carefully designed rooms and suites, each offering a unique blend of
            elegance and modern amenities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden bg-white">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  // Get price from rates or base price
                  const defaultRate = room.rates?.find((rate: any) => rate.is_default) || room.rates?.[0]
                  const price = defaultRate?.price_per_night || room.base_price || "N/A"

                  // Get image URL with debugging
                  const imageUrl = getImageUrl(room)
                  console.log(`Room ${room.name} image URL:`, imageUrl)

                  return (
                    <div
                      key={room.id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="relative h-64 w-full bg-muted">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={room.name || "Room image"}
                          fill
                          className="object-cover"
                          unoptimized={imageUrl.startsWith("http")}
                          onError={(e) => {
                            console.error(`Error loading image for room ${room.name}:`, e)
                            // @ts-ignore
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {room.short_description || room.description?.substring(0, 100) || "No description available"}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold">
                            ${typeof price === "number" ? price.toFixed(2) : price}
                            <span className="text-sm font-normal text-muted-foreground"> / night</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Max {room.max_occupancy || 2} guests</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Link href={`/rooms/${room.slug}`}>
                            <Button variant="outline">View Details</Button>
                          </Link>
                          <Link href={`/rooms/${room.slug}`}>
                            <Button>Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No rooms available</h3>
                  <p className="text-muted-foreground">Please check back later for our featured rooms.</p>
                </div>
              )}
            </div>

            <div className="text-center mt-12">
              <Link href="/rooms">
                <Button size="lg">View All Rooms</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
