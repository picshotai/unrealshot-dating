'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DRESS_OPTIONS,
  INTEREST_CHIPS,
  EXCLUSION_CHIPS,
  type InterestId,
} from '@/lib/dating/interests';
import type { StylePref, ExcludableTag } from '@/lib/dating/types';

type Model = {
  id: number;
  name: string | null;
  status: string;
  samples?: { uri: string }[];
};

interface StudioIntakeViewProps {
  models: Model[];
  selectedModelId: number | null;
  onSelectModel: (id: number) => void;
  onSubmit: (params: {
    modelId: number;
    interests: InterestId[];
    dress: StylePref;
    excludeTags: ExcludableTag[];
    hobbyText: string;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
  creditError: string;
  generalError: string;
  showCancel: boolean;
}

export const StudioIntakeView: React.FC<StudioIntakeViewProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  onSubmit,
  onCancel,
  isLoading,
  creditError,
  generalError,
  showCancel,
}) => {
  const [dress, setDress] = useState<StylePref>('casual');
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [excludeTags, setExcludeTags] = useState<ExcludableTag[]>([]);
  const [hobbyText, setHobbyText] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel =
    models.find((m) => m.id === selectedModelId) || models[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleInterest = (id: InterestId) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleExclusion = (id: ExcludableTag) => {
    setExcludeTags((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!selectedModelId) return;
    onSubmit({
      modelId: selectedModelId,
      interests,
      dress,
      excludeTags,
      hobbyText,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header Bar with Integrated Face Model Selector */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          {/* Model Display / Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            {models.length > 1 ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
                    {currentModel?.samples?.[0]?.uri ? (
                      <img
                        src={currentModel.samples[0].uri}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white tracking-tight">
                        {currentModel?.name || 'Select Model'}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                          isModelDropdownOpen ? 'rotate-180 text-white' : ''
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {currentModel?.samples?.length || 0} sample photos · Switch
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Select Face Model ({models.length})
                    </div>
                    {models.map((model) => {
                      const isActive = selectedModelId === model.id;
                      const avatar = model.samples?.[0]?.uri;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            onSelectModel(model.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-zinc-900 text-white font-semibold'
                              : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                <ImageIcon className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs truncate">{model.name || 'Model'}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">
                              {model.samples?.length || 0} samples
                            </p>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Single Model Header Display */
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/80 shrink-0">
                  {currentModel?.samples?.[0]?.uri ? (
                    <img
                      src={currentModel.samples[0].uri}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white tracking-tight">
                      {currentModel?.name || 'Trained Face Model'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {currentModel?.samples?.length || 0} training samples
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Action: Cancel Button */}
          {showCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              Cancel <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Configuration Form Body */}
        <div className="space-y-5">
          {/* 1. Wardrobe Tone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">
                Primary Wardrobe Look
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                Leads ~65% of shots
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DRESS_OPTIONS.map((opt) => {
                const isActive = dress === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDress(opt.id)}
                    className={`p-3 rounded-lg border text-left transition-all active:scale-[0.99] ${
                      isActive
                        ? 'bg-zinc-900 border-white text-white'
                        : 'bg-zinc-950/70 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">
                        {opt.label}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-snug">
                      {opt.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Activities & Lifestyle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">
                Activities & Interests
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {interests.length > 0
                  ? `${interests.length} selected`
                  : 'Select what you do'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_CHIPS.map((chip) => {
                const isActive = interests.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => toggleInterest(chip.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs">{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Exclusions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">
                Leave Out <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXCLUSION_CHIPS.map((chip) => {
                const isActive = excludeTags.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => toggleExclusion(chip.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 active:scale-95 ${
                      isActive
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-zinc-950/80 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    <span className="text-xs grayscale opacity-70">
                      {chip.emoji}
                    </span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Custom Specific Hobbies */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Custom Specific Hobbies{' '}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={hobbyText}
              onChange={(e) => setHobbyText(e.target.value)}
              placeholder="e.g. bouldering, vinyl records, film photography"
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Errors */}
          {creditError && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Insufficient Credits</p>
                <p className="opacity-90 mt-0.5">{creditError}</p>
              </div>
            </div>
          )}

          {generalError && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="opacity-90 mt-0.5">{generalError}</p>
              </div>
            </div>
          )}

          {/* Submit Action Card */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] font-mono text-zinc-500 text-center sm:text-left">
              Includes <span className="text-white font-semibold">100 Photos</span> +{' '}
              <span className="text-accent font-semibold">30 Custom Retakes</span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedModelId}
              className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-semibold text-xs h-10 px-6 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Photoshoot...
                </>
              ) : (
                <>
                  Start 100-Photo Shoot
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
