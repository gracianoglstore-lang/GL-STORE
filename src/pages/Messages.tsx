import React from 'react';
import { Search, MessageSquare, Bell, UserCheck, MoreHorizontal } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export default function Messages() {
  const { siteName } = useSettingsStore();
  const chats = [
    { id: 1, name: `Suporte ${siteName}`, message: 'Olá! Como podemos ajudar hoje?', time: '10:30', unread: 1, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Fornecedor Tech', message: 'O seu pedido já foi processado.', time: 'Ontem', unread: 0, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-24 transition-colors duration-300">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-950 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mensagens</h1>
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <UserCheck size={22} />
          <MoreHorizontal size={22} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-around py-4 border-b border-gray-50 dark:border-gray-800">
        <div className="flex flex-col items-center space-y-1">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full text-blue-600 dark:text-blue-400">
            <MessageSquare size={20} />
          </div>
          <span className="text-[10px] text-gray-600 dark:text-gray-400">Chats</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full text-orange-600 dark:text-orange-400">
            <Bell size={20} />
          </div>
          <span className="text-[10px] text-gray-600 dark:text-gray-400">Notificações</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar mensagens..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {chats.map((chat) => (
          <div key={chat.id} className="px-4 py-4 flex items-center space-x-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{chat.time}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.message}</p>
            </div>
            {chat.unread > 0 && (
              <div className="bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
