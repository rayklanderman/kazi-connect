import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Jobs from '@/pages/Jobs';
import Companies from '@/pages/Companies';
import Resources from '@/pages/Resources';
import AIPage from '@/pages/AI';
import JobMatch from '@/pages/JobMatch';
import Profile from '@/pages/Profile'; // New Profile page
import Accessibility from '@/pages/Accessibility';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

export default function App() {
  const getSession = useAuthStore((state) => state.getSession);

  useEffect(() => {
    getSession().catch(console.error);
  }, [getSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router {...routerConfig}>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes: Only the six core pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job-match" element={<JobMatch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/AI" element={<AIPage />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* TODO: Add improved navigation bar/sidebar for the six main pages */}
        {/* TODO: Add African branding and responsive design improvements */}
        <Footer />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
