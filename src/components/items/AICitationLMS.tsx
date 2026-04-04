"use client";
import { Progress } from "@/components/ui/progress";

export interface SourcesArticle {
  source_name: string;
  source_url: string;
  source_publisher: string;
  source_year: number;
}

interface AICitationLMSProps {
  sources: SourcesArticle[];
  confidenceLevel: number;
}

export default function AICitationLMS(props: AICitationLMSProps) {
  let confidenceStatus;
  if (props.confidenceLevel >= 80) {
    confidenceStatus = "High";
  } else if (props.confidenceLevel >= 70) {
    confidenceStatus = "Medium";
  } else {
    confidenceStatus = "Low";
  }

  return (
    <div className="data-confidence flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
      <h3 className="section-title font-bold text-lg font-bodycopy">
        Confidence Index
      </h3>
      <div className="confidence-level flex flex-col gap-2">
        <Progress value={props.confidenceLevel} />
        <p className="confidence-status font-semibold font-bodycopy text-sm">
          {confidenceStatus}
        </p>
      </div>
      <div className="sources-data flex flex-col gap-2 font-bodycopy">
        <p className="font-semibold">Referenced Sources</p>
        {props.sources.map((post, index) => (
          <div className="source-item flex flex-col gap-0.5" key={index}>
            <a
              href={post.source_url}
              className="source-url font-medium text-sm text-primary hover:underline underline-offset-2"
              target="__blank"
              rel="noopener noreferrer"
            >
              {post.source_name}
            </a>
            <p className="source-publisher text-sm text-alternative">
              {`${post.source_publisher} ${post.source_year}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
