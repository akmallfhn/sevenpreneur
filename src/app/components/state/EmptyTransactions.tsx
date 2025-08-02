import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

export default function EmptyTransactions() {
  return (
    <div className="empty-transactions flex flex-col w-full h-1/2 p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="flex flex-col gap-4 max-w-md text-center items-center">
        <div className="flex max-w-80 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//no-transactions.svg"
            }
            alt="empty-transactions"
            width={500}
            height={400}
          />
        </div>
        <h2 className="flex font-bold font-brand text-center tracking-tight text-2xl text-neutral-black">
          No Transactions Yet
        </h2>
        <p className="font-bodycopy text-center font-medium text-alternative">
          You haven&#39;t made any transactions yet. Once you do, they&#39;ll
          show up right here—neat and organized.
        </p>
        <Link href={"https://sevenpreneur.com/"}>
          <AppButton>Back to Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
