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
  console.log(room);
  return (
    <section>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/60'></div>
        <h1 className='text-5xl text-white z-20 font-primary text-center'>
          {room.name} Details
        </h1>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row bg-purple-200'>
          <div className='lg:w-[70%] bg-pink-200'>
            <h2 className='h3'>{room.name}</h2>
            <p>{room.description}</p>
          </div>
          <div className='lg:w-[30%] bg-blue-200 h-[300px] p-6 flex flex-col'>
            <CheckIn />
            <CheckOut />
            <AdultsDropdown />
            <KidsDropdown />
            <button className='btn btn-primary'>Book Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
