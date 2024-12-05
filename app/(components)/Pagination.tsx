import React from "react";
import { cn } from "@/lib/utils";

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
    const delta = 2; // Number of pages to show around the current page
    const range: (number | string)[] = [];
    const left = Math.max(currentPage - delta, 1);
    const right = Math.min(currentPage + delta, totalPages);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 2) range.unshift("...");
    if (left > 1) range.unshift(1);

    if (right < totalPages - 1) range.push("...");
    if (right < totalPages) range.push(totalPages);

    return range;
  };

  const pages = getPageRange();

  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4"
      dir="rtl"
    >
      {/* Limit Selector */}
      <div className="flex items-center gap-2">
        <span>عدد العناصر في الصفحة:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-500 focus:outline-none"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-1 mx-2">
        <button
          className={cn(
            "px-3 py-1 border rounded-md",
            currentPage === 1 && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          السابق
        </button>

        {pages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={cn(
                "px-3 py-1 border rounded-md transition-colors",
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-gray-500">
              ...
            </span>
          )
        )}

        <button
          className={cn(
            "px-3 py-1 border rounded-md",
            currentPage === totalPages && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Pagination;
