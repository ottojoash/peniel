import React from 'react';
// logo
import LogoWhite from '../assets/img/logo_transparent.png';
// Importing icons from react-icons
import { FaInstagram, FaTwitter, FaWhatsapp, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-primary py-4'>
      <div className='container mx-auto text-white flex flex-col sm:flex-row justify-between items-center text-center sm:text-left'>
        {/* logo */}
        <a href='/' className='flex items-center justify-center mb-4 sm:mb-0'>
          <img src={LogoWhite} alt='Logo' className='w-20' />
        </a>

        {/* Social media icons */}
        <div className='flex justify-center items-center gap-4 mb-4 sm:mb-0'>
          <a href='https://www.instagram.com/peniel_beach_hotel_ebb/' target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
            <FaInstagram size='24' />
          </a>
          <a href='https://x.com/PenielHotelEbbs?t=kAp1nuKmrGzVNdGR48_Q8w&s=09' target='_blank' rel='noopener noreferrer' aria-label='Twitter'>
            <FaTwitter size='24' />
          </a>
          <a href='https://www.whatsapp.com' target='_blank' rel='noopener noreferrer' aria-label='WhatsApp'>
            <FaWhatsapp size='24' />
          </a>
          <a href='https://www.facebook.com' target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
            <FaFacebookF size='24' />
          </a>
        </div>

        {/* Copyright text */}
        <span className='block sm:inline'>
          Copyright &copy; 2024. All rights reserved Peniel Beach Hotel.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
