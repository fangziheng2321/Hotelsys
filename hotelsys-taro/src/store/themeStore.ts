import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // 默认跟随系统，也可以默认 false
  isDark: false,

  setTheme: (isDark) => {
    set({ isDark });
  },

  toggleTheme: () => {
    const next = !get().isDark;
    set({ isDark: next });
  },
}));
