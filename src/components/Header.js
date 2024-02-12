import React, { useState, useEffect } from 'react';

// logo
import LogoWhite from '../assets/img/logo.png';
import LogoDark from '../assets/img/logo_transparent.png';

const Header = () => {
  const [header, setHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeader(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${
        header ? 'bg-white py-2 shadow-lg' : 'bg-transparent py-3'
      } fixed z-50 w-full transition-all duration-500`}
    >
      <div className='container mx-auto flex flex-col items-center gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0'>
        {/* logo */}
        <a href='/' title='Peniel Beach Hotel - Home'>
          <img
            className='w-[60px] lg:w-[80px]'
            src={header ? LogoWhite : LogoDark}
            alt='Peniel Beach Hotel Logo'
          />
        </a>
        {/* nav */}
        <nav
          className={`${
            header ? 'text-primary' : 'text-white'
          } flex gap-x-4 font-tertiary tracking-[3px] text-[15px] items-center uppercase lg:gap-x-8`}
        >
          <a href='/' className='hover:text-accent transition' title='Home Page'>
            Home
          </a>
          <a href='/rooms' className='hover:text-accent transition' title='View Our Rooms'>
            Rooms
          </a>
          <a href='/resturant' className='hover:text-accent transition' title='Visit Our Restaurant'>
            Restaurant
          </a>
          <a href='/kids' className='hover:text-accent transition' title='Kids Park Information'>
            Kids Park
          </a>
          <a href='/contact' className='hover:text-accent transition' title='Contact Us'>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
