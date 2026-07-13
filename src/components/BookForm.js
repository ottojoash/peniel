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
    <form className='w-full'>
      <div className='grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'>
        <div className='h-14 border-b sm:border-r lg:h-[70px] lg:border-b-0'>
          <CheckInD />
        </div>
        <div className='h-14 border-b lg:h-[70px] lg:border-b-0 lg:border-r'>
          <CheckoutD />
        </div>
        <div className='h-14 border-b sm:border-r lg:h-[70px] lg:border-b-0'>
          <AdultsDropdown />
        </div>
        <div className='h-14 border-b lg:h-[70px] lg:border-b-0 lg:border-r'>
          <KidsDropdown />
        </div>
        {/* btn */}
        <button
          onClick={(e) => handleClick(e)}
          type='submit'
          className='btn btn-primary h-14 sm:col-span-2 lg:col-span-1 lg:h-[70px]'
        >
          Check now
        </button>
      </div>
    </form>
  );
};

export default BookForm;
