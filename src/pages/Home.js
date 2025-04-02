import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet'; // For managing the document head

// Lazy-loaded components
const Rooms = lazy(() => import('../components/Rooms'));
const BookForm = lazy(() => import('../components/BookForm'));
const HeroSlider = lazy(() => import('../components/HeroSlider'));
const Attract = lazy(() => import('../components/Attraction'));
const Sfooter = lazy(() => import('../components/Sfooter'));
const Adverts = lazy(() => import('../components/Adverts'));

// Skeleton loader for fallback
const Loader = () => <div className="loader">Loading...</div>;

const Home = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Peniel Beach Hotel | Welcome to Peniel Beach Hotel</title>
        <h1>Peniel Beach Hotel | Welcome to Peniel Beach Hotel</h1>
        <p>Welcome to Peniel Beach Hotel, your perfect getaway destination.</p>
        <meta
          name="description"
          content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!"
        />
        <meta
          name="keywords"
          content="Peniel Beach Hotel, luxury hotel, accommodation, rooms, attractions, book now"
        />
        <meta
          property="og:title"
          content="Peniel Beach Hotel | Welcome to Peniel Beach Hotel"
        />
        <meta
          property="og:description"
          content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!"
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
          content="Peniel Beach Hotel | Welcome to Peniel Beach Hotel"
        />
        <meta
          name="twitter:description"
          content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!"
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
        <div className="container mx-auto relative">
          {/* Booking Form Section */}
          <div className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12">
            <BookForm />
          </div>
        </div>

        {/* Other Sections */}
        <Rooms />
        <Attract />
        <Adverts />
        <Sfooter />
      </Suspense>
    </>
  );
};

export default Home;
