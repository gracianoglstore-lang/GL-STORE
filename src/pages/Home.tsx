import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Headphones, Star, Sparkles, Zap, Trophy, Target, UserPlus, User, LogIn, MessageCircle, MapPin, Mail, DollarSign } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../utils/translations';
import { formatCurrency } from '../utils/format';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import TopStores from '../components/TopStores';
import { motion } from 'motion/react';

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const { user } = useUserStore();
  const { language, currency, siteName, siteLogo } = useSettingsStore();
  const { t } = useTranslation(language);

  const categories = CATEGORIES.filter(c => c !== 'Todos' && c !== 'Vídeos');
  const reelProducts = products.filter((p) => p.videoUrl);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20 pt-4 transition-colors duration-300">
      {/* Sticky Auth Banner (Priority 1) */}
      {!user && (
        <div className="sticky top-0 z-[100] w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <User size={24} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Bem-vindo à {siteName}!
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Faça login ou crie sua conta para comprar seus jogos favoritos.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Link 
                to="/account" 
                className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 text-center"
              >
                Login
              </Link>
              <Link 
                to="/account" 
                className="flex-1 sm:flex-none px-8 py-3 bg-rose-600 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 text-center"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-4 mb-12 max-w-7xl mx-auto w-full">
        <div className="relative min-h-[400px] rounded-[3rem] overflow-hidden bg-indigo-950 flex flex-col lg:flex-row shadow-2xl">
          <div className="relative z-10 flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={siteLogo} 
                    alt={`${siteName} Logo`} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-12 h-[1px] bg-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
                  {siteName}
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase">
                Bem-vindo à <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                  {siteName}
                </span>
              </h1>
              
              <p className="text-gray-400 text-base sm:text-lg font-medium mb-12 max-w-md leading-relaxed">
                Jogos para Android, PSP, PS2, PS3, PS4, PSVita e PC com instalação rápida e preços acessíveis na {siteName}.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-500/20">
                  Ver Jogos
                </Link>
                <Link to="/precos" className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all active:scale-95 border border-white/10">
                  Ver Preços
                </Link>
                {!user && (
                  <Link to="/account" className="glass text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95">
                    Entrar na Conta
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 relative min-h-[300px] lg:min-h-full overflow-hidden">
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-neon-lights-4245-large.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/20 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent lg:hidden block" />
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="px-4 mb-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Oferta Limitada
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                🔥 Promoções de <br /> Abertura!
              </h2>
              <p className="text-rose-100 font-medium max-w-md">
                Aproveite descontos de até 70% em jogos selecionados para todas as plataformas.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black tracking-tighter mb-4">70% OFF</div>
              <Link to="/products?promo=true" className="bg-white text-rose-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-50 transition-all shadow-xl">
                Ver Promoções
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}

      {/* Trust Banner */}
      <section className="px-4 mb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-4">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              💳 Pagamento Seguro: PayPay, Unitel Money e PayPal
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center space-x-4">
            <div className="bg-amber-500 p-2 rounded-xl text-white">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
              💡 Compra segura garantida!
            </p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex items-center space-x-4">
            <div className="bg-indigo-500 p-2 rounded-xl text-white">
              <Truck size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400">
              📦 Envio rápido após confirmação de pagamento
            </p>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Destaque</p>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">🎮 Jogos Populares</h2>
          </div>
          <Link to="/products" className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Ver Todos</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Explorar</p>
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
              🎮 Categorias
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <Link 
              key={cat}
              to={`/products?category=${cat}`}
              className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center hover:border-indigo-600 transition-all"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors mb-4">
                <Zap size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Reels Section - Moved Up and Rebranded */}
      {reelProducts.length > 0 && (
        <section className="px-4 mb-24 overflow-hidden max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Gameplay</p>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">🎬 Vídeos de Gameplay</h2>
            </div>
            <Link to="/reels" className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Ver Todos</Link>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4">
            {reelProducts.map((product) => (
              <Link 
                key={product.id}
                to={`/reels?id=${product.id}`}
                className="flex-shrink-0 w-64 aspect-[9/16] relative group rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/40">
                    <Zap size={20} className="text-white fill-white" />
                  </div>
                  <h3 className="text-white font-black uppercase tracking-tighter text-lg leading-tight italic">{product.name}</h3>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Assistir Agora</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Emulators Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center">
              <Trophy size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">📥 Emuladores</h2>
              <p className="text-indigo-100 font-medium">Baixe e instale emuladores para jogar no seu dispositivo.</p>
            </div>
          </div>
          <Link to="/emuladores" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all">Ver Emuladores</Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Profissional</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">🛠️ Serviços</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Instalação de jogos', desc: 'Instalamos seus jogos favoritos com rapidez.', icon: <Zap /> },
              { title: 'Atualização de jogos', desc: 'Mantenha seus jogos sempre na última versão.', icon: <Sparkles /> },
              { title: 'Configuração de emuladores', desc: 'Otimizamos o desempenho no seu dispositivo.', icon: <Target /> },
              { title: 'Suporte técnico', desc: 'Ajuda especializada para qualquer problema.', icon: <Headphones />, link: "https://wa.me/244921291580" },
            ].map((service, i) => (
              service.link ? (
                <a 
                  key={i} 
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-indigo-500 transition-all group block"
                >
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">{service.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{service.desc}</p>
                </a>
              ) : (
                <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">{service.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{service.desc}</p>
                </div>
              )
            ))}
        </div>
      </section>

      {/* Prices Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-[4rem] p-12 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-indigo-600/20 rounded-[2rem] flex items-center justify-center text-indigo-400 mx-auto mb-10">
              <DollarSign size={40} />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-6">💰 Preços</h2>
            <p className="text-gray-400 text-lg font-medium mb-12 max-w-2xl mx-auto">Preços acessíveis com promoções disponíveis. Oferecemos o melhor custo-benefício do mercado.</p>
            <Link to="/precos" className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Ver Tabela de Preços</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Comunidade</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">🌟 O que dizem nossos clientes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'João Manuel', text: 'Excelente serviço! Comprei o jogo para PS4 e recebi o link em menos de 10 minutos. Recomendo a todos.', rating: 5 },
            { name: 'Maria Antónia', text: 'Muito confiável. O suporte pelo WhatsApp me ajudou a configurar o emulador no meu PC. Nota 10!', rating: 5 },
            { name: 'Carlos Bento', text: 'A melhor loja de jogos de Angola. Preços justos e atendimento rápido. Já sou cliente fiel.', rating: 5 },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex text-amber-400 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8 italic">"{testimonial.text}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 font-black text-xs">
                  {testimonial.name.charAt(0)}
                </div>
                <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 mb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] border border-gray-100 dark:border-gray-800">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-12">📞 Contato</h2>
            <div className="space-y-8">
              <a href="https://wa.me/244921291580" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">WhatsApp</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">921 291 580</p>
                </div>
              </a>
              <a href="tel:+244955795999" className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <Headphones size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Ligações</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">955 795 999</p>
                </div>
              </a>
              <a href="https://maps.google.com/?q=Luanda,Angola" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-6 group">
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">📍 Localização</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">Luanda, Angola - Mulenvo</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="bg-indigo-950 p-12 rounded-[4rem] text-white flex flex-col justify-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">ℹ️ Sobre</h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-12">
              A {siteName} é especializada na venda e instalação de jogos para várias plataformas. Nossa missão é proporcionar entretenimento de qualidade com o melhor suporte técnico de Angola.
            </p>
            <Link to="/about" className="text-indigo-400 font-black uppercase tracking-widest text-xs hover:text-white transition-colors flex items-center space-x-3">
              <span>Saiba mais sobre nós</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
