import React from 'react';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper core styles
import 'swiper/css/effect-fade'; // Swiper effect fade styles
// Import required modules
import { EffectFade, Autoplay } from 'swiper';
// Import your images
import Events from '../assets/img/imgss/21.jpg';
import View from '../assets/img/banner/view-back.jpg'
import Room from '../assets/img/banner/wide-angle-bed.jpg'

const Adverts = () => {
  const bannerImages = [
    {
      image: Events,
      alt: 'Event',
    },
    {
      image: View,
      alt: 'View',
    },
    {
      image: Room,
      alt: 'Room',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {bannerImages.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.image}
              alt={slide.alt}
              style={{ width: '1106px', height: '300px' }} // Optional: adjust as needed
              className="object-cover w-full h-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Adverts;
