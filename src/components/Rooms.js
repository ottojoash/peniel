import React, { useContext } from 'react';
// context
import { RoomContext } from '../context/RoomContext';

const Rooms = () => {
  const { rooms } = useContext(RoomContext);
  return (
    <section className='pt-24'>
      <div className='container mx-auto px-0'>
        <div className='text-center'>
          <div className='font-tertiary uppercase text-[15px] tracking-[6px]'>
            Hotel & Spa Adina
          </div>
          <h2 className='font-primary text-[45px] mb-4'>Rooms & Suites</h2>
        </div>
        <div className='grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0'>
          {rooms.map((room) => {
            return (
              <div
                className='bg-white shadow-2xl min-h-[480px] group'
                key={room.id}
              >
                <div className='overflow-hidden'>
                  <img
                    className='group-hover:scale-110 transition-all duration-500'
                    src={room.image}
                    alt=''
                  />
                </div>
                <div className='bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[3px] font-semibold text-[16px]'>
                  <div>
                    Starts from{' '}
                    <span className='text-red-400'>${room.price}</span>/night
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-primary font-semibold tracking-[1px] mb-4'>
                    {room.name}
                  </div>
                  <p className='max-w-[300px] mx-auto'>{room.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
