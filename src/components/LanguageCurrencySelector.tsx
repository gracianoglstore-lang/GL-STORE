import { useState } from 'react';
import { useSettingsStore, Currency, Language, Country } from '../store/useSettingsStore';
import { Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const countries: Country[] = [
  { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
  { code: 'PT', name: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: 'BR', name: 'Brasil', flag: 'https://flagcdn.com/w40/br.png' },
  { code: 'US', name: 'Estados Unidos', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'MZ', name: 'Moçambique', flag: 'https://flagcdn.com/w40/mz.png' },
  { code: 'CV', name: 'Cabo Verde', flag: 'https://flagcdn.com/w40/cv.png' },
  { code: 'NA', name: 'Namíbia', flag: 'https://flagcdn.com/w40/na.png' },
  { code: 'ZA', name: 'África do Sul', flag: 'https://flagcdn.com/w40/za.png' },
  { code: 'CD', name: 'R.D. Congo', flag: 'https://flagcdn.com/w40/cd.png' },
  { code: 'CN', name: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: 'GB', name: 'Reino Unido', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: 'FR', name: 'França', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'DE', name: 'Alemanha', flag: 'https://flagcdn.com/w40/de.png' },
  { code: 'IT', name: 'Itália', flag: 'https://flagcdn.com/w40/it.png' },
  { code: 'ES', name: 'Espanha', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'JP', name: 'Japão', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: 'RU', name: 'Rússia', flag: 'https://flagcdn.com/w40/ru.png' },
  { code: 'NG', name: 'Nigéria', flag: 'https://flagcdn.com/w40/ng.png' },
  { code: 'GH', name: 'Gana', flag: 'https://flagcdn.com/w40/gh.png' },
  { code: 'KE', name: 'Quênia', flag: 'https://flagcdn.com/w40/ke.png' },
  { code: 'ST', name: 'S. Tomé e Príncipe', flag: 'https://flagcdn.com/w40/st.png' },
  { code: 'GW', name: 'Guiné-Bissau', flag: 'https://flagcdn.com/w40/gw.png' },
  { code: 'GQ', name: 'Guiné Equatorial', flag: 'https://flagcdn.com/w40/gq.png' },
];

const languages: { code: Language; name: string }[] = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
];

const currencies: { code: Currency; name: string }[] = [
  { code: 'AOA', name: 'Kwanza' },
  { code: 'USD', name: 'Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'BRL', name: 'Real' },
];

export default function LanguageCurrencySelector() {
  const { language, currency, country, setLanguage, setCurrency, setCountry } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for the form before confirming
  const [tempCountry, setTempCountry] = useState(country);
  const [tempLang, setTempLang] = useState(language);
  const [tempCurr, setTempCurr] = useState(currency);

  const [activeDropdown, setActiveDropdown] = useState<'country' | 'lang' | 'curr' | null>(null);

  const handleConfirm = () => {
    setCountry(tempCountry);
    setLanguage(tempLang);
    setCurrency(tempCurr);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTempCountry(country);
          setTempLang(language);
          setTempCurr(currency);
        }}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium text-gray-700"
      >
        <img src={country.flag} alt={country.name} className="w-4 h-2.5 object-cover rounded-sm" referrerPolicy="no-referrer" />
        <span className="uppercase">{language}</span>
        <span className="mx-1 text-gray-300">|</span>
        <span className="uppercase">{currency}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 p-6 space-y-6"
            >
              {/* Enviar para */}
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-900 block">Enviar para</label>
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={tempCountry.flag} alt={tempCountry.name} className="w-6 h-4 object-cover rounded-sm shadow-sm" referrerPolicy="no-referrer" />
                      <span className="text-sm font-medium text-gray-700">{tempCountry.name}</span>
                    </div>
                    <ChevronDown size={18} className="text-gray-400" />
                  </button>
                  {activeDropdown === 'country' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden py-1">
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setTempCountry(c); setActiveDropdown(null); }}
                          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                        >
                          <img src={c.flag} alt={c.name} className="w-4 h-2.5 object-cover rounded-sm" referrerPolicy="no-referrer" />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Idioma */}
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-900 block">Idioma</label>
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {languages.find(l => l.code === tempLang)?.name}
                    </span>
                    <ChevronDown size={18} className="text-gray-400" />
                  </button>
                  {activeDropdown === 'lang' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden py-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setTempLang(l.code); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left"
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Moeda */}
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-900 block">Moeda</label>
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'curr' ? null : 'curr')}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {tempCurr} ( {currencies.find(c => c.code === tempCurr)?.name} )
                    </span>
                    <ChevronDown size={18} className="text-gray-400" />
                  </button>
                  {activeDropdown === 'curr' && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden py-1">
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setTempCurr(c.code); setActiveDropdown(null); }}
                          className="w-full px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 text-left"
                        >
                          {c.code} ( {c.name} )
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmar Button */}
              <button
                onClick={handleConfirm}
                className="w-full bg-[#141414] text-white font-bold py-4 rounded-full hover:bg-black transition-all active:scale-[0.98] mt-4"
              >
                Confirmar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
