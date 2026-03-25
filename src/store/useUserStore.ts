import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Order } from '../types';

interface UserState {
  user: User | null;
  users: User[];
  orders: Order[];
  login: (identifier: string, password: string) => { success: boolean; message?: string };
  register: (data: { 
    name: string; 
    phone?: string; 
    email?: string; 
    password: string; 
    birthDate?: string; 
    biNumber?: string;
    avatar?: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, data: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  clearOrders: () => void;
  updateProfile: (data: Partial<User>) => void;
  deleteAccount: () => void;
  addToGallery: (url: string) => void;
  removeFromGallery: (url: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        {
          id: 'admin',
          name: 'Administrador Site',
          email: 'admin@site.com',
          phone: '921291580',
          password: '123',
          isAdmin: true,
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
          gallery: []
        }
      ],
      orders: [],
      login: (identifier, password) => {
        const users = get().users;
        
        // Define default admin
        const defaultAdmin = {
          id: 'admin',
          name: 'Administrador Site',
          email: 'admin@site.com',
          phone: '921291580',
          password: '123',
          isAdmin: true,
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
          gallery: []
        };

        const normalizePhone = (val?: string) => val?.replace(/\D/g, '') || '';
        const isEmail = identifier.includes('@');
        const normalizedInput = isEmail ? identifier.toLowerCase().trim() : normalizePhone(identifier);

        // Check in current users list
        let foundUser = users.find(u => {
          if (isEmail) {
            return u.email?.toLowerCase().trim() === normalizedInput && u.password === password;
          } else {
            const userPhone = normalizePhone(u.phone);
            // Match if one ends with the other or they are equal (to handle prefix variations)
            const inputMatches = userPhone.endsWith(normalizedInput) || normalizedInput.endsWith(userPhone);
            return inputMatches && normalizedInput.length >= 7 && u.password === password;
          }
        });
        
        // Fallback to default admin if not in list but credentials match
        if (!foundUser) {
          if (isEmail) {
            if (defaultAdmin.email.toLowerCase() === normalizedInput && password === defaultAdmin.password) {
              foundUser = defaultAdmin;
            }
          } else {
            const adminPhone = normalizePhone(defaultAdmin.phone);
            if ((adminPhone.endsWith(normalizedInput) || normalizedInput.endsWith(adminPhone)) && 
                normalizedInput.length >= 7 && password === defaultAdmin.password) {
              foundUser = defaultAdmin;
            }
          }
          
          if (foundUser) {
            // Also add it to the list for future consistency if not already there
            if (!users.some(u => u.id === 'admin')) {
              set({ users: [...users, defaultAdmin] });
            }
          }
        }
        
        if (foundUser) {
          set({ user: foundUser });
          return { success: true };
        }
        
        return { success: false, message: '❌ Email, número ou senha incorretos. Verifique seus dados.' };
      },
      register: ({ name, phone, email, password, birthDate, biNumber, avatar }) => {
        const users = get().users;
        const normalizePhone = (val?: string) => val?.replace(/\D/g, '') || '';
        const normalizedEmail = email?.toLowerCase().trim();
        const normalizedPhone = normalizePhone(phone);
        const normalizedName = name.trim().toLowerCase();

        // Check email uniqueness
        if (normalizedEmail) {
          const emailExists = users.some(u => u.email?.toLowerCase().trim() === normalizedEmail);
          if (emailExists) {
            return { success: false, message: '❌ "Este email já está registrado. Use outro email."' };
          }
        }

        // Check phone uniqueness
        if (normalizedPhone) {
          const phoneExists = users.some(u => normalizePhone(u.phone) === normalizedPhone);
          if (phoneExists) {
            return { success: false, message: '❌ "Este número já está registrado. Use outro número."' };
          }
        }

        // Check name uniqueness (as requested: "nome diferente")
        if (normalizedName) {
          const nameExists = users.some(u => u.name.trim().toLowerCase() === normalizedName);
          if (nameExists) {
            return { success: false, message: '❌ "Este nome já está registrado. Use outro nome."' };
          }
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          phone,
          password,
          birthDate,
          biNumber,
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          gallery: []
        };

        set({ 
          users: [...users, newUser],
          user: newUser // Auto login after register
        });
        
        return { success: true };
      },
      logout: () => set({ user: null }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrder: (orderId, data) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, ...data } : o)
      })),
      deleteOrder: (orderId) => set((state) => ({
        orders: state.orders.filter(o => o.id !== orderId)
      })),
      clearOrders: () => set({ orders: [] }),
      updateProfile: (data) => set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...data };
        return {
          user: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),
      deleteAccount: () => set((state) => {
        if (!state.user) return state;
        const userId = state.user.id;
        return {
          user: null,
          users: state.users.filter(u => u.id !== userId),
          orders: state.orders.filter(o => o.userId !== userId)
        };
      }),
      addToGallery: (url) => set((state) => {
        if (!state.user) return state;
        const updatedUser = { 
          ...state.user, 
          gallery: [...(state.user.gallery || []), url] 
        };
        return {
          user: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),
      removeFromGallery: (url) => set((state) => {
        if (!state.user) return state;
        const updatedUser = { 
          ...state.user, 
          gallery: (state.user.gallery || []).filter(img => img !== url) 
        };
        return {
          user: updatedUser,
          users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        };
      }),
    }),
    {
      name: 'site-user-storage',
    }
  )
);
