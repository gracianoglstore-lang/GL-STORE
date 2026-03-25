import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4 transform -rotate-6">
          <Lock className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bem-vindo</h2>
        <p className="text-gray-500 mt-2 font-medium">Acesse sua conta para continuar</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold flex items-center space-x-3"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <Mail size={20} />
            </div>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Senha</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <Lock size={20} />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
              placeholder="Sua senha secreta"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center shadow-xl shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <span className="flex items-center space-x-2">
              <span>Entrar</span>
            </span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 font-medium">
          Não tem uma conta? 
          <button className="ml-2 font-black text-indigo-600 hover:underline">
            Criar conta
          </button>
        </p>
      </div>
    </div>
  );
}
