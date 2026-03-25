import React from 'react';
import { motion } from 'motion/react';
import { Hammer, Clock, ShieldCheck } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Link } from 'react-router-dom';

export default function MaintenanceMode() {
  const { siteName } = useSettingsStore();

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202] flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 bg-brand/10 rounded-[2.5rem] flex items-center justify-center text-brand">
            <Hammer size={64} className="animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Clock size={20} />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none"
          >
            Site em <br /> <span className="text-brand">manutenção</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed"
          >
            Estamos a trabalhar para melhorar a sua experiência na {siteName}. Volte mais tarde.
          </motion.p>
        </div>

        {/* Admin Access Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-12"
        >
          <Link
            to="/account"
            className="inline-flex items-center space-x-3 text-[10px] font-black text-gray-400 hover:text-brand uppercase tracking-[0.3em] transition-colors"
          >
            <ShieldCheck size={16} />
            <span>Acesso Restrito ao Administrador</span>
          </Link>
        </motion.div>

        {/* Footer Info */}
        <div className="pt-24">
          <p className="text-[10px] font-black text-gray-300 dark:text-gray-800 uppercase tracking-[0.5em]">
            {siteName} • MMXXVI
          </p>
        </div>
      </div>
    </div>
  );
}
