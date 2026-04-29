"use client";
import React from "react";
import AvatarBadgeLMS, { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppBreadcrumb from "./AppBreadcrumb";
import AppBreadcrumbItem from "./AppBreadcrumbItem";

export interface HeaderAIResultDetailsLMSProps extends AvatarBadgeLMSProps {
  headerResultName: string;
  headerTitle: string;
  headerDescription?: string;
}

export default function HeaderAIResultDetailsLMS(
  props: HeaderAIResultDetailsLMSProps
) {
  return (
    <React.Fragment>
      <div className="header-root flex sticky w-full top-0 left-0 px-0 py-5 items-center justify-center bg-dashboard-bg z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between">
          <div className="header-page-data flex flex-col gap-3">
            <div className="header-breadcrumb flex items-center gap-4">
              <AppBreadcrumb className="text-emphasis">
                <p className="slash font-bodycopy">/</p>
                <AppBreadcrumbItem href="/ai">AI</AppBreadcrumbItem>
                <p className="slash font-bodycopy">/</p>
                <AppBreadcrumbItem isCurrentPage>Result</AppBreadcrumbItem>
              </AppBreadcrumb>
            </div>
            <div className="header-information flex flex-col gap-2">
              <h1 className="header-title font-brand font-bold text-2xl">
                {props.headerTitle}
              </h1>
              {props.headerDescription && (
                <p className="font-bodycopy font-medium text-emphasis">
                  {props.headerDescription}
                </p>
              )}
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
