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
import { useSite } from '../context/SiteContext';
import { imageUrl } from '../api';

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
  const { settings } = useSite();
  let configuredImages = [];
  try {
    configuredImages = JSON.parse(settings.homeHeroImages || '[]').filter(Boolean);
  } catch {}
  const visibleSlides = configuredImages.length
    ? configuredImages.map((bg) => ({
        title: settings.heroTitle || 'Your Hotel For Vacation',
        bg: imageUrl(bg),
        btnText: settings.heroButtonText || 'See our rooms',
      }))
    : slides;
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
      className='heroSlider h-[520px] sm:h-[620px] lg:h-[860px]'
    >
      {visibleSlides.map((slide, index) => {
        const { title, desc, bg, btnText, btnLink } = slide;
        return (
          <SwiperSlide
            className='h-full relative flex justify-center items-center'
            key={index}
            aria-label={`${title} - ${desc}`}
          >
            <div className='z-20 px-5 pt-14 text-center text-white sm:px-8'>
              <div className='mb-4 font-tertiary text-xs uppercase tracking-[4px] sm:text-base sm:tracking-[6px]'>
                {settings.hotelName || 'Peniel Beach Hotel'}
              </div>
              <h1 className='mx-auto mb-7 max-w-[920px] font-primary text-[34px] uppercase leading-[1.12] tracking-[1px] sm:text-[48px] lg:text-[68px] lg:tracking-[2px]'>
                {settings.heroTitle || title}
              </h1>
              <p className='mb-6'>{desc}</p>
              <a href='/rooms' className='btn btn-lg btn-primary mx-auto max-w-[240px]'>
                {settings.heroButtonText || btnText}
              </a>
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
