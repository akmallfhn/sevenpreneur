"use client";
import AssignFormChampionAILN from "@/components/forms/AssignFormChampionAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import { setSessionToken, trpc } from "@/trpc/client";
import { BookOpen, Bookmark, Send } from "lucide-react";
import { useEffect, useState } from "react";

type LibraryTab = "PROMPT" | "USE_CASE";

interface CategoryRef {
  id: number;
  name: string;
}
interface LevelRef {
  id: number;
  level_number: number;
  name: string;
}

interface PromptItem {
  id: number;
  name: string;
  scenario: string;
  expected_output: string;
  level: LevelRef;
  categories: CategoryRef[];
}

interface UseCaseItem {
  id: number;
  name: string;
  description: string;
  level: LevelRef;
  categories: CategoryRef[];
}

export default function LibraryChampionAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const [tab, setTab] = useState<LibraryTab>("PROMPT");
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<number | null>(
    null
  );
  const [assignOpen, setAssignOpen] = useState(false);

  const promptQ = trpc.ailene.champion.promptLibrary.useQuery(undefined, {
    enabled: tab === "PROMPT",
  });
  const useCaseQ = trpc.ailene.champion.useCaseLibrary.useQuery(undefined, {
    enabled: tab === "USE_CASE",
  });

  const prompts = (promptQ.data?.list ?? []) as PromptItem[];
  const useCases = (useCaseQ.data?.list ?? []) as UseCaseItem[];

  const selectedPrompt =
    selectedPromptId !== null
      ? prompts.find((p) => p.id === selectedPromptId)
      : prompts[0];
  const selectedUseCase =
    selectedUseCaseId !== null
      ? useCases.find((u) => u.id === selectedUseCaseId)
      : useCases[0];

  const isLoading = tab === "PROMPT" ? promptQ.isLoading : useCaseQ.isLoading;
  const error = tab === "PROMPT" ? promptQ.error : useCaseQ.error;

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Library &amp; Assignment
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola library prompt &amp; use case dan assign ke tim Anda.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-dashboard-border">
          <button
            type="button"
            onClick={() => setTab("PROMPT")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition ${
              tab === "PROMPT"
                ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Prompt Library (L2)
          </button>
          <button
            type="button"
            onClick={() => setTab("USE_CASE")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition ${
              tab === "USE_CASE"
                ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Use Case Library (L3)
          </button>
        </div>

        {error ? (
          <AppErrorComponents />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
            {/* Grid of items */}
            <div className="flex flex-col gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isLoading
                  ? "Memuat…"
                  : `Menampilkan ${tab === "PROMPT" ? prompts.length : useCases.length} item`}
              </div>

              {isLoading ? (
                <LibraryGridSkeleton />
              ) : tab === "PROMPT" ? (
                prompts.length === 0 ? (
                  <EmptyState label="Belum ada prompt di library." />
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                    {prompts.map((p) => (
                      <LibraryCard
                        key={p.id}
                        levelNumber={p.level.level_number}
                        name={p.name}
                        body={p.scenario}
                        categories={p.categories}
                        isSelected={selectedPrompt?.id === p.id}
                        onClick={() => setSelectedPromptId(p.id)}
                      />
                    ))}
                  </div>
                )
              ) : useCases.length === 0 ? (
                <EmptyState label="Belum ada use case di library." />
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {useCases.map((u) => (
                    <LibraryCard
                      key={u.id}
                      levelNumber={u.level.level_number}
                      name={u.name}
                      body={u.description}
                      categories={u.categories}
                      isSelected={selectedUseCase?.id === u.id}
                      onClick={() => setSelectedUseCaseId(u.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Preview panel */}
            <aside className="sticky top-6 self-start rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Preview {tab === "PROMPT" ? "Prompt" : "Use Case"}
              </div>

              {tab === "PROMPT" ? (
                selectedPrompt ? (
                  <>
                    <PreviewBody
                      levelNumber={selectedPrompt.level.level_number}
                      title={selectedPrompt.name}
                      categories={selectedPrompt.categories}
                      sections={[
                        { label: "Skenario", text: selectedPrompt.scenario },
                        {
                          label: "Expected Output",
                          text: selectedPrompt.expected_output,
                        },
                      ]}
                    />
                    <div className="mt-4 border-t border-dashboard-border pt-4">
                      <ButtonAILN
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() => setAssignOpen(true)}
                      >
                        <Send className="size-4" />
                        Assign to Team
                      </ButtonAILN>
                    </div>
                  </>
                ) : (
                  <PreviewEmpty />
                )
              ) : selectedUseCase ? (
                <>
                  <PreviewBody
                    levelNumber={selectedUseCase.level.level_number}
                    title={selectedUseCase.name}
                    categories={selectedUseCase.categories}
                    sections={[
                      {
                        label: "Deskripsi",
                        text: selectedUseCase.description,
                      },
                    ]}
                  />
                  <div className="mt-4 border-t border-dashboard-border pt-4">
                    <ButtonAILN
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => setAssignOpen(true)}
                    >
                      <Send className="size-4" />
                      Assign to Team
                    </ButtonAILN>
                  </div>
                </>
              ) : (
                <PreviewEmpty />
              )}
            </aside>
          </div>
        )}
      </div>

      <AssignFormChampionAILN
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        kind={tab}
        item={
          tab === "PROMPT"
            ? selectedPrompt
              ? { id: selectedPrompt.id, name: selectedPrompt.name }
              : null
            : selectedUseCase
              ? { id: selectedUseCase.id, name: selectedUseCase.name }
              : null
        }
      />
    </PageContainerAILN>
  );
}

function LibraryCard({
  levelNumber,
  name,
  body,
  categories,
  isSelected,
  onClick,
}: {
  levelNumber: number;
  name: string;
  body: string;
  categories: CategoryRef[];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-3 rounded-lg border bg-white p-4 text-left transition hover:border-emerald-400 hover:shadow-sm dark:bg-card-bg ${
        isSelected
          ? "border-emerald-500 ring-1 ring-emerald-500 dark:border-emerald-400 dark:ring-emerald-400"
          : "border-dashboard-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          L{levelNumber}
        </span>
        <Bookmark className="size-4 shrink-0 text-gray-400" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold line-clamp-2 dark:text-white">
          {name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-3 dark:text-gray-400">
          {body}
        </p>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <span
              key={c.id}
              className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function PreviewBody({
  levelNumber,
  title,
  categories,
  sections,
}: {
  levelNumber: number;
  title: string;
  categories: CategoryRef[];
  sections: { label: string; text: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          L{levelNumber}
        </span>
        {categories.map((c) => (
          <span
            key={c.id}
            className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300"
          >
            {c.name}
          </span>
        ))}
      </div>
      <h2 className="text-base font-bold dark:text-white">{title}</h2>
      {sections.map((s) => (
        <div key={s.label} className="flex flex-col gap-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {s.label}
          </div>
          <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
            {s.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function PreviewEmpty() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center text-gray-400 dark:text-gray-500">
      <BookOpen className="size-8" />
      <div className="text-sm">Pilih item untuk melihat detail</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-dashboard-border py-12 text-center text-gray-500 dark:text-gray-400">
      <BookOpen className="size-6" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

function LibraryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-lg border border-dashboard-border bg-gray-100 dark:bg-card-bg"
        />
      ))}
    </div>
  );
}
