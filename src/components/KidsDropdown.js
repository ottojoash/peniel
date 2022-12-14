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
    <Menu as='div' className='w-full h-full relative bg-white'>
      <Menu.Button className='w-full h-full'>
        {kids === '0 Kids' ? 'No Kids' : kids}
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
                onClick={() => setKids(li.name)}
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

export default KidsDropdown;
