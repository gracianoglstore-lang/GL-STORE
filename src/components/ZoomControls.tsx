import React from 'react';
import { Plus, Minus, RotateCcw, Search } from 'lucide-react';
import { useZoomStore } from '../store/useZoomStore';
import { motion, AnimatePresence } from 'motion/react';

export default function ZoomControls() {
  const { zoom, increaseZoom, decreaseZoom, resetZoom } = useZoomStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-24 right-6 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-1"
          >
            <button
              onClick={increaseZoom}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-3 group"
              title="Aumentar Zoom"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Plus size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Aumentar</span>
            </button>

            <button
              onClick={decreaseZoom}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-3 group"
              title="Diminuir Zoom"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <Minus size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Diminuir</span>
            </button>

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

            <button
              onClick={resetZoom}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-3 group"
              title="Restaurar Zoom"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:rotate-180 transition-transform duration-500">
                <RotateCcw size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Restaurar</span>
            </button>

            <div className="px-3 py-2 text-center">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
          isOpen 
            ? 'bg-indigo-600 text-white rotate-90' 
            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-indigo-500'
        }`}
        title="Controles de Zoom"
      >
        <Search size={20} />
      </button>
    </div>
  );
}
