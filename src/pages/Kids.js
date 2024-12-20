import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import RestaurantImage from '../assets/img/banner/kidpark.jpg';
import slides from '../assets/img/kids/slides.jpg';
import bouncing from '../assets/img/kids/bouncing.jpg';
import Swimming from '../assets/img/imgss/29.jpg';
import Train from '../assets/img/imgss/30.jpg';

const Kidspark = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Caterpillar Train',
      description: 'A fun ride for kids to enjoy the day.',
      imageUrl: Train,
    },
    {
      id: 2,
      name: 'Bouncing Castles',
      description: 'Kids can jump and have endless fun!',
      imageUrl: bouncing,
    },
    {
      id: 3,
      name: 'Swimming Pool',
      description: 'Safe and enjoyable swimming for kids.',
      imageUrl: Swimming,
    },
    {
      id: 4,
      name: 'Slides',
      description: 'Exciting slides for endless fun.',
      imageUrl: slides,
    },
  ];

  return (
    <section>
      <ScrollToTop />
      <Helmet>
        <title>Activities | Peniel Beach Hotel</title>
        <meta
          name="description"
          content="Explore our fun and engaging kids' activities at Peniel Beach Hotel. Caterpillar Train, Bouncing Castles, Swimming Pool, and Slides await your little ones. Visit us now and enjoy a memorable experience."
        />
      </Helmet>
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="restaurantSlider"
      >
        <SwiperSlide className="relative">
          <img
            src={RestaurantImage}
            alt="Kids Park"
            className="object-cover w-full h-screen"
            style={{ filter: 'brightness(0.3)' }}
          />
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="container mx-auto p-6 text-white">
              <h2 className="text-3xl font-semibold mb-6 text-center">Our Activities</h2>
              <div className="menu-container overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="menu-item relative bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4 z-10 relative">
                        <h3 className="text-lg font-bold mb-2 text-white">{item.name}</h3>
                        <p className="text-sm mb-2 text-gray-300">{item.description}</p>
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

export default Kidspark;
