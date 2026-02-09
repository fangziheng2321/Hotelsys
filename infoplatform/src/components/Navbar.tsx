import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../utils/auth';

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
          <Link to="/">酒店信息管理系统</Link>
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
                <Link to="/hotel">我的酒店</Link>
              )}
              {userRole === 'admin' && (
                <Link to="/admin/audit">酒店审核</Link>
              )}
              <button onClick={handleLogout}>退出</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;