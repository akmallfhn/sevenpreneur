import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import Link from "next/link";

export default function UserListPage() {
    return (
      <div className="root flex w-full h-full justify-center bg-main-root py-8 lg:pl-64">
        <div className="index-article w-[1040px] flex flex-col gap-4">
          {/* PAGE HEADER */}
          <div className="page-header flex flex-col gap-3">
                {/* <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/dashboard/${publisherIdInt}`}>
                                <House className="size-4"/>
                                Dashboard
                            </BreadcrumbLink>                                
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Article</BreadcrumbPage>                              
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb> */}
                <div className="page-title-actions flex justify-between">
                    <TitleRevealCMS
                    titlePage={"List User"}
                    descPage={"Manage your published content easily. Click on an article to view or edit its details."}
                    />
                    <Link href={`/users/create`}>
                        <AppButton>
                          Add New User
                        </AppButton>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    );
  }