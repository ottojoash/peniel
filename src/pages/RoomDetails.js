import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';

const RoomDetails = () => {
  const { id } = useParams();
  const rooms = useContext(RoomContext);
  const room = rooms.rooms.find((room) => {
    return room.id === Number(id);
  });
  console.log(room);
  return <div>{room.name}</div>;
};

export default RoomDetails;
