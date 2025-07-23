import TransactionStatusSVP from "@/app/components/pages/TransactionStatusSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface TransactionDetailsPageProps {
  params: Promise<{ transaction_id: string }>;
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const { transaction_id } = await params;
  // Redirect 404 if invalid transaction_id
  if (!transaction_id || transaction_id.length < 21) {
    return notFound();
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/${transaction_id}`);
  }

  // --- Get User Data from Session Token
  setSessionToken(sessionToken);
  const userSession = (await trpc.auth.checkSession()).user;

  // --- Get Data Transaction Details
  let transactionDetailsDataRaw;
  try {
    transactionDetailsDataRaw = await trpc.read.transaction({
      id: transaction_id,
    });
  } catch (err) {
    return notFound();
  }
  const transactionDetailsData = transactionDetailsDataRaw.transaction;

  return (
    <TransactionStatusSVP
      transactionId={transaction_id}
      transactionStatus={transactionDetailsData.status}
      invoiceNumber={transactionDetailsData.invoice_number}
      invoiceURL={transactionDetailsData.invoice_url}
      productPrice={transactionDetailsData.product_price.toNumber()}
      productAdminFee={transactionDetailsData.product_admin_fee.toNumber()}
      productVAT={transactionDetailsData.product_vat.toNumber()}
      productTotalAmount={transactionDetailsData.product_total_amount.toNumber()}
      cohortId={transactionDetailsData.cohort_id}
      cohortName={transactionDetailsData.cohort_name}
      cohortImage={transactionDetailsData.cohort_image}
      cohortSlug={transactionDetailsData.cohort_slug}
      cohortPriceName={transactionDetailsData.cohort_price_name}
      paymentChannelName={transactionDetailsData.payment_channel_name}
      paymentChannelImage={transactionDetailsData.payment_channel_image}
      userName={transactionDetailsData.user_full_name}
      createTransactionAt={transactionDetailsData.created_at.toISOString()}
      paidTransactionAt={transactionDetailsData.paid_at?.toISOString()}
    />
  );
}
