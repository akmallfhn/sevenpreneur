import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortItemCardLMS from "../items/CohortItemCardLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";

interface CohortList {
  id: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
}

interface CohortListLMSProps extends AvatarBadgeLMSProps {
  userRole: number;
  cohortList: CohortList[];
}

export default function CohortListLMS({
  userName,
  userRole,
  userAvatar,
  cohortList,
}: CohortListLMSProps) {
  return (
    <div className="root-page hidden w-full h-full gap-4 items-center justify-center pb-8 lg:flex lg:flex-col lg:pl-64">
      <HeaderNavbarLMS
        headerTitle="Bootcamp Programs"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cohortList.map((post, index) => (
            <CohortItemCardLMS
              key={index}
              cohortId={post.id}
              cohortName={post.name}
              cohortImage={post.image}
              cohortStartDate={post.start_date}
              cohortEndDate={post.end_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
