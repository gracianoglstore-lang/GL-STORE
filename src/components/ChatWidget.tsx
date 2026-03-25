import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../store/useUserStore';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

export default function ChatWidget() {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setConnected(true);
        newSocket.emit('join-user', { name: user?.name || 'Cliente' });
      });

      newSocket.on('receive-message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('send-message', {
        roomId: socket.id,
        message: input,
        sender: 'user'
      });
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-gray-100 mb-4"
          >
            {/* Header */}
            <div className="bg-[#1877F2] p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100" 
                      alt="Suporte" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Dra. Glória</h3>
                  <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Suporte Técnico Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-2">
              <a 
                href="https://wa.me/244921291580" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow flex items-center justify-center space-x-2 bg-[#25D366] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#20bd5b] transition-all shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle size={14} />
                <span>Conversar com Humano</span>
              </a>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Olá! Como podemos ajudar hoje?</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#1877F2] text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                className="flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg border border-gray-200 p-2"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#1877F2] text-white p-4 rounded-full shadow-lg hover:bg-[#166fe5] transition-colors flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
