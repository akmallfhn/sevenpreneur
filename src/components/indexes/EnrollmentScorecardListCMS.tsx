"use client";
import { trpc } from "@/trpc/client";
import { Settings } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface EnrollmentScorecardListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function EnrollmentScorecardListCMS(
  props: EnrollmentScorecardListCMSProps
) {
  const allowedRolesManageUser = [0];
  const isAllowedManageUser = allowedRolesManageUser.includes(
    props.sessionUserRole
  );

  const {
    data: enrolledUser,
    isError,
    isLoading,
  } = trpc.list.cohortMembers.useQuery(
    { cohort_id: props.cohortId },
    { enabled: !!props.sessionToken }
  );
  const enrolledStudents = enrolledUser?.list.filter(
    (item) => item.role_id === 3
  );
  const enrolledEducators = enrolledUser?.list.filter(
    (item) => item.role_id === 1
  );
  const enrolledClassManager = enrolledUser?.list.filter(
    (item) => item.role_id === 2
  );

  return (
    <div className="enrolled-user flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <div className="section-name flex justify-between items-center">
        <h2 className="label-name font-brand font-bold">Enrolled Users</h2>
        {isAllowedManageUser && (
          <Link href={`/cohorts/${props.cohortId}/members`}>
            <AppButton variant="light" size="small">
              <Settings className="size-4" />
              Manage Access
            </AppButton>
          </Link>
        )}
      </div>

      {isLoading && <AppLoadingComponents />}
      {isError && <AppErrorComponents />}

      {!isLoading && !isError && (
        <div className="user-list flex flex-col w-full gap-2">
          <ScorecardItemCMS
            scorecardName="Enrolled Students"
            scorecardBackground="bg-[#FF7830]"
            scorecardValue={enrolledStudents?.length || "-"}
          />
          <ScorecardItemCMS
            scorecardName="Enrolled Educators"
            scorecardBackground="bg-success-foreground"
            scorecardValue={enrolledEducators?.length || "-"}
          />
          <ScorecardItemCMS
            scorecardName="Enrolled Class Manager"
            scorecardBackground="bg-secondary"
            scorecardValue={enrolledClassManager?.length || "-"}
          />
        </div>
      )}
    </div>
  );
}
