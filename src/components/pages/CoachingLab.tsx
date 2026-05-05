"use client";
import AppButton from "@/components/buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LabStakeholderEnum } from "@prisma/client";
import { Loader2, MessageSquare, Plus, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageContainerCMS from "../pages/PageContainerCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";
import AppSelect from "../fields/AppSelect";
import AppTextArea from "../fields/AppTextArea";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface CoachingLabProps {
  sessionToken: string;
}

export default function CoachingLab({ sessionToken }: CoachingLabProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student_id: "", note: "" });
  const [isSending, setIsSending] = useState(false);

  const { data: profileData } = trpc.lab.myProfile.useQuery();
  const member = profileData?.member;
  const isStudent = member?.stakeholder_type === LabStakeholderEnum.STUDENT;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;

  const { data: notesData, isLoading } = trpc.lab.listCoachingNotes.useQuery(undefined, { enabled: !!profileData });
  const { data: teamData } = trpc.lab.listTeamMembers.useQuery(undefined, { enabled: isChampion });

  const createNote = trpc.lab.createCoachingNote.useMutation();
  const markRead = trpc.lab.markNoteRead.useMutation();

  const notes = notesData?.list ?? [];
  const unreadNotes = notes.filter((n) => !n.is_read);
  const readNotes = notes.filter((n) => n.is_read);

  const teamMemberOptions =
    teamData?.team?.members.map((tm) => ({
      label: tm.member.user.full_name,
      value: tm.member.id,
    })) ?? [];

  const handleSend = () => {
    if (!form.student_id || !form.note.trim()) {
      toast.error("Select a student and write a note");
      return;
    }
    setIsSending(true);
    createNote.mutate(
      { student_id: Number(form.student_id), note: form.note.trim() },
      {
        onSuccess: () => {
          toast.success("Note sent!");
          setForm({ student_id: "", note: "" });
          setShowForm(false);
          utils.lab.listCoachingNotes.invalidate();
        },
        onError: (err) => toast.error("Failed", { description: err.message }),
        onSettled: () => setIsSending(false),
      }
    );
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate(
      { id },
      {
        onSuccess: () => utils.lab.listCoachingNotes.invalidate(),
        onError: (err) => toast.error("Failed", { description: err.message }),
      }
    );
  };

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name="Coaching"
          desc={isChampion ? "Send coaching notes to your team members" : "Notes and guidance from your champion"}
          icon={MessageSquare}
        >
          {isChampion && (
            <AppButton variant="tertiary" size="medium" type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
              {showForm ? "Cancel" : "New Note"}
            </AppButton>
          )}
        </PageHeaderCMS>

        {/* Send note form */}
        {showForm && isChampion && (
          <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
            <h3 className="font-bodycopy font-semibold text-sm text-foreground">Send Coaching Note</h3>
            <AppSelect
              variant="CMS"
              selectId="student"
              selectName="Team Member"
              selectPlaceholder="Select who to coach"
              value={form.student_id}
              onChange={(v) => setForm((p) => ({ ...p, student_id: String(v) }))}
              options={teamMemberOptions}
            />
            <AppTextArea
              variant="CMS"
              textAreaId="note"
              textAreaName="Your Note"
              textAreaPlaceholder="Write your coaching feedback, tips, or encouragement..."
              textAreaHeight="h-32"
              value={form.note}
              onTextAreaChange={(v) => setForm((p) => ({ ...p, note: String(v) }))}
            />
            <AppButton variant="tertiary" size="medium" type="button" disabled={isSending} onClick={handleSend}>
              {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Send Note
            </AppButton>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <MessageSquare className="size-8 text-muted-foreground" />
            <p className="font-bodycopy text-sm text-muted-foreground">
              {isChampion ? "No coaching notes sent yet. Start by encouraging a team member!" : "No coaching notes yet"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Unread notes (student view) */}
            {isStudent && unreadNotes.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="font-bodycopy font-semibold text-xs text-muted-foreground uppercase tracking-wider">Unread</h3>
                {unreadNotes.map((note) => (
                  <div key={note.id} className="flex flex-col gap-3 p-4 rounded-xl border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={note.champion.user.avatar || DEFAULT_AVATAR}
                          alt={note.champion.user.full_name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <p className="font-bodycopy font-semibold text-sm text-foreground">{note.champion.user.full_name}</p>
                          <p className="font-bodycopy text-xs text-muted-foreground">{formatDate(String(note.created_at))}</p>
                        </div>
                      </div>
                      <AppButton variant="light" size="small" type="button" onClick={() => handleMarkRead(note.id)}>
                        Mark read
                      </AppButton>
                    </div>
                    <p className="font-bodycopy text-sm text-foreground leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* All / read notes */}
            <div className="flex flex-col gap-2">
              {isStudent && unreadNotes.length > 0 && readNotes.length > 0 && (
                <h3 className="font-bodycopy font-semibold text-xs text-muted-foreground uppercase tracking-wider">Previous</h3>
              )}
              {(isChampion ? notes : readNotes).map((note) => (
                <div key={note.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        isChampion
                          ? (note.student.user.avatar || DEFAULT_AVATAR)
                          : (note.champion.user.avatar || DEFAULT_AVATAR)
                      }
                      alt={isChampion ? note.student.user.full_name : note.champion.user.full_name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="font-bodycopy font-semibold text-sm text-foreground">
                        {isChampion
                          ? `To: ${note.student.user.full_name}`
                          : `From: ${note.champion.user.full_name}`}
                      </p>
                      <p className="font-bodycopy text-xs text-muted-foreground">{formatDate(String(note.created_at))}</p>
                    </div>
                  </div>
                  <p className="font-bodycopy text-sm text-muted-foreground leading-relaxed">{note.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainerCMS>
  );
}
