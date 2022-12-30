import React from 'react';
// link
import { Link } from 'react-router-dom';
// icons
import { FaUsers, FaExpand } from 'react-icons/fa';
const Room = ({ room }) => {
  return (
    <div className='bg-white shadow-2xl min-h-[500px] group' key={room.id}>
      <div className='overflow-hidden'>
        <img
          className='group-hover:scale-110 transition-all duration-500 w-full'
          src={room.image}
          alt=''
        />
      </div>
      <div className='bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[3px] font-semibold text-[16px]'>
        <div className='flex justify-between w-[80%]'>
          <div>
            Size <span className='text-accent'>{room.size}m2</span>
          </div>
          <div>
            People
            <span className='text-accent'> {room.maxPerson}</span>
          </div>
        </div>
      </div>
      <div className='text-center'>
        <Link to={`/room/${room.id}`}>
          <div className='h3'>{room.name}</div>
        </Link>
        <p className='max-w-[300px] mx-auto mb-3'>
          {room.description.slice(0, 56)}
        </p>
      </div>
      <Link
        className='btn btn-sm btn-secondary max-w-[240px] mx-auto'
        to={`/room/${room.id}`}
      >
        Book now from ${room.price}
      </Link>
    </div>
  );
};

export default Room;
