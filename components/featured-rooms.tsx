import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Coffee, Bath, Maximize } from "lucide-react"
import { getPublishedRooms } from "@/app/actions/room-actions"

export default async function FeaturedRooms() {
  // Fetch rooms from Supabase
  const allRooms = await getPublishedRooms()

  // Get featured rooms or the first 3 rooms if no featured rooms
  const featuredRooms =
    allRooms.filter((room) => room.is_featured).length > 0
      ? allRooms.filter((room) => room.is_featured).slice(0, 3)
      : allRooms.slice(0, 3)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRooms.map((room) => {
        // Debug: Log each room's images
        console.log(`Room ${room.id} images:`, room.images)

        // Get the image URL with fallbacks
        let imageUrl = "/placeholder.svg?height=600&width=800"

        // Try different possible image structures
        if (room.images && room.images.length > 0) {
          // Check if images is an array of objects with url property
          if (room.images[0].url) {
            imageUrl = room.images[0].url
          }
          // Check if images is an array of strings
          else if (typeof room.images[0] === "string") {
            imageUrl = room.images[0]
          }
        }

        return (
          <Card key={room.id} className="overflow-hidden group">
            <div className="relative h-64">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized={imageUrl.startsWith("http")} // Skip optimization for external URLs
              />
              {room.is_featured && <Badge className="absolute top-4 right-4 bg-primary">Popular Choice</Badge>}
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <div className="text-right">
                  <span className="text-lg font-bold">
                    $
                    {room.default_rate?.price_per_night || room.rates?.[0]?.price_per_night || room.base_price || "N/A"}
                  </span>
                  <span className="text-muted-foreground text-sm"> / night</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {room.short_description || room.description?.substring(0, 100) || "No description available"}...
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.features?.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50">
                    {feature.name}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <Wifi className="h-5 w-5 text-muted-foreground" />
                  <Coffee className="h-5 w-5 text-muted-foreground" />
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                </div>
                <Link href={`/rooms/${room.slug}`} className="text-primary font-medium hover:underline">
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
