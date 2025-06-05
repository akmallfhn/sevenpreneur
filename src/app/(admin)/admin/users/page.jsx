import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import UserItemListCMS from "@/app/components/elements/UserItemListCMS";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const data = [
    {
      "name": "Jennifer Anderson",
      "email": "jennifer.anderson@example.com",
      "phone": "001-499-991-4102x928",
      "avatar": "https://i.pravatar.cc/150?img=3",
      "role": "Class Manager",
      "created_at": "2024-06-29T07:21:01",
      "last_login": "2025-02-10T23:26:40",
      "status": "inactive"
    },
    {
      "name": "Justin Gray",
      "email": "justin.gray@example.com",
      "phone": "001-287-211-4934x262",
      "avatar": "https://i.pravatar.cc/150?img=62",
      "role": "Class Manager",
      "created_at": "2020-07-05T14:13:12",
      "last_login": "2025-06-02T01:15:28",
      "status": "active"
    },
    {
      "name": "Regina Martinez",
      "email": "regina.martinez@example.com",
      "phone": "393.830.8001",
      "avatar": "https://i.pravatar.cc/150?img=35",
      "role": "Educator",
      "created_at": "2024-06-18T09:24:36",
      "last_login": "2025-03-10T06:54:23",
      "status": "inactive"
    },
    {
      "name": "Tonya Ward",
      "email": "tonya.ward@example.com",
      "phone": "+1-932-556-3223x9991",
      "avatar": "https://i.pravatar.cc/150?img=51",
      "role": "Educator",
      "created_at": "2023-07-31T16:56:31",
      "last_login": "2025-02-24T09:29:41",
      "status": "active"
    },
    {
      "name": "Crystal Gardner",
      "email": "crystal.gardner@example.com",
      "phone": "508.398.3854",
      "avatar": "https://i.pravatar.cc/150?img=6",
      "role": "Administrator",
      "created_at": "2020-09-02T17:08:46",
      "last_login": "2025-03-01T13:57:04",
      "status": "active"
    },
    {
      "name": "Michael Pena",
      "email": "michael.pena@example.com",
      "phone": "+1-856-193-2696",
      "avatar": "https://i.pravatar.cc/150?img=31",
      "role": "Educator",
      "created_at": "2023-12-11T22:50:22",
      "last_login": "2025-04-12T13:55:12",
      "status": "active"
    },
    {
      "name": "Latoya Terry",
      "email": "latoya.terry@example.com",
      "phone": "256-184-9252x9355",
      "avatar": "https://i.pravatar.cc/150?img=38",
      "role": "Educator",
      "created_at": "2022-03-20T00:30:48",
      "last_login": "2025-05-17T04:07:09",
      "status": "active"
    },
    {
      "name": "Julia Case",
      "email": "julia.case@example.com",
      "phone": "(294)251-2442x8278",
      "avatar": "https://i.pravatar.cc/150?img=30",
      "role": "User",
      "created_at": "2025-01-16T21:51:55",
      "last_login": "2025-04-27T05:57:08",
      "status": "inactive"
    },
    {
      "name": "Charles Bond",
      "email": "charles.bond@example.com",
      "phone": "143.697.5969x28685",
      "avatar": "https://i.pravatar.cc/150?img=46",
      "role": "Class Manager",
      "created_at": "2024-07-09T07:18:13",
      "last_login": "2025-02-26T23:33:32",
      "status": "inactive"
    },
    {
      "name": "Amanda Taylor DVM",
      "email": "amanda.taylor.dvm@example.com",
      "phone": "9822286600",
      "avatar": "https://i.pravatar.cc/150?img=30",
      "role": "Class Manager",
      "created_at": "2020-07-05T09:00:28",
      "last_login": "2025-04-08T12:07:22",
      "status": "inactive"
    }
]

export default function UserListPage() {
    
    const userData = data

    return (
      <div className="root flex w-full h-full justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
        <div className="index-article w-[1040px] flex flex-col gap-4">
            {/* --- PAGE HEADER */}
            <div className="page-header flex flex-col gap-3">
                <div className="page-title-actions flex justify-between items-center">
                    {/* --- Page Title */}
                    <TitleRevealCMS
                    titlePage={"List User"}
                    descPage={"Manage your published content easily. Click on an article to view or edit its details."}
                    />
                    
                    {/* --- Page Actions */}
                    <Link href={"/users/create"} className="w-fit h-fit">
                        <AppButton variant="cmsPrimary">
                            <PlusCircle className="size-5"/>
                            Add New User
                        </AppButton>
                    </Link>
                </div>
            </div>

            {/* --- TABLE  */}
            <div className="flex flex-col gap-7 bg-white pb-7 rounded-md shadow-md overflow-hidden">
                {/* --- Column Name */}
                <div className="column-name flex px-7 p-4 items-center font-bodycopy font-semibold text-alternative text-sm bg-[#f5f5f5] border-b border-[#e3e3e3]">
                    <div className="max-w-[380px] w-full shrink-0">USER</div>
                    <div className="flex items-center gap-7">
                      <div className="max-w-[120px] w-full shrink-0">ROLE</div>
                      <div className="max-w-[102px] w-full shrink-0">CREATED AT</div>
                      <div className="max-w-[102px] w-full shrink-0">LAST LOGIN</div>
                      <div className="max-w-[102px] w-full shrink-0">STATUS</div>
                      <div className="max-w-[102px] w-full shrink-0">ACTIONS</div>
                    </div>
                </div>

                {/* --- Table */}
                <div className="flex flex-col gap-7 px-7">
                    {userData.map((post, index) => (
                        <UserItemListCMS key={index}
                        userName={post.name}
                        userEmail={post.email}
                        userAvatar={post.avatar}
                        userRole={post.role}
                        userStatus={post.status}
                        createdAt={post.created_at}
                        lastLogin={post.last_login}/>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }