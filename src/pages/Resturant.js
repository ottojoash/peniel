import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import RestaurantMenuPDF from '../assets/Menu.pdf'; // Update the path

const Restaurant = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <ScrollToTop />
      <Helmet>
        <title>Restaurant | Peniel Beach Hotel</title>
        <meta name="description" content="Explore our delicious restaurant menu." />
      </Helmet>

      <main className="flex-grow relative">
        <div className="container mx-auto px-4 lg:px-20 pt-20 text-center">
          <h2 className="text-3xl font-semibold mb-6">Our Menu</h2>
          <div className="pdf-container mx-auto my-8 bg-white p-4 rounded-lg shadow-md">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl={RestaurantMenuPDF} />
            </Worker>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            You can also{' '}
            <a href={RestaurantMenuPDF} download className="text-blue-500 hover:text-blue-700">
              download the menu
            </a>{' '}
            for offline viewing.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Restaurant;
