"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_IDENTITY } from "@/app/config/site_identity";

function whatsappNumber(phone: string) {
  const primary = phone.split(",")[0].trim();
  const digits = primary.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  return digits;
}

const WhatsAppButton: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber(SITE_IDENTITY.contact.phone);
    const message = encodeURIComponent(
      `Hi! I'm interested in MBBS admission guidance from ${SITE_IDENTITY.name}.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleWhatsAppClick}
      className="fixed bottom-[calc(var(--bottom-ticker-h)+max(1.5rem,env(safe-area-inset-bottom)))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.55)] transition-transform duration-200 hover:scale-105 hover:bg-[#20bd5a] active:scale-95 group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-[34px] w-[34px]" aria-hidden />
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-full bg-[#075E54] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </button>
  );
};

export default WhatsAppButton;
