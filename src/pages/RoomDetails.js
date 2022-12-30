import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  // get room
  const room = rooms.find((room) => {
    return room.id === Number(id);
  });

  if (!room) {
    return <div>loading</div>;
  }
  // destructure room
  const { name, description, facilities, maxPerson, image, imageLg, price } =
    room;

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
            <p className='mb-8'>{description}</p>
            <img className='mb-8' src={imageLg} alt='' />
            {/* grid */}
            <div className='mt-12'>
              <h3 className='h3 mb-10'>Facilities</h3>
              <div className='grid grid-cols-3 gap-8'>
                {facilities.map((item, index) => {
                  const { name, icon } = item;
                  return (
                    <div
                      className='flex items-center gap-x-3 flex-1'
                      key={index}
                    >
                      <div className='text-3xl text-accent'>{icon}</div>
                      <div className='text-base'>{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='w-full h-full lg:w-[40%] py-12 px-6 bg-accent/20'>
            <div className='flex flex-col space-y-4 mb-4'>
              <h3 className='h3'>Your Reservation</h3>
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
