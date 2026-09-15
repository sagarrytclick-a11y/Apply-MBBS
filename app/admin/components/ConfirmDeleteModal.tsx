"use client";

import React from "react";
import { FaExclamationTriangle, FaSpinner, FaTrash } from "react-icons/fa";

interface ConfirmDeleteModalProps {
  open: boolean;
  name?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  open,
  name,
  loading,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0a1730]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[20px] border border-white/12 bg-[#13284f] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-red-400/30 bg-red-400/10">
              <FaExclamationTriangle className="text-lg text-red-300" />
            </div>
            <div>
              <h3
                id="delete-confirm-title"
                className="font-display text-lg font-extrabold text-white"
              >
                Delete enquiry?
              </h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-white/60">
                This will permanently remove{" "}
                {name ? (
                  <span className="font-semibold text-white">{name}</span>
                ) : (
                  "this enquiry"
                )}{" "}
                from your database. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-[12px] border border-white/15 px-5 py-2.5 font-body text-sm font-semibold text-white/75 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-red-500 px-5 py-2.5 font-body text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <FaTrash className="text-xs" />
                Yes, delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
