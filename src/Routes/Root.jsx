import React from 'react';
import Navber from '../Components/Navber';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full width Navbar */}
      <Navber />

      {/* Centered content with max width */}
      <main className="flex-1 w-full max-w-8xl mx-auto px-4">
        <Outlet />
      </main>

      {/* Full width Footer */}
      <Footer />
    </div>
  );
};

export default Root;
