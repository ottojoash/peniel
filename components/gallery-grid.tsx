"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Photo {
  id: number
  src: string
  alt: string
  category: string
}

interface GalleryGridProps {
  photos: Photo[]
}

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    if (!selectedPhoto) return

    const filteredPhotos =
      activeCategory === "all" ? photos : photos.filter((photo) => photo.category === activeCategory)

    const currentIndex = filteredPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredPhotos.length
    } else {
      newIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    }

    setSelectedPhoto(filteredPhotos[newIndex])
  }

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(photos.map((photo) => photo.category)))]

  // Filter photos by category
  const filteredPhotos = activeCategory === "all" ? photos : photos.filter((photo) => photo.category === activeCategory)

  // Calculate dynamic grid spans for a masonry-like effect
  const getGridSpan = (index: number) => {
    // Create a pattern of spans to make the grid more interesting
    const pattern = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ]
    return pattern[index % pattern.length]
  }

  // Format category name for display
  const formatCategoryName = (category: string) => {
    if (category === "all") return "All"
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <>
      <div className="mb-8">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap justify-center">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {formatCategoryName(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No images found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`${getGridSpan(index)} overflow-hidden rounded-lg cursor-pointer group`}
              onClick={() => openLightbox(photo)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{photo.alt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          {selectedPhoto && (
            <div className="relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Share functionality would go here
                    navigator
                      .share?.({
                        title: selectedPhoto.alt,
                        url: selectedPhoto.src,
                      })
                      .catch((err) => console.error("Error sharing:", err))
                  }}
                >
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => closeLightbox()}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="h-[80vh] relative flex items-center justify-center">
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.alt}
                  fill
                  sizes="80vw"
                  className="object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto("prev")
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                  <span className="sr-only">Previous</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigatePhoto("next")
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>

              <div className="p-4 text-white">
                <h3 className="text-lg font-medium">{selectedPhoto.alt}</h3>
                <p className="text-sm text-white/70">Category: {formatCategoryName(selectedPhoto.category)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
