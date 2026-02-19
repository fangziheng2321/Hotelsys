import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import HotelForm from '../pages/Hotel/HotelForm';
import HotelList from '../pages/Hotel/HotelList';
import HotelVisualization from '../pages/Hotel/HotelVisualization';
import HotelAudit from '../pages/Admin/HotelAudit';
import Layout from '../components/Layout';
import { AuthService } from '../utils/auth';

// 私有路由组件
const PrivateRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'merchant' | 'admin';
}> = ({ children, requiredRole }) => {
  // 检查是否已认证
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // 检查角色权限
  if (requiredRole && !AuthService.hasRole(requiredRole)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 公共路由 - 不需要布局 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 商户路由 - 需要布局 */}
      <Route 
        path="/hotel" 
        element={
          <PrivateRoute requiredRole="merchant">
            <Layout>
              <HotelList />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/hotel/visualization" 
        element={
          <PrivateRoute>
            <Layout>
              <HotelVisualization />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/hotel/add" 
        element={
          <PrivateRoute requiredRole="merchant">
            <Layout>
              <HotelForm />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/hotel/edit/:id" 
        element={
          <PrivateRoute requiredRole="merchant">
            <Layout>
              <HotelForm />
            </Layout>
          </PrivateRoute>
        } 
      />
      
      {/* 管理员路由 - 需要布局 */}
      <Route 
        path="/admin/audit" 
        element={
          <PrivateRoute requiredRole="admin">
            <Layout>
              <HotelAudit />
            </Layout>
          </PrivateRoute>
        } 
      />
      
      {/* 默认路由 */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;