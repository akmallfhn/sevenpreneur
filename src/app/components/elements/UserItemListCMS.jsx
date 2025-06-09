"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import StatusLabelCMS from "./StatusLabelCMS";
import AppButton from "./AppButton";
import AttributeLabelCMS from "./AttributeLabelCMS";
import Link from "next/link";
import DropdownMenuCMS from "./DropdownMenuCMS";

dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export default function UserItemListCMS({
  userName,
  userAvatar,
  userEmail,
  userRole,
  userStatus,
  createdAt,
  lastLogin,
}) {
  // --- State untuk menyimpan status dropdown
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef(null);

  // --- Fungsi untuk membuka dan menutup share dropdown
  const handleActionsDropdown = (e) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // --- Fungsi untuk menutup share dropdown di luar toggle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsActionsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Insert Role Data to Variant
  const equalizingRoleVariant = (role) =>
    role.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="user-item flex items-center">
      <div className="user-item-id flex items-center gap-4 max-w-[380px] w-full shrink-0">
        {/* --- Avatar */}
        <div className="flex size-10 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={userAvatar}
            alt={`Image ${userName}`}
            width={300}
            height={300}
          />
        </div>
        {/* --- User Name & Email */}
        <div className="user-name-email flex flex-col">
          <Link href={"/users/f1d27a50-00f1-48c0-9265-c516ae1f532a"}>
            <h2 className="user-name font-bold font-bodycopy line-clamp-1">
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
          <StatusLabelCMS labelName={userStatus} variants={userStatus} />
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
          />
        </div>
      </div>
    </div>
  );
}
