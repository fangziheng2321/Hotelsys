import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../mock/data';
import { AuthService } from '../../utils/auth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 页面加载时检查是否有注册信息需要自动填充
  useEffect(() => {
    const pendingLogin = sessionStorage.getItem('pendingLogin');
    if (pendingLogin) {
      try {
        const loginData = JSON.parse(pendingLogin);
        setFormData({
          username: loginData.username,
          password: loginData.password
        });
        // 清除临时存储的登录信息
        sessionStorage.removeItem('pendingLogin');
      } catch (e) {
        console.error('解析登录信息失败:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 使用模拟API进行登录
    const response = mockApi.login(formData.username, formData.password);
// 对接后端：使用真实API请求
/*const response = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: formData.username,
    password: formData.password,
  }),
});

const data = await response.json();
if (data.success) {
  // 登录成功处理
} else {
  setError(data.message);
}*/
    if (response.success) {
      // 使用AuthService存储认证信息
      AuthService.login(response.data.user);
      
      // 跳转到对应角色的首页
      const userRole = response.data.user.role;
      console.log('登录成功，用户角色：', userRole);
      if (userRole === 'merchant') {
        navigate('/hotel');
      } else if (userRole === 'admin') {
        navigate('/admin/audit');
      }
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="login-container">
      <h2>用户登录</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="form-group">
          <label>密码</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required
          />
        </div>
        <button type="submit">登录</button>
      </form>
      <div className="form-footer">
        <p>还没有账号？ <a href="/register">立即注册</a></p>
      </div>
    </div>
  );
};

export default Login;