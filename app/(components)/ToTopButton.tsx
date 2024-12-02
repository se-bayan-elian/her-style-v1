"use client";
import React, { useState, useEffect } from "react";

const GoToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Listen to the scroll event
    const handleScroll = () => {
      // Show button when the page is scrolled 100px down
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 left-5 bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl
        ${show ? "opacity-100 visible" : "opacity-0 invisible"} 
        box-shadow-[0_0_0_0_rgba(128,_0,_128,_0.7)] animate-pulse-purple z-[999999]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 19V6M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default GoToTopButton;
