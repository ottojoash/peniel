import React from 'react';

const Restaurant = () => {
  // Placeholder images for the banner
  const bannerImages = [
    'https://via.placeholder.com/1024x300.png?text=Delicious+Meals',
    'https://via.placeholder.com/1024x300.png?text=Cozy+Atmosphere',
    'https://via.placeholder.com/1024x300.png?text=Fresh+Ingredients',
  ];

  // Dummy menu data with placeholder images
  const menuItems = [
    {
      id: 1,
      name: 'Spaghetti Bolognese',
      description: 'Classic spaghetti with homemade meat sauce',
      price: '$12',
      imageUrl: 'https://via.placeholder.com/150.png?text=Spaghetti+Bolognese',
    },
    {
      id: 2,
      name: 'Caesar Salad',
      description: 'Crispy romaine lettuce with Caesar dressing',
      price: '$8',
      imageUrl: 'https://via.placeholder.com/150.png?text=Caesar+Salad',
    },
    {
      id: 3,
      name: 'Margherita Pizza',
      description: 'Tomato, mozzarella, and fresh basil',
      price: '$10',
      imageUrl: 'https://via.placeholder.com/150.png?text=Margherita+Pizza',
    },
    {
        id: 4,
        name: 'Margherita Pizza',
        description: 'Tomato, mozzarella, and fresh basil',
        price: '$10',
        imageUrl: 'https://via.placeholder.com/150.png?text=Margherita+Pizza',
      },
    // Add more items as needed...
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

      {/* Menu items in a grid */}
      <div>
        <h2 className="text-xl md:text-3xl font-semibold text-center mb-6">Our Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                <p className="text-sm mb-2">{item.description}</p>
                <span className="text-md font-semibold">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
