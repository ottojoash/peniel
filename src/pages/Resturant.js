import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import RestaurantImage from '../assets/img/banner/rest-back.jpeg';
import Fish from '../assets/img/food/fish.jpg';
import BreakFast from '../assets/img/food/breakfast-1.jpg';
import Lunch from '../assets/img/food/break.jpg';
import Fruits from '../assets/img/food/fruits.jpg';
// import Adverts from '../components/Adverts';

const Resturant = () => {
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
    // Add more items as needed
  ];

  return (
    <section>
      <ScrollToTop />
      <Helmet>
        <title>Restaurant | Peniel Beach Hotel</title>
        <meta name="description" content="Explore our delicious restaurant menu with a variety of dishes. Visit us now and enjoy a great dining experience at Peniel Beach Hotel." />
      </Helmet>
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect={'fade'}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className='restaurantSlider'
      >
        <SwiperSlide className='relative'>
          <img src={RestaurantImage} alt='Restaurant' className='object-cover w-full h-screen' style={{ filter: 'brightness(0.3)' }} />
          <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
            <div className='container mx-auto p-6 text-white'>
              <h2 className="text-3xl font-semibold mb-6 text-center">Our Menu</h2>
              <div className="menu-container overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="menu-item relative rounded-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Semi-transparent background */}
                      <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover opacity-100" />
                      <div className="p-4 z-10 relative">
                        <h3 className="text-lg font-bold mb-2 text-white">{item.name}</h3>
                        <p className="text-sm mb-2 text-gray-300">{item.description}</p>
                        <span className="text-md font-semibold text-white">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Resturant;
