import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper';
import { Helmet } from 'react-helmet';
import RestaurantImage from '../assets/img/banner/kidpark.jpg';
import slides from '../assets/img/kids/slides.jpg';
import bouncing from '../assets/img/kids/bouncing.jpg';
import Swimming from '../assets/img/imgss/29.jpg';
import Train from '../assets/img/imgss/30.jpg';
import { useSite } from '../context/SiteContext';
import { imageUrl } from '../api';

const fallbackActivities = [
  { id: 'train', name: 'Caterpillar Train', description: 'A fun ride for kids to enjoy the day.', imageUrl: Train },
  { id: 'castles', name: 'Bouncing Castles', description: 'Kids can jump and have endless fun!', imageUrl: bouncing },
  { id: 'pool', name: 'Swimming Pool', description: 'Safe and enjoyable swimming for kids.', imageUrl: Swimming },
  { id: 'slides', name: 'Slides', description: 'Exciting slides for endless fun.', imageUrl: slides },
];

const parseList = (value) => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Kidspark = () => {
  const { settings } = useSite();
  const configuredActivities = parseList(settings.kidsActivities);
  const activities = configuredActivities.length
    ? configuredActivities.map((item, index) => ({
        ...fallbackActivities[index % fallbackActivities.length],
        ...item,
        imageUrl: item.imageUrl ? imageUrl(item.imageUrl) : fallbackActivities[index % fallbackActivities.length].imageUrl,
      }))
    : fallbackActivities;
  const configuredBackgrounds = parseList(settings.kidsBackgroundImages);
  const backgrounds = configuredBackgrounds.length
    ? configuredBackgrounds.map(imageUrl)
    : [RestaurantImage];
  const title = settings.kidsTitle || 'Fun for every little adventurer';
  const intro = settings.kidsIntro || 'Discover safe, exciting activities created for memorable family days.';

  return (
    <main className="bg-[#f7f3ed]">
      <Helmet>
        <title>Kids Park | {settings.hotelName || 'Peniel Beach Hotel'}</title>
        <meta name="description" content={intro} />
      </Helmet>

      <section className="relative h-[520px] overflow-hidden sm:h-[620px]">
        <Swiper modules={[EffectFade, Autoplay]} effect="fade" loop={backgrounds.length > 1} autoplay={{ delay: 4000, disableOnInteraction: false }} className="h-full">
          {backgrounds.map((background, index) => (
            <SwiperSlide key={`${background}-${index}`} className="relative h-full">
              <img src={background} alt="Kids Park at Peniel Beach Hotel" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 pt-16 text-center text-white">
          <div className="max-w-3xl">
            <p className="mb-3 font-tertiary text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[6px]">Family experiences</p>
            <h1 className="font-primary text-4xl leading-tight sm:text-6xl">{title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{intro}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-[15px]">
        <div className="mb-9 text-center">
          <p className="font-tertiary text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[6px]">Play and discover</p>
          <h2 className="h2">Our activities</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((item, index) => (
            <article key={item.id || index} className="overflow-hidden rounded-xl bg-white shadow-lg">
              <img src={item.imageUrl} alt={item.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-primary text-2xl">{item.name}</h3>
                <p className="mt-2 leading-6 text-gray-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Kidspark;
