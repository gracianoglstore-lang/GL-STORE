import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const sales = [
  { name: 'António', city: 'Luanda', product: 'iPhone 15 Pro' },
  { name: 'Maria', city: 'Benguela', product: 'Bolsa Luxo' },
  { name: 'João', city: 'Huambo', product: 'Smartwatch Ultra' },
  { name: 'Isabel', city: 'Lubango', product: 'Bolsa de Luxo' },
  { name: 'Pedro', city: 'Cabinda', product: 'Fone Bluetooth' },
];

export default function LiveSalesNotification() {
  const [currentSale, setCurrentSale] = useState<typeof sales[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showRandomSale = () => {
      const randomSale = sales[Math.floor(Math.random() * sales.length)];
      setCurrentSale(randomSale);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(() => {
      showRandomSale();
    }, 15000);

    // Initial delay
    setTimeout(showRandomSale, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && currentSale && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -50, scale: 0.8 }}
          className="fixed bottom-24 left-4 z-50 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 flex items-center space-x-4 max-w-[280px]"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2] flex-shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Venda Recente</p>
            <p className="text-xs font-bold text-gray-900 truncate">
              {currentSale.name} em {currentSale.city}
            </p>
            <p className="text-[10px] text-gray-500 truncate">Comprou: {currentSale.product}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
