import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Send, User, Circle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  userName: string;
  messages: Message[];
  lastUpdate: number;
  offline?: boolean;
}

export default function AdminChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-admin');
    });

    newSocket.on('active-chats', (chats: ChatSession[]) => {
      setSessions(chats);
    });

    newSocket.on('new-chat', (chat: ChatSession) => {
      setSessions((prev) => [...prev, chat]);
    });

    newSocket.on('chat-updated', (updatedChat: ChatSession) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedChat.id ? updatedChat : s))
      );
    });

    newSocket.on('receive-message', (message: Message) => {
      // This is handled by chat-updated for admins usually, 
      // but if we are in a specific room we might get it directly
      // For this simple implementation, chat-updated is enough
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSessionId, sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket && activeSessionId) {
      socket.emit('send-message', {
        roomId: activeSessionId,
        message: input,
        sender: 'admin'
      });
      setInput('');
    }
  };

  const selectSession = (id: string) => {
    setActiveSessionId(id);
    socket?.emit('admin-join-chat', id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden flex h-[600px] transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Conversas Ativas</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sessions.length} clientes em linha</p>
        </div>
        <div className="flex-grow overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
              <MessageSquare className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-sm">Nenhuma conversa ativa no momento.</p>
            </div>
          ) : (
            sessions.sort((a, b) => b.lastUpdate - a.lastUpdate).map((session) => (
              <button
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 ${
                  activeSessionId === session.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-r-4 border-r-indigo-600' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User size={24} />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${session.offline ? 'bg-gray-400' : 'bg-green-500'}`} />
                </div>
                <div className="flex-grow text-left overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white truncate">{session.userName}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {session.messages.length > 0 
                        ? new Date(session.messages[session.messages.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.messages.length > 0 
                      ? session.messages[session.messages.length - 1].text 
                      : 'Iniciou conversa'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col bg-gray-50/30 dark:bg-gray-950/30">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{activeSession.userName}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                    <Circle size={8} className={`mr-1 fill-current ${activeSession.offline ? 'text-gray-400' : 'text-green-500'}`} />
                    {activeSession.offline ? 'Offline' : 'Online'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {activeSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-3xl text-sm ${
                      msg.sender === 'admin'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Responda ao cliente..."
                className="flex-grow px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="opacity-20" />
            </div>
            <p className="text-lg font-medium">Selecione uma conversa para começar</p>
            <p className="text-sm">O suporte em tempo real ajuda a fechar mais vendas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
