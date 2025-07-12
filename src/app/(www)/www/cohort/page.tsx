import { trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function TestPage() {
  const listCohort = await trpc.list.cohorts();

  return (
    <div className="w-full pt-10 pb-20">
      <h2 className="font-bold">List Cohort</h2>
      <div className="flex flex-col gap-5">
        {listCohort.list.map((post, index) => (
          <Link key={index} href={`/cohort/${post.slug_url}/${post.id}`}>
            <h2>{post.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
