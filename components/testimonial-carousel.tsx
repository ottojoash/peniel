"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment:
        "The buffet at Peniel Beach Hotel was outstanding! So many delicious options, and the local Ugandan dishes were a highlight. The staff was attentive and friendly.",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "David Chen",
      location: "Toronto, Canada",
      rating: 5,
      comment:
        "We tried the fish and chips, and it was some of the best I've ever had. The fish was fresh and perfectly cooked. Great atmosphere and service too!",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Emma Wilson",
      location: "London, UK",
      rating: 4,
      comment:
        "Lovely restaurant with beautiful views. The beef stew with chapati was delicious and authentic. Would definitely recommend trying the local cuisine here.",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance the carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      next()
    }, 5000)

    return () => clearTimeout(timer)
  }, [current])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-none shadow-md mx-auto max-w-2xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="italic mb-6 text-lg text-muted-foreground">"{testimonial.comment}"</p>
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
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${current === index ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={prev}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={next}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}

