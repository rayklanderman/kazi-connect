import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Jobs', to: '/jobs' },
  { name: 'Job Match', to: '/job-match' },
  { name: 'Profile', to: '/profile' },
  { name: 'Companies', to: '/companies' },
  { name: 'Resources', to: '/resources' },
  { name: 'AI', to: '/AI' },
  { name: 'Accessibility', to: '/accessibility' },
];

export function Navbar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = React.useState(false);
  return (
    <header className="w-full">
  {/* Gradient Bar with Logo and Nav */}
  <div className="w-full bg-gradient-to-r from-black via-green-700 to-red-600 py-2 px-0" style={{borderBottom: '4px solid #fff'}}>
    <div className="container mx-auto flex items-center justify-between h-14 px-2 md:px-0">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-tight" style={{color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)', letterSpacing: 1}}>
        KaziConnect
      </Link>
      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${location.pathname === item.to ? 'bg-white text-black shadow font-bold' : 'text-white/90 hover:bg-white/20 hover:text-white'}`}
            aria-current={location.pathname === item.to ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          className="text-white focus:outline-none"
          aria-label="Open menu"
          onClick={() => setOpenMenu((open) => !open)}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {openMenu && (
          <div className="absolute top-14 left-0 w-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 shadow-lg z-50 animate-fade-in">
            <nav className="flex flex-col items-center gap-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`w-full text-center px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${location.pathname === item.to ? 'bg-blue-600 text-white shadow-md' : 'text-white/90 hover:bg-blue-500/70 hover:text-white'}`}
                  aria-current={location.pathname === item.to ? 'page' : undefined}
                  onClick={() => setOpenMenu(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 w-full px-4 mt-2">
                <Link to="/login" onClick={() => setOpenMenu(false)}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 px-4 py-2 font-medium">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setOpenMenu(false)}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 font-semibold shadow">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      {/* Auth Buttons for desktop */}
      <div className="hidden md:flex gap-2 items-center">
        <Link to="/login">
          <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 font-medium">
            Sign in
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 font-semibold shadow">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  </div>
</header>

  );
}
