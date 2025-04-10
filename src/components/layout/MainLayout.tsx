import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layout, LayoutDashboard, Briefcase, Building2, GraduationCap, User } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold">
              Kazi Connect
            </Link>
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
              </Link>
              <Link
                to="/companies"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Building2 className="h-4 w-4" />
                Companies
              </Link>
              <Link
                to="/resources"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <GraduationCap className="h-4 w-4" />
                Resources
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="container flex items-center gap-4 border-t py-4 md:hidden">
          <Link
            to="/dashboard"
            className="flex flex-1 flex-col items-center gap-1 text-xs font-medium text-muted-foreground"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/jobs"
            className="flex flex-1 flex-col items-center gap-1 text-xs font-medium text-muted-foreground"
          >
            <Briefcase className="h-5 w-5" />
            Jobs
          </Link>
          <Link
            to="/companies"
            className="flex flex-1 flex-col items-center gap-1 text-xs font-medium text-muted-foreground"
          >
            <Building2 className="h-5 w-5" />
            Companies
          </Link>
          <Link
            to="/resources"
            className="flex flex-1 flex-col items-center gap-1 text-xs font-medium text-muted-foreground"
          >
            <GraduationCap className="h-5 w-5" />
            Resources
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="container py-8">{children}</main>
    </div>
  );
}
