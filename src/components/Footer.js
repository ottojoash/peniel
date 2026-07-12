import React from 'react';
// logo
import LogoWhite from '../assets/img/logo_transparent.png';
// Importing icons from react-icons
import { FaInstagram, FaTwitter, FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import { useSite } from '../context/SiteContext';

const Footer = () => {
  const { settings } = useSite();
  return (
    <footer className='bg-primary py-4'>
      <div className='container mx-auto text-white flex flex-col sm:flex-row justify-between items-center text-center sm:text-left'>
        {/* logo */}
        <a href='/' className='flex items-center justify-center mb-4 sm:mb-0'>
          <img src={LogoWhite} alt='Logo' className='w-20' />
        </a>

        {/* Social media icons */}
        <div className='flex justify-center items-center gap-4 mb-4 sm:mb-0'>
          <a href={settings.instagram || '#'} target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
            <FaInstagram size='24' />
          </a>
          <a href={settings.twitter || '#'} target='_blank' rel='noopener noreferrer' aria-label='Twitter'>
            <FaTwitter size='24' />
          </a>
          <a href={`https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}`} target='_blank' rel='noopener noreferrer' aria-label='WhatsApp'>
            <FaWhatsapp size='24' />
          </a>
          <a href={settings.facebook || '#'} target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
            <FaFacebookF size='24' />
          </a>
        </div>

        {/* Copyright text */}
        <span className='block sm:inline'>
          Copyright &copy; {new Date().getFullYear()}. All rights reserved {settings.hotelName || 'Peniel Beach Hotel'}.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
