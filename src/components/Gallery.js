import React, { useEffect, useState } from "react";
import { api, imageUrl } from "../api";

const isVideo = (item) =>
  item.mediaType === "video" ||
  /\.(mp4|webm|mov)(?:$|\?)/i.test(item.url || "");

const Gallery = ({ showEmptyState = false }) => {
  const [images, setImages] = useState([]);
  const [content, setContent] = useState({});
  const [active, setActive] = useState(null);
  useEffect(() => {
    Promise.all([api("/api/gallery"), api("/api/content")])
      .then(([gallery, copy]) => {
        setImages(gallery);
        setContent(copy);
      })
      .catch(() => {});
  }, []);
  return (
    <section id="gallery" className="bg-[#f5f1eb] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-[15px]">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <div className="font-tertiary text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[6px]">
            {content.galleryEyebrow}
          </div>
          <h2 className="h2">{content.galleryTitle}</h2>
          <p className="text-base leading-7 text-gray-600 sm:text-lg">{content.galleryIntro}</p>
        </div>
        {!images.length && showEmptyState ? (
          <div className="rounded-lg border border-black/10 bg-white px-6 py-16 text-center text-gray-500">
            Gallery media will appear here soon.
          </div>
        ) : (
        <div className="grid auto-rows-[125px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:gap-3 lg:auto-rows-[190px] lg:grid-cols-4">
          {images.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className={`relative overflow-hidden group text-left ${index === 0 || index === 5 ? "col-span-2 row-span-2" : ""}`}
            >
              {isVideo(item) ? (
                <video
                  src={imageUrl(item.url)}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={imageUrl(item.url)}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white sm:bottom-4 sm:left-4">
                <small className="uppercase tracking-widest">
                  {item.category}
                </small>
                <strong className="block truncate font-primary text-base sm:text-xl">
                  {item.title}
                </strong>
              </span>
            </button>
          ))}
        </div>
        )}
      </div>
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-3 sm:p-6"
        >
          {isVideo(active) ? (
            <video
              onClick={(e) => e.stopPropagation()}
              src={imageUrl(active.url)}
              className="max-h-full max-w-full"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={imageUrl(active.url)}
              alt={active.title}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
      )}
    </section>
  );
};
export default Gallery;
