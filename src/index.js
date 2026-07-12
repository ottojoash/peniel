import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RoomProvider from './context/RoomContext';
import { SiteProvider } from './context/SiteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SiteProvider><RoomProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RoomProvider></SiteProvider>
);
