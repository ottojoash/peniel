import React, { useEffect, useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";
import { api, imageUrl } from "../api";

const isVideo = (item) =>
  item.mediaType === "video" ||
  /\.(mp4|webm|mov)(?:$|\?)/i.test(item.url || "");

const GalleryMedia = ({ item, className, controls = false }) =>
  isVideo(item) ? (
    <video
      src={imageUrl(item.url)}
      className={className}
      muted={!controls}
      controls={controls}
      autoPlay={controls}
      playsInline
      preload="metadata"
    />
  ) : (
    <img src={imageUrl(item.url)} alt={item.title || "Hotel gallery"} className={className} />
  );

const GalleryGrid = ({ items, onOpen }) => (
  <div className="grid auto-rows-[125px] grid-cols-2 gap-2 sm:auto-rows-[170px] sm:gap-3 lg:auto-rows-[190px] lg:grid-cols-4">
    {items.map((item, index) => (
      <button key={item.id} type="button" onClick={() => onOpen(index)} className={`group relative overflow-hidden rounded-lg text-left ${index === 0 || index === 5 ? "col-span-2 row-span-2" : ""}`}>
        <GalleryMedia item={item} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 text-white sm:bottom-4 sm:left-4"><small className="uppercase tracking-widest">{item.category}</small><strong className="block truncate font-primary text-base sm:text-xl">{item.title}</strong></span>
      </button>
    ))}
  </div>
);

const Gallery = ({ showEmptyState = false, homepagePreview = false }) => {
  const [images, setImages] = useState([]);
  const [content, setContent] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    Promise.all([api("/api/gallery"), api("/api/content")])
      .then(([gallery, copy]) => {
        setImages(gallery);
        setContent(copy);
      })
      .catch(() => {});
  }, []);

  const collections = useMemo(() => {
    const groups = new Map();
    images.forEach((item) => {
      const name = (item.category || "Hotel").trim() || "Hotel";
      const key = name.toLocaleLowerCase();
      if (!groups.has(key)) groups.set(key, { key, name, items: [] });
      groups.get(key).items.push(item);
    });
    return [
      { key: "__all__", name: "All media", items: images },
      ...Array.from(groups.values()),
    ];
  }, [images]);

  const randomPreview = useMemo(() => {
    const shuffled = [...images];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, 5);
  }, [images]);

  const selected = collections.find((group) => group.key === selectedCategory);
  const visibleItems = homepagePreview ? randomPreview : selected?.items || [];
  const active = activeIndex === null ? null : visibleItems[activeIndex];

  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft")
        setActiveIndex((index) => (index - 1 + visibleItems.length) % visibleItems.length);
      if (event.key === "ArrowRight")
        setActiveIndex((index) => (index + 1) % visibleItems.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, visibleItems.length]);

  const chooseCategory = (key) => {
    setSelectedCategory(key);
    setActiveIndex(null);
    window.setTimeout(
      () => document.getElementById("gallery-selection")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };

  if (!images.length && !showEmptyState) return null;

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

        {!images.length ? (
          <div className="rounded-lg border border-black/10 bg-white px-6 py-16 text-center text-gray-500">
            Gallery media will appear here soon.
          </div>
        ) : homepagePreview ? (
          <>
            <GalleryGrid items={visibleItems} onOpen={setActiveIndex} />
            <div className="mt-8 text-center">
              <a href="/gallery" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-7 font-tertiary uppercase tracking-[2px] text-white transition hover:bg-accent">
                View full gallery
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {collections.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => chooseCategory(group.key)}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${selectedCategory === group.key ? "border-accent ring-2 ring-accent/20" : "border-transparent"}`}
                >
                  <GalleryMedia item={group.items[0]} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 text-white sm:inset-x-4 sm:bottom-4">
                    <strong className="block truncate font-primary text-lg sm:text-2xl">{group.name}</strong>
                    <small className="uppercase tracking-wider text-white/75">{group.items.length} {group.items.length === 1 ? "item" : "items"}</small>
                  </span>
                </button>
              ))}
            </div>

            <div id="gallery-selection" className="scroll-mt-24">
              {selected ? (
                <>
                  <div className="mb-5 flex items-end justify-between gap-5 border-b border-black/10 pb-4">
                    <div><p className="text-xs uppercase tracking-[3px] text-accent">Selected collection</p><h3 className="font-primary text-3xl">{selected.name}</h3></div>
                    <span className="text-sm text-gray-500">{visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}</span>
                  </div>
                  <GalleryGrid items={visibleItems} onOpen={setActiveIndex} />
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-black/20 bg-white/50 px-6 py-10 text-center text-gray-500">Choose a gallery collection above to view its photos and videos.</div>
              )}
            </div>
          </>
        )}
      </div>

      {active && (
        <div onClick={() => setActiveIndex(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={active.title || "Gallery media viewer"}>
          <button type="button" onClick={() => setActiveIndex(null)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="Close gallery viewer"><HiX /></button>
          {visibleItems.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex - 1 + visibleItems.length) % visibleItems.length); }} className="absolute left-2 z-20 grid h-12 w-12 place-items-center rounded-full bg-black/50 text-3xl text-white hover:bg-accent sm:left-5" aria-label="Previous media"><HiChevronLeft /></button>}
          <div onClick={(event) => event.stopPropagation()} className="flex max-h-full max-w-[calc(100%-5rem)] flex-col items-center">
            <GalleryMedia item={active} controls className="max-h-[78vh] max-w-full object-contain" />
            <div className="mt-3 max-w-2xl text-center text-white"><strong className="font-primary text-xl sm:text-2xl">{active.title}</strong><p className="mt-1 text-sm text-white/60">{activeIndex + 1} of {visibleItems.length} · {active.category}</p></div>
          </div>
          {visibleItems.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex + 1) % visibleItems.length); }} className="absolute right-2 z-20 grid h-12 w-12 place-items-center rounded-full bg-black/50 text-3xl text-white hover:bg-accent sm:right-5" aria-label="Next media"><HiChevronRight /></button>}
        </div>
      )}
    </section>
  );
};

export default Gallery;
