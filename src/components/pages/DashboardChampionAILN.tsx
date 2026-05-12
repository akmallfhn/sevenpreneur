"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faChartLine,
  faClock,
  faTriangleExclamation,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

const statusMeta: Record<
  "on_track" | "at_risk" | "behind",
  { label: string; cls: string }
> = {
  on_track: {
    label: "On Track",
    cls: "bg-green-100 text-green-700",
  },
  at_risk: { label: "At Risk", cls: "bg-yellow-100 text-yellow-700" },
  behind: { label: "Behind", cls: "bg-red-100 text-red-700" },
};

export default function DashboardChampionAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const [groupId, setGroupId] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<
    "" | "on_track" | "at_risk" | "behind"
  >("");
  const [search, setSearch] = useState("");

  const groupsQ = trpc.ailene.champion.listGroups.useQuery();
  const membersQ = trpc.ailene.champion.listMembers.useQuery({
    group_id: groupId,
  });

  if (groupsQ.isLoading || membersQ.isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (groupsQ.error || membersQ.error) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const groups = groupsQ.data?.list ?? [];
  const stats = membersQ.data?.stats ?? {
    total: 0,
    on_track: 0,
    at_risk: 0,
    behind: 0,
  };
  const allMembers = membersQ.data?.list ?? [];

  const filtered = allMembers.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !m.user.full_name.toLowerCase().includes(q) &&
        !m.user.email.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const alerts = allMembers.filter(
    (m) => m.status === "at_risk" || m.status === "behind"
  );

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faUsers} className="mt-1 h-7 w-7 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">Team Overview</h1>
            <p className="text-sm text-gray-500">
              Monitor your team&apos;s learning progress and performance.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={faUsers}
            iconClass="bg-blue-100 text-blue-500"
            label="Total Members"
            value={stats.total}
            sub="Active learners"
          />
          <StatCard
            icon={faChartLine}
            iconClass="bg-green-100 text-green-600"
            label="On Track"
            value={stats.on_track}
            sub={`${pct(stats.on_track, stats.total)}% of team`}
          />
          <StatCard
            icon={faClock}
            iconClass="bg-yellow-100 text-yellow-600"
            label="At Risk"
            value={stats.at_risk}
            sub={`${pct(stats.at_risk, stats.total)}% of team`}
          />
          <StatCard
            icon={faTriangleExclamation}
            iconClass="bg-red-100 text-red-500"
            label="Behind"
            value={stats.behind}
            sub={`${pct(stats.behind, stats.total)}% of team`}
          />
        </div>

        {/* Main + sidebar */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          {/* Table */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-base font-bold">Team Members</div>
                <input
                  type="text"
                  placeholder="Search member…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-2 w-64 rounded-lg border px-3 py-1.5 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                {groups.length > 0 && (
                  <select
                    value={groupId ?? ""}
                    onChange={(e) =>
                      setGroupId(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="rounded-lg border px-3 py-1.5 text-sm"
                  >
                    <option value="">All Groups</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as typeof statusFilter)
                  }
                  className="rounded-lg border px-3 py-1.5 text-sm"
                >
                  <option value="">Filter Status</option>
                  <option value="on_track">On Track</option>
                  <option value="at_risk">At Risk</option>
                  <option value="behind">Behind</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-2 py-2 font-medium">Member</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 font-medium">Level</th>
                    <th className="px-2 py-2 font-medium">Progress</th>
                    <th className="px-2 py-2 font-medium">Current Chapter</th>
                    <th className="px-2 py-2 font-medium">XP Earned</th>
                    <th className="px-2 py-2 font-medium">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m) => (
                      <tr
                        key={m.member_id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            {m.user.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.user.avatar}
                                alt={m.user.full_name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200" />
                            )}
                            <div>
                              <div className="font-semibold">
                                {m.user.full_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {m.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${statusMeta[m.status].cls}`}
                          >
                            {statusMeta[m.status].label}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-1.5">
                            {m.current_level.icon && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.current_level.icon}
                                alt={m.current_level.name}
                                className="h-5 w-5"
                              />
                            )}
                            <span className="text-xs font-medium">
                              Level {m.current_level.level_number}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-9 text-xs">
                              {m.progress_percent}%
                            </span>
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${m.progress_percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-xs">
                          {m.current_chapter?.name ?? (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-2 py-3 font-semibold">
                          {m.total_xp.toLocaleString()} XP
                        </td>
                        <td className="px-2 py-3 text-xs text-gray-500">
                          {m.last_active_at
                            ? dayjs(m.last_active_at).fromNow()
                            : "Never"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coaching Alerts sidebar */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-3 text-base font-bold">Coaching Alerts</div>
            {alerts.length === 0 ? (
              <div className="text-sm text-gray-400">
                No alerts. Everyone&apos;s on track 🎉
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 5).map((m) => (
                  <div
                    key={m.member_id}
                    className="rounded-lg border bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      {m.user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.user.avatar}
                          alt={m.user.full_name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {m.user.full_name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusMeta[m.status].cls}`}
                          >
                            {statusMeta[m.status].label}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {m.last_active_at
                            ? `Last active ${dayjs(m.last_active_at).fromNow()}`
                            : "Never active"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}

function StatCard(props: {
  icon: typeof faUsers;
  iconClass: string;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${props.iconClass}`}
      >
        <FontAwesomeIcon icon={props.icon} className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{props.label}</div>
        <div className="text-2xl font-bold">{props.value}</div>
        <div className="text-xs text-gray-500">{props.sub}</div>
      </div>
    </div>
  );
}

function pct(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}
