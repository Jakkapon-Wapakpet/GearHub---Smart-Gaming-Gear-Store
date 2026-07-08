import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Compare from './pages/Compare';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Auth from './pages/Auth';

function MainLayout() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'compare':
        return <Compare setActivePage={setActivePage} />;
      case 'cart':
        return <Cart setActivePage={setActivePage} />;
      case 'orders':
        return <Orders />;
      case 'auth':
        return <Auth setActivePage={setActivePage} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
      {/* Navigation bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Body */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
