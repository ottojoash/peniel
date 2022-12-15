import React from 'react';
// import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';
// import swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
// import required modules
import { EffectFade, Autoplay } from 'swiper';
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
        modules={[EffectFade, Autoplay]}
        effect={'fade'}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className='heroSlider h-[600px] lg:h-[860px]'
      >
        {slides.map((slide, index) => {
          return (
            <SwiperSlide
              className='bg-pink-200 h-full flex justify-center items-center relative'
              key={index}
            >
              <h1 className='z-20 text-white text-[32px] font-primary uppercase tracking-[15px] max-w-[920px] lg:text-[55px]  text-center'>
                {slide.title}
              </h1>
              <div className='absolute top-0 w-full h-full'>
                <img
                  className='object-cover h-full w-full'
                  src={slide.bg}
                  alt=''
                />
              </div>
              {/* overlay */}
              <div className='absolute w-full h-full bg-black/70'></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default HeroSlider;
