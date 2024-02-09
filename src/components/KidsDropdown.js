import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';
import { Menu } from '@headlessui/react';
import { BsChevronDown } from 'react-icons/bs';

const lis = [
  { name: '1 Kid' },
  { name: '2 Kids' },
  { name: '3 Kids' },
  { name: '4 Kids' },
];

const KidsDropdown = ({ onChange, value }) => {
  const { setKids } = useContext(RoomContext);

  // Initialize state with the default value from props
  const [selectedValue, setSelectedValue] = React.useState(value);

  const handleInputChange = (value) => {
    setSelectedValue(value); // Update the local state
    onChange(value); // Invoke the onChange prop with the selected value
    setKids(value); // Optionally, update the local context state
  };

  return (
    <Menu as='div' className='w-full h-full bg-white relative'>
      <Menu.Button className='w-full h-full flex items-center justify-between px-8'>
        {selectedValue === '' || selectedValue === null || selectedValue === undefined
          ? 'No kids'
          : selectedValue}
        <BsChevronDown className='text-base text-accent-hover' />
      </Menu.Button>
      <Menu.Items as='ul' className='bg-white absolute w-full flex flex-col z-40'>
        {lis.map((li, index) => (
          <Menu.Item
            onClick={() => handleInputChange(li.name)}
            as='li'
            className='border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer'
            key={index}
          >
            {li.name}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default KidsDropdown;
