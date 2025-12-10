"use client";
import Link from "next/link";

interface SideMenuItemMobileSVPProps {
  menuName: string;
  menuURL?: string;
  destructiveColor?: boolean;
  onClick: () => void;
}

export default function SideMenuItemMobileSVP(
  props: SideMenuItemMobileSVPProps
) {
  if (props.menuURL) {
    <Link href={props.menuURL} onClick={props.onClick}>
      <li
        className={`font-bodycopy font-medium text-base ${
          props.destructiveColor
            ? "text-destructive"
            : "text-[#111111] dark:text-white"
        }`}
      >
        {props.menuName}
      </li>
    </Link>;
  }

  return (
    <li
      className={`font-bodycopy font-medium text-base ${
        props.destructiveColor
          ? "text-destructive"
          : "text-[#111111] dark:text-white"
      }`}
      onClick={props.onClick}
    >
      {props.menuName}
    </li>
  );
}
