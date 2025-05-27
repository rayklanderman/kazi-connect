import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Search,
  Users,
  MapPin,
  Star,
  Shield,
  CheckCircle
} from 'lucide-react';

export default function Landing() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="container py-24 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10 z-0"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[var(--kenya-green)] bg-opacity-10 text-[var(--kenya-green)] font-medium text-sm border border-[var(--kenya-green)] border-opacity-20 shadow-sm hover:bg-opacity-20 transition-all duration-300">
              <Star className="h-4 w-4" /> Kenya's Premier Job Matching Platform <Star className="h-4 w-4" />
            </div>
            
            <h1 className="heading-xl slide-in">
              Connect with Your Next{' '}
              <span className="bg-gradient-to-r from-[var(--kenya-green)] to-[var(--kenya-black)] bg-clip-text text-transparent">
                Career Opportunity
              </span>
            </h1>
            
            <p className="body-lg mx-auto mt-6 max-w-2xl text-muted-foreground slide-in lg:mx-0">
              Find the best jobs, connect with top employers, and access resources to accelerate
              your professional growth in Kenya and beyond.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 slide-in">
              <Link to="/register">
                <Button size="lg" className="hover-scale gap-2 bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="hover-scale border-[var(--kenya-green)] text-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/10">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
          


          {/* Horizontal grid of images showing young Kenyan professionals */}
          <div className="hidden lg:grid grid-cols-3 gap-4 h-[300px] mt-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/kenyan-professionals-1.jpg" 
                alt="Young Kenyan professionals using a laptop" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/kenyan-professionals-2.jpg" 
                alt="Kenyan professionals collaborating" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/kenyan-professionals-3.jpg" 
                alt="Smiling Kenyan professionals" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-[var(--kenya-black)]/5">
        <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center transform transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-[var(--kenya-green)]">1,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div className="text-center transform transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-[var(--kenya-green)]">500+</div>
            <div className="mt-2 text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="text-center transform transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-[var(--kenya-green)]">10,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Job Seekers</div>
          </div>
          <div className="text-center transform transition-transform hover:scale-105">
            <div className="text-3xl font-bold text-[var(--kenya-green)]">200+</div>
            <div className="mt-2 text-sm text-muted-foreground">Resources</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-lg inline-block relative">
              Why Choose Kazi Connect?
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[var(--kenya-green)] to-[var(--kenya-red)]"></div>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">Connecting Kenyan talent with opportunities through our innovative platform</p>
          </div>
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-hover rounded-lg border-l-4 border-l-[var(--kenya-green)] border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <Search className="h-12 w-12 text-[var(--kenya-green)]" />
              <h3 className="mt-4 text-xl font-semibold">Smart Job Matching</h3>
              <p className="mt-2 text-muted-foreground">
                Our AI-powered system matches you with jobs that fit your skills and
                preferences perfectly, tailored for the Kenyan job market.
              </p>
            </div>
            <div className="card-hover rounded-lg border-l-4 border-l-[var(--kenya-red)] border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <Building2 className="h-12 w-12 text-[var(--kenya-red)]" />
              <h3 className="mt-4 text-xl font-semibold">Top Kenyan Companies</h3>
              <p className="mt-2 text-muted-foreground">
                Connect with leading Kenyan companies that are actively hiring and growing their
                teams across various industries.
              </p>
            </div>
            <div className="card-hover rounded-lg border-l-4 border-l-[var(--kenya-black)] border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <GraduationCap className="h-12 w-12 text-[var(--kenya-black)]" />
              <h3 className="mt-4 text-xl font-semibold">Career Resources</h3>
              <p className="mt-2 text-muted-foreground">
                Access a wealth of resources to help you grow and advance in your career
                journey within the Kenyan job market.
              </p>
            </div>
          </div>
          
          {/* Additional features row */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-hover rounded-lg border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <MapPin className="h-12 w-12 text-[var(--kenya-green)]" />
              <h3 className="mt-4 text-xl font-semibold">Local Opportunities</h3>
              <p className="mt-2 text-muted-foreground">
                Find jobs in your area with our location-based search, covering all regions of Kenya.
              </p>
            </div>
            <div className="card-hover rounded-lg border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <Star className="h-12 w-12 text-[var(--kenya-red)]" />
              <h3 className="mt-4 text-xl font-semibold">Premium Features</h3>
              <p className="mt-2 text-muted-foreground">
                Unlock advanced job matching, priority applications, and personalized career coaching.
              </p>
            </div>
            <div className="card-hover rounded-lg border bg-card p-8 shadow-md hover:shadow-lg transition-all">
              <Shield className="h-12 w-12 text-[var(--kenya-black)]" />
              <h3 className="mt-4 text-xl font-semibold">Verified Employers</h3>
              <p className="mt-2 text-muted-foreground">
                Apply with confidence to jobs from verified Kenyan employers that meet our quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-red)]/10 py-24">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-[var(--kenya-green)]/20">
            <h2 className="heading-lg text-[var(--kenya-black)]">
              Ready to Start Your Journey in Kenya's Job Market?
            </h2>
            <p className="body-base mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join thousands of Kenyan professionals who have found their dream careers through
              Kazi Connect. Your next opportunity is waiting!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="hover-scale gap-2 bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90">
                  Create Your Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="hover-scale border-[var(--kenya-black)] text-[var(--kenya-black)] hover:bg-[var(--kenya-black)]/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[var(--kenya-black)]/5">
        <div className="container">
          <h2 className="heading-lg text-center mb-12">
            Success Stories from Kenyan Professionals
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="/images/kenyan-professionals-1.jpg" alt="Michael Omondi" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">Michael Omondi</h3>
                  <p className="text-sm text-muted-foreground">Software Developer, Nairobi</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Kazi Connect helped me find my dream job at a top tech company in Nairobi. The AI matching was spot on with my skills!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="/images/kenyan-professionals-2.jpg" alt="Wangari Kamau" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">Wangari Kamau</h3>
                  <p className="text-sm text-muted-foreground">Marketing Manager, Mombasa</p>
                </div>
              </div>
              <p className="text-muted-foreground">"After struggling to find relevant opportunities, Kazi Connect connected me with a company that values my experience and skills."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <img src="/images/kenyan-professionals-3.jpg" alt="James Kiprop" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold">James Kiprop</h3>
                  <p className="text-sm text-muted-foreground">Financial Analyst, Kisumu</p>
                </div>
              </div>
              <p className="text-muted-foreground">"The career resources on Kazi Connect helped me prepare for interviews and negotiate my salary. Now I'm earning 30% more!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Remote Work Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[var(--kenya-green)] bg-opacity-10 text-[var(--kenya-green)] font-medium text-sm">
                Remote Work Opportunities
              </div>
              <h2 className="heading-lg mb-6">Connect Virtually with Global Opportunities</h2>
              <p className="body-lg mb-6 text-muted-foreground">
                The modern workplace is evolving. At Kazi Connect, we help Kenyan professionals find remote work opportunities with companies around the world.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[var(--kenya-green)] h-5 w-5" />
                  <span>Access to international job markets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[var(--kenya-green)] h-5 w-5" />
                  <span>Virtual interview preparation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[var(--kenya-green)] h-5 w-5" />
                  <span>Remote work resources and training</span>
                </li>
              </ul>
              <Link to="/remote-jobs">
                <Button className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90">
                  Explore Remote Opportunities
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/images/kenyan-professionals-5.jpg" 
                alt="Kenyan professionals in a virtual meeting" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
