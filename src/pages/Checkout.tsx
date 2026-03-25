import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Upload, Wallet, Smartphone, ChevronDown, Plus, Info, Mail, MapPin, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils/format';

type PaymentMethod = 'card' | 'paypal' | 'googlepay' | 'paypay' | 'unitel' | 'bank';

export default function Checkout() {
  const navigate = useNavigate();
  const { items: allItems, total, removeSelectedItems, discount, applyDiscount, selectedItems } = useCartStore();
  const items = allItems.filter(item => selectedItems.includes(item.id));
  const { user, addOrder, updateProfile } = useUserStore();
  const { siteName, siteLogo, currency, country: selectedCountry, enabledPaymentMethods } = useSettingsStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (enabledPaymentMethods[0] as PaymentMethod) || 'card'
  );
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const paymentMethodsList = [
    { id: 'unitel', name: 'UNITELMONEY', icon: Smartphone, color: 'text-orange-500', desc: 'Pagamento em Angola' },
    { id: 'paypay', name: 'PayPaY', icon: Wallet, color: 'text-blue-400', desc: 'Pagamento em Angola' },
    { id: 'bank', name: 'Transferência Bancária', icon: CreditCard, color: 'text-emerald-500', desc: 'Multicaixa / Express' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, color: 'text-blue-600', desc: 'Pagamento Internacional' }
  ].filter(method => enabledPaymentMethods.includes(method.id));

  useEffect(() => {
    if (!user) {
      navigate('/account?redirect=/checkout');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || '',
    country: user?.country || selectedCountry.name,
    phone: user?.phone || '',
    state: user?.state || '',
    apartment: user?.apartment || ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        zip: user.zip || prev.zip,
        country: user.country || prev.country,
        state: user.state || prev.state,
        apartment: user.apartment || prev.apartment
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveToProfile && user) {
      updateProfile({
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
        state: formData.state,
        apartment: formData.apartment,
        name: formData.name,
        phone: formData.phone
      });
    }
    setIsEditingAddress(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
      if (error) setError(null);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // For demo purposes, we'll allow all methods without proof
    // but show a toast if it's missing for local methods
    if (['paypay', 'unitel', 'bank'].includes(paymentMethod) && !proofFile) {
      // Just a warning toast instead of a hard block
      import('react-hot-toast').then(t => t.default.success('Simulando envio de comprovativo...'));
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user?.id || 'guest',
      date: new Date().toLocaleDateString(),
      total: total(),
      status: 'pending' as const,
      items: [...items],
      paymentMethod,
      proofName: proofFile?.name
    };
    
    addOrder(newOrder);
    removeSelectedItems();
    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-8 text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Pedido Confirmado!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
          Obrigado pela sua compra. Enviámos um email de confirmação para <span className="font-bold text-gray-900 dark:text-white">{formData.email}</span>.
        </p>
        
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-12 max-w-lg mx-auto text-left space-y-4 shadow-xl shadow-black/5">
          <div className="flex items-center space-x-3 text-brand">
            <ShieldCheck size={24} />
            <h3 className="text-lg font-black uppercase tracking-tighter">Instruções de Recebimento</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            O seu jogo será entregue digitalmente. Após a validação do seu pagamento pela nossa equipa:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
            <li>Receberá um link de download no seu email.</li>
            <li>As instruções de instalação serão enviadas via WhatsApp para o número <span className="font-bold">{formData.phone}</span>.</li>
            <li>Pode acompanhar o status em "Meus Pedidos".</li>
          </ul>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tempo estimado de entrega: 5-15 minutos</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/account"
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Voltar à Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">O seu carrinho está vazio</h2>
        <Link to="/products" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Professional Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 py-6 sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0">
              <img 
                src={siteLogo} 
                alt={siteName} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none uppercase">
                {siteName}
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Premium Gaming Store</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-12">
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 02 of 03</span>
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Secure Payment</span>
              </div>
              <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '66%' }}
                  className="h-full bg-brand"
                />
              </div>
            </div>
            <Link to="/cart" className="w-12 h-12 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-3">Checkout Process</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
            Finalize <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-400">Your Purchase</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-12">
            {/* Delivery Address Section */}
            <section className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <Truck size={120} />
              </div>
              
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center">
                    <Truck size={28} className="text-brand" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Shipping Logistics</h2>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Where should we deliver?</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingAddress(true)}
                  className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-brand transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-brand/30 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Recipient Identity</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{formData.name}</p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center space-x-2">
                      <Mail size={14} className="text-brand/50" />
                      <span>{formData.email}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center space-x-2">
                      <Smartphone size={14} className="text-brand/50" />
                      <span>{formData.phone}</span>
                    </p>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-brand/30 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Destination</p>
                  <div className="flex items-start space-x-4">
                    <MapPin size={20} className="text-brand mt-1 flex-shrink-0" />
                    <p className="text-base text-gray-900 dark:text-white font-black leading-relaxed tracking-tight">
                      {formData.address || 'No address provided'}<br />
                      {formData.apartment && <span className="text-sm text-gray-500">{formData.apartment}<br /></span>}
                      <span className="text-gray-400 font-bold">{formData.city}{formData.state ? `, ${formData.state}` : ''} {formData.zip}</span><br />
                      <span className="text-brand">{formData.country}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Methods Section */}
            <section className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <CreditCard size={120} />
              </div>

              <div className="flex items-center space-x-6 mb-12">
                <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center">
                  <CreditCard size={28} className="text-brand" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Payment Gateway</h2>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Select your preferred method</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {paymentMethodsList.map((method) => (
                  <label 
                    key={method.id}
                    className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-500 flex items-center space-x-6 group/item ${
                      paymentMethod === method.id 
                        ? 'border-brand bg-brand/5 shadow-xl shadow-brand/5' 
                        : 'border-gray-100 dark:border-gray-800 hover:border-brand/20 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === method.id} 
                      onChange={() => setPaymentMethod(method.id as PaymentMethod)}
                      className="hidden" 
                    />
                    <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-500 ${method.color}`}>
                      <method.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{method.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{method.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      paymentMethod === method.id ? 'bg-brand border-brand' : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      {paymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Details for Local Methods */}
              <AnimatePresence>
                {['paypay', 'unitel', 'bank', 'paypal'].includes(paymentMethod) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-8"
                  >
                    <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                          <Info size={18} className="text-brand" />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Instructions</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {paymentMethod === 'unitel' && (
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">UNITELMONEY Number</p>
                              <p className="text-lg font-black text-indigo-600 tracking-tight">921291580</p>
                            </div>
                          )}
                          {paymentMethod === 'paypay' && (
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PayPaY Number</p>
                              <p className="text-lg font-black text-indigo-600 tracking-tight">921291580</p>
                            </div>
                          )}
                          {paymentMethod === 'bank' && (
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IBAN BAI (Multicaixa)</p>
                              <p className="text-lg font-black text-indigo-600 tracking-tight">AO06 0040 0000 7821 2915 1018 0</p>
                            </div>
                          )}
                          {paymentMethod === 'paypal' && (
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PayPal Email</p>
                              <p className="text-lg font-black text-indigo-600 tracking-tight">gracianosite@gmail.com</p>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="proof-upload"
                          />
                          <label
                            htmlFor="proof-upload"
                            className={`flex flex-col items-center justify-center w-full h-32 px-6 transition bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl cursor-pointer hover:border-brand ${
                              proofFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {proofFile ? (
                              <div className="flex flex-col items-center space-y-2">
                                <CheckCircle2 size={24} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate max-w-[200px]">{proofFile.name}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center space-y-2">
                                <Upload size={24} className="text-gray-400" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload Proof</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Order Review Section */}
            <section className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <ShieldCheck size={120} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-12 tracking-tighter uppercase">Order Manifest</h2>
              <div className="space-y-10">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-8 group/item">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-800 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-brand text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight uppercase">{item.name}</h3>
                        <p className="text-xl font-black text-brand tracking-tighter ml-4">{formatCurrency(item.price * item.quantity, currency)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Price: {formatCurrency(item.price, currency)}</span>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <span className="text-[10px] font-black text-brand uppercase tracking-widest">In Stock</span>
                      </div>
                      <div className="mt-4 flex items-center space-x-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <ShieldCheck size={12} />
                        <span>Authenticity Guaranteed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 space-y-6">
              <div className="bg-gray-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-10 border border-white/5 relative overflow-hidden">
                {/* Atmospheric Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-12">Financial <br /> <span className="text-brand">Summary</span></h2>
                  
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Gross Subtotal</span>
                      <span className="text-xl font-black tracking-tighter">{formatCurrency(total(), currency)}</span>
                    </div>
                    
                    {/* Promo Code in Checkout */}
                    <div className="mb-12 space-y-6">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1">Promotional Code</label>
                      <div className="flex space-x-4">
                        <input 
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE"
                          className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-brand transition-all font-black text-xs tracking-[0.2em] text-white"
                        />
                        <button 
                          onClick={async () => {
                            setIsApplyingCoupon(true);
                            const t = await import('react-hot-toast');
                            setTimeout(() => {
                              const success = applyDiscount(couponCode);
                              if (success) {
                                t.default.success('Cupão aplicado com sucesso!');
                              } else {
                                t.default.error('Cupão inválido.');
                              }
                              setIsApplyingCoupon(false);
                            }, 1000);
                          }}
                          disabled={!couponCode || isApplyingCoupon}
                          className="px-10 py-5 bg-white text-gray-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-brand hover:text-white transition-all disabled:opacity-50 active:scale-95"
                        >
                          {isApplyingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-8 mb-12">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Gross Subtotal</span>
                        <span className="text-xl font-black tracking-tighter text-white">
                          {formatCurrency(items.reduce((acc, item) => acc + item.price * item.quantity, 0), currency)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Estimated Savings</span>
                          <span className="text-emerald-400 font-black tracking-tighter">
                            -{formatCurrency(items.reduce((acc, item) => acc + item.price * item.quantity, 0) * discount, currency)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Logistics & Handling</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">Complimentary</span>
                          <Info size={12} className="text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-white/10">
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <span className="text-white font-black text-4xl tracking-tighter uppercase leading-none">Total Geral</span>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Taxas Incluídas</p>
                      </div>
                      <span className="text-5xl font-black text-brand tracking-tighter">
                        {formatCurrency(total(), currency)}
                      </span>
                    </div>

                    {/* Aviso Importante Obrigatório */}
                    <div className="mb-8 bg-red-600 text-white p-6 rounded-3xl text-center space-y-3 shadow-xl shadow-red-500/20">
                      <p className="text-xs font-black uppercase tracking-tighter">🚨 AVISO IMPORTANTE 🚨</p>
                      <p className="text-[10px] font-bold leading-tight">
                        🔴 É obrigatório enviar o comprovativo de pagamento após realizar a transferência.<br/>
                        🚫 Sem o comprovativo, o pedido NÃO será processado e o jogo NÃO será entregue.<br/>
                        📱 Envie pelo WhatsApp: 921 291 580 ou pelo Chat do site.
                      </p>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center space-x-4 text-rose-400"
                        >
                          <Info size={20} className="flex-shrink-0" />
                          <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-brand text-white font-black py-8 rounded-[2.5rem] text-2xl hover:bg-brand-dark transition-all flex items-center justify-center shadow-2xl shadow-brand/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {isProcessing ? (
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center space-x-6">
                          <span className="uppercase tracking-tighter">PAGAR AGORA</span>
                          <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="mt-12 space-y-8">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-[10px] text-gray-500 leading-relaxed font-bold text-center uppercase tracking-widest">
                        By authorizing this transaction, you acknowledge our <span className="text-brand cursor-pointer hover:underline">Legal Terms</span> and <span className="text-brand cursor-pointer hover:underline">Privacy Protocol</span>.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span>Pagamento Seguro e Protegido</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
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

      {/* Address Editing Modal */}
      <AnimatePresence>
        {isEditingAddress && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Adicionar Novo Endereço</h2>
                <button onClick={() => setIsEditingAddress(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveAddress} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src="https://flagcdn.com/w40/ao.png" alt="Angola" className="w-full h-full object-cover" />
                    </div>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest"
                    >
                      <option value="Angola">Angola</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Brasil">Brasil</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Informações pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <input 
                          type="text"
                          name="name"
                          placeholder="Nome de contato*"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                        />
                        <p className="text-[8px] text-rose-500 font-bold uppercase tracking-widest ml-1">Favor adicionar um nome para contato</p>
                      </div>
                      <div className="space-y-1">
                        <input 
                          type="text"
                          name="phone"
                          placeholder="Número de celular*"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                        />
                        <p className="text-[8px] text-rose-500 font-bold uppercase tracking-widest ml-1">Favor adicione números e/ou hifen "-" e/ou barras "/" somente</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <input 
                          type="text"
                          name="address"
                          placeholder="Número, piso, apart.,etc.*"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <input 
                          type="text"
                          name="apartment"
                          placeholder="Apto, conjunto, unidade, etc."
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                        />
                      </div>
                      <input 
                        type="text"
                        name="state"
                        placeholder="Estado"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                      />
                      <input 
                        type="text"
                        name="city"
                        placeholder="Cidade*"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                      />
                      <input 
                        type="text"
                        name="zip"
                        placeholder="CEP*"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${saveToProfile ? 'bg-brand border-brand' : 'border-gray-200 dark:border-gray-700'}`}>
                      <input 
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        className="hidden"
                      />
                      {saveToProfile && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Definir como endereço de entrega padrão</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-brand text-white font-black rounded-2xl text-lg hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 uppercase tracking-tighter"
                  >
                    Guardar
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="flex-1 py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase tracking-tighter"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
