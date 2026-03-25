import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useUserStore } from './store/useUserStore';
import { useSidebarStore } from './store/useSidebarStore';
import { useZoomStore } from './store/useZoomStore';
import { useProductStore } from './store/useProductStore';
import { useSettingsStore } from './store/useSettingsStore';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import InstagramSidebar from './components/InstagramSidebar';
import SidebarMenu from './components/SidebarMenu';
import ZoomControls from './components/ZoomControls';
import MaintenanceMode from './components/MaintenanceMode';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Guaranteed from './pages/Guaranteed';
import Messages from './pages/Messages';
import About from './pages/About';
import Contact from './pages/Contact';
import Precos from './pages/Precos';
import AdminDashboard from './pages/AdminDashboard';
import Reels from './pages/Reels';
import LiveSalesNotification from './components/LiveSalesNotification';
import FloatingSupport from './components/FloatingSupport';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { theme } = useThemeStore();
  const { user } = useUserStore();
  const { zoom } = useZoomStore();
  const { isOpen: isSidebarOpen, close: closeSidebar } = useSidebarStore();
  const { fetchProducts } = useProductStore();
  const { isMaintenanceMode } = useSettingsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Maintenance Mode Check
  if (isMaintenanceMode && !user?.isAdmin) {
    return (
      <Router>
        <ScrollToTop />
        <div className={theme === 'dark' ? 'dark' : ''}>
          <Routes>
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<MaintenanceMode />} />
          </Routes>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0a0a0a',
                color: '#fff',
                borderRadius: '1rem',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div 
        className="min-h-screen flex bg-white dark:bg-gray-950 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300 max-w-7xl mx-auto w-full shadow-2xl border-x border-gray-100 dark:border-gray-800 relative"
        style={{ zoom: zoom } as React.CSSProperties}
      >
        <InstagramSidebar />
        <div className="flex-grow flex flex-col transition-all duration-300">
          <TopBar />
          <Navbar />
          <main className="flex-grow">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/guaranteed" element={<Guaranteed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/emuladores" element={<div className="py-24 text-center text-gray-400">Página de Emuladores em construção</div>} />
            <Route path="/servicos" element={<div className="py-24 text-center text-gray-400">Página de Serviços em construção</div>} />
            <Route path="/precos" element={<Precos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Fallback routes for footer links */}
            <Route path="/faq" element={<div className="py-24 text-center text-gray-400">Página em construção</div>} />
            <Route path="/terms" element={<div className="py-24 text-center text-gray-400">Página em construção</div>} />
            <Route path="/privacy" element={<div className="py-24 text-center text-gray-400">Página em construção</div>} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
        <LiveSalesNotification />
        <FloatingSupport />
        <SidebarMenu 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={user} 
        />
        <ZoomControls />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0a0a0a',
              color: '#fff',
              borderRadius: '1rem',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#1877F2',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </div>
  </Router>
);
}
