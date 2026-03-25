import React, { FormEvent } from 'react';
import { Mail, MapPin, Send, Facebook, MessageCircle, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

import { useSettingsStore } from '../store/useSettingsStore';

export default function Contact() {
  const { siteName, country: selectedCountry } = useSettingsStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success('Mensagem enviada com sucesso! Nossa equipe entrará em contacto em breve.', {
      icon: <CheckCircle2 size={16} className="text-emerald-500" />,
      duration: 5000,
    });
    // Reset form would normally happen here
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202] text-gray-900 dark:text-white selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Hero Section: Editorial Style */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80&w=2000"
              alt="Contact Hero"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 dark:from-[#020202]/0 via-white/80 dark:via-[#020202]/80 to-white dark:to-[#020202]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-500/10 backdrop-blur-2xl border border-indigo-500/20 rounded-full mb-12">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.4em]">Suporte de Elite</span>
            </div>
            
            <h1 className="text-[80px] md:text-[140px] font-black tracking-tighter leading-[0.8] mb-12">
              {useSettingsStore.getState().siteName}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">ONLINE.</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed font-light">
              Nossa equipe está pronta para te apoiar. Seja para suporte técnico ou informações sobre jogos e emuladores, estamos à distância de um clique. Use também o botão flutuante no canto inferior para suporte em tempo real.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="group flex items-start space-x-8">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-all duration-500">
                    <Phone size={28} className="text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">Ligações</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">955 795 999</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Atendimento por voz disponível.</p>
                  </div>
                </div>

                <a 
                  href="https://wa.me/244921291580" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-start space-x-8"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 transition-all duration-500">
                    <MessageCircle size={28} className="text-emerald-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">WhatsApp</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-emerald-400 transition-colors">921 291 580</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Atendimento rápido via chat.</p>
                  </div>
                </a>

                <div className="group flex items-start space-x-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 transition-all duration-500">
                    <Mail size={28} className="text-rose-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">E-mail</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-rose-400 transition-colors">gracianolupossa14@gmail.com</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Resposta em até 24 horas.</p>
                  </div>
                </div>

                <div className="group flex items-start space-x-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-all duration-500">
                    <MapPin size={28} className="text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-2">Localização</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-purple-400 transition-colors">Luanda, Angola</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Sede principal da {siteName}.</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-gray-100 dark:border-white/5">
                <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] mb-8">Redes de Comunicação</h4>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-indigo-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500"><Facebook size={24} /></a>
                  <a href="https://wa.me/244921291580" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-emerald-500 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500"><MessageCircle size={24} /></a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] dark:bg-white/[0.02] bg-gray-50 dark:backdrop-blur-3xl p-12 rounded-[60px] border border-gray-100 dark:border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Identificação</label>
                    <input
                      type="text"
                      required
                      className="w-full px-8 py-5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:bg-gray-50 dark:focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-700"
                      placeholder="O teu nome"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Canal de Resposta</label>
                    <input
                      type="email"
                      required
                      className="w-full px-8 py-5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:bg-gray-50 dark:focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-700"
                      placeholder="teu@email.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Objetivo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-8 py-5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:bg-gray-50 dark:focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-700"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] ml-1">Relatório Detalhado</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-8 py-5 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:bg-gray-50 dark:focus:bg-white/[0.05] focus:border-indigo-500/50 transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-700 resize-none"
                    placeholder="Escreve aqui a tua mensagem..."
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full bg-indigo-600 dark:bg-white text-white dark:text-black font-black py-6 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-500 flex items-center justify-center space-x-4 shadow-xl shadow-indigo-500/20 dark:shadow-white/5"
                >
                  <span className="uppercase tracking-[0.3em] text-sm">Enviar Relatório</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
