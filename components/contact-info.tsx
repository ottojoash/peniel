import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Address</h3>
          <p className="text-muted-foreground">Plot 110-120 Circular Road Bugonga</p>
          <p className="text-muted-foreground">Opposite the old Airport, Entebbe</p>
          <p className="text-muted-foreground">Uganda</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Phone</h3>
          <p className="text-muted-foreground">+256 772 485 887</p>
          <p className="text-muted-foreground">+256 752 703 147</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Email</h3>
          <p className="text-muted-foreground">
            <a href="mailto:penielbeachhotel@gmail.com" className="hover:text-primary transition-colors">
              penielbeachhotel@gmail.com
            </a>
          </p>
          <p className="text-muted-foreground">
            <a href="mailto:info@penielbeachhotel.com" className="hover:text-primary transition-colors">
              info@penielbeachhotel.com
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Opening Hours</h3>
          <p className="text-muted-foreground">Reception: 24/7</p>
          <p className="text-muted-foreground">Restaurant: 8:00 AM - 8:00 PM</p>
          <p className="text-muted-foreground">Kids Park: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  )
}

