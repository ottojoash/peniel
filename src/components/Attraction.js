import React from 'react';

// Mock data for attractions with placeholder image URLs
const attractions = [
  {
    id: 1,
    title: 'Our Beaches',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Beach',
  },
  {
    id: 2,
    title: 'Children\'s Play Centre',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Play+Centre',
  },
  {
    id: 3,
    title: 'Our View',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=View',
  },
  {
    id: 4,
    title: 'Events Space',
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Events+Space',
  },
];

const Attract = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-8">Attractions</h2>
      <div className="flex justify-between items-center">
        {attractions.map(attraction => (
          <div key={attraction.id} className="flex-none w-1/4 p-1">
            <div className="bg-white shadow-lg border rounded-lg overflow-hidden">
              <img src={attraction.imageUrl} alt={attraction.title} className="w-full h-auto" />
              <div className="p-2">
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
