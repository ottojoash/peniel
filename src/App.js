import React from 'react';
// components
import Header from './components/Header';
import Footer from './components/Footer';
// pages
import Home from './pages/Home';
import RoomPages from './pages/RoomPage';
import RoomDetails from './pages/RoomDetails';
import Resturant from './pages/Resturant';
import KidsPark from './pages/Kids';

// react router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ContactForm from './pages/Contact';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/rooms', // Add this route for the Rooms page
    element: <RoomPages />,
  },
  {
    path: '/resturant', // Add this route for the Rooms page
    element: <Resturant/>,
  },
  {
    path: '/kids', // Add this route for the Rooms page
    element: <KidsPark/>,
  },
  {
    path: '/Contact', // Add this route for the Rooms page
    element: <ContactForm/>,
  },
  {
    path: '/room/:id',
    element: <RoomDetails />,
  },
]);

const App = () => {
  return (
    <div>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
};

export default App;
