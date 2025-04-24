"use client"
import { AlignRight, ChevronDown, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function TopNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const toggleMenu = () => {setIsMenuOpen(!isMenuOpen)};
    const closeMenu = () => {setIsMenuOpen(false)};

    useEffect(() => {
    const handleScroll = () => {
        const scrollY = window.scrollY;
        setShowNavbar(scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return(
        <React.Fragment>
        <div className={`navbar fixed flex w-full justify-between px-7 py-3 items-center bg-black/40 backdrop-blur-sm z-[99] transition-all duration-500 ease-in-out ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'} laptop:px-36`}>
            <Link href="/" className="logo max-w-44">
                <Image
                src={"https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"}
                alt="Logo Sevenpreneur"
                width={1200}
                height={1200}
                className="w-full"
                />
            </Link>
            <div className="flex text-white tablet:hidden cursor-pointer text-neutral-black">
                <AlignRight
                onClick={toggleMenu}
                className="w-8 h-8"
                />
            </div>
        </div>
        {isMenuOpen && (
            <div className={`toggle-menu fixed top-0 right-0 h-full w-full bg-primary shadow-lg z-[999] transform transition-all duration-500 ease-in-out
                ${isMenuOpen ? 'translate-x-0 opacity-100' : 'opacity-0 translate-x-full'}`}>
                <X
                className="absolute top-8 right-8 size-8 text-lg font-bold cursor-pointer text-white/70"
                onClick={toggleMenu}
                />
                <div className="mt-44 flex flex-col items-center gap-4 text-white font-brand">
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        Sevenpreneur Vision
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        RE:START Conference 2025
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        Teaser
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        Topic Highlights
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        FAQ
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        Buy a Ticket
                    </Link>
                    <Link href="/" className="text-2xl font-ui font-semibold hover:underline" onClick={closeMenu}>
                        FAQ
                    </Link>
                </div>
            </div>
        )}
        </React.Fragment>
    )
}