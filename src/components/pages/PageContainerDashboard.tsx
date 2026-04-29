"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { forwardRef, HTMLAttributes, ReactNode } from "react";

interface PageContainerDashboardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const PageContainerDashboard = forwardRef<
  HTMLDivElement,
  PageContainerDashboardProps
>(({ children, className, ...rest }, ref) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`root-page hidden lg:flex w-full ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div
        ref={ref}
        className={`page-container flex flex-col w-full ${className ?? ""}`}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
});

PageContainerDashboard.displayName = "PageContainerDashboard";

export default PageContainerDashboard;
