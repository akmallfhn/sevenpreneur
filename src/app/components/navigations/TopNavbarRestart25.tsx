"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AlignRight, X } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menyimpan state membuka toggle
  const [showNavbar, setShowNavbar] = useState(false); // Menyimpan state navbar muncul setelah scroll

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Path yang tidak mau menampilkan Navbar & Footer
  const isAuthPage = pathname.startsWith("/auth");

  // Muncul setelah scroll 30px
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowWidth = window.innerWidth;

      if (windowWidth < 1024) {
        setShowNavbar(scrollY > 30);
      } else {
        setShowNavbar(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const navigationMenu = [
    {
      menu_name: "Home",
      url: "/",
      is_desktop: true,
    },
    {
      menu_name: "Vision",
      url: "#vision",
      is_desktop: false,
    },
    {
      menu_name: "RE:START Conference 2025",
      url: "#content-event",
      is_desktop: true,
    },
    {
      menu_name: "Teaser",
      url: "#teaser",
      is_desktop: false,
    },
    {
      menu_name: "Topics",
      url: "#topics",
      is_desktop: true,
    },
    {
      menu_name: "Speakers",
      url: "#speakers-lineup",
      is_desktop: true,
    },
    {
      menu_name: "Get Your Ticket",
      url: "#ticket-id",
      is_desktop: true,
    },
    {
      menu_name: "FAQ",
      url: "#faq",
      is_desktop: false,
    },
  ];

  return (
    <React.Fragment>
      {!isAuthPage && (
        <div
          className={`navbar fixed flex w-full justify-between px-7 py-3 items-center bg-black/40 backdrop-blur-sm z-[99] transition-all duration-500 ease-in-out ${
            showNavbar
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          } lg:px-36 lg:py-4`}
        >
          <Link href="/" className="logo max-w-44">
            <Image
              src={
                "https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"
              }
              alt="Logo Sevenpreneur"
              width={1200}
              height={1200}
              className="w-full"
            />
          </Link>
          {/* --- Mobile Toggle Button */}
          <div className="flex text-white cursor-pointer text-neutral-black lg:hidden">
            <AlignRight onClick={toggleMenu} className="w-8 h-8" />
          </div>
          {/* --- Desktop Navbar List */}
          <div className="hidden text-[#CDCDCD] font-medium font-brand text-lg items-center text-center lg:flex lg:gap-2 xl:gap-5">
            {navigationMenu
              .filter((post) => post.is_desktop)
              .map((post, index) => (
                <Link
                  href={post.url}
                  key={index}
                  className="flex truncate transition transform duration-500 hover:font-semibold hover:text-white hover:cursor-pointer"
                  // Offset scroll +150px
                  onClick={(e) => {
                    if (post.url.startsWith("#")) {
                      e.preventDefault();
                      const targetId = post.url.replace("#", "");
                      const element = document.getElementById(targetId);
                      if (element) {
                        const yOffset = -150;
                        const y =
                          element.getBoundingClientRect().top +
                          window.pageYOffset +
                          yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                      }
                      closeMenu();
                    } else {
                      closeMenu();
                    }
                  }}
                >
                  {post.menu_name}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* --- Toggle Menu */}
      {isMenuOpen && (
        <div
          className={`toggle-menu fixed top-0 right-0 h-full w-full bg-primary-dark shadow-lg z-[999] transform transition-all duration-500 ease-in-out
                    ${
                      isMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "opacity-0 translate-x-full"
                    }`}
        >
          <X
            className="absolute top-8 right-8 size-8 text-lg font-bold cursor-pointer text-white/70"
            onClick={toggleMenu}
          />
          <div className="mt-44 flex flex-col items-center gap-4 text-white font-brand">
            {navigationMenu.map((post, index) => (
              <Link
                className="text-2xl font-ui font-semibold hover:underline"
                href={post.url}
                key={index}
                // --- Offset scroll +150px
                onClick={(e) => {
                  if (post.url.startsWith("#")) {
                    e.preventDefault();
                    const targetId = post.url.replace("#", "");
                    const element = document.getElementById(targetId);
                    if (element) {
                      const yOffset = -150;
                      const y =
                        element.getBoundingClientRect().top +
                        window.pageYOffset +
                        yOffset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                    closeMenu();
                  } else {
                    closeMenu();
                  }
                }}
              >
                {post.menu_name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
