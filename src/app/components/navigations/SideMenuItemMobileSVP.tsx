"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface SideMenuItemMobileSVPProps {
  menuName: string;
  menuIcon: ReactNode;
  menuURL?: string;
  destructiveColor?: boolean;
  onClick: () => void;
}

export default function SideMenuItemMobileSVP(
  props: SideMenuItemMobileSVPProps
) {
  if (props.menuURL) {
    return (
      <Link href={props.menuURL} onClick={props.onClick}>
        <li
          className={`flex items-center font-bodycopy font-medium text-[15px] gap-2 ${
            props.destructiveColor
              ? "text-destructive"
              : "text-[#111111] dark:text-white"
          }`}
        >
          {props.menuIcon}
          {props.menuName}
        </li>
      </Link>
    );
  }

  return (
    <li
      className={`flex items-center font-bodycopy font-medium text-[15px] gap-2 ${
        props.destructiveColor
          ? "text-destructive"
          : "text-[#111111] dark:text-white"
      }`}
      onClick={props.onClick}
    >
      {props.menuIcon}
      {props.menuName}
    </li>
  );
}
