"use client";
import { HTMLAttributes, ReactNode } from "react";

interface PageContainerSVPProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function PageContainerSVP(props: PageContainerSVPProps) {
  return (
    <div
      className={`page-root flex-col w-full items-center bg-background ${props.className}`}
    >
      <div className="page-container flex px-5 w-full lg:px-0 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {props.children}
      </div>
    </div>
  );
}
