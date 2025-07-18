import TransactionCardItemSVP from "@/app/components/items/TransactionCardItemSVP";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/`);
  }

  return (
    <div className="flex flex-col w-full bg-white pb-36 p-5 gap-5 lg:mx-auto lg:w-full lg:max-w-[960px] xl:max-w-[1208px]">
      <h1 className="font-bold font-ui text-xl text-black">
        Transaction History
      </h1>
      <div className="flex flex-col gap-4">
        <TransactionCardItemSVP />
        <TransactionCardItemSVP />
        <TransactionCardItemSVP />
        <TransactionCardItemSVP />
        <TransactionCardItemSVP />
      </div>
    </div>
  );
}
