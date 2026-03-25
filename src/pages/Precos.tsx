import { motion } from 'motion/react';
import { CreditCard, Smartphone, Landmark, Globe, CheckCircle2, AlertTriangle, MessageCircle, Download, ShieldCheck, Headphones } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Precos() {
  const { siteName } = useSettingsStore();
  return (
    <div className="min-h-screen bg-white dark:bg-[#020202] text-gray-900 dark:text-white pb-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden bg-indigo-900 dark:bg-indigo-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/payment/1920/1080?blur=4"
            alt="Payment Hero"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-8">
              💳 Pagamento e <span className="text-indigo-400">Entrega</span>
            </h1>
            <p className="text-xl text-indigo-100/80 leading-relaxed">
              Saiba como adquirir seus jogos na {siteName} com total segurança e rapidez.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pagamento em Angola */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">🇦🇴 Pagamento em Angola</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Smartphone className="text-indigo-500" />
                <div>
                  <p className="font-bold">Unitel Money</p>
                  <p className="text-xs text-gray-500">Pagamento móvel instantâneo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <CreditCard className="text-indigo-500" />
                <div>
                  <p className="font-bold">Multicaixa / Express</p>
                  <p className="text-xs text-gray-500">Cartão de débito e aplicativo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Landmark className="text-indigo-500" />
                <div>
                  <p className="font-bold">Transferência Bancária</p>
                  <p className="text-xs text-gray-500">IBAN disponível no checkout</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-500">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Pagamento rápido e seguro</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-500">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Confirmação em poucos minutos</span>
              </div>
            </div>
          </motion.div>

          {/* Pagamento Internacional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">🌍 Pagamento Internacional</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Globe className="text-indigo-500" />
                <div>
                  <p className="font-bold">PayPal</p>
                  <p className="text-xs text-gray-500">Aceito em vários países</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-500">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Pagamento seguro</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-500">
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Conversão automática de moeda</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabela de Preços por Plataforma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">💰 Tabela de Preços</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { platform: 'PS3', price: '1.500 Kz', icon: '🎮' },
              { platform: 'PS2', price: '1.000 Kz', icon: '🎮' },
              { platform: 'PS4', price: 'Sob Consulta', icon: '🎮' },
              { platform: 'PSP', price: '1.000 Kz', icon: '📱' },
              { platform: 'PSVITA', price: '1.500 Kz', icon: '📱' },
              { platform: 'Android', price: '500 Kz - 1.500 Kz', icon: '🤖' },
              { platform: 'PC', price: 'Sob Consulta', icon: '💻' },
              { platform: 'iOS', price: 'Sob Consulta', icon: '🍎' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 transition-all group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-lg font-black uppercase tracking-tighter text-gray-400 mb-1">{item.platform}</h3>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{item.price}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Por cada jogo</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Aviso Importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-red-600 text-white p-8 rounded-[40px] shadow-2xl shadow-red-500/20 text-center"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <AlertTriangle size={48} className="animate-pulse" />
            <h2 className="text-3xl font-black uppercase tracking-tighter">🚨 AVISO IMPORTANTE 🚨</h2>
          </div>
          <div className="space-y-4 text-lg font-bold">
            <p>🔴 É obrigatório enviar o comprovativo de pagamento após realizar a transferência.</p>
            <p>🚫 Sem o comprovativo, o pedido NÃO será processado e o jogo NÃO será entregue.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <a 
                href="https://wa.me/244921291580" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-red-600 px-8 py-4 rounded-2xl flex items-center space-x-2 hover:bg-gray-100 transition-all"
              >
                <MessageCircle size={20} />
                <span>Enviar pelo WhatsApp: 921 291 580</span>
              </a>
              <div className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl flex items-center space-x-2">
                <MessageCircle size={20} />
                <span>Ou pelo Chat do site</span>
              </div>
            </div>
            <p className="text-sm opacity-80 mt-4">Obrigado pela compreensão!</p>
          </div>
        </motion.div>

        {/* Confirmação e Entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <CheckCircle2 className="text-indigo-500" />
              <span>Confirmação de Pagamento</span>
            </h3>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                <span>Enviar comprovativo após pagamento (Obrigatório)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                <span>Sem comprovativo, o jogo NÃO será entregue</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                <span>Tempo de confirmação: Entre 5 a 15 minutos após envio</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <Download className="text-indigo-500" />
              <span>Entrega do Jogo</span>
            </h3>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li className="flex items-center space-x-3">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="font-bold text-gray-900 dark:text-white">Link para download imediato</span>
              </li>
              <li className="flex items-center space-x-3">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="font-bold text-gray-900 dark:text-white">Instalação assistida, se necessário</span>
              </li>
              <li className="flex items-center space-x-3">
                <Headphones className="text-emerald-500" size={20} />
                <span className="font-bold text-gray-900 dark:text-white">Suporte técnico incluído</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
