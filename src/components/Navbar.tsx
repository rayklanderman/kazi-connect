
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Search, User, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-kazi-blue"></div>
          <span className="font-bold text-xl text-kazi-blue">KaziConnect</span>
        </div>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="font-medium text-kazi-darkText hover:text-kazi-blue">Dashboard</a>
          <a href="#" className="font-medium text-kazi-darkText hover:text-kazi-blue">Jobs</a>
          <a href="#" className="font-medium text-kazi-darkText hover:text-kazi-blue">Companies</a>
          <a href="#" className="font-medium text-kazi-darkText hover:text-kazi-blue">Resources</a>
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
