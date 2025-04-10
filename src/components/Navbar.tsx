
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Search, User, Bell } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  // Function to check if the link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-kazi-blue"></div>
            <span className="font-bold text-xl text-kazi-blue">KaziConnect</span>
          </Link>
        </div>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/dashboard" 
            className={`font-medium ${isActive('/dashboard') ? 'text-kazi-blue' : 'text-kazi-darkText hover:text-kazi-blue'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/jobs" 
            className={`font-medium ${isActive('/jobs') ? 'text-kazi-blue' : 'text-kazi-darkText hover:text-kazi-blue'}`}
          >
            Jobs
          </Link>
          <Link 
            to="/companies" 
            className={`font-medium ${isActive('/companies') ? 'text-kazi-blue' : 'text-kazi-darkText hover:text-kazi-blue'}`}
          >
            Companies
          </Link>
          <Link 
            to="/resources" 
            className={`font-medium ${isActive('/resources') ? 'text-kazi-blue' : 'text-kazi-darkText hover:text-kazi-blue'}`}
          >
            Resources
          </Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-500" />
          </div>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
