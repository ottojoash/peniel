import React, { useContext } from 'react';
// context
import { RoomContext } from '../context/RoomContext';
// components
import AdultsDropdown from './AdultsDropdown';
import KidsDropdown from './KidsDropdown';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

const BookForm = () => {
  const { handleClick } = useContext(RoomContext);
  return (
    <form className='lg:h-[70px] w-full bg-green-100'>
      <div className='flex flex-col w-full h-full lg:flex-row shadow-md'>
        <div className='flex-1 border-r'>
          <CheckIn />
        </div>

        <div className='flex-1 border-r'>
          <CheckOut />
        </div>

        <div className='flex-1 border-r'>
          <AdultsDropdown />
        </div>

        <div className='flex-1 border-r'>
          <KidsDropdown />
        </div>

        <button
          onClick={(e) => handleClick(e)}
          className='bg-accent text-white flex-1 hover:bg-accent-hover transition'
          type='submit'
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default BookForm;
