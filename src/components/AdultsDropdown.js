import { Menu } from '@headlessui/react';
import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

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
    <Menu as='div' className='w-full relative bg-yellow-300'>
      <Menu.Button className='w-full h-full'>{adults}</Menu.Button>
      <Menu.Items
        as='ul'
        className='bg-white shadow-xl absolute w-full flex flex-col p-4 gap-y-4'
      >
        {lis.map((li, index) => {
          return (
            <Menu.Item as='li' key={index}>
              <a
                onClick={() => setAdults(li.name)}
                className='hover:bg-pink-300 hover:text-white w-full'
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
