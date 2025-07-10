interface CheckoutCohortPageProps {
  params: Promise<{ cohort_name: string; cohort_id: number }>;
}

export default async function CheckoutCohortPage({
  params,
}: CheckoutCohortPageProps) {
  const { cohort_name, cohort_id } = await params;

  return <div className="w-full h-[700px]">This is checkout Page</div>;
}
