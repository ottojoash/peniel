import React, { createContext, useEffect, useState } from 'react';
// data
import { api, imageUrl } from '../api';
// create context
export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [adults, setAdults] = useState('1 Adult');
  const [kids, setKids] = useState('0 Kids');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/rooms').then((items) => {
      setRooms(items.map((room) => ({ ...room, image: imageUrl(room.image), imageLg: imageUrl(room.imageLg || room.image), images: (room.images || []).map(imageUrl), facilities: (room.facilities || []).map((name) => typeof name === 'string' ? { name } : name) })));
    }).catch(() => setRooms([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setTotal(Number(adults[0]) + Number(kids[0]));
  }, [adults, kids]);

  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    // filter rooms based on total (person)
    const newRooms = rooms.filter((room) => {
      return total <= room.maxPerson;
    });
    setTimeout(() => {
      setRooms(newRooms);
      setLoading(false);
    }, 3000);
  };

  return (
    <RoomContext.Provider
      value={{ rooms, setRooms, adults, setAdults, kids, setKids, handleClick, loading }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
