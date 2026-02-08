import React, { useState, useEffect } from 'react';
import { mockApi, Hotel } from '../../mock/data';

const HotelAudit: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    // 使用模拟API获取所有酒店列表
    const response = mockApi.getAllHotels();
    if (response.success) {
      setHotels(response.data);
    }
  }, []);

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '审核中',
      approved: '已发布',
      rejected: '已拒绝',
      offline: '已下线'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleApprove = (id: string) => {
    // 使用模拟API审核通过酒店
    const response = mockApi.auditHotel(id, 'approved');
    if (response.success) {
      setHotels(prev => prev.map(hotel => 
        hotel.id === id ? response.data : hotel
      ));
    }
  };

  const handleReject = (id: string) => {
    // 简单起见，这里直接使用固定的拒绝原因
    const reason = '信息不完整，请补充详细信息';
    // 使用模拟API拒绝酒店
    const response = mockApi.auditHotel(id, 'rejected', reason);
    if (response.success) {
      setHotels(prev => prev.map(hotel => 
        hotel.id === id ? response.data : hotel
      ));
    }
  };

  const handleOffline = (id: string) => {
    // 使用模拟API下线酒店
    const response = mockApi.toggleHotelStatus(id, 'offline');
    if (response.success) {
      setHotels(prev => prev.map(hotel => 
        hotel.id === id ? response.data : hotel
      ));
    }
  };

  const handleRestore = (id: string) => {
    // 使用模拟API恢复酒店
    const response = mockApi.toggleHotelStatus(id, 'approved');
    if (response.success) {
      setHotels(prev => prev.map(hotel => 
        hotel.id === id ? response.data : hotel
      ));
    }
  };

  return (
    <div className="hotel-audit-container">
      <h2>酒店信息审核</h2>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>酒店名称</th>
            <th>地址</th>
            <th>联系电话</th>
            <th>商户名称</th>
            <th>状态</th>
            <th>拒绝原因</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.phone}</td>
              <td>{hotel.merchantName}</td>
              <td>{getStatusText(hotel.status)}</td>
              <td>{hotel.rejectReason || '-'}</td>
              <td>
                {hotel.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(hotel.id)}>通过</button>
                    <button onClick={() => handleReject(hotel.id)}>拒绝</button>
                  </>
                )}
                {hotel.status === 'approved' && (
                  <button onClick={() => handleOffline(hotel.id)}>下线</button>
                )}
                {hotel.status === 'offline' && (
                  <button onClick={() => handleRestore(hotel.id)}>恢复</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelAudit;