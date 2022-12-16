import React, { useContext } from 'react';
// components
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import BookForm from './components/BookForm';
import Rooms from './components/Rooms';

const App = () => {
  return (
    <div>
      <Header />
      <HeroSlider />
      <div className='container mx-auto relative'>
        <div className='bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute lg:-top-12 lg:left-0 lg:right-0 lg:p-0 lg:z-30'>
          <BookForm />
        </div>
      </div>
      <Rooms />
      <div className='min-h-[1000px]'></div>
    </div>
  );
};

export default App;
