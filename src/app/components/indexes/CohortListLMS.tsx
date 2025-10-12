import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortItemCardLMS from "../items/CohortItemCardLMS";
import HeaderNavbarLMS, {
  HeaderNavbarLMSProps,
} from "../navigations/HeaderPageLMS";

interface CohortListLMSProps extends AvatarBadgeLMSProps {
  userRole: number;
}

export default function CohortListLMS({
  userName,
  userRole,
  userAvatar,
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
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="grid gap-4 items-center lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
          <CohortItemCardLMS />
        </div>
      </div>
    </div>
  );
}
