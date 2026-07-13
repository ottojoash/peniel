import React from "react";
// components
import Header from "./components/Header";
import Footer from "./components/Footer";
// pages
import Home from "./pages/Home";
import RoomPages from "./pages/RoomPage";
import RoomDetails from "./pages/RoomDetails";
import Resturant from "./pages/Resturant";
import KidsPark from "./pages/Kids";

// react router
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import ContactForm from "./pages/Contact";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import PaymentResult from "./pages/PaymentResult";
import GalleryPage from "./pages/GalleryPage";
import ScrollToTop from "./components/ScrollToTop";

const PublicLayout = () => (
  <>
    <ScrollToTop />
    <Header />
    <Outlet />
    <Footer />
  </>
);
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/rooms", element: <RoomPages /> },
      { path: "/restaurant", element: <Resturant /> },
      { path: "/resturant", element: <Navigate to="/restaurant" replace /> },
      { path: "/kids", element: <KidsPark /> },
      { path: "/contact", element: <ContactForm /> },
      { path: "/gallery", element: <GalleryPage /> },
      { path: "/room/:id", element: <RoomDetails /> },
      { path: "/terms", element: <Terms /> },
      { path: "/payment-result", element: <PaymentResult /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
