import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
import { BsCalendar } from 'react-icons/bs';

const CheckInD = ({ onChange }) => {
  const [startDate, setStartDate] = useState(null);

  const handleDateChange = (date) => {
    setStartDate(date); // Update local state
    onChange(date); // Pass selected date to parent component
  };

  return (
    <div className='relative flex items-center justify-end h-full'>
    <div className='absolute z-10 pr-8'>
      <BsCalendar className='text-accent text-base' />
    </div>
      <DatePicker
        className='w-full h-full'
        selected={startDate}
        placeholderText='Check in'
        onChange={handleDateChange}
        
      />
    </div>
  );
};

export default CheckInD;
