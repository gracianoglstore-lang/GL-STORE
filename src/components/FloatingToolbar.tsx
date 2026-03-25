import { ShoppingCart, MessageSquare, Ticket, Edit3, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingToolbar() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center bg-white border border-gray-200 shadow-sm rounded-l-lg overflow-hidden w-12">
      {/* Cart */}
      <Link 
        to="/cart" 
        className="group relative h-12 w-full flex items-center justify-center hover:bg-red-50 transition-colors border-b border-gray-100"
        title="Carrinho"
      >
        <div className="relative">
          <ShoppingCart size={20} strokeWidth={1.5} className="text-gray-700 group-hover:text-red-500 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </div>
      </Link>

      {/* Messages */}
      <button 
        className="group h-12 w-full flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-100"
        title="Mensagens"
      >
        <MessageSquare size={20} strokeWidth={1.5} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Coupons */}
      <button 
        className="group h-12 w-full flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-100"
        title="Cupons"
      >
        <Ticket size={20} strokeWidth={1.5} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Feedback/Edit */}
      <button 
        className="group h-12 w-full flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-100"
        title="Feedback"
      >
        <Edit3 size={20} strokeWidth={1.5} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="group h-12 w-full flex items-center justify-center hover:bg-gray-900 transition-colors"
            title="Voltar ao topo"
          >
            <ChevronUp size={20} strokeWidth={1.5} className="text-gray-700 group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
