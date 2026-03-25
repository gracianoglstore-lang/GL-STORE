import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[3rem] p-12 shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-8">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle size={48} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
                Ops! Algo <br /> <span className="text-red-500">correu mal</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Ocorreu um erro inesperado no sistema. Não se preocupe, os seus dados estão seguros.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-left overflow-auto max-h-32">
                <p className="text-[10px] font-mono text-red-500 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 uppercase tracking-widest"
              >
                <RefreshCw size={18} />
                <span>Recarregar Página</span>
              </button>
              
              <a
                href="/"
                className="w-full py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest"
              >
                <Home size={18} />
                <span>Voltar ao Início</span>
              </a>
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Se o problema persistir, contacte o suporte técnico.
            </p>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
