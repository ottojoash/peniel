import React from 'react';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import Fish from '../assets/img/food/fish.jpg';
import BreakFast from '../assets/img/food/breakfast-1.jpg';
import Lunch from '../assets/img/food/break.jpg';
import Fruits from '../assets/img/food/fruits.jpg';
import BackgroundImage from '../assets/img/banner/rest-back.jpeg';

const Restaurant = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Fish',
      description: 'Comes with fries and salads',
      price: 'UGX 45000',
      imageUrl: Fish,
    },
    {
      id: 2,
      name: 'BreakFast',
      description: 'This is a breakfast buffet',
      price: 'UGX 35000',
      imageUrl: BreakFast,
    },
    {
      id: 3,
      name: 'Lunch',
      description: 'This is a Lunch meal which is a buffet and has a variety of foods',
      price: 'UGX 40000',
      imageUrl: Lunch,
    },
    {
      id: 4,
      name: 'Fruits',
      description: 'These are a variety of fruits from a wide range',
      price: 'UGX 25000',
      imageUrl: Fruits,
    },
    // ... your menu items
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ScrollToTop />
      <Helmet>
        <title>Restaurant | Peniel Beach Hotel</title>
        <meta name="description" content="Explore our delicious restaurant menu with a variety of dishes." />
      </Helmet>

      {/* Main content with background image */}
      <main className="flex-grow relative">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Background image */}
        <div className="absolute inset-0" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center',filter: 'brightness(0.3)' }}></div>
        {/* Content container */}
        <div className="container mx-auto px-4 lg:px-20 pt-20 relative z-10"> {/* Padding to avoid overlapping the header */}
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item bg-black bg-opacity-60 p-4 rounded-lg mb-3 shadow-lg">
                <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-t-lg" /> {/* Image displayed here */}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-semibold">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
     
    </div>
  );
};

export default Restaurant;
