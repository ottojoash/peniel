import React, { useContext } from 'react';
// components
import BookForm from './components/BookForm';
import HeroSlider from './components/HeroSlider';
// room context
import { RoomContext } from './context/RoomContext';

const App = () => {
  const { rooms } = useContext(RoomContext);
  return (
    <div>
      <HeroSlider />
      <div className='container mx-auto relative'>
        <div className='z-30 w-full max-w-md mx-auto shadow-xl lg:max-w-none lg:mx-0 lg:absolute lg:-top-10 lg:left-0 lg:right-0'>
          <BookForm />
        </div>
        <div className='min-h-[1000px]'>
          {rooms.map((room, index) => {
            return (
              <div key={index}>
                <div>{room.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
