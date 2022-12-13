import React, { createContext, useEffect, useState } from 'react';
// rooms data
import { roomData } from '../data.js';
// create context
export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(kids + adults);
  });

  const getAdults = (adults) => {
    const adultsNum = Number(adults.value);
    setAdults(adultsNum);
  };

  const getKids = (kids) => {
    const kidsNum = Number(kids.value);
    setKids(kidsNum);
  };

  return (
    <RoomContext.Provider value={{ rooms, getAdults, getKids, total }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
