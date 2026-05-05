"use client";
import AppButton from "@/components/buttons/AppButton";
import AppInput from "@/components/fields/AppInput";
import AppSelect from "@/components/fields/AppSelect";
import AppAlertConfirmDialog from "@/components/modals/AppAlertConfirmDialog";
import AppBreadcrumb from "@/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/components/navigations/AppBreadcrumbItem";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import TableBodyCMS from "@/components/tables/TableBodyCMS";
import TableCellCMS from "@/components/tables/TableCellCMS";
import TableHeadCMS from "@/components/tables/TableHeadCMS";
import TableHeaderCMS from "@/components/tables/TableHeaderCMS";
import TableRowCMS from "@/components/tables/TableRowCMS";
import PageTitleSectionCMS from "@/components/titles/PageTitleSectionCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { AiLearnRoleEnum } from "lib/app-types";
import {
  BookOpen,
  ChevronRight,
  EllipsisVertical,
  Mail,
  PlusCircle,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";

const ROLE_OPTIONS = Object.values(AiLearnRoleEnum).map((r) => ({
  label: r.charAt(0) + r.slice(1).toLowerCase(),
  value: r,
}));

interface AiLearnMemberListCMSProps {
  sessionToken: string;
}

export default function AiLearnMemberListCMS({
  sessionToken,
}: AiLearnMemberListCMSProps) {
  const utils = trpc.useUtils();

  // Add member modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<string | number | null>(
    AiLearnRoleEnum.MARKETING
  );
  const [addEmailError, setAddEmailError] = useState("");

  // Edit role modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    id: number;
    name: string;
    currentRole: AiLearnRoleEnum;
  } | null>(null);
  const [editRole, setEditRole] = useState<string | number | null>(null);

  // Delete confirm state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Dropdown state
  const [actionsOpened, setActionsOpened] = useState<number | null>(null);
  const wrapperRef = useRef<Record<number, HTMLDivElement | null>>({});
  const setWrapperRef = (id: number) => (el: HTMLDivElement | null) => {
    wrapperRef.current[id] = el;
  };

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const inside = Object.values(wrapperRef.current).some(
        (el) => el && target && el.contains(target)
      );
      if (!inside) setActionsOpened(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const { data, isLoading, isError } = trpc.ailene.listMembers.useQuery(
    undefined,
    { enabled: !!sessionToken }
  );

  const addMember = trpc.ailene.addMemberByEmail.useMutation();
  const updateRole = trpc.ailene.updateMemberRole.useMutation();
  const deleteMember = trpc.ailene.deleteMember.useMutation();

  const handleAdd = () => {
    if (!addEmail.trim()) {
      setAddEmailError("Email tidak boleh kosong");
      return;
    }
    setAddEmailError("");
    addMember.mutate(
      { email: addEmail.trim(), role_name: addRole as AiLearnRoleEnum },
      {
        onSuccess: () => {
          toast.success("Member berhasil ditambahkan");
          utils.ailene.listMembers.invalidate();
          setIsAddOpen(false);
          setAddEmail("");
          setAddRole(AiLearnRoleEnum.MARKETING);
        },
        onError: (err) => {
          const msg = err.message ?? "Gagal menambahkan member";
          if (msg.includes("email")) setAddEmailError(msg);
          else toast.error("Gagal menambahkan member", { description: msg });
        },
      }
    );
  };

  const handleUpdateRole = () => {
    if (!editTarget || !editRole) return;
    updateRole.mutate(
      { id: editTarget.id, role_name: editRole as AiLearnRoleEnum },
      {
        onSuccess: () => {
          toast.success("Role berhasil diperbarui");
          utils.ailene.listMembers.invalidate();
          setIsEditOpen(false);
          setEditTarget(null);
        },
        onError: (err) => {
          toast.error("Gagal memperbarui role", { description: err.message });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMember.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast.success("Member berhasil dihapus");
          utils.ailene.listMembers.invalidate();
        },
        onError: (err) => {
          toast.error("Gagal menghapus member", { description: err.message });
        },
      }
    );
  };

  return (
    <PageContainerCMS>
      <div className="index w-full flex flex-col gap-4">
        {/* Header */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/ailene/members" isCurrentPage>
              Ailene Members
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <PageTitleSectionCMS
              pageTitle="Ailene Members"
              pageDesc="Kelola akses member Ailene AI Learn. Tambah user berdasarkan email dan atur role mereka."
            />
            <AppButton variant="tertiary" onClick={() => setIsAddOpen(true)}>
              <PlusCircle className="size-5" />
              Add Member
            </AppButton>
          </div>
        </div>

        {/* Loading & Error */}
        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {/* Table */}
        {data && !isLoading && !isError && (
          <table className="table-ailene-members relative w-full rounded-sm">
            <TableHeaderCMS>
              <TableRowCMS>
                <TableHeadCMS>NO.</TableHeadCMS>
                <TableHeadCMS>USER</TableHeadCMS>
                <TableHeadCMS>ROLE</TableHeadCMS>
                <TableHeadCMS>PROGRESS</TableHeadCMS>
                <TableHeadCMS>DITAMBAHKAN</TableHeadCMS>
                <TableHeadCMS>ACTIONS</TableHeadCMS>
              </TableRowCMS>
            </TableHeaderCMS>
            <TableBodyCMS>
              {data.list.map((member, index) => (
                <TableRowCMS key={member.id}>
                  <TableCellCMS>{index + 1}</TableCellCMS>
                  <TableCellCMS>
                    <div className="flex items-center gap-3 max-w-[32vw]">
                      <div className="flex size-9 rounded-full overflow-hidden shrink-0">
                        <Image
                          className="object-cover w-full h-full"
                          src={
                            member.user.avatar ||
                            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                          }
                          alt={member.user.full_name}
                          width={300}
                          height={300}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold font-bodycopy text-black line-clamp-1">
                          {member.user.full_name}
                        </span>
                        <span className="text-emphasis font-bodycopy text-sm line-clamp-1">
                          {member.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCellCMS>
                  <TableCellCMS>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-bodycopy bg-primary/10 text-primary capitalize">
                      {member.role_name.toLowerCase()}
                    </span>
                  </TableCellCMS>
                  <TableCellCMS>
                    <div className="flex items-center gap-1.5 text-emphasis font-bodycopy text-sm">
                      <BookOpen className="size-3.5" />
                      {member._count.progress} lesson
                    </div>
                  </TableCellCMS>
                  <TableCellCMS>
                    <span className="font-bodycopy text-sm">
                      {dayjs(member.created_at).format("D MMM YYYY")}
                    </span>
                  </TableCellCMS>
                  <TableCellCMS>
                    <div
                      className="actions-button flex relative"
                      ref={setWrapperRef(member.id)}
                    >
                      <AppButton
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionsOpened((prev) =>
                            prev === member.id ? null : member.id
                          );
                        }}
                      >
                        <EllipsisVertical className="size-5" />
                      </AppButton>
                      <AppDropdown
                        isOpen={actionsOpened === member.id}
                        alignDesktop="right"
                        onClose={() => setActionsOpened(null)}
                      >
                        <AppDropdownItemList
                          menuIcon={<UserCog className="size-4" />}
                          menuName="Edit Role"
                          onClick={() => {
                            setEditTarget({
                              id: member.id,
                              name: member.user.full_name,
                              currentRole: member.role_name,
                            });
                            setEditRole(member.role_name);
                            setIsEditOpen(true);
                            setActionsOpened(null);
                          }}
                        />
                        <AppDropdownItemList
                          menuIcon={<Trash2 className="size-4" />}
                          menuName="Hapus"
                          isDestructive
                          onClick={() => {
                            setDeleteTarget({
                              id: member.id,
                              name: member.user.full_name,
                            });
                            setIsDeleteOpen(true);
                            setActionsOpened(null);
                          }}
                        />
                      </AppDropdown>
                    </div>
                  </TableCellCMS>
                </TableRowCMS>
              ))}
            </TableBodyCMS>
          </table>
        )}

        {data?.list.length === 0 && !isLoading && !isError && (
          <p className="mt-2 font-bodycopy text-center text-emphasis">
            Belum ada member Ailene. Tambahkan lewat tombol Add Member.
          </p>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="flex flex-col bg-white w-full max-w-md mx-4 p-6 gap-5 rounded-lg shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-brand font-semibold">
                  Add Ailene Member
                </h2>
                <p className="text-emphasis text-sm font-bodycopy">
                  Masukkan email user yang sudah terdaftar di platform.
                </p>
              </div>
              <button
                className="text-emphasis hover:text-black"
                onClick={() => setIsAddOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <AppInput
                variant="CMS"
                inputId="add-member-email"
                inputName="Email"
                inputType="email"
                inputPlaceholder="contoh@sevenpreneur.com"
                inputIcon={<Mail className="size-4" />}
                value={addEmail}
                onInputChange={(v) => {
                  setAddEmail(v);
                  setAddEmailError("");
                }}
                errorMessage={addEmailError}
                required
              />
              <AppSelect
                variant="CMS"
                selectId="add-member-role"
                selectName="Role"
                selectPlaceholder="Pilih role"
                value={addRole}
                onChange={setAddRole}
                options={ROLE_OPTIONS}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <AppButton
                variant="light"
                size="medium"
                onClick={() => setIsAddOpen(false)}
              >
                Batal
              </AppButton>
              <AppButton
                variant="tertiary"
                size="medium"
                onClick={handleAdd}
                disabled={addMember.isPending}
              >
                {addMember.isPending ? "Menambahkan..." : "Tambah Member"}
              </AppButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditOpen && editTarget && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="flex flex-col bg-white w-full max-w-md mx-4 p-6 gap-5 rounded-lg shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-brand font-semibold">Edit Role</h2>
                <p className="text-emphasis text-sm font-bodycopy">
                  Ubah role Ailene untuk{" "}
                  <span className="font-semibold text-black">
                    {editTarget.name}
                  </span>
                </p>
              </div>
              <button
                className="text-emphasis hover:text-black"
                onClick={() => setIsEditOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <AppSelect
              variant="CMS"
              selectId="edit-member-role"
              selectName="Role Baru"
              selectPlaceholder="Pilih role"
              value={editRole}
              onChange={setEditRole}
              options={ROLE_OPTIONS}
              required
            />
            <div className="flex gap-2 justify-end">
              <AppButton
                variant="light"
                size="medium"
                onClick={() => setIsEditOpen(false)}
              >
                Batal
              </AppButton>
              <AppButton
                variant="tertiary"
                size="medium"
                onClick={handleUpdateRole}
                disabled={updateRole.isPending}
              >
                {updateRole.isPending ? "Menyimpan..." : "Simpan"}
              </AppButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {isDeleteOpen && (
        <AppAlertConfirmDialog
          alertDialogHeader="Hapus member ini?"
          alertDialogMessage={`${deleteTarget?.name} akan dihapus dari Ailene AI Learn. Progress mereka ikut terhapus.`}
          alertCancelLabel="Batal"
          alertConfirmLabel="Hapus"
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            handleDelete();
            setIsDeleteOpen(false);
          }}
        />
      )}
    </PageContainerCMS>
  );
}
