import { notFound } from "next/navigation"
import { getRoomBySlug } from "@/app/actions/room-actions"
import RoomBookingForm from "@/components/room-booking-form"
import ImageWithFallback from "@/components/ui/image-with-fallback"

export default async function RoomDetailPage({ params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const room = await getRoomBySlug(slug)

    if (!room) {
      notFound()
    }

    // Get the image URL with fallbacks
    let imageUrl = "/placeholder.svg?height=800&width=1200"

    // Try different possible image structures
    if (room.images && Array.isArray(room.images) && room.images.length > 0) {
      const firstImage = room.images[0]

      // If it's a string URL
      if (typeof firstImage === "string") {
        imageUrl = firstImage
      }

      // If it's an object with url property
      else if (typeof firstImage === "object" && firstImage !== null) {
        if (firstImage.url) imageUrl = firstImage.url
        else if (firstImage.image_url) imageUrl = firstImage.image_url
        else if (firstImage.path) imageUrl = firstImage.path
      }
    }

    return (
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{room.name}</h1>

            {/* Room Image */}
            <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={imageUrl || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover"
                unoptimized={imageUrl.startsWith("http")}
                fallbackSrc="/placeholder.svg?height=800&width=1200"
              />
            </div>

            {/* Room Description */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p>{room.description || "No description available."}</p>
            </div>

            {/* Room Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="grid grid-cols-2 gap-2">
                {room.features && room.features.length > 0 ? (
                  room.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full"></span>
                      {feature.name}
                    </li>
                  ))
                ) : (
                  <li>No features available.</li>
                )}
              </ul>
            </div>

            {/* Room Policies */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Policies</h2>
              <ul className="space-y-2">
                {room.policies && room.policies.length > 0 ? (
                  room.policies.map((policy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <h3 className="font-medium">{policy.name}</h3>
                        <p className="text-muted-foreground">{policy.description}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No specific policies for this room.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-muted/20 p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-semibold mb-4">Book This Room</h2>
            <RoomBookingForm
              roomId={room.id}
              roomName={room.name}
              basePrice={room.base_price || 0}
              maxGuests={room.max_occupancy || 2}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in RoomDetailPage:", error)
    notFound()
  }
}
