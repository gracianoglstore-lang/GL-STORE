import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { formatCurrency } from '../utils/format';
import { Package, Truck, CheckCircle2, Clock, ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Orders() {
  const { user, orders, deleteOrder, clearOrders } = useUserStore();
  const { currency } = useSettingsStore();

  if (!user) {
    return <Navigate to="/account" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-orange-500" size={20} />;
      case 'shipped': return <Truck className="text-blue-500" size={20} />;
      case 'delivered': return <CheckCircle2 className="text-emerald-500" size={20} />;
      default: return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 transition-colors duration-300">
      {/* Editorial Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 pt-20 pb-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <Link to="/profile" className="flex items-center text-[10px] font-black text-brand uppercase tracking-[0.3em] hover:underline group">
                  <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Profile
                </Link>
                {orders.length > 0 && (
                  <button 
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja apagar todo o histórico de encomendas?')) {
                        clearOrders();
                      }
                    }}
                    className="flex items-center text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] hover:underline group"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Apagar Tudo
                  </button>
                )}
              </div>
              <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                My <span className="text-brand">Orders.</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                Track and manage your premium acquisitions.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-brand/10 rounded-[2rem] flex items-center justify-center text-brand">
                <Package size={40} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8 mt-8">
        {orders.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
            <div className="w-24 h-24 bg-white dark:bg-gray-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Package size={48} className="text-gray-200 dark:text-gray-800" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">No orders yet.</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Your digital vault is currently empty.</p>
            <Link to="/products" className="px-8 py-4 bg-brand text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform inline-block">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl shadow-black/5 group hover:border-brand/30 transition-all"
              >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Status</p>
                      <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{getStatusText(order.status)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Order ID</p>
                    <span className="text-sm font-black text-gray-900 dark:text-white">#{order.id}</span>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-8">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 object-cover rounded-[2rem] border border-gray-100 dark:border-gray-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter line-clamp-1">{item.name}</h3>
                        <p className="text-sm font-medium text-gray-400">Premium Digital Asset</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(item.price, currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-brand tracking-tighter">{formatCurrency(order.total, currency)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                      title="Apagar Encomenda"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button className="px-8 py-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-brand hover:text-white hover:border-brand transition-all flex items-center space-x-2 group">
                      <span>Track Order</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
