import React from 'react';

const range = (start: number, end: number) => {
  const r = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
};

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  pageSize, 
  totalItems, 
  onPageChange,
  maxVisiblePages = 5 
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Calculate visible page range
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return range(1, totalPages);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return range(startPage, endPage);
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent cursor-pointer"
      >
        Prev
      </button>

      {/* First Page */}
      {showFirstPage && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-lg font-medium transition-colors cursor-pointer ${
            page === currentPage
              ? 'bg-[#4E6E5D] text-white border-[#4E6E5D]'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {showLastPage && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 disabled:hover:bg-transparent cursor-pointer"
      >
        Next
      </button>

      {/* Page Info */}
      <span className="text-sm text-gray-600 ml-2 whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;