import React from "react";
import { cn } from "@/lib/utils";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Import icons

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalCount = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) => {
  const totalPages = Math.ceil(totalCount / limit);

  if (totalPages === 0) return null;

  const getPageRange = () => {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    const startPage = Math.max(
      Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1),
      1
    );
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageRange();

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 p-4 "
      dir="rtl"
    >
      {/* Limit Selector */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">عدد العناصر في الصفحة:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-blue-500 focus:outline-none"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center md:gap-2  gap-1">
        {/* Previous Button */}
        <button
          className={cn(
            "p-2 border rounded-md transition-all",
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple text-white hover:bg-purple-600"
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous"
        >
          <AiOutlineRight className="w-5 h-5" />

        </button>

        {/* Page Buttons */}
        {pages.map((page) => (
          <button
            key={page}
            className={cn(
              "px-3 py-1 border rounded-md text-sm font-medium transition-all",
              page === currentPage
                ? "bg-purple text-white"
                : "bg-white hover:bg-gray-100"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          className={cn(
            "p-2 border rounded-md transition-all",
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple text-white hover:bg-purple-600"
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next"
        >
          <AiOutlineLeft className="w-5 h-5" />

        </button>
      </div>
    </div>
  );
};

export default Pagination;
