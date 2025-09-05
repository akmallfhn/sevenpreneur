import { Metadata } from "next";
import AppAuthLogin from "@/app/components/pages/AppAuthLogin";

export const metadata: Metadata = {
  title: "Login | Sevenpreneur",
  description:
    "Akses platform eksklusif yang dirancang untuk bertumbuh bersama dan wujudkan bisnis terbaikmu. Login sekarang dan lanjutkan.",
  keywords:
    "Sevenpreneur, login, akses akun, platform bisnis, wirausaha digital, manajemen usaha, growth platform",
  authors: [{ name: "Sevenpreneur Team" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/auth/login",
  },
  openGraph: {
    title: "Login | Sevenpreneur",
    description:
      "Akses platform eksklusif yang dirancang untuk bertumbuh bersama dan wujudkan bisnis terbaikmu. Login sekarang dan lanjutkan.",
    url: "/auth/login",
    siteName: "Sevenpreneur",
    images: [
      {
        url: "https://static.wixstatic.com/media/02a5b1_d0f0ef7195ce4fa0ada080a1bd432f17~mv2.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Sevenpreneur",
    description:
      "Akses platform eksklusif yang dirancang untuk bertumbuh bersama dan wujudkan bisnis terbaikmu. Login sekarang dan lanjutkan.",
    images:
      "https://static.wixstatic.com/media/02a5b1_d0f0ef7195ce4fa0ada080a1bd432f17~mv2.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function AuthPage() {
  let domain = "sevenpreneur.com";
  if (process.env.DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }
  return <AppAuthLogin currentDomain={domain} />;
}
