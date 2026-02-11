import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'merchant' as 'merchant' | 'admin' // 默认商户角色
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleRoleChange = (role: 'merchant' | 'admin') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 使用 API 进行注册
      const response = await authApi.register(formData.username, formData.password, formData.role);

      if (response.success) {
        setSuccess('注册成功，请登录');
        // 将注册信息存储到 sessionStorage，方便登录页自动填充
        sessionStorage.setItem('pendingLogin', JSON.stringify({
          username: formData.username,
          password: formData.password
        }));
        // 3秒后跳转到登录页
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>用户注册</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
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
        <div className="form-group">
          <label>角色选择</label>
          <div className="role-selector">
            <label>
              <input
                type="radio"
                name="role"
                value="merchant"
                checked={formData.role === 'merchant'}
                onChange={() => handleRoleChange('merchant')}
                disabled={loading}
              />
              商户
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={() => handleRoleChange('admin')}
                disabled={loading}
              />
              管理员
            </label>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <div className="form-footer">
        <p>已有账号？ <a href="/login">立即登录</a></p>
      </div>
    </div>
  );
};

export default Register;
