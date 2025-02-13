import React, { useContext } from 'react';
// components
import AdultsDropdown from '../components/AdultsDropdown';
import KidsDropdown from '../components/KidsDropdown';
import { RoomContext } from '../context/RoomContext';
import CheckInD from './CheckinD';
import CheckoutD from './CheckoutD';

const BookForm = () => {
  const { handleClick } = useContext(RoomContext);
  return (
    <form className='h-[300px] w-full lg:h-[70px]'>
      <div className='flex flex-col w-full h-full lg:flex-row'>
        <div className='flex-1 border-r'>
          <CheckInD />
        </div>
        <div className='flex-1 border-r'>
          <CheckoutD />
        </div>
        <div className='flex-1 border-r'>
          <AdultsDropdown />
        </div>
        <div className='flex-1 border-r'>
          <KidsDropdown />
        </div>
        {/* btn */}
        <button
          onClick={(e) => handleClick(e)}
          type='submit'
          className='btn btn-primary'
        >
          Check now
        </button>
      </div>
    </form>
  );
};

export default BookForm;
