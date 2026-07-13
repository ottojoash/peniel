import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet'; // For managing the document head
import { useSite } from '../context/SiteContext';

// Lazy-loaded components
const Rooms = lazy(() => import('../components/Rooms'));
const BookForm = lazy(() => import('../components/BookForm'));
const HeroSlider = lazy(() => import('../components/HeroSlider'));
const Sfooter = lazy(() => import('../components/Sfooter'));
const Gallery = lazy(() => import('../components/Gallery'));

// Skeleton loader for fallback
const Loader = () => <div className="loader">Loading...</div>;

const Home = () => {
  const { settings } = useSite();
  const hotelName = settings.hotelName || 'Peniel Beach Hotel';
  const description = settings.aboutText || `Welcome to ${hotelName}.`;
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{hotelName} | Official Website</title>
        <meta
          name="description"
          content={description}
        />
        <meta
          name="keywords"
          content={`${hotelName}, hotel, accommodation, rooms, Entebbe, book now`}
        />
        <meta
          property="og:title"
          content={`${hotelName} | Official Website`}
        />
        <meta
          property="og:description"
          content={description}
        />
        <meta property="og:url" content="https://www.penielbeachotel.com/" />
        <meta
          property="og:image"
          content="https://www.penielbeachotel.com/hero-image.jpg"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${hotelName} | Official Website`}
        />
        <meta
          name="twitter:description"
          content={description}
        />
        <meta
          name="twitter:image"
          content="https://www.penielbeachotel.com/twitter-image.jpg"
        />
        <link rel="canonical" href="https://www.penielbeachotel.com/" />
      </Helmet>

      {/* Main Content */}
      <Suspense fallback={<Loader />}>
        <HeroSlider />
        <div className="container mx-auto relative px-4 sm:px-6 lg:px-[15px]">
          {/* Booking Form Section */}
          <div className="relative z-30 -mt-7 overflow-visible bg-white p-3 shadow-xl sm:-mt-10 sm:p-4 lg:absolute lg:left-[15px] lg:right-[15px] lg:-top-12 lg:mt-0 lg:p-0">
            <BookForm />
          </div>
        </div>

        {/* Other Sections */}
        <Rooms />
        <Gallery />
        <Sfooter />
      </Suspense>
    </>
  );
};

export default Home;
