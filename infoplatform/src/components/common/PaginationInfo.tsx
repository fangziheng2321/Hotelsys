import React from 'react';

interface PaginationInfoProps {
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  total,
  page,
  totalPages,
  pageSize,
  onPageSizeChange
}) => {
  return (
    <div className="pagination-info">
      <div className="page-info-section">
        <span className="total-count">共 {total} 条记录</span>
        <span className="page-info">第 {page}/{totalPages} 页</span>
        <div className="page-size-selector">
          <span>每页：</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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