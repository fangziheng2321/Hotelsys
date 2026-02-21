import { Theme } from "@/enum/theme";
import { taroStorage } from "@/utils/storage";
import Taro from "@tarojs/taro";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  currentTheme: Theme;
  systemTheme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 获取系统主题
const getSystemTheme = (): Theme => {
  try {
    const appInfo = Taro.getAppBaseInfo?.();
    return appInfo?.theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
  } catch {
    return Theme.LIGHT;
  }
};

// 是否是夜间模式
const resolveIsDark = (currentTheme: Theme, systemTheme: Theme) => {
  if (currentTheme === Theme.AUTO) {
    return systemTheme === Theme.DARK;
  }
  return currentTheme === Theme.DARK;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // 系统主题
      const systemTheme = getSystemTheme();
      // 当前主题
      const currentTheme = Theme.AUTO;
      return {
        currentTheme,
        systemTheme,
        isDark: resolveIsDark(currentTheme, systemTheme),
        setTheme: (nextTheme) => {
          const nextIsDark = resolveIsDark(nextTheme, get().systemTheme);
          set({ currentTheme: nextTheme, isDark: nextIsDark });
        },
        toggleTheme: () => {
          const nextTheme = get().isDark ? Theme.LIGHT : Theme.DARK;
          set({
            currentTheme: nextTheme,
            isDark: resolveIsDark(nextTheme, get().systemTheme),
          });
        },
      };
    },
    {
      name: "easeStay-theme-storage",
      storage: createJSONStorage(() => taroStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<ThemeState>;
        if (!state.currentTheme && typeof state.isDark === "boolean") {
          return {
            ...state,
            currentTheme: state.isDark ? Theme.DARK : Theme.LIGHT,
          } as ThemeState;
        }
        return persistedState as ThemeState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          const systemTheme = getSystemTheme();
          state.systemTheme = systemTheme;
          state.isDark = resolveIsDark(state.currentTheme, systemTheme);
        }
      },
    },
  ),
);

// 监听系统主题变化
if (typeof Taro.onThemeChange === "function") {
  Taro.onThemeChange(({ theme }) => {
    const nextSystemTheme = theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    const { currentTheme } = useThemeStore.getState();
    useThemeStore.setState({
      systemTheme: nextSystemTheme,
      isDark: resolveIsDark(currentTheme, nextSystemTheme),
    });
  });
}
