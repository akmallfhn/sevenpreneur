"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faChevronLeft,
  faCircleCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { marked } from "marked";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

marked.setOptions({ gfm: true, breaks: false });

interface MaterialDetailsAILNProps {
  sessionToken: string;
  materialId: string;
}

export default function MaterialDetailsAILN({
  sessionToken,
  materialId,
}: MaterialDetailsAILNProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const utils = trpc.useUtils();
  const { data, isLoading, isError } =
    trpc.ailene.read.materialDetail.useQuery({
      material_id: materialId,
    });

  const markMutation = trpc.ailene.completeMaterial.useMutation({
    onSuccess: () => {
      utils.ailene.read.materialDetail.invalidate({ material_id: materialId });
      utils.ailene.list.tasks.invalidate();
      utils.auth.checkAilMember.invalidate();
    },
  });

  const material = data?.material;
  const completed = data?.completed ?? false;
  const fileUrl = material?.file_url ?? null;

  // Auto-mark complete when this is a content-only material (no file_url)
  const triggeredRef = useRef(false);
  useEffect(() => {
    if (!material) return;
    if (fileUrl) return; // file-based completion happens at chapter task button
    if (completed) return;
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    markMutation.mutate({ material_id: materialId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material, completed, fileUrl, materialId]);

  const renderedContent = useMemo(() => {
    if (!material?.content) return "";
    return marked.parse(material.content) as string;
  }, [material]);

  if (isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (isError || !material) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const backHref = material.chapter
    ? `/student#chapter-${material.chapter.id}`
    : "/student";

  return (
    <PageContainerAILN>
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 py-4">
        <Link href={backHref}>
          <ButtonAILN size="small">
            <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
            Kembali
          </ButtonAILN>
        </Link>

        {/* Meta pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 text-xs">
            <FontAwesomeIcon
              icon={faStar}
              className="h-3 w-3 text-yellow-500"
            />
            <span className="font-semibold">+{material.xp_reward} XP</span>
          </div>
          {completed && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-green-300 bg-green-50 px-2 py-1 text-xs text-green-700">
              <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
              <span className="font-semibold">Selesai</span>
            </div>
          )}
        </div>

        {/* Title & description */}
        <div>
          <h1 className="text-3xl font-bold leading-tight">{material.title}</h1>
          {material.description && (
            <p className="mt-2 text-base text-gray-600">
              {material.description}
            </p>
          )}
        </div>

        {/* File or content */}
        {fileUrl ? (
          <div className="rounded-xl border border-dashboard-border bg-white p-6">
            <p className="text-sm text-gray-600">
              Materi ini berupa file. Buka di tab baru:
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block"
            >
              <ButtonAILN size="medium">Buka File</ButtonAILN>
            </a>
          </div>
        ) : (
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        )}
      </div>
    </PageContainerAILN>
  );
}
