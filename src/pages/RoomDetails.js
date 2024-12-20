/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsArrowRepeat } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';

// Components
import AdultsDropdown from '../components/AdultsDropdown';
import KidsDropdown from '../components/KidsDropdown';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import EmailInput from '../components/Email';
import NotesInput from '../components/Message';
import NameInput from '../components/Name';
import ScrollToTop from '../components/ScrollToTop';

// Context
import { RoomContext } from '../context/RoomContext';

const RoomDetails = () => {
  const { rooms } = useContext(RoomContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the room data based on ID
  const room = rooms.find((room) => room.id === Number(id));
  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl text-red-500">Room not found!</h1>
      </div>
    );
  }

  // Destructure room properties
  const { name, description, facilities, imageLg, price } = room;

  // Form state
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    names: '',
    checkIn: '',
    checkOut: '',
    adults: 0,
    kids: 0,
    price: price,
    email: '',
    type: name,
    notes: '',
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Form submission
  const handleFormSubmit = async () => {
    setIsLoading(true);

    // Validate inputs
    if (!formData.names || !formData.email || !formData.checkIn || !formData.checkOut) {
      alert('Please fill out all required fields.');
      setIsLoading(false);
      return;
    }

    if (!formData.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      alert('Please provide a valid email address.');
      setIsLoading(false);
      return;
    }

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
      navigate('/rooms');
      // Reset form after successful submission
      setFormData({
        names: '',
        checkIn: '',
        checkOut: '',
        adults: 0,
        kids: 0,
        email: '',
        notes: '',
        price: price,
        type: name,
      });
    } catch (error) {
      console.error('Error booking room:', error);
      alert('Failed to book room. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="room-name" itemScope itemType="http://pbh.com/room">
      <ScrollToTop />
      {/* Banner */}
      <div className="bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center">
        <div className="absolute w-full h-full bg-black/70"></div>
        <h1 className="text-6xl text-white z-20 font-primary text-center" id="room-name" itemProp="name">
          {name} Details
        </h1>
      </div>

      {/* Room Details */}
      <div className="container mx-auto py-24 flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full lg:w-[60%] px-6">
          <h2 className="h2">{name}</h2>
          <p className="mb-8" itemProp="description">{description}</p>
          <img className="mb-8" src={imageLg} alt={`Image of ${name}`} itemProp="image" />
          <div>
            <h3 className="h3 mb-3">Room Facilities</h3>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {facilities.map((item, index) => (
                <div className="flex items-center gap-x-3" key={index}>
                  <div className="text-3xl text-accent">{item.icon}</div>
                  <div>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[40%]">
          <div className="py-8 px-6 bg-accent/20 mb-12">
            <h3>Your Reservation</h3>
            <div className="flex flex-col space-y-4 mb-4">
              <NameInput onChange={(value) => handleInputChange('names', value)} />
              <EmailInput onChange={(value) => handleInputChange('email', value)} />
              <CheckIn onChange={(value) => handleInputChange('checkIn', value)} />
              <CheckOut onChange={(value) => handleInputChange('checkOut', value)} />
              <AdultsDropdown onChange={(value) => handleInputChange('adults', value)} />
              <KidsDropdown onChange={(value) => handleInputChange('kids', value)} />
              <NotesInput onChange={(value) => handleInputChange('notes', value)} />
            </div>
            <button
              className="btn btn-lg btn-primary w-full flex justify-center items-center"
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <BsArrowRepeat className="animate-spin mr-2" />
                  Booking...
                </div>
              ) : `Book now for $${price}`}
            </button>
          </div>

          {/* Hotel Rules */}
          <div>
            <h3 className="h3">Hotel Rules</h3>
            <ul className="flex flex-col gap-y-4">
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> Check-in: Any Time
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> Check-out: As Per Duration
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> No Pets
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> No Smoking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
