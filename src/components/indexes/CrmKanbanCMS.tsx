"use client";
import { LeadStatus } from "@/lib/app-types";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/trpc/client";
import { WALeadStatus } from "@prisma/client";
import { LayoutKanban } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CrmLeadCardCMS, { CrmLeadCardData } from "../items/CrmLeadCardCMS";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageHeaderCMS from "../titles/PageHeaderCMS";

interface CrmKanbanCMSProps {
  sessionToken: string;
}

type KanbanColumn = {
  status: LeadStatus;
  label: string;
  color: string;
  headerBg: string;
  countBg: string;
};

const COLUMNS: KanbanColumn[] = [
  {
    status: "COLD",
    label: "Cold",
    color: "border-blue-400",
    headerBg: "bg-blue-50 dark:bg-blue-950/30",
    countBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    status: "WARM",
    label: "Warm",
    color: "border-purple-400",
    headerBg: "bg-purple-50 dark:bg-purple-950/30",
    countBg:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    status: "HOT",
    label: "Hot",
    color: "border-green-400",
    headerBg: "bg-green-50 dark:bg-green-950/30",
    countBg:
      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    status: "CONVERTED",
    label: "Converted",
    color: "border-orange-400",
    headerBg: "bg-orange-50 dark:bg-orange-950/30",
    countBg:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  },
];

export default function CrmKanbanCMS(props: CrmKanbanCMSProps) {
  const utils = trpc.useUtils();
  const [draggingOverColumn, setDraggingOverColumn] =
    useState<LeadStatus | null>(null);

  const updateConversation = trpc.update.wa.conversation.useMutation({
    onSuccess: () => {
      utils.list.wa.conversations.invalidate();
    },
  });

  // Fetch all 4 statuses at once — the query supports lead_status filter
  const cold = trpc.list.wa.conversations.useQuery(
    { lead_status: "COLD" as WALeadStatus },
    { enabled: !!props.sessionToken }
  );
  const warm = trpc.list.wa.conversations.useQuery(
    { lead_status: "WARM" as WALeadStatus },
    { enabled: !!props.sessionToken }
  );
  const hot = trpc.list.wa.conversations.useQuery(
    { lead_status: "HOT" as WALeadStatus },
    { enabled: !!props.sessionToken }
  );
  const converted = trpc.list.wa.conversations.useQuery(
    { lead_status: "CONVERTED" as WALeadStatus },
    { enabled: !!props.sessionToken }
  );

  const isLoading =
    cold.isLoading || warm.isLoading || hot.isLoading || converted.isLoading;
  const isError =
    cold.isError || warm.isError || hot.isError || converted.isError;

  const cardsByStatus = useMemo<Record<LeadStatus, CrmLeadCardData[]>>(
    () => ({
      COLD: (cold.data?.list ?? []).map(toCard),
      WARM: (warm.data?.list ?? []).map(toCard),
      HOT: (hot.data?.list ?? []).map(toCard),
      CONVERTED: (converted.data?.list ?? []).map(toCard),
    }),
    [cold.data, warm.data, hot.data, converted.data]
  );

  // Subscribe to Supabase Realtime for live updates
  useEffect(() => {
    const channel = supabase
      .channel("crm_kanban_change", { config: { private: true } })
      .on("broadcast", { event: "*" }, () => {
        utils.list.wa.conversations.invalidate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMoveTo = useCallback(
    (convId: string, newStatus: LeadStatus) => {
      updateConversation.mutate({ id: convId, lead_status: newStatus as WALeadStatus });
    },
    [updateConversation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStatus: LeadStatus) => {
      e.preventDefault();
      const convId = e.dataTransfer.getData("convId");
      const fromStatus = e.dataTransfer.getData("fromStatus") as LeadStatus;
      if (convId && fromStatus !== targetStatus) {
        updateConversation.mutate({ id: convId, lead_status: targetStatus as WALeadStatus });
      }
      setDraggingOverColumn(null);
    },
    [updateConversation]
  );

  return (
    <PageContainerCMS className="h-screen">
      <div className="page-wrapper flex flex-col w-full h-full gap-4">
        <PageHeaderCMS name="CRM" icon={LayoutKanban} />

        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {!isLoading && !isError && (
          <div className="kanban-board flex flex-1 gap-4 min-h-0 overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
              const cards = cardsByStatus[col.status];
              const isOver = draggingOverColumn === col.status;

              return (
                <div
                  key={col.status}
                  className={`kanban-column flex flex-col min-w-[280px] w-[280px] shrink-0 rounded-lg border-t-4 ${col.color} bg-card-bg border border-dashboard-border overflow-hidden transition-shadow ${isOver ? "shadow-lg ring-2 ring-cms-primary/30" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggingOverColumn(col.status);
                  }}
                  onDragLeave={() => setDraggingOverColumn(null)}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  {/* Column header */}
                  <div
                    className={`column-header flex items-center justify-between p-3 ${col.headerBg} border-b border-dashboard-border shrink-0`}
                  >
                    <h5 className="font-bodycopy font-bold text-[15px]">
                      {col.label}
                    </h5>
                    <span
                      className={`text-xs font-bodycopy font-semibold px-2 py-0.5 rounded-full ${col.countBg}`}
                    >
                      {cards.length} Lead{cards.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Cards list */}
                  <div className="flex flex-col flex-1 gap-2 p-2 overflow-y-auto min-h-[80px]">
                    {cards.length === 0 && (
                      <div className="flex flex-col items-center justify-center flex-1 gap-1 py-8 text-center">
                        <p className="font-bodycopy text-sm text-emphasis font-medium">
                          0 Leads
                        </p>
                        <p className="font-bodycopy text-xs text-emphasis/60">
                          Drag a card here to move it
                        </p>
                      </div>
                    )}
                    {cards.map((card) => (
                      <CrmLeadCardCMS
                        key={card.id}
                        card={card}
                        onMoveTo={handleMoveTo}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageContainerCMS>
  );
}

/** Maps a raw WA conversation list item to a CrmLeadCardData */
function toCard(entry: {
  id: string;
  full_name: string;
  phone_number: string;
  lead_status: WALeadStatus;
  last_message_at?: string | Date;
  user_full_name?: string;
  user_avatar?: string;
}): CrmLeadCardData {
  return {
    id: entry.id,
    full_name: entry.full_name,
    phone_number: entry.phone_number,
    lead_status: entry.lead_status as LeadStatus,
    created_at: String(entry.last_message_at ?? new Date().toISOString()),
    user_full_name: entry.user_full_name,
    user_avatar: entry.user_avatar,
  };
}
