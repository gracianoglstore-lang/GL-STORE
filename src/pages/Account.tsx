import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Mail, Lock, User as UserIcon, ChevronRight, ArrowRight, Sparkles, ArrowLeft, Phone, Check, X, Upload, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, login, register } = useUserStore();
  const { siteName } = useSettingsStore();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [countryCode, setCountryCode] = useState('+244');
  const [rememberMe, setRememberMe] = useState(false);
  const [faceRecognition, setFaceRecognition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New states for enhanced registration
  const [avatar, setAvatar] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setIsLogin(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('site-remember-identifier');
    const savedPassword = localStorage.getItem('site-remember-password');
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const countries = [
    { code: '+244', name: 'Angola', flag: '🇦🇴' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+1', name: 'EUA', flag: '🇺🇸' },
    { code: '+44', name: 'Reino Unido', flag: '🇬🇧' },
    { code: '+258', name: 'Moçambique', flag: '🇲🇿' },
    { code: '+238', name: 'Cabo Verde', flag: '🇨🇻' },
    { code: '+239', name: 'S. Tomé e Príncipe', flag: '🇸🇹' },
    { code: '+245', name: 'Guiné-Bissau', flag: '🇬🇼' },
    { code: '+240', name: 'Guiné Equatorial', flag: '🇬🇶' },
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation for registration
    if (!isLogin) {
      if (password.length < 3) {
        setError('A senha deve ter pelo menos 3 caracteres.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setIsLoading(false);
        return;
      }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const trimmedIdentifier = identifier.trim();
      if (isLogin) {
        let finalIdentifier = trimmedIdentifier;
        if (authMethod === 'phone') {
          // Remove any spaces or non-digit characters except +
          const cleanPhone = trimmedIdentifier.replace(/[^\d+]/g, '');
          // If it doesn't start with + and doesn't start with the country code digits, prepend the country code
          const countryDigits = countryCode.replace(/\D/g, '');
          if (cleanPhone.startsWith('+')) {
            finalIdentifier = cleanPhone;
          } else if (cleanPhone.startsWith(countryDigits)) {
            finalIdentifier = `+${cleanPhone}`;
          } else {
            finalIdentifier = `${countryCode}${cleanPhone}`;
          }
        }

        const result = login(finalIdentifier, password);
        if (!result.success) {
          // Try without country code as fallback (for default admin or old accounts)
          const fallbackResult = login(trimmedIdentifier.replace(/[^\d+]/g, ''), password);
          if (!fallbackResult.success) {
            setError(result.message || 'Email, número ou senha incorretos.');
            setIsLoading(false);
            return;
          }
        }

        if (rememberMe) {
          localStorage.setItem('site-remember-identifier', trimmedIdentifier);
          localStorage.setItem('site-remember-password', password);
        } else {
          localStorage.removeItem('site-remember-identifier');
          localStorage.removeItem('site-remember-password');
        }
      } else {
        // Registration validation
        if (!name.trim()) {
          setError('O nome completo é obrigatório.');
          setIsLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setError('Um e-mail válido é obrigatório.');
          setIsLoading(false);
          return;
        }
        if (!phone.trim()) {
          setError('O número de telefone é obrigatório.');
          setIsLoading(false);
          return;
        }

        const fullPhone = `${countryCode}${phone.replace(/\s/g, '')}`;
        
        // Prepare data for registration
        const userData = {
          name: name.trim(),
          password,
          email: email.trim(),
          phone: fullPhone,
          birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
          avatar: avatar || undefined
        };

        setTempUserData(userData);
        
        // Skip verification for easier demo experience
        const result = register(userData);
        if (result.success) {
          toast.success('Conta criada com sucesso!');
          // The Navigate component will handle redirection since user state is updated
        } else {
          setError(result.message || 'Erro ao registrar.');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (verificationCode === '123456' || verificationCode === '000000') {
      const result = register(tempUserData);
      if (result.success) {
        toast.success('Conta criada com sucesso!');
      } else {
        setError(result.message || 'Erro ao registrar.');
      }
    } else {
      setError('Código de verificação inválido. Use 123456.');
    }
    setIsLoading(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const redirect = searchParams.get('redirect') || '/products';

  if (user) {
    return <Navigate to={redirect} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Left Side - Visual/Atmospheric (Recipe 11: Split Layout) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 space-y-12 max-w-xl">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-16 h-16 bg-transparent rounded-[2rem] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
              <img 
                src={useSettingsStore.getState().siteLogo} 
                alt={`${siteName} Logo`} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-4xl font-black tracking-tighter text-white uppercase">
              {siteName.split(' ')[0]} <span className="text-indigo-600">{siteName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Elevate Your <br />
              <span className="text-brand">Digital Vibe.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              Join our exclusive community of tech enthusiasts and trendsetters. Experience the future of digital retail.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">50k+</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Active Members</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white tracking-tighter">24/7</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">Concierge Support</p>
            </div>
          </div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 writing-vertical-rl rotate-180 text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">
          ESTABLISHED MMXXIV • LUANDA • ANGOLA
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 bg-gray-50 dark:bg-gray-950">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden">
              <img 
                src={useSettingsStore.getState().siteLogo} 
                alt={`${siteName} Logo`} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
              {siteName.split(' ')[0]} <span className="text-indigo-600">{siteName.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>
        </div>

        {/* Floating Back Button */}
        <Link 
          to="/" 
          className="fixed top-8 right-8 z-[100] flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all group shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Store</span>
        </Link>

        <div className="w-full max-w-[440px] space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
              {isLogin ? 'Welcome Back.' : 'Join the Vibe.'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              {isLogin 
                ? 'Enter your credentials to access your digital vault.' 
                : 'Create your account to start your premium journey.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showVerification ? (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Verifique sua conta.</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Enviamos um código de 6 dígitos para {identifier}. Digite-o abaixo para ativar sua conta.
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                      Código de Verificação
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-6 py-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-2xl font-black tracking-[0.5em] text-center focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-200"
                      placeholder="000000"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand text-white font-black py-5 rounded-[2rem] text-xl hover:bg-brand-dark transition-all active:scale-[0.98] flex items-center justify-center shadow-2xl shadow-brand/30"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Ativar Conta</span>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setShowVerification(false)}
                    className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    Voltar para o cadastro
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                  {!isLogin && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                        <Lock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Regras de Cadastro</span>
                      </div>
                      <ul className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider space-y-1 list-disc ml-4">
                        <li>O email deve ser único e não pode ser repetido.</li>
                        <li>O número de telefone deve ser único e não pode ser repetido.</li>
                        <li>Cada usuário deve usar um nome diferente.</li>
                      </ul>
                    </div>
                  )}
                  <div className="space-y-6">
                    {/* Avatar Upload (Only Register) */}
                    {!isLogin && (
                      <div className="flex flex-col items-center space-y-4 pb-4">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-[2rem] bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden transition-all group-hover:border-brand">
                            {avatar ? (
                              <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={32} className="text-gray-300" />
                            )}
                          </div>
                          <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                            <Upload size={18} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                          </label>
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto de Perfil (Opcional)</span>
                      </div>
                    )}

                    {/* Identifier Field (Only Login) */}
                    {isLogin && (
                      <div className="space-y-4">
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMethod('email');
                              setIdentifier('');
                              setError(null);
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${authMethod === 'email' ? 'bg-white dark:bg-gray-800 text-brand shadow-sm' : 'text-gray-400'}`}
                          >
                            E-mail
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMethod('phone');
                              setIdentifier('');
                              setError(null);
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white dark:bg-gray-800 text-brand shadow-sm' : 'text-gray-400'}`}
                          >
                            Telefone
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            {authMethod === 'email' ? 'Endereço de E-mail' : 'Número de Telefone'} *
                          </label>
                          <div className="flex space-x-3">
                            {authMethod === 'phone' && (
                              <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-28 px-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                              >
                                {countries.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.flag} {c.code}
                                  </option>
                                ))}
                              </select>
                            )}
                            <input
                              type={authMethod === 'email' ? "email" : "tel"}
                              required
                              value={identifier}
                              onChange={(e) => setIdentifier(e.target.value)}
                              className="flex-1 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                              placeholder={authMethod === 'email' ? "seu@email.com" : "9XX XXX XXX"}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                          Senha *
                        </label>
                        {isLogin && (
                          <button 
                            type="button" 
                            onClick={() => toast.error('Recuperação de senha indisponível no momento. Entre em contato com o suporte.')}
                            className="text-[10px] font-black text-brand uppercase tracking-widest hover:underline"
                          >
                            Esqueceu?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showPassword ? <X size={18} /> : <Lock size={18} />}
                        </button>
                      </div>
                    </div>

                    {isLogin && (
                      <div className="flex items-center space-x-3 px-1">
                        <button
                          type="button"
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${rememberMe ? 'bg-brand border-brand text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'}`}
                        >
                          {rememberMe && <Check size={14} strokeWidth={4} />}
                        </button>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                          Lembrar-me
                        </span>
                      </div>
                    )}

                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-4"
                      >
                        {/* Name Field */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            👤 Nome Completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                            placeholder="João Silva"
                          />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            📧 Endereço de E-mail *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                            placeholder="seu@email.com"
                          />
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            📱 Número de Telefone *
                          </label>
                          <div className="flex space-x-3">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="w-28 px-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                            >
                              {countries.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="flex-1 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                              placeholder="9XX XXX XXX"
                            />
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            🔒 Confirmar Senha *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white placeholder:text-gray-300"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showPassword ? <X size={18} /> : <Lock size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Birth Date Field */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
                            Data de Nascimento
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <select
                              value={birthDay}
                              onChange={(e) => setBirthDay(e.target.value)}
                              className="px-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                            >
                              <option value="">Dia</option>
                              {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                              ))}
                            </select>
                            <select
                              value={birthMonth}
                              onChange={(e) => setBirthMonth(e.target.value)}
                              className="px-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                            >
                              <option value="">Mês</option>
                              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((month, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>{month}</option>
                              ))}
                            </select>
                            <select
                              value={birthYear}
                              onChange={(e) => setBirthYear(e.target.value)}
                              className="px-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black focus:outline-none focus:border-brand transition-all text-gray-900 dark:text-white appearance-none cursor-pointer"
                            >
                              <option value="">Ano</option>
                              {Array.from({ length: 100 }, (_, i) => (
                                <option key={i} value={String(new Date().getFullYear() - i)}>{new Date().getFullYear() - i}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Facial Recognition Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                              <Sparkles size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Reconhecimento Facial</p>
                              <p className="text-[10px] text-gray-500">Ativar login rápido por biometria</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFaceRecognition(!faceRecognition)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${faceRecognition ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${faceRecognition ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand text-white font-black py-5 rounded-[2rem] text-xl hover:bg-brand-dark transition-all active:scale-[0.98] flex items-center justify-center shadow-2xl shadow-brand/30 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center space-x-4">
                        <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                        <ArrowRight size={24} />
                      </div>
                    )}
                  </button>

                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('email');
                        setIdentifier('admin@' + siteName.toLowerCase().replace(/\s+/g, '') + '.com');
                        setPassword('123');
                        toast.success('Dados de administrador preenchidos!');
                      }}
                      className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all"
                    >
                      Login Rápido (Admin Teste)
                    </button>
                  )}
                </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.5em]">
                  <span className="bg-gray-50 dark:bg-gray-950 px-4 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => toast.success('Login com Facebook simulado!')}
                  className="flex items-center justify-center space-x-3 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                >
                  <div className="bg-[#1877f2] text-white p-1 rounded-lg group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Facebook</span>
                </button>
                <button 
                  onClick={() => toast.success('Login com Google simulado!')}
                  className="flex items-center justify-center space-x-3 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"
                >
                  <div className="bg-white p-1 rounded-lg border border-gray-100 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Google</span>
                </button>
              </div>

              <div className="text-center pt-8">
                <p className="text-sm text-gray-500 font-medium">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-brand font-black uppercase tracking-widest hover:underline ml-2"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
  );
}
