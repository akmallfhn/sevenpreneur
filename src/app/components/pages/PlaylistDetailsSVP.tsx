"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { Star } from "lucide-react";
import Link from "next/link";
import HeroVideoCourseSVP from "../templates/HeroVideoCourseSVP";

export default function PlaylistDetailsSVP() {
  return (
    <div className="flex flex-col w-full">
      <HeroVideoCourseSVP />
      <div className="bg-white">Test</div>
    </div>
  );
}
