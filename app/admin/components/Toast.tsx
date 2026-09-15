"use client";

import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const styles: Record<
  ToastType,
  { wrap: string; icon: typeof FaCheckCircle; iconCls: string }
> = {
  success: {
    wrap: "border-emerald-400/35 bg-[#0f2a22] text-emerald-100",
    icon: FaCheckCircle,
    iconCls: "text-emerald-300",
  },
  error: {
    wrap: "border-red-400/35 bg-[#2a1418] text-red-100",
    icon: FaExclamationCircle,
    iconCls: "text-red-300",
  },
  info: {
    wrap: "border-sky-400/35 bg-[#13284f] text-sky-100",
    icon: FaInfoCircle,
    iconCls: "text-sky-300",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const cfg = styles[toast.type];
  const Icon = cfg.icon;

  return (
    <div
      className={`pointer-events-auto flex w-[min(92vw,360px)] items-start gap-3 rounded-[14px] border px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${cfg.wrap}`}
      role="status"
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cfg.iconCls}`} />
      <p className="flex-1 font-body text-sm font-medium leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-md p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
        aria-label="Dismiss"
      >
        <FaTimes className="h-3 w-3" />
      </button>
    </div>
  );
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
