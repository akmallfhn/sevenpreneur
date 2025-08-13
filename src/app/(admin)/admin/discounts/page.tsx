import DiscountListCMS from "@/app/components/indexes/DiscountListCMS";
import { cookies } from "next/headers";

export default async function DiscountsPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <DiscountListCMS sessionToken={sessionToken} />
    </div>
  );
}
