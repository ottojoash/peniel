import { Wifi, Utensils, Car, PocketIcon as Pool, Dumbbell, Waves, Coffee, Users, Gamepad2 } from "lucide-react"

export default function Amenities() {
  const amenities = [
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Free WiFi",
      description: "High-speed internet throughout the property",
    },
    {
      icon: <Utensils className="h-6 w-6" />,
      title: "Restaurant",
      description: "Fine dining with ocean views",
    },
    {
      icon: <Pool className="h-6 w-6" />,
      title: "Swimming Pool",
      description: "Outdoor pool with lounging area",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "Free Parking",
      description: "Secure on-site parking for guests",
    },
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Fitness Center",
      description: "Modern equipment for your workout",
    },
    {
      icon: <Waves className="h-6 w-6" />,
      title: "Beach Access",
      description: "Direct access to the beach",
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: "Room Service",
      description: "Available 24/7 for your convenience",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Conference Room",
      description: "For business meetings and events",
    },
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Kids Park",
      description: "Fun activities for children",
    },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/30 transition-colors"
        >
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {amenity.icon}
          </div>
          <div>
            <h3 className="font-medium mb-1">{amenity.title}</h3>
            <p className="text-sm text-muted-foreground">{amenity.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

