'use client';

import React from 'react';
import {
  Sparkles,
  User,
  Activity,
  Compass,
  Layers,
  Grid,
} from 'lucide-react';
import {
  LINEUP_LABELS,
  LINEUP_HINTS,
  LINEUP_ROLES,
  type LineupRole,
} from '@/lib/dating/roles';

/**
 * The role filter over a delivery.
 *
 * This used to be the delivery's *structure* — five role sections, and the grid
 * was built from them. Under shoots the structure is the shoot: one place, one
 * outfit, one light, four frames of it. That hierarchy is the product, and
 * flattening it back into five role sections throws it away. So roles narrow the
 * view instead of defining it.
 */

export type RoleFilter = 'all' | LineupRole;

interface RoleFilterNavProps {
  activeTab: RoleFilter;
  onTabChange: (tab: RoleFilter) => void;
  roleCounts: Record<LineupRole, number>;
  totalCompleted: number;
  shootCount: number;
  expectedShootCount: number;
  expectedTotalPhotos: number;
}

const LINEUP_ICONS: Record<LineupRole, React.ElementType> = {
  opener: Sparkles,
  fullBody: User,
  whatYouDo: Activity,
  outThere: Compass,
  more: Layers,
};

export const RoleFilterNav: React.FC<RoleFilterNavProps> = ({
  activeTab,
  onTabChange,
  roleCounts,
  totalCompleted,
  shootCount,
  expectedShootCount,
  expectedTotalPhotos,
}) => {
  const currentHint =
    activeTab === 'all'
      ? `${shootCount || expectedShootCount} shoots, four frames each — every shoot is a different place, outfit and light.`
      : LINEUP_HINTS[activeTab];

  const pill = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all shrink-0 border select-none active:scale-95 ${
      isActive
        ? 'bg-white text-black border-white shadow-sm font-semibold'
        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
    }`;

  const badge = (isActive: boolean) =>
    `text-[10px] font-mono px-1.5 py-0.5 rounded ${
      isActive ? 'bg-black/10 text-black' : 'bg-zinc-800/80 text-zinc-500'
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar sm:flex-wrap">
        <button onClick={() => onTabChange('all')} className={pill(activeTab === 'all')}>
          <Grid
            className={`w-4 h-4 ${activeTab === 'all' ? 'text-black' : 'text-zinc-400'}`}
            strokeWidth={1.5}
          />
          <span>By shoot</span>
          <span className={badge(activeTab === 'all')}>
            {totalCompleted || expectedTotalPhotos}
          </span>
        </button>

        {LINEUP_ROLES.filter((role) => (roleCounts[role] ?? 0) > 0).map((role) => {
          const Icon = LINEUP_ICONS[role];
          const isActive = activeTab === role;
          const count = roleCounts[role] || 0;

          if (count === 0 && totalCompleted > 0) return null;

          return (
            <button
              key={role}
              onClick={() => onTabChange(role)}
              className={pill(isActive)}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-400'}`}
                strokeWidth={1.5}
              />
              <span>{LINEUP_LABELS[role]}</span>
              <span className={badge(isActive)}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center px-1">
        <p className="text-xs text-zinc-500 font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          {currentHint}
        </p>
      </div>
    </div>
  );
};
