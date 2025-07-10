import "@/app/globals.css";
import AppBottomFooter from "@/app/components/navigations/AppBottomFooter";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sevenpreneur.com"),
  alternates: {
    canonical: "/",
  },
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      {children}
      <AppBottomFooter />
    </div>
  );
}
