import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

const BookForm = () => {
  const { setAdults, setKids, setStartDate, setEndDate, handleSubmit } =
    useContext(RoomContext);
  return (
    <form className='py-16 w-full bg-green-100'>
      <div className='flex items-center flex-col lg:flex-row bg-pink-200 max-w-[80%] mx-auto'>
        <div className='flex gap-x-4'>
          <label htmlFor='checkIn'>Check in</label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            type='date'
            id='checkIn'
          />
        </div>

        <div className='flex gap-x-4'>
          <label htmlFor='checkOut'>Check out</label>
          <input
            onChange={(e) => setEndDate(e.target.value)}
            type='date'
            id='checkOut'
          />
        </div>

        <div className='flex gap-x-4'>
          <label htmlFor='adults'>Adults</label>
          <select onChange={(e) => setAdults(e.target.value)} id='adults'>
            <option value='1'>1 Adult</option>
            <option value='2'>2 Adults</option>
            <option value='3'>3 Adults</option>
            <option value='4'>4 Adults</option>
          </select>
        </div>

        <div className='flex gap-x-4'>
          <label htmlFor='kids'>Kids</label>
          <select onChange={(e) => setKids(e.target.value)} id='kids'>
            <option value='0'>0 Kids</option>
            <option value='1'>1 Kid</option>
            <option value='2'>2 Kids</option>
            <option value='3'>3 Kids</option>
            <option value='4'>4 Kids</option>
          </select>
        </div>
      </div>
      <button onClick={(e) => handleSubmit(e)} type='submit'>
        Search
      </button>
    </form>
  );
};

export default BookForm;
