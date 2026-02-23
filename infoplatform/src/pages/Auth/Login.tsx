import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { AuthService } from '../../utils/auth';
import AsyncButton from '../../components/common/AsyncButton';

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
    setLoading(true);
    setError('');

    try {
      // 使用 API 进行登录
      const response = await authApi.login(formData.username, formData.password);

      if (response.success && response.data) {
        // 存储 token
        sessionStorage.setItem('token', response.data.token);
        // 使用 AuthService 存储认证信息
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
        setError(response.message || '登录失败');
      }
    } catch (err: any) {
      // 解析错误信息，显示后端返回的具体错误
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError('网络错误，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>酒店信息管理系统</h1>
        <p>请登录您的账号</p>
      </div>
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
        <AsyncButton type="submit" loading={loading} loadingText="登录中..." variant="primary">
          登录
        </AsyncButton>
      </form>
      <div className="form-footer">
        <p>还没有账号？ <Link to="/register">立即注册</Link></p>
      </div>
    </div>
    </div>
  );
};

export default Login;
