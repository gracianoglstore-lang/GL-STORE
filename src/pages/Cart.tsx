import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, Heart, Search, ChevronRight, Info, Lock, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils/format';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { items, savedItems, removeItem, updateQuantity, saveForLater, moveToCart, removeSavedItem, clearCart, discount, applyDiscount, selectedItems, toggleSelectItem, toggleSelectAll } = useCartStore();
  const { user } = useUserStore();
  const { siteName, currency, language } = useSettingsStore();
  const { t } = useTranslation(language);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const removeSelected = () => {
    selectedItems.forEach(id => removeItem(id));
  };

  const selectedTotal = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const freeShippingThreshold = 50000; // Example threshold in AOA
  const shippingProgress = Math.min((selectedTotal / freeShippingThreshold) * 100, 100);

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="inline-block p-8 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 text-gray-400 dark:text-gray-500">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{t('emptyCart')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-md mx-auto leading-relaxed">
          Parece que ainda não adicionou nada ao seu carrinho. Explore a nossa coleção e encontre algo especial para si na {siteName}.
        </p>
        <Link
          to="/products"
          className="px-12 py-4 bg-[#1877F2] text-white font-black rounded-2xl hover:bg-[#166fe5] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          Explorar Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-3">Your Selection</p>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
              Shopping <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-400">Inventory</span>
            </h1>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Items</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{items.length}</span>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cart Value</span>
              <span className="text-3xl font-black text-brand tracking-tighter">{formatCurrency(selectedTotal, currency)}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Shipping Progress - Recipe 8: Minimal Utility */}
            {items.length > 0 && (
              <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                  <Truck size={100} />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center">
                      <Truck size={24} className="text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Logistics Status</h2>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Free shipping threshold</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                    {shippingProgress >= 100 
                      ? 'Complimentary Shipping Active' 
                      : `${formatCurrency(freeShippingThreshold - selectedTotal, currency)} remaining`}
                  </span>
                </div>
                
                <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Standard</span>
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Premium Free</span>
                </div>
              </section>
            )}

            {items.length > 0 && (
              <div className="space-y-6">
                {/* Selection Bar */}
                <div className="bg-white dark:bg-gray-900 px-8 py-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800">
                  <label className="flex items-center space-x-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === items.length}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded-lg border-gray-200 dark:border-gray-700 text-brand focus:ring-brand cursor-pointer transition-all bg-transparent"
                    />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Select All</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={removeSelected}
                      disabled={selectedItems.length === 0}
                      className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Remove Selected
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                    <button 
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja apagar tudo no carrinho?')) {
                          clearCart();
                        }
                      }}
                      className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-all"
                    >
                      Apagar Tudo
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-8">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-gray-900 p-8 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 relative overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row gap-10">
                          <div className="flex items-start space-x-8">
                            <div className="pt-4">
                              <input 
                                type="checkbox" 
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="w-6 h-6 rounded-xl border-gray-200 dark:border-gray-700 text-brand focus:ring-brand cursor-pointer transition-all bg-transparent"
                              />
                            </div>
                            <Link to={`/product/${item.id}`} className="w-48 h-56 rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-800 relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-4 right-4 glass w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg">
                                {item.quantity}
                              </div>
                            </Link>
                          </div>

                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start gap-8">
                                <Link to={`/product/${item.id}`} className="flex-1">
                                  <h3 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-2 hover:text-brand transition-colors leading-none tracking-tighter uppercase">
                                    {item.name}
                                  </h3>
                                  <div className="flex items-center space-x-4 mt-4">
                                    <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{item.category}</span>
                                    <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU: {item.id.slice(0, 8)}</span>
                                  </div>
                                </Link>
                                <div className="flex items-center space-x-3">
                                  <button 
                                    onClick={() => saveForLater(item.id)}
                                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all duration-500"
                                  >
                                    <Heart size={22} />
                                  </button>
                                  <button 
                                    onClick={() => removeItem(item.id)}
                                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-500"
                                  >
                                    <Trash2 size={22} />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-8">
                                <div className="flex items-baseline space-x-4">
                                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{formatCurrency(item.price, currency)}</span>
                                  <span className="text-sm text-gray-400 line-through font-bold">{formatCurrency(item.price * 1.2, currency)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-10 flex items-center justify-between">
                              <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] p-2 border border-gray-100 dark:border-gray-700">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md rounded-2xl transition-all"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="w-16 text-center text-lg font-black text-gray-900 dark:text-white tracking-tighter">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md rounded-2xl transition-all"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Subtotal Value</p>
                                <p className="text-3xl font-black text-brand tracking-tighter leading-none">{formatCurrency(item.price * item.quantity, currency)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <div className="mt-20 space-y-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <Heart className="text-rose-500 fill-rose-500" size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Saved for Later</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex space-x-6 group"
                    >
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">{item.name}</h4>
                          <p className="text-xl font-black text-brand mt-2 tracking-tighter">{formatCurrency(item.price, currency)}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => moveToCart(item.id)}
                            className="flex-1 py-3 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                          >
                            Add to Bag
                          </button>
                          <button 
                            onClick={() => removeSavedItem(item.id)}
                            className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 space-y-6">
              {/* Summary Card - Recipe 4: Dark Luxury */}
              <div className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-10 border border-white/5 relative overflow-hidden">
                {/* Atmospheric Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-12">Order <br /> <span className="text-brand">Valuation</span></h2>

                  {/* Promo Code */}
                  <div className="space-y-6 mb-12">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Promotional Code</label>
                    <div className="flex space-x-4">
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-brand transition-all font-black text-xs tracking-[0.2em]"
                      />
                      <button 
                        onClick={() => {
                          setIsApplyingPromo(true);
                          setTimeout(() => {
                            const success = applyDiscount(promoCode);
                            if (success) {
                              toast.success('Cupão aplicado com sucesso! (10% de desconto)');
                            } else {
                              toast.error('Cupão inválido.');
                            }
                            setIsApplyingPromo(false);
                          }, 1000);
                        }}
                        disabled={!promoCode || isApplyingPromo}
                        className="px-10 py-5 bg-white text-gray-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand hover:text-white transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isApplyingPromo ? '...' : 'Apply'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Gross Subtotal</span>
                      <span className="text-xl font-black tracking-tighter">{formatCurrency(selectedTotal, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Estimated Savings</span>
                      <span className="text-emerald-400 font-black tracking-tighter">-{formatCurrency(selectedTotal * discount, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Logistics</span>
                      <span className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">Complimentary</span>
                    </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-white/10">
                    <div className="flex justify-between items-end mb-12">
                      <div>
                        <span className="text-white font-black text-4xl tracking-tighter uppercase leading-none">Net Total</span>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Final amount in {currency}</p>
                      </div>
                      <span className="text-5xl font-black text-brand tracking-tighter">
                        {formatCurrency(selectedTotal * (1 - discount), currency)}
                      </span>
                    </div>

                    <Link
                      to={user ? "/checkout" : "/account?redirect=/checkout"}
                      className={`w-full py-8 rounded-[2.5rem] font-black text-2xl transition-all flex items-center justify-center space-x-6 shadow-2xl group ${
                        selectedItems.length > 0 
                          ? 'bg-brand text-white hover:bg-brand-dark shadow-brand/40 active:scale-95' 
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      <span className="uppercase tracking-tighter">Checkout Now</span>
                      <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>

                  <div className="mt-12 flex items-center justify-center space-x-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Secure Transaction Protocol</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                <span className="text-[10px] font-black tracking-[0.3em]">VISA</span>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                <span className="text-[10px] font-black tracking-[0.3em]">MASTERCARD</span>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
                <span className="text-[10px] font-black tracking-[0.3em]">PAYPAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
