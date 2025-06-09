"use client";
import Link from "next/link";
import { Eye, Settings2, Trash2 } from "lucide-react";

export default function DropdownMenuCMS({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="dropdown-container absolute flex w-max bg-white left-1/2 top-full mt-2 -translate-x-1/2 border border-[#E3E3E3] rounded-md z-30">
      <div className="menu-group flex flex-col gap-1 text-sm font-bodycopy font-medium">
        {/* --- View */}
        <Link
          href={"/users/f1d27a50-00f1-48c0-9265-c516ae1f532a"}
          className="menu-list flex px-4 py-1.5 items-center gap-2 hover:text-cms-primary hover:bg-[#E1EDFF] hover:cursor-pointer"
        >
          <Eye className="size-4" />
          View
        </Link>

        {/* --- Edit */}
        <Link
          href={"/users/adadadasda/edit"}
          className="menu-list flex px-4 py-1.5 items-center gap-2 hover:text-cms-primary hover:bg-[#E1EDFF] hover:cursor-pointer"
        >
          <Settings2 className="size-4" />
          Edit
        </Link>

        {/* --- Delete */}
        <div className="menu-list flex px-4 py-1.5 items-center gap-2 text-[#E62314] hover:bg-[#FFCDC9] hover:cursor-pointer">
          <Trash2 className="size-4" />
          Delete
        </div>
      </div>
    </div>
  );
}
