/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsArrowRepeat } from 'react-icons/bs';

// components
import AdultsDropdown from '../components/AdultsDropdown';
import KidsDropdown from '../components/KidsDropdown';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
// scroll top component
import ScrollToTop from '../components/ScrollToTop';
// context
import { RoomContext } from '../context/RoomContext';
// icons
import { FaCheck } from 'react-icons/fa';
import EmailInput from '../components/Email';

const RoomDetails = () => {
  const { rooms } = useContext(RoomContext);
  const { id } = useParams();
  // get room
  const room = rooms.find((room) => {
    return room.id === Number(id);
  });

  // destructure room
  const { name, description, facilities, imageLg, price } = room;
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 0,
    kids: 0,
    email: '',
    type: name, // Add type field with the name of the room
  });
  const [isLoading, setIsLoading] = useState(false); 

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    console.log('Form Data:', formData); 
    try {
      const response = await fetch('https://peniel-api.onrender.com/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to book room');
      }
      alert('Room booked successfully!');
      // Reset the form here if needed
      setFormData({
        checkIn: '',
        checkOut: '',
        adults: 0,
        kids: 0,
        email: '',
        type: room,
      });
      // if (!response.ok) {
      //   throw new Error('Failed to book room');
      // }
      // alert('Room booked successfully!');
    // } catch (error) {
    //   console.error('Error booking room:', error);
    //   alert('Failed to book room. Please try again later.');
    // }
  } catch (error) {
    console.error('Error booking room:', error);
    alert('Failed to book room. Please try again later.');
  } finally {
    setIsLoading(false); // Stop loading irrespective of the outcome
  }
  };

  return (
    <section aria-labelledby="room-name" itemScope itemType="http://pbh.com/room">
      <ScrollToTop />
      {/* banner */}
      <div className='bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center'>
        {/* overlay */}
        <div className='absolute w-full h-full bg-black/70'></div>
        {/* title */}
        <h1 className='text-6xl text-white z-20 font-primary text-center' id="room-name" itemProp="name">
          {name} Details
        </h1>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row h-full py-24'>
          {/* left */}
          <div className='w-full h-full lg:w-[60%] px-6'>
            <h2 className='h2'>{name}</h2>
             <p className='mb-8' itemProp="description">{description}</p>
            <img className='mb-8' src={imageLg} alt={`Image of ${name}`} itemProp="image" />
            {/* facilities */}
            <div className='mt-12'>
              <h3 className='h3 mb-3'>Room Facilities</h3>
              <p className='mb-12'>
                
              </p>
              {/* grid */}
              <div className='grid grid-cols-3 gap-6 mb-12'>
                {facilities.map((item, index) => {
                  // destructure item
                  const { name, icon } = item;
                  return (
                    <div
                      className='flex items-center gap-x-3 flex-1'
                      key={index}
                    >
                      <div className='text-3xl text-accent'>{icon}</div>
                      <div className='text-base'>{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* right */}
          <div className='w-full h-full lg:w-[40%]'>
            {/* reservation */}
            <div className='py-8 px-6 bg-accent/20 mb-12'>
              <div className='flex flex-col space-y-4 mb-4'>
                <h3>Your Reservation</h3>
                <div className='h-[60px]'>
                  <EmailInput onChange={(value) => handleInputChange('email', value)}/>
                </div>
                <div className='h-[60px]'>
                  <CheckIn onChange={(value) => handleInputChange('checkIn', value)} />
                </div>
                <div className='h-[60px]'>
                  <CheckOut onChange={(value) => handleInputChange('checkOut', value)} />
                </div>
                <div className='h-[60px]'>
                  <AdultsDropdown onChange={(value) => handleInputChange('adults', value)} />
                </div>
                <div className='h-[60px]'>
                  <KidsDropdown onChange={(value) => handleInputChange('kids', value)} />
                </div>
              </div>
              <button className='btn btn-lg btn-primary w-full flex justify-center items-center' onClick={handleFormSubmit} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <BsArrowRepeat className="animate-spin mr-2" />
                    <span>Booking...</span>
                  </div>
                ) : `Book now for $${price}`}
              </button>
            </div>
            {/* rules */}
            <div>
              <h3 className='h3'>Hotel Rules</h3>
              <p className='mb-6'>
                
              </p>
              <ul className='flex flex-col gap-y-4'>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  Check-in: Any Time
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  Check-out: Duration given
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  No Pets
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent' />
                  No Smoking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
