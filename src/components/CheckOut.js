import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
// css
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
// react icons
import { HiOutlineCalendar } from 'react-icons/hi';

const CheckOut = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className='relative flex items-center justify-end h-full'>
      <div className='absolute z-10 pr-8'>
        <HiOutlineCalendar />
      </div>
      <DatePicker
        className='w-full h-full'
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    </div>
  );
};

export default CheckOut;
