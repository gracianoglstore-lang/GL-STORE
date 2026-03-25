import { motion } from 'motion/react';
import { Target, Eye, Heart, Users, Award, Globe, RefreshCcw } from 'lucide-react';

import { useSettingsStore } from '../store/useSettingsStore';

export default function About() {
  const { country: selectedCountry, siteName } = useSettingsStore();

  return (
    <div className="space-y-24 pb-24 transition-colors duration-300">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-indigo-900 dark:bg-indigo-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/office/1920/1080?blur=4"
            alt="About Hero"
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
              🏪 Sobre a <span className="text-indigo-400">{siteName}</span>
            </h1>
            <p className="text-xl text-indigo-100/80 leading-relaxed">
              Bem-vindo à {siteName}! Aqui você encontra jogos para celular, PSP, PS2, PS3, PS4, PS Vita e PC, de forma segura e rápida.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Segurança e Garantia</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              Todos os pagamentos são protegidos e garantidos. Nosso atendimento está disponível via WhatsApp, telefone e e-mail para tirar qualquer dúvida.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nossas Plataformas</h3>
              <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                <li>Android & iOS (Celular)</li>
                <li>PC Gaming</li>
                <li>PlayStation (PS2, PS3, PS4)</li>
                <li>Portáteis (PSP, PS VITA)</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100%</p>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Seguro e Protegido</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Rápido</p>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Envio Confiável</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl shadow-indigo-500/10"
          >
            <img
              src="https://picsum.photos/seed/glstore/1000/1000"
              alt={siteName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🌐 O que você encontra no site da {siteName}</h2>
            <p className="text-gray-500 dark:text-gray-400">Uma experiência de compra completa e pensada em você.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Catálogo de Produtos</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Produtos organizados por categorias para facilitar sua busca.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Sistema de Pesquisa</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Encontre rapidamente o que procura com filtros avançados.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Descrição Detalhada</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Informações completas, imagens e especificações de cada item.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Pagamento Seguro</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Diversas formas de pagamento com total segurança e criptografia.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Rastreamento</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Acompanhe sua compra em tempo real desde o envio até a entrega.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-start space-x-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-600 dark:text-blue-400"><RefreshCcw size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Site Responsivo</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compatível com celular, tablet e computador para sua comodidade.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nossa Missão</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Oferecer produtos de qualidade com preços acessíveis, garantindo satisfação, confiança e comodidade para nossos clientes.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visão</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Ser a referência em e-commerce em {selectedCountry.name}, reconhecida pela inovação, rapidez na entrega e excelência no atendimento personalizado.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-6"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Valores</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Praticidade, Qualidade, Segurança, Transparência e Foco Total na Satisfação do Cliente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team/Culture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-16">O que nos move</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Comunidade</h4>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Qualidade</h4>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <Globe size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Sustentabilidade</h4>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <RefreshCcw size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Inovação</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
