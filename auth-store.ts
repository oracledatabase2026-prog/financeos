// src/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    currency: string;
    logo?: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// src/store/ui-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setLanguage: (language: 'en' | 'ar') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      language: 'en',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => {
        if (typeof window !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        set({ theme });
      },
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { theme: newTheme };
      }),
      setLanguage: (language) => {
        if (typeof window !== 'undefined') {
          document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = language;
        }
        set({ language });
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);

// src/store/data-store.ts
import { create } from 'zustand';

interface DataState {
  kpis: any | null;
  revenueChart: any | null;
  expenseBreakdown: any | null;
  transactions: any[];
  setKPIs: (kpis: any) => void;
  setRevenueChart: (data: any) => void;
  setExpenseBreakdown: (data: any) => void;
  setTransactions: (transactions: any[]) => void;
  reset: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  kpis: null,
  revenueChart: null,
  expenseBreakdown: null,
  transactions: [],
  setKPIs: (kpis) => set({ kpis }),
  setRevenueChart: (revenueChart) => set({ revenueChart }),
  setExpenseBreakdown: (expenseBreakdown) => set({ expenseBreakdown }),
  setTransactions: (transactions) => set({ transactions }),
  reset: () => set({ kpis: null, revenueChart: null, expenseBreakdown: null, transactions: [] }),
}));
