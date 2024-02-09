import React from 'react';

const KidsPark = () => {
  // Placeholder images for the banner
  const bannerImages = [
    'https://via.placeholder.com/1024x300.png?text=Kids+Park',
    'https://via.placeholder.com/1024x300.png?text=Fun+Activities',
    'https://via.placeholder.com/1024x300.png?text=Exciting+Events',
  ];

  // Placeholder data for events at the kids' park
  const events = [
    { id: 1, title: 'Face Painting', imageUrl: 'https://via.placeholder.com/150.png?text=Face+Painting' },
    { id: 2, title: 'Magic Show', imageUrl: 'https://via.placeholder.com/150.png?text=Magic+Show' },
    { id: 3, title: 'Treasure Hunt', imageUrl: 'https://via.placeholder.com/150.png?text=Treasure+Hunt' },
    { id: 4, title: 'Balloon Animals', imageUrl: 'https://via.placeholder.com/150.png?text=Balloon+Animals' },
    { id: 5, title: 'Puppet Show', imageUrl: 'https://via.placeholder.com/150.png?text=Puppet+Show' },
    { id: 6, title: 'Storytelling', imageUrl: 'https://via.placeholder.com/150.png?text=Storytelling' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner placeholder */}
      <div className="overflow-hidden relative w-full mb-8">
        {/* Add your JavaScript library or custom CSS for the moving effect */}
        <div className="flex">
          {bannerImages.map((image, index) => (
            <img key={index} src={image} alt={`Banner ${index + 1}`} className="block w-full h-auto" />
          ))}
        </div>
      </div>

      {/* Events at the kids' park */}
      <div>
        <h2 className="text-xl md:text-3xl font-semibold text-center mb-6">Events at the Kids' Park</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{event.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KidsPark;
