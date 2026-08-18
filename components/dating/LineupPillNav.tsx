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
  type LineupRole,
} from '@/lib/dating/lineup';

export type LineupFilter = 'all' | LineupRole;

interface LineupPillNavProps {
  activeTab: LineupFilter;
  onTabChange: (tab: LineupFilter) => void;
  roleCounts: Record<LineupRole, number>;
  totalCompleted: number;
}

const LINEUP_ICONS: Record<LineupRole, React.ElementType> = {
  opener: Sparkles,
  fullBody: User,
  whatYouDo: Activity,
  outThere: Compass,
  more: Layers,
};

export const LineupPillNav: React.FC<LineupPillNavProps> = ({
  activeTab,
  onTabChange,
  roleCounts,
  totalCompleted,
}) => {
  const currentHint =
    activeTab === 'all'
      ? 'Your full 100-photo dating suite — structured to build a high-converting profile from first opener to lifestyle.'
      : LINEUP_HINTS[activeTab];

  return (
    <div className="space-y-3.5">
      {/* Horizontal Scrollable Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
        {/* All Tab */}
        <button
          onClick={() => onTabChange('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all shrink-0 border select-none active:scale-95 ${
            activeTab === 'all'
              ? 'bg-white text-black border-white shadow-lg font-semibold'
              : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Grid
            className={`w-3.5 h-3.5 ${
              activeTab === 'all' ? 'text-black' : 'text-zinc-400'
            }`}
          />
          <span>All Photos</span>
          <span
            className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
              activeTab === 'all'
                ? 'bg-black/15 text-black'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {totalCompleted}
          </span>
        </button>

        {/* Lineup Role Tabs */}
        {(
          ['opener', 'fullBody', 'whatYouDo', 'outThere', 'more'] as LineupRole[]
        ).map((role) => {
          const Icon = LINEUP_ICONS[role];
          const isActive = activeTab === role;
          const count = roleCounts[role] || 0;

          if (count === 0 && totalCompleted > 0) return null;

          return (
            <button
              key={role}
              onClick={() => onTabChange(role)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all shrink-0 border select-none active:scale-95 ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg font-semibold'
                  : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-black' : 'text-zinc-400'
                }`}
              />
              <span>{LINEUP_LABELS[role]}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-black/15 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dating Strategy Hint */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {currentHint}
        </p>
      </div>
    </div>
  );
};
