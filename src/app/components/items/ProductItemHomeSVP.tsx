import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductItemHomeSVPProps {
  productName: string;
  productDesc: string;
  productImage: string;
  productPath: string | null;
}

export default function ProductItemHomeSVP(props: ProductItemHomeSVPProps) {
  return (
    <div className="product-item flex flex-col w-full h-full items-center gap-4 p-2">
      <div className="product-image relative aspect-[16/8] max-h-[300px] rounded-xl overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src={props.productImage}
          alt={props.productName}
          width={300}
          height={300}
        />
        {!props.productPath && (
          <div
            className="absolute right-3 top-3 py-[2px] px-[10px] text-sm text-white font-bodycopy font-medium rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(37, 98, 231) 0%, rgb(110, 0, 255) 100%)",
            }}
          >
            Coming Soon
          </div>
        )}
      </div>
      <div className="metadata flex flex-col flex-1 px-2 gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="product-name font-bodycopy font-bold text-xl lg:text-2xl">
            {props.productName}
          </h3>
          <p className="product-description font-bodycopy text-[15px] text-[#686868]">
            {props.productDesc}
          </p>
        </div>
        {props.productPath && (
          <Link
            href={props.productPath}
            className="product-path flex mt-auto items-center gap-1 text-[15px] text-primary hover:text-[#0759D3]"
          >
            <p className="font-bodycopy font-medium duration-100 transform transition">
              View Details
            </p>
            <ArrowRight className="size-5" />
          </Link>
        )}
      </div>
    </div>
  );
}
