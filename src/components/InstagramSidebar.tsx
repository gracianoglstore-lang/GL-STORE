import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Compass, 
  Play, 
  Send, 
  Heart, 
  PlusSquare, 
  Menu,
  Instagram,
  ShoppingCart
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useSidebarStore } from '../store/useSidebarStore';
import { useCartStore } from '../store/useCartStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { motion } from 'motion/react';

export default function InstagramSidebar() {
  const location = useLocation();
  const { user } = useUserStore();
  const { toggle } = useSidebarStore();
  const { items } = useCartStore();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { icon: Home, label: 'Página inicial', path: '/' },
    { icon: Search, label: 'Pesquisa', path: '/products' },
    { icon: Compass, label: 'Explorar', path: '/products?sort=popular' },
    { icon: Play, label: 'Reels', path: '/reels' },
    { icon: Send, label: 'Mensagens', path: '/messages' },
    { icon: Heart, label: 'Notificações', path: '/notifications' },
    { icon: ShoppingCart, label: 'Carrinho', path: '/cart', badge: cartCount },
    ...(user?.isAdmin ? [{ icon: PlusSquare, label: 'Criar', path: '/admin' }] : []),
  ];

  return (
    <div className="hidden lg:flex flex-col sticky top-0 h-screen w-20 xl:w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-3 transition-all duration-300 z-50">
      {/* Logo */}
      <Link to="/" className="p-3 mb-8 flex items-center">
        <Instagram className="xl:hidden" size={28} />
        <span className="hidden xl:block text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          {useSettingsStore.getState().siteName}
        </span>
      </Link>

      {/* Nav Items */}
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-white/5 ${
                isActive ? 'font-bold' : 'font-normal'
              }`}
            >
              <div className="relative">
                <item.icon 
                  size={26} 
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  }`} 
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 border-2 border-white dark:border-gray-950">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -left-3 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"
                  />
                )}
              </div>
              <span className="hidden xl:block ml-4 text-base text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Profile */}
        <Link
          to="/profile"
          className={`flex items-center p-3 rounded-lg transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-white/5 ${
            location.pathname === '/profile' ? 'font-bold' : 'font-normal'
          }`}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-all">
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden xl:block ml-4 text-base text-gray-900 dark:text-gray-100">
            Perfil
          </span>
        </Link>
      </nav>

      {/* More Menu */}
      <button 
        onClick={toggle}
        className="flex items-center p-3 rounded-lg transition-all duration-200 group hover:bg-gray-50 dark:hover:bg-white/5 mt-auto"
      >
        <Menu 
          size={26} 
          className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
        />
        <span className="hidden xl:block ml-4 text-base text-gray-900 dark:text-gray-100">
          Mais
        </span>
      </button>
    </div>
  );
}
