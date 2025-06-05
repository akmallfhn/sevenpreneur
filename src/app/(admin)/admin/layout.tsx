import { TRPCProvider } from "../../../trpc/client";
import "../../globals.css"
import { Plus_Jakarta_Sans, Mona_Sans } from "next/font/google";
import localFont from "next/font/local"
import SidebarCMS from "@/app/components/templates/SidebarCMS";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"]
})

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const openSauceOne = localFont({
  variable: "--font-open-sauce-one",
  display: "swap",
  src: [
    {
      path: "../../fonts/OpenSauceOne-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ]
})


export default function RootLayout({ children }: any) {
  return (
    <TRPCProvider>
      <html lang="en">
        <body className={`${monaSans.variable} ${plusJakartaSans.variable} ${openSauceOne.variable} antialiased`}>
          <SidebarCMS/>
          {children}
        </body>
      </html>
    </TRPCProvider>
  );
}
