"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import AppButton from "@/app/components/buttons/AppButton";
import StatusLabelCMS, {
  StatusVariant,
} from "@/app/components/labels/StatusLabelCMS";
import RolesLabelCMS, {
  RolesVariant,
} from "@/app/components/labels/RolesLabelCMS";
import { EllipsisVertical, Eye, Settings2, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toCamelCase } from "@/lib/camel-case";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

interface UserItemListCMSProps {
  sessionToken: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail: string;
  userRole: string;
  userStatus: string;
  createdAt: string;
  lastLogin: string;
  onDeleteSuccess?: () => void;
}

export default function UserItemListCMS({
  sessionToken,
  userId,
  userName,
  userAvatar,
  userEmail,
  userRole,
  userStatus,
  createdAt,
  lastLogin,
  onDeleteSuccess,
}: UserItemListCMSProps) {
  const router = useRouter();
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // --- Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node })
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Function to delete user
  const deleteUser = trpc.delete.user.useMutation();
  const handleDelete = () => {
    deleteUser.mutate(
      { id: userId },
      {
        onSuccess: () => {
          toast.success("Delete success");
          onDeleteSuccess?.();
        },
        onError: (err) => {
          toast.error("Failed to delete user", {
            description: `${err}`,
          });
        },
      }
    );
  };

  return (
    <React.Fragment>
      <div className="user-list-item flex items-center">
        <div className="user-id flex items-center gap-4 w-full shrink-0 max-w-[30vw] lg:max-w-[33vw] 2xl:max-w-[49vw]">
          {/* --- Avatar */}
          <div className="flex size-10 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                userAvatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
              }
              alt={`Image ${userName}`}
              width={300}
              height={300}
            />
          </div>
          {/* --- User Name & Email */}
          <div className="user-name-email flex flex-col">
            <Link href={`/users/${userId}`}>
              <h2 className="user-name font-bold font-bodycopy text-black line-clamp-1">
                {userName}
              </h2>
            </Link>
            <p className="user-email flex items-center gap-2 text-[#333333] font-bodycopy text-sm">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex gap-7 items-center">
          {/* --- Role */}
          <div className="user-role max-w-[120px] w-full shrink-0 text-left">
            <RolesLabelCMS
              labelName={userRole}
              variants={toCamelCase(userRole) as RolesVariant}
            />
          </div>

          {/* --- Created at */}
          <p className="created-at flex text-sm font-bodycopy font-medium text-[#333333] max-w-[102px] w-full shrink-0 text-left">
            {dayjs(createdAt).locale("id").tz("Asia/Jakarta").format("lll")}
          </p>

          {/* --- Last login */}
          <p className="last-login flex text-sm font-bodycopy font-medium text-[#333333] max-w-[102px] w-full shrink-0 text-left">
            {dayjs(lastLogin).locale("id").tz("Asia/Jakarta").format("lll")}
          </p>

          {/* --- Status */}
          <div className="status max-w-[102px] w-full shrink-0 text-left">
            <StatusLabelCMS
              labelName={userStatus}
              variants={userStatus as StatusVariant}
            />
          </div>

          {/* --- Actions */}
          <div className="actions-button flex relative" ref={wrapperRef}>
            <AppButton
              variant="ghost"
              size="icon"
              onClick={handleActionsDropdown}
            >
              <EllipsisVertical className="size-5" />
            </AppButton>

            <AppDropdown
              isOpen={isActionsOpened}
              onClose={() => setIsActionsOpened(false)}
            >
              {/* -- View */}
              <Link href={`/users/${userId}`}>
                <AppDropdownItemList
                  menuIcon={<Eye className="size-4" />}
                  menuName="View Profile"
                />
              </Link>

              {/* -- Edit */}
              <Link href={`/users/${userId}/edit`}>
                <AppDropdownItemList
                  menuIcon={<Settings2 className="size-4" />}
                  menuName="Edit Profile"
                />
              </Link>

              {/* -- Delete */}
              <AppDropdownItemList
                menuIcon={<Trash2 className="size-4" />}
                menuName="Delete"
                isDestructive
                onClick={() => setIsOpenDeleteConfirmation(true)}
              />
            </AppDropdown>
          </div>
        </div>
      </div>
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${userName}? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
