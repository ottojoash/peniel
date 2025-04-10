import { getRoomBySlug } from "@/app/actions/room-actions"
import RoomBookingForm from "@/components/room-booking-form"
import { Check, Coffee, Utensils, Wifi, Bath, Car, ShowerHeadIcon as SwimmingPool, Wine } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface RoomPageProps {
  params: {
    slug: string
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  // Fetch room data - fix the params.slug error by using params directly
  let room
  try {
    // Access slug directly from params without destructuring
    room = await getRoomBySlug(params.slug)
  } catch (error) {
    console.error("Error fetching room:", error)
    notFound()
  }

  // Check if room has rates before trying to access them
  const defaultRate =
    room.rates && room.rates.length > 0
      ? room.rates.find((rate: any) => rate.is_default) || room.rates[0]
      : { price_per_night: room.base_price || 100, rate_name: "Standard Rate" }

  // Default amenities if none are provided
  const defaultFacilities = [
    { id: 1, name: "WiFi", icon: <Wifi className="h-5 w-5 text-amber-700" /> },
    { id: 2, name: "Coffee", icon: <Coffee className="h-5 w-5 text-amber-700" /> },
    { id: 3, name: "Bath", icon: <Bath className="h-5 w-5 text-amber-700" /> },
    { id: 4, name: "Parking Space", icon: <Car className="h-5 w-5 text-amber-700" /> },
    { id: 5, name: "Kids Swimming Pool", icon: <SwimmingPool className="h-5 w-5 text-amber-700" /> },
    { id: 6, name: "Breakfast", icon: <Utensils className="h-5 w-5 text-amber-700" /> },
    { id: 7, name: "Drinks", icon: <Wine className="h-5 w-5 text-amber-700" /> },
  ]

  const facilities = room.features && room.features.length > 0 ? room.features : defaultFacilities

  // Default hotel rules
  const hotelRules = [
    { id: 1, rule: "Check-in: Any Time" },
    { id: 2, rule: "Check-out: As Per Duration" },
    { id: 3, rule: "No Pets" },
    { id: 4, rule: "No Smoking" },
  ]

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Room Details - Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-900">{room.name}</h1>
            <p className="text-gray-600 mt-1">Accommodates {room.max_occupancy || 2} people.</p>
          </div>

          {/* Room Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
            {room.images && room.images.length > 0 ? (
              <Image
                src={room.images[0].image_url || "/placeholder.svg"}
                alt={room.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/placeholder.svg?height=600&width=800&text=Room+Image"
                alt={room.name}
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          {/* Room Facilities */}
          <div>
            <h2 className="text-xl font-medium mb-4">Room Facilities</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-y-4">
              {facilities.map((facility: any, index: number) => (
                <div key={facility.id || index} className="flex flex-col items-center text-center">
                  <div className="mb-2">{facility.icon || <Coffee className="h-5 w-5 text-amber-700" />}</div>
                  <span className="text-sm text-gray-700">{facility.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Description - Only if available */}
          {(room.description || room.long_description) && (
            <div>
              <h2 className="text-xl font-medium mb-2">Description</h2>
              <p className="text-gray-700">
                {room.description || "Experience luxury and comfort in our beautifully designed room."}
              </p>
              {room.long_description && (
                <div className="mt-2 text-gray-700">
                  <p>{room.long_description}</p>
                </div>
              )}
            </div>
          )}

          {/* Room Gallery - Only if more images available */}
          {room.images && room.images.length > 1 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.images.slice(1).map((image: any, index: number) => (
                  <div key={image.id || index} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.alt_text || `${room.name} image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form - Right Column */}
        <div className="lg:col-span-5">
          <div className="bg-[#f5f2ed] p-6 rounded-md">
            <h2 className="text-lg font-medium mb-4">Your Reservation</h2>
            <RoomBookingForm
              roomId={room.id}
              roomName={room.name}
              basePrice={defaultRate?.price_per_night}
              maxGuests={room.max_occupancy || 2}
            />
          </div>

          {/* Hotel Rules */}
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-4">Hotel Rules</h2>
            <ul className="space-y-2">
              {hotelRules.map((rule) => (
                <li key={rule.id} className="flex items-center">
                  <Check className="h-4 w-4 text-amber-700 mr-2" />
                  <span className="text-gray-700">{rule.rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
