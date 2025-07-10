interface CohortDetailsPageProps {
  params: Promise<{ cohort_name: string; cohort_id: number }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailsPageProps) {
  const { cohort_name, cohort_id } = await params;

  return <div className="w-full h-[700px]">Wanna learn {cohort_name}</div>;
}
