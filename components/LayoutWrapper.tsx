"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ContactPopup = dynamic(() => import("./ContactPopup"), { ssr: false });
const SideFloatActions = dynamic(() => import("./SideFloatActions"), { ssr: false });
const BottomTicker = dynamic(() => import("./BottomTicker"), { ssr: false });
const NeetSaathiChat = dynamic(() => import("./NeetSaathiChat"), { ssr: false });

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <div className="h-(--bottom-ticker-h)" aria-hidden />
      <ContactPopup />
      <SideFloatActions />
      <NeetSaathiChat />
      <BottomTicker />
    </>
  );
}
