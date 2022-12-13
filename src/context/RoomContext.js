import React, { createContext, useState } from 'react';
// rooms data
import { roomData } from '../data.js';
// create context
export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);

  const getAdults = (adults) => {
    console.log(`adults ${adults.value}`);
  };

  return (
    <RoomContext.Provider value={{ rooms, getAdults }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
