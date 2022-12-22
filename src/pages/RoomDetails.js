import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
// components
import AdultsDropdown from '../components/AdultsDropdown';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import KidsDropdown from '../components/KidsDropdown';
// context
import { RoomContext } from '../context/RoomContext';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms } = useContext(RoomContext);
  const room = rooms.find((room) => {
    return room.id === Number(id);
  });

  return (
    <section>
      <div className='bg-room h-[450px] bg-cover bg-center relative flex justify-center items-center'>
        {/* overlay */}
        <div className='w-full h-full absolute bg-black/70'></div>
        <h1 className='text-5xl text-white z-20 font-primary text-center'>
          {room.name} Details
        </h1>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row h-full py-12'>
          <div className='w-full h-full lg:w-[60%] px-6'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
            architecto blanditiis labore neque. Harum, illo. Ea beatae quidem
            voluptatibus aut accusantium, rerum similique quae excepturi
            corporis dolor minus quibusdam aperiam sequi id voluptates, aliquid,
            fugiat inventore ipsum temporibus tempora quasi. Ab recusandae
            deserunt, eius quaerat sequi fugiat nesciunt eos repudiandae
            similique aut tempora possimus consequatur commodi illo adipisci
            exercitationem esse aspernatur ipsam voluptatem non ut sunt saepe
            quia. Rerum expedita vel quaerat velit, cum autem ex ipsam deleniti
            placeat sint illo ab harum quisquam pariatur quae in atque eaque!
            Perspiciatis, quibusdam. Perferendis minus ducimus ex mollitia
            minima laborum facere! Amet qui consequuntur eligendi ratione harum
            commodi est nulla, mollitia quod dolore, praesentium laudantium
            neque modi facere minima fuga dolorum quam molestiae rerum
            molestias.
          </div>
          <div className='w-full h-full lg:w-[40%] py-12 px-6 bg-accent/20'>
            <div className='flex flex-col space-y-4 mb-4'>
              <div className='h-[60px]'>
                <CheckIn />
              </div>
              <div className='h-[60px]'>
                <CheckOut />
              </div>
              <div className='h-[60px]'>
                <AdultsDropdown />
              </div>
              <div className='h-[60px]'>
                <KidsDropdown />
              </div>
            </div>
            <button className='btn btn-lg btn-primary w-full'>Book now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
