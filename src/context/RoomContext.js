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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setTotal(Number(adults) + Number(kids));
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRooms = roomData.filter((room) => {
      return room.maxPerson >= total;
    });
    setRooms(newRooms);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        setAdults,
        setKids,
        total,
        setStartDate,
        setEndDate,
        startDate,
        endDate,
        handleSubmit,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
