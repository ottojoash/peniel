"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    if (!selectedPhoto) return

    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto.id)
    let newIndex

    if (direction === "next") {
      newIndex = (currentIndex + 1) % photos.length
    } else {
      newIndex = (currentIndex - 1 + photos.length) % photos.length
    }

    setSelectedPhoto(photos[newIndex])
  }

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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {photos.map((photo, index) => (
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
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">{photo.alt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                    alert("Share functionality")
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
                <p className="text-sm text-white/70">Category: {selectedPhoto.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

