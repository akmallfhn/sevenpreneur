"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react";

export default function SidebarMenuGroupCMS({title, children}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return(
      <div className="sidebar-group flex flex-col gap-1">
        <div className="sidebar-group-name p-2 pl-4 text-main-white/50 flex items-center rounded-md justify-between hover:bg-sidebar-group-name-hover" 
          onClick={toggleDropdown}>
            <p className="font-main text-xs font-semibold tracking-widest">{title}</p>
            {isDropdownOpen ? <ChevronUp className="size-5"/> : <ChevronDown className="size-5"/>}
        </div>
        {isDropdownOpen && (
          <div className="sidebar-item flex flex-col gap-1">
              {children}
          </div>
        )}
      </div>
    )
}