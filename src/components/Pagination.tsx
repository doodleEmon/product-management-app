import React from 'react';

const range = (start: number, end: number) => {
  const r = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
};

const Pagination: React.FC<{ currentPage: number; pageSize: number; totalItems: number; onPageChange: (p: number) => void }> = ({ currentPage, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = range(1, totalPages);

  return (
    <div className="flex items-center gap-2">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="px-3 py-1 border rounded">Prev</button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 border rounded ${p === currentPage ? 'bg-gray-200' : ''}`}>{p}</button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="px-3 py-1 border rounded">Next</button>
    </div>
  );
};

export default Pagination;