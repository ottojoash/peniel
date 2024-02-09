import React from 'react';
// components
import Header from './components/Header';
import Footer from './components/Footer';
// pages
import Home from './pages/Home';
import RoomPages from './pages/RoomPage';
import RoomDetails from './pages/RoomDetails';
import Resturant from './pages/Resturant';

// react router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
