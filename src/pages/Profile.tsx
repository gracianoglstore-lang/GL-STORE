import React, { useState, useRef } from 'react';
import { useUserStore } from '../store/useUserStore';
import { 
  Headphones, 
  Settings, 
  Ticket, 
  Wallet, 
  MapPin, 
  MessageSquare, 
  FileText, 
  Receipt, 
  Layers, 
  UserPlus, 
  ChevronRight,
  LogOut,
  Package,
  Clock,
  CreditCard,
  Heart,
  Trash2,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
  ShieldCheck,
  Smartphone,
  History,
  CreditCard as PaymentIcon,
  Gamepad2,
  Bell,
  Globe,
  Monitor,
  AlertTriangle,
  Save,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useSettingsStore } from '../store/useSettingsStore';

export default function Profile() {
  const { siteName } = useSettingsStore();
  const { user, logout, orders, updateProfile, deleteAccount } = useUserStore();
  const { country: selectedCountry } = useSettingsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showSecurityConfirm, setShowSecurityConfirm] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSessions, setActiveSessions] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    birthDate: user?.birthDate || '',
    biNumber: user?.biNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || '',
    country: user?.country || selectedCountry.name,
    state: user?.state || '',
    apartment: user?.apartment || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSecurityConfirm(true);
  };

  const confirmAndSave = () => {
    if (confirmPassword !== user?.password) {
      toast.error('Senha de confirmação incorreta.', {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    // If changing email or phone, require verification code
    if (formData.email !== user?.email || formData.phone !== user?.phone) {
      setShowVerificationStep(true);
      setShowSecurityConfirm(false);
      toast.success('Código de verificação enviado para ' + (formData.email !== user?.email ? 'e-mail' : 'SMS'));
      return;
    }

    saveChanges();
  };

  const verifyAndSave = () => {
    if (verificationCode === '123456') { // Mock verification code
      saveChanges();
      setShowVerificationStep(false);
    } else {
      toast.error('Código de verificação inválido.');
    }
  };

  const saveChanges = () => {
    try {
      updateProfile(formData);
      setIsEditing(false);
      setShowSecurityConfirm(false);
      setConfirmPassword('');
      toast.success('Perfil atualizado com sucesso!', {
        icon: <CheckCircle2 className="text-emerald-500" />
      });
    } catch (error) {
      toast.error('Erro ao atualizar. Tente novamente.', {
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('site-user-storage'); // Force clear user storage
    toast.success('Sessão terminada com sucesso.', {
      icon: <CheckCircle2 className="text-emerald-500" />
    });
  };

  const terminateSessions = () => {
    setActiveSessions(1);
    toast.success('Outras sessões terminadas com sucesso.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.currentPassword !== user?.password) {
      toast.error('Senha atual incorreta.', {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.', {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem.', {
        icon: <AlertCircle className="text-red-500" />
      });
      return;
    }

    updateProfile({ password: passwordData.newPassword });
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Senha alterada com sucesso!', {
      icon: <CheckCircle2 className="text-emerald-500" />
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, avatar: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    toast.success('Conta excluída com sucesso.');
  };

  const clearAllProfileData = () => {
    const emptyData = {
      name: user.name, // Keep name to avoid breaking UI, but clear everything else
      email: user.email,
      phone: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
      birthDate: '',
      biNumber: '',
      address: '',
      city: '',
      zip: '',
      state: '',
      apartment: '',
      gallery: []
    };
    updateProfile(emptyData);
    setFormData({
      name: user.name,
      email: user.email,
      phone: '',
      avatar: emptyData.avatar,
      birthDate: '',
      biNumber: '',
      address: '',
      city: '',
      zip: '',
      country: selectedCountry.name,
      state: '',
      apartment: '',
    });
    toast.success('Todos os dados opcionais do perfil foram apagados.', {
      icon: <Trash2 className="text-amber-500" />
    });
  };

  if (!user) {
    return <Navigate to="/account" replace />;
  }

  const resources = [
    { icon: <Ticket size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Cupons e crédito' },
    { icon: <Wallet size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Pagamento' },
    { icon: <MapPin size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Endereço de envio' },
    { icon: <MessageSquare size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Consultas' },
    { icon: <FileText size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Pedidos de Orçamento' },
    { icon: <Receipt size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Informações fiscais' },
    { icon: <Layers size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Associação' },
    { icon: <UserPlus size={24} className="text-gray-700 dark:text-gray-300" />, label: 'Comece a vender' },
  ];

  const orderStats = [
    { icon: <Wallet size={20} />, label: 'Pendente', count: 0 },
    { icon: <Package size={20} />, label: 'Enviado', count: 0 },
    { icon: <Clock size={20} />, label: 'Em trânsito', count: 0 },
    { icon: <MessageSquare size={20} />, label: 'Avaliar', count: 0 },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-32 transition-colors duration-300 font-sans">
      {/* Header Compacto */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand/20">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none">
                {user.name}
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: #{user.id.slice(-6)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isEditing ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand hover:text-white'
              }`}
            >
              {isEditing ? 'Visualizar' : 'Editar Perfil'}
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="md:col-span-8 space-y-8">
            
            {/* 📋 INFORMAÇÕES PESSOAIS */}
            <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Informações Pessoais</h3>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 flex items-center space-x-2"
                    >
                      <Save size={14} />
                      <span>Guardar</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-brand rounded-xl text-sm font-bold transition-all text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-brand rounded-xl text-sm font-bold transition-all text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-brand rounded-xl text-sm font-bold transition-all text-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">País</label>
                    <select 
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-brand rounded-xl text-sm font-bold transition-all text-gray-900 dark:text-white outline-none appearance-none"
                    >
                      <option value="Angola">Angola</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Brasil">Brasil</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Telefone</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user.phone || 'Não definido'}</p>
                  </div>
                </div>
              )}
            </section>

            {/* 🔐 SEGURANÇA */}
            <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Segurança</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Alterar Senha</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atualize sua senha regularmente</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordChange(true)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all"
                  >
                    Alterar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Reconhecimento Facial</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acesso rápido e seguro</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFaceIdEnabled(!faceIdEnabled)}
                    className={`w-12 h-6 rounded-full transition-all relative ${faceIdEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${faceIdEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                      <Monitor size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Sessões Ativas</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeSessions} dispositivo conectado</p>
                    </div>
                  </div>
                  <button 
                    onClick={terminateSessions}
                    className="px-4 py-2 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50/50 rounded-xl transition-all"
                  >
                    Terminar Todas
                  </button>
                </div>
              </div>
            </section>

            {/* 💳 PAGAMENTOS */}
            <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Pagamentos</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['PayPay', 'Unitel Money', 'PayPal'].map((method) => (
                  <div key={method} className="p-4 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-between group hover:border-brand transition-all cursor-pointer">
                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{method}</span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 flex items-center">
                <AlertCircle size={12} className="mr-2" /> Use apenas métodos seguros e confirme sempre o pagamento.
              </p>
            </section>

            {/* 🎮 MEUS JOGOS */}
            <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                    <Gamepad2 size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Meus Jogos</h3>
                </div>
                <Link to="/orders" className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline">
                  Ver Histórico
                </Link>
              </div>

              <div className="space-y-4">
                {orders.filter(o => o.userId === user.id).length > 0 ? (
                  orders.filter(o => o.userId === user.id).slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-brand">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider truncate max-w-[150px]">
                            {order.items[0].name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(order.date).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-500">Adquirido</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nenhum jogo adquirido ainda</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 space-y-8">
            {/* ⚙️ CONFIGURAÇÕES */}
            <section className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl flex items-center justify-center">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Configurações</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                      <Bell size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Notificações</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alertas de promoções e segurança</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setNotificationsEnabled(!notificationsEnabled);
                      toast.success(notificationsEnabled ? 'Notificações desativadas' : 'Notificações ativadas');
                    }}
                    className={`w-12 h-6 rounded-full transition-all relative ${notificationsEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <button 
                  onClick={() => toast.success('Configurações de idioma disponíveis no topo do site.', { icon: <Globe size={16} /> })}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Globe size={18} className="text-gray-400 group-hover:text-brand" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Idioma e Região</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              </div>
            </section>

            {/* 💾 SALVAR ALTERAÇÕES */}
            {isEditing && (
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleUpdate}
                  className="w-full py-5 bg-brand text-white font-black rounded-[2rem] text-sm hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 uppercase tracking-widest"
                >
                  <Save size={18} />
                  <span>Guardar Alterações</span>
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-[2rem] text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-5 bg-red-500/10 text-red-500 font-black rounded-[2rem] text-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                >
                  Eliminar Conta
                </button>
              </div>
            )}

            {/* 🚨 AVISO IMPORTANTE */}
            <section className="bg-amber-500/5 dark:bg-amber-500/10 rounded-[2rem] p-8 border border-amber-500/20">
              <div className="flex items-center space-x-3 mb-4 text-amber-500">
                <AlertTriangle size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Aviso Importante</h3>
              </div>
              <ul className="space-y-3">
                <li className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-wider">
                  ⚠️ Nunca compartilhe sua senha ou dados pessoais com terceiros.
                </li>
                <li className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed uppercase tracking-wider">
                  ⚠️ Sempre utilize o suporte oficial da {siteName}.
                </li>
              </ul>
            </section>

            {/* Logout Button */}
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-[2rem] text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-3 group uppercase tracking-widest"
            >
              <LogOut size={18} />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Version Info */}
      <div className="text-center py-12">
        <p className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.5em]">{siteName} MMXXVI • Version 1.0.0</p>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-900 p-12 rounded-[3rem] max-w-md w-full text-center space-y-8 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Tem certeza?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Esta ação é irreversível. Todos os seus dados, pedidos e pontos serão excluídos permanentemente.</p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full py-5 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all uppercase tracking-widest shadow-xl shadow-red-500/20"
                >
                  Sim, Eliminar Minha Conta
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordChange && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordChange(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-900 p-10 rounded-[3rem] max-w-md w-full space-y-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Alterar Senha</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Escolha uma senha forte para proteger sua conta.</p>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha Atual</label>
                  <input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nova Senha</label>
                  <input 
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                    required
                    placeholder="Mín. 8 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                  <input 
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    type="submit"
                    className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:bg-brand/90 transition-all uppercase tracking-widest shadow-xl shadow-brand/20"
                  >
                    Guardar Nova Senha
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="w-full py-4 text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Confirmation Modal */}
      <AnimatePresence>
        {showSecurityConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-900 p-10 rounded-[3rem] max-w-md w-full space-y-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Confirmar Alterações</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Por favor, insira sua senha atual para salvar as alterações no perfil.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Sua senha atual"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white"
                />
                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={confirmAndSave}
                    className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:bg-brand/90 transition-all uppercase tracking-widest shadow-xl shadow-brand/20"
                  >
                    Guardar Alterações
                  </button>
                  <button 
                    onClick={() => setShowSecurityConfirm(false)}
                    className="w-full py-4 text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verification Code Modal */}
      <AnimatePresence>
        {showVerificationStep && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-900 p-10 rounded-[3rem] max-w-md w-full space-y-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Smartphone size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Verificação de Segurança</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Enviamos um código de 6 dígitos para confirmar a alteração de dados importantes. (Use 123456)</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-emerald-500 transition-all text-gray-900 dark:text-white"
                />
                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={verifyAndSave}
                    className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                  >
                    Verificar e Guardar
                  </button>
                  <button 
                    onClick={() => setShowVerificationStep(false)}
                    className="w-full py-4 text-[10px] text-gray-400 font-black uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-900 p-12 rounded-[3rem] max-w-md w-full text-center space-y-8 shadow-2xl"
            >
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto">
                <LogOut size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Terminar Sessão?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tens certeza que quer terminar sessão?</p>
              </div>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleLogout}
                  className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:bg-brand dark:hover:bg-brand hover:text-white transition-all uppercase tracking-widest shadow-xl"
                >
                  Sim, Terminar Sessão
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
