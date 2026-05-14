"use client";
import AppButton from "@/components/buttons/AppButton";
import CreateCohortFormCMS from "@/components/forms/CreateCohortFormCMS";
import CohortItemCardCMS from "@/components/items/CohortItemCardCMS";
import PageHeaderCMS from "@/components/titles/PageHeaderCMS";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { GraduationCap, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";

dayjs.extend(isBetween);

interface CohortListCMSProps {
  sessionToken: string;
  sessionUserRoleName: string;
}

export default function CohortListCMS({
  sessionToken,
  sessionUserRoleName,
}: CohortListCMSProps) {
  const utils = trpc.useUtils();
  const [createCohort, setCreateCohort] = useState(false);

  const allowedRolesCreateCohort = [
    "Administrator",
    "Super Admin",
    "Class Manager",
  ];

  const {
    data: cohortListData,
    isError,
    isLoading,
  } = trpc.list.cohorts.useQuery({}, { enabled: !!sessionToken });

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="index w-full flex flex-col gap-4">
          <PageHeaderCMS
            name="Cohort Programs"
            desc="View and manage all your existing cohort programs in one place"
            icon={GraduationCap}
          >
            {allowedRolesCreateCohort.includes(sessionUserRoleName) && (
              <AppButton
                onClick={() => setCreateCohort(true)}
                variant="tertiary"
              >
                <PlusCircle className="size-5" />
                Create Cohort
              </AppButton>
            )}
          </PageHeaderCMS>

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {cohortListData && !isLoading && !isError && (
            <div className="cohort-list grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {cohortListData?.list.map((post) => (
                <CohortItemCardCMS
                  key={post.id}
                  sessionToken={sessionToken}
                  sessionUserRoleName={sessionUserRoleName}
                  cohortId={post.id}
                  cohortName={post.name}
                  cohortImage={post.image}
                  cohortStartDate={post.start_date}
                  cohortEndDate={post.end_date}
                  onDeleteSuccess={() => utils.list.cohorts.invalidate()}
                />
              ))}
            </div>
          )}
        </div>
      </PageContainerCMS>

      {/* Form Create Cohort */}
      {createCohort && (
        <CreateCohortFormCMS
          isOpen={createCohort}
          onClose={() => setCreateCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
