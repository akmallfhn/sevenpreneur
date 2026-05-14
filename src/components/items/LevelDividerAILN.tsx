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
  const unlockMutation = trpc.ailene.unlockLevel.useMutation({
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
        <div className="overflow-hidden rounded-xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={iconUrl}
                alt={`Level ${props.level.level_number}`}
                className="h-14 w-14 shrink-0"
                width={300}
                height={300}
              />
              <div>
                <div className="text-sm font-bold text-red-500">
                  Level {props.level.level_number} Unlocked!
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {props.level.name}
                </div>
                <div className="text-sm text-gray-500">
                  Minimum {props.level.min_xp.toLocaleString()} XP required
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <div>
                <div className="text-sm font-bold text-red-500">Congrats!</div>
                <div className="text-sm text-gray-600">
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
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={iconUrl}
              alt={`Level ${props.level.level_number} locked`}
              className="h-14 w-14 shrink-0"
              width={300}
              height={300}
            />
            <div>
              <div className="text-xs text-gray-500">
                Level {props.level.level_number} Locked
              </div>
              <div className="text-xl font-bold text-gray-900">
                {props.level.name}
              </div>
              <div className="text-sm text-gray-500">
                Minimum {props.level.min_xp.toLocaleString()} XP required to
                unlock
              </div>
            </div>
          </div>
          {props.claimable ? (
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-bold text-red-500">
                  Ready to unlock!
                </div>
                <div className="text-sm text-gray-600">
                  You&apos;ve earned enough XP
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
                <div className="text-sm font-bold text-gray-700">
                  Keep going!
                </div>
                <div className="text-sm text-gray-500">
                  Earn more XP to unlock
                </div>
              </div>
              <FontAwesomeIcon
                icon={faLock}
                className="h-6 w-6 text-gray-700"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
