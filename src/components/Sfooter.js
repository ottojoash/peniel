import React from 'react';
import { Helmet } from 'react-helmet';

const HotelInfoComponent = () => {
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Peniel Beach Hotel - Welcome To Peniel Beach Hotel |  Official site</title>
        <meta name="description" content="Discover Peniel Beach Hotel, a premier hospitality facility located on the shores of Lake Victoria opposite Entebbe International airport. Enjoy proximity to the airport, lake views, children’s play centre, and more." />
        <meta name="keywords" content="Peniel Beach Hotel, Lake Victoria Hotel, Entebbe Hotel, Uganda Hotels, Airport Hotels" />
      </Helmet>
      
      <div className="flex flex-col lg:flex-row">
        {/* About Section */}
        <div className="w-full lg:w-1/2 p-4">
          <h2 className="text-2xl font-semibold mb-4">About Peniel Beach Hotel</h2>
          <p>Peniel Beach Hotel is a Ugandan hospitality facility located on the shores of Lake Victoria and opposite Entebbe International airport. The mentioned attributes make it the most favorable hospitality facility to both indigenous and visiting foreign guests. With attractive amenities like proximity to the airport for flights, fresh breath from the lake, children’s play centre, restaurant, conference halls, Bar and many others, come enjoy your home away from home.</p>
        </div>

        {/* Location Section */}
        <div className="w-full lg:w-1/4 p-4">
          <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
          <div className="bg-gray-200 aspect-w-16 aspect-h-9">
            <iframe
              title="Peniel Beach Hotel Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8173409640895!2d32.4578450731043!3d0.040145464389186994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177d86c52afdeed7%3A0xf99d53c25a719bcc!2sPeniel%20Beach%20Hotel!5e0!3m2!1sen!2sug!4v1707709517160!5m2!1sen!2sug" 
              width="600"
              height="450"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              frameBorder="0"
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>

        {/* Address Section */}
        <div className="w-full lg:w-1/4 p-4">
          <h2 className="text-2xl font-semibold mb-4">Address</h2>
          <p>Plot 110-120 circular Road Bugonga</p>
          <p>Opposite the old Airport, Entebbe</p>
          <p>Tel: +256772485887, +256752703147, +256743572033</p>
          <p>Mail: info@penielbeachotel.com</p>
        </div>
      </div>
    </div>
  );
};

export default HotelInfoComponent;
