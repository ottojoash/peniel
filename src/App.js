import React from 'react';
// components
import Header from './components/Header';
// pages
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
    </div>
  );
};

export default App;
