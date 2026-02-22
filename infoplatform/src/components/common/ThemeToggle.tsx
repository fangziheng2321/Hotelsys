import React, { useEffect, useState } from 'react';
import { ThemeService } from '../../utils/theme';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(ThemeService.isDarkMode());

  useEffect(() => {
    // 初始化主题
    ThemeService.initializeTheme();
  }, []);

  const handleToggle = () => {
    ThemeService.toggleDarkMode();
    setIsDarkMode(ThemeService.isDarkMode());
  };

  return (
    <button 
      onClick={handleToggle} 
      className="theme-toggle-btn"
      title={isDarkMode ? '切换到日间模式' : '切换到夜间模式'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
