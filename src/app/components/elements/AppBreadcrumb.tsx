"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface AppBreadcrumbProps {
  children?: ReactNode;
}

export default function AppBreadcrumb({ children }: AppBreadcrumbProps) {
  return (
    <div className="breadcrumb flex text-alternative text-sm font-bodycopy font-medium gap-1.5 items-center">
      <Link href={"/"} className="flex items-center gap-1.5">
        <FontAwesomeIcon icon={faHome} className="size-3" />
        <p>Home</p>
      </Link>
      {children}
    </div>
  );
}
