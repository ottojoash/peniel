import React from 'react';
// import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';
// import swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper';
// images
import Img1 from '../assets/img/heroSlider/1.jpg';
import Img2 from '../assets/img/heroSlider/2.jpg';
import Img3 from '../assets/img/heroSlider/3.jpg';

const slides = [
  {
    title: 'The perfect room for you',
    bg: Img1,
    btnText: 'Rooms & Suites',
  },
  {
    title: 'The perfect room for you',
    bg: Img2,
    btnText: 'Rooms & Suites',
  },
  {
    title: 'The perfect room for you',
    bg: Img3,
    btnText: 'Rooms & Suites',
  },
];

const HeroSlider = () => {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className='heroSlider h-screen'
      >
        {slides.map((slide, index) => {
          return (
            <SwiperSlide
              className='bg-pink-200 h-full flex justify-center items-center'
              key={index}
            >
              {slide.title}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default HeroSlider;
