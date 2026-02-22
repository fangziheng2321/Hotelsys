// 主题相关的工具函数

export const ThemeService = {
  // 切换到夜间模式
  enableDarkMode: () => {
    localStorage.setItem('darkMode', 'true');
    document.body.classList.add('dark-mode');
  },

  // 切换到日间模式
  disableDarkMode: () => {
    localStorage.setItem('darkMode', 'false');
    document.body.classList.remove('dark-mode');
  },

  // 切换主题模式
  toggleDarkMode: () => {
    if (ThemeService.isDarkMode()) {
      ThemeService.disableDarkMode();
    } else {
      ThemeService.enableDarkMode();
    }
  },

  // 检查是否为夜间模式
  isDarkMode: (): boolean => {
    const savedMode = localStorage.getItem('darkMode');
    // 如果没有保存的模式，根据系统偏好设置
    if (savedMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedMode === 'true';
  },

  // 初始化主题
  initializeTheme: () => {
    if (ThemeService.isDarkMode()) {
      ThemeService.enableDarkMode();
    } else {
      ThemeService.disableDarkMode();
    }
  }
};
