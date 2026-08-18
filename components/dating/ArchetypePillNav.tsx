'use client';

import React from 'react';
import {
  Sparkles,
  Coffee,
  Plane,
  Zap,
  Shirt,
  Grid,
} from 'lucide-react';

export type ArchetypeFilter = 'all' | 'anchor' | 'social' | 'travel' | 'active' | 'street';

interface ArchetypePillNavProps {
  activeTab: ArchetypeFilter;
  onTabChange: (tab: ArchetypeFilter) => void;
  countsByBucket: Record<string, { completed: number; total: number }>;
  totalCompleted: number;
}

const TABS: {
  id: ArchetypeFilter;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  hint: string;
}[] = [
  {
    id: 'all',
    label: 'All Photos',
    shortLabel: 'All',
    icon: Grid,
    hint: 'Your full 100-photo dating suite. Download individual photos or grab the entire ZIP.',
  },
  {
    id: 'anchor',
    label: 'The Anchor Portrait',
    shortLabel: 'Anchor',
    icon: Sparkles,
    hint: 'Trust + facial clarity — lead with one of these. Clear face, warm eye contact, zero clutter.',
  },
  {
    id: 'social',
    label: 'The Social Candid',
    shortLabel: 'Social Candid',
    icon: Coffee,
    hint: 'Approachability + warmth. High-trust candid moments that look naturally snapped by friends.',
  },
  {
    id: 'travel',
    label: 'The Travel Lifestyle',
    shortLabel: 'Travel',
    icon: Plane,
    hint: 'Storytelling + depth. Natural architectural and outdoor scenes without cliché tourist poses.',
  },
  {
    id: 'active',
    label: 'The Active Vitality',
    shortLabel: 'Active',
    icon: Zap,
    hint: 'Momentum + fitness. Real physical energy, dog-walking, trail running, or sports — no gym-mirror selfies.',
  },
  {
    id: 'street',
    label: 'The Casual Streetwear',
    shortLabel: 'Streetwear',
    icon: Shirt,
    hint: 'Effortless style + confidence. Natural daylight city angles with textures, jackets, and clean fits.',
  },
];

export const ArchetypePillNav: React.FC<ArchetypePillNavProps> = ({
  activeTab,
  onTabChange,
  countsByBucket,
  totalCompleted,
}) => {
  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-3.5">
      {/* Horizontal Scrollable Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'all'
              ? totalCompleted
              : countsByBucket[tab.id]?.completed || 0;
          const total =
            tab.id === 'all' ? 100 : countsByBucket[tab.id]?.total || 20;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-black/15 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}/{total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dating Strategy Hint Subtitle */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {currentTabInfo.hint}
        </p>
      </div>
    </div>
  );
};
