import { Menu } from '@headlessui/react';
import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

const lis = [
  {
    name: '0 Kids',
  },
  {
    name: '1 Kid',
  },
  {
    name: '2 Kids',
  },
  {
    name: '3 Kids',
  },
  {
    name: '4 Kids',
  },
];

const KidsDropdown = () => {
  const { kids, setKids } = useContext(RoomContext);
  return (
    <Menu as='div' className='w-full relative bg-green-300'>
      <Menu.Button className='w-full h-full'>
        {kids === '0 Kids' ? 'No Kids' : kids}
      </Menu.Button>
      <Menu.Items
        as='ul'
        className='bg-white shadow-xl absolute w-full flex flex-col p-4 gap-y-4'
      >
        {lis.map((li, index) => {
          return (
            <Menu.Item as='li' key={index}>
              <a
                onClick={() => setKids(li.name)}
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

export default KidsDropdown;
