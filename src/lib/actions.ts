"use server";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND } from "./status_code";

// DELETE SESSION FOR LOGOUT
export async function DeleteSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }

  // Request Backend Delete Token Database
  setSecretKey(process.env.SECRET_KEY_PUBLIC_API!);
  const loggedOut = await trpc.auth.logout({ token: sessionData.value });

  // Delete token on Cookie
  if (loggedOut.code === "NO_CONTENT") {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com";
    }
    cookieStore.set("session_token", "", {
      domain: domain,
      path: "/",
      maxAge: 0,
    });
    return { code: loggedOut.code, message: loggedOut.message };
  }

  return { code: STATUS_INTERNAL_SERVER_ERROR, message: "Logout failed" };
}

// MAKE PAYMENT COHORT AT XENDIT
interface MakePaymentCohortXenditProps {
  cohortPriceId: number;
  paymentChannelId: number;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentCohortXendit({
  cohortPriceId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentCohortXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.cohort({
    cohort_price_id: cohortPriceId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// MAKE PAYMENT EVENT AT XENDIT
interface MakePaymentEventXenditProps {
  eventPriceId: number;
  paymentChannelId: number;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentEventXenditProps({
  eventPriceId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentEventXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.event({
    event_price_id: eventPriceId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// MAKE PAYMENT PLAYLIST AT XENDIT
interface MakePaymentPlaylistXenditProps {
  playlistId: number;
  paymentChannelId: number;
  phoneNumber?: string | null | undefined;
  discountCode?: string | undefined;
}
export async function MakePaymentPlaylistXendit({
  playlistId,
  paymentChannelId,
  phoneNumber,
  discountCode,
}: MakePaymentPlaylistXenditProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const paymentResponse = await trpc.purchase.playlist({
    playlist_id: playlistId,
    payment_channel_id: paymentChannelId,
    phone_country_id: 1,
    phone_number: phoneNumber,
    discount_code: discountCode,
  });
  return {
    code: paymentResponse.code,
    message: paymentResponse.message,
    invoice_url: paymentResponse.invoice_url,
    transaction_id: paymentResponse.transaction_id,
  };
}

// CHECK DISCOUNT PLAYLIST
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
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
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
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
  };
}

// CHECK DISCOUNT COHORT
interface CheckDiscountCohortProps {
  discountCode: string;
  cohortId: number;
}
export async function CheckDiscountCohort({
  discountCode,
  cohortId,
}: CheckDiscountCohortProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    cohort_id: cohortId,
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
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
  };
}

// CHECK DISCOUNT EVENT
interface CheckDiscountEventProps {
  discountCode: string;
  eventId: number;
}
export async function CheckDiscountEvent({
  discountCode,
  eventId,
}: CheckDiscountEventProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const checkDiscount = await trpc.purchase.checkDiscount({
    code: discountCode,
    event_id: eventId,
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
    code: checkDiscount.code,
    message: checkDiscount.message,
    data: discountData,
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
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);
  const cancelResponse = await trpc.purchase.cancel({
    id: transactionId,
  });
  return {
    code: cancelResponse.code,
    message: cancelResponse.message,
  };
}

// CREATE SUBMISSION LMS
interface CreateSubmissionProps {
  projectId: number;
  submissionDocumentUrl: string;
}
export async function CreateSubmission({
  projectId,
  submissionDocumentUrl,
}: CreateSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const createSubmission = await trpc.create.submission({
    project_id: projectId,
    document_url: submissionDocumentUrl,
  });
  return {
    code: createSubmission.code,
    message: createSubmission.message,
  };
}

// UPDATE SUBMISSION LMS
interface EditSubmissionProps {
  submissionId: number;
  submissionDocumentUrl?: string | null;
  submissionComment?: string | null;
}
export async function EditSubmission({
  submissionId,
  submissionDocumentUrl,
  submissionComment,
}: EditSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const editSubmission = await trpc.update.submission({
    id: submissionId,
    document_url: submissionDocumentUrl,
    comment: submissionComment,
  });

  return {
    code: editSubmission.code,
    message: editSubmission.message,
  };
}

// DELETE SUBMISSION LMS
interface DeleteSubmissionProps {
  submissionId: number;
}
export async function DeleteSubmission({
  submissionId,
}: DeleteSubmissionProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const deleteSubmission = await trpc.delete.submission({
    id: submissionId,
  });
  return {
    code: deleteSubmission.code,
    message: deleteSubmission.message,
  };
}

// LIST DISCUSSION REPLIES
interface DiscussionReplyListProps {
  discussionStarterId: number;
}
export async function DiscussionReplyList({
  discussionStarterId,
}: DiscussionReplyListProps) {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");
  if (!sessionData) {
    return { code: STATUS_NOT_FOUND, message: "No session token found" };
  }
  setSessionToken(sessionData.value);

  const discussionRepliesRes = await trpc.list.discussionReplies({
    starter_id: discussionStarterId,
  });

  const discussionReplies = discussionRepliesRes.list.map((item) => ({
    ...item,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  }));

  return {
    code: discussionRepliesRes.code,
    message: discussionRepliesRes.message,
    list: discussionReplies,
  };
}
