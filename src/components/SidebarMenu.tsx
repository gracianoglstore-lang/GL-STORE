import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tv, Trophy, Star, ChevronRight, Settings, HelpCircle, LogOut, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';

import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function SidebarMenu({ isOpen, onClose, user }: SidebarMenuProps) {
  const menuItems = [
    { icon: Trophy, label: 'Jogo de Desporto', path: '/products?search=Desporto' },
    { icon: Tv, label: 'Vídeos Curtos', path: '/reels' },
    { label: 'Categorias de Jogos', isHeader: true },
    { label: 'Jogo de Guerra', path: '/products?search=Guerra' },
    { label: 'Jogo de Aventura', path: '/products?search=Aventura' },
    { label: 'Jogo de Ação', path: '/products?search=Ação' },
    { label: 'Jogo de Luta', path: '/products?search=Luta' },
    { label: 'Jogo de Desporto', path: '/products?search=Desporto' },
  ];

  const { siteName } = useSettingsStore();
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
    toast.success('Sessão terminada com sucesso');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#1a1a1a] z-[70] shadow-2xl flex flex-col transition-colors duration-300"
          >
            {/* Header - Lime Green Style from Image */}
            <div className="bg-[#C0FF00] p-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Menu</h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <X size={28} className="text-gray-900" />
              </button>
            </div>

            {/* User Profile Section (Optional but good for UX) */}
            {user ? (
              <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#C0FF00] flex items-center justify-center text-gray-900 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Membro Premium</p>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 space-y-4">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Bem-vindo à {siteName}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/account" 
                    onClick={onClose}
                    className="py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-brand hover:text-white transition-all"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/account?tab=register" 
                    onClick={onClose}
                    className="py-3 bg-[#C0FF00] text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-gray-900 hover:text-white transition-all"
                  >
                    Criar Conta
                  </Link>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
              {menuItems.map((item, index) => {
                if (item.isHeader) {
                  return (
                    <div key={index} className="px-4 py-3 mt-2 bg-gray-50 dark:bg-white/5">
                      <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        {item.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    to={item.path || '#'}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group text-gray-600 dark:text-gray-300"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                    {!item.isHeader && <ChevronRight size={14} className="text-gray-400 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />}
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-2">
              {user?.isAdmin && (
                <Link to="/admin" onClick={onClose} className="flex items-center space-x-3 text-indigo-600 dark:text-[#C0FF00] hover:text-indigo-700 dark:hover:text-white py-2 transition-colors">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Gerenciar Loja</span>
                </Link>
              )}
              <Link to="/profile" onClick={onClose} className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-colors">
                <Settings size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Configurações</span>
              </Link>
              <Link to="/contact" onClick={onClose} className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-colors">
                <HelpCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Ajuda</span>
              </Link>
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-red-500 hover:text-red-600 py-2 transition-colors border-t border-gray-100 dark:border-white/5 mt-2 pt-4"
                >
                  <LogOut size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Terminar Sessão</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
