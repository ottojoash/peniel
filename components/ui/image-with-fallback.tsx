"use client"

import { useState } from "react"
import Image from "next/image"
import type { ImageProps } from "next/image"

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        console.error(`Error loading image: ${src}`)
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
