"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { HTMLAttributes, ReactNode } from "react";

interface PageContainerAILNProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function PageContainerAILN(props: PageContainerAILNProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`page-root font-read hidden lg:flex w-full items-center justify-center ${props.className} ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="page-container flex w-full h-full max-w-[calc(100%-4rem)] py-6 gap-5">
        {props.children}
      </div>
    </div>
  );
}
