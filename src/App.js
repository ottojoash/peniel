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
        <div className='absolute -top-10 left-0 right-0 z-50 w-full shadow-xl'>
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
