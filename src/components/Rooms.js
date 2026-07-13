import React, { useContext } from 'react';
// context
import { RoomContext } from '../context/RoomContext';
// components
import Room from '../components/Room';
// loader
import { SpinnerDotted } from 'spinners-react';
import { Helmet } from 'react-helmet'; // Import Helmet for managing document head
import { useSite } from '../context/SiteContext';

const Rooms = () => {
  const { settings } = useSite();
  const { rooms, loading } = useContext(RoomContext);

  return (
    <>
    <Helmet>
                <title>Rooms | Peniel Beach Hotel</title>
                <meta name="description" content="Explore our comfortable and luxurious rooms at Peniel Beach Hotel. Book now for a relaxing stay!" />
    </Helmet>
    <section className='py-16 sm:py-20 lg:py-24'>
      {/* overlay & spinner */}
      {loading && (
        <div className='h-screen fixed bottom-0 top-0 bg-black/90 w-full z-50 flex justify-center items-center'>
          <SpinnerDotted color='white' />
        </div>
      )}
      <div className='container mx-auto px-4 sm:px-6 lg:px-[15px]'>
        <div className='text-center'>
          <div className='font-tertiary uppercase text-xs tracking-[4px] sm:text-[15px] sm:tracking-[6px]'>
            {settings.hotelName || 'Hotel'}
          </div>
          <h2 className='mb-7 font-primary text-[36px] sm:text-[45px]'>Rooms & Suites</h2>
        </div>
        {/* grid */}
        <div className='mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]'>
          {rooms.map((room) => {
            return <Room room={room} key={room.id} />;
          })}
        </div>
      </div>
    </section>
    </>
  );
};

export default Rooms;
