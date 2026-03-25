import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-gray-200 dark:border-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}
