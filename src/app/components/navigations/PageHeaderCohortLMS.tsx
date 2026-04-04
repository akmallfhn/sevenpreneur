"use client";
import React, { ReactNode } from "react";
import AvatarBadgeLMS, {
  AvatarBadgeLMSProps,
} from "../../../components/buttons/AvatarBadgeLMS";
import AppBreadcrumb from "./AppBreadcrumb";
import AppBreadcrumbItem from "./AppBreadcrumbItem";

export interface PageHeaderCohortLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  headerTitle: string;
  headerIcon: ReactNode;
  headerIconColor: string;
}

export default function PageHeaderCohortLMS(props: PageHeaderCohortLMSProps) {
  return (
    <React.Fragment>
      <div className="header-root flex sticky w-full top-0 left-0 px-0 py-3 items-center justify-center bg-white border-b border-outline z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between">
          <div className="header-page-data flex flex-col gap-1">
            <div className="header-breadcrumb flex items-center gap-2">
              <AppBreadcrumb className="text-[#333333]/90">
                <p className="slash font-bodycopy text-sm">/</p>
                <AppBreadcrumbItem href={`/cohorts/${props.cohortId}`}>
                  {props.cohortName}
                </AppBreadcrumbItem>
                <p className="slash font-bodycopy text-sm">/</p>
                <AppBreadcrumbItem isCurrentPage>
                  {props.headerTitle}
                </AppBreadcrumbItem>
              </AppBreadcrumb>
            </div>
            <div className="header-information flex items-center gap-3">
              <div
                className={`header-icon flex ${props.headerIconColor} size-9 items-center justify-center rounded-md overflow-hidden`}
              >
                {props.headerIcon}
              </div>
              <h1 className="header-title font-bodycopy font-bold text-xl">
                {props.headerTitle}
              </h1>
            </div>
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
