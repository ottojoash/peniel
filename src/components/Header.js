import React, { useState, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi'; // Ensure you have 'react-icons' installed
import LogoWhite from '../assets/img/logo.png';
import LogoDark from '../assets/img/logo_transparent.png';

const Header = () => {
  const [header, setHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu toggle

  useEffect(() => {
    const handleScroll = () => {
      setHeader(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${header ? 'bg-white py-2 shadow-lg' : 'bg-transparent py-3'} fixed z-50 w-full transition-all duration-500`}>
      <div className='container mx-auto flex items-center justify-between p-3'>
        {/* Hamburger menu icon */}
        <HiMenu className='text-3xl cursor-pointer lg:hidden' onClick={() => setIsMenuOpen(!isMenuOpen)} />
        
        {/* Text visible on mobile */}
        <span className='text-xl font-semibold lg:hidden'>
          Welcome to Peniel Beach Hotel
        </span>

        {/* Mobile navigation menu, hidden by default */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-md py-5 px-3 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className={`flex flex-col items-center text-primary font-tertiary uppercase`}>
            {/* Navigation links */}
            <a href='/' className='hover:text-accent transition' title='Home Page'>Home</a>
            <a href='/rooms' className='hover:text-accent transition' title='View Our Rooms'>Rooms</a>
            <a href='/resturant' className='hover:text-accent transition' title='Visit Our Restaurant'>Restaurant</a>
            <a href='/kids' className='hover:text-accent transition' title='Kids Park Information'>Kids Park</a>
            <a href='/contact' className='hover:text-accent transition' title='Contact Us'>Contact</a>
          </nav>
        </div>

        {/* Logo */}
        <a href='/' className='flex-grow text-center lg:flex-grow-0' title='Peniel Beach Hotel - Home'>
          <img className='inline-block w-[60px] lg:w-[80px]' src={header ? LogoWhite : LogoDark} alt='Peniel Beach Hotel Logo' />
        </a>

        {/* Desktop navigation */}
        <nav className={`${header ? 'text-primary' : 'text-white'} hidden lg:flex gap-x-8 font-tertiary tracking-[3px] text-[15px] uppercase`}>
            {/* Desktop navigation links */}
            <a href='/' className='hover:text-accent transition' title='Home Page'>Home</a>
            <a href='/rooms' className='hover:text-accent transition' title='View Our Rooms'>Rooms</a>
            <a href='/restaurant' className='hover:text-accent transition' title='Visit Our Restaurant'>Restaurant</a>
            <a href='/kids' className='hover:text-accent transition' title='Kids Park Information'>Kids Park</a>
            <a href='/contact' className='hover:text-accent transition' title='Contact Us'>Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
