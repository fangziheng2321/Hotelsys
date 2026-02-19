import React, { ReactNode } from 'react';
import { HotelType, HotelStatus, MerchantHotelListItem, AdminHotelListItem } from '../../services/api';
import HeaderFilter from './HeaderFilter';
import { getStatusText, getHotelTypeText, hotelTypeOptions, hotelStatusOptions } from '../../utils/hotelUtils';

interface HotelTableProps {
  hotels: (MerchantHotelListItem | AdminHotelListItem)[];
  isAdmin?: boolean;
  loadingDetail?: boolean;
  filters: {
    hotelType: HotelType | '';
    status: HotelStatus | '';
  };
  onFilterChange: (filters: { hotelType: HotelType | ''; status: HotelStatus | '' }) => void;
  renderActions?: (hotel: MerchantHotelListItem | AdminHotelListItem, loadingDetail: boolean) => ReactNode;
}

const HotelTable: React.FC<HotelTableProps> = ({
  hotels,
  isAdmin = false,
  loadingDetail = false,
  filters,
  onFilterChange,
  renderActions
}) => {
  return (
    <table className="hotel-table">
      <thead>
        <tr>
          <th>图片</th>
          <th>酒店名称</th>
          <th>
            <HeaderFilter
              value={filters.hotelType}
              onChange={(value) => onFilterChange({ ...filters, hotelType: value as HotelType })}
              options={hotelTypeOptions}
            />
          </th>
          <th>地址</th>
          <th>电话</th>
          {isAdmin && <th>商户名称</th>}
          <th>
            <HeaderFilter
              value={filters.status}
              onChange={(value) => onFilterChange({ ...filters, status: value as HotelStatus })}
              options={hotelStatusOptions}
            />
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {hotels.map(hotel => (
          <tr key={hotel.id}>
            <td>
              {hotel.firstImage ? (
                <img
                  src={hotel.firstImage}
                  alt={hotel.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '12px',
                    border: '1px solid #ddd'
                  }}
                >
                  无图片
                </div>
              )}
            </td>
            <td>{hotel.name}</td>
            <td>{getHotelTypeText(hotel.hotelType)}</td>
            <td>{hotel.address}</td>
            <td>{hotel.phone}</td>
            {isAdmin && <td>{(hotel as AdminHotelListItem).merchantName}</td>}
            <td className={`status-${hotel.status}`}>{getStatusText(hotel.status)}</td>
            <td>
              {renderActions ? renderActions(hotel, loadingDetail) : (
                // 默认操作按钮（如果没有提供 renderActions）
                <span>无操作</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HotelTable;