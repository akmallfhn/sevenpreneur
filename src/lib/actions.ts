"use server";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

// DELETE SESSION FOR LOGOUT
export async function DeleteSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }

  // --- Request Backend Delete Token Database
  setSecretKey(process.env.SECRET_KEY_PUBLIC_API!);
  const loggedOut = await trpc.auth.logout({ token: sessionData.value });

  // --- Delete token on Cookie
  if (loggedOut.code === "SUCCESS") {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com";
    }
    // cookieStore.delete("session_token");
    cookieStore.set("session_token", "", {
      domain: domain,
      path: "/",
      maxAge: 0,
    });
    return { code: loggedOut.code, message: loggedOut.message };
  }

  return { status: 401, message: "Logout failed" };
}

// MAKE PAYMENT AT XENDIT
interface MakePaymentCohortXenditProps {
  cohortPriceId: number;
  paymentChannelId: number;
  phoneNumber?: string | null | undefined;
}
export async function MakePaymentCohortXendit({
  cohortPriceId,
  paymentChannelId,
  phoneNumber,
}: MakePaymentCohortXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.cohort({
    cohort_price_id: cohortPriceId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
  });
  return {
    status: paymentResponse.status,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// CANCEL PAYMENT AT XENDIT
interface CancelPaymentXenditProps {
  transactionId: string;
}
export async function CancelPaymentXendit({
  transactionId,
}: CancelPaymentXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const cancelResponse = await trpc.purchase.cancel({
    id: transactionId,
  });
  return {
    status: cancelResponse.status,
    message: cancelResponse.message,
  };
}

// MAKE PAYMENT PLAYLIST AT XENDIT
interface MakePaymentPlaylistXenditProps {
  playlistId: number;
  paymentChannelId: number;
  phoneNumber?: string | null | undefined;
}
export async function MakePaymentPlaylistXendit({
  playlistId,
  paymentChannelId,
  phoneNumber,
}: MakePaymentPlaylistXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.playlist({
    playlist_id: playlistId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
  });
  return {
    status: paymentResponse.status,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// CHECK DISCOUNT
interface CheckDiscountPlaylistProps {
  discountCode: string;
  playlistId: number;
}
export async function CheckDiscountPlaylist({
  discountCode,
  playlistId,
}: CheckDiscountPlaylistProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    playlist_id: playlistId,
  });
  const discountDataRaw = checkDiscount?.discount;
  const discountData = {
    ...discountDataRaw,
    calc_percent:
      typeof discountDataRaw?.calc_percent === "object" &&
      "toNumber" in discountDataRaw.calc_percent
        ? discountDataRaw.calc_percent.toNumber()
        : Number(discountDataRaw?.calc_percent ?? 0),
  };
  return {
    status: checkDiscount.status,
    message: checkDiscount.message,
    data: discountData,
  };
}
