import Image from "next/image"
import { Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActivityCardProps {
  title: string
  description: string
  imageSrc: string
  ageRange: string
  duration: string
}

export default function ActivityCard({ title, description, imageSrc, ageRange, duration }: ActivityCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">{ageRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">{duration}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          Learn More
        </Button>
      </CardContent>
    </Card>
  )
}

