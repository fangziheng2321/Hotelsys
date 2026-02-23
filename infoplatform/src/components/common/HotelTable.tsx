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
          <th className="col-image">图片</th>
          <th className="col-name">酒店名称</th>
          <th className="col-type">
            <HeaderFilter
              value={filters.hotelType}
              onChange={(value) => onFilterChange({ ...filters, hotelType: value as HotelType })}
              options={hotelTypeOptions}
            />
          </th>
          <th className="col-address">地址</th>
          <th className="col-phone">电话</th>
          {isAdmin && <th className="col-merchant">商户名称</th>}
          <th className="col-status">
            <HeaderFilter
              value={filters.status}
              onChange={(value) => onFilterChange({ ...filters, status: value as HotelStatus })}
              options={hotelStatusOptions}
            />
          </th>
          <th className="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        {hotels.map(hotel => (
          <tr key={hotel.id}>
            <td className="col-image">
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
            <td className="col-name">{hotel.name}</td>
            <td className="col-type">{getHotelTypeText(hotel.hotelType)}</td>
            <td className="col-address">{hotel.address}</td>
            <td className="col-phone">{hotel.phone}</td>
            {isAdmin && <td className="col-merchant">{(hotel as AdminHotelListItem).merchantName}</td>}
            <td className={`col-status status-${hotel.status}`}>{getStatusText(hotel.status)}</td>
            <td className="col-actions">
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