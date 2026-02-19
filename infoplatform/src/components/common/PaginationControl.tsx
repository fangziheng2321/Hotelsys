import React from 'react';

interface PaginationControlProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  page,
  totalPages,
  onPageChange
}) => {
  // 生成分页按钮
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 第一页按钮
    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => onPageChange(1)} className="page-btn">
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
      }
    }

    // 中间页码按钮
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-btn ${i === page ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // 最后一页按钮
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="page-btn"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="page-btn prev"
      >
        上一页
      </button>
      {renderPageButtons()}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="page-btn next"
      >
        下一页
      </button>
    </div>
  );
};

export default PaginationControl;