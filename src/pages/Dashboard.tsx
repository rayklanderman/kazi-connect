import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <div className="bg-card rounded-lg shadow p-6">
          <p className="text-lg mb-4">Welcome to your personal dashboard!</p>
          <p className="text-muted-foreground">
            Track your job applications, view matched jobs, and manage your profile from here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
