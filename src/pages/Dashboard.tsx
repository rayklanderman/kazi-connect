
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-4">Welcome to your personal dashboard!</p>
          <p className="text-gray-600">
            Track your job applications, view matched jobs, and manage your profile from here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
