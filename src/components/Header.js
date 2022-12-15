import React, { useEffect, useState } from 'react';
// logo
import Logo from '../assets/img/logo.svg';

const Header = () => {
  const [header, setHeader] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    });
  });
  return (
    <header className='fixed z-50 w-full py-10'>
      <div className='container mx-auto flex justify-between'>
        {/* logo */}
        <a href='#'>
          <img className='w-[160px]' src={Logo} alt='' />
        </a>
        {/* nav */}
        <nav className='flex gap-x-8 font-tertiary tracking-[3px]  text-white text-[15px] items-center'>
          <a className='hover:text-accent transition' href=''>
            HOME
          </a>
          <a className='hover:text-accent transition' href=''>
            ROOMS
          </a>
          <a className='hover:text-accent transition' href=''>
            RESTAURANT
          </a>
          <a className='hover:text-accent transition' href=''>
            SPA
          </a>
          <a className='hover:text-accent transition' href=''>
            CONTACT
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
