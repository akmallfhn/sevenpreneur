"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import StatusLabelCMS, { Variant } from "./StatusLabelCMS";
import AppButton from "./AppButton";
import AttributeLabelCMS from "./AttributeLabelCMS";
import DropdownMenuCMS from "./DropdownMenuCMS";
import { EllipsisVertical, Eye, Settings2, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  // --- State untuk menyimpan status dropdown
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // --- Close dropdown outside toggle
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

  // --- Insert Role Data to Variant
  const equalizingRoleVariant = (role: string) =>
    role.toLowerCase().replace(/\s+/g, "_");

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
    <div className="user-item flex items-center">
      <div className="user-item-id flex items-center gap-4 max-w-[380px] w-full shrink-0">
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
          <AttributeLabelCMS
            labelName={userRole}
            variants={equalizingRoleVariant(userRole)}
          />
        </div>

        {/* --- Created at */}
        <p className="created-at flex text-sm font-bodycopy font-medium text-[#333333] max-w-[102px] w-full shrink-0 text-left">
          {dayjs(createdAt).locale("id").tz("Asia/Jakarta").format("ll")}
        </p>

        {/* --- Last login */}
        <p className="last-login flex text-sm font-bodycopy font-medium text-[#333333] max-w-[102px] w-full shrink-0 text-left">
          {dayjs(lastLogin).locale("id").tz("Asia/Jakarta").format("ll")}
        </p>

        {/* --- Status */}
        <div className="status max-w-[102px] w-full shrink-0 text-left">
          <StatusLabelCMS
            labelName={userStatus}
            variants={userStatus as Variant}
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

          <DropdownMenuCMS
            isOpen={isActionsOpened}
            onClose={() => setIsActionsOpened(false)}
          >
            {/* -- View */}
            <Link
              href={`/users/${userId}`}
              className="menu-list flex px-6 pl-4 py-2 items-center gap-2 hover:text-cms-primary hover:bg-[#E1EDFF] hover:cursor-pointer"
            >
              <Eye className="size-4" />
              View
            </Link>

            {/* -- Edit */}
            <Link
              href={`/users/${userId}/edit`}
              className="menu-list flex px-6 pl-4 py-2 items-center gap-2 hover:text-cms-primary hover:bg-[#E1EDFF] hover:cursor-pointer"
            >
              <Settings2 className="size-4" />
              Edit
            </Link>

            {/* -- Delete */}
            <div
              onClick={handleDelete}
              className="menu-list flex px-6 pl-4 py-2 items-center gap-2 text-[#E62314] hover:bg-[#FFCDC9] hover:cursor-pointer"
            >
              <Trash2 className="size-4" />
              Delete
            </div>
          </DropdownMenuCMS>
        </div>
      </div>
    </div>
  );
}
