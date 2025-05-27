import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  Building2,
  Briefcase,
  Bot,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  User,
  Accessibility,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', to: '/', icon: LayoutDashboard },
  { name: 'Jobs', to: '/jobs', icon: Briefcase },
  { name: 'Job Match', to: '/job-match', icon: Briefcase },
  { name: 'Profile', to: '/profile', icon: User },
  { name: 'Companies', to: '/companies', icon: Building2 },
  { name: 'Resources', to: '/resources', icon: GraduationCap },
  { name: 'AI', to: '/ai', icon: Bot },
  { name: 'Accessibility', to: '/accessibility', icon: Accessibility },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out successfully',
        description: 'Come back soon!',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: error.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {/* African-inspired navigation bar with Kenyan flag colors */}
      <nav className="sticky top-0 z-50 w-full nav-african border-b-4 border-white">
        <div className="container mx-auto flex items-center justify-between h-16 px-2 md:px-0">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <Link to="/" className="ml-4 lg:ml-0">
              <span 
                className="text-2xl font-extrabold tracking-tight select-none heading-african" 
                style={{
                  display: 'inline-block', 
                  letterSpacing: 1, 
                  textShadow: '0 2px 8px rgba(0,0,0,0.18)'
                }} 
                tabIndex={0}
              >
                <span style={{color: 'var(--kenya-white)'}}>Kazi</span>
                <span style={{color: 'var(--kenya-red)'}}> Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={cn(
                  'nav-link-african inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150',
                  location.pathname === item.to
                    ? 'active'
                    : ''
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu and Theme Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover-scale text-white hover:bg-white/20"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-white md:block">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                className="hover-scale gap-2 text-white hover:bg-white/20"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden',
            isMobileMenuOpen
              ? 'animate-in slide-in-from-top-2'
              : 'animate-out slide-out-to-top-2 hidden'
          )}
        >
          <div className="container space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-base font-semibold',
                  location.pathname === item.to
                    ? 'bg-white text-black shadow-md'
                    : 'text-white hover:bg-white/20'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        <div className="fade-in">{children}</div>
      </main>

      {/* African-inspired Footer */}
      <footer className="bg-gradient-savanna py-8 border-t-4 border-primary-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">
                <span style={{color: 'var(--kenya-black)'}}>Kazi</span>
                <span style={{color: 'var(--kenya-red)'}}> Connect</span>
              </span>
              <p className="text-sm mt-2">Connecting African talent with global opportunities</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link to="/jobs" className="text-sm hover:underline">Jobs</Link>
              <Link to="/companies" className="text-sm hover:underline">Companies</Link>
              <Link to="/resources" className="text-sm hover:underline">Resources</Link>
              <Link to="/accessibility" className="text-sm hover:underline">Accessibility</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center text-sm">
            <p>© {new Date().getFullYear()} Kazi Connect. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="text-neutral-600 hover:text-primary-600">Privacy Policy</a>
              <a href="#" className="text-neutral-600 hover:text-primary-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
