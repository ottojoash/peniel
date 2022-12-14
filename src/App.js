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
        <div className='absolute -top-48 z-50 w-full'>
          <BookForm />
        </div>
        <div>
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
