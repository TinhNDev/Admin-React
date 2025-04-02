import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const SortableHeader = ({ label, field, sortField, sortOrder, onSort, className }) => {
  const getSortIcon = () => {
    if (sortField !== field) {
      return <FaSort className="ml-1 inline" />;
    }
    return sortOrder === 'asc' ? <FaSortUp className="ml-1 inline" /> : <FaSortDown className="ml-1 inline" />;
  };

  return (
    <th 
      scope='col' 
      className={`py-3 px-4 cursor-pointer ${className}`} 
      onClick={() => onSort(field)}
    >
      {label} {getSortIcon()}
    </th>
  );
};

export default SortableHeader;
