import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi, Hotel } from '../../mock/data';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    // 使用模拟API获取商户的酒店列表
    const response = mockApi.getMerchantHotels('1'); // 模拟商户ID
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

  return (
    <div className="hotel-list-container">
      <h2>我的酒店</h2>
      <div className="action-bar">
        <Link to="/hotel/add">
          <button>添加酒店</button>
        </Link>
      </div>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>酒店名称</th>
            <th>地址</th>
            <th>联系电话</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.phone}</td>
              <td>{getStatusText(hotel.status)}</td>
              <td>
                <Link to={`/hotel/edit/${hotel.id}`}>
                  <button>编辑</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelList;