import React from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet for managing document head
// components
import Rooms from '../components/Rooms';
import BookForm from '../components/BookForm';
import HeroSlider from '../components/HeroSlider';
import Attract from '../components/Attraction';
import Sfooter from '../components/Sfooter';
import Adverts from '../components/Adverts';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Peniel Beach Hotel | Welcome to Peniel Beach Hotel</title>
        <meta name="description" content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!" />
        <meta name="keywords" content="Peniel Beach Hotel, luxury hotel, accommodation, rooms, attractions, book now" />
        <meta property="og:title" content="Peniel Beach Hotel | Welcome to Peniel Beach Hotel" />
        <meta property="og:description" content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!" />
        <meta property="og:url" content="https://www.penielbeachotel.com/" />
        <meta property="og:image" content="https://www.penielbeachotel/hero-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Peniel Beach Hotel | Welcome to Peniel Beach Hotel" />
        <meta name="twitter:description" content="Welcome to Peniel Beach Hotel - Enjoy a luxurious stay with our comfortable rooms, exciting attractions, and more. Book now!" />
        <meta name="twitter:image" content="https://twitter.com/PenielHotelEbbs" />
      </Helmet>
      <HeroSlider />
      <div className='container mx-auto relative'>
        <div className='bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12'>
          <BookForm />
        </div>
      </div>
      <Rooms />
      <Attract/>
      <Adverts/>
      <Sfooter/>
    </>
  );
};

export default Home;
