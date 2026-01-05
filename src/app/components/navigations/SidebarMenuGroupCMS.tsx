"use client";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface SidebarMenuGroupCMSProps {
  groupName: string;
  children: ReactNode;
}

export default function SidebarMenuGroupCMS(props: SidebarMenuGroupCMSProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar-group flex flex-col gap-1">
      <div
        className="sidebar-group-name p-2 flex items-center rounded-md justify-between hover:bg-black/5 hover:cursor-pointer"
        onClick={toggleDropdown}
      >
        <p className="font-bodycopy text-xs text-black/35  font-semibold tracking-widest">
          {props.groupName.toUpperCase()}
        </p>
        <ChevronDown
          className={`size-5 transform transition-transform text-black/35 duration-300 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
      {isDropdownOpen && (
        <div
          className={`sidebar-item flex flex-col gap-1 overflow-hidden transition-all duration-700 ease-in-out ${
            isDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {props.children}
        </div>
      )}
    </div>
  );
}
