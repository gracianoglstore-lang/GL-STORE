import React from 'react';
import { ShieldCheck, Truck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Guaranteed() {
  const { siteName } = useSettingsStore();
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 pt-12 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-4 border border-transparent dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-full">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{siteName} Garantido</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Proteção total para as suas compras de jogos</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="mt-1"><Truck className="text-indigo-500" size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Envio Rápido</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📦 Envio rápido após confirmação de pagamento. Receba o link para download em minutos.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1"><ShieldAlert className="text-indigo-500" size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pagamento Seguro</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 Compra segura garantida! Sua transação é protegida e o suporte técnico está sempre disponível.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1"><CheckCircle2 className="text-indigo-500" size={20} /></div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Métodos de Pagamento</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-2">
                <p><span className="font-bold text-indigo-600">Angola:</span> UNITELMONEY, PayPaY</p>
                <p><span className="font-bold text-indigo-600">Outros países:</span> PayPal</p>
                <p className="italic">Todos os pagamentos são seguros e confirmados antes do envio dos jogos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="font-bold mb-2">Como funciona?</h2>
        <p className="text-xs opacity-90 leading-relaxed">
          Após o pagamento, envie o comprovativo pelo WhatsApp ou Chat. Nossa equipe validará em 5-15 minutos e enviará seu jogo imediatamente.
        </p>
        <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold">
          Saber mais
        </button>
      </div>
    </div>
  );
}
