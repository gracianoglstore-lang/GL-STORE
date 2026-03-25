import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useProductStore } from '../store/useProductStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { CATEGORIES } from '../constants';
import { useSupportStore } from '../store/useSupportStore';
import { Package, Users, DollarSign, Plus, Trash2, Edit, Save, X, TrendingUp, MessageSquare, Search, ShoppingCart, Video, CheckCircle, Clock, AlertCircle, Paperclip, Send, Settings, Image as ImageIcon, Check, Download, Upload, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../utils/format';
import AdminChat from '../components/AdminChat';
import toast from 'react-hot-toast';

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve(base64Str);
  });
};

function SupportTicketList() {
  const { tickets, updateTicketStatus, addResponse, deleteTicket } = useSupportStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !response.trim()) return;

    addResponse(selectedTicketId, {
      message: response,
      sender: 'admin'
    });
    
    // Auto update status to in-analysis if it was pending
    if (selectedTicket?.status === 'pending') {
      updateTicketStatus(selectedTicketId, 'in-analysis');
    }

    setResponse('');
    toast.success('Resposta enviada!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[600px]">
      <div className="flex-grow overflow-y-auto">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum ticket pendente.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(ticket => (
              <div key={ticket.id} className={`p-6 transition-colors ${selectedTicketId === ticket.id ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      ticket.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      ticket.status === 'in-analysis' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{ticket.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setSelectedTicketId(selectedTicketId === ticket.id ? null : ticket.id)}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                    >
                      {selectedTicketId === ticket.id ? 'Fechar' : 'Responder'}
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Eliminar este ticket?')) deleteTicket(ticket.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{ticket.subject}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{ticket.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Users size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{ticket.userEmail}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {selectedTicketId === ticket.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                      {ticket.responses.map((res, idx) => (
                        <div key={idx} className={`flex ${res.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] ${
                            res.sender === 'admin' 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                          }`}>
                            {res.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendResponse} className="flex items-center space-x-2">
                      <input 
                        type="text"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Escreva uma resposta..."
                        className="flex-grow px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button 
                        type="submit"
                        disabled={!response.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateTicketStatus(ticket.id, 'in-analysis')}
                          className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          Marcar em Análise
                        </button>
                        <button 
                          onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                          className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                        >
                          Resolver Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, orders, updateOrder, deleteOrder } = useUserStore();

  if (!user || !user.isAdmin) {
    return <Navigate to="/account" replace />;
  }

  const { products, addProduct, updateProduct, deleteProduct, fetchProducts } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'support' | 'reels' | 'settings'>('inventory');
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Check server status
  const checkServerStatus = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
  const [inventorySearch, setInventorySearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const { siteName, siteLogo, currency, enabledPaymentMethods, isMaintenanceMode, setSiteSettings, toggleMaintenanceMode } = useSettingsStore();

  useEffect(() => {
    // Automatically enable maintenance mode when entering admin dashboard
    if (!isMaintenanceMode) {
      setSiteSettings({ isMaintenanceMode: true });
      toast.success('Modo de Pausa ativado automaticamente para edição.', {
        icon: <AlertCircle size={16} className="text-amber-500" />,
        duration: 5000
      });
    }
  }, []);

  const [tempSettings, setTempSettings] = useState({ siteName, siteLogo, enabledPaymentMethods, isMaintenanceMode });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const product = products.find(p => p.id === editId);
      if (product) {
        handleEdit(product);
        // Clear param after opening
        setSearchParams({});
      }
    }
  }, [searchParams, products]);

  const filteredInventory = products.filter(p => 
    (p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(inventorySearch.toLowerCase())) &&
    p.category !== 'Vídeos'
  );

  const filteredReels = products.filter(p => 
    p.category === 'Vídeos' &&
    (p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(inventorySearch.toLowerCase()))
  );

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.paymentMethod?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.status.toLowerCase().includes(orderSearch.toLowerCase())
  );
  
  // New product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: CATEGORIES[1],
    description: '',
    image: 'https://picsum.photos/seed/new/600/600',
    videoUrl: '',
    featured: false,
    platform: '',
    version: '',
    requirements: '',
    androidVersion: '',
    ramRequired: '',
    fileSize: '',
    downloadUrl: ''
  });

  if (!user?.isAdmin) {
    return <Navigate to="/account" replace />;
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto eliminado com sucesso!');
      } catch (error) {
        toast.error('Erro ao eliminar produto.');
      }
    }
  };

  const handleEdit = (product: any) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      videoUrl: product.videoUrl || '',
      featured: product.featured || false,
      platform: product.platform || '',
      version: product.version || '',
      requirements: product.requirements || '',
      androidVersion: product.androidVersion || '',
      ramRequired: product.ramRequired || '',
      fileSize: product.fileSize || '',
      downloadUrl: product.downloadUrl || ''
    });
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (uploadStatus.type === 'loading') {
      toast.error('Aguarde o carregamento do ficheiro terminar.');
      return;
    }

    if (!newProduct.name.trim()) {
      toast.error('O nome do produto é obrigatório.');
      return;
    }
    if (newProduct.price <= 0) {
      toast.error('O preço deve ser superior a zero.');
      return;
    }
    if (!newProduct.description.trim()) {
      toast.error('A descrição é obrigatória.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, newProduct);
        toast.success('Produto atualizado!');
      } else {
        await addProduct(newProduct);
        toast.success('Produto adicionado!');
      }
      closeModal();
    } catch (error) {
      console.error('Erro ao guardar produto:', error);
      toast.error('Ocorreu um erro ao guardar o produto. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setUploadStatus({ type: 'idle' });
    setNewProduct({ name: '', price: 0, category: CATEGORIES[1], description: '', image: 'https://picsum.photos/seed/new/600/600', videoUrl: '', featured: false, platform: '', version: '', requirements: '', fileSize: '', downloadUrl: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Painel de Administração</h1>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400">Gira os seus produtos, encomendas e métricas da loja.</p>
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-zinc-800/50 rounded-full border border-gray-200 dark:border-zinc-700/50">
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'online' ? 'bg-green-500 animate-pulse' : 
                serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-[10px] uppercase tracking-wider font-medium text-gray-600 dark:text-zinc-300">
                Servidor: {serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Verificando...'}
              </span>
              {serverStatus === 'offline' && (
                <button 
                  onClick={checkServerStatus}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  title="Tentar reconectar"
                >
                  <RefreshCw size={10} className="text-gray-400 dark:text-zinc-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMaintenanceMode}
            className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg ${
              isMaintenanceMode 
                ? 'bg-amber-500 text-white shadow-amber-500/30' 
                : 'bg-emerald-500 text-white shadow-emerald-500/30'
            }`}
          >
            <AlertCircle size={16} />
            <span>{isMaintenanceMode ? 'Modo Pausa Ativo' : 'Site em Funcionamento'}</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            <Plus size={20} />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
          }`}
        >
          <Package size={20} />
          <span>Inventário</span>
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'reels'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
          }`}
        >
          <TrendingUp size={20} />
          <span>Reels</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
          }`}
        >
          <ShoppingCart size={20} />
          <span>Encomendas</span>
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'support'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
          }`}
        >
          <MessageSquare size={20} />
          <span>Suporte Técnico</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
          }`}
        >
          <Settings size={20} />
          <span>Configurações</span>
        </button>
      </div>

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-12"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8">Configurações do Sistema</h2>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome do Site</label>
                <input
                  type="text"
                  value={tempSettings.siteName}
                  onChange={(e) => setTempSettings({ ...tempSettings, siteName: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Logo do Site</label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={tempSettings.siteLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={tempSettings.siteLogo}
                      onChange={(e) => setTempSettings({ ...tempSettings, siteLogo: e.target.value })}
                      className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-gray-500"
                      placeholder="URL do Logo"
                    />
                    <label className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error('O logo é demasiado grande (máx 2MB).');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result as string, 400, 400);
                              setTempSettings({ ...tempSettings, siteLogo: compressed });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Plus size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Carregar Novo Logo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Modo de Pausa (Manutenção)</label>
                <div 
                  onClick={() => setTempSettings({ ...tempSettings, isMaintenanceMode: !tempSettings.isMaintenanceMode })}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    tempSettings.isMaintenanceMode 
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500/50' 
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tempSettings.isMaintenanceMode ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {tempSettings.isMaintenanceMode ? 'Site em Pausa' : 'Site em Funcionamento'}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                        {tempSettings.isMaintenanceMode 
                          ? 'Apenas administradores podem aceder ao site.' 
                          : 'Todos os clientes podem navegar e comprar.'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-14 h-8 rounded-full p-1 transition-colors ${tempSettings.isMaintenanceMode ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${tempSettings.isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Métodos de Pagamento Ativos</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'unitel', name: 'UNITELMONEY' },
                    { id: 'paypay', name: 'PayPaY' },
                    { id: 'bank', name: 'Transferência Bancária' },
                    { id: 'paypal', name: 'PayPal' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:border-indigo-500/30 transition-all">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${tempSettings.enabledPaymentMethods.includes(method.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 dark:border-gray-700'}`}>
                        <input 
                          type="checkbox"
                          className="hidden"
                          checked={tempSettings.enabledPaymentMethods.includes(method.id)}
                          onChange={(e) => {
                            const newMethods = e.target.checked 
                              ? [...tempSettings.enabledPaymentMethods, method.id]
                              : tempSettings.enabledPaymentMethods.filter(m => m !== method.id);
                            setTempSettings({ ...tempSettings, enabledPaymentMethods: newMethods });
                          }}
                        />
                        {tempSettings.enabledPaymentMethods.includes(method.id) && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Backup de Dados</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const data = JSON.stringify(products, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${siteName.toLowerCase().replace(/\s+/g, '-')}-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Backup exportado com sucesso!');
                    }}
                    className="flex items-center justify-center space-x-3 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all group"
                  >
                    <Download className="text-emerald-600 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-left">
                      <p className="text-sm font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">Exportar Produtos</p>
                      <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-bold uppercase tracking-widest">Guardar ficheiro JSON</p>
                    </div>
                  </button>

                  <label className="flex items-center justify-center space-x-3 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group cursor-pointer">
                    <Upload className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                    <div className="text-left">
                      <p className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">Importar Produtos</p>
                      <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-bold uppercase tracking-widest">Carregar ficheiro JSON</p>
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const importedProducts = JSON.parse(event.target?.result as string);
                              if (Array.isArray(importedProducts)) {
                                if (window.confirm(`Deseja importar ${importedProducts.length} produtos? Isto irá sincronizar com o servidor.`)) {
                                  for (const p of importedProducts) {
                                    await addProduct(p);
                                  }
                                  toast.success('Produtos importados com sucesso!');
                                  fetchProducts();
                                }
                              } else {
                                toast.error('Ficheiro inválido.');
                              }
                            } catch (err) {
                              toast.error('Erro ao ler ficheiro.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setSiteSettings(tempSettings);
                    toast.success('Configurações guardadas com sucesso!');
                  }}
                  className="px-12 py-5 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center space-x-3"
                >
                  <Save size={18} />
                  <span>Guardar Alterações</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'inventory' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Vendas Totais', value: formatCurrency(12450000, currency), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Produtos', value: products.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { label: 'Clientes', value: '1.240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Crescimento', value: '+15%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Product Management Table */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestão de Inventário</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-400 dark:text-gray-500">{filteredInventory.length} produtos encontrados</span>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center space-x-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Adicionar Novo</span>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar no inventário..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produto</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Categoria</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Preço</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredInventory.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-white">{product.name}</span>
                            {product.videoUrl && (
                              <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400">
                                <Video size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Tem Vídeo</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-4 font-bold text-gray-900 dark:text-white">{formatCurrency(product.price, currency)}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestão de Encomendas</h2>
              <span className="text-sm text-gray-400 dark:text-gray-500">{filteredOrders.length} encomendas encontradas</span>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Pesquisar encomendas..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID / Data</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pagamento</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Estado</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{order.date}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">{order.paymentMethod}</span>
                        {order.proofName && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[150px]">
                              Comprovativo: {order.proofName}
                            </span>
                            <button 
                              onClick={() => {
                                if (window.confirm('Deseja remover o comprovativo de pagamento?')) {
                                  updateOrder(order.id, { proofName: undefined });
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700"
                              title="Remover Comprovativo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-gray-900 dark:text-white">
                      {formatCurrency(order.total, currency)}
                    </td>
                    <td className="px-8 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, e.target.value as any)}
                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500/20 ${
                          order.status === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                          order.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                          order.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-3">
                        <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Ver Detalhes</button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Tem a certeza que deseja eliminar esta encomenda?')) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar Encomenda"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 dark:text-gray-500">Nenhuma encomenda encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestão de Reels</h2>
              <span className="text-sm text-gray-400 dark:text-gray-500">{filteredReels.length} vídeos encontrados</span>
              <div className="mt-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-relaxed">
                  💡 Os vídeos carregados aqui aparecerão na secção "Gameplay" da página inicial e na página de Reels. 
                  Pode carregar ficheiros de vídeo diretamente do seu dispositivo.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar Reels..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => {
                  setNewProduct({
                    name: '',
                    price: 0,
                    category: 'Vídeos',
                    description: '🎬 Gameplay intenso e táticas de guerra.',
                    image: 'https://picsum.photos/seed/reel/600/600',
                    videoUrl: '',
                    featured: true,
                    fileSize: '',
                    downloadUrl: ''
                  });
                  setIsAdding(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-brand text-white text-[10px] font-black rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 uppercase tracking-widest whitespace-nowrap"
              >
                <Plus size={14} />
                <span>Adicionar Reel</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Vídeo</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Preview</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredReels.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      {product.videoUrl ? (
                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
                          <video src={product.videoUrl} className="w-full h-full object-cover" muted />
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sem vídeo</span>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Pendentes</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {useSupportStore.getState().tickets.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Em Análise</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {useSupportStore.getState().tickets.filter(t => t.status === 'in-analysis').length}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Resolvidos</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {useSupportStore.getState().tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <AlertCircle size={20} className="text-indigo-600" />
                <span>Tickets de Suporte</span>
              </h3>
              <SupportTicketList />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <MessageSquare size={20} className="text-indigo-600" />
                <span>Chat em Tempo Real</span>
              </h3>
              <AdminChat />
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="flex justify-between items-center p-10 pb-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={closeModal} 
                  className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  disabled={uploadStatus.type === 'loading'}
                  onClick={() => handleSave()} 
                  className={`px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center space-x-2`}
                >
                  <Save size={14} />
                  <span>Guardar</span>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto p-10 pt-6 custom-scrollbar">
              <form id="product-form" onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nome</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Preço (Kz)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setNewProduct({...newProduct, price: isNaN(val) ? 0 : val});
                    }}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Categoria</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  >
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plataforma</label>
                  <input
                    type="text"
                    placeholder="Ex: Android, PC, PS4"
                    value={newProduct.platform}
                    onChange={(e) => setNewProduct({...newProduct, platform: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Versão</label>
                  <input
                    type="text"
                    placeholder="Ex: v1.0.2"
                    value={newProduct.version}
                    onChange={(e) => setNewProduct({...newProduct, version: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Requisitos</label>
                  <input
                    type="text"
                    placeholder="Ex: 4GB RAM, Android 10+"
                    value={newProduct.requirements}
                    onChange={(e) => setNewProduct({...newProduct, requirements: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Versão Android</label>
                  <input
                    type="text"
                    placeholder="Ex: 10.0+"
                    value={newProduct.androidVersion}
                    onChange={(e) => setNewProduct({...newProduct, androidVersion: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">RAM Necessária</label>
                  <input
                    type="text"
                    placeholder="Ex: 4GB"
                    value={newProduct.ramRequired}
                    onChange={(e) => setNewProduct({...newProduct, ramRequired: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Tamanho do Ficheiro</label>
                  <input
                    type="text"
                    placeholder="Ex: 1.5 GB"
                    value={newProduct.fileSize}
                    onChange={(e) => setNewProduct({...newProduct, fileSize: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Link de Download</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newProduct.downloadUrl}
                    onChange={(e) => setNewProduct({...newProduct, downloadUrl: e.target.value})}
                    className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Imagem do Produto</label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                        {newProduct.image ? (
                          <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="text-gray-300" size={32} />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          placeholder="URL da Imagem"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-gray-500"
                        />
                        <div className="flex space-x-2">
                          <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error('A imagem é demasiado grande (máx 5MB).');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = async () => {
                                    const compressed = await compressImage(reader.result as string);
                                    setNewProduct({...newProduct, image: compressed});
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Plus size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Carregar Ficheiro</span>
                          </label>
                          {newProduct.image && (
                            <button
                              type="button"
                              onClick={() => setNewProduct({...newProduct, image: ''})}
                              className="px-4 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">URL do Vídeo (Opcional)</label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="https://exemplo.com/video.mp4"
                      value={newProduct.videoUrl}
                      onChange={(e) => setNewProduct({...newProduct, videoUrl: e.target.value})}
                      className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all group">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 20 * 1024 * 1024) {
                                toast.error('O vídeo é demasiado grande (máx 20MB). Use um link externo para ficheiros maiores.');
                                return;
                              }
                              setUploadStatus({ type: 'loading' });
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProduct({...newProduct, videoUrl: reader.result as string});
                                setUploadStatus({ type: 'success', message: 'Vídeo carregado com sucesso!' });
                              };
                              reader.onerror = () => {
                                setUploadStatus({ type: 'error', message: 'Erro ao carregar o vídeo.' });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="flex items-center space-x-2 text-gray-400 group-hover:text-indigo-500">
                          {uploadStatus.type === 'loading' ? (
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Plus size={18} />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {uploadStatus.type === 'loading' ? 'A Carregar...' : 'Carregar Ficheiro'}
                          </span>
                        </div>
                      </label>
                      {uploadStatus.type !== 'idle' && (
                        <div className={`text-[10px] font-black uppercase tracking-widest ${
                          uploadStatus.type === 'success' ? 'text-emerald-500' : 
                          uploadStatus.type === 'error' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {uploadStatus.message}
                        </div>
                      )}
                      {newProduct.videoUrl && (
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-gray-100 dark:border-gray-800 flex-shrink-0">
                            <video src={newProduct.videoUrl} className="w-full h-full object-cover" muted />
                          </div>
                          {newProduct.videoUrl.startsWith('data:') && !uploadStatus.message && (
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ficheiro Carregado</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Descrição</label>
                <textarea
                  rows={4}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProduct.featured}
                  onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded-lg focus:ring-indigo-500 border-gray-300 dark:border-gray-700 bg-transparent"
                />
                <label htmlFor="featured" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Destacar este produto na página inicial
                </label>
              </div>
            </form>
            </div>

            {/* Sticky Footer */}
            <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
              <button
                type="button"
                disabled={uploadStatus.type === 'loading' || isSaving}
                onClick={() => handleSave()}
                className={`w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>A guardar...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Guardar Produto</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
