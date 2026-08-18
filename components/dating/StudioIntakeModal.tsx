'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  Loader2,
  Check,
  Zap,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SHOOT_CREDIT_COST,
  type ExcludableTag,
  type StylePref,
} from '@/lib/dating/types';
import {
  DRESS_OPTIONS,
  EXCLUSION_CHIPS,
  INTEREST_CHIPS,
  type InterestId,
} from '@/lib/dating/interests';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

interface StudioIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: Model[];
  selectedModelId: number | null;
  onSelectModel: (id: number) => void;
  onSubmit: (params: {
    modelId: number;
    interests: InterestId[];
    dress: StylePref;
    excludeTags: ExcludableTag[];
    hobbyText: string;
  }) => Promise<void>;
  isLoading: boolean;
  creditError: string;
  generalError: string;
}

export const StudioIntakeModal: React.FC<StudioIntakeModalProps> = ({
  isOpen,
  onClose,
  models,
  selectedModelId,
  onSelectModel,
  onSubmit,
  isLoading,
  creditError,
  generalError,
}) => {
  const [modelId, setModelId] = useState<number | null>(
    selectedModelId || models[0]?.id || null
  );
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [dress, setDress] = useState<StylePref>('casual');
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>([]);
  const [hobbyText, setHobbyText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelId) return;
    await onSubmit({
      modelId,
      interests,
      dress,
      excludeTags,
      hobbyText,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                New 100-Photo Dating Shoot
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Curate your archetypes, outfit vibes, and activities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Model Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              Select Face Model
            </label>
            {models.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/50 text-center">
                <p className="text-sm text-zinc-300 mb-2">
                  No face models found.
                </p>
                <Link
                  href="/models/create"
                  className="text-xs text-accent underline font-mono"
                >
                  Create your model with 4-6 photos →
                </Link>
              </div>
            ) : (
              <select
                value={modelId ?? ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setModelId(val);
                  onSelectModel(val);
                }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent transition-colors"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || `Model #${m.id}`} ({m.samples?.length || 0} sample photos)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Lead Style Cards */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Which look should we lead with?
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Sets the dominant wardrobe tone (~65%), balanced with the other two looks.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DRESS_OPTIONS.map((option) => {
                const isSelected = dress === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDress(option.id)}
                    className={`text-left rounded-lg border p-3.5 transition-all relative ${
                      isSelected
                        ? 'border-accent bg-accent/10 ring-1 ring-accent'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">
                        {option.label}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-lg bg-accent text-background flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-snug">
                      {option.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Activities & Interests Chips */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              What do you actually do?
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Tap the activities that represent your genuine lifestyle.
            </p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_CHIPS.map((chip) => {
                const isSelected = interests.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() =>
                      setInterests((prev) =>
                        prev.includes(chip.id)
                          ? prev.filter((id) => id !== chip.id)
                          : [...prev, chip.id]
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-md font-semibold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Exclusions */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Anything to leave out? <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              We will completely exclude these themes from your 100 prompts.
            </p>
            <div className="flex flex-wrap gap-2">
              {EXCLUSION_CHIPS.map((chip) => {
                const isExcluded = excludeTags.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() =>
                      setExcludeTags((prev) =>
                        prev.includes(chip.id)
                          ? prev.filter((id) => id !== chip.id)
                          : [...prev, chip.id]
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isExcluded
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                    {isExcluded && <span className="text-[10px] text-rose-400">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Custom Hobbies Text */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
              Custom Specific Hobbies <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={hobbyText}
              onChange={(e) => setHobbyText(e.target.value)}
              placeholder="e.g., bouldering, vinyl collecting, film photography, playing guitar"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Error messages */}
          {generalError && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              [!] {generalError}
            </div>
          )}

          {creditError && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <span>{creditError}</span>{' '}
              <Link href="/buy-credits" className="underline font-semibold text-white ml-1">
                Top up credits →
              </Link>
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>100 photos across 5 archetypes · ~90 min</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !modelId}
              className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-bold px-6 py-5 text-sm rounded-lg shadow-lg transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Starting Photoshoot...
                </>
              ) : (
                `Launch Photoshoot — ${SHOOT_CREDIT_COST} Credits`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
