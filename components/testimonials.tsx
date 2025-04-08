import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment:
        "Our stay at Peniel Beach Hotel was absolutely perfect. The staff was attentive, the room was beautiful with an amazing ocean view, and the food at the restaurant was delicious. We'll definitely be back!",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "David Chen",
      location: "Toronto, Canada",
      rating: 5,
      comment:
        "The kids park was a huge hit with our children, giving us some much-needed relaxation time. The beach access is convenient and the rooms are spacious and clean. Highly recommended for families!",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, UK",
      rating: 4,
      comment:
        "Beautiful location with friendly staff. The restaurant offers excellent cuisine with local flavors. The only minor issue was the WiFi being a bit slow, but everything else was perfect.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="italic mb-6 text-muted-foreground">"{testimonial.comment}"</p>
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

