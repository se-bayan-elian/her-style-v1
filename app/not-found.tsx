"use client";

import Link from "next/link";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-gray-50">
      {/* SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>

      {/* Title */}
      <h1 className="text-4xl font-bold text-red-600 mt-4">404 - خطأ</h1>

      {/* Message */}
      <p className="text-lg mt-2 text-gray-700">
        الصفحة التي تبحث عنها غير موجودة
      </p>
      <p className="text-base mt-1 text-gray-500">
        إذا استمرت المشكلة، يرجى الاتصال بالدعم
      </p>

      {/* Link to home */}
      <Link
        href="/"
        className="mt-6 bg-purple-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-purple-700 transition-colors shadow-lg"
      >
        عودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}

export default NotFound;
