"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import { Star } from "lucide-react";

export default function HeroVideoCourseSVP() {
  return (
    <div className="hero-video-course relative flex flex-col w-full h-full bg-black items-center md:flex-row-reverse lg:max-h-[460px] overflow-hidden">
      {/* Image & Video Thumbnail */}
      <div className="image-thumbnail relative flex aspect-thumbnail w-full h-full overflow-hidden md:flex-[1.6] md:min-h-full md:aspect-auto lg:flex-2">
        <Image
          className="object-cover w-full h-full"
          src={
            "https://cdn1-production-images-kly.akamaized.net/HBgfaG-KNzdYi2QEZyrYa6KVnWs=/0x0:1500x845/1200x675/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/5277743/original/083152400_1752044562-PWN__1500X845_.jpg"
          }
          alt="Image"
          width={800}
          height={800}
        />
        <div
          className={`overlay absolute inset-0 z-10 bg-linear-to-t from-5% from-black to-60% to-black/0 lg:hidden`}
        />
        <div
          className={`overlay hidden absolute inset-0 z-10 bg-linear-to-r from-5% from-black to-60% to-black/0 md:flex`}
        />
      </div>
      {/* Canvas */}
      <div className="white-area w-full h-[360px] md:flex-1 md:h-auto" />

      {/* Headline */}
      <div className="absolute flex flex-col w-full bottom-0 left-1/2 -translate-x-1/2 items-center font-ui p-5 pb-10 gap-4 z-10 sm:bottom-[100px] md:bottom-auto md:pb-5 md:items-start md:top-1/2 md:-translate-y-1/2 lg:p-0 lg:max-w-[960px] xl:max-w-[1208px]">
        <div className="title-tagline flex flex-col items-center max-w-[420px] gap-1 md:items-start">
          <h1 className="title font-bold text-3xl line-clamp-2 text-center text-transparent bg-clip-text bg-linear-to-br from-white to-[#999999] md:text-left lg:text-4xl">
            RE:START Conference 2025
          </h1>
          <p className="tagline text-sm text-white text-center line-clamp-3 md:text-left lg:text-base">
            Bergabunglah dengan pembicaraan inspiratif yang berasal dari
            tokoh-tokoh berpengaruh di Indonesia
          </p>
        </div>
        <div className="instructor flex flex-col items-center gap-1 md:items-start max-w-[420px]">
          <p className="text-white/80 text-sm">Instructors</p>
          <div className="user-avatar-stack flex items-center gap-3 text-white">
            <div className="avatar-stack flex items-center">
              <div className="flex aspect-square w-7 border border-white rounded-full overflow-hidden">
                <Image
                  src={"https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="Nama"
                  width={150}
                  height={150}
                />
              </div>
              <div className="flex aspect-square w-7 -ml-3 border border-white rounded-full overflow-hidden">
                <Image
                  src={"https://randomuser.me/api/portraits/women/65.jpg"}
                  alt="Nama"
                  width={150}
                  height={150}
                />
              </div>
              <div className="flex aspect-square w-7 -ml-3 border border-white rounded-full overflow-hidden">
                <Image
                  src={"https://randomuser.me/api/portraits/women/43.jpg"}
                  alt="Nama"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <p className="max-w-[220px] text-sm font-bold lg:text-base lg:max-w-[420px]">
              Basuki Tjahja Purnama, Arsjad Rasjid, dr. Tirta and 10 more
            </p>
          </div>
        </div>
        <Link href={"/"} className="checkout-button w-full max-w-[420px]">
          <AppButton size="defaultRounded" className="w-full md:w-fit">
            <p className="px-2">Start Learning for Only 127K</p>
          </AppButton>
        </Link>
        <div className="ratings flex items-center gap-1 text-sm">
          <div className="flex items-center">
            <Star fill="#FBBC15" className="size-5" />
            <p className="text-white/90">4.6 ratings</p>
          </div>
          <p className="text-white/45">●</p>
          <p className="text-white/90">227 learners joined</p>
        </div>
      </div>
    </div>
  );
}
