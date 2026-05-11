"use client";
import { LeadStatus } from "@/lib/app-types";
import {
  faCheckDouble,
  faFire,
  faMugHot,
  faSnowflake,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Image from "next/image";

const variantStyles: Record<
  LeadStatus,
  {
    icon: IconDefinition;
    badge_color: string;
    label: string;
  }
> = {
  COLD: {
    icon: faSnowflake,
    badge_color: "text-primary-soft-foreground bg-primary-soft-background",
    label: "Cold",
  },
  WARM: {
    icon: faMugHot,
    badge_color: "text-[#FB7A36] bg-[#FDE4D8]",
    label: "Warm",
  },
  HOT: {
    icon: faFire,
    badge_color: "text-[#FED106] bg-destructive",
    label: "Hot",
  },
  CONVERTED: {
    icon: faCheckDouble,
    badge_color: "text-white bg-[#F97316]",
    label: "Converted",
  },
};

export interface CrmLeadCardData {
  id: string;
  full_name: string;
  phone_number: string;
  lead_status: LeadStatus;
  created_at: string;
  user_full_name?: string;
  user_avatar?: string;
  user_email?: string;
}

interface CrmLeadCardCMSProps {
  card: CrmLeadCardData;
  /** Called when user selects "Move to" from the dropdown on the card */
  onMoveTo?: (convId: string, newStatus: LeadStatus) => void;
  /** Called when user starts dragging the card */
  onDragStart?: (convId: string, currentStatus: LeadStatus) => void;
}

const ALL_STATUSES: LeadStatus[] = ["COLD", "WARM", "HOT", "CONVERTED"];

export default function CrmLeadCardCMS(props: CrmLeadCardCMSProps) {
  const { card, onMoveTo, onDragStart } = props;
  const { badge_color, icon } = variantStyles[card.lead_status];

  const displayName = card.user_full_name || card.full_name;

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const formattedDate = (() => {
    const date = dayjs(card.created_at);
    const isToday = date.isSame(dayjs(), "day");
    return isToday
      ? `Today at ${date.format("h:mm A")}`
      : date.format("MMM D, YYYY");
  })();

  const moveTargets = ALL_STATUSES.filter((s) => s !== card.lead_status);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("convId", card.id);
        e.dataTransfer.setData("fromStatus", card.lead_status);
        onDragStart?.(card.id, card.lead_status);
      }}
      className="crm-lead-card flex flex-col gap-2.5 p-3 bg-card-bg border border-dashboard-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-cms-primary/30 transition-colors"
    >
      {/* Header: avatar + name */}
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <div className="aspect-square size-9 rounded-full overflow-hidden">
            {card.user_avatar ? (
              <Image
                className="object-cover w-full h-full"
                src={card.user_avatar}
                alt={displayName}
                width={80}
                height={80}
              />
            ) : (
              <div className="flex w-full h-full items-center justify-center bg-secondary-soft-background text-secondary-soft-foreground dark:bg-sevenpreneur-pink-midgnight dark:text-sevenpreneur-pink-blush">
                <p className="font-bodycopy font-medium text-xs">{initials}</p>
              </div>
            )}
          </div>
          {/* Lead status badge on avatar */}
          <div
            className={`absolute flex bottom-0 -right-1 items-center justify-center ${badge_color} aspect-square size-4 rounded-full overflow-hidden`}
          >
            <FontAwesomeIcon icon={icon} size="2xs" />
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-bodycopy font-semibold text-sm leading-snug line-clamp-1">
            {displayName}
          </p>
          <p className="font-bodycopy text-xs text-emphasis line-clamp-1">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-1">
        {card.user_email && (
          <p className="font-bodycopy text-xs text-emphasis truncate">
            {card.user_email}
          </p>
        )}
        <p className="font-bodycopy text-xs text-emphasis truncate">
          {card.phone_number}
        </p>
      </div>

      {/* Move to fallback dropdown */}
      {onMoveTo && (
        <div onClick={(e) => e.stopPropagation()} onDragStart={(e) => e.stopPropagation()}>
          <select
            className="w-full text-xs font-bodycopy font-medium border border-dashboard-border rounded-md px-2 py-1 bg-card-bg text-emphasis cursor-pointer focus:outline-none focus:ring-1 focus:ring-cms-primary"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onMoveTo(card.id, e.target.value as LeadStatus);
                e.target.value = "";
              }
            }}
          >
            <option value="" disabled>
              Move to…
            </option>
            {moveTargets.map((s) => (
              <option key={s} value={s}>
                {variantStyles[s].label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
