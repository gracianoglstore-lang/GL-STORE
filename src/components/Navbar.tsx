import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Sparkles, QrCode, ChevronDown, Globe, Truck, ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils/format';
import ThemeToggle from './ThemeToggle';
import LanguageCurrencySelector from './LanguageCurrencySelector';
import toast from 'react-hot-toast';

import { useSidebarStore } from '../store/useSidebarStore';

export default function Navbar() {
  const { open, toggle, isOpen: isSidebarOpen } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const user = useUserStore((state) => state.user);
  const { language, currency, siteName, siteLogo, setLanguage, setCurrency } = useSettingsStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Pesquisando por: ${searchQuery.trim()}`);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isAccountPage = location.pathname === '/account';
  if (isAccountPage) return null;

  const [firstName, ...rest] = siteName.split(' ');
  const lastName = rest.join(' ');

  return (
    <header className="w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar for Language and Currency */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <LanguageCurrencySelector />
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/244921291580" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 flex items-center">
              <Headphones size={12} className="mr-2" />
              Suporte Técnico
            </a>
          </div>
        </div>
      </div>

      {/* Trending Ticker - Recipe 5: Marquee */}
      <div className="bg-gray-950 text-white py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-12 whitespace-nowrap animate-marquee">
          {[
            { icon: <Sparkles size={12} className="text-brand" />, text: `Summer Sale: Up to 70% OFF at ${siteName}` },
            { icon: <Truck size={12} className="text-blue-400" />, text: 'Free Shipping on orders over 50.000 Kz' },
            { icon: <ShieldCheck size={12} className="text-emerald-400" />, text: `${siteName} Satisfaction Guarantee` },
          ].map((item, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center">
              {item.icon}
              <span className="ml-3">{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between gap-12">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={siteLogo} 
                  alt={`${siteName} Logo`} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="hidden sm:block text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                {firstName} <span className="text-indigo-600">{lastName}</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Início</Link>
            <Link to="/products" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Jogos</Link>
            <Link to="/cart" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Carrinho</Link>
            <Link to="/profile" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Perfil</Link>
            <Link to="/checkout" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Pagamento</Link>
            <a href="https://wa.me/244921291580" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Suporte</a>
          </nav>

          {/* Search Bar - Refined */}
          <div className="flex-grow max-w-2xl hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center w-full bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 focus-within:border-brand focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-300">
                <div className="pl-6 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search premium gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none bg-transparent font-medium"
                />
                <button type="submit" className="bg-brand text-white px-8 py-3.5 font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-colors">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-6">
              <ThemeToggle />
            </div>

            <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 hidden sm:block" />

            {/* Account */}
            {!user ? (
              <div className="hidden sm:flex items-center space-x-6">
                <Link to="/account" className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white hover:text-indigo-600 transition-colors">Entrar</Link>
                <Link to="/account?tab=register" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">Criar Conta</Link>
              </div>
            ) : (
              <Link to="/profile" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-brand/5 group-hover:text-brand transition-all duration-500 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Account</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white">{user.name.split(' ')[0]}</p>
                </div>
              </Link>
            )}

            {/* Cart */}
            <div className="relative group/cart">
              <Link to="/cart" className="relative block">
                <div className="w-12 h-12 rounded-2xl bg-gray-950 text-white flex items-center justify-center hover:bg-brand transition-all duration-500 shadow-xl shadow-black/10">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-4 border-white dark:border-gray-950">
                    {cartCount}
                  </span>
                </div>
              </Link>

              {/* Mini Cart Popover */}
              <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 translate-y-2 group-hover/cart:translate-y-0 z-[60] overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Meu Carrinho ({cartCount})</h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {items.length === 0 ? (
                    <div className="py-8 text-center">
                      <ShoppingCart size={32} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vazio</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-800">
                          <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{item.name}</p>
                          <p className="text-[8px] font-black text-brand uppercase tracking-widest mt-0.5">{item.category}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] font-black text-gray-500">{item.quantity}x</p>
                            <p className="text-xs font-black text-gray-900 dark:text-white">{formatCurrency(item.price, currency)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                        {formatCurrency(items.reduce((acc, item) => acc + (item.price * item.quantity), 0), currency)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/cart" 
                        className="py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-widest text-center rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Ver Carrinho
                      </Link>
                      <Link 
                        to="/checkout" 
                        className="py-3 bg-brand text-white text-[10px] font-black uppercase tracking-widest text-center rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                      >
                        Finalizar
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <button 
              onClick={toggle} 
              className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search - Only visible on small screens */}
      <div className="md:hidden px-4 pb-5">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:border-brand"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}
