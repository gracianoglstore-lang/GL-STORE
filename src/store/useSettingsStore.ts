import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'AOA' | 'USD' | 'EUR' | 'BRL' | 'GBP' | 'CNY' | 'JPY' | 'CHF';
export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ru' | 'ar';
export type Country = { code: string; name: string; flag: string };

interface SettingsState {
  currency: Currency;
  language: Language;
  country: Country;
  siteName: string;
  siteLogo: string;
  enabledPaymentMethods: string[];
  isMaintenanceMode: boolean;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  setCountry: (country: Country) => void;
  setSiteSettings: (settings: { siteName?: string; siteLogo?: string; enabledPaymentMethods?: string[]; isMaintenanceMode?: boolean }) => void;
  toggleMaintenanceMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'AOA',
      language: 'pt',
      country: { code: 'AO', name: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
      siteName: 'Site Store',
      siteLogo: 'https://i.ibb.co/v4S8L8Y/GL-STORE-LOGO.png',
      enabledPaymentMethods: ['unitel', 'paypay', 'bank', 'paypal'],
      isMaintenanceMode: false,
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setCountry: (country) => set({ country }),
      setSiteSettings: (settings) => set((state) => ({ ...state, ...settings })),
      toggleMaintenanceMode: () => set((state) => ({ isMaintenanceMode: !state.isMaintenanceMode })),
    }),
    {
      name: 'site-settings-storage',
    }
  )
);
