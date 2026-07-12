import React, { useEffect, useState } from 'react';
import { api, imageUrl } from '../api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [content, setContent] = useState({});
  const [active, setActive] = useState(null);
  useEffect(() => {
    Promise.all([api('/api/gallery'), api('/api/content')]).then(([gallery, copy]) => { setImages(gallery); setContent(copy); }).catch(() => {});
  }, []);
  if (!images.length) return null;
  return <section id="gallery" className="py-24 bg-[#f5f1eb]">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mb-10">
        <div className="font-tertiary uppercase text-accent tracking-[6px] text-sm">{content.galleryEyebrow}</div>
        <h2 className="h2">{content.galleryTitle}</h2>
        <p className="text-lg text-gray-600">{content.galleryIntro}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[190px] gap-3">
        {images.map((item, index) => <button key={item.id} onClick={() => setActive(item)} className={`relative overflow-hidden group text-left ${index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''}`}>
          <img src={imageUrl(item.url)} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 text-white"><small className="uppercase tracking-widest">{item.category}</small><strong className="block font-primary text-xl">{item.title}</strong></span>
        </button>)}
      </div>
    </div>
    {active && <div onClick={() => setActive(null)} className="fixed inset-0 z-[100] bg-black/90 p-6 flex items-center justify-center cursor-zoom-out"><img src={imageUrl(active.url)} alt={active.title} className="max-h-full max-w-full object-contain" /></div>}
  </section>;
};
export default Gallery;
