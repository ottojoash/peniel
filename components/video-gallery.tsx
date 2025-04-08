"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  id: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  category: string
}

interface VideoGalleryProps {
  videos: Video[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video)
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group overflow-hidden rounded-lg border cursor-pointer"
            onClick={() => openVideoModal(video)}
          >
            <div className="relative h-48">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-1">{video.title}</h3>
              <p className="text-muted-foreground text-sm">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          {selectedVideo && (
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => closeVideoModal()}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="aspect-video w-full">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              <div className="p-6 text-white">
                <h3 className="text-xl font-medium mb-2">{selectedVideo.title}</h3>
                <p className="text-white/70 mb-4">{selectedVideo.description}</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>{selectedVideo.duration}</span>
                  <span className="mx-2">•</span>
                  <span>Category: {selectedVideo.category}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

