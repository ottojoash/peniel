import React from 'react';
import styles from './Gallery.module.css';

// Import images from src folder
import img1 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img2 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img3 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img4 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img5 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img6 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img7 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img8 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img9 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img10 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img11 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img12 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img13 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img14 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';
import img15 from '../assets/img/gallery/IMG-20230902-WA0080.jpg';

// Gallery data with categories
const galleryData = [
  { id: 1, category: 'Rooms', imageUrl: img1, description: 'Deluxe Room with modern amenities.' },
  { id: 2, category: 'Rooms', imageUrl: img2, description: 'Comfortable double room.' },
  { id: 3, category: 'Rooms', imageUrl: img3, description: 'Spacious family suite.' },
  { id: 4, category: 'Kids', imageUrl: img3, description: 'Spacious family suite.' },
  { id: 5, category: 'Kids', imageUrl: img3, description: 'Spacious family suite.' },
  { id: 6, category: 'Kids', imageUrl: img3, description: 'Spacious family suite.' },
  { id: 7, category: 'Conference', imageUrl: img4, description: 'State-of-the-art conference hall.' },
  { id: 8, category: 'Conference', imageUrl: img5, description: 'Large meeting room.' },
  { id: 9, category: 'Conference', imageUrl: img6, description: 'Boardroom with video conferencing.' },
  { id: 10, category: 'Food', imageUrl: img7, description: 'Gourmet meals served fresh.' },
  { id: 11, category: 'Food', imageUrl: img8, description: 'Buffet with a variety of dishes.' },
  { id: 12, category: 'Food', imageUrl: img9, description: 'Signature cocktails and drinks.' },
  { id: 13, category: 'Events', imageUrl: img10, description: 'Elegant setup for a wedding event.' },
  { id: 14, category: 'Events', imageUrl: img11, description: 'Corporate event with awards ceremony.' },
  { id: 15, category: 'Events', imageUrl: img12, description: 'Networking event with professionals.' },
  { id: 16, category: 'Rooms', imageUrl: img13, description: 'Luxury penthouse suite.' },
  { id: 17, category: 'Kids', imageUrl: img3, description: 'Spacious family suite.' },
  { id: 18, category: 'Conference', imageUrl: img14, description: 'Interactive seminar setup.' },
  { id: 19, category: 'Food', imageUrl: img15, description: 'Dessert table with sweets.' },
];

// Helper function to group gallery data by category
const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
};

const Gallery = () => {
  const groupedData = groupByCategory(galleryData);

  return (
    <div className={styles.galleryPage}>
      {/* Banner or Header */}
      <section className={styles.banner}>
        <h1>Gallery</h1>
        <p>Explore our rooms, conference halls, events, and more.</p>
      </section>

      {/* Gallery Grid, grouped by category */}
      <section className={styles.galleryGrid}>
        {Object.keys(groupedData).map((category) => (
          <div key={category}>
            <h2>{category}</h2>
            <div className={styles.galleryCategory}>
              {groupedData[category].map((item) => (
                <div key={item.id} className={styles.card}>
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    className={styles.cardImage}
                  />
                  <div className={styles.cardContent}>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Gallery;
