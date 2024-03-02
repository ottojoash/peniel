import React from 'react';
import { BsEnvelope } from 'react-icons/bs';

const NameInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value); // Invoke the onChange prop with the new value
  };

  return (
    <div className='relative flex items-center justify-end h-full'>
      <div className='absolute z-10 pr-8'>
      <BsEnvelope className='text-accent text-base' />
      </div>
      <input
        type="names"
        placeholder="Enter your Name"
        value={value}
        onChange={handleInputChange} // Call handleInputChange function on change
        className='w-full h-full'
        required
      />
    </div>
  );
};

export default NameInput;
