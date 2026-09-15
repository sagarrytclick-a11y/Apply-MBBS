"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { usePopup } from "@/contexts/PopupContext";

function whatsappNumber(phone: string) {
  const primary = phone.split(",")[0].trim();
  const digits = primary.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  return digits;
}

export default function SideFloatActions() {
  const { openPopup } = usePopup();
  const phonePrimary = SITE_IDENTITY.contact.phone.split(",")[0].trim();
  const phoneTel = phonePrimary.replace(/[^0-9+]/g, "");

  const openWhatsApp = () => {
    const phoneNumber = whatsappNumber(SITE_IDENTITY.contact.phone);
    const message = encodeURIComponent(
      `Hi! I'm interested in MBBS admission guidance from ${SITE_IDENTITY.name}.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Left: Phone + WhatsApp — smaller on mobile to reduce content overlap */}
      <div
        className="fixed left-0 top-1/2 z-[70] flex -translate-y-1/2 flex-col gap-1.5 sm:gap-2"
        style={{ marginTop: "-2rem" }}
      >
        <a
          href={`tel:${phoneTel}`}
          aria-label={`Call ${phonePrimary}`}
          className="flex h-10 w-10 items-center justify-center rounded-r-[12px] bg-[#14532d] text-white shadow-[2px_4px_14px_rgba(20,83,45,0.35)] transition-colors hover:bg-accent sm:h-12 sm:w-12 sm:rounded-r-[14px]"
        >
          <Phone className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
        </a>
        <button
          type="button"
          onClick={openWhatsApp}
          aria-label="Chat on WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-r-[12px] bg-[#25D366] text-white shadow-[2px_4px_14px_rgba(37,211,102,0.35)] transition-colors hover:bg-[#20bd5a] sm:h-12 sm:w-12 sm:rounded-r-[14px]"
        >
          <FaWhatsapp className="h-4 w-4 sm:h-[22px] sm:w-[22px]" aria-hidden />
        </button>
      </div>

      {/* Right: Call Back */}
      <button
        type="button"
        onClick={openPopup}
        aria-label="Request a callback"
        className="fixed right-0 top-1/2 z-[70] flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-l-[12px] bg-[#14532d] px-2 py-3 text-white shadow-[-2px_4px_14px_rgba(20,83,45,0.35)] transition-colors hover:bg-accent sm:gap-2 sm:rounded-l-[14px] sm:px-3 sm:py-5"
        style={{ marginTop: "1.5rem" }}
      >
        <Phone className="h-3.5 w-3.5 shrink-0 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
        <span
          className="font-body text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Callback
        </span>
      </button>
    </>
  );
}
