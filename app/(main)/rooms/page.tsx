import Image from "next/image"
import Link from "next/link"
import { Bed, Users, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoomFilters from "@/components/room-filters"
import BookingForm from "@/components/booking-form"
import { getPublishedRooms } from "@/app/actions/room-actions"

export default async function RoomsPage() {
  // Fetch rooms from Supabase
  const rooms = await getPublishedRooms()

  // Extract unique room types for filtering
  const roomTypes = [...new Set(rooms.map((room: { room_type: { name: any } }) => room.room_type?.name || "Other"))]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src="/placeholder.svg?height=800&width=1920"
          alt="Peniel Beach Hotel Rooms"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Rooms & Suites</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Discover our comfortable accommodations designed for your perfect stay
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative z-10 px-4 md:px-0">
        <div className="max-w-6xl mx-auto -mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
          <BookingForm />
        </div>
      </section>

      {/* Room Filters */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <RoomFilters />
        </div>
      </section>

      {/* Room Categories */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Rooms</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              {roomTypes.map((type) => (
                <TabsTrigger key={type} value={type.toLowerCase()}>
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms
                  .filter((room) => room.is_featured)
                  .map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
              </div>
            </TabsContent>

            {roomTypes.map((type) => (
              <TabsContent key={type} value={type.toLowerCase()} className="mt-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms
                    .filter((room) => room.room_type?.name?.toLowerCase() === type.toLowerCase())
                    .map((room) => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif mb-6">Room Policies</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Check-in & Check-out</h3>
                    <p className="text-muted-foreground">Check-in: 2:00 PM, Check-out: 11:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Cancellation Policy</h3>
                    <p className="text-muted-foreground">Free cancellation up to 48 hours before check-in</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Children Policy</h3>
                    <p className="text-muted-foreground">Children under 5 stay free when using existing bedding</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-medium">Pet Policy</h3>
                    <p className="text-muted-foreground">Sorry, pets are not allowed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=600" alt="Hotel lobby" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our rooms and booking process
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Is breakfast included in the room rate?</h3>
              <p className="text-muted-foreground">
                Yes, all our room rates include a complimentary breakfast buffet served from 7:00 AM to 10:00 AM.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Do you offer airport transfers?</h3>
              <p className="text-muted-foreground">
                Yes, we provide airport transfers for an additional fee. Please contact our reception to arrange this
                service.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Is there free WiFi in the rooms?</h3>
              <p className="text-muted-foreground">
                Yes, all our rooms come with complimentary high-speed WiFi access.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Can I request an extra bed in my room?</h3>
              <p className="text-muted-foreground">
                Extra beds are available in select room categories for an additional charge, subject to availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Ready to Book Your Stay?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience comfort and luxury at Peniel Beach Hotel. Book directly for the best rates and special offers.
          </p>
          <Link href="/rooms">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function RoomCard({ room }) {
  return (
    <div className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-64">
        <Image
          src={room.images?.[0]?.image_url || "/placeholder.svg?height=600&width=800"}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {room.is_featured && <Badge className="absolute top-4 right-4 bg-primary">Featured</Badge>}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{room.description?.substring(0, 100)}...</p>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Maximize className="h-4 w-4 text-primary" />
            <span className="text-sm">{room.size || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">Max: {room.max_occupancy} people</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-primary" />
            <span className="text-sm">{room.bed_type || "N/A"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.features?.slice(0, 3).map((feature) => (
            <Badge key={feature.id} variant="outline" className="bg-muted/50">
              {feature.name}
            </Badge>
          ))}
          {room.features?.length > 3 && (
            <Badge variant="outline" className="bg-muted/50">
              +{room.features.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold">
              {room.default_rate
                ? `$${room.default_rate.price_per_night}`
                : room.rates?.[0]
                  ? `$${room.rates[0].price_per_night}`
                  : "Price on request"}
            </span>
            <span className="text-muted-foreground text-sm"> / night</span>
          </div>
          <Link href={`/rooms/${room.slug}`}>
            <Button className="bg-primary hover:bg-primary/90">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
