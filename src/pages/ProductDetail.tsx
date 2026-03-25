import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Edit, CheckCircle2, Zap, Download, Maximize2, X, Info } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../utils/translations';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/format';
import { toast } from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const user = useUserStore((state) => state.user);
  const { language, currency } = useSettingsStore();
  const { t } = useTranslation(language);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  
  const currentImage = activeImage || product?.image;

  const relatedProducts = useMemo(() => 
    products.filter((p) => p.category === product?.category && p.id !== id).slice(0, 3),
    [products, product, id]
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Produto não encontrado</h2>
        <Link to="/products" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-32 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-24">
        <Link to="/products" className="inline-flex items-center space-x-3 text-gray-400 hover:text-brand transition-colors mb-16 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Arsenal</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Gallery (Recipe 4: Dark Luxury / Travel) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="relative group aspect-square rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/5">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setIsZoomed(true)}
                className="absolute top-6 right-6 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl"
              >
                <Maximize2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div 
                onClick={() => setActiveImage(product.image)}
                className={`aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border cursor-pointer transition-all group ${activeImage === product.image || !activeImage ? 'border-brand ring-2 ring-brand/20' : 'border-gray-100 dark:border-gray-800'}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              {[...Array(3)].map((_, i) => {
                const imgUrl = `https://picsum.photos/seed/${product.id}-${i}/800/800`;
                return (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(imgUrl)}
                    className={`aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border cursor-pointer transition-all group ${activeImage === imgUrl ? 'border-brand ring-2 ring-brand/20' : 'border-gray-100 dark:border-gray-800'}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${i}`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Info (Recipe 11: SaaS Landing / Split Layout) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <div className="mb-12 relative">
              {user?.isAdmin && (
                <Link 
                  to={`/admin?edit=${product.id}`}
                  className="absolute -top-12 right-0 flex items-center space-x-2 px-6 py-3 bg-brand text-white text-[10px] font-black rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 uppercase tracking-widest"
                >
                  <Edit size={14} />
                  <span>Edit Product</span>
                </Link>
              )}
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-4 py-1.5 bg-brand/10 text-brand text-[10px] font-black rounded-full uppercase tracking-[0.3em]">
                  {product.category}
                </span>
                <div className="h-px flex-grow bg-gray-100 dark:bg-gray-800" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6 uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-6 mb-10">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-brand text-brand' : 'text-gray-200 dark:text-gray-800'} />
                  ))}
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white">{product.rating}</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  ({product.reviewsCount} {language === 'pt' ? 'avaliações' : 'reviews'})
                </span>
              </div>
              
              <p className="text-6xl font-black text-brand tracking-tighter">
                {formatCurrency(product.price, currency)}
              </p>
            </div>

            {product.videoUrl && (
              <div className="mb-12">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Gameplay Preview</p>
                <div className="aspect-video rounded-[2rem] overflow-hidden bg-black border border-gray-100 dark:border-gray-800 shadow-xl">
                  <video 
                    src={product.videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={product.image}
                  />
                </div>
              </div>
            )}

            <div className="space-y-10 mb-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plataforma</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{product.platform || 'Multiplataforma'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamanho</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{product.fileSize || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requisitos</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{product.requirements || 'Padrão'}</p>
                </div>
                {product.androidVersion && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Versão Android</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{product.androidVersion}</p>
                  </div>
                )}
                {product.ramRequired && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RAM Necessária</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{product.ramRequired}</p>
                  </div>
                )}
              </div>

              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {product.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 text-[10px] font-black text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 uppercase tracking-widest">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <Truck size={20} />
                  </div>
                  <span>Entrega Digital Instantânea</span>
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-black text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 uppercase tracking-widest">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <ShieldCheck size={20} />
                  </div>
                  <span>Link Seguro e Ativo</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-6 mt-auto">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-2 border border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-brand transition-colors font-black text-2xl"
                  >
                    -
                  </button>
                  <span className="w-14 text-center font-black text-xl text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-brand transition-colors font-black text-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addItem(product);
                      toast.success('Produto adicionado ao carrinho!', {
                        icon: <CheckCircle2 size={16} className="text-emerald-500" />,
                      });
                    }}
                    className="flex-1 bg-white dark:bg-gray-900 border-2 border-brand text-brand font-black py-6 rounded-[2rem] hover:bg-brand hover:text-white transition-all flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-[10px]"
                  >
                    <ShoppingCart size={20} />
                    <span>{t('addToCart')}</span>
                  </button>
                  <button
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addItem(product);
                      navigate('/checkout');
                    }}
                    className="flex-1 bg-brand text-white font-black py-6 rounded-[2rem] hover:bg-brand-dark transition-all shadow-2xl shadow-brand/30 flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-[10px]"
                  >
                    <Zap size={20} />
                    <span>Comprar Agora</span>
                  </button>
                </div>
              </div>

              {product.downloadUrl && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Arquivo Seguro</p>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sem vírus, apenas jogos oficiais verificados.</p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <a 
                      href={product.downloadUrl}
                    onContextMenu={(e) => {
                      // We don't prevent default, we want them to see the context menu
                      // but we show a toast to guide them
                      toast('Clique com o botão direito e selecione "Salvar link como..."', {
                        icon: <Info size={16} className="text-indigo-600" />,
                        duration: 4000,
                      });
                    }}
                    className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] hover:bg-indigo-700 transition-all flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-600/20"
                  >
                    <Download size={20} />
                    <span>Download Direto</span>
                  </a>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">
                    Botão direito → Salvar link como...
                  </div>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Related Arsenal</h2>
              <div className="h-px flex-grow mx-12 bg-gray-100 dark:bg-gray-800" />
              <Link to="/products" className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-950/95 backdrop-blur-sm"
          >
            <button 
              onClick={() => setIsZoomed(false)}
              className="absolute top-8 right-8 p-4 text-white hover:text-brand transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-3xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
