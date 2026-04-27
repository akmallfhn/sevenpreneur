"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { AiLearnLessonStatus } from "@prisma/client";
import { ChevronLeft, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppLoadingComponents from "../states/AppLoadingComponents";

const LEVELS = [
  { value: 1, label: "L1 — Foundations" },
  { value: 2, label: "L2 — Techniques" },
  { value: 3, label: "L3 — Advanced" },
  { value: 4, label: "L4 — Strategic" },
];

const OPTION_IDS = ["a", "b", "c", "d"];

interface QuizOption { id: string; text: string; }
interface QuizFormState {
  id?: number;
  question: string;
  options: QuizOption[];
  correct_option: string;
  explanation: string;
}

function emptyQuizForm(): QuizFormState {
  return {
    question: "",
    options: OPTION_IDS.map((id) => ({ id, text: "" })),
    correct_option: "a",
    explanation: "",
  };
}

interface EditLessonAileneProps {
  lessonId: number;
}

export default function EditLessonAilene(props: EditLessonAileneProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.ailene.readLesson.useQuery({ id: props.lessonId });
  const lesson = data?.lesson;

  const [form, setForm] = useState<{
    title: string;
    description: string;
    content: string;
    youtube_url: string;
    level: number;
    xp_reward: number;
    status: AiLearnLessonStatus;
  }>({
    title: "",
    description: "",
    content: "",
    youtube_url: "",
    level: 1,
    xp_reward: 10,
    status: AiLearnLessonStatus.DRAFT,
  });

  const [quizForm, setQuizForm] = useState<QuizFormState>(emptyQuizForm());
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [showQuizForm, setShowQuizForm] = useState(false);

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title,
        description: lesson.description ?? "",
        content: lesson.content,
        youtube_url: lesson.youtube_url ?? "",
        level: lesson.level,
        xp_reward: lesson.xp_reward,
        status: lesson.status,
      });
    }
  }, [lesson]);

  const updateMutation = trpc.ailene.updateLesson.useMutation({
    onSuccess: () => {
      toast.success("Materi berhasil diperbarui.");
      utils.ailene.readLesson.invalidate({ id: props.lessonId });
    },
    onError: () => toast.error("Gagal memperbarui."),
  });

  const createQuizMutation = trpc.ailene.createQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Soal ditambahkan.");
      utils.ailene.readLesson.invalidate({ id: props.lessonId });
      setQuizForm(emptyQuizForm());
      setShowQuizForm(false);
    },
    onError: () => toast.error("Gagal menambahkan soal."),
  });

  const updateQuizMutation = trpc.ailene.updateQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Soal diperbarui.");
      utils.ailene.readLesson.invalidate({ id: props.lessonId });
      setEditingQuizId(null);
      setQuizForm(emptyQuizForm());
      setShowQuizForm(false);
    },
    onError: () => toast.error("Gagal memperbarui soal."),
  });

  const deleteQuizMutation = trpc.ailene.deleteQuizQuestion.useMutation({
    onSuccess: () => {
      toast.success("Soal dihapus.");
      utils.ailene.readLesson.invalidate({ id: props.lessonId });
    },
    onError: () => toast.error("Gagal menghapus soal."),
  });

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: props.lessonId, ...form });
  };

  const handleOpenNewQuiz = () => {
    setEditingQuizId(null);
    setQuizForm(emptyQuizForm());
    setShowQuizForm(true);
  };

  const handleEditQuiz = (q: { id: number; question: string; options: unknown; correct_option: string; explanation: string | null }) => {
    setEditingQuizId(q.id);
    setQuizForm({
      id: q.id,
      question: q.question,
      options: q.options as QuizOption[],
      correct_option: q.correct_option,
      explanation: q.explanation ?? "",
    });
    setShowQuizForm(true);
  };

  const handleSaveQuiz = () => {
    const options = quizForm.options.filter((o) => o.text.trim() !== "");
    if (!quizForm.question.trim() || options.length < 2) {
      return toast.warning("Isi pertanyaan dan minimal 2 opsi.");
    }
    if (editingQuizId != null) {
      updateQuizMutation.mutate({
        id: editingQuizId,
        question: quizForm.question,
        options,
        correct_option: quizForm.correct_option,
        explanation: quizForm.explanation || undefined,
      });
    } else {
      createQuizMutation.mutate({
        lesson_id: props.lessonId,
        question: quizForm.question,
        options,
        correct_option: quizForm.correct_option,
        explanation: quizForm.explanation || undefined,
      });
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-sevenpreneur-ash text-sm font-bodycopy focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";
  const labelCls = "font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest";

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-3xl mx-auto w-full flex flex-col gap-8 px-8">
        <Link href="/admin/lessons">
          <AppButton variant="light" size="small">
            <ChevronLeft className="size-3.5" />
            Kelola Materi
          </AppButton>
        </Link>

        {isLoading && <AppLoadingComponents />}

        {!isLoading && lesson && (
          <>
            {/* === LESSON FORM === */}
            <div className="flex flex-col gap-1">
              <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
                Edit Materi
              </h1>
            </div>

            <form onSubmit={handleSaveLesson} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Judul *</label>
                <input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>Deskripsi</label>
                <input
                  className={inputCls}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                  YouTube URL{" "}
                  <span className="normal-case text-emphasis font-normal">(link video YouTube)</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.youtube_url}
                  onChange={(e) => setForm((p) => ({ ...p, youtube_url: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Level</label>
                  <select
                    className={inputCls}
                    value={form.level}
                    onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))}
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>XP Reward</label>
                  <input
                    type="number"
                    className={inputCls}
                    min={1}
                    value={form.xp_reward}
                    onChange={(e) => setForm((p) => ({ ...p, xp_reward: Number(e.target.value) }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls}>Status</label>
                  <select
                    className={inputCls}
                    value={form.status}
                    onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AiLearnLessonStatus }))}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelCls}>
                  Konten{" "}
                  <span className="normal-case text-emphasis font-normal">(Markdown)</span>
                </label>
                <textarea
                  className={`${inputCls} min-h-80 resize-y font-mono text-xs leading-relaxed`}
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                />
              </div>
              <AppButton
                type="submit"
                variant="primary"
                size="medium"
                disabled={updateMutation.isPending}
                className="self-start"
              >
                {updateMutation.isPending && <Loader2 className="animate-spin size-4" />}
                Simpan Perubahan
              </AppButton>
            </form>

            <div className="h-px w-full bg-sevenpreneur-ash" />

            {/* === QUIZ SECTION === */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-base text-sevenpreneur-coal">
                  Soal Quiz ({lesson.quiz_questions.length})
                </h2>
                {!showQuizForm && (
                  <AppButton variant="primarySoft" size="small" onClick={handleOpenNewQuiz}>
                    <Plus className="size-3.5" />
                    Tambah Soal
                  </AppButton>
                )}
              </div>

              {/* Quiz form */}
              {showQuizForm && (
                <div className="flex flex-col gap-4 p-5 rounded-xl border border-primary/30 bg-primary-muted/10">
                  <div className="flex items-center justify-between">
                    <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                      {editingQuizId != null ? "Edit Soal" : "Soal Baru"}
                    </p>
                    <AppButton variant="light" size="mediumIcon" onClick={() => setShowQuizForm(false)}>
                      <X className="size-3.5" />
                    </AppButton>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Pertanyaan *</label>
                    <textarea
                      className={`${inputCls} min-h-20 resize-none`}
                      value={quizForm.question}
                      onChange={(e) => setQuizForm((p) => ({ ...p, question: e.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>Opsi Jawaban *</label>
                    {quizForm.options.map((opt, i) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={quizForm.correct_option === opt.id}
                          onChange={() => setQuizForm((p) => ({ ...p, correct_option: opt.id }))}
                          className="accent-primary"
                        />
                        <span className="font-bodycopy text-xs font-bold text-emphasis w-4 shrink-0">
                          {opt.id.toUpperCase()}.
                        </span>
                        <input
                          className={inputCls}
                          placeholder={`Opsi ${opt.id.toUpperCase()}`}
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...quizForm.options];
                            newOpts[i] = { ...newOpts[i], text: e.target.value };
                            setQuizForm((p) => ({ ...p, options: newOpts }));
                          }}
                        />
                      </div>
                    ))}
                    <p className="font-bodycopy text-xs text-emphasis">
                      Radio di kiri = jawaban benar
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Penjelasan (opsional)</label>
                    <textarea
                      className={`${inputCls} min-h-16 resize-none`}
                      value={quizForm.explanation}
                      onChange={(e) => setQuizForm((p) => ({ ...p, explanation: e.target.value }))}
                    />
                  </div>

                  <AppButton
                    variant="primary"
                    size="medium"
                    onClick={handleSaveQuiz}
                    disabled={createQuizMutation.isPending || updateQuizMutation.isPending}
                    className="self-start"
                  >
                    {(createQuizMutation.isPending || updateQuizMutation.isPending) && (
                      <Loader2 className="animate-spin size-4" />
                    )}
                    Simpan Soal
                  </AppButton>
                </div>
              )}

              {/* Quiz list */}
              {(lesson.quiz_questions as Array<{ id: number; question: string; options: unknown; correct_option: string; explanation: string | null; order_index: number }>).map((q, idx) => (
                <div key={q.id} className="flex flex-col gap-2 p-4 rounded-xl border border-sevenpreneur-ash">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                      <span className="text-primary mr-1">{idx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="flex gap-1 shrink-0">
                      <AppButton
                        variant="light"
                        size="mediumIcon"
                        onClick={() => handleEditQuiz(q)}
                      >
                        <Pencil className="size-3.5" />
                      </AppButton>
                      <AppButton
                        variant="destructiveSoft"
                        size="mediumIcon"
                        onClick={() => deleteQuizMutation.mutate({ id: q.id })}
                        disabled={deleteQuizMutation.isPending}
                      >
                        <Trash2 className="size-3.5" />
                      </AppButton>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(q.options as unknown as QuizOption[]).map((opt) => (
                      <span
                        key={opt.id}
                        className={`font-bodycopy text-xs px-2 py-0.5 rounded-full ${
                          opt.id === q.correct_option
                            ? "bg-success-background text-success-foreground font-semibold"
                            : "bg-section-background text-emphasis"
                        }`}
                      >
                        {opt.id.toUpperCase()}. {opt.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {lesson.quiz_questions.length === 0 && !showQuizForm && (
                <p className="font-bodycopy text-sm text-emphasis text-center py-8 border border-dashed border-sevenpreneur-ash rounded-xl">
                  Belum ada soal quiz. Klik &quot;Tambah Soal&quot; untuk mulai.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
