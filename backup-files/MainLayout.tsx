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
      {/* Kenyan flag theme gradient bar */}
      <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-black via-green-700 to-red-600 py-2 px-0 border-b-4 border-white">
        <div className="container mx-auto flex items-center justify-between h-14 px-2 md:px-0">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
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
                <span className="text-2xl font-extrabold tracking-tight select-none" style={{display: 'inline-block', letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.18)'}} tabIndex={0}>
  <span style={{color: '#fff'}}>Kazi</span>
  <span style={{color: '#FF0000'}}> Connect</span>
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
                    'nav-link inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150',
                    location.pathname === item.to
                      ? 'bg-white text-black shadow font-bold'
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
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
                className="hover-scale"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-muted-foreground md:block">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  className="hover-scale gap-2"
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/90 hover:bg-blue-500/70 hover:text-white'
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
    </div>
  );
}

