"use client";
import { LeadStatus } from "@/lib/app-types";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/trpc/client";
import { WALeadStatus, WAMode } from "@prisma/client";
import { ListFilter, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AppSelect from "../fields/AppSelect";
import WhatsappLeadDetailsCMS from "../elements/WhatsappLeadDetailsCMS";
import WhatsappConvItemCMS from "../items/WhatsappConvItemCMS";
import WhatsappChatsCMS from "../messages/WhatsappChatsCMS";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageHeaderCMS from "../titles/PageHeaderCMS";

interface WhatsappConvsCMSProps {
  sessionToken: string;
}

type LeadStatusFilter = WALeadStatus | "ALL";
type ModeFilter = WAMode | "ALL";
type HandlerFilter = "ALL" | "UNASSIGNED" | string;

type ConvHeaderSnapshot = {
  id: string;
  full_name: string;
  user_full_name?: string;
  phone_number: string;
  handler_id: string | null;
  mode: WAMode;
};

export default function WhatsappConvsCMS(props: WhatsappConvsCMSProps) {
  const [selectedConvId, setSelectedConvId] = useState("");
  // Cached header data so the middle panel survives filter changes that
  // exclude the selected conv. Set when the user clicks a conv item; fresh
  // values from the live list take priority over this snapshot when present.
  const [selectedConvSnapshot, setSelectedConvSnapshot] =
    useState<ConvHeaderSnapshot | null>(null);
  const [leadStatusFilter, setLeadStatusFilter] =
    useState<LeadStatusFilter>("ALL");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("ALL");
  const [handlerFilter, setHandlerFilter] = useState<HandlerFilter>("ALL");

  const utils = trpc.useUtils();
  const readMessage = trpc.update.wa.conversation_as_read.useMutation();

  // Build query input from filters
  const conversationsInput = useMemo(() => {
    const input: {
      lead_status?: WALeadStatus;
      mode?: WAMode;
      handler_id?: string | null;
    } = {};
    if (leadStatusFilter !== "ALL") input.lead_status = leadStatusFilter;
    if (modeFilter !== "ALL") input.mode = modeFilter;
    if (handlerFilter === "UNASSIGNED") input.handler_id = null;
    else if (handlerFilter !== "ALL") input.handler_id = handlerFilter;
    return input;
  }, [leadStatusFilter, modeFilter, handlerFilter]);

  // Fetch tRPC data
  const {
    data: convList,
    isLoading: isLoadingConvs,
    isError: isErrorConvs,
  } = trpc.list.wa.conversations.useQuery(conversationsInput, {
    enabled: !!props.sessionToken,
  });

  // Fetch admin handler list for filter dropdown
  const { data: handlerList } = trpc.list.users.useQuery(
    { role_id: 0, page_size: 100 },
    { enabled: !!props.sessionToken }
  );

  const convFromList = useMemo(
    () => convList?.list.find((c) => c.id === selectedConvId),
    [convList, selectedConvId]
  );

  // Prefer fresh data from the list; fall back to the click-time snapshot so
  // the middle panel survives filter changes that exclude the selected conv.
  const selectedConv =
    convFromList ??
    (selectedConvSnapshot?.id === selectedConvId
      ? selectedConvSnapshot
      : undefined);

  const handleSelectConv = (conv: {
    id: string;
    full_name: string;
    user_full_name?: string;
    phone_number: string;
    handler_id: string | null;
    mode: WAMode;
  }) => {
    setSelectedConvId(conv.id);
    setSelectedConvSnapshot({
      id: conv.id,
      full_name: conv.full_name,
      user_full_name: conv.user_full_name,
      phone_number: conv.phone_number,
      handler_id: conv.handler_id,
      mode: conv.mode,
    });
  };

  const hasActiveFilter =
    leadStatusFilter !== "ALL" ||
    modeFilter !== "ALL" ||
    handlerFilter !== "ALL";

  const resetFilters = () => {
    setLeadStatusFilter("ALL");
    setModeFilter("ALL");
    setHandlerFilter("ALL");
  };

  // Subscribe to Realtime to keep convList updated even when no conversation is selected
  useEffect(() => {
    const channel = supabase
      .channel("wa_convs_change", { config: { private: true } })
      .on("broadcast", { event: "*" }, () => {
        utils.list.wa.conversations.invalidate();
      })
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else if (status === "SUBSCRIBED") {
          console.log("Channel subscribed");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Channel encountered an error");
        } else if (status === "TIMED_OUT") {
          console.error("Subscription timed out");
        } else if (status === "CLOSED") {
          console.log("Channel closed");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Read message when click conv item
  useEffect(() => {
    if (!selectedConvId) return;
    utils.list.wa.conversations.setData(conversationsInput, (old) => {
      if (!old) return old;
      return {
        ...old,
        list: old.list.map((conv) =>
          conv.id === selectedConvId ? { ...conv, unread_count: 0 } : conv
        ),
      };
    });
    readMessage.mutate({ id: selectedConvId });
  }, [selectedConvId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark as read when new messages arrive for the currently open conversation
  useEffect(() => {
    if (!selectedConvId || !convList) return;
    const conv = convList.list.find((c) => c.id === selectedConvId);
    if (!conv || conv.unread_count === 0) return;
    utils.list.wa.conversations.setData(conversationsInput, (old) => {
      if (!old) return old;
      return {
        ...old,
        list: old.list.map((c) =>
          c.id === selectedConvId ? { ...c, unread_count: 0 } : c
        ),
      };
    });
    readMessage.mutate({ id: selectedConvId });
  }, [convList]); // eslint-disable-line react-hooks/exhaustive-deps

  const leadStatusOptions = [
    { label: "Hot Leads", value: "HOT" },
    { label: "Warm Leads", value: "WARM" },
    { label: "Cold Leads", value: "COLD" },
  ];

  const modeOptions = [
    { label: "AI Mode", value: "AI" },
    { label: "Human Mode", value: "HUMAN" },
  ];

  const handlerOptions = [
    { label: "Unassigned", value: "UNASSIGNED" },
    ...(handlerList?.list.map((u) => ({
      label: u.full_name,
      value: u.id,
      image: u.avatar ?? undefined,
    })) ?? []),
  ];

  return (
    <PageContainerCMS className="h-screen">
      <div className="page-wrapper flex flex-col w-full h-full gap-4">
        <PageHeaderCMS name="Whatsapp Chats" icon={MessageCircle} />
        <div className="conv-details flex flex-1 w-full min-h-0 gap-4">
          {/* LEFT PANEL */}
          <div className="left-panel flex flex-col w-80 shrink-0 gap-4 min-h-0">
            {/* Filters card */}
            <div className="filters-card flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg shrink-0">
              <div className="flex items-center justify-between">
                <h5 className="font-bodycopy font-bold text-[15px] dark:text-sevenpreneur-white">
                  Filters
                </h5>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilter}
                  className="text-tertiary text-sm font-bodycopy font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <AppSelect
                    selectId="filter-mode"
                    selectPlaceholder="Mode"
                    variant="CMS"
                    value={modeFilter === "ALL" ? null : modeFilter}
                    onChange={(value) =>
                      setModeFilter((value as ModeFilter) ?? "ALL")
                    }
                    options={modeOptions}
                  />
                  <AppSelect
                    selectId="filter-lead-status"
                    selectPlaceholder="Status"
                    variant="CMS"
                    value={leadStatusFilter === "ALL" ? null : leadStatusFilter}
                    onChange={(value) =>
                      setLeadStatusFilter((value as LeadStatusFilter) ?? "ALL")
                    }
                    options={leadStatusOptions}
                  />
                </div>
                <AppSelect
                  selectId="filter-handler"
                  selectPlaceholder="Assigned to"
                  variant="CMS"
                  value={handlerFilter === "ALL" ? null : handlerFilter}
                  onChange={(value) =>
                    setHandlerFilter((value as HandlerFilter) ?? "ALL")
                  }
                  options={handlerOptions}
                />
              </div>
            </div>

            {/* Conversations list card */}
            <div className="convs-panels flex flex-col flex-1 min-h-0 shrink-0 bg-card-bg border border-dashboard-border rounded-lg overflow-hidden">
              <div className="column-title flex items-center justify-between p-3 bg-card-bg font-bodycopy border-b border-dashboard-border shrink-0">
                <p className="font-bold text-[15px] dark:text-sevenpreneur-white">
                  Chats{" "}
                  {convList && (
                    <span className="font-medium">
                      ({convList.list.length})
                    </span>
                  )}
                </p>
                <ListFilter className="size-4 text-emphasis" />
              </div>

              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                {isLoadingConvs && <AppLoadingComponents />}
                {isErrorConvs && <AppErrorComponents />}

                {!isLoadingConvs && !isErrorConvs && (
                  <div className="conv-list p-2 flex flex-col">
                    {convList?.list.map((post, index) => (
                      <WhatsappConvItemCMS
                        key={index}
                        convId={post.id}
                        convUserFullName={post.user_full_name || post.full_name}
                        convUserAvatar={post.user_avatar ?? null}
                        convLastMessage={post.last_message}
                        convLastMessageStatus={post.last_message_status}
                        convLastMessageDirection={post.last_message_direction}
                        convLastMessageType={post.last_message_type}
                        convLastMessageAt={post.last_message_at}
                        convLeadStatus={post.lead_status as LeadStatus}
                        convUnreadMessage={post.unread_count}
                        convIsAssigned={!!post.handler_id}
                        selectedConvId={selectedConvId}
                        onClick={() => handleSelectConv(post)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE PANEL */}
          <div className="middle-panel flex flex-[2] min-w-0">
            {selectedConvId && selectedConv ? (
              <div className="chat-card flex flex-col w-full min-w-0 bg-card-bg border border-dashboard-border rounded-lg overflow-hidden">
                <WhatsappChatsCMS
                  sessionToken={props.sessionToken}
                  convId={selectedConvId}
                  headerName={
                    selectedConv.user_full_name || selectedConv.full_name
                  }
                  headerPhoneNumber={selectedConv.phone_number}
                  mode={selectedConv.mode}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-3 px-8 bg-card-bg border border-dashboard-border rounded-lg">
                <div className="state-illustration flex max-w-72 overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sales-illustration.svg"
                    }
                    alt="chat-cms"
                    width={500}
                    height={400}
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-center">
                  <h3 className="font-bodycopy font-bold text-2xl">
                    Siap Cuan Hari Ini?
                  </h3>
                  <p className="font-bodycopy font-medium text-emphasis max-w-sm">
                    Pilih chat di sebelah kiri dan ubah setiap percakapan jadi
                    closing deals!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          {selectedConvId && (
            <div className="right-panel flex flex-col w-80 shrink-0 min-h-0">
              <WhatsappLeadDetailsCMS
                key={selectedConvId}
                sessionToken={props.sessionToken}
                convId={selectedConvId}
              />
            </div>
          )}
        </div>
      </div>
    </PageContainerCMS>
  );
}
