"use client";
import { trpc } from "@/trpc/client";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppLoadingComponents from "../states/AppLoadingComponents";

// Category tabs shown in the modal.
// "Semua" = all; the rest map to Meta template categories.
const CATEGORY_TABS = [
  { label: "Semua", value: "ALL" },
  { label: "Promo", value: "MARKETING" },
  { label: "Registrasi", value: "UTILITY" },
  { label: "Otentikasi", value: "AUTHENTICATION" },
  { label: "Lainnya", value: "OTHER" },
] as const;

type CategoryValue = (typeof CATEGORY_TABS)[number]["value"];

interface WATemplateItem {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  components: { type: string; text?: string; format?: string }[];
}

interface WATemplateSenderModalProps {
  isOpen: boolean;
  convId: string;
  onClose: () => void;
  /** Called after the template is successfully sent */
  onSent?: () => void;
}

export default function WATemplateSenderModal({
  isOpen,
  convId,
  onClose,
  onSent,
}: WATemplateSenderModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("ALL");

  const utils = trpc.useUtils();
  const sendTemplate = trpc.send.wa.template.useMutation();

  // Fetch the approved templates from the WABA
  const { data, isLoading, isError, refetch } = trpc.send.wa.listTemplates.useQuery(
    undefined,
    { enabled: isOpen }
  );

  // Block body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset state on close
  const handleClose = () => {
    setSearchQuery("");
    setActiveCategory("ALL");
    onClose();
  };

  // Filter templates by category + search
  const filteredTemplates = useMemo<WATemplateItem[]>(() => {
    const templates: WATemplateItem[] = data?.templates ?? [];
    return templates.filter((tpl) => {
      const matchesCategory =
        activeCategory === "ALL" ||
        (activeCategory === "OTHER"
          ? !["MARKETING", "UTILITY", "AUTHENTICATION"].includes(tpl.category)
          : tpl.category === activeCategory);
      const matchesSearch =
        !searchQuery.trim() ||
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data?.templates, activeCategory, searchQuery]);

  const handleSelectTemplate = (templateName: string) => {
    if (sendTemplate.isPending) return;

    sendTemplate.mutate(
      { conv_id: convId, template_name: templateName },
      {
        onSuccess: () => {
          toast.success("Template berhasil dikirim");
          utils.list.wa.chats.invalidate({ conv_id: convId });
          handleClose();
          onSent?.();
        },
        onError: (err) => {
          toast.error(err.message ?? "Gagal mengirim template");
        },
      }
    );
  };

  // Get the human-readable body text from a template's components
  const getTemplateBody = (tpl: WATemplateItem): string => {
    const body = tpl.components.find((c) => c.type === "BODY");
    return body?.text ?? "";
  };

  // Map Meta category to a display-friendly badge label
  const getCategoryLabel = (category: string): string => {
    const map: Record<string, string> = {
      MARKETING: "Promo",
      UTILITY: "Registrasi",
      AUTHENTICATION: "Otentikasi",
    };
    return map[category] ?? "Lainnya";
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-root fixed inset-0 flex w-full h-full items-center justify-center bg-black/65 z-[999]"
      onClick={handleClose}
    >
      <div
        className="modal-container fixed flex flex-col bg-white dark:bg-card-bg w-full max-w-lg max-h-[85vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dashboard-border shrink-0">
          <h2 className="font-bodycopy font-bold text-sm dark:text-sevenpreneur-white">
            Kirim WhatsApp Template
          </h2>
          <AppButton size="icon" variant="ghost" type="button" onClick={handleClose}>
            <X className="size-5" />
          </AppButton>
        </div>

        {/* Search bar */}
        <div className="px-4 py-3 border-b border-dashboard-border shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-emphasis pointer-events-none" />
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm font-bodycopy font-medium bg-white dark:bg-sevenpreneur-surface-black dark:text-sevenpreneur-white border border-dashboard-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-dashboard-border shrink-0 overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveCategory(tab.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bodycopy font-semibold transition-colors ${
                activeCategory === tab.value
                  ? "bg-primary text-white"
                  : "bg-surface-black/10 dark:bg-white/10 text-emphasis hover:bg-surface-black/20 dark:hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Template list */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-10">
              <AppLoadingComponents />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 py-10">
              <p className="text-sm font-bodycopy text-emphasis text-center">
                Gagal memuat daftar template.
              </p>
              <AppButton
                type="button"
                size="small"
                variant="secondary"
                onClick={() => refetch()}
              >
                Coba lagi
              </AppButton>
            </div>
          )}

          {!isLoading && !isError && filteredTemplates.length === 0 && (
            <p className="text-sm font-bodycopy text-emphasis text-center py-10 px-5">
              {searchQuery
                ? `Tidak ada template yang cocok dengan "${searchQuery}".`
                : "Belum ada template yang tersedia di kategori ini."}
            </p>
          )}

          {!isLoading && !isError && filteredTemplates.length > 0 && (
            <div className="divide-y divide-dashboard-border">
              {filteredTemplates.map((tpl) => {
                const bodyText = getTemplateBody(tpl);
                const isSending =
                  sendTemplate.isPending &&
                  sendTemplate.variables?.template_name === tpl.name;

                return (
                  <div
                    key={tpl.id}
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-surface-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bodycopy font-semibold text-sm dark:text-sevenpreneur-white truncate">
                          {tpl.name}
                        </p>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bodycopy font-bold bg-primary/10 text-primary">
                          {getCategoryLabel(tpl.category)}
                        </span>
                      </div>
                      {bodyText && (
                        <p className="text-xs font-bodycopy text-emphasis line-clamp-2 leading-relaxed">
                          {bodyText}
                        </p>
                      )}
                      <p className="text-[10px] font-bodycopy text-tertiary uppercase tracking-wide">
                        {tpl.language}
                      </p>
                    </div>

                    <AppButton
                      type="button"
                      size="small"
                      variant="primary"
                      disabled={sendTemplate.isPending}
                      onClick={() => handleSelectTemplate(tpl.name)}
                      className="shrink-0"
                    >
                      {isSending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Pilih"
                      )}
                    </AppButton>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error banner */}
        {sendTemplate.isError && (
          <div className="px-5 py-3 bg-destructive/10 border-t border-destructive/20 shrink-0">
            <p className="text-xs font-bodycopy text-destructive text-center">
              {sendTemplate.error?.message ?? "Gagal mengirim template. Coba lagi."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
