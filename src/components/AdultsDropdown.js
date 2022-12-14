import { useContext } from 'react';
// room context
import { RoomContext } from '../context/RoomContext';
// headless ui menu component
import { Menu } from '@headlessui/react';

import { BsChevronDown } from 'react-icons/bs';

const lis = [
  {
    name: '1 Adult',
  },
  {
    name: '2 Adults',
  },
  {
    name: '3 Adults',
  },
  {
    name: '4 Adults',
  },
];

const AdultsDropdown = () => {
  const { adults, setAdults } = useContext(RoomContext);
  return (
    <Menu as='div' className='w-full h-full relative bg-white'>
      <Menu.Button className='w-full h-full flex items-center justify-around'>
        <div>{adults}</div>
        <BsChevronDown className='text-base text-accent-hover' />
      </Menu.Button>
      <Menu.Items as='ul' className='bg-white absolute w-full flex flex-col'>
        {lis.map((li, index) => {
          return (
            <Menu.Item
              as='li'
              className='border-b last-of-type:border-b-0 h-12'
              key={index}
            >
              <a
                onClick={() => setAdults(li.name)}
                className='hover:bg-accent hover:text-white w-full h-full flex justify-center items-center'
                href='#'
              >
                {li.name}
              </a>
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default AdultsDropdown;
