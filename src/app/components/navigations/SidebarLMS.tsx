"use client";
import { DeleteSession } from "@/lib/actions";
import {
  BotMessageSquare,
  BowArrow,
  CircleFadingPlus,
  CirclePlay,
  LayoutDashboard,
  Loader2,
  LogOut,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import SidebarAIResultItemLMS from "./SidebarAIResultItemLMS";
import SidebarMenuItemLMS from "./SidebarMenuItemLMS";

export interface AIResultListProps {
  id: string;
  name: string;
  ai_tool_slug_url: string;
  created_at: string;
}

interface SidebarLMSProps {
  aiResultList: AIResultListProps[];
}

export default function SidebarLMS({ aiResultList }: SidebarLMSProps) {
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    // Redirect to login page
    if (result.code === "NO_CONTENT") {
      router.push(`https://www.${domain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
    setIsLoadingButton(false);
  };

  return (
    <div className="sidebar-lms-root hidden fixed flex-col max-w-64 w-full h-full inset-y-0 left-0 items-center bg-[#FCFDFE] backdrop-blur-md z-50 dark:bg-surface-black lg:flex">
      <div className="sidebar-lms-container relative flex flex-col w-full h-full">
        <div className="sidebar-main-menu fixed top-0 left-0 w-64 flex flex-col p-3 pt-5 gap-5 bg-[#FCFDFE] z-10">
          <div className="sidebar-logo flex items-center gap-4 pl-1">
            <div className="sidebar-logo flex size-11 rounded-md outline-4 outline-primary/5 shrink-0 overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-white.svg"
                }
                alt="logo-sevenpreneur"
                width={400}
                height={400}
              />
            </div>
            <div className="sidebar-logo flex">
              <svg
                width="1363"
                height="192"
                viewBox="0 0 1363 192"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-[142px] h-auto"
              >
                <path
                  d="M102.798 3.02063L140.549 186.942C141.153 189.358 139.341 191.774 136.623 191.774H119.711C117.899 191.774 116.389 190.264 115.785 188.452L104.61 133.789H72.5978C59.0075 133.789 60.8196 116.575 48.1353 116.575C41.1892 116.575 37.8671 124.125 37.2631 126.541L24.5789 188.452C24.2769 190.264 22.4648 191.774 20.6528 191.774H4.04247C1.32441 191.774 -0.487623 189.358 0.116389 186.942C0.116389 186.942 30.317 40.1673 30.317 39.2613C33.035 27.4831 39.0752 22.349 47.8333 22.349C57.4975 22.349 57.1955 12.9868 57.1955 12.9868C57.1955 -0.301449 68.0677 0.000570976 68.0677 0.000570976H98.8723C100.684 0.000570976 102.496 1.20858 102.798 3.02063ZM40.2832 111.743H100.08L82.262 25.0671C81.96 22.953 80.148 21.745 78.3359 21.745H62.0276C60.2156 21.745 58.7055 22.953 58.1015 25.0671L40.2832 111.743Z"
                  fill="black"
                />
                <path
                  d="M298.312 90.9043C300.728 90.9043 302.54 92.7164 302.54 94.8304V148.285C302.54 159.46 293.782 169.728 282.608 169.124C275.963 168.822 272.641 172.748 272.641 179.694C272.641 183.318 270.527 191.774 259.957 191.774H195.026C182.04 191.774 171.469 180.902 171.469 167.916V41.6774C171.469 30.5031 180.53 22.349 191.704 22.349C197.744 22.349 201.066 18.4229 201.066 11.7788C201.066 8.15471 202.878 0.000570976 213.75 0.000570976H294.386C296.802 0.000570976 298.312 1.8126 298.312 3.92663V17.8189C298.312 19.933 296.802 21.745 294.386 21.745H210.73C202.878 21.745 196.234 28.0871 196.234 34.7312V161.876C196.234 166.104 199.556 169.728 204.086 169.728H262.977C270.829 169.728 277.473 163.386 277.775 156.742V115.669C277.775 113.253 275.963 111.743 273.547 111.743H240.931C238.515 111.743 237.005 109.931 237.005 107.515V94.8304C237.005 92.7164 238.515 90.9043 240.931 90.9043H298.312Z"
                  fill="black"
                />
                <path
                  d="M450.57 0.000570976C463.858 0.000570976 474.428 10.5708 474.428 23.557V149.795C474.428 160.97 465.066 169.124 453.892 169.124C447.852 169.124 444.53 173.05 444.53 179.694C444.53 183.318 442.718 191.774 431.846 191.774H356.646C343.66 191.774 333.09 180.902 333.09 167.916V41.6774C333.09 30.5031 342.15 22.349 353.324 22.349C359.364 22.349 362.686 18.4229 362.686 11.7788C362.686 8.15471 364.8 0.000570976 375.37 0.000570976H450.57ZM449.664 156.742V29.5971C449.664 25.3691 446.04 21.745 441.51 21.745H372.35C364.498 21.745 357.854 28.0871 357.854 34.7312V161.876C357.854 166.104 361.176 169.728 365.706 169.728H435.168C442.718 169.728 449.362 163.386 449.664 156.742Z"
                  fill="black"
                />
                <path
                  d="M618.889 87.2803C615.869 87.8843 615.265 91.8103 617.379 93.9244L632.479 109.025C633.687 110.233 634.291 111.743 634.291 113.253V187.546C634.291 189.962 632.479 191.774 630.365 191.774H613.453C611.339 191.774 609.527 189.962 609.527 187.546V115.065C609.527 110.837 605.902 107.213 601.674 107.213H565.736C551.843 107.213 553.051 89.6963 540.669 89.6963C533.723 89.6963 530.099 96.0384 530.099 101.173L529.495 187.546C529.495 189.962 527.683 191.774 525.569 191.774H508.959C506.542 191.774 505.032 189.962 505.032 187.546V42.8854C505.032 27.4831 514.093 22.349 525.267 22.349C531.307 22.349 534.629 18.4229 534.629 11.7788C534.629 8.15471 536.441 0.000570976 547.313 0.000570976H610.735C623.721 0.000570976 634.291 10.5708 634.291 23.557V64.3278C634.291 77.9181 627.647 84.8642 618.889 87.2803ZM609.829 70.6699V29.5971C609.829 25.3691 606.204 21.745 601.976 21.745H544.293C536.441 21.745 529.797 24.161 529.797 34.7312V59.7977L530.099 85.4682H598.05C604.392 85.4682 609.829 77.9181 609.829 70.6699Z"
                  fill="black"
                />
                <path
                  d="M767.565 3.02063L805.316 186.942C805.92 189.358 804.108 191.774 801.39 191.774H784.478C782.666 191.774 781.156 190.264 780.552 188.452L769.377 133.789H737.365C723.774 133.789 725.586 116.575 712.902 116.575C705.956 116.575 702.634 124.125 702.03 126.541L689.346 188.452C689.044 190.264 687.232 191.774 685.42 191.774H668.809C666.091 191.774 664.279 189.358 664.883 186.942C664.883 186.942 695.084 40.1673 695.084 39.2613C697.802 27.4831 703.842 22.349 712.6 22.349C722.264 22.349 721.962 12.9868 721.962 12.9868C721.962 -0.301449 732.835 0.000570976 732.835 0.000570976H763.639C765.451 0.000570976 767.263 1.20858 767.565 3.02063ZM705.05 111.743H764.847L747.029 25.0671C746.727 22.953 744.915 21.745 743.103 21.745H726.794C724.982 21.745 723.472 22.953 722.868 25.0671L705.05 111.743Z"
                  fill="black"
                />
                <path
                  d="M979.745 169.728C981.859 169.728 983.671 171.54 983.671 173.654V187.546C983.671 189.962 981.859 191.774 979.745 191.774H922.666C920.854 191.774 919.344 190.868 918.136 189.962L882.197 153.722C880.989 152.514 880.385 151.003 880.385 149.191V3.92663C880.385 1.5106 881.895 0.000570976 884.311 0.000570976H900.921C903.337 0.000570976 905.149 1.5106 905.149 3.92663V153.722C905.149 162.48 912.096 169.728 920.854 169.728H979.745Z"
                  fill="black"
                />
                <path
                  d="M1186.12 0.000570976C1199.41 0.000570976 1209.98 10.5708 1209.98 23.557V187.546C1209.98 189.962 1208.17 191.774 1206.06 191.774H1189.14C1187.03 191.774 1185.22 189.962 1185.22 187.546V29.5971C1185.22 25.3691 1181.59 21.745 1177.37 21.745H1139.01C1131.16 21.745 1124.51 28.0871 1124.51 34.7312V187.546C1124.51 188.15 1124.21 188.754 1124.21 189.056C1123.91 189.66 1123.61 190.264 1123.31 190.566C1122.4 191.17 1121.49 191.774 1120.59 191.774H1103.68C1101.26 191.774 1099.75 189.962 1099.75 187.546V29.5971C1099.75 25.3691 1096.13 21.745 1091.6 21.745H1053.54C1045.69 21.745 1039.05 28.0871 1039.05 34.7312V187.546C1039.05 189.962 1037.23 191.774 1034.82 191.774H1018.21C1016.09 191.774 1014.28 189.962 1014.28 187.546V41.6774C1014.28 30.5031 1023.34 22.349 1034.52 22.349C1040.56 22.349 1043.88 18.4229 1043.88 11.7788C1043.88 8.15471 1045.99 0.000570976 1056.56 0.000570976H1097.64C1110.62 0.000570976 1107.9 21.443 1119.98 21.443C1129.65 21.443 1131.16 0.000570976 1142.03 0.000570976H1186.12Z"
                  fill="black"
                />
                <path
                  d="M1253.18 64.9318C1244.42 55.5696 1240.49 50.1335 1240.49 41.6774C1240.49 30.5031 1249.55 22.349 1260.73 22.349C1266.77 22.349 1270.09 18.4229 1270.09 11.7788C1270.09 8.15471 1271.9 0.000570976 1282.77 0.000570976H1358.58C1360.99 0.000570976 1362.8 1.5106 1362.8 3.92663V17.8189C1362.8 19.933 1360.99 21.745 1358.58 21.745H1279.75C1271.9 21.745 1267.07 26.8791 1267.07 32.3152C1267.07 35.6373 1268.28 41.3754 1272.81 45.9055L1349.82 126.541C1358.58 135.903 1362.8 141.339 1362.8 149.795C1362.8 160.97 1353.44 169.124 1342.27 169.124C1336.23 169.124 1332.91 173.05 1332.91 179.694C1332.91 183.62 1331.09 191.774 1320.22 191.774H1244.42C1242.3 191.774 1240.49 189.962 1240.49 187.848V173.654C1240.49 171.54 1242.3 169.728 1244.42 169.728H1323.24C1331.09 169.728 1335.93 164.594 1335.93 159.158C1335.93 155.836 1334.72 150.097 1330.19 145.567L1253.18 64.9318Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          <div className="sidebar-lms-menu flex flex-col w-full h-full gap-2">
            <SidebarMenuItemLMS
              menuTitle="Dashboard"
              url="/"
              icon={<LayoutDashboard />}
              isHome
            />
            <SidebarMenuItemLMS
              menuTitle="Bootcamp Programs"
              url="/cohorts"
              icon={<Presentation />}
            />
            <SidebarMenuItemLMS
              menuTitle="Business Templates"
              url="/templates"
              icon={<BowArrow />}
            />
            <SidebarMenuItemLMS
              menuTitle="AI"
              url="/ai"
              icon={<BotMessageSquare />}
            />
            <SidebarMenuItemLMS
              menuTitle="Learning Series"
              url="/playlists"
              icon={<CirclePlay />}
            />
          </div>
        </div>
        <div className="sidebar-scroll-body flex flex-col w-full h-full gap-4 mt-[308px] mb-[68px] px-3 overflow-y-auto">
          <hr />
          <Link href="/ai/chat" className="w-full">
            <AppButton className="w-full" size="medium" variant="primaryLight">
              New Chat <CircleFadingPlus className="size-4.5" />
            </AppButton>
          </Link>
          {aiResultList.length > 0 && (
            <div className="sidebar-lms-ai-result flex flex-col w-full gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="m-2 mt-0 text-sm text-alternative font-bodycopy font-medium">
                  Generated Result
                </h2>
                <div className="sidebar-ai-result flex flex-col h-full gap-2">
                  {aiResultList.map((post) => (
                    <SidebarAIResultItemLMS
                      key={post.id}
                      aiToolSlug={post.ai_tool_slug_url}
                      aiResultId={post.id}
                      aiResultName={post.name || "Agora AI"}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sidebar-lms-bottom fixed flex bottom-0 mx-auto w-full px-3 py-4 bg-[#FCFDFE] z-10">
          <div
            className={`logout-button flex w-full items-center p-2 px-2.5 gap-4 text-[#BE0E22] text-sm font-brand font-medium overflow-hidden rounded-md transition transform hover:cursor-pointer hover:bg-semi-destructive active:bg-semi-destructive active:scale-95 ${
              isLoadingButton ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLogout}
          >
            <div className="flex size-5 items-center justify-center">
              {isLoadingButton ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogOut />
              )}
            </div>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
