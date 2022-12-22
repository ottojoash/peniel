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
    <section>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/70'></div>
        <h1 className='text-5xl text-white z-20 font-primary text-center'>
          {room.name} Details
        </h1>
      </div>
      <div className='container mx-auto h-screen'>
        <div className='flex flex-col lg:flex-row h-full'>
          <div className='w-full h-full lg:w-[60%] bg-pink-200'>1</div>
          <div className='w-full h-full lg:w-[40%] pt-12 px-6 bg-accent/20'>
            <div className='flex flex-col space-y-4 mb-4'>
              <div className='h-[60px]'>
                <CheckIn />
              </div>
              <div className='h-[60px]'>
                <CheckOut />
              </div>
              <div className='h-[60px]'>
                <AdultsDropdown />
              </div>
              <div className='h-[60px]'>
                <KidsDropdown />
              </div>
            </div>
            <button className='btn btn-lg btn-primary w-full'>Book now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
