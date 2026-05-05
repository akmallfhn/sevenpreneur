"use client";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import { Eye, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppInput from "../fields/AppInput";
import EditCohortMemberFormCMS from "../forms/EditCohortMemberFormCMS";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import AppNumberPagination from "../navigations/AppNumberPagination";
import AppLoadingComponents from "../states/AppLoadingComponents";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeadCMS from "../tables/TableHeadCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";

const PAGE_SIZE = 10;

interface CohortMembersPerformanceCMSProps {
  sessionToken: string;
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortMembersPerformanceCMS({
  sessionToken,
  sessionUserId,
  sessionUserRole,
  cohortId,
}: CohortMembersPerformanceCMSProps) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

  const isAllowedDetails = [0, 1, 2].includes(sessionUserRole);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [keyword]);

  const { data, isLoading } = trpc.list.cohortMembers.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  const allStudents = (data?.list ?? [])
    .filter((m) => m.role_id === 3)
    .sort((a, b) => a.full_name.localeCompare(b.full_name));

  const filtered = debouncedKeyword
    ? allStudents.filter((m) =>
        m.full_name.toLowerCase().includes(debouncedKeyword.toLowerCase())
      )
    : allStudents;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <>
      <SectionContainerCMS title="Student Performance">
        <div className="flex flex-col gap-3">
          <div className="w-full max-w-xs">
            <AppInput
              variant="CMS"
              inputId="search-performance"
              inputType="search"
              inputIcon={<Search className="size-4" />}
              inputPlaceholder="Search students..."
              value={keyword}
              onInputChange={setKeyword}
            />
          </div>

          {isLoading ? (
            <AppLoadingComponents />
          ) : (
            <>
              <table className="w-full relative rounded-sm">
                <TableHeaderCMS>
                  <TableRowCMS>
                    <TableHeadCMS>NO.</TableHeadCMS>
                    <TableHeadCMS>NAME</TableHeadCMS>

                    <TableHeadCMS>ATTENDANCE</TableHeadCMS>
                    <TableHeadCMS>ASSIGNMENT</TableHeadCMS>
                    <TableHeadCMS>CERTIFICATE</TableHeadCMS>
                    {isAllowedDetails && <TableHeadCMS>ACTION</TableHeadCMS>}
                  </TableRowCMS>
                </TableHeaderCMS>
                <TableBodyCMS>
                  {paged.map((post, index) => (
                    <TableRowCMS key={post.id}>
                      <TableCellCMS>
                        {(safePage - 1) * PAGE_SIZE + index + 1}
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="flex items-center gap-3">
                          <div className="flex size-6 rounded-full shrink-0 overflow-hidden">
                            <Image
                              className="object-cover w-full h-full"
                              src={
                                post.avatar ||
                                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                              }
                              alt={post.full_name}
                              width={300}
                              height={300}
                            />
                          </div>
                          <p className="font-semibold font-bodycopy text-sm line-clamp-1">
                            {post.full_name}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="flex items-center gap-2 w-full min-w-[80px]">
                          <Progress
                            value={Math.round(
                              (post.attended_learning_count /
                                post.learning_count) *
                                100
                            )}
                          />
                          <p className="text-xs shrink-0">
                            {post.attended_learning_count}/{post.learning_count}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="flex items-center gap-2 w-full min-w-[80px]">
                          <Progress
                            value={Math.round(
                              (post.submitted_project_count /
                                post.project_count) *
                                100
                            )}
                          />
                          <p className="text-xs shrink-0">
                            {post.submitted_project_count}/{post.project_count}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        {!!post.certificate_url ? (
                          <BooleanLabelCMS label="UPLOADED" value={true} />
                        ) : (
                          <BooleanLabelCMS label="NOT UPLOADED" value={false} />
                        )}
                      </TableCellCMS>
                      {isAllowedDetails && (
                        <TableCellCMS>
                          <AppButton
                            variant="light"
                            size="icon"
                            onClick={() => setOpenDetailsId(post.id)}
                          >
                            <Eye className="size-4" />
                          </AppButton>
                        </TableCellCMS>
                      )}
                    </TableRowCMS>
                  ))}
                </TableBodyCMS>
              </table>

              {filtered.length === 0 && (
                <p className="text-sm text-center text-emphasis font-bodycopy py-4">
                  {debouncedKeyword
                    ? `No results for "${debouncedKeyword}"`
                    : "No students enrolled yet"}
                </p>
              )}

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-2">
                  <AppNumberPagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <p className="text-xs text-emphasis font-bodycopy">
                    Showing {paged.length} of {filtered.length} students
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </SectionContainerCMS>

      {openDetailsId && (
        <EditCohortMemberFormCMS
          sessionToken={sessionToken}
          sessionUserId={sessionUserId}
          sessionUserRole={sessionUserRole}
          userId={openDetailsId}
          cohortId={cohortId}
          isOpen={!!openDetailsId}
          onClose={() => setOpenDetailsId(null)}
        />
      )}
    </>
  );
}
