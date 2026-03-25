import React from 'react';
import { useSettingsStore, Currency, Language, Country } from '../store/useSettingsStore';
import { Globe, Truck, Coins, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const countries: Country[] = [
  { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
  { code: 'BR', name: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' },
  { code: 'PT', name: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: 'US', name: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'FR', name: 'França', flag: 'https://flagcdn.com/w40/fr.png' },
];

const languages: { code: Language; name: string }[] = [
  { code: 'pt', name: 'PT' },
  { code: 'en', name: 'EN' },
  { code: 'es', name: 'ES' },
  { code: 'fr', name: 'FR' },
  { code: 'de', name: 'DE' },
];

const currencies: { code: Currency; symbol: string }[] = [
  { code: 'AOA', symbol: 'Kz' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'GBP', symbol: '£' },
];

export default function TopBar() {
  const { language, currency, country, setLanguage, setCurrency, setCountry, siteName } = useSettingsStore();
  const [activeMobileMenu, setActiveMobileMenu] = React.useState<'lang' | 'country' | 'curr' | null>(null);

  const Section = ({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
    <div className={`flex items-center space-x-2 px-4 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        <Icon size={12} className="text-indigo-500" />
        {title}:
      </span>
      <div className="flex items-center gap-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between lg:justify-center">
        
        {/* Desktop View */}
        <div className="hidden lg:flex items-center divide-x divide-white/10">
          <Section title="Idioma" icon={Globe}>
            {languages.map((l) => (
              <button 
                key={l.code} 
                onClick={() => setLanguage(l.code)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                  language === l.code 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {l.name}
              </button>
            ))}
          </Section>

          <Section title="Envio" icon={Truck}>
            {countries.map((c) => (
              <button 
                key={c.code} 
                onClick={() => setCountry(c)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                  country.code === c.code 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {c.code}
              </button>
            ))}
          </Section>

          <Section title="Moeda" icon={Coins}>
            {currencies.map((c) => (
              <button 
                key={c.code} 
                onClick={() => setCurrency(c.code)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                  currency === c.code 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </Section>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setActiveMobileMenu(activeMobileMenu === 'lang' ? null : 'lang')}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-bold border border-white/5"
            >
              <span>{language.toUpperCase()}</span>
              <ChevronDown size={10} />
            </button>
            <button 
              onClick={() => setActiveMobileMenu(activeMobileMenu === 'country' ? null : 'country')}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-bold border border-white/5"
            >
              <span>{country.code}</span>
              <ChevronDown size={10} />
            </button>
            <button 
              onClick={() => setActiveMobileMenu(activeMobileMenu === 'curr' ? null : 'curr')}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-900 text-white text-[10px] font-bold border border-white/5"
            >
              <span>{currencies.find(c => c.code === currency)?.symbol}</span>
              <ChevronDown size={10} />
            </button>
          </div>
          
          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
            {siteName} • GLOBAL
          </div>
        </div>
      </div>

      {/* Mobile Dropdowns */}
      <AnimatePresence>
        {activeMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-gray-900 border-t border-white/5 overflow-hidden"
          >
            <div className="p-4 flex flex-wrap gap-2">
              {activeMobileMenu === 'lang' && languages.map((l) => (
                <button 
                  key={l.code} 
                  onClick={() => { setLanguage(l.code); setActiveMobileMenu(null); }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                    language === l.code 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {l.name}
                </button>
              ))}
              {activeMobileMenu === 'country' && countries.map((c) => (
                <button 
                  key={c.code} 
                  onClick={() => { setCountry(c); setActiveMobileMenu(null); }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                    country.code === c.code 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {c.name} ({c.code})
                </button>
              ))}
              {activeMobileMenu === 'curr' && currencies.map((c) => (
                <button 
                  key={c.code} 
                  onClick={() => { setCurrency(c.code); setActiveMobileMenu(null); }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-200 ${
                    currency === c.code 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {c.symbol} ({c.code})
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
