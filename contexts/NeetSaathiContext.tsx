"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface NeetSaathiContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const NeetSaathiContext = createContext<NeetSaathiContextType | undefined>(
  undefined
);

export function useNeetSaathi() {
  const ctx = useContext(NeetSaathiContext);
  if (!ctx) {
    throw new Error("useNeetSaathi must be used within NeetSaathiProvider");
  }
  return ctx;
}

export function NeetSaathiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      openChat: () => setIsOpen(true),
      closeChat: () => setIsOpen(false),
      toggleChat: () => setIsOpen((v) => !v),
    }),
    [isOpen]
  );

  return (
    <NeetSaathiContext.Provider value={value}>
      {children}
    </NeetSaathiContext.Provider>
  );
}
