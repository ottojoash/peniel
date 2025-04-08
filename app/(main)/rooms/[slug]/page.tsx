import { getRoomBySlug } from "@/app/actions/room-actions"
import BookingForm from "@/components/booking-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, Maximize, BedDouble, Check } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface RoomPageProps {
  params: {
    slug: string
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  // Fetch room data
  let room
  try {
    room = await getRoomBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  // Get default rate
  const defaultRate = room.rates.find((rate: any) => rate.is_default) || room.rates[0]

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="outline" className="text-sm">
                {room.room_type.name}
              </Badge>
              {room.is_featured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
            </div>
          </div>

          {/* Room Images */}
          <div className="space-y-4">
            {room.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.images.map((image: any, index: number) => (
                  <div key={image.id} className={index === 0 ? "md:col-span-2" : ""}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.alt_text || room.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=No+Image"
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Room Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-gray-700">{room.description}</p>
            {room.long_description && (
              <div className="prose max-w-none">
                <p>{room.long_description}</p>
              </div>
            )}
          </div>

          {/* Room Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.features.map((feature: any) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Policies */}
          {room.policies.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Policies</h2>
              <ul className="space-y-2">
                {room.policies.map((policy: any) => (
                  <li key={policy.id} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{policy.policy_text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ${defaultRate?.price_per_night}
                    <span className="text-sm font-normal text-gray-500"> / night</span>
                  </span>
                  <Badge variant="outline" className="text-sm">
                    {defaultRate?.rate_name || "Standard Rate"}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Max {room.max_occupancy} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Maximize className="h-5 w-5 text-gray-500" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BedDouble className="h-5 w-5 text-gray-500" />
                    <span>{room.bed_type}</span>
                  </div>
                </div>

                <Separator />

                <BookingForm roomId={room.id} roomName={room.name} defaultPrice={defaultRate?.price_per_night} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

