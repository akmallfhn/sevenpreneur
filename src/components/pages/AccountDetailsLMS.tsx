"use client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import EditUserFormLMS, {
  IndustryList,
  InitialDataUser,
} from "../../app/components/forms/EditUserFormLMS";
import PageHeaderLMS from "../../app/components/navigations/PageHeaderLMS";

interface AccountDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
  initialData: InitialDataUser;
  industriesData: IndustryList[];
}

export default function AccountDetailsLMS(props: AccountDetailsLMSProps) {
  return (
    <div className="root-page hidden flex-col pl-64 w-full h-full gap-5 items-center pb-8 lg:flex">
      <PageHeaderLMS
        headerTitle="Account Settings"
        headerIcon={<FontAwesomeIcon icon={faUser} />}
        headerIconColor="bg-[#FDE4D8] text-[#FB7A36]"
        sessionUserRole={props.sessionUserRole}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
      />
      <div className="body-learning max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        <EditUserFormLMS
          sessionUserId={props.sessionUserId}
          initialData={props.initialData}
          industriesData={props.industriesData}
        />
      </div>
    </div>
  );
}
