import React, { useContext } from 'react';
// components
import BookForm from './components/BookForm';
// room context
import { RoomContext } from './context/RoomContext';

const App = () => {
  const { rooms } = useContext(RoomContext);
  return (
    <div className='container mx-auto'>
      <BookForm />

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
  );
};

export default App;
