import React from 'react';
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
