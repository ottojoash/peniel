import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
import { BsCalendar } from 'react-icons/bs';

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const CheckOut = ({ onChange, value, minDate }) => {
  const [endDate, setEndDate] = useState(null);
  const selected = value === undefined ? endDate : value;

  const handleDateChange = (date) => {
    setEndDate(date); // Update local state
    onChange(date); // Pass selected date to parent component
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '50px', width: '100%', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '0 12px' }}>
      <BsCalendar style={{ position: 'absolute', left: '10px', color: '#6c757d', zIndex: 10 }} />
      <DatePicker
        className='w-full h-full'
        selected={selected || null}
        minDate={minDate || startOfToday()}
        placeholderText='Check out'
        onChange={handleDateChange}
      />
    </div>
  );
};

export default CheckOut;
