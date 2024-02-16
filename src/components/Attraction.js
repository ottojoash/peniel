import React from 'react';
import Children from '../assets/img/kids/bouncing.jpg';
import Event from '../assets/img/banner/conference.jpg';
import Beach from '../assets/img/banner/beach.jpg';
import View from '../assets/img/imgss/14.jpg';

// Mock data for attractions with placeholder image URLs
const attractions = [
  {
    id: 1,
    title: 'Beach Access',
    imageUrl: Beach,
  },
  {
    id: 2,
    title: "Children's Play Centre",
    imageUrl: Children,
  },
  {
    id: 3,
    title: 'Our View',
    imageUrl: View,
  },
  {
    id: 4,
    title: 'Conference',
    imageUrl: Event,
  },
];

const Attract = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-8">Attractions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attractions.map(attraction => (
          <div key={attraction.id} className="p-1 flex justify-center">
            <div className="bg-white shadow-lg border rounded-lg overflow-hidden flex flex-col">
              <img src={attraction.imageUrl} alt={attraction.title} className="w-full flex-grow" />
              <div className="p-2 flex-grow flex items-center justify-center">
                <h3 className="font-bold text-center text-md">{attraction.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attract;
