import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10">
                <Image src="/placeholder.svg?height=40&width=40" alt="Peniel Beach Hotel Logo" width={40} height={40} />
              </div>
              <div className="font-serif text-lg text-primary">Peniel Beach Hotel</div>
            </div>
            <p className="text-muted-foreground mb-6">
              Experience luxury and comfort at our beachfront hotel, where unforgettable memories await.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-muted-foreground hover:text-primary transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/restaurant" className="text-muted-foreground hover:text-primary transition-colors">
                  Restaurant
                </Link>
              </li>
              <li>
                <Link href="/kids-park" className="text-muted-foreground hover:text-primary transition-colors">
                  Kids Park
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">123 Beach Road, Coastal City, State 12345</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+1 (234) 567-8900</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@penielbeachhotel.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Subscribe to our newsletter for special deals and updates.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background" />
              <Button className="bg-primary hover:bg-primary/90 flex-shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Peniel Beach Hotel. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

