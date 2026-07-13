import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Helmet } from 'react-helmet';
import RestaurantMenuPDF from '../assets/Menu.pdf';

const PDF_WORKER_URL =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const Restaurant = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Helmet>
        <title>Restaurant | Peniel Beach Hotel</title>
        <meta name="description" content="Explore our delicious restaurant menu." />
      </Helmet>

      <main className="relative flex-grow">
        <div className="container mx-auto px-4 pb-16 pt-32 text-center sm:px-6 lg:px-20 lg:pt-36">
          <p className="mb-2 font-tertiary text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[6px]">
            Peniel Beach Hotel
          </p>
          <h1 className="mb-4 font-primary text-4xl sm:text-5xl">Our Restaurant Menu</h1>
          <p className="mx-auto max-w-2xl text-gray-300">
            Browse our food and drink selection below, or open the menu in a new tab for a larger view.
          </p>

          <div className="pdf-container mx-auto my-8 h-[70vh] min-h-[520px] max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <Worker workerUrl={PDF_WORKER_URL}>
              <Viewer
                fileUrl={RestaurantMenuPDF}
                renderError={() => (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-gray-700">
                    <p>The embedded menu could not be displayed on this device.</p>
                    <a
                      href={RestaurantMenuPDF}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded bg-accent px-6 py-3 font-semibold text-white"
                    >
                      Open menu PDF
                    </a>
                  </div>
                )}
              />
            </Worker>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={RestaurantMenuPDF}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-accent px-6 py-3 font-tertiary uppercase tracking-[2px] text-white transition hover:bg-accent-hover"
            >
              Open full menu
            </a>
            <a
              href={RestaurantMenuPDF}
              download="Peniel-Beach-Hotel-Menu.pdf"
              className="rounded border border-white/30 px-6 py-3 font-tertiary uppercase tracking-[2px] text-white transition hover:border-accent hover:text-accent"
            >
              Download menu
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Restaurant;
