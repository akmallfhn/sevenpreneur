"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SidebarContextType = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

interface SidebarProviderCMSProps {
  children: ReactNode;
}

export function SidebarProvider(props: SidebarProviderCMSProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("sidebar");
    return saved === "true";
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar", String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, setCollapsed: setIsCollapsed }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
