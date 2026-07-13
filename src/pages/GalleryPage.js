import React, { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useSite } from "../context/SiteContext";

const Gallery = lazy(() => import("../components/Gallery"));

const GalleryPage = () => {
  const { settings } = useSite();
  const hotelName = settings.hotelName || "Peniel Beach Hotel";

  return (
    <>
      <Helmet>
        <title>Gallery | {hotelName}</title>
        <meta
          name="description"
          content={`Explore photos and videos of the rooms and experiences at ${hotelName}.`}
        />
        <link rel="canonical" href="https://www.penielbeachotel.com/gallery" />
      </Helmet>

      <section className="min-h-[360px] bg-primary px-4 pt-36 pb-20 text-center text-white flex items-center justify-center">
        <div>
          <div className="font-tertiary uppercase text-accent tracking-[6px] text-sm mb-3">
            Explore Peniel
          </div>
          <h1 className="font-primary text-5xl md:text-6xl">Photo &amp; Video Gallery</h1>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[300px] p-16 text-center">Loading gallery...</div>}>
        <Gallery showEmptyState />
      </Suspense>
    </>
  );
};

export default GalleryPage;
