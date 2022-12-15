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
        <div className='bg-accent/20 mt-4 p-4 shadow-xl lg:absolute lg:-top-10 lg:left-0 lg:right-0 lg:p-0 lg:z-30'>
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
