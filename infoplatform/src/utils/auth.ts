// 认证相关的工具函数

// 安全的认证状态管理
export const AuthService = {
  // 登录
  login: (user: any, token?: string) => {
    // 将用户信息存储到sessionStorage
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('isAuthenticated', 'true');
    // 设置登录时间，用于简单的过期检查
    sessionStorage.setItem('loginTime', Date.now().toString());
    // 存储token（如果有）
    if (token) {
      sessionStorage.setItem('token', token);
    }
  },

  // 登出
  logout: () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('loginTime');
    sessionStorage.removeItem('token');
  },

  // 获取当前用户
  getCurrentUser: () => {
    try {
      const userStr = sessionStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // 获取token
  getToken: () => {
    return sessionStorage.getItem('token');
  },

  // 检查是否已认证
  isAuthenticated: () => {
    const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) return false;

    // 简单的登录过期检查（24小时）
    const loginTime = sessionStorage.getItem('loginTime');
    if (loginTime) {
      const timeSinceLogin = Date.now() - parseInt(loginTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timeSinceLogin > twentyFourHours) {
        AuthService.logout();
        return false;
      }
    }

    return true;
  },

  // 检查用户角色
  hasRole: (role: string) => {
    const user = AuthService.getCurrentUser();
    return user && user.role === role;
  }
};
