"use client";

export default function DropdownMenuCMS({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="dropdown-container absolute flex w-max bg-white left-1/2 top-full mt-1 -translate-x-1/2 border border-[#E3E3E3] rounded-md z-30 overflow-hidden">
      <div className="menu-group flex flex-col gap-1 text-[13px] font-bodycopy font-medium">
        {children}
      </div>
    </div>
  );
}
