import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types';
import { Heart, MessageCircle, Share2, Music2, User, ChevronDown, ChevronUp, Gamepad2, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/format';
import { useSettingsStore } from '../store/useSettingsStore';

interface ReelItemProps {
  product: Product;
  isActive: boolean;
}

const ReelItem = ({ product, isActive }: ReelItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { currency, siteName } = useSettingsStore();

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="relative h-screen w-full bg-black flex items-center justify-center snap-start overflow-hidden">
      {/* Video Background */}
      {product.videoUrl && (
        <video
          ref={videoRef}
          src={product.videoUrl}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
        />
      )}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* Content */}
      <div className="absolute bottom-24 left-4 right-16 text-white z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={isActive ? { opacity: 1, x: 0 } : {}}
          className="flex items-center space-x-3 mb-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight uppercase">{product.brand}</span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Original Gameplay</span>
          </div>
        </motion.div>
        
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="text-2xl font-black mb-2 tracking-tighter uppercase italic"
        >
          {product.name}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          className="text-sm text-gray-300 font-medium line-clamp-2 mb-6 max-w-md leading-relaxed"
        >
          {product.description}
        </motion.p>
        
        <div className="flex items-center space-x-3 text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">
          <div className="p-1.5 bg-indigo-600/20 rounded-lg">
            <Music2 size={14} />
          </div>
          <span>Som original - {siteName}</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              addItem(product);
              toast.success('Adicionado ao carrinho!');
            }}
            className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center space-x-3 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <ShoppingCart size={18} />
            <span>Comprar {formatCurrency(product.price, currency)}</span>
          </button>
          
          <Link 
            to={`/product/${product.id}`}
            className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-20">
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isLiked ? 'text-red-500 scale-110' : 'text-white hover:scale-110'}`}
          >
            <Heart size={32} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </button>
          <span className="text-[10px] font-black text-white mt-1 uppercase tracking-tighter">
            {product.reviewsCount + (isLiked ? 1 : 0)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
            <MessageCircle size={32} strokeWidth={2.5} />
          </button>
          <span className="text-[10px] font-black text-white mt-1 uppercase tracking-tighter">
            {Math.floor(product.reviewsCount / 3)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
            <Share2 size={32} strokeWidth={2.5} />
          </button>
          <span className="text-[10px] font-black text-white mt-1 uppercase tracking-tighter">Partilhar</span>
        </div>

        <div className="pt-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-spin-slow">
            <Gamepad2 size={24} className="text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reels() {
  const { products } = useProductStore();
  const { siteName } = useSettingsStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const videoProducts = products.filter(p => p.videoUrl);

  useEffect(() => {
    if (productId && videoProducts.length > 0) {
      const index = videoProducts.findIndex(p => p.id === productId);
      if (index !== -1) {
        setActiveIndex(index);
        // Scroll to the correct video after a short delay to ensure container is ready
        setTimeout(() => {
          containerRef.current?.scrollTo({
            top: index * window.innerHeight,
            behavior: 'instant'
          });
        }, 100);
      }
    }
  }, [productId, videoProducts.length]);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Gamepad2 size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase italic">{siteName.split(' ')[0]} <span className="text-indigo-500">Vídeos</span></h1>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">A seguir</span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b-2 border-indigo-500 pb-1">Para ti</span>
        </div>
      </div>

      {/* Feed Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {videoProducts.map((product, index) => (
          <ReelItem 
            product={product} 
            isActive={index === activeIndex} 
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-40 opacity-20 hover:opacity-100 transition-opacity duration-500">
        <button 
          onClick={() => containerRef.current?.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          onClick={() => containerRef.current?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Warning Toast (Optional) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center space-x-2"
        >
          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Desliza para ver mais</span>
          <ChevronDown size={12} className="text-indigo-500 animate-bounce" />
        </motion.div>
      </div>
    </div>
  );
}
