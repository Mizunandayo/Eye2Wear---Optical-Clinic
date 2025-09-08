/**
 * Optimized Pagination Component
 * Provides fast, accessible pagination controls
 */
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
  showInfo = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border">
      {/* Items info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* First page */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium border rounded-md ${
                currentPage === 1
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-2 text-sm font-medium border rounded-md ${
              currentPage === page
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Last page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className={`px-3 py-2 text-sm font-medium border rounded-md ${
                currentPage === totalPages
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          Loading...
        </div>
      )}
    </div>
  );
};

export default Pagination;
