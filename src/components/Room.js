import React from 'react';
// link
import { Link } from 'react-router-dom';

const Room = ({ room }) => {
  return (
    <div className='bg-white shadow-2xl min-h-[480px] group' key={room.id}>
      <div className='overflow-hidden'>
        <img
          className='group-hover:scale-110 transition-all duration-500 w-full'
          src={room.image}
          alt=''
        />
      </div>
      <div className='bg-white shadow-lg max-w-[260px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[3px] font-semibold text-[16px]'>
        <div>
          Starts from <span className='text-red-400'>${room.price}</span> /
          night
        </div>
      </div>
      <div className='text-center'>
        <div className='h3'>{room.name}</div>
        <p className='max-w-[300px] mx-auto'>{room.description.slice(0, 56)}</p>
      </div>
      <Link to={`/room/${room.id}`}>
        <button className='btn btn-sm btn-secondary'>Book now</button>
      </Link>
    </div>
  );
};

export default Room;
