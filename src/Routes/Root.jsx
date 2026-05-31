import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 relative">
      {/* Grid background — fixed so it covers all pages */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-8xl mx-auto px-4 pt-20 lg:pt-16 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Root;
