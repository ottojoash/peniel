import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
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
    <section>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/60'></div>
        <h1 className='text-5xl text-white z-20 font-primary'>
          Room {room.id} Details
        </h1>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row'>
          <div className='lg:w-[70%] bg-pink-200'>
            <p>{room.description}</p>
          </div>
          <div className='lg:w-[30%] bg-blue-200 h-[300px] p-6 flex flex-col'>
            <CheckIn />
            <CheckOut />
            <AdultsDropdown />
            <KidsDropdown />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;