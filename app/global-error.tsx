"use client";

type ErrorProps = {
  reset: () => void; // The reset function provided to the component
};

function Error({ reset }: ErrorProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600">خطأ</h1>
      <p className="text-lg mt-4">
        حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا
      </p>
      <p className="text-base mt-2">إذا استمرت المشكلة، يرجى الاتصال بالدعم</p>
      <button
        onClick={() => reset()}
        className="mt-6 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
      >
        تحديث الصفحة
      </button>
    </div>
  );
}

export default Error;
