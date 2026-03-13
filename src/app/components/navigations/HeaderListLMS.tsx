"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import AvatarBadgeLMS, { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";

export interface HeaderListLMSProps extends AvatarBadgeLMSProps {
  headerTitle: string;
  headerDescription?: string;
}

export default function HeaderListLMS(props: HeaderListLMSProps) {
  return (
    <React.Fragment>
      <div className="header-root flex sticky w-full top-0 left-0 px-0 py-5 items-center justify-center bg-section-background z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between">
          <div className="header-page-data flex items-center gap-2">
            <h1 className="header-title font-brand font-bold text-2xl">
              {props.headerTitle}
            </h1>
            {props.headerDescription && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <FontAwesomeIcon
                    icon={faCircleQuestion}
                    className="text-alternative hover:cursor-pointer"
                    size="sm"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="header-desc max-w-[120px] text-center font-bodycopy">
                    {props.headerDescription}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
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
