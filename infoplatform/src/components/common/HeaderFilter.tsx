import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface HeaderFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

const HeaderFilter: React.FC<HeaderFilterProps> = ({ value, onChange, options }) => {
  return (
    <select
      className="header-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default HeaderFilter;