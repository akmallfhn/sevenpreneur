"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faArrowUpRightFromSquare,
  faCalendarDay,
  faCircleCheck,
  faClock,
  faFilePdf,
  faListUl,
  faPenRuler,
  faStar,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { marked } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ailene-prose.module.css";

dayjs.locale("id");
marked.setOptions({ gfm: true, breaks: false });

interface MaterialDetailsAILNProps {
  sessionToken: string;
  materialId: string;
}

interface TocEntry {
  id: string;
  level: number;
  text: string;
}

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function renderArticle(markdown: string): { html: string; toc: TocEntry[] } {
  const rawHtml = marked.parse(markdown) as string;
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();

  const html = rawHtml.replace(
    /<h([1-3])>([\s\S]*?)<\/h\1>/g,
    (_match, levelStr: string, inner: string) => {
      const level = Number(levelStr);
      const plain = decodeEntities(inner.replace(/<[^>]+>/g, "")).trim();
      let id = slugify(plain) || `heading-${toc.length + 1}`;
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;
      toc.push({ id, level, text: plain });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html, toc };
}

function estimateReadMinutes(content: string | null | undefined) {
  if (!content) return null;
  const text = content.replace(/[#*_`>\-\[\]()]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  const min = Math.max(1, Math.ceil(words / 220));
  const max = Math.max(min + 1, Math.ceil(words / 160));
  return { min, max };
}

function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const clean = url.split("?")[0].toLowerCase();
    return clean.endsWith(".pdf");
  } catch {
    return false;
  }
}

export default function MaterialDetailsAILN({
  sessionToken,
  materialId,
}: MaterialDetailsAILNProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.ailene.read.materialDetail.useQuery(
    {
      material_id: materialId,
    }
  );

  const markMutation = trpc.ailene.completeMaterial.useMutation({
    onSuccess: () => {
      utils.auth.checkAilMember.invalidate();
      utils.ailene.read.materialDetail.invalidate({ material_id: materialId });
      utils.ailene.list.tasks.invalidate();
      utils.ailene.list.chapters.invalidate();
      utils.ailene.list.levels.invalidate();
      utils.ailene.read.todayFocus.invalidate();
    },
  });

  const material = data?.material;
  const completed = data?.completed ?? false;
  const fileUrl = material?.file_url ?? null;
  const isPdf = isPdfUrl(fileUrl);

  const triggeredRef = useRef(false);
  useEffect(() => {
    if (!material) return;
    if (completed) return;
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    markMutation.mutate({ material_id: materialId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material, completed, materialId]);

  const { html: renderedContent, toc } = useMemo(() => {
    if (!material?.content) return { html: "", toc: [] as TocEntry[] };
    return renderArticle(material.content);
  }, [material]);

  const readTime = useMemo(
    () => estimateReadMinutes(material?.content),
    [material?.content]
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (toc.length === 0) return;
    const headingEls = toc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => !!el);
    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 1] }
    );
    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc, renderedContent]);

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

  const publishedAt = material.created_at
    ? dayjs(material.created_at).format("D MMMM YYYY")
    : null;
  const updatedAt = material.updated_at
    ? dayjs(material.updated_at).format("D MMMM YYYY")
    : null;

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6 py-4">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold leading-tight text-sevenpreneur-coal dark:text-white">
            {material.title}
          </h1>
          {material.description && (
            <p className="text-base text-gray-600 dark:text-gray-400">
              {material.description}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
              <FontAwesomeIcon
                icon={faPenRuler}
                className="h-3 w-3 text-red-500"
              />
              <span className="font-medium">Materi</span>
            </span>

            {readTime && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faClock}
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                />
                <span className="font-medium">
                  {readTime.min}–{readTime.max} menit baca
                </span>
              </span>
            )}

            {publishedAt && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faCalendarDay}
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                />
                <span className="font-medium">Terbit: {publishedAt}</span>
              </span>
            )}

            {material.chapter?.name && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
                <FontAwesomeIcon
                  icon={faTag}
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                />
                <span className="font-medium">{material.chapter.name}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
              <FontAwesomeIcon
                icon={faStar}
                className="h-3 w-3 text-yellow-500"
              />
              <span className="font-semibold">+{material.xp_reward} XP</span>
            </span>

            {completed && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-green-300 bg-green-50 px-2 py-1 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
                <span className="font-semibold">Selesai</span>
              </span>
            )}
          </div>
        </div>

        {/* Body — main + sticky sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main content */}
          <div className="flex flex-col gap-6 min-w-0">
            {fileUrl && (
              <div className="overflow-hidden rounded-xl border border-dashboard-border bg-white dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
                <div className="flex items-center justify-between gap-3 border-b border-dashboard-border px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-sevenpreneur-coal dark:text-white">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="h-4 w-4 text-red-500"
                    />
                    <span>Materi Pendukung {isPdf ? "(PDF)" : "(File)"}</span>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:underline"
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="h-3 w-3"
                    />
                    Buka di tab baru
                  </a>
                </div>
                {isPdf ? (
                  <iframe
                    src={`${fileUrl}#view=FitH&toolbar=0&navpanes=0`}
                    title={material.title}
                    className="h-[640px] w-full bg-[#1e1f24]"
                  />
                ) : (
                  <div className="px-4 py-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Materi ini berupa file. Buka di tab baru untuk melihat.
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
                )}
                <div className="border-t border-dashboard-border bg-gray-50 px-4 py-2 text-sm text-gray-500 dark:bg-card-inside-bg dark:text-gray-400">
                  Tips: Gunakan tombol di atas viewer untuk memperbesar,
                  mengunduh, atau membuka PDF di tab baru.
                </div>
              </div>
            )}

            {renderedContent ? (
              <article
                className={styles.prose}
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            ) : (
              !fileUrl && (
                <div className="rounded-xl border border-dashed border-dashboard-border bg-white px-4 py-8 text-center text-sm text-gray-500 dark:bg-card-bg dark:text-gray-400">
                  Materi ini belum memiliki konten artikel.
                </div>
              )
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 flex flex-col gap-4">
              {toc.length > 0 && (
                <div className="rounded-xl border border-dashboard-border bg-white p-4 dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sevenpreneur-coal dark:text-white">
                    <FontAwesomeIcon
                      icon={faListUl}
                      className="h-3.5 w-3.5 text-red-500"
                    />
                    <span>Daftar Isi</span>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {toc.map((entry) => {
                      const isActive = activeId === entry.id;
                      return (
                        <a
                          key={entry.id}
                          href={`#${entry.id}`}
                          className={[
                            "block rounded-md px-2.5 py-1.5 text-sm leading-relaxed transition-colors",
                            entry.level === 1
                              ? "font-semibold"
                              : entry.level === 2
                                ? "font-medium"
                                : "font-normal",
                            entry.level === 3 ? "pl-5" : "pl-2.5",
                            isActive
                              ? "bg-red-500/10 text-red-500 dark:bg-red-500/15 dark:text-red-400"
                              : "text-gray-600 hover:bg-gray-50 hover:text-sevenpreneur-coal dark:text-gray-400 dark:hover:bg-card-inside-bg dark:hover:text-white",
                          ].join(" ")}
                        >
                          {entry.text}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {updatedAt && (
                <div className="rounded-xl border border-dashboard-border bg-white p-4 dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
                  <div className="mb-2 text-sm font-semibold text-sevenpreneur-coal dark:text-white">
                    Di halaman ini
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="h-3 w-3 text-gray-500 dark:text-gray-400"
                    />
                    <span>Terakhir diperbarui: {updatedAt}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageContainerAILN>
  );
}
