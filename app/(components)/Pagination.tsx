import React from "react";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination = ({
  currentPage = 0,
  totalCount = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  console.log("pagination ");
  console.log(totalCount, limit);
  const totalPages = Math.ceil(totalCount / limit);
  console.log(totalPages);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages === 0) return null;
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 text-right"
      dir="rtl"
    >
      <div>
        <span>عدد العناصر في الصفحة: </span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex  md:gap-2 gap-1">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          السابق
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Pagination;
