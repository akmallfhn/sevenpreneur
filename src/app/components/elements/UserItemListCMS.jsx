"use client"
import Image from "next/image"
import { AtSign, EllipsisVertical, Fingerprint, PhoneCall } from "lucide-react"
import LabelAttributeCMS from "./LabelAttributeCMS"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import StatusLabelCMS from "./StatusLabelCMS"

dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export default function UserItemListCMS({ userName, userAvatar, userEmail, userRole, userStatus, createdAt, lastLogin }){
    return(
        <div className="user-item flex items-center">
            <div className="user-item-id flex items-center gap-4 max-w-[480px] w-full">
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
                    <h2 className="user-name font-bold font-bodycopy line-clamp-1">
                        {userName} 
                    </h2>
                    <p className="user-email flex items-center gap-2 text-[#333333] font-bodycopy text-sm">
                        {userEmail}
                    </p>
                </div>
            </div>

            <div className="flex gap-5 items-center">
                {/* --- Role */}
                <div className="user-role flex w-[140px]">
                    <LabelAttributeCMS labelName={userRole}/>
                </div>

                {/* --- Created at */}
                <p className="created-at flex text-sm font-bodycopy font-medium text-[#333333] w-[140px]">
                    {dayjs(createdAt).locale("id").tz("Asia/Jakarta").format("ll")}
                </p>

                {/* --- Last login */}
                <p className="last-login flex text-sm font-bodycopy font-medium text-[#333333] w-[140px]">
                    {dayjs(lastLogin).locale("id").tz("Asia/Jakarta").format("ll")}
                </p>

                {/* --- Status */}
                <div className="status">
                    <StatusLabelCMS labelName={userStatus}/>
                </div>

                {/* --- Actions */}
                <div className="actions-menu">
                    <EllipsisVertical/>
                </div>
                
            </div>
            
        </div>
    )
}