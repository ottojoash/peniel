import React, { createContext, useEffect, useState } from 'react';
// import axios
import axios from 'axios';
// rooms data
import { roomData } from '../data.js';
// create context
export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [adults, setAdults] = useState('1 Adult');
  const [kids, setKids] = useState('0 Kids');
  const [total, setTotal] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_URL + '/rooms?populate=*',
          {
            headers: {
              Authorization: 'bearer ' + process.env.REACT_APP_API_TOKEN,
            },
          }
        );
        console.log(res);
        setRooms(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTotal(Number(adults[0]) + Number(kids[0]));
  });

  const handleClick = (e) => {
    e.preventDefault();
    const newRooms = roomData.filter((room) => {
      return total <= room.maxPerson;
    });
    setRooms(newRooms);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        adults,
        setAdults,
        kids,
        setKids,
        total,
        setStartDate,
        setEndDate,
        startDate,
        endDate,
        handleClick,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;