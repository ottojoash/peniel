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
  // destructure room
  const { name, description, facilities, maxPerson, image, price } = room;
  return (
    <section>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/70'></div>
        <h1 className='text-6xl text-white z-20 font-primary text-center'>
          {name} Details
        </h1>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row h-full py-12 gap-x-12'>
          <div className='w-full h-full lg:w-[60%] px-6'>
            <h3 className='h2'>{name}</h3>
            <p>{description}</p>
            <img src={image} alt='' />
            <div className='flex flex-wrap gap-12'>
              {facilities.map((item) => {
                const { name, icon } = item;
                return (
                  <div className='flex items-center gap-x-6 bg-pink-100 w-full max-w-[150px]'>
                    <div>{name}</div>
                    <div className='text-4xl text-accent'>{icon}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='w-full h-full lg:w-[40%] py-12 px-6 bg-accent/20'>
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
