import React, { useState, useEffect } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import LogoWhite from '../assets/img/logo.png';
import LogoDark from '../assets/img/logo_transparent.png';
import { useSite } from '../context/SiteContext';

const Header = () => {
  const { settings } = useSite();
  const [header, setHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setHeader(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    ['/', 'Home'],
    ['/rooms', 'Rooms'],
    ['/resturant', 'Restaurant'],
    ['/kids', 'Kids Park'],
    ['/contact', 'Contact'],
    ['/gallery', 'Gallery'],
  ];

  const solidHeader = header || isMenuOpen;

  return (
    <header className={`${solidHeader ? 'bg-white py-1.5 shadow-lg' : 'bg-transparent py-2'} fixed z-50 w-full transition-all duration-300`}>
      <div className='container mx-auto flex min-h-[64px] items-center justify-between px-4'>
        <button
          type='button'
          className={`${solidHeader ? 'text-primary' : 'text-white'} z-10 flex h-11 w-11 items-center justify-center rounded-full lg:hidden`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <HiX className='text-3xl' /> : <HiMenu className='text-3xl' />}
        </button>

        {/* Mobile navigation menu, hidden by default */}
        <div className={`lg:hidden absolute top-full left-0 w-full border-t border-gray-100 bg-white shadow-xl transition-all duration-300 ${isMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}>
          <nav className='flex flex-col px-4 py-3 text-primary font-tertiary uppercase tracking-[2px]'>
            {navItems.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`flex min-h-[48px] items-center justify-center border-b border-gray-100 transition last:border-0 ${pathname === to ? 'text-accent' : 'hover:text-accent'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logo */}
        <Link to='/' className='absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0' title='Peniel Beach Hotel - Home'>
          <img className='block w-[58px] lg:w-[80px]' src={solidHeader ? LogoWhite : LogoDark} alt={`${settings.hotelName || 'Hotel'} logo`} itemProp="logo"/>
        </Link>

        <span className='h-11 w-11 lg:hidden' aria-hidden='true' />

        {/* Desktop navigation */}
        <nav className={`${header ? 'text-primary' : 'text-white'} hidden lg:flex gap-x-8 font-tertiary tracking-[3px] text-[15px] uppercase`}>
            {navItems.map(([to, label]) => (
              <Link key={to} to={to} className={`${pathname === to ? 'text-accent' : 'hover:text-accent'} transition`}>
                {label}
              </Link>
            ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
