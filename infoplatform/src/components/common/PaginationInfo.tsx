import React from 'react';

interface PaginationInfoProps {
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  search?: string;
  searchInput?: string;
  onSearchInputChange?: (search: string) => void;
  onSearchSubmit?: () => void;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  total,
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  search = '',
  searchInput = '',
  onSearchInputChange,
  onSearchSubmit
}) => {
  return (
    <div className="pagination-info" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: '10px',
      padding: '8px 0'
    }}>
      {(onSearchInputChange && onSearchSubmit) && (
        <div className="search-section" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          margin: 0,
          padding: 0,
          marginLeft: '12px'
        }}>
          <input
            type="text"
            placeholder="搜索酒店名称"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            style={{
              padding: '0 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '200px',
              fontSize: '14px',
              boxSizing: 'border-box',
              height: '32px',
              lineHeight: '32px',
              margin: 0,
              textAlign: 'left'
            }}
          />
          <button
            onClick={onSearchSubmit}
            style={{
              borderRadius: '4px',
              border: '1px solid #007bff',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              boxSizing: 'border-box',
              height: '32px',
              lineHeight: '32px',
              textAlign: 'center',
              width: '60px',
              padding: 0,
              margin: 0,
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          >
            搜索
          </button>
        </div>
      )}
      <div className="page-info-section" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        margin: 0,
        padding: 0,
        marginRight: '12px'
      }}>
        <span className="total-count">共 {total} 条记录</span>
        <span className="page-info">第 {page}/{totalPages} 页</span>
        <div className="page-size-selector">
          <span>每页：</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ 
              padding: '2px 4px',
              boxSizing: 'border-box',
              height: '24px'
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaginationInfo;