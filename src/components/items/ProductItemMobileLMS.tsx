"use client";
import { ProductCategory } from "@/lib/app-types";
import dayjs from "dayjs";
import "dayjs/locale/en";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(localizedFormat);
dayjs.extend(isBetween);

interface ProductItemMobileLMSProps {
  productId: number;
  productName: string;
  productImage: string;
  productCategory: ProductCategory;
}

export default function ProductItemMobileLMS(props: ProductItemMobileLMSProps) {
  let labelCategory;
  let slugCategory;
  if (props.productCategory === "COHORT") {
    labelCategory = "Bootcamp Program";
    slugCategory = "cohorts";
  } else if (props.productCategory === "PLAYLIST") {
    labelCategory = "Learning Series";
    slugCategory = "playlists";
  }

  return (
    <Link
      href={`/${slugCategory}/${props.productId}`}
      className="product-container flex w-full p-3 items-center gap-3 bg-white border border-outline rounded-lg overflow-hidden transition transform active:scale-95"
    >
      <div className="product-image relative flex w-20 aspect-square rounded-md shrink-0 overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={props.productImage}
          alt="product-image"
          width={500}
          height={500}
        />
      </div>
      <div className="product-attributes relative flex flex-col gap-1">
        <h3 className="product-title text-base font-bodycopy font-bold line-clamp-2">
          {props.productName}
        </h3>
        <p className="product-category text-[#111111]/70 font-bodycopy font-medium text-sm">
          {labelCategory?.toUpperCase()}
        </p>
      </div>
    </Link>
  );
}
