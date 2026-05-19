"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import { trpc } from "@/trpc/client";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { toast } from "sonner";

const LOCKED_ICON_URL =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/level_locked.webp";

interface Level {
  id: number;
  level_number: number;
  name: string;
  icon: string | null;
  min_xp: number;
}

interface LevelDividerAILNProps {
  level: Level;
  unlocked: boolean;
  claimable: boolean;
}

export default function LevelDividerAILN(props: LevelDividerAILNProps) {
  const utils = trpc.useUtils();
  const unlockMutation = trpc.ailene.update.unlockLevel.useMutation({
    onSuccess: () => {
      toast.success(`Level ${props.level.level_number} unlocked!`);
      utils.auth.checkAilMember.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to unlock level.");
    },
  });

  const iconUrl = props.unlocked
    ? (props.level.icon ?? LOCKED_ICON_URL)
    : LOCKED_ICON_URL;

  if (props.unlocked) {
    return (
      <div className="relative pl-12">
        <div className="relative overflow-hidden rounded-xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-white p-4 shadow-sm dark:border-red-500/70 dark:bg-gradient-to-r dark:from-red-500/15 dark:via-red-500/5 dark:to-black dark:shadow-[0_0_40px_rgba(239,68,68,0.35),inset_0_0_24px_rgba(239,68,68,0.15)]">
          {/* Neon glitch dot pattern overlay (dark mode only) */}
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-40 dark:block"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(239,68,68,0.35) 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={iconUrl}
                alt={`Level ${props.level.level_number}`}
                className="h-14 w-14 shrink-0 dark:drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                width={300}
                height={300}
              />
              <div>
                <div className="text-sm font-bold text-red-500 dark:text-red-400 dark:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  Level {props.level.level_number} Unlocked!
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {props.level.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6 dark:border-red-500/30">
              <div>
                <div className="text-sm font-bold text-red-500 dark:text-red-400 dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]">
                  Congrats!
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  You&apos;ve unlocked Level {props.level.level_number}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Locked
  return (
    <div className="relative pl-12">
      <div className="rounded-xl bg-white p-4 shadow-sm dark:border dark:border-red-500/15 dark:bg-red-500/[0.03]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={iconUrl}
              alt={`Level ${props.level.level_number} locked`}
              className="h-14 w-14 shrink-0 dark:opacity-50"
              width={300}
              height={300}
            />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Level {props.level.level_number} Locked
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {props.level.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Selesaikan semua quiz dan materi di level sebelumnya untuk
                membuka
              </div>
            </div>
          </div>
          {props.claimable ? (
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-bold text-red-500 dark:text-red-400">
                  Ready to unlock!
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Semua quiz dan materi sudah selesai
                </div>
              </div>
              <ButtonAILN
                variant="primary"
                size="medium"
                onClick={() =>
                  unlockMutation.mutate({ level_id: props.level.id })
                }
                disabled={unlockMutation.isPending}
              >
                {unlockMutation.isPending ? "Unlocking…" : "Unlock Level"}
              </ButtonAILN>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  Keep going!
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Selesaikan semua quiz dan materi di level sebelumnya
                </div>
              </div>
              <FontAwesomeIcon
                icon={faLock}
                className="h-6 w-6 text-gray-700 dark:text-red-500/40"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
