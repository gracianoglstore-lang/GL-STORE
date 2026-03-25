import React, { useState, useRef } from 'react';
import { MessageSquare, X, Send, Paperclip, ShieldAlert, CheckCircle2, AlertCircle, Clock, RotateCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSupportStore, SupportTicket } from '../store/useSupportStore';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['Pagamentos', 'Conta e Login', 'Jogos', 'Outros'] as const;

export default function FloatingSupport() {
  const { siteName } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'welcome' | 'form' | 'chat' | 'history'>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<SupportTicket['category'] | null>(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<string | null>(null);
  
  const { user } = useUserStore();
  const { addTicket, tickets, addResponse } = useSupportStore();
  
  const userTickets = tickets.filter(t => t.userEmail === user?.email || t.userId === user?.id);
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !message || !subject) {
      toast.error('⚠️ Por favor, preencha todos os campos obrigatórios antes de enviar.');
      return;
    }

    const ticketData = {
      userId: user?.id || 'guest',
      userName: user?.name || 'Visitante',
      userEmail: user?.email || 'visitante@email.com',
      subject,
      category: selectedCategory,
      message,
      attachments: attachment ? [attachment] : [],
    };

    addTicket(ticketData);
    toast.success('✅ Sua solicitação foi enviada com sucesso! Em breve nosso time responderá.');
    setStep('history');
    setMessage('');
    setSubject('');
    setSelectedCategory(null);
    setAttachment(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeTicketId) return;

    addResponse(activeTicketId, {
      sender: 'user',
      message: message.trim(),
      attachments: attachment ? [attachment] : [],
    });

    setMessage('');
    setAttachment(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('❌ Falha ao enviar o arquivo. Tente um arquivo menor ou outro formato.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
        toast.success('✅ Arquivo enviado com sucesso.');
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'in-analysis': return <Clock size={14} className="text-amber-500" />;
      case 'reopened': return <RotateCcw size={14} className="text-blue-500" />;
      default: return <AlertCircle size={14} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: SupportTicket['status']) => {
    switch (status) {
      case 'resolved': return '✅ Resolvido';
      case 'in-analysis': return '⏳ Em análise';
      case 'reopened': return '🔄 Reaberto';
      default: return 'Pendente';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="relative"
            >
              <MessageSquare size={28} />
              {userTickets.some(t => t.status === 'resolved') && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Support Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[100] w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-indigo-600 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Suporte {siteName}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online agora</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setStep('welcome')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 'welcome' ? 'bg-white text-indigo-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Início
                </button>
                <button 
                  onClick={() => setStep('history')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${step === 'history' ? 'bg-white text-indigo-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  Meus Tickets
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              {step === 'welcome' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                      Olá! 👋 Bem-vindo ao suporte da {siteName}.
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                      Como podemos ajudar você hoje? Escolha uma categoria ou abra um ticket para falar com um atendente.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setStep('form');
                        }}
                        className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors mb-4">
                          <HelpCircle size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{cat}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl">
                    <div className="flex items-center space-x-3 mb-2 text-amber-600 dark:text-amber-400">
                      <ShieldAlert size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Aviso de Segurança</span>
                    </div>
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-relaxed">
                      ⚠️ Não compartilhe senhas ou dados bancários aqui. Nosso suporte nunca pedirá estas informações.
                    </p>
                  </div>
                </div>
              )}

              {step === 'form' && (
                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria Selecionada</label>
                    <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                      {selectedCategory}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assunto</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                      placeholder="Ex: Problema com pagamento"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mensagem</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white resize-none"
                      placeholder="Descreva o seu problema detalhadamente..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Anexar Ficheiro (Opcional)</label>
                    <label className="flex items-center justify-center px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                      <div className="flex items-center space-x-3 text-gray-400 group-hover:text-indigo-500">
                        {attachment ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Paperclip size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {attachment ? '✅ Ficheiro Carregado' : 'Carregar Comprovativo/Print'}
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep('welcome')}
                      className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-400 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] px-6 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2"
                    >
                      <Send size={14} />
                      <span>Enviar Ticket</span>
                    </button>
                  </div>
                </form>
              )}

              {step === 'history' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Teus Tickets Anteriores</h4>
                  {userTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <MessageSquare size={32} />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Nenhum ticket encontrado.</p>
                    </div>
                  ) : (
                    userTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          setActiveTicketId(ticket.id);
                          setStep('chat');
                        }}
                        className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 transition-all text-left"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{ticket.category}</span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                              {getStatusText(ticket.status)}
                            </span>
                          </div>
                        </div>
                        <h5 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{ticket.subject}</h5>
                        <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {step === 'chat' && activeTicket && (
                <div className="flex flex-col h-full -mx-8 -my-8">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                    <button onClick={() => setStep('history')} className="text-gray-400 hover:text-indigo-600">
                      <RotateCcw size={18} />
                    </button>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Ticket #{activeTicket.id}</p>
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{activeTicket.subject}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(activeTicket.status)}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Initial Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none">
                        <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
                          {activeTicket.message}
                        </p>
                        {activeTicket.attachments?.[0] && (
                          <img src={activeTicket.attachments[0]} className="mt-3 rounded-xl max-h-40 object-cover" />
                        )}
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-2">
                          {new Date(activeTicket.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Responses */}
                    {activeTicket.responses.map((resp) => (
                      <div key={resp.id} className={`flex ${resp.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                          resp.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed">{resp.message}</p>
                          {resp.attachments?.[0] && (
                            <img src={resp.attachments[0]} className="mt-3 rounded-xl max-h-40 object-cover" />
                          )}
                          <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${resp.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(resp.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                      <label className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-xl cursor-pointer hover:text-indigo-600 transition-colors">
                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                        <Paperclip size={18} className={attachment ? 'text-emerald-500' : ''} />
                      </label>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escreve aqui..."
                        className="flex-grow bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
              <div className="flex items-center justify-center space-x-4">
                <a href="https://wa.me/244921291580" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
                  <MessageSquare size={12} />
                  <span>WhatsApp Direto</span>
                </a>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{siteName} © 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
