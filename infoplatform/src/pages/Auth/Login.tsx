import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { AuthService } from '../../utils/auth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 使用真实API进行登录
      const response = await authApi.login(formData.username, formData.password);

      if (response.success) {
        // 使用AuthService存储认证信息（包含token）
        AuthService.login(response.data.user, response.data.token);

        // 跳转到对应角色的首页
        const userRole = response.data.user.role;
        console.log('登录成功，用户角色：', userRole);
        if (userRole === 'merchant') {
          navigate('/hotel');
        } else if (userRole === 'admin') {
          navigate('/admin/audit');
        }
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err: any) {
      // 处理API错误
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('网络错误，请检查网络连接');
      } else {
        setError('登录失败，请重试');
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <div className="form-footer">
        <p>还没有账号？ <a href="/register">立即注册</a></p>
      </div>
    </div>
  );
};

export default Login;
