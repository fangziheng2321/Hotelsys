import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../mock/data';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'merchant' as 'merchant' | 'admin' // 默认商户角色
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 使用模拟API进行注册
    const response = mockApi.register(formData.username, formData.password, formData.role);
    if (response.success) {
      setSuccess('注册成功，请登录');
      // 将注册信息存储到sessionStorage，方便登录页自动填充
      sessionStorage.setItem('pendingLogin', JSON.stringify({
        username: formData.username,
        password: formData.password
      }));
      // 3秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(response.message);
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
              />
              管理员
            </label>
          </div>
        </div>
        <button type="submit">注册</button>
      </form>
      <div className="form-footer">
        <p>已有账号？ <a href="/login">立即登录</a></p>
      </div>
    </div>
  );
};

export default Register;