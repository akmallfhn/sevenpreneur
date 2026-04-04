"use client";
import React, { ReactNode } from "react";
import AvatarBadgeLMS, {
  AvatarBadgeLMSProps,
} from "../../../components/buttons/AvatarBadgeLMS";

export interface PageHeaderLMSProps extends AvatarBadgeLMSProps {
  headerTitle: string;
  headerIcon: ReactNode;
  headerIconColor: string;
}

export default function PageHeaderLMS(props: PageHeaderLMSProps) {
  return (
    <React.Fragment>
      <div className="header-root flex sticky w-full top-0 left-0 px-0 py-3 items-center justify-center bg-white border-b border-outline z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between">
          <div className="header-page-data flex items-center gap-3">
            <div
              className={`header-icon flex ${props.headerIconColor} size-9 items-center justify-center rounded-md overflow-hidden`}
            >
              {props.headerIcon}
            </div>
            <h1 className="header-title font-bodycopy font-bold text-xl">
              {props.headerTitle}
            </h1>
          </div>
          <AvatarBadgeLMS
            sessionUserAvatar={props.sessionUserAvatar}
            sessionUserName={props.sessionUserName || "Unknown"}
            sessionUserRole={props.sessionUserRole}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
