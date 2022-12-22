import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
// components
import AdultsDropdown from '../components/AdultsDropdown';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import KidsDropdown from '../components/KidsDropdown';
// context
import { RoomContext } from '../context/RoomContext';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms } = useContext(RoomContext);
  const room = rooms.find((room) => {
    return room.id === Number(id);
  });

  return (
    <section className='h-screen'>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/70'></div>
        <h1 className='text-5xl text-white z-20 font-primary text-center'>
          {room.name} Details
        </h1>
      </div>
      <div className='container mx-auto py-8'>
        <div className='flex'>
          <div className='flex-1'>left</div>
          <div className='flex-1'>right</div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
