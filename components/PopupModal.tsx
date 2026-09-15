"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const PopupModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-primary shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-primary-hover shadow-lg transition-colors duration-200 hover:bg-secondary group"
          aria-label="Close modal"
        >
          <FaTimes className="text-sm text-surface group-hover:text-white" />
        </button>

        <div className="relative aspect-square w-full">
          <Image
            src="/banner.webp"
            alt={`${SITE_IDENTITY.name} promotion — ${SITE_IDENTITY.tagline}`}
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
