import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TelegramSupportButton() {
  const [isHovered, setIsHovered] = useState(false);

  // Telegram official link - usually t.me/username
  // I'll use a placeholder, the user can change it later
  const telegramLink = "https://t.me/site_suporte"; 

  return (
    <div 
      className="fixed bottom-24 right-6 z-50 flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="mb-3 bg-[#FFD700] text-gray-900 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider shadow-xl whitespace-nowrap border-2 border-white"
          >
            Entrar no Telegram
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: ["0 0 0 0px rgba(0, 136, 204, 0.4)", "0 0 0 20px rgba(0, 136, 204, 0)"] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center shadow-2xl relative group overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
        
        {/* Telegram SVG Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-9 h-9 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.503-1.359 8.627-.168.9-.498 1.201-.819 1.23-.698.064-1.226-.462-1.902-.905-1.058-.693-1.654-1.125-2.679-1.802-1.185-.78-.417-1.21.259-1.911.177-.184 3.247-2.977 3.307-3.23.008-.032.014-.148-.054-.208-.069-.06-.171-.04-.245-.023-.104.024-1.754 1.116-4.949 3.275-.468.322-.892.481-1.27.472-.416-.01-1.216-.236-1.811-.43-.73-.238-1.309-.364-1.258-.768.026-.21.315-.426.867-.647 3.39-1.477 5.65-2.451 6.779-2.922 3.225-1.35 3.895-1.584 4.332-1.592.096-.002.311.022.45.134.118.095.151.222.166.311.015.089.034.288.019.444z" />
        </svg>
      </motion.a>
    </div>
  );
}
