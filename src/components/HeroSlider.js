/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
// import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from 'react-helmet';
// import swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
// import required modules
import { EffectFade, Autoplay } from 'swiper';
// images
import hotelview from '../assets/img/banner/rest-side.jpg';
import room from '../assets/img/banner/room-exc.jpg'
import hotelfront from '../assets/img/banner/front-view.jpg'

const slides = [
  {
    title: 'Your  Hotel For Vacation',
    bg: hotelview,
    btnText: 'See our rooms',
  },
  {
    title: 'Your  Hotel For Vacation',
    bg: room,
    btnText: 'See our rooms',
  },
  {
    title: 'Your  Hotel For Vacation',
    bg: hotelfront,
    btnText: 'See our rooms',
  },
];

const HeroSlider = () => {
  return (
    <>
    <Helmet>
        <title>Peniel beach hotel Banner </title>
        <meta name="description" content="Shows pictures of the different parts of the hotel" />
        {/* Add more SEO meta tags as needed */}
    </Helmet>
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect={'fade'}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className='heroSlider h-[600px] lg:h-[860px]'
    >
      {slides.map((slide, index) => {
        const { title, desc, bg, btnText, btnLink } = slide;
        return (
          <SwiperSlide
            className='h-full relative flex justify-center items-center'
            key={index}
            aria-label={`${title} - ${desc}`}
          >
            <div className='z-20 text-white text-center'>
              <div className='uppercase font-tertiary tracking-[6px] mb-5'>
                Peniel Beach Hotel
              </div>
              <h1 className='text-[32px] font-primary uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6'>
                {title}
              </h1>
              <p className='mb-6'>{desc}</p>
              <button className='btn btn-lg btn-primary mx-auto'>
                <a href='/rooms'>{btnText}</a>
              </button>
            </div>
            <img
              className='absolute top-0 object-cover h-full w-full'
              src={bg}
              alt={`${title} - ${desc}`}
            />
            <div className='absolute w-full h-full bg-black/70'></div>
          </SwiperSlide>
        );
      })}
    </Swiper>
    </>
  );
};
export default HeroSlider;
