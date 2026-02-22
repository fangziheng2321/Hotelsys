import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes'
import { ThemeService } from './utils/theme'
import './App.css'

function App() {
  useEffect(() => {
    // 初始化主题
    ThemeService.initializeTheme();
  }, []);

  return (
    <Router basename="/infoplat">
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App