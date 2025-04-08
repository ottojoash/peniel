import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Coffee, Bath, Maximize } from "lucide-react"

export default function FeaturedRooms() {
  const rooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      description: "Spacious room with stunning ocean views and premium amenities.",
      price: 199,
      image: "/placeholder.svg?height=600&width=800",
      features: ["Ocean View", "King Bed", "Free WiFi", "Breakfast"],
      popular: true,
    },
    {
      id: 2,
      name: "Family Suite",
      description: "Perfect for families with separate living area and two bedrooms.",
      price: 299,
      image: "/placeholder.svg?height=600&width=800",
      features: ["Garden View", "2 Bedrooms", "Free WiFi", "Breakfast"],
      popular: false,
    },
    {
      id: 3,
      name: "Standard Room",
      description: "Comfortable room with all essential amenities for a pleasant stay.",
      price: 149,
      image: "/placeholder.svg?height=600&width=800",
      features: ["Garden View", "Queen Bed", "Free WiFi", "Coffee Maker"],
      popular: false,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className="overflow-hidden group">
          <div className="relative h-64">
            <Image
              src={room.image || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {room.popular && <Badge className="absolute top-4 right-4 bg-primary">Popular Choice</Badge>}
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <div className="text-right">
                <span className="text-lg font-bold">${room.price}</span>
                <span className="text-muted-foreground text-sm"> / night</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">{room.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {room.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="bg-muted/50">
                  {feature}
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
              <button className="text-primary font-medium hover:underline">View Details</button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

