import React, { useEffect, useMemo, useState } from "react";

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChanged: (param: { page: number; limit: number }) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChanged,
  isLoading = false,
  itemsPerPage = 10,
  totalItems = 0,
}) => {
  const [startItem, setStartItem] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [endItem, setEndItem] = useState(0);

  useEffect(() => {
    setStartItem((currentPage - 1) * itemsPerPage + 1);
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
    setEndItem(Math.min(currentPage * itemsPerPage, totalItems));
  }, [currentPage, itemsPerPage, totalItems]);

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChanged({ page, limit: itemsPerPage });
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    console.log({
      startPage,
      endPage,
      totalPages,
    });

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageClick(i)}
            className={`flex items-center justify-center px-3 h-8 leading-tight ${
              i === currentPage
                ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
            aria-current={i === currentPage ? "page" : undefined}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  }, [currentPage, totalPages, handlePageClick]);

  return (
    <nav
      className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Showing&nbsp;
        <span className="font-semibold text-gray-900 dark:text-white">
          {startItem}-{endItem}
        </span>
        &nbsp; of&nbsp;
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>
      </span>
      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
        </li>
        {pageNumbers}
        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
