import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase"
import GalleryGrid from "@/components/gallery-grid"

export const metadata: Metadata = {
  title: "Gallery | Peniel Beach Hotel",
  description: "Browse our gallery of images showcasing our beautiful hotel, rooms, amenities, and surroundings.",
}

// Define the GalleryImage type
interface GalleryImage {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  is_featured?: boolean
}

async function getGalleryImages() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching gallery images:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages()

  // Transform the data for the GalleryGrid component
  const photos = galleryImages.map((image: GalleryImage) => ({
    id: image.id,
    src: image.image_url,
    alt: image.title,
    category: image.category,
  }))

  // Photo gallery data
  const photosOld = {
    all: [
      { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "Hotel exterior view", category: "hotel" },
      { id: 2, src: "/placeholder.svg?height=800&width=600", alt: "Deluxe room interior", category: "rooms" },
      { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "Restaurant dining area", category: "restaurant" },
      { id: 4, src: "/placeholder.svg?height=800&width=800", alt: "Swimming pool", category: "amenities" },
      { id: 5, src: "/placeholder.svg?height=600&width=800", alt: "Kids playing in the park", category: "kids-park" },
      { id: 6, src: "/placeholder.svg?height=800&width=600", alt: "Beach view", category: "beach" },
      { id: 7, src: "/placeholder.svg?height=600&width=800", alt: "Corporate event setup", category: "events" },
      { id: 8, src: "/placeholder.svg?height=800&width=800", alt: "Wedding ceremony", category: "events" },
      { id: 9, src: "/placeholder.svg?height=600&width=800", alt: "Executive suite", category: "rooms" },
      { id: 10, src: "/placeholder.svg?height=800&width=600", alt: "Buffet spread", category: "restaurant" },
      { id: 11, src: "/placeholder.svg?height=600&width=800", alt: "Conference room", category: "amenities" },
      { id: 12, src: "/placeholder.svg?height=800&width=800", alt: "Aerial view of hotel", category: "hotel" },
      { id: 13, src: "/placeholder.svg?height=600&width=800", alt: "Sunset at the beach", category: "beach" },
      {
        id: 14,
        src: "/placeholder.svg?height=800&width=600",
        alt: "Birthday party at kids park",
        category: "kids-park",
      },
      { id: 15, src: "/placeholder.svg?height=600&width=800", alt: "Hotel lobby", category: "hotel" },
    ],
    hotel: [
      { id: 1, src: "/placeholder.svg?height=600&width=800", alt: "Hotel exterior view", category: "hotel" },
      { id: 12, src: "/placeholder.svg?height=800&width=800", alt: "Aerial view of hotel", category: "hotel" },
      { id: 15, src: "/placeholder.svg?height=600&width=800", alt: "Hotel lobby", category: "hotel" },
    ],
    rooms: [
      { id: 2, src: "/placeholder.svg?height=800&width=600", alt: "Deluxe room interior", category: "rooms" },
      { id: 9, src: "/placeholder.svg?height=600&width=800", alt: "Executive suite", category: "rooms" },
    ],
    restaurant: [
      { id: 3, src: "/placeholder.svg?height=600&width=800", alt: "Restaurant dining area", category: "restaurant" },
      { id: 10, src: "/placeholder.svg?height=800&width=600", alt: "Buffet spread", category: "restaurant" },
    ],
    amenities: [
      { id: 4, src: "/placeholder.svg?height=800&width=800", alt: "Swimming pool", category: "amenities" },
      { id: 11, src: "/placeholder.svg?height=600&width=800", alt: "Conference room", category: "amenities" },
    ],
    "kids-park": [
      { id: 5, src: "/placeholder.svg?height=600&width=800", alt: "Kids playing in the park", category: "kids-park" },
      {
        id: 14,
        src: "/placeholder.svg?height=800&width=600",
        alt: "Birthday party at kids park",
        category: "kids-park",
      },
    ],
    beach: [
      { id: 6, src: "/placeholder.svg?height=800&width=600", alt: "Beach view", category: "beach" },
      { id: 13, src: "/placeholder.svg?height=600&width=800", alt: "Sunset at the beach", category: "beach" },
    ],
    events: [
      { id: 7, src: "/placeholder.svg?height=600&width=800", alt: "Corporate event setup", category: "events" },
      { id: 8, src: "/placeholder.svg?height=800&width=800", alt: "Wedding ceremony", category: "events" },
    ],
  }

  // Video gallery data
  const videos = [
    {
      id: 1,
      title: "Hotel Tour",
      description: "Take a virtual tour of our beautiful hotel and facilities",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Hotel+Tour+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "3:45",
      category: "hotel",
    },
    {
      id: 2,
      title: "Wedding at Peniel Beach",
      description: "Highlights from a beautiful beachfront wedding ceremony",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Wedding+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "5:20",
      category: "events",
    },
    {
      id: 3,
      title: "Kids Park Activities",
      description: "Fun and excitement at our kids park",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Kids+Park+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "2:15",
      category: "kids-park",
    },
    {
      id: 4,
      title: "Dining Experience",
      description: "Culinary delights at our restaurant",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Restaurant+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "4:10",
      category: "restaurant",
    },
    {
      id: 5,
      title: "Corporate Event Highlights",
      description: "Recap of a successful business conference",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Corporate+Event+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "6:30",
      category: "events",
    },
    {
      id: 6,
      title: "Beach Activities",
      description: "Enjoy the sun, sand, and water at our beachfront",
      thumbnail: "/placeholder.svg?height=600&width=800&text=Beach+Activities+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder URL
      duration: "3:50",
      category: "beach",
    },
  ]

  return (
    // <main className="flex min-h-screen flex-col">
    //   {/* Hero Section */}
    //   <section className="relative h-[40vh] w-full">
    //     <Image
    //       src="/placeholder.svg?height=800&width=1920"
    //       alt="Peniel Beach Hotel Gallery"
    //       fill
    //       priority
    //       className="object-cover brightness-[0.65]"
    //     />
    //     <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
    //       <Badge className="bg-primary mb-4">Memories</Badge>
    //       <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Photo & Video Gallery</h1>
    //       <p className="text-lg md:text-xl text-white/90 max-w-2xl">
    //         Explore our beautiful hotel, amenities, and memorable events
    //       </p>
    //     </div>
    //   </section>

    //   {/* Main Gallery Section */}
    //   <section className="py-12 px-4 md:px-6">
    //     <div className="max-w-6xl mx-auto">
    //       <Tabs defaultValue="photos" className="w-full">
    //         <div className="flex justify-center mb-8">
    //           <TabsList>
    //             <TabsTrigger value="photos">Photos</TabsTrigger>
    //             <TabsTrigger value="videos">Videos</TabsTrigger>
    //           </TabsList>
    //         </div>

    //         <TabsContent value="photos">
    //           <div className="mb-8">
    //             <Tabs defaultValue="all" className="w-full">
    //               <div className="overflow-x-auto pb-4">
    //                 <TabsList className="inline-flex w-auto h-auto p-1 whitespace-nowrap">
    //                   <TabsTrigger value="all" className="py-2 px-4">
    //                     All Photos
    //                   </TabsTrigger>
    //                   <TabsTrigger value="hotel" className="py-2 px-4">
    //                     Hotel
    //                   </TabsTrigger>
    //                   <TabsTrigger value="rooms" className="py-2 px-4">
    //                     Rooms & Suites
    //                   </TabsTrigger>
    //                   <TabsTrigger value="restaurant" className="py-2 px-4">
    //                     Restaurant
    //                   </TabsTrigger>
    //                   <TabsTrigger value="amenities" className="py-2 px-4">
    //                     Amenities
    //                   </TabsTrigger>
    //                   <TabsTrigger value="kids-park" className="py-2 px-4">
    //                     Kids Park
    //                   </TabsTrigger>
    //                   <TabsTrigger value="beach" className="py-2 px-4">
    //                     Beach
    //                   </TabsTrigger>
    //                   <TabsTrigger value="events" className="py-2 px-4">
    //                     Events
    //                   </TabsTrigger>
    //                 </TabsList>
    //               </div>

    //               <TabsContent value="all" className="mt-6">
    //                 <GalleryGrid photos={photosOld.all} />
    //               </TabsContent>

    //               <TabsContent value="hotel" className="mt-6">
    //                 <GalleryGrid photos={photosOld.hotel} />
    //               </TabsContent>

    //               <TabsContent value="rooms" className="mt-6">
    //                 <GalleryGrid photos={photosOld.rooms} />
    //               </TabsContent>

    //               <TabsContent value="restaurant" className="mt-6">
    //                 <GalleryGrid photos={photosOld.restaurant} />
    //               </TabsContent>

    //               <TabsContent value="amenities" className="mt-6">
    //                 <GalleryGrid photos={photosOld.amenities} />
    //               </TabsContent>

    //               <TabsContent value="kids-park" className="mt-6">
    //                 <GalleryGrid photos={photosOld["kids-park"]} />
    //               </TabsContent>

    //               <TabsContent value="beach" className="mt-6">
    //                 <GalleryGrid photos={photosOld.beach} />
    //               </TabsContent>

    //               <TabsContent value="events" className="mt-6">
    //                 <GalleryGrid photos={photosOld.events} />
    //               </TabsContent>
    //             </Tabs>
    //           </div>
    //         </TabsContent>

    //         <TabsContent value="videos">
    //           <div className="mb-8">
    //             <Tabs defaultValue="all-videos" className="w-full">
    //               <div className="overflow-x-auto pb-4">
    //                 <TabsList className="inline-flex w-auto h-auto p-1 whitespace-nowrap">
    //                   <TabsTrigger value="all-videos" className="py-2 px-4">
    //                     All Videos
    //                   </TabsTrigger>
    //                   <TabsTrigger value="hotel-videos" className="py-2 px-4">
    //                     Hotel
    //                   </TabsTrigger>
    //                   <TabsTrigger value="events-videos" className="py-2 px-4">
    //                     Events
    //                   </TabsTrigger>
    //                   <TabsTrigger value="kids-park-videos" className="py-2 px-4">
    //                     Kids Park
    //                   </TabsTrigger>
    //                   <TabsTrigger value="restaurant-videos" className="py-2 px-4">
    //                     Restaurant
    //                   </TabsTrigger>
    //                   <TabsTrigger value="beach-videos" className="py-2 px-4">
    //                     Beach
    //                   </TabsTrigger>
    //                 </TabsList>
    //               </div>

    //               <TabsContent value="all-videos" className="mt-6">
    //                 <VideoGallery videos={videos} />
    //               </TabsContent>

    //               <TabsContent value="hotel-videos" className="mt-6">
    //                 <VideoGallery videos={videos.filter((video) => video.category === "hotel")} />
    //               </TabsContent>

    //               <TabsContent value="events-videos" className="mt-6">
    //                 <VideoGallery videos={videos.filter((video) => video.category === "events")} />
    //               </TabsContent>

    //               <TabsContent value="kids-park-videos" className="mt-6">
    //                 <VideoGallery videos={videos.filter((video) => video.category === "kids-park")} />
    //               </TabsContent>

    //               <TabsContent value="restaurant-videos" className="mt-6">
    //                 <VideoGallery videos={videos.filter((video) => video.category === "restaurant")} />
    //               </TabsContent>

    //               <TabsContent value="beach-videos" className="mt-6">
    //                 <VideoGallery videos={videos.filter((video) => video.category === "beach")} />
    //               </TabsContent>
    //             </Tabs>
    //           </div>
    //         </TabsContent>
    //       </Tabs>
    //     </div>
    //   </section>

    //   {/* Events Highlight Section */}
    //   <section className="py-16 bg-muted/30 px-4 md:px-6">
    //     <div className="max-w-6xl mx-auto">
    //       <div className="text-center mb-12">
    //         <Badge className="bg-primary mb-4">Special Moments</Badge>
    //         <h2 className="text-3xl md:text-4xl font-serif mb-4">Event Highlights</h2>
    //         <p className="text-muted-foreground max-w-2xl mx-auto">
    //           Memorable events and celebrations hosted at Peniel Beach Hotel
    //         </p>
    //       </div>

    //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    //         <div className="group overflow-hidden rounded-lg border">
    //           <div className="relative h-64">
    //             <Image
    //               src="/placeholder.svg?height=600&width=800&text=Wedding+Event"
    //               alt="Wedding celebration"
    //               fill
    //               className="object-cover transition-transform duration-300 group-hover:scale-105"
    //             />
    //             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    //               <Button variant="outline" className="text-white border-white hover:bg-white/20">
    //                 View Gallery
    //               </Button>
    //             </div>
    //           </div>
    //           <div className="p-4">
    //             <h3 className="text-xl font-medium mb-1">Weddings</h3>
    //             <p className="text-muted-foreground text-sm">Beautiful beachfront ceremonies and receptions</p>
    //           </div>
    //         </div>

    //         <div className="group overflow-hidden rounded-lg border">
    //           <div className="relative h-64">
    //             <Image
    //               src="/placeholder.svg?height=600&width=800&text=Corporate+Event"
    //               alt="Corporate event"
    //               fill
    //               className="object-cover transition-transform duration-300 group-hover:scale-105"
    //             />
    //             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    //               <Button variant="outline" className="text-white border-white hover:bg-white/20">
    //                 View Gallery
    //               </Button>
    //             </div>
    //           </div>
    //           <div className="p-4">
    //             <h3 className="text-xl font-medium mb-1">Corporate Events</h3>
    //             <p className="text-muted-foreground text-sm">Conferences, meetings, and team-building activities</p>
    //           </div>
    //         </div>

    //         <div className="group overflow-hidden rounded-lg border">
    //           <div className="relative h-64">
    //             <Image
    //               src="/placeholder.svg?height=600&width=800&text=Birthday+Celebration"
    //               alt="Birthday celebration"
    //               fill
    //               className="object-cover transition-transform duration-300 group-hover:scale-105"
    //             />
    //             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    //               <Button variant="outline" className="text-white border-white hover:bg-white/20">
    //                 View Gallery
    //               </Button>
    //             </div>
    //           </div>
    //           <div className="p-4">
    //             <h3 className="text-xl font-medium mb-1">Birthday Celebrations</h3>
    //             <p className="text-muted-foreground text-sm">Special birthday parties for all ages</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Instagram Feed Section */}
    //   <section className="py-16 px-4 md:px-6">
    //     <div className="max-w-6xl mx-auto">
    //       <div className="text-center mb-12">
    //         <Badge className="bg-primary mb-4">Social Media</Badge>
    //         <h2 className="text-3xl md:text-4xl font-serif mb-4">Follow Us on Instagram</h2>
    //         <p className="text-muted-foreground max-w-2xl mx-auto">Stay updated with our latest photos and events</p>
    //       </div>

    //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    //         {[1, 2, 3, 4, 5, 6].map((item) => (
    //           <a key={item} href="#" className="group relative aspect-square overflow-hidden rounded-md">
    //             <Image
    //               src={`/placeholder.svg?height=300&width=300&text=Instagram+${item}`}
    //               alt={`Instagram post ${item}`}
    //               fill
    //               className="object-cover transition-transform duration-300 group-hover:scale-110"
    //             />
    //             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    //               <span className="text-white text-sm font-medium">View Post</span>
    //             </div>
    //           </a>
    //         ))}
    //       </div>

    //       <div className="text-center mt-8">
    //         <Button className="bg-primary hover:bg-primary/90">Follow @PenielBeachHotel</Button>
    //       </div>
    //     </section>

    //   {/* Submit Your Photos Section */}
    //   <section className="py-16 bg-primary/10 px-4 md:px-6">
    //     <div className="max-w-6xl mx-auto">
    //       <div className="grid md:grid-cols-2 gap-12 items-center">
    //         <div>
    //           <Badge className="bg-primary mb-4">Share Your Experience</Badge>
    //           <h2 className="text-3xl md:text-4xl font-serif mb-6">Submit Your Photos</h2>
    //           <p className="text-muted-foreground mb-6">
    //             Did you capture some beautiful moments during your stay at Peniel Beach Hotel? Share your photos with us
    //             and they might be featured in our gallery!
    //           </p>
    //           <p className="text-muted-foreground mb-8">
    //             Tag us on social media with #PenielBeachMemories or email your photos to gallery@penielbeachhotel.com
    //           </p>
    //           <div className="flex flex-col sm:flex-row gap-4">
    //             <Button className="bg-primary hover:bg-primary/90">Upload Photos</Button>
    //             <Button variant="outline">Learn More</Button>
    //           </div>
    //         </div>
    //         <div className="relative h-[400px] rounded-lg overflow-hidden">
    //           <Image
    //             src="/placeholder.svg?height=800&width=600&text=Share+Your+Photos"
    //             alt="Share your photos"
    //             fill
    //             className="object-cover"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* CTA Section */}
    //   <section className="py-16 px-4 md:px-6">
    //     <div className="max-w-6xl mx-auto text-center">
    //       <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready to Create Your Own Memories?</h2>
    //       <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
    //         Book your stay at Peniel Beach Hotel and experience the beauty and comfort for yourself
    //       </p>
    //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
    //         <Button size="lg" className="bg-primary hover:bg-primary/90">
    //           Book Now
    //         </Button>
    //         <Button size="lg" variant="outline">
    //           Contact Us
    //         </Button>
    //       </div>
    //     </div>
    //   </section>
    // </main>
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our beautiful hotel through our gallery. Get a glimpse of our comfortable rooms, stunning views,
          delicious food, and exciting activities.
        </p>
      </div>

      <GalleryGrid photos={photos} />
    </div>
  )
}
