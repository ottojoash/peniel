import React from 'react';
// logo
import LogoWhite from '../assets/img/logo_transparent.png';

const Footer = () => {
  return (
    <footer className='bg-primary py-4'> {/* Adjusted padding from py-12 to py-4 */}
      <div className='container mx-auto text-white flex justify-between items-center'>
        {/* logo */}
        <a href='/' className='flex items-center'>
          <img src={LogoWhite} alt='Logo' className='w-20' />
        </a>
        <span>
          Copyright &copy; 2024. All rights reserved Peniel Beach Hotel.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
