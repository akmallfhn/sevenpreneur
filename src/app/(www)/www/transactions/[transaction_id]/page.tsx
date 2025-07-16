import TransactionStatusSVP from "@/app/components/templates/TransactionStatusSVP";

interface TransactionDetailsPageProps {
  params: Promise<{ transaction_id: string }>;
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const { transaction_id } = await params;
  const transactionId = parseInt(transaction_id);
  return (
    <div>
      <TransactionStatusSVP />
    </div>
  );
}
