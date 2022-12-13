import React, { useContext } from 'react';
// context
import { RoomContext } from '../context/RoomContext';
import AdultsDropdown from './AdultsDropdown';
import KidsDropdown from './KidsDropdown';

const BookForm = () => {
  const { setStartDate, setEndDate, handleClick } = useContext(RoomContext);
  return (
    <form className='lg:h-[80px] w-full bg-green-100'>
      <div className='flex flex-col bg-pink-200 w-full h-full lg:flex-row'>
        <div className='flex gap-x-4 flex-1'>
          <label htmlFor='checkIn'>Check in</label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            type='date'
            id='checkIn'
          />
        </div>

        <div className='flex gap-x-4 flex-1'>
          <label htmlFor='checkOut'>Check out</label>
          <input
            onChange={(e) => setEndDate(e.target.value)}
            type='date'
            id='checkOut'
          />
        </div>

        <AdultsDropdown />
        <KidsDropdown />

        <button
          onClick={(e) => handleClick(e)}
          className='bg-blue-600 flex-1'
          type='submit'
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default BookForm;
