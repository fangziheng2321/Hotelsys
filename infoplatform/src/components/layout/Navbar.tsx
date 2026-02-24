import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../utils/auth';
import ThemeToggle from '../common/ThemeToggle';
import AsyncButton from '../common/AsyncButton';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  // 使用AuthService检查认证状态
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role || 'merchant';

  const handleLogout = () => {
    // 使用AuthService登出
    AuthService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">易宿酒店信息管理系统</Link>
        </div>
        <div className="navbar-links">
          {!isAuthenticated ? (
            // 未登录状态
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          ) : (
            // 已登录状态
            <>
              {userRole === 'merchant' && (
                <>
                  <Link to="/hotel">{currentUser?.username}的酒店</Link>
                  <div className="navbar-right-group">
                    <Link to="/hotel/visualization">数据概览</Link>
                    <ThemeToggle />
                  </div>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/audit">酒店审核</Link>
                  <div className="navbar-right-group">
                    <Link to="/hotel/visualization">数据概览</Link>
                    <ThemeToggle />
                  </div>
                </>
              )}
              <AsyncButton onClick={handleLogout} variant="secondary">退出</AsyncButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;