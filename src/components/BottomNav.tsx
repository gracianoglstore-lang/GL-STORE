import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Play, User } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useUserStore();
  const { items } = useCartStore();
  
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Search, label: 'Pesquisa', path: '/products' },
    { icon: ShoppingCart, label: 'Carrinho', path: '/cart', badge: cartCount },
    { icon: Play, label: 'Vídeos', path: '/reels' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-4 py-2 z-50 flex justify-around items-center transition-all duration-300">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 relative transition-all duration-300 ${
              isActive ? 'text-indigo-600 scale-110' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className="relative">
              {item.label === 'Perfil' && user?.avatar ? (
                <div className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-indigo-600 shadow-lg shadow-indigo-600/20' : 'border-transparent'}`}>
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <item.icon size={22} className={`transition-all duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
              )}
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-white dark:border-gray-950 shadow-lg shadow-indigo-600/20">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] mt-1 font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
