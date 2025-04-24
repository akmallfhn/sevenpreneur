import { Plus_Jakarta_Sans, Mona_Sans } from "next/font/google";
import "./globals.css";
import TopNavbar from "./components/elements/TopNavbarRestart25";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"]
})

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${monaSans.variable} ${plusJakartaSans.variable} antialiased`}>
        <TopNavbar/>
        {children}
      </body>
    </html>
  );
}
