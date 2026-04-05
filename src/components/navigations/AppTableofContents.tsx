"use client";
import Link from "next/link";

interface TableofContentsItem {
  name: string;
  url: string;
}

interface AppTableofContentsProps {
  tocName: string;
  tocList: TableofContentsItem[];
}

export default function AppTableofContents({
  tocName,
  tocList,
}: AppTableofContentsProps) {
  return (
    <div className="table-of-contents-container relative flex flex-col p-5 gap-4 font-bodycopy bg-white border rounded-lg">
      <h2 className="font-bold text-primary">{tocName}</h2>
      <ul className="table-of-contents-list flex flex-col gap-2 pl-2">
        {tocList.map((post) => (
          <Link
            href={`#${post.url}`}
            key={post.name}
            className="text-[15px] font-medium"
          >
            {post.name}
          </Link>
        ))}
      </ul>
      <div className="table-of-content-sign absolute left-0 top-4 w-1.5 h-7 bg-primary rounded-r-md" />
    </div>
  );
}
