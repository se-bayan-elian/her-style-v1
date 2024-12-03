import React from "react";

function Loading({ className }: { className?: string }) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <img
          src="/LOGO1-02.png" // Replace with your image path
          alt="Loader Icon"
          className="w-24 h-24 object-contain animate-pulse" // Increase image size
        />
      </div>
    </div>
  );
}

export default Loading;
