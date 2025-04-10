import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Search,
  Users,
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="hover-lift">
            <h1 className="text-xl font-bold tracking-tight">Kazi Connect</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hover-scale">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="hover-scale">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <h1 className="heading-xl slide-in">
          Connect with Your Next{' '}
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Career Opportunity
          </span>
        </h1>
        <p className="body-lg mx-auto mt-6 max-w-2xl text-muted-foreground slide-in">
          Find the best jobs, connect with top employers, and access resources to accelerate
          your professional growth in Kenya and beyond.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 slide-in">
          <Link to="/register">
            <Button size="lg" className="hover-scale gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="hover-scale">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="mt-2 text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Job Seekers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">200+</div>
            <div className="mt-2 text-sm text-muted-foreground">Resources</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <h2 className="heading-lg text-center">Why Choose Kazi Connect?</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-hover rounded-lg border bg-card p-8">
              <Search className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Smart Job Matching</h3>
              <p className="mt-2 text-muted-foreground">
                Our AI-powered system matches you with jobs that fit your skills and
                preferences perfectly.
              </p>
            </div>
            <div className="card-hover rounded-lg border bg-card p-8">
              <Building2 className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Top Companies</h3>
              <p className="mt-2 text-muted-foreground">
                Connect with leading companies that are actively hiring and growing their
                teams.
              </p>
            </div>
            <div className="card-hover rounded-lg border bg-card p-8">
              <GraduationCap className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Career Resources</h3>
              <p className="mt-2 text-muted-foreground">
                Access a wealth of resources to help you grow and advance in your career
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container text-center">
          <h2 className="heading-lg">Ready to Start Your Journey?</h2>
          <p className="body-base mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join thousands of professionals who have found their dream careers through
            Kazi Connect.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" className="hover-scale gap-2">
              Create Your Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              2025 Kazi Connect. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                to="/about"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
