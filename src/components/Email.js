import React from 'react';
import { BsEnvelope } from 'react-icons/bs';

const EmailInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value); // Invoke the onChange prop with the new value
  };

  return (
    <div className='relative flex items-center justify-end h-full'>
      <div className='absolute z-10 pr-8'>
      <BsEnvelope className='text-accent text-base' />
      </div>
      <input
        type="email"
        placeholder="Enter your Email"
        value={value}
        onChange={handleInputChange} // Call handleInputChange function on change
        className='w-full h-full'
        required
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        title="Please enter a valid email address"
      />
    </div>
  );
};

export default EmailInput;
