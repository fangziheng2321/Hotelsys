import React from 'react';

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
}

const AsyncButton: React.FC<AsyncButtonProps> = ({
  children,
  loading = false,
  loadingText = '处理中...',
  variant = 'primary',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonClass = () => {
    const baseClass = 'async-button';
    const variantClass = `button-${variant}`;
    return `${baseClass} ${variantClass} ${isDisabled ? 'button-disabled' : ''}`;
  };

  return (
    <button
      className={getButtonClass()}
      disabled={isDisabled}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default AsyncButton;
