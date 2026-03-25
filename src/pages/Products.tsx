import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Sparkles, Filter, X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || 'Todos';

  // Update searchQuery state when URL parameter changes
  useMemo(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl !== null && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);
      
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#020202] dark:bg-gray-950 text-white min-h-screen pb-32 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Hero Section: Cinematic & Focused */}
      <section className="relative h-[45vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000"
              alt="Tech Background"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/0 via-[#020202]/50 to-[#020202] dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-500/10 backdrop-blur-2xl border border-indigo-500/20 rounded-full mb-8">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.4em]">Arsenal de Elite</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
              O TEU <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">SETUP.</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Explora a nossa coleção curada de tecnologia de ponta. Cada peça foi selecionada para garantir a tua vitória na arena.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        {/* Search & Filter Bar: Glassmorphism */}
        <div className="bg-white/[0.03] dark:bg-white/[0.01] backdrop-blur-3xl border border-white/10 dark:border-white/5 p-4 rounded-[32px] shadow-2xl mb-16">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Pesquisar no arsenal..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setSearchParams(prev => {
                    if (val) prev.set('search', val);
                    else prev.delete('search');
                    return prev;
                  }, { replace: true });
                }}
                className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl focus:outline-none focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-white font-medium placeholder:text-gray-700"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-black/20 dark:bg-black/40 rounded-2xl">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSearchParams(category === 'Todos' ? {} : { category })}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                    activeCategory === category
                      ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative group min-w-[200px]">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 pointer-events-none">
                <SlidersHorizontal size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-16 pr-12 py-5 bg-white/[0.02] border border-white/5 rounded-2xl focus:outline-none focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-white font-bold text-xs uppercase tracking-widest appearance-none cursor-pointer"
              >
                <option value="newest" className="bg-[#050505] dark:bg-gray-900">Data de Lançamento</option>
                <option value="price-low" className="bg-[#050505] dark:bg-gray-900">Preço: Baixo para Alto</option>
                <option value="price-high" className="bg-[#050505] dark:bg-gray-900">Preço: Alto para Baixo</option>
                <option value="rating" className="bg-[#050505] dark:bg-gray-900">Popularidade</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-12 px-4">
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Mostrando</span>
            <span className="text-2xl font-black text-white">{filteredProducts.length}</span>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Resultados</span>
          </div>
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors"
            >
              <X size={14} />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 px-4 text-center"
            >
              <div className="w-24 h-24 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5">
                <Search size={40} className="text-gray-700" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Nenhum Equipamento Encontrado</h3>
              <p className="text-gray-500 max-w-md mx-auto font-light leading-relaxed">
                Não conseguimos encontrar o que procuras no nosso arsenal. Tenta ajustar os teus filtros ou pesquisa por algo diferente.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="mt-12 px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all uppercase text-xs tracking-widest"
              >
                Limpar Todos os Filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
