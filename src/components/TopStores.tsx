import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';

export default function TopStores() {
  const { siteName } = useSettingsStore();

  const STORES = [
    {
      id: 'apple',
      name: 'Apple Official',
      logo: 'https://picsum.photos/seed/apple-logo/100/100',
      rating: 4.9,
      followers: '1.2M',
      category: 'Smartphones & Tech',
      color: 'bg-gray-900',
    },
    {
      id: 'garena',
      name: 'Garena Store',
      logo: 'https://picsum.photos/seed/garena-logo/100/100',
      rating: 4.8,
      followers: '850K',
      category: 'Jogos & Créditos',
      color: 'bg-red-600',
    },
    {
      id: 'supercell',
      name: 'Supercell Shop',
      logo: 'https://picsum.photos/seed/supercell-logo/100/100',
      rating: 4.9,
      followers: '2.1M',
      category: 'Jogos Mobile',
      color: 'bg-blue-600',
    },
    {
      id: 'glstore',
      name: `${siteName} Premium`,
      logo: 'https://picsum.photos/seed/glstore-logo/100/100',
      rating: 5.0,
      followers: '500K',
      category: 'Acessórios Gaming',
      color: 'bg-indigo-600',
    }
  ];

  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic">
              Lojas Oficiais
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">As melhores marcas com garantia total</p>
          </div>
          <Link 
            to="/products" 
            className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
          >
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORES.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${store.color} opacity-5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150`} />

              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-lg border-2 border-white dark:border-gray-800">
                  <img 
                    src={store.logo} 
                    alt={store.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex items-center space-x-1 mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{store.name}</h3>
                  <ShieldCheck size={16} className="text-blue-500" />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{store.category}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center text-orange-500 font-bold text-xs">
                    <Star size={12} className="fill-current mr-1" />
                    {store.rating}
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                    {store.followers} Seguidores
                  </div>
                </div>

                <Link
                  to={`/products?search=${store.name.split(' ')[0]}`}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                    index === 0 
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-indigo-500'
                  }`}
                >
                  Visitar Loja
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
