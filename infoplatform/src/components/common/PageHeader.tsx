import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      {action}
    </div>
  );
};

export default PageHeader;