import { Link } from 'react-router-dom';
import { Facebook, MessageCircle, Mail, Phone, MapPin, Sparkles, Instagram, Twitter } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../utils/translations';

export default function Footer() {
  const { language, siteName, siteLogo } = useSettingsStore();
  const { t } = useTranslation(language);

  const [firstName, ...rest] = siteName.split(' ');
  const lastName = rest.join(' ');

  return (
    <footer className="hidden lg:block bg-gray-950 text-white pt-32 pb-16 selection:bg-brand/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="space-y-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-transparent rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 overflow-hidden">
                <img 
                  src={siteLogo} 
                  alt={`${siteName} Logo`} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">
                {firstName} <span className="text-indigo-600">{lastName}</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light max-w-xs">
              A {siteName} é especializada na venda e instalação de jogos para várias plataformas. Sua loja de jogos com instalação rápida e preços acessíveis.
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center space-x-3 text-emerald-400">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Site Verificado</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                Ambiente 100% seguro com criptografia SSL e arquivos de jogos verificados contra vírus.
              </p>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: <Facebook size={18} />, color: 'hover:bg-blue-600', href: 'https://facebook.com' },
                { icon: <Instagram size={18} />, color: 'hover:bg-pink-600', href: 'https://instagram.com' },
                { icon: <Twitter size={18} />, color: 'hover:bg-sky-500', href: 'https://twitter.com' },
                { icon: <MessageCircle size={18} />, color: 'hover:bg-emerald-500', href: 'https://wa.me/244921291580' }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white ${social.color} transition-all duration-500 shadow-xl`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10 opacity-50">Navegação</h4>
            <ul className="space-y-5">
              {[
                { label: 'Início', path: '/' },
                { label: 'Categorias', path: '/products' },
                { label: 'Emuladores', path: '/emuladores' },
                { label: 'Serviços', path: '/servicos' },
                { label: 'Preços', path: '/precos' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-xs text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] font-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10 opacity-50">Support</h4>
            <ul className="space-y-5">
              {[
                { label: 'Help Center', path: '/faq' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Shipping Info', path: '/shipping' }
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-xs text-gray-400 hover:text-brand transition-colors uppercase tracking-[0.2em] font-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-10 opacity-50">Contato Direto</h4>
            <div className="space-y-8">
              {[
                { icon: <MessageCircle size={18} />, text: '921 291 580 (WhatsApp)', color: 'text-emerald-400', href: 'https://wa.me/244921291580' },
                { icon: <Phone size={18} />, text: '955 795 999 (Ligações)', color: 'text-indigo-400', href: 'tel:+244955795999' },
                { icon: <Mail size={18} />, text: 'gracianolupossa14@gmail.com', color: 'text-rose-400', href: 'mailto:gracianolupossa14@gmail.com' },
                { icon: <MapPin size={18} />, text: 'Luanda, Angola', color: 'text-purple-400', href: 'https://maps.google.com/?q=Luanda,Angola' }
              ].map((contact, i) => (
                <a 
                  key={i} 
                  href={contact.href}
                  target={contact.href.startsWith('http') ? "_blank" : undefined}
                  rel={contact.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex items-center space-x-5 group cursor-pointer"
                >
                  <div className={`w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${contact.color} group-hover:bg-white/10 transition-all duration-500`}>
                    {contact.icon}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium tracking-wide">
                    {contact.text}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
            © 2026 {siteName} • Sua loja de jogos em Angola
          </p>
          <div className="flex items-center space-x-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {['VISA', 'MASTERCARD', 'PAYPAL', 'UNITEL MONEY'].map((payment, i) => (
              <span key={i} className={`text-[10px] font-black tracking-[0.3em] text-white ${payment === 'UNITEL MONEY' ? 'text-brand' : ''}`}>
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
