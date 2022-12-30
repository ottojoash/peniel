import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
// css
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
// react icons
import { BsCalendar } from 'react-icons/bs';

const CheckOut = () => {
  const [startDate, setStartDate] = useState(false);
  return (
    <div className='relative flex items-center justify-end h-full'>
      <div className='absolute z-10 pr-8'>
        <BsCalendar className='text-accent text-base' />
      </div>
      <DatePicker
        className='w-full h-full'
        selected={startDate}
        placeholderText='Check out'
        onChange={(date) => setStartDate(date)}
      />
    </div>
  );
};

export default CheckOut;
