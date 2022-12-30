import React from 'react';
// link
import { Link } from 'react-router-dom';
// icons
import { BsArrowsFullscreen, BsPeople } from 'react-icons/bs';

const Room = ({ room }) => {
  // destructure room
  const { id, name, image, size, maxPerson, description, price } = room;
  return (
    <div className='bg-white shadow-2xl min-h-[500px] group' key={id}>
      <div className='overflow-hidden'>
        <img
          className='group-hover:scale-110 transition-all duration-500 w-full'
          src={image}
          alt=''
        />
      </div>
      <div className='bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[1px] font-semibold text-[16px]'>
        <div className='flex justify-between w-[88%]'>
          <div className='flex items-center gap-x-2'>
            <div className='text-accent'>
              <BsArrowsFullscreen className='text-[15px]' />
            </div>
            <div className='flex gap-x-1'>
              <div>Size</div>
              <div>{size}m2</div>
            </div>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='text-accent'>
              <BsPeople className='text-[18px]' />
            </div>
            <div className='flex gap-x-1'>
              <div>Max People</div>
              <div>{maxPerson}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='text-center'>
        <Link to={`/room/${id}`}>
          <div className='h3'>{name}</div>
        </Link>
        <p className='max-w-[300px] mx-auto mb-3 lg:mb-6'>
          {description.slice(0, 56)}
        </p>
      </div>
      <Link
        className='btn btn-sm btn-secondary max-w-[240px] mx-auto'
        to={`/room/${id}`}
      >
        Book now from ${price}
      </Link>
    </div>
  );
};

export default Room;
