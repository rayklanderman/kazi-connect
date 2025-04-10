import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Building2, GraduationCap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-xl font-bold">Kazi Connect</div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Connect with Your Next Career Opportunity
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Find the best jobs, connect with top employers, and access resources to accelerate
          your professional growth in Kenya and beyond.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/40 py-24">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Why Choose Kazi Connect?</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-8">
              <Briefcase className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Job Opportunities</h3>
              <p className="mt-2 text-muted-foreground">
                Access a curated list of job opportunities from leading companies across
                various industries.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8">
              <Building2 className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Company Profiles</h3>
              <p className="mt-2 text-muted-foreground">
                Research and connect with companies that align with your career goals and
                values.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-8">
              <GraduationCap className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Career Resources</h3>
              <p className="mt-2 text-muted-foreground">
                Access valuable resources, guides, and tools to help you advance in your
                career journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join thousands of professionals who have found their dream careers through
            Kazi Connect.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
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
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
