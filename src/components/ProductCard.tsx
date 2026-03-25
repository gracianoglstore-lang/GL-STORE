import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Edit, Play, CheckCircle2, Maximize2 } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils/format';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const { currency } = useSettingsStore();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500"
    >
      <Link 
        to={product.category === 'Vídeos' ? `/reels?id=${product.id}` : `/product/${product.id}`} 
        className="block relative aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-gray-800"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${isHovered && product.videoUrl ? 'opacity-0' : 'opacity-100'}`}
          referrerPolicy="no-referrer"
        />
        
        {product.videoUrl && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0"
              >
                <video
                  ref={videoRef}
                  src={product.videoUrl}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        {product.featured && (
          <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand dark:text-blue-400">
              Destaque
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          {product.videoUrl && (
            <div className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white">
              <Play size={14} fill="currentColor" />
            </div>
          )}
          <div className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={14} />
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 translate-y-0 sm:translate-y-12 sm:group-hover:translate-y-0 transition-transform duration-500 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
              toast.success('Produto adicionado ao carrinho!', {
                icon: <CheckCircle2 size={16} className="text-emerald-500" />,
              });
            }}
            className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-xl hover:bg-brand hover:text-white dark:hover:bg-brand transition-all active:scale-90 border border-gray-100 dark:border-gray-700"
          >
            <ShoppingCart size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Adicionar</span>
          </button>
        </div>
      </Link>


      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-black text-brand dark:text-blue-400 uppercase tracking-[0.2em]">{product.category}</span>
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-black text-gray-700 dark:text-gray-300">{product.rating}</span>
          </div>
        </div>

        <Link 
          to={product.category === 'Vídeos' ? `/reels?id=${product.id}` : `/product/${product.id}`} 
          className="block mb-2"
        >
          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{formatCurrency(product.price, currency)}</span>
            {user?.isAdmin && (
              <Link 
                to={`/admin?edit=${product.id}`}
                className="flex items-center space-x-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline mt-1 uppercase tracking-widest"
              >
                <Edit size={10} />
                <span>Editar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
